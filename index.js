const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const nodeCron = require("node-cron");
const { buildDigest } = require("./services/digestBuillder.js");
const { sendWhatsAppMessage } = require("./services/sendWhatsappMessage.js");
const {cleanupOldData} = require("./services/dbFlush.js");

dotenv.config();

const connectDB = require("./db/db.js");
const { fetchAndStoreTechNews } = require("./services/fetchNews.js");
const { summarizeAllArticles } = require("./services/summarizeAll.js");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//
//  Cron Jobs
//

//  Fetch news twice a day (9 AM & 9 PM IST)
//  9 AM IST = 03:30 UTC, 9 PM IST = 15:30 UTC
nodeCron.schedule("30 3,15 * * *", async () => {
  try {
    const result = await fetchAndStoreTechNews();
    console.log(`Cron fetched: inserted ${result.inserted}, skipped ${result.skipped}`);
  } catch (error) {
    console.error(" Fetch cron job failed:", error);
  }
});

// Summarize articles 30 min later (9:30 AM & 9:30 PM IST)
// -> 04:00 UTC & 16:00 UTC
nodeCron.schedule("0 4,16 * * *", async () => {
  try {
    console.log("⏳ Running summarization job...");
    await summarizeAllArticles();
    console.log("✅ Summarization done.");
  } catch (err) {
    console.error("Summarization cron failed:", err);
  }
});

//  Send digest at 10 PM IST daily
// -> 10 PM IST = 16:30 UTC
nodeCron.schedule("30 16 * * *", async () => {
  try {
    console.log("📤 Building & sending digest...");
    const digest = await buildDigest();
    await sendWhatsAppMessage(digest);

    // Flush DB after digest is sent
    await cleanupOldData();

    console.log("Digest sent + DB flushed at 10 PM IST");
  } catch (err) {
    console.error("Digest cron failed:", err);
  }
});


//
// Routes for manual testing
//
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
  res.send("API is working ");
});

app.get("/summarize-now", async (req, res) => {
  try {
    await summarizeAllArticles();
    res.send(" Summarization complete");
  } catch (error) {
    console.error(" Summarization failed:", error);
    res.status(500).send("Summarization failed");
  }
});

app.get("/digest-now", async (req, res) => {
  try {
    const digest = await buildDigest();
    res.send(`<pre>${digest}</pre>`);
  } catch (error) {
    console.error(" Digest build failed:", error);
    res.status(500).send("Digest build failed");
  }
});

app.get("/send-digest", async (req, res) => {
  try {
    const digest = await buildDigest();
    await sendWhatsAppMessage(digest);
    res.send(" Digest sent to WhatsApp!");
  } catch (error) {
    console.error("Failed to send digest:", error);
    res.status(500).send("Failed to send digest");
  }
});

//
//  DB + Server
//
connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
