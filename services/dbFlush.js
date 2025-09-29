const Article = require("./models/articles.js");
const Summary = require("./models/summary.js");

async function cleanupOldData() {
  await Article.deleteMany({});
  await Summary.deleteMany({});
  console.log("🗑️ Old articles & summaries cleared");
}
module.exports = { cleanupOldData };
