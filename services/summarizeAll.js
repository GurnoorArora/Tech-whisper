const Article = require("../models/articles.js");
const Summary = require("../models/summary.js");
const { summarizeArticle } = require("./summarizer.js");

async function summarizeAllArticles() {
  const articles = await Article.find({});

  for (const article of articles) {
    const exists = await Summary.findOne({ articleId: article._id });
  //  if (exists) continue; // skip if already summarized
       console.log(`URL: ${article.url}`);

    try {
      // Now get crispTitle too
      const { crispTitle, summary, sentiment } = await summarizeArticle(article);
      const article_url = article;
      const article_id= article._id;

      await Summary.create({
        articleId: article_id, 
        url: article_url,
        crispTitle,
        summary,
        sentiment
      });

      console.log(`Title: ${crispTitle}`);
      console.log(`Summary: ${summary}`);
      console.log(`Sentiment: ${sentiment}`);
      console.log("-----");
    } catch (err) {
      console.error(`❌ Failed to summarize: ${article.title}`, err);
    }
  }
}

module.exports = { summarizeAllArticles };
