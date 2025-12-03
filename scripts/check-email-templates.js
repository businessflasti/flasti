/**
 * Script para verificar las plantillas de email en Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTemplates() {
  console.log('🔍 Verificando plantillas de email...\n');

  const { data, error } = await supabase
    .from('email_templates')
    .select('template_key, subject, html_content')
    .order('template_key');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No hay plantillas en la base de datos');
    return;
  }

  data.forEach((template, index) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📧 Plantilla ${index + 1}: ${template.template_key}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Asunto: ${template.subject}`);
    console.log(`\nHTML (primeros 500 caracteres):`);
    console.log(template.html_content.substring(0, 500));
    console.log('\n...');
    
    // Verificar si tiene estilos inline
    const hasInlineStyles = template.html_content.includes('style=');
    const hasStyleTag = template.html_content.includes('<style');
    
    console.log(`\n✓ Tiene estilos inline: ${hasInlineStyles ? '✅ Sí' : '❌ No'}`);
    console.log(`✓ Tiene tag <style>: ${hasStyleTag ? '⚠️  Sí (puede no funcionar en Gmail)' : '✅ No'}`);
  });

  console.log(`\n${'='.repeat(60)}\n`);
  console.log(`Total de plantillas: ${data.length}`);
}

checkTemplates().catch(console.error);
