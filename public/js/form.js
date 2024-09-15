document.getElementById("signUpForm").addEventListener("submit", (event)=>{
    event.preventDefault();
    const fullName          = document.getElementById("fullName").value;
    const email             = document.getElementById("email").value;
    const password          = document.getElementById("password").value;
    const confirmPassword   = document.getElementById("confirmPassword").value;
    const radioButton       = document.getElementsByName("gender");
    const checkButton       = document.getElementsByName("language");
    const profession        = document.getElementById("profession").value;
    const phone             = document.getElementById("phone").value;
    const address           = document.getElementById("address").value;
    const country           = document.getElementById("country").value;
    let gender;
    let language = [];
    for(let radio of radioButton){
        if(radio.checked) gender = radio.value;
    }
    for(let check of checkButton){
        if(check.checked) language.push(check.value);
    }
    const data = {fullName, email, password, confirmPassword, gender, language, profession, phone, address, country};
    for(let x in data) console.log(x = data[x]);

    const xhr = new XMLHttpRequest();
    xhr.open("POST","https://crud-app-vcjm.onrender.com/data", false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function(){
        const respone = JSON.parse(xhr.responseText);
        console.log(respone);
        if(!respone.status) alert(respone["message"]);
        else {
            window.location.reload();
        }
    };
    xhr.send(JSON.stringify(data));
});
document.getElementById("signInForm").addEventListener("submit",(event)=>{
    event.preventDefault();
    const userId                = document.getElementById("userId").value;
    const pass                  = document.getElementById("pass").value;
    const signInCredentials     = {userId, pass};
    console.log(signInCredentials);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', "https://crud-app-vcjm.onrender.com/", false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function(){
        if(xhr.status == 404) document.getElementById("emailError").style.display = "block";
        else if(xhr.status == 401) document.getElementById("passwordError").style.display = "block";
        else window.location.reload();
    }
    xhr.send(JSON.stringify(signInCredentials));
});

const switchButton = document.getElementsByClassName("switch")[0];
const loginContainer = document.getElementsByClassName("loginContainer")[0];
const signUpContainer = document.getElementsByClassName("signUpContainer")[0];
signUpContainer.style.display = "none";

switchButton.addEventListener('click', ()=>{
    switchButton.classList.toggle('switch-active');
    if(signUpContainer.style.display == "none"){
        signUpContainer.style.display = "block";
        loginContainer.style.display = "none"
    }else {
        signUpContainer.style.display = "none"
        loginContainer.style.display = "block";  
    }
});
