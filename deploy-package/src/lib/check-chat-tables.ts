import { supabase } from './supabase';

/**
 * Verifica si las tablas de chat existen y las crea si no existen
 */
export async function checkAndCreateChatTables() {
  try {
    console.log('Verificando tablas de chat...');
    
    // Verificar si la tabla de conversaciones existe
    const { error: conversationsError } = await supabase
      .from('chat_conversations')
      .select('count(*)', { count: 'exact', head: true });
    
    // Verificar si la tabla de mensajes existe
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .select('count(*)', { count: 'exact', head: true });
    
    // Si alguna de las tablas no existe, crear ambas
    if (conversationsError || messagesError) {
      console.log('Las tablas de chat no existen. Creando tablas...');
      
      // Crear tabla de conversaciones
      await supabase.rpc('create_chat_tables', {});
      
      console.log('Tablas de chat creadas correctamente');
      return true;
    }
    
    console.log('Las tablas de chat ya existen');
    return true;
  } catch (error) {
    console.error('Error al verificar o crear tablas de chat:', error);
    return false;
  }
}

/**
 * Crea una función en Supabase para crear las tablas de chat
 */
export async function createChatTablesFunction() {
  try {
    console.log('Creando función para crear tablas de chat...');
    
    // Crear función para crear tablas
    const { error } = await supabase.rpc('create_function_create_chat_tables', {});
    
    if (error) {
      console.error('Error al crear función para crear tablas de chat:', error);
      return false;
    }
    
    console.log('Función para crear tablas de chat creada correctamente');
    return true;
  } catch (error) {
    console.error('Error al crear función para crear tablas de chat:', error);
    return false;
  }
}
