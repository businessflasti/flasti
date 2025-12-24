export async function POST(request) {
  try {
    const body = await request.json();
    const { useBalance, balanceDiscount } = body;
    
    // Precio base fijo en el servidor (no confiar en el cliente)
    const BASE_PRICE = 10.00;
    
    // Calcular precio final en el servidor
    let finalPrice = BASE_PRICE;
    if (useBalance && balanceDiscount > 0) {
      // Validar que el descuento no sea mayor al precio base
      const validDiscount = Math.min(parseFloat(balanceDiscount) || 0, BASE_PRICE);
      finalPrice = Math.max(BASE_PRICE - validDiscount, 0);
    }
    
    // Redondear a 2 decimales
    finalPrice = Math.round(finalPrice * 100) / 100;

    const r = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
          ).toString("base64"),
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Acceso completo a Flasti - Microtareas ilimitadas",
            amount: {
              currency_code: "USD",
              value: finalPrice.toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await r.json();
    
    if (!r.ok) {
      console.error("PayPal API error:", data);
      return Response.json({ error: data }, { status: r.status });
    }

    return Response.json({ orderID: data.id, finalPrice });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return Response.json({ error: "Error al crear orden" }, { status: 500 });
  }
}
