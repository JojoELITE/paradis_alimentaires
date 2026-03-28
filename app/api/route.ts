"use server";

const TOKEN_SECRET =
  process.env.AIRTEL_TOKEN ||
  "302e4c3bd1db8c8f19653ff5993a5e4f51a50eb5d2822e39b2b03dc5a5572e4062dc4b6333daa21cd34925f050c13dc93dbbd0f38523909fed93e4d251a1a1baa2ab20b715eb0c4b2b5f291bd27fab9a8413e8c428a09643aa869b22d7e2f4";

export async function POST(req: Request) {
  try {
    // FIXÉ pour test ou production
    const phone = "076541658"; // numéro de téléphone fixe
    const amount = "1000"; // montant fixe en FCFA

    console.log("🔹 Création du paiement Airtel Money...");
    console.log(`Numéro: ${phone}, Montant: ${amount} FCFA`);

    // Créer le paiement Airtel
    const response = await fetch(
      "https://www.monappliga.tech/paiement/api/v1/nouveau_paiement.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: TOKEN_SECRET,
          phone,
          amount,
        }).toString(),
      }
    );

    const data = await response.json();
    console.log("📤 Réponse API création paiement:", data);

    if (!data.success) {
      console.error("❌ Impossible de créer le paiement");
      return new Response(
        JSON.stringify({ success: false, message: "Impossible de créer le paiement" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const facture = data.facture;
    console.log("✅ Facture créée:", facture);

    // Boucle de vérification du statut (60s max)
    let state = "pending";
    const start = Date.now();
    while (Date.now() - start < 60000) {
      const statusRes = await fetch(
        `https://www.monappliga.tech/paiement/api/v1/verifier_facture.php?facture=${facture}`
      );
      const statusData = await statusRes.json();
      console.log("⏳ Vérification statut:", statusData);

      if (statusData.state === "paid") {
        state = "paid";
        console.log("✅ Paiement confirmé !");
        break;
      } else if (statusData.state === "failed" || statusData.state === "cancelled") {
        state = statusData.state;
        console.log(`❌ Paiement ${state}`);
        break;
      }

      await new Promise((r) => setTimeout(r, 3000)); // attendre 3s
    }

    console.log("🔹 État final du paiement:", state);

    return new Response(JSON.stringify({ success: true, facture, state }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 Erreur serveur:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}