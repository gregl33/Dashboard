


function hideElem(ev){
  var element = ev.target;
  while (element.parentElement.id != "bodyB"){
    element = element.parentElement;
  }

  window.bottomBar.style.height = "100px"

  var icon = document.getElementById(element.id+"_ICON");
  icon.style.display = "inline-block";
  var  iconBoundaries = icon.getBoundingClientRect();

  element.style.top = iconBoundaries.top + "px";
  element.style.left = iconBoundaries.left + "px";

  element.style.opacity = 0;
  element.style.transition = "all 1s ease-out";

  setTimeout(function(){
    element.style.transition = null;
    element.style.display = "none";
    window.bottomBar.style.height = null;

  },1500);
  icon.style.opacity = 1;

  changeLocal(element.id,iconBoundaries.top,iconBoundaries.left);
  localStorage.setItem((element.id+"_ICON"),JSON.stringify({opacity:1}));
}

function showElem(ev){

  var target = document.getElementById(ev.target.id.split("_")[0]);


  target.style.display = null;
  target.style.transition = "all 1s ease-out";
  if(target.dataset.cb){
    var func = target.dataset.cb;
    window[target.dataset.cb].call();
  }

  setTimeout(function(){
    var arr = JSON.parse(localStorage.getItem(window.signinas.dataset.name));
    var bounds = arr.elements[target.id];
    //var bounds = JSON.parse(localStorage.getItem(target.id));

    target.style.top = bounds.top;
    target.style.left = bounds.left;
    target.style.opacity = 1;
  },100);
  setTimeout(function(){
    target.style.transition = null;
    ev.target.style.display = "none";
    checklap(target.id,true);

  },1000);

  ev.target.style.opacity = 0;

  changeLocal(target.id,0,0);
  localStorage.setItem(ev.target.id,JSON.stringify({opacity:0}));

}



function addListnerIcon(elem,opa){
  var icon = document.getElementById(elem+"_ICON");
      icon.style.opacity = opa;
      icon.style.display = opa == 1 ? "inline-block" : "none";

    icon.addEventListener("click",showElem);

}

var elementsB = []
document.querySelectorAll("[data-draggable=true]").forEach(function(e){elementsB.push(e.id)});


onLoad();
function onLoad(){

var local = JSON.parse(localStorage.getItem(window.signinas.dataset.name));
if(local){
for(const el of elementsB){
  var elem = local.elements[el];
    var domElem = document.getElementById(el);

        domElem.style.width = elem.width;
        domElem.style.height = elem.height;
        domElem.style.top = elem.tempTop == "0px" ? elem.top : elem.tempTop;
        domElem.style.left = elem.tempLeft == "0px"  ? elem.left : elem.tempLeft;
        domElem.style.display = elem.hidden;
        domElem.style.opacity = elem.hidden != "" ? 0:1;
    if(elem.hidden == "none"){
      addListnerIcon(el,1);
    }else {
      addListnerIcon(el,0);
    }

  }
  loadNews();

}else {
  addLocalstorage();
  loadNews();
  return;
}

}

function addLocalstorage(obj){
var arr = {elements:{}};
if(obj == null){
  for(const elem of elementsB){
    document.querySelector('#'+elem).removeAttribute('style');
    var target = document.getElementById(elem),
        element = {
            top: target.offsetTop + "px",
            left: target.offsetLeft + "px",
            height: target.offsetHeight + "px",
            width: target.offsetWidth + "px",
            hidden: target.style.display,
            tempLeft:"0px",
            tempTop:"0px"

        };
        arr.elements[elem] = element;
    }
  }else {
    var target = document.getElementById(obj),
        element = {
            top: target.offsetTop + "px",
            left: target.offsetLeft + "px",
            height: target.offsetHeight + "px",
            width: target.offsetWidth + "px",
            hidden: target.style.display,
            tempLeft:"0px",
            tempTop:"0px"

        };
    var arr = JSON.parse(localStorage.getItem(window.signinas.dataset.name));
    arr.elements[obj] = element;
  }
    localStorage.setItem(window.signinas.dataset.name,JSON.stringify(arr));

}

function changeLocal(elem,top,left){

  var local = JSON.parse(localStorage.getItem(window.signinas.dataset.name));

  var newObj = local.elements[elem];

    newObj["hidden"] = newObj["hidden"] == "none" ? "" : "none";
    newObj["tempLeft"] = left+"px";
    newObj["tempTop"] =  top+"px";

    localStorage.setItem(window.signinas.dataset.name, JSON.stringify(local));

}

window.editSwitch.addEventListener('click',resizeEnbled);

function resizeEnbled(ev){
  for(var el of elementsB){
    var element = document.getElementById(el),resizeIcon = document.getElementById("resize_"+el);

    if(resizeIcon){
      resizeIcon.remove();
      document.getElementById("test_"+el).remove();

      element.removeEventListener("dblclick",hideElem);
      element.removeEventListener('dragstart',dragStart);
      element.draggable = false;
      addLocalstorage(el);
      window.bottomBar.style.display = 'none';
    }else{
      window.bottomBar.style.display = 'block';

      var span = document.createElement("span");
      span.className = "test";
      span.id = "test_"+el;
      element.appendChild(span);
      var resizer = document.createElement('div');
      resizer.className = "resize";
      resizer.id = "resize_"+el;
      element.appendChild(resizer);
      resizer.addEventListener('mousedown', initResize, false);
      element.addEventListener("dblclick",hideElem);
      element.addEventListener('dragstart',dragStart);
      element.draggable = true;

    }
  }


}

function initResize(e) {
   window.addEventListener('mousemove', Resize, false);
   window.addEventListener('mouseup', stopResize, false);
}

var resized;
function Resize(e) {
  var el = document.getElementById(e.target.id.split("_")[1]);
  el = el == null ? resized : el;
  resized = el;
   el.style.width = (e.clientX - el.offsetLeft) + 'px';
   el.style.height = (e.clientY - el.offsetTop) + 'px';
   el.draggable = false;

if(el.dataset.resize == "true"){
   var bounds = el.getBoundingClientRect();
   el.style.fontSize = bounds.width * 0.2 + "px";
 }
 checklap(el.id,false);
}


function stopResize(e) {
  var el = document.getElementById(e.target.id.split("_")[1]);
  el = el == null ? resized : el;
  resized = el;

    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    el.draggable = true;
}







function checklap(h1,grav){

var drag = document.getElementById(h1).getBoundingClientRect();

  for(var dropZone of elementsB ){

    if(h1 != dropZone ){



      var droped = document.getElementById(dropZone).getBoundingClientRect()

      var overlap = !(droped.right < drag.left ||
                      droped.left > drag.right ||
                      droped.bottom < drag.top ||
                      droped.top > drag.bottom);

      if(overlap){
        window.editSwitch.disabled = true;
        window.editSwitch.style.background = "grey";
        document.getElementById(dropZone).style.border = "1px dashed red";
        document.getElementById(h1).style.border = "1px dashed red";
        return;
      }else {
        window.editSwitch.disabled = false;
        window.editSwitch.style.background = null;
        document.getElementById(dropZone).style.border = null;
        document.getElementById(h1).style.border = null;
      }

    }

  }

}

var dragingELEm;

var offSetX;
var offSetY;
window.bodyB.addEventListener("dragover",allowDrop);
window.bodyB.addEventListener("drop",dropP);

function allowDrop(ev) {



var dragEl = document.getElementById(dragingELEm);

var bounds = document.getElementById("bodyB").getBoundingClientRect();

var newLeft = ev.clientX + offSetX, newTop = ev.clientY + offSetY;

if(newLeft < 0 ){
  newLeft = 20;
}else if((newLeft+dragEl.offsetWidth) > bounds.right){
  newLeft = bounds.right -20-dragEl.offsetWidth;

}else if(newTop < 0 ){
  newTop = 20;
}else if((newTop+dragEl.offsetHeight) > bounds.bottom){
  newTop = bounds.bottom -20-dragEl.offsetHeight;

}

dragEl.style.left = newLeft + "px";
dragEl.style.top = newTop  + "px";

if(dragEl.id == "emailContainer" && window.viewmail.style.display != "none"){
  hideMail();
}


ev.preventDefault();

    }





function dragStart(ev) {

var style = window.getComputedStyle(event.target,null);

offSetX = parseInt(style.getPropertyValue('left'),10)-ev.clientX;
offSetY = parseInt(style.getPropertyValue('top'),10)-ev.clientY;

dragingELEm = ev.target.id;

}

function dropP(ev) {
checklap(dragingELEm);
    console.log("DROP",ev);

    ev.preventDefault();
}
