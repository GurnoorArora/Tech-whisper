const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const nodeCron = require("node-cron");

const { buildDigest } = require("./services/digestBuillder.js");
const { sendWhatsAppMessage } = require("./services/sendWhatsappMessage.js");
const { cleanupOldData } = require("./services/dbFlush.js");

dotenv.config();

const connectDB = require("./db/db.js");
const { fetchAndStoreTechNews } = require("./services/fetchNews.js");
const { summarizeAllArticles } = require("./services/summarizeAll.js");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//
// 🚀 TEST CRON – Full pipeline every 1 minute
//
nodeCron.schedule("* * * * *", async () => {
  console.log("🌀 Test cron cycle started...");

  try {
    // 1️⃣ Fetch new// s
    const result = await fetchAndStoreTechNews();
    console.log(`📰 Test fetch: inserted ${result.inserted}, skipped ${result.skipped}`);

    // 2️⃣ Summarize
    await summarizeAllArticles();
    console.log("🧠 Test summarization done");

    // 3️⃣ Build digest
    const digest = await buildDigest();
    console.log("📑 Test digest built");

    // 4️⃣ Send digest to WhatsApp
    await sendWhatsAppMessage(digest);
    console.log("📤 Test digest sent to WhatsApp");

    // 5️⃣ Flush DB
    await cleanupOldData();
    console.log("🗑️ DB flushed (test mode)");

  } catch (err) {
    console.error("❌ Test cron cycle failed:", err);
  }

  console.log("✅ Test cron cycle finished\n");
});

//
// Routes for manual debugging
//
app.get("/check", (req, res) => {
  res.send("✅ Test API is working");
});

connectDB()
  .then(() => {
    console.log("✅ Connected to DB");
    app.listen(PORT, () => {
      console.log(`🚀 Test server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });
