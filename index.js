const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const nodeCron = require("node-cron");
const { buildDigest } = require("./services/digestBuillder.js");
const { sendWhatsAppMessage } = require("./services/sendWhatsappMessage.js");


dotenv.config();

const connectDB = require("./db/db.js");
const { fetchAndStoreTechNews } = require("./services/fetchNews.js");
const { summarizeAllArticles } = require("./services/summarizeAll.js"); // ✅ import once, properly

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// nodeCron.schedule("0 9,21 * * *", async () => {
//   try {
//     const result = await fetchAndStoreTechNews();
//     console.log(`Cron fetched ${result.inserted} new articles at 9 AM / 9 PM`);
//   } catch (error) {
//     console.error("Cron job failed:", error);
//   }
// });

// nodeCron.schedule("30 9,21 * * *", async () => {
//   console.log("⏳ Running summarization job...");
//   await summarizeAllArticles();
// });


app.get("/fetch-news", async (req, res) => {
  try {
    const result = await fetchAndStoreTechNews();
    res.json(result);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/check", (req, res) => {
  res.send("API is working ✅");
});

app.get("/summarize-now", async (req, res) => {
  try {
    await summarizeAllArticles();
    res.send("✅ Summarization complete");
  } catch (error) {
    console.error("❌ Summarization failed:", error);
    res.status(500).send("Summarization failed");
  }
});
app.get("/digest-now", async (req, res) => {
  try {
    const digest = await buildDigest();
    res.send(`<pre>${digest}</pre>`); // shows digest nicely in browser
  } catch (error) {
    console.error("❌ Digest build failed:", error);
    res.status(500).send("Digest build failed");
  }
});
app.get("/send-digest", async (req, res) => {
  try {
    const digest = await buildDigest();
    await sendWhatsAppMessage(digest);
    res.send("Digest sent to WhatsApp!");
  } catch (error) {
    console.error("Failed to send digest:", error);
    res.status(500).send("Failed to send digest");
  }
});



connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
