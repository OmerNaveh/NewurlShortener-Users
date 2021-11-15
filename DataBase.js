const fs = require("fs");
const {User, Registration} = require('./userSchema');

async function storeUrlRelation(longUrl, shortUrl , userName , password){
    const userData = {
        userName: userName,
        password: password,
        shortUrl: shortUrl,
        longUrl: longUrl,
        date: new Date(),
        counter: 0
    }
   await User.insertMany(userData)
   return
}
async function isDuplicate(shortUrl){
        const data = await User.findOne({shortUrl: shortUrl});
        if(data) return true
        else return false;
}
async function isExistLong(longUrl){
        const data= await User.findOne({longUrl:longUrl});
        if(data) return data.shortUrl;
        else return false;
   
}

async function getLongUrlFromStorage(shortUrl){
   const data =  await User.findOne({shortUrl:shortUrl})
    return data.longUrl
}
async function getDateFromStorage(shortUrl){
    const data =  await User.findOne({shortUrl:shortUrl});
    return data.date;
}
async function getCounterFromStorage(shortUrl){
    const data =  await User.findOne({shortUrl:shortUrl});
    return data.counter;
}
async function updateCounter(shortUrl){
    const data =  await User.updateOne({shortUrl:shortUrl}, {$inc:{counter:1}});
    return;
}

async function isRegistered(userName,password){
    const data = await Registration.findOne({userName:userName});
    if(data && data.password === password) return true;
    return false;
}
async function createRegister(userName, password){
    const data = {userName, password}
    await Registration.insertMany(data);
    return;
}
module.exports = {isRegistered,createRegister, getLongUrlFromStorage, getCounterFromStorage, getDateFromStorage, isExistLong, isDuplicate, storeUrlRelation, updateCounter};