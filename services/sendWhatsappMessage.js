const axios = require("axios");

async function sendWhatsAppMessage(message) {
  const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  try {
    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: process.env.RECIPIENT_NUMBER,
        type: "text", // ✅ using text (not template) since you already opted-in
        text: { body: message }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Message sent:", res.data);
  } catch (err) {
    console.error("WhatsApp send failed:", err.response?.data || err.message);
  }
}

module.exports = { sendWhatsAppMessage };
