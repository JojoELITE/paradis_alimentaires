export async function simulatePayment(amount: number, phone: string) {
  try {
    // ⚠️ NE JAMAIS METTRE LE VRAI TOKEN ICI
    const token = "VOTRE_TOKEN_SECRET_FAKE"; // juste pour test local

    // La requête doit être x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("token", token);
    formData.append("amount", amount.toString());
    formData.append("phone", phone);

    const response = await fetch(
      "https://www.monappliga.tech/paiement/api/v1/nouveau_paiement.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    const data = await response.json();
    return data; // { success: true, facture: "123456789" }
  } catch (err) {
    console.error("Erreur paiement test :", err);
    return { success: false };
  }
}