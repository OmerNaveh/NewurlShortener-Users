const DataBase = require("./DataBase");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
const dataBaseUse = new DataBase;
const shortid = require('shortid'); //generates random id
const homeUrl = 'https://omerurl.herokuapp.com';
// const homeUrl = 'http://localhost:8080'

app.use(cors());

app.use(express.static(path.join(__dirname,'./dist')));

app.use("/", (req,res, next)=>{ //responsible for rerouting using the short url 
  if(req. _parsedUrl.path === "/" || req. _parsedUrl.path === "/makeUrl" || req. _parsedUrl.path === "/status"){next()}
  else{
    try {
      const requestEnd = (req. _parsedUrl.path);
      const longURL = dataBaseUse.getLongUrlFromStorage(requestEnd);
      const slicedUrl = longURL.slice(1, longURL.length-1)
      res.redirect(slicedUrl);
    } catch (error) {
      res.send(error);
    }
  }
})

app.get("/", (req, res, next) => { //load home page
  res.sendFile(__dirname + "/dist/index.html");
});


app.get("/makeurl", function(req,res){ //responsible for creating short url and adding to DB
  try {
    const longUrl = JSON.stringify(req.headers.longurl);
    const customShort = req.headers.shorturl;
    if(customShort){
      if(dataBaseUse.isDuplicate(customShort)){
        throw "url taken already"
      }
      else{
        dataBaseUse.storeUrlRelation(longUrl, customShort);
        res.send(homeUrl + "/" + customShort)
        return
      }
    }
    
    if(dataBaseUse.isExistLong(longUrl)){
      const existingUrl = dataBaseUse.isExistLong(longUrl)
      res.send(homeUrl + "/" + existingUrl);
    }
    else{
    const shortUrl = shortid.generate();
    dataBaseUse.storeUrlRelation(longUrl, shortUrl);
    res.send(homeUrl + "/" + shortUrl);
    }
  } catch (error) {
    res.send(error)
  }
})

app.get("/status", (req,res)=>{
  try {
    const shortUrl = JSON.stringify(req.headers.shorturl);
    const slicedUrl= (shortUrl.slice(31,shortUrl.length-1));
    const longurl = dataBaseUse.getLongUrlFromStorage(`/${slicedUrl}`);
    const date = dataBaseUse.getDateFromStorage(slicedUrl);
    const counter = dataBaseUse.getCounterFromStorage(slicedUrl);
    const data = {longurl, date , counter};
    res.send(data);
    
  } catch (error) {
    res.send(error)
  }
})

module.exports = app;