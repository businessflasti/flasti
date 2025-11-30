-- Agregar control de visibilidad para el bloque de bienvenida en dashboard
INSERT INTO element_visibility (page_name, element_key, element_name, is_visible, display_order)
VALUES ('dashboard', 'welcome_bonus', 'Bloque de Bienvenida (Tareas Premium)', true, 1)
ON CONFLICT (page_name, element_key) DO NOTHING;

-- Verificar que se insertó correctamente
SELECT * FROM element_visibility WHERE element_key = 'welcome_bonus';
