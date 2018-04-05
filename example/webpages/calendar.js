
function curentTimeLine(){
  var hour = new Date().getHours();
  var min = new Date().getMinutes();
  var top = (((hour)+(min/60))*50)+2;


  document.getElementById("currTimeTri").style.top = (top-5) +"px";

  document.getElementById("currTimeSpan").style.top = top +"px";

  document.getElementById("conEvent").scrollTop =  top - 100;

}

function hex2rgba_convert(hex,opacity){
 hex = hex.replace('#','');
 r = parseInt(hex.substring(0, hex.length/3), 16);
 g = parseInt(hex.substring(hex.length/3, 2*hex.length/3), 16);
 b = parseInt(hex.substring(2*hex.length/3, 3*hex.length/3), 16);

 result = 'rgba('+r+','+g+','+b+','+opacity+')';
 return result;
}

var curentTimeLineTimer;



function dateRangeOverlaps(a_start,a_end,b_start, b_end) {


    if (a_start <= b_start && b_start < a_end) return true; // b starts in a
    if (a_start < b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
      return false;


}

function multipleDateRangeOverlaps2(start, end,profile){
  var max = [];

  for (var i = 0;i<eventList.length;i++){
if(eventList[i].profileName == profile ){
    var a_start = parseInt(eventList[i].timeFrom,10), a_end=parseInt(eventList[i].timeTo,10);
if(dateRangeOverlaps(a_start,a_end,start, end)){
  max.push(true);
}

}
}
  return max;
}







var clickedDay;
var eventList = [];

var curr = new Date;
var firstday = new Date(curr.setDate((curr.getDate() - curr.getDay())+1));
var lastday = new Date(curr.setDate((curr.getDate() - curr.getDay())+7));
curr=firstday;


window.previousWeek.addEventListener('click',previousWEEK);
window.nextWeek.addEventListener('click',nextWEEK);





function loadEvents(ev) {
  console.log("clicked");
  var e;
  if(ev.target.classList == "pOne" ){
    e = ev.target.parentNode;
  }else{
    e = ev.target;
  }

  e.classList.toggle('displayDay');
  clickedDay.classList.toggle('displayDay');
  clickedDay = e;

  var [day,month,year,dayOfWeek] = e.id.split(/[._]+/);

  var chosenProf = document.querySelectorAll("#profileSelBox input[type='checkbox']:checked");


  for(let prof of chosenProf){
    if(include(prof.name)){
      var url = '/calendar/events?day=' + day + "&month=" + month + "&year="+ year +"&profile="+prof.name;//day+'&month=' + (month_+1) + '&year=' + year_;


      sendR(url,function(res){
        showEVENTS(res,prof.name)
      });
    }else {
      var da = new Date(year,month-1,day);


      signInCallback(token,"events",prof.dataset.id+"_"+da,function(res){
        showEVENTS(res,prof.name)
      });

    }

  }
  if(curentTimeLineTimer == null ){
    curentTimeLineTimer = setInterval(curentTimeLine,1000*60);
  }
}


function include(obj) {
  for(var x of profileList){
    if (x.profileName == obj){
      return true;
    }
  }
    return false;
}


  function previousWEEK(){
    var curr_ = new Date(curr.setDate(curr.getDate()-7));
    var firstdayNEXT = new Date(curr.setDate((curr.getDate() - curr.getDay())+1));
    var lastdayNEXT = new Date(curr.setDate((curr.getDate() - curr.getDay())+7));
    curr = curr_;
    oneWeek(firstdayNEXT,lastdayNEXT,"false");

  }

  function nextWEEK(){

    var curr_ = new Date(curr.setDate(curr.getDate()+7));
    var firstdayNEXT = new Date(curr.setDate((curr.getDate() - curr.getDay())+1));
    var lastdayNEXT = new Date(curr.setDate((curr.getDate() - curr.getDay())+7));
    curr = curr_;
    oneWeek(firstdayNEXT,lastdayNEXT,'true');
  }

  function oneWeek(firstday_,lastday_,neORpr){
    var Months = [" ","January","Febuary","March","April","May","June","July","August","September","October", "November","December"];


  var date = new Date;

    window.ULoneWEEK.textContent="";

    var month_ = firstday_.getMonth()+1,year_=firstday_.getFullYear();
    var lastDayOfMonth = new Date(year_, month_, 0).getDate();



    var weekDay=0;
    var dateOFMonth = firstday_.getDate();
    var shade = "false";

    for(var i = 0; i < 7;i++){


      if(dateOFMonth > lastDayOfMonth){
        dateOFMonth = 1;
        month_++;
        switch (neORpr) {
          case "true":
            ULoneWEEK.childNodes.forEach(function(child){child.style.opacity='0.5';});

          break;

          case "false":
            month_=firstday_.getMonth()+2;
            shade = "true";
          break;
          default:
        }
      }



      var li_days = document.createElement('li');

      window.MonthDivs.textContent = Months[month_]+"  "+year_;

      var shortDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];



      weekDay = weekDay > 6 ? 0 : weekDay;

      var p = document.createElement('p');
      p.textContent = shortDays[weekDay];
      p.className = 'pOne';


      li_days.textContent =dateOFMonth;
      li_days.appendChild(p);
      li_days.addEventListener('click',loadEvents);


      li_days.id = check(dateOFMonth) + '.' + check(month_) + '.' + year_ + '_' + weekDay;

      if(shade=="true"){
        li_days.style.opacity='0.5';

      }

      window.ULoneWEEK.appendChild(li_days);

      if((dateOFMonth) == date.getDate() && month_ == date.getMonth()+1 && year_==date.getFullYear()){
        li_days.classList.add("displayDay");
        clickedDay = li_days;
        document.getElementById(li_days.id).click();
      }


  weekDay++;
  dateOFMonth++;

    }


  }




function clearEvents(prof){

    var even = document.getElementById(prof).innerHTML = "";

}

var profileList = [];
  var count = 0;


function checkBOX(arr){

  for(item of arr){
    if(item.profileName.startsWith("Holidays")){
      return;
    }
    var li = document.createElement('li');

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = item.profileName;
    checkbox.value = "value";
    checkbox.id =item.id;
    checkbox.className = "checkboxProfile";
    checkbox.onclick = selectedProfiles;
    checkbox.dataset.id = item.id;
    checkbox.dataset.colour = item.colour;


    var label = document.createElement('label')
    label.htmlFor = item.id;
    label.appendChild(document.createTextNode(item.profileName));

    li.appendChild(checkbox);
    li.appendChild(label);

    profileSelBox.appendChild(li);
    if(count <3 ){
      checkbox.click();
    }
    count++;

}


}

function selectedProfiles(ev){
  if(ev.target.checked == false){
    var ul = document.getElementById(ev.target.name).remove();
    var haed = document.getElementById(ev.target.name+"heading").remove();
    return;
  }

var div = document.getElementById("div11");




var profilHead = document.getElementById("profilehead");
    var spanProfile = document.createElement('span');
    spanProfile.id = ev.target.name+"heading";
    spanProfile.className = 'eventHeading';

    spanProfile.textContent = ev.target.name;

    var ulProfile = document.createElement('ul');
    ulProfile.id = ev.target.name;
    ulProfile.className = "profileEventUL";

    profilHead.appendChild(spanProfile);
    div.appendChild(ulProfile);
    clickedDay.click();

}
function loadProfile() {
var url = '/calendar/profile';

 count = 0;
if(window.conEvent != null){
  window.conEvent.remove();
  window.profilehead.remove();

}

while(window.profileSelBox.firstChild){
    window.profileSelBox.removeChild(window.profileSelBox.firstChild);
}
sendR(url,function(res){
  profileList = res;

for (var i=0; i<profileList.length; i++){

  window.profileSelect.options[window.profileSelect.options.length] = new Option(profileList[i].profileName, profileList[i].profileName);
}
var div = document.createElement('div');
div.id ="conEvent";
div.className = 'events';


var div11 = document.createElement('span');
div11.id ="div11";
div.appendChild(div11);

var currTimeSpan = document.createElement('span');
currTimeSpan.id = "currTimeSpan";

var currTimeTri = document.createElement('div');
currTimeTri.id = "currTimeTri";

div11.appendChild(currTimeTri);
div11.appendChild(currTimeSpan);

  window.div1.appendChild(div);

  var profilHead = document.createElement('span');
  profilHead.id="profilehead";
  window.div1.appendChild(profilHead);


  createTimeCol();

oneWeek(firstday,lastday);
checkBOX(profileList);

div11.addEventListener("mouseenter", function(  ) {
              clearInterval(curentTimeLineTimer);
              curentTimeLineTimer = null;
            });
div11.addEventListener("mouseout", function(  ) {
        if(curentTimeLineTimer == null ){
          curentTimeLineTimer = setInterval(curentTimeLine,1000*60);
        }
      });



});

}


loadProfile();

function createTimeCol(){
  var div = document.getElementById("div11");

  var profilHead = document.getElementById("profilehead");
  var spanTi = document.createElement('span');
  spanTi.className = 'eventHeading';

  spanTi.textContent = "time";
  spanTi.style.width = "50px";
      spanTi.style.flexShrink="0";
  var ulTi = document.createElement('ul');
  ulTi.className = "profileEventUL";
ulTi.style.width = "50px";

  profilHead.appendChild(spanTi);
  div.appendChild(ulTi);


    for(var i = 0;i <= 23;i++){
      var li_events = document.createElement('li');
      li_events.className = 'liTime';
      var span = document.createElement("span");
      span.className = "timeColSpan";

      span.textContent = (i > 9 ? i : "0"+i) + ":00";
      li_events.appendChild(span);
      ulTi.appendChild(li_events);
    }
}


function showEVENTS(eve,prof){
  clearEvents(prof);

  for(var i = 0;i <= 23;i++){
    createBlanks(clickedDay,0,i,prof);

  }

for(var i = 0; i < eve.length;i++){

  var result = createEventElem(eve[i]);

  var elemmm = document.getElementById(eve[i].profileName+"_"+parseInt(eve[i].timeFrom,10)+"_"+clickedDay.id);


elemmm.appendChild(result);


if(elemmm.childNodes.length > 1){
  elemmm.childNodes[1].style.width = "20%"

}


}
curentTimeLine();
checkOverlaps(".back",".back");
}

function checkOverlaps(m,n){
  var b = document.querySelectorAll(m)
  var c = document.querySelectorAll(n)

b.forEach(function(y){
	c.forEach(function(x){
    var h= x.getBoundingClientRect(), g=y.getBoundingClientRect();
    if(x.innerText == y.innerText){
      return;
    }
var overlap = !(g.right < h.left ||
                    g.left > h.right ||
                    g.bottom < h.top ||
                    g.top > h.bottom);
    				if(overlap){
                if(y.style.width != "50%" && x.style.width != "50%"){
                console.log(y,x);
                x.style.width = "50%";
                x.style.marginLeft = "45%";
                x.style.zIndex = "2";

              }
              if(y.parentNode.childNodes.length > 1){
                y.style.width = "40%";
                y.style.marginLeft = "0px";


              }



              }

    });
});

}

function createBlanks(tar,g,start,prof){
    var li_events = document.createElement('li');
    li_events.className = 'liEVENTS_no';
    li_events.tabIndex = "1";
    for(var i = 0 ; i<2 ; i++){
      var span = document.createElement("span");
      span.className = "NO_Event";
      span.id = prof+"_"+(start+g)+"_"+tar.id;
      if(i == 1){
        span.id += "_DUMMY"
        span.style.borderTop = "1px dashed rgba(0, 0, 0,0.2)";
        span.style.marginTop = "-25px";
      }

      li_events.appendChild(span);
      for(const dbP of profileList){
        if(dbP.profileName == prof){
          li_events.addEventListener('click',calendar_event);
          //li_events.addEventListener('blur',cancelEvent);
        }
      }
    }
    document.getElementById(prof).appendChild(li_events);
}



var eventCount = 0;



function createEventElem(eventObj){

  var span_delete = document.createElement('span');


  var span_elem = document.createElement('span');
  var span_elem2 = document.createElement('span');

  var test1 = document.createElement('span');

  test1.className = 'back';
  var col = document.querySelector("input[type='checkbox'][name='"+eventObj.profileName+"']").dataset.colour;

  test1.style.background = hex2rgba_convert(col,0.8);

  span_delete.textContent= 'X';
  span_delete.classList='spanDelete';
  span_delete.dataset.id = eventObj.id;
  span_delete.dataset.text = eventObj.eventName;
  span_delete.dataset.type = eventObj.type || "localDatabase";
  span_delete.addEventListener('click',requestDelete);



  test1.appendChild(span_delete);

  span_elem.textContent = eventObj.timeFrom+"  "+eventObj.timeTo;
  span_elem.className = 'spanTime';
  test1.appendChild(span_elem);

  span_elem2.textContent = eventObj.eventName;
  span_elem2.className = 'spanEventName';


 var [f_h,f_m] = eventObj.timeFrom.split(":");
 var [t_h,t_m] = eventObj.timeTo.split(":");

 var hDif = (+t_h) - (+f_h);
 var mDif = (+f_m) - (+t_m) ;
var ti_diff = (hDif*60)-mDif;
  var hh = (ti_diff/60)*48;

  test1.style.height = hh +"px";

  var min = parseInt(eventObj.timeFrom.split(":")[1],10)
  if(min>0){
    test1.style.marginTop = ((min/60)*49) + "px";
  }

  test1.appendChild(span_elem2);

  return test1;
}



function check_events(){
var daysAll = document.getElementById('ULoneWEEK').getElementsByTagName('li');
	for(var i = 0;i<eventList.length;i++){
		for(var j = 0;j<daysAll.length;j++){
    var anEvent = document.getElementById(daysAll[j].id);
		if(eventList[i].id == daysAll[j].id){
      if(anEvent.className == 'today'){
        anEvent.className +=' eventDis';
      }else if(anEvent.className == 'today eventDis'){
        anEvent.className = 'today eventDis';
      }else{
        anEvent.className ='eventDis';
      }
		}
	}
}
}

function createERROR(elemApend,text,top){
  var span = document.createElement('span');
  span.id = "ErrorMsg"+elemApend.id;
  span.className = "errorMsgEvent";
  span.textContent = text;
  span.style.top = top;
  elemApend.parentNode.insertBefore(span,elemApend.nextSibling);

}



function validateInput(ev){
  var error = document.getElementById('ErrorMsg'+ev.target.id);
  if (ev.target.value.trim() === '' ){
    if(!error){
    ev.target.style.border = '1px solid #dd4b39';
    switch (ev.target.id) {
      case "name_of_event":
      createERROR(ev.target,"You can't leave this empty","90px");

        break;
        case "start_time_of_event":
        createERROR(ev.target,"Event needs start time",'165px');

          break;
          case "finish_time_of_event":
          createERROR(ev.target,"Every event has to finish eventually","165px");

            break;
      default:

    }
  }
  }else {
    if(error){
      error.remove();
      ev.target.style.border = '1px solid #EBE9ED';


    }
  }
}

function validateForm(){

var formElem = document.getElementById('add_event_form').getElementsByTagName('input');


var eventTimeFrom = window.start_time_of_event;
var eventTimeTo = window.finish_time_of_event;

var overlapingEvents = multipleDateRangeOverlaps2(parseInt(eventTimeFrom.value,10),parseInt(eventTimeTo.value,10),profileSelect.value);
if(overlapingEvents.length < 2 && document.querySelectorAll(".errorMsgEvent").length == 0 ){
  add_event();
}else {
  console.log("FALSE!!!!");
    return;
}


}


function add_event(){

  var eventName = window.name_of_event.value;
  var eventTimeFrom = window.start_time_of_event.value;
  var eventTimeTo = window.finish_time_of_event.value;
  var eventDate = window.date_of_event.textContent;

  var [profile,timeFr,day,month,year,dayOfWeek] = eventDate.split(/[_.]+/);


  var profileColour = profile;

  var eDate = day;
  var Month = month;


var requestObj= {

    id: eventDate,
    day: eDate,
    month: Month,
    year: year,
    timeFrom:  eventTimeFrom,
    timeTo: eventTimeTo,
    eventName: eventName,
    profileName: profile

  };






  cancelEvent();
  sendRequest('POST','/calendar/events',requestObj);

}


function sendRequest(method,url,payLoad){
console.log(payLoad);

var xhr = new XMLHttpRequest();
xhr.open(method, url , true);
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhr.onreadystatechange = function(){
if ( xhr.status==200){
  clickedDay.click();


}
}
xhr.send(JSON.stringify(payLoad));

}


function requestDelete(e) {
  if (e.target.dataset.id && e.target.dataset.text && window.confirm("Realy delete '" +e.target.dataset.text+"'?")) {

    refreshToken(function(res){
      var payLoad = {
        id:e.target.dataset.id,
        eventName:e.target.dataset.text,
        type:e.target.dataset.type,
        auth: res
      }
      sendRequest('DELETE','/calendar/events', payLoad);
    });

  }
}


window.add_event_button.addEventListener('click', validateForm);

function cancelEvent(){

  window.add_event_form.reset();
  window.add_event_div.classList.toggle("HideAddEvent");
  window.ArrowUP.classList.toggle("HideAddEvent")

  var k = window.cancel_Event.dataset.id;
  document.getElementById(k).style.backgroundColor = null;

  window.cancel_Event.dataset.id = '';


}














var  date = new Date();
var Months = [" ","January","Febuary","March","April","May","June","July","August","September","October", "November","December"];
var FullDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];


function calendar_event(ev){


if(ev.target.className != "NO_Event"){
  return;
}


if(window.cancel_Event.dataset.id){
  var k = window.cancel_Event.dataset.id;
  document.getElementById(k).style.backgroundColor = null;
}

window.cancel_Event.dataset.id = ev.target.id;



var x = (ev.clientX), y = ev.clientY;

var xB = ev.target.getBoundingClientRect();


  window.add_event_div.style.left = xB.left - 14+"px";
  window.add_event_div.style.top = xB.top+xB.height+14+"px";
  window.ArrowUP.style.left = x + 'px';
  window.ArrowUP.style.top = xB.top+xB.height+"px";





  if(add_event_div.classList[1] != "HideAddEvent"){
    window.add_event_div.classList.add("HideAddEvent");
    window.ArrowUP.classList.add("HideAddEvent");

  }

ev.target.style.backgroundColor = "white";
ev.target.focus();



  var [profile,timeFr,day,month,year,dayOfWeek] = ev.target.id.split(/[_.]+/);


var minutes = ev.target.style.marginTop == "-25px" ? ":30" : ":00";
    window.start_time_of_event.value = check(timeFr) +  minutes;

    window.finish_time_of_event.value = check(+timeFr+1) +  minutes;


    var targetDate = FullDays[dayOfWeek] + " " + day + " " + Months[+month];

    window.date_of_event.textContent = profile+"_"+timeFr+"_"+day+"."+month+"."+year+"_"+dayOfWeek;//ev.target.id;
    window.full_date_of_event.value = targetDate;

    var org_list=document.getElementById('profileSelect');
    org_list.selectedIndex=org_list.querySelector('option[value="'+profile+'"]').index;

}



function sendR(url,func) {

var xhr = new XMLHttpRequest();
xhr.open('GET', url , true);

xhr.onload = function() {
  if (xhr.status === 200) {
    func(JSON.parse(xhr.responseText));
  } else {
    console.error('error getting events', xhr);
  }
}

xhr.send();

}
function check(time){
	return time<10 ? "0"+time : time;
}
