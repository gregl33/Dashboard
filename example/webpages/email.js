window.emailSetting.addEventListener("click",showSett);
window.emailLabels.addEventListener("blur",showSett);

function showSett(){
var emailStyle = window.emailLabels,width,height;
  if(emailStyle.offsetWidth == 0 || emailStyle.offsetHeight == 0){
    width = "90%";

    emailStyle.focus();
  }else {
    width = "0%";

  }

  emailStyle.style.transition = "all 1s ease-out";
  emailStyle.style.width = width;

  window.emailContainer.style.overflowY = window.emailContainer.style.overflowY == "scroll" ? "hidden":"scroll";
}


var email =[];
function receivedMessageFromServer(e) {
var q = JSON.parse(e.data);
  if(q.singleMail == "True"){
    singleMailOnPage(q);
  }

    if(q.order || q.order ==0){



var emailElemList = document.querySelectorAll(".emails");

  var spanFrom = document.createElement('span');
  spanFrom.className = "from";
  spanFrom.textContent = (findHeaders(q.headers,"From")).split(/[@<]+/)[0];
  if(q.length > 1){
    spanFrom.textContent += " " + q.length;
  }
  emailElemList[q.order].appendChild(spanFrom);


  var spanDate = document.createElement('span');
  spanDate.className = "date";
  spanDate.textContent = getDate(findHeaders(q.headers,"Date"));
  emailElemList[q.order].appendChild(spanDate);


  var spanSub = document.createElement('span');
  spanSub.className = "subject";
  spanSub.textContent = findHeaders(q.headers,"Subject");
  emailElemList[q.order].appendChild(spanSub);



  var emailSnippet = q.snippet
  var spanSnippet = document.createElement('span');
  spanSnippet.id = "snippet";
  spanSnippet.innerHTML = emailSnippet;


  emailElemList[q.order].dataset.id = q.id;
  emailElemList[q.order].appendChild(spanSnippet);
  emailElemList[q.order].addEventListener("click",viewEmail,true);


  if (find(q.labelIds,"UNREAD",2)){
    emailElemList[q.order].style.fontWeight = "bold";
  }else {
    emailElemList[q.order].style.fontWeight = "normal";
  }

}else{

  var spanLa = document.createElement("span");
  var spanLaName = document.createElement("span");
  var spanLaUn = document.createElement("span");

  spanLa.id = q.id;
  spanLa.className = "emailLable";
  spanLa.addEventListener("click",getEmails);


  spanLaName.textContent = q.name;
  spanLaName.className = "emailLableName";

  spanLaUn.textContent = q.messagesUnread;
spanLaUn.className = "emailLableUn";

  spanLa.appendChild(spanLaName);
  if(q.messagesUnread > 0){spanLa.appendChild(spanLaUn);}

  window.emailLabels.appendChild(spanLa);

}

checkLoading();

}
function checkLoading(){

  var emailElemList = document.querySelectorAll(".emails");
  var loaded = [];
  for(var item of emailElemList){
    if(item.childNodes.length > 1){
      loaded.push("T");
    }
  }

  window.loadingEmails.textContent = "loading emails "+(loaded.length/emailElemList.length)*100 +"%";

  if(loaded.length == emailElemList.length){
    window.loadingEmails.style.display = "none";
    window.emailContainer.style.overflowY = "scroll";
  }
}
function getEmails(ev){

  var elem = ev.target;
  while(elem.className != "emailLable"){
    elem = elem.parentNode;
  }
  var emailElemList = document.querySelectorAll(".emails");

  for (var i of emailElemList){
    i.innerHTML = "";
  }
  showSett();
  signInCallback(token,"lableEmail",elem.id);
  window.titleInbox.textContent = elem.childNodes[0].textContent;
}


function viewEmail(ev){
  hideMail();

  var elem = ev.target;
  while(elem.className != "emails"){
    elem = elem.parentNode;
  }


  var xB = window.emailContainer.getBoundingClientRect();




  var top = xB.top,left = xB.right + 20;
  var bounds = document.getElementById("bodyB").getBoundingClientRect();

   if((left+800) > bounds.right){
    left = xB.left - 800 - 20;
  }

    window.viewmail.style.left = left+"px";
    window.viewmail.style.top = top+"px";
    window.viewmail.style.height = window.viewmail.offsetHeight > xB.height ? window.viewmail.offsetHeight +"px" : xB.height  +"px";
    window.viewmail.style.display = "block";


    signInCallback(token,"singleMail",elem.dataset.id);


  }

window.viewMailX.addEventListener("click",hideMail);

function hideMail(){
  window.viewmail.style.display = window.viewmail.style.display == "none" ? "block" : "none";
  clearViewEmail();
}
function clearViewEmail(){
  var emailsHTML = document.querySelectorAll(".mailHTML");
  for(var m of emailsHTML){
    m.remove();
  }
}
function findHeaders(arr,title){

  return arr.filter(function(header) {
    return header.name === title;
  })[0].value;
}
function getDate(dateString){
  var date = new Date(dateString);
  var Days = ["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  var Months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct", "Nov","Dec"];
  var newDate = Days[date.getDay()] + ", " + date.getDate() + " " + Months[date.getMonth()];

  var todaysDate = new Date();


  if((new Date(dateString)).setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
    newDate = date.getHours() +":"+ check(date.getMinutes()) + " " + (date.getHours() < 12 ? "am" : "pm");
  }else if(date.getFullYear() != todaysDate.getFullYear()) {
    newDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  }

  return newDate;
}



  function singleMailOnPage(mail){
    console.log(mail);

    window.singleMailSubject.textContent = findHeaders(mail.messages[0].payload.headers,"Subject");


 for(var message of mail.messages){
   var spanOuter = document.createElement("span");
   spanOuter.className = "mailHTML";
   window.viewmail.appendChild(spanOuter);


   var spanFrom = document.createElement("span");
   spanFrom.className = "from";
   spanFrom.textContent = (findHeaders(message.payload.headers,"From")).split(/[@<]+/)[0];;
   spanOuter.appendChild(spanFrom);

   var spanDate = document.createElement("span");
   spanDate.className = "date";
   spanDate.textContent = getDate(findHeaders(message.payload.headers,"Date"));
   spanOuter.appendChild(spanDate);

    var iframe = document.createElement('iframe');
    //var iframedoc = iframe.contentDocument || iframe.contentWindow.document;


   iframe.id = message.id;
   iframe.className = "emailBody";

   var part = [];
     if(message.payload.parts){
       part = message.payload.parts.filter(function(part) {
       return part.mimeType == 'text/html';
     });
     }else{
       part.push(message.payload);
     }
     if(part[0] != null){
       var html = decodeURIComponent(escape(window.atob(part[0].body.data.replace(/-/g, '+').replace(/_/g, '/'))));
     }
     iframe.srcdoc = html;
     spanOuter.appendChild(iframe);
     spanOuter.addEventListener("click",expand);
     if(document.querySelectorAll(".mailHTML").length > 1){
       spanOuter.style.height = "50px";
     }

 }

}

function expand(ev){
  var elem = ev.target;
  while(elem.className != "mailHTML"){
    elem = elem.parentNode;
  }
  elem.style.height = elem.style.height == "50px" ? null : "50px";


}
