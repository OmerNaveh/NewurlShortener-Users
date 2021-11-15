const fs = require("fs");
class DataBase {
    constructor(){}
    storeUrlRelation(longUrl, shortUrl){
        if(shortUrl == undefined){return}      
       fs.readFile("./DB.json", (err, data)=>{
           if(err){
                return(err);
           }
           const fileContent = JSON.parse(data);
           fileContent[shortUrl] = {longUrl: longUrl , date: new Date().toISOString().slice(0, 10).replace('T', ' '), counter: 0};      
           fs.writeFileSync("./DB.json", JSON.stringify(fileContent));
       })
    }
    isDuplicate(shortUrl){
        const data = fs.readFileSync('./DB.json');;
        const fileContent = JSON.parse(data);
        if(fileContent[shortUrl]){
            return true;
        }
        return false;
    }
    isExistLong(longUrl){
        const data = fs.readFileSync('./DB.json');;
        const fileContent = JSON.parse(data);
        for (let shortUrl in fileContent){
            if(fileContent[shortUrl].longUrl == longUrl){
                return shortUrl;
            }
        }
        return false;
    }
    
    getLongUrlFromStorage(shortUrl){
        const data = fs.readFileSync("./DB.json")
        const fileContent = JSON.parse(data);
        const slicedURL = (shortUrl.slice(1));          
        fileContent[slicedURL].counter += 1;
        const toSend = JSON.stringify(fileContent);
        fs.writeFileSync("./DB.json", toSend)
        const LongUrl = fileContent[slicedURL].longUrl;
        return LongUrl;
    }
    getDateFromStorage(shortUrl){
            const data = fs.readFileSync("./DB.json")
            const fileContent = JSON.parse(data);
            return fileContent[shortUrl].date;
            
    }
    getCounterFromStorage(shortUrl){
        const data = fs.readFileSync("./DB.json")
            const fileContent = JSON.parse(data);
            return fileContent[shortUrl].counter;
    }
}
module.exports = DataBase;