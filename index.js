const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const nodeCron = require("node-cron");

const connectDB = require("./db/db.js");
const { fetchAndStoreTechNews } = require("./services/fetchNews.js");
const Article = require("./models/articles.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

nodeCron.schedule("0 9,21 * * *", async () => {
  try {
    const result = await fetchAndStoreTechNews();
    console.log(`Cron fetched ${result.length} articles at 9 AM / 9 PM`);
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});

app.get("/fetch-news", async (req, res) => {
  try {
    const result = await fetchAndStoreTechNews();
    res.json({ count: result.length, articles: result });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/check", (req, res) => {
  res.send("API is working");
});

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
