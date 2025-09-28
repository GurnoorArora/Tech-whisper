const mongoose=require("mongoose");
require('dotenv').config();
console.log(process.env.DB_MONGO_URI);

const connectDB=async()=>{
    await mongoose.connect(
        process.env.DB_MONGO_URI

    )
}
module.exports=connectDB;