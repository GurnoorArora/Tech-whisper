# 🤖 AI Tech News Digest (MVP)

AI Tech News Digest is a GenAI-powered application that **fetches technology news, summarizes it with LLMs, and generates a daily digest**.  
Currently, you can preview the digest in the browser/Postman.  
(WhatsApp delivery comes next 🚀)
deployed-url- https://tech-whisper.onrender.com/check
---

## ✨ Features
- ⏰ **Automated Scheduling**
  - Fetch news twice a day (9 AM, 9 PM)
  - Summarize articles after each fetch
  - Digest available daily

- 📰 **News Aggregation**
  - Fetches technology news from [NewsAPI](https://newsapi.org)  
  - Stores results in MongoDB

- 🧠 **GenAI Summarization**
  - Uses Groq’s **LLaMA 3.3 70B** to generate:
    - Crisp title
    - 2–3 sentence summary
    - Sentiment (Positive/Negative/Neutral)

- 📊 **Digest Builder**
  - Builds a formatted tech digest from top 10 recent summaries

---

## 🛠️ Tech Stack
- **Backend**: Node.js + Express  
- **Database**: MongoDB (Mongoose)  
- **Scheduler**: node-cron  
- **LLM API**: Groq (LLaMA 3.3 70B)  

