export async function POST() {
  try {
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
              value: "5.90",
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

    return Response.json({ orderID: data.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return Response.json({ error: "Error al crear orden" }, { status: 500 });
  }
}
