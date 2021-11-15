
const path = "https://omerurl.herokuapp.com"
//elements
const userInput = document.getElementById('userInput')
const customUrl = document.getElementById('customUrl')
const inputbtn = document.getElementById('inputbtn')
const urloutput = document.getElementById('urloutput')
const inputsect = document.getElementById('inputsect')
const stats = document.getElementById('stats')
const shortUrlinput = document.getElementById('shortUrlinput')
const showstatsBtn = document.getElementById('showstatsBtn')
const homeBtn = document.getElementById('homeBtn')
const statsBtn = document.getElementById('statsBtn')

//event listener
inputbtn.addEventListener('click', async ()=>{
    try {
        const longUrl = userInput.value;
        const shortUrl = customUrl.value;
        if(!validator.isURL(longUrl)){
            urloutput.textContent = "Please enter a valid URL";
            return;
        }
        const data =  await axios.get(`${path}/makeUrl`, {headers: {longurl: longUrl, shorturl:shortUrl}});
        userInput.value= "";
        urloutput.textContent = data.data;
        stats.style.visibility = 'visible'
    } catch (error) {
        urloutput.textContent = error;
    }
    })

showstatsBtn.addEventListener('click', async()=>{
    try {  
        const shortUrl = shortUrlinput.value;
        const data = await axios.get(`${path}/status`, {headers: {shorturl:shortUrl}});
        if(data.data.longurl === undefined){
            clearStatus();
            throw 'URL Doesnt Exist'};
        clearStatus();
        const longurl = createElement('div', 'status');
        const counter = createElement('div', 'status');
        const date = createElement('div', 'status');
        longurl.textContent = `Original URL: ${data.data.longurl}`;
        counter.textContent = `Times Visited: ${data.data.counter}`;
        date.textContent = `Date Created: ${data.data.date}`;
        stats.append(longurl, counter , date);
    } catch (error) {
        const errormessage = createElement('div', 'status');
        errormessage.textContent = error;
        stats.append(errormessage);
    }
    })
homeBtn.addEventListener('click',()=>{
    inputsect.style.left = '0%';
    stats.style.left = '100%';
    clearStatus();
})
statsBtn.addEventListener('click',()=>{
    inputsect.style.left = '-100%';
    stats.style.left = '0%';
})


//helping functions
function createElement(tag, classname){
    const elem = document.createElement(tag);
    elem.classList.add(classname);
    return elem;
}

function clearStatus(){
    shortUrlinput.value = "";
    const status = document.getElementsByClassName('status');
    let i = status.length-1;
    while(i>=0){ //delete all status elemnts created
        status[i].remove();
        i--;
    }
}