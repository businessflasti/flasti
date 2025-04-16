-- Esquema para el sistema de notificaciones y panel de administración

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('success', 'error', 'info', 'warning')),
    category TEXT NOT NULL CHECK (category IN ('system', 'affiliate', 'payment', 'chat', 'admin')),
    title TEXT,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para la tabla de notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Tabla de solicitudes de retiro
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_details JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para la tabla de solicitudes de retiro
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON public.withdrawal_requests(created_at);

-- Tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para la tabla de mensajes de chat
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_id ON public.chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Tabla de conversaciones de chat
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT,
    status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'archived')),
    last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para la tabla de conversaciones de chat
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_admin_id ON public.chat_conversations(admin_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at ON public.chat_conversations(last_message_at);

-- Tabla de roles de usuario
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar el balance del usuario cuando se aprueba o rechaza un retiro
CREATE OR REPLACE FUNCTION update_user_balance_on_withdrawal_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el estado cambia a rechazado, devolver el monto al balance del usuario
    IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
        UPDATE public.user_profiles
        SET balance = balance + NEW.amount
        WHERE user_id = NEW.user_id;
    END IF;
    
    -- Actualizar el campo updated_at
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el balance cuando cambia el estado de un retiro
DROP TRIGGER IF EXISTS update_balance_on_withdrawal_status_change ON public.withdrawal_requests;
CREATE TRIGGER update_balance_on_withdrawal_status_change
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_user_balance_on_withdrawal_status_change();

-- Función para crear una solicitud de retiro y actualizar el balance
CREATE OR REPLACE FUNCTION create_withdrawal_request(
    p_user_id UUID,
    p_amount DECIMAL(10, 2),
    p_payment_method TEXT,
    p_payment_details JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_current_balance DECIMAL(10, 2);
    v_request_id TEXT;
    v_result JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Usuario no encontrado'
        );
    END IF;
    
    -- Obtener el balance actual del usuario
    SELECT balance INTO v_current_balance
    FROM public.user_profiles
    WHERE user_id = p_user_id;
    
    -- Verificar que el usuario tiene suficiente balance
    IF v_current_balance < p_amount THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Balance insuficiente'
        );
    END IF;
    
    -- Generar ID único para la solicitud
    v_request_id := 'wr_' || to_char(CURRENT_TIMESTAMP, 'YYYYMMDD') || '_' || substr(md5(random()::text), 1, 10);
    
    -- Iniciar transacción
    BEGIN
        -- Reducir el balance del usuario
        UPDATE public.user_profiles
        SET balance = balance - p_amount
        WHERE user_id = p_user_id;
        
        -- Crear la solicitud de retiro
        INSERT INTO public.withdrawal_requests (
            id,
            user_id,
            amount,
            payment_method,
            payment_details,
            status
        ) VALUES (
            v_request_id,
            p_user_id,
            p_amount,
            p_payment_method,
            p_payment_details,
            'pending'
        );
        
        -- Retornar éxito
        v_result := jsonb_build_object(
            'success', true,
            'message', 'Solicitud de retiro creada correctamente',
            'request_id', v_request_id,
            'amount', p_amount,
            'new_balance', v_current_balance - p_amount
        );
        
        RETURN v_result;
    EXCEPTION WHEN OTHERS THEN
        -- En caso de error, revertir cambios
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- Función para aprobar, rechazar o completar una solicitud de retiro
CREATE OR REPLACE FUNCTION update_withdrawal_request_status(
    p_request_id TEXT,
    p_status TEXT,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_amount DECIMAL(10, 2);
    v_current_status TEXT;
    v_result JSONB;
BEGIN
    -- Verificar que la solicitud existe
    SELECT user_id, amount, status INTO v_user_id, v_amount, v_current_status
    FROM public.withdrawal_requests
    WHERE id = p_request_id;
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Solicitud de retiro no encontrada'
        );
    END IF;
    
    -- Verificar que el estado es válido
    IF p_status NOT IN ('approved', 'rejected', 'completed') THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Estado no válido'
        );
    END IF;
    
    -- Verificar que no se está intentando cambiar un estado ya completado o rechazado
    IF v_current_status IN ('completed', 'rejected') THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'No se puede cambiar el estado de una solicitud ya ' || v_current_status
        );
    END IF;
    
    -- Actualizar el estado de la solicitud
    UPDATE public.withdrawal_requests
    SET 
        status = p_status,
        admin_notes = COALESCE(p_admin_notes, admin_notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_request_id;
    
    -- Retornar éxito
    v_result := jsonb_build_object(
        'success', true,
        'message', 'Estado de la solicitud actualizado correctamente',
        'request_id', p_request_id,
        'new_status', p_status
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas del panel de administración
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_total_users INTEGER;
    v_new_users_today INTEGER;
    v_total_sales DECIMAL(10, 2);
    v_sales_today DECIMAL(10, 2);
    v_pending_withdrawals INTEGER;
    v_pending_withdrawal_amount DECIMAL(10, 2);
    v_open_conversations INTEGER;
    v_result JSONB;
BEGIN
    -- Total de usuarios
    SELECT COUNT(*) INTO v_total_users
    FROM auth.users;
    
    -- Nuevos usuarios hoy
    SELECT COUNT(*) INTO v_new_users_today
    FROM auth.users
    WHERE created_at >= CURRENT_DATE;
    
    -- Total de ventas
    SELECT COALESCE(SUM(amount), 0) INTO v_total_sales
    FROM public.sales;
    
    -- Ventas de hoy
    SELECT COALESCE(SUM(amount), 0) INTO v_sales_today
    FROM public.sales
    WHERE created_at >= CURRENT_DATE;
    
    -- Retiros pendientes
    SELECT COUNT(*), COALESCE(SUM(amount), 0) INTO v_pending_withdrawals, v_pending_withdrawal_amount
    FROM public.withdrawal_requests
    WHERE status = 'pending';
    
    -- Conversaciones abiertas
    SELECT COUNT(*) INTO v_open_conversations
    FROM public.chat_conversations
    WHERE status = 'open';
    
    -- Construir resultado
    v_result := jsonb_build_object(
        'total_users', v_total_users,
        'new_users_today', v_new_users_today,
        'total_sales', v_total_sales,
        'sales_today', v_sales_today,
        'pending_withdrawals', v_pending_withdrawals,
        'pending_withdrawal_amount', v_pending_withdrawal_amount,
        'open_conversations', v_open_conversations
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Políticas de seguridad para las tablas

-- Notificaciones: los usuarios solo pueden ver sus propias notificaciones
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_policy ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY notifications_insert_policy ON public.notifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR 
                EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY notifications_update_policy ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Solicitudes de retiro: los usuarios solo pueden ver sus propias solicitudes
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY withdrawal_requests_select_policy ON public.withdrawal_requests
    FOR SELECT
    USING (auth.uid() = user_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY withdrawal_requests_insert_policy ON public.withdrawal_requests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY withdrawal_requests_update_policy ON public.withdrawal_requests
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Mensajes de chat: los usuarios solo pueden ver mensajes de sus conversaciones
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_messages_select_policy ON public.chat_messages
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY chat_messages_insert_policy ON public.chat_messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Conversaciones de chat: los usuarios solo pueden ver sus propias conversaciones
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_conversations_select_policy ON public.chat_conversations
    FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = admin_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY chat_conversations_insert_policy ON public.chat_conversations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_conversations_update_policy ON public.chat_conversations
    FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = admin_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Roles de usuario: solo los super_admin pueden modificar roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_roles_select_policy ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY user_roles_insert_policy ON public.user_roles
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'));

CREATE POLICY user_roles_update_policy ON public.user_roles
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'));
