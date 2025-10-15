require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const PORT = process.env.port || 8000;
require('./db/conn.js');
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth.js");
const router = require("./routes/index.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "../templates/views"));

app.use("/", auth, router);

app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
});