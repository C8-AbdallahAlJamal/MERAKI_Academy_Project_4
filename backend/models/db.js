const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("Databse Connected");
    console.log("==========================================")

}).catch((err)=>{
    if(err){
        console.log("Database Not Connected");
    }
})