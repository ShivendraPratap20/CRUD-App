const mong = require("mongoose");
const DB = `mongodb+srv://crudDatabase:jraa80fBEAspTugt@cluster0.oeakm.mongodb.net/mongooseTut?retryWrites=true&w=majority&appName=Cluster0`
const DBlocal = "mongodb://127.0.0.1:27017/mongooseTut";
mong.connect(DB)
.then(()=>{
    console.log(`Database connection established`);
})
.catch((err)=>{
    console.log(`Error occured while connection to database: ${err}`);
});