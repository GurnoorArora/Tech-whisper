const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function summarizeArticle(article) {
  const prompt = `
  Prepare a news digest entry for a tech audience.
  - Provide a crisp 4–6 word title (digest friendly).
  - Provide a descriptive 2–3 sentence summary so the meaning of the news is clear.
  - Classify sentiment as Positive, Negative, or Neutral.

  Title: ${article.title}
  Description: ${article.description || ""}
  Content: ${article.content || ""}

  Respond strictly in JSON with keys: crispTitle, summary, sentiment.
  `;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 256
  });

  let raw = response.choices[0]?.message?.content?.trim() || "";

  try {
    // Sometimes the model wraps JSON in ```json ... ```
    raw = raw.replace(/```json/gi, "").replace(/```/g, "");
    return JSON.parse(raw);
  } catch (err) {
    console.error("⚠️ Failed to parse LLM response:", raw);
    return { 
      crispTitle: article.title?.slice(0, 50) || "Untitled News", 
      summary: "Summary unavailable", 
      sentiment: "Neutral" 
    };
  }
}

module.exports = { summarizeArticle };
