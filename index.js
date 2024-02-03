const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const videosRoutes = require("./routes/videos");

const { API_KEY, PORT, BASE_URL } = process.env;

app.use(cors());
app.use(express.json());
// http://localhost:8083/images/oscar.jpg
// app.use(express.static("public"));

app.use(express.static('public/images'));

//  app.use(express.static(path.join(__dirname, 'public')));

app.use("/register", (req, res) =>{
    return res.status(200).json({api_key : API_KEY})
  });

app.use("/", (req, res, next) => {
    const apiKey = req.query.api_key;
    if(!apiKey) return res.status(401).json({message: "You need an API Key"});
    const isValid = (apiKey == API_KEY);
    if(!isValid) return res.status(401).json({message: "Invalid API Key"});
    next();
  });


  app.use("/", videosRoutes);

  app.listen(PORT, ()=>{
    console.log("app is listening on", PORT)
  })