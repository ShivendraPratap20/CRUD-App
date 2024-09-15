
const userEmail = document.getElementById("email").value;
let oldEmail;
const data = {userEmail};
console.log(data.userEmail);
document.getElementById("delBtn").addEventListener("click", ()=>{
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://crud-app-vcjm.onrender.com/deleteData", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <400){
            console.log(`Data deleted successfully`);
            window.location.href = '/';
        }else{
            console.log(`Error deleting data ${xhr.statusText}`);
        }
    };
    xhr.onerror = function(){
        console.log(`Request failed`);
    };
    xhr.send(JSON.stringify(data));
});

document.getElementById("mdyBtn").addEventListener('click', ()=>{
    oldEmail = document.getElementById("email").value;
    const info = document.getElementsByClassName("info");
    for(var i=0;i<info.length;i++){
        info[i].style.display = "none"
    }
    const arr = document.getElementsByTagName("input");
    for(var i=0;i<arr.length;i++){
        arr[i].style.display = "block";
        arr[i].readOnly = false;
        arr[i].focus();
        document.getElementById("savBtn").style.display = "block";
        document.getElementById("mdyBtn").style.display = "none";
        document.getElementById("delBtn").style.display = "none";
        document.getElementById("language-holder").style.display = "none";
        document.getElementById("language-change").style.display = "block";
    }
});
document.getElementById("savBtn").addEventListener("click", ()=>{
    
    document.getElementById("savBtn").style.display = "none";
    document.getElementById("mdyBtn").style.display = "block";
    document.getElementById("delBtn").style.display = "block";
    const arr = document.getElementsByTagName("input");
    for(var i=0;i<arr.length;i++){
        arr[i].readOnly = true;
    }
    const fullName          = document.getElementById("fullName").value;
    const profession        = document.getElementById("profession").value;
    const checkButton       = document.getElementsByName("language");
    const address           = document.getElementById("address").value;
    const phone             = document.getElementById("phone").value;
    const email             = document.getElementById("email").value;
    let language = [];
    for(let check of checkButton){
        if(check.checked) language.push(check.value);
    }
    const updatedData = {oldEmail, fullName, profession, language, address, phone, email};
    console.log(updatedData);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://crud-app-vcjm.onrender.com/updateData", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(updatedData));
    document.getElementById("language-holder").style.display = "block";
    document.getElementById("language-change").style.display = "none";
    window.location.reload();
});
document.getElementById("lgtBtn").addEventListener("click", ()=>{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://crud-app-vcjm.onrender.com/logout", false);
    xhr.send();
    window.location.reload();
});