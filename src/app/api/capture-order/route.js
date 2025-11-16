export async function POST(req) {
  try {
    const { orderID } = await req.json();

    const r = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
            ).toString("base64"),
        },
      }
    );

    const data = await r.json();
    
    if (!r.ok) {
      console.error("PayPal capture error:", data);
      return Response.json({ error: data }, { status: r.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return Response.json({ error: "Error al capturar pago" }, { status: 500 });
  }
}
