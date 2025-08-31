// Script temporal para probar la API de CPA Lead
const CPALEAD_CONFIG = {
  API_KEY: '22ac92e230e74a1ea5152eaa3258fecd',
  BASE_URL: 'https://www.cpalead.com/api',
  ID: '1'
};

async function testCPALeadAPI() {
  try {
    const params = new URLSearchParams({
      id: CPALEAD_CONFIG.ID,
      api_key: CPALEAD_CONFIG.API_KEY,
      format: 'JSON',
      limit: '200',
      offerwall_offers: 'true',
      device: 'user',
      quality: 'high'
    });

    const url = `${CPALEAD_CONFIG.BASE_URL}/offers?${params.toString()}`;
    console.log('🔗 URL de consulta:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Flasti.com/1.0'
      }
    });

    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    
    console.log('📊 Respuesta de CPA Lead:');
    console.log('- Status:', data.status || 'N/A');
    console.log('- Total ofertas:', data.offers ? data.offers.length : 0);
    
    if (data.offers && data.offers.length > 0) {
      // Análisis de países
      const countries = [...new Set(data.offers.map(o => o.country).filter(Boolean))];
      console.log('- Países disponibles:', countries.length, '→', countries.slice(0, 10));
      
      // Análisis de dispositivos
      const devices = [...new Set(data.offers.map(o => o.device).filter(Boolean))];
      console.log('- Dispositivos:', devices);
      
      // Análisis de monedas
      const currencies = [...new Set(data.offers.map(o => o.payout_currency).filter(Boolean))];
      console.log('- Monedas:', currencies);
      
      // Rango de pagos
      const amounts = data.offers.map(o => parseFloat(o.amount || '0')).filter(a => a > 0);
      if (amounts.length > 0) {
        console.log('- Pago mínimo: $' + Math.min(...amounts).toFixed(2));
        console.log('- Pago máximo: $' + Math.max(...amounts).toFixed(2));
        console.log('- Pago promedio: $' + (amounts.reduce((a, b) => a + b, 0) / amounts.length).toFixed(2));
      }
      
      // Muestra de ofertas
      console.log('\n📋 Muestra de ofertas:');
      data.offers.slice(0, 5).forEach((offer, i) => {
        console.log(`${i + 1}. ${offer.title?.substring(0, 50)}... (${offer.country || 'Global'}) - $${offer.amount} ${offer.payout_currency}`);
      });
    } else {
      console.log('⚠️ No se encontraron ofertas');
      console.log('Respuesta completa:', JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCPALeadAPI();