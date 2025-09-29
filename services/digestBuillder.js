const Summary = require("../models/summary.js");

async function buildDigest() {
  const summaries = await Summary.find({})
    .sort({ createdAt: -1 }) // latest first
    .limit(10);

  let digest = `🤖 AI Tech Digest – ${new Date().toDateString()}\n\n`;

  summaries.forEach((s, i) => {
    digest += `${i + 1}️⃣ ${s.crispTitle}\n`;
    digest += `   ${s.summary}\n`;
    digest += `   Sentiment: ${s.sentiment}\n`;
    digest += `   🔗 ${s.url}\n\n`;
  });

  return digest;
}

module.exports = { buildDigest };
