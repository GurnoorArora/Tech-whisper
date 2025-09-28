const axios = require("axios");
const Article = require("../models/articles.js");

const NEWS_URL = "https://newsapi.org/v2/top-headlines";

async function fetchAndStoreTechNews() {
  const params = {
    country: "us",
    category: "technology",
    pageSize: 100, 
    apiKey: process.env.NEWSAPI_KEY
  };

  const { data } = await axios.get(NEWS_URL, { params });
  if (data.status !== "ok") throw new Error("NewsAPI error: " + JSON.stringify(data));

  let inserted = 0, skipped = 0;

  for (const a of data.articles) {
    if (!a.url) { skipped++; continue; }

    const doc = {
      source: a.source || {},
      author: a.author || null,
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
      content: a.content
    };

    try {
      const res = await Article.updateOne(
        { url: doc.url },
        { $setOnInsert: doc },
        { upsert: true }
      );
      if (res.upsertedCount === 1 || res.upsertedId) inserted++;
      else skipped++;
    } catch (err) {
      skipped++;
    }
  }
  return { total: data.articles.length, inserted, skipped };
}

module.exports = { fetchAndStoreTechNews };
