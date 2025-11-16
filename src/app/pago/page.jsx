import PayPalButton from "@/components/checkout/PayPalButton";

export default function Pago() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#0A0A0A", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{ 
        maxWidth: "400px", 
        width: "100%",
        background: "#121212",
        padding: "2rem",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h1 style={{ 
          marginBottom: "1.5rem", 
          textAlign: "center",
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: "600"
        }}>
          Completar pago
        </h1>
        <div style={{
          background: "#202020",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            color: "#fff",
            marginBottom: "0.5rem"
          }}>
            <span>Total</span>
            <span style={{ fontWeight: "bold" }}>$4.90 USD</span>
          </div>
        </div>
        <PayPalButton />
      </div>
    </div>
  );
}
