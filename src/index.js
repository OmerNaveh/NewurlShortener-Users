
const path = "http://localhost:8080"
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
const signInBtn = document.getElementById('signInBtn')
const signUpBtn = document.getElementById('signUpBtn')

//block page content with login form
pageStart();
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
        clearStatus();
        if(shortUrl){
            const data = await axios.get(`${path}/status`, {headers: {shorturl:shortUrl}});
            if(data.data.longurl === undefined){
                throw 'URL Doesnt Exist'};
            const longurl = createElement('div', 'status');
            const counter = createElement('div', 'status');
            const date = createElement('div', 'status');
            longurl.textContent = `Original URL: ${data.data.longurl}`;
            counter.textContent = `Times Visited: ${data.data.counter}`;
            date.textContent = `Date Created: ${data.data.date}`;
            stats.append(longurl, counter , date);
        } else {throw 'Please Enter Url'}
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
signInBtn.addEventListener('click', async()=>{
    clearForm()
    const form = await createForm('in');
    document.body.append(form)
})
signUpBtn.addEventListener('click', async()=>{
    clearForm()
    const form =  await createForm('up')
    document.body.append(form)
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
async function createForm(purpose){
    const div = createElement('div', 'form');
    const h3 = createElement('h3', 'formTitle');
    h3.textContent = `Sign ${purpose}`;
    const nameInput= createElement('input', 'formInput');
    const passwordInput= createElement('input', 'formInput');
    nameInput.placeholder = 'Enter Name'
    passwordInput.placeholder = 'Enter Password'
    const subFormBtn = createElement('button', 'formBtn');
    subFormBtn.textContent = 'Click To Enter'
    div.append(h3, nameInput,passwordInput,subFormBtn);
    if(purpose === 'in'){
        subFormBtn.addEventListener('click', async()=>{
            const name = nameInput.value;
            const password = passwordInput.value;
            if(!name ||!password){
                const errorMsg= errorHandlerMsg('Must Enter Info');
                div.append(errorMsg)
                return;
            }
            const response = await axios.put(`${path}/signIn`,{userName: name, password});
            if(response.data){
                const errorMsg = errorHandlerMsg("user Doesn't exist, try again!");
                div.append(errorMsg);
                return
            }
            else{
                clearForm();
                signUpBtn.remove();
                const welcomeNav = createElement('span','welcomeNav')
                welcomeNav.textContent = `Welcome ${name}`
                signInBtn.replaceWith(welcomeNav)
            }
        })
    }
    else{
        subFormBtn.addEventListener('click', async()=>{
            const name = nameInput.value;
            const password = passwordInput.value;
            if(!name ||!password){
                const errorMsg= errorHandlerMsg('Must Enter Info');
                div.append(errorMsg)
                return;
            }
            const response = await axios.post(`${path}/signUp`,{userName: name, password});
            if(response.data){ //there was an error - userName Taken
                const errorMsg= errorHandlerMsg('UserName is Taken, Please select a different one');
                div.append(errorMsg)
                return;
            }
            else{
                clearForm()
                const x= await createForm('in');
                document.body.append(x)
            }
        })
    }
    return div;
}
function errorHandlerMsg(msg){
    const elem = createElement('div', 'errMsg');
    if(msg.message){
        elem.textContent = msg.message;
    }
    else{
        elem.textContent = msg;
    }
    return elem;
}
function clearForm(){
    try {
        const elements = document.getElementsByClassName('form')
        elements[0].remove();
        
    } catch (error) {
        return
    }
}
function pageStart(){
    const div = createElement('div', 'form');
    const h1 = createElement('h1', 'blockTitle');
    const h2 = createElement('h2', 'blockTitle');
    h1.textContent = 'Welcome To My URL Shortener'
    h2.textContent = 'To start using the features, please Sign In First'
    div.append(h1,h2)
    document.body.append(div);
}
