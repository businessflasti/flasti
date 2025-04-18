// Este script se ejecuta antes de la hidratación de React para eliminar atributos problemáticos
// que pueden ser añadidos por extensiones de navegador y causar errores de hidratación

(function() {
  // Función que se ejecuta inmediatamente cuando el script se carga
  function cleanupHydrationAttributes() {
    // Eliminar atributos problemáticos del body
    const body = document.body;
    if (body) {
      // Lista de atributos que pueden causar problemas de hidratación
      const problematicAttributes = [
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-xstate'
      ];
      
      // Eliminar cada atributo problemático
      problematicAttributes.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
      
      // También buscar y limpiar atributos en elementos específicos que pueden causar problemas
      document.querySelectorAll('[data-reactroot], [data-reactid]').forEach(el => {
        el.removeAttribute('data-reactroot');
        el.removeAttribute('data-reactid');
      });
    }
  }
  
  // Ejecutar la limpieza inmediatamente
  cleanupHydrationAttributes();
  
  // También ejecutar después de que el DOM esté completamente cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupHydrationAttributes);
  }
  
  // Y una vez más después de que todos los recursos estén cargados
  window.addEventListener('load', cleanupHydrationAttributes);
})();
