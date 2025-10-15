const mong = require("mongoose");
const DB = process.env.DB_CON;
mong.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10",{
    serverSelectionTimeoutMS: 60000
})
.then(()=>{
    console.log(`Database connection established`);
})
.catch((err)=>{
    console.log(`Error occured while connection to database: ${err}`);
});