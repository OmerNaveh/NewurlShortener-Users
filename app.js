const {createRegister,isRegistered,getLongUrlFromStorage, getCounterFromStorage, getDateFromStorage, isExistLong, isDuplicate, storeUrlRelation ,updateCounter} = require("./DataBase");
const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;
const shortid = require('shortid'); //generates random id
const homeUrl = 'http://localhost:8080'

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'./src')));

app.use("/", async (req,res, next)=>{ //responsible for rerouting using the short url 
  if(req. _parsedUrl.path === "/" || req. _parsedUrl.path === "/makeUrl" || req. _parsedUrl.path === "/status"){next()}
  else{
    try {
      const requestEnd = (req. _parsedUrl.path).slice(1);
      const longURL = await getLongUrlFromStorage(requestEnd);
      updateCounter(requestEnd);
      res.redirect(longURL);
    } catch (error) {
      res.send(error);
    }
  }
})

app.get("/", (req, res, next) => { //load home page
  res.sendFile(__dirname + "/src/index.html");
});


app.get("/makeurl", async function(req,res){ //responsible for creating short url and adding to DB
  try {
    const longUrl = req.headers.longurl;
    const customShort = req.headers.shorturl;
    if(customShort){
      if(await isDuplicate(customShort)){
        throw "url taken already"
      }
      else{
        storeUrlRelation(longUrl, customShort,"q","q");
        res.send(homeUrl + "/" + customShort)
        return
      }
    }
    if(await isExistLong(longUrl)){
      const existingUrl = await isExistLong(longUrl)
      res.send(homeUrl + "/" + existingUrl);
    }
    else{
    const shortUrl = shortid.generate();
    storeUrlRelation(longUrl, shortUrl,"q","q");
    res.send(homeUrl + "/" + shortUrl);
    }
  } catch (error) {
    res.send(error)
  }
})

app.get("/status", async(req,res)=>{
  try {
    const shortUrl = JSON.stringify(req.headers.shorturl);
    const slicedUrl= (shortUrl.slice(23,shortUrl.length-1)); //remove localhost from url
    const longurl = await getLongUrlFromStorage(slicedUrl);
    const date = await getDateFromStorage(slicedUrl);
    const counter = await getCounterFromStorage(slicedUrl);
    const data = {longurl, date , counter};
    res.send(data);
    
  } catch (error) {
    res.send(error)
  }
})

app.post('/signUp',async(req,res)=>{
  try {
    const {userName,password} = req.body;
    await createRegister(userName,password);
    res.end();
  } catch (error) {
    res.send(error);
  }
})
app.put('/signIn', async (req,res)=>{
    const {userName,password} = req.body;
    const response = await isRegistered(userName,password);
    if(response){
      const token = jwt.sign({data:password},process.env.SECRET, {expiresIn: '600s'})
      res.cookie('token',token,{expires:new Date(2025,1,1)})
      return
    }
    return res.send('failed')
})
module.exports = app;