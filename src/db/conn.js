const mong = require("mongoose");
const DB = process.env.DB_CON;
mong.connect("mongodb+srv://crudDatabase:jraa80fBEAspTugt@cluster0.oeakm.mongodb.net/mongooseTut?retryWrites=true&w=majority&appName=Cluster0",{
    serverSelectionTimeoutMS: 60000
})
.then(()=>{
    console.log(`Database connection established`);
})
.catch((err)=>{
    console.log(`Error occured while connection to database: ${err}`);
});