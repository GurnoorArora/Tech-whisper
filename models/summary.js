const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  url: String,          
  crispTitle: String,   
  summary: String,
  sentiment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Summary", summarySchema);
