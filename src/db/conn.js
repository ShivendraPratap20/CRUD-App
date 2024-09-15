const mong = require("mongoose");
const DB = process.env.DB_CON;
mong.connect(DB,{
    serverSelectionTimeoutMS: 60000
})
.then(()=>{
    console.log(`Database connection established`);
})
.catch((err)=>{
    console.log(`Error occured while connection to database: ${err}`);
});