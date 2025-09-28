const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema({
  source: {
    id: { type: String, default: null },
    name: { type: String }
  },
  author: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, unique: true, required: true }, // use as dedup key
  urlToImage: { type: String },
  publishedAt: { type: Date },
  content: { type: String }
}, { timestamps: true });


module.exports = mongoose.model("Article", ArticleSchema);
