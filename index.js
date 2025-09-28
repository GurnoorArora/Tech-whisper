const express=require("express")
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const article=require("./models/articles.js")
const connectDB=require("./db/db.js");
dotenv.config();
const cors=require("cors");
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT || 5000;

app.get("/check",(req,res)=>{
    res.send("API is working");
}
);

connectDB().then(()=>{
    console.log("Connected to DB");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err)=>{
    console.log(err);
}); 


