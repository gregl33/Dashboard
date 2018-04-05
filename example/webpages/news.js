

function sendNewsR(checked,cb) {

  var url;
  if(checked == "UK"){
    url = 'https://content.guardianapis.com/uk?show-editors-picks=true&show-fields=all&api-key=54c93020-23b7-4c49-b608-938b71500195';
  }else if(checked == "World"){
     url = 'https://content.guardianapis.com/world?show-editors-picks=true&show-fields=all&api-key=54c93020-23b7-4c49-b608-938b71500195';
  }else if(checked == "politics"){
      url = 'https://content.guardianapis.com/politics?show-editors-picks=true&show-fields=all&api-key=54c93020-23b7-4c49-b608-938b71500195';
  }else{
    url='https://content.guardianapis.com/uk/'+checked+'?show-editors-picks=true&show-fields=all&api-key=54c93020-23b7-4c49-b608-938b71500195';
  }

var xhr = new XMLHttpRequest();
xhr.open('GET', url , true);

xhr.onload = function() {
  if (xhr.status === 200) {
    var news = JSON.parse(xhr.responseText);
    var arrNews = [];

    for(var i = 0;i<news.response.editorsPicks.length;i++){
      var editors = news.response.editorsPicks;
      var time=new Date(editors[i].webPublicationDate).toLocaleString();
      var j = time.substring(10);

    arrNews.push({
      count:i,
      date:j,
      sectionName:editors[i].sectionName,
      webtTitle:editors[i].webTitle,
      thumbnail:editors[i].fields.thumbnail,
      webUrl:editors[i].webUrl
    });

  }
  cb(arrNews);

  } else {
    console.error('error getting events', xhr);
  }
}


xhr.send();

}



function createELEM(ind,elem){

    var el = document.getElementById(elem);
    el.dataset.newsIndex = ind;
    while(el.firstChild){
    el.removeChild(el.firstChild);
    }

    var a = document.createElement('a');
    var span = document.createElement('span');
    var span2 = document.createElement('span');

    var img = document.createElement('img');

    img.src = news[ind].thumbnail;
    img.classList = 'imgThumb';

    a.href = news[ind].webUrl;
    a.target = '_blank';
    span.className="newsTitle";
    span.textContent =  news[ind].webtTitle ;
    span2.textContent=  ind+"   "+news[ind].sectionName;
    span2.className = "spanEnd";
    span.appendChild(a).appendChild(a.previousSibling);
    el.appendChild(img);

    el.appendChild(span);
    el.appendChild(span2);

}




var newsTimer;
var news = [];



function loadNews() {

  var local = JSON.parse(localStorage.getItem(window.signinas.dataset.name));
  if(local["newCat"]==null){
    document.querySelector("input[value=UK]").checked = true;
  }else {
    document.querySelector("input[value = "+local["newCat"]+"]").checked = true;
  }
  var checked =  document.querySelector('input[name="section"]:checked').value;

  local["newCat"] = checked;
  localStorage.setItem(window.signinas.dataset.name,JSON.stringify(local));



  var newsElems = document.querySelectorAll(".spanNewsSlide");
  for(var item of newsElems){
    item.style.left = null;
    item.innerHTML = "";
  }




window.loadingNews.style.display = 'block';


sendNewsR(checked,function(res){
  news = res;

  createELEM(1,'newsNext');
  createELEM(news.length-1,'newsPrev');
  createELEM(0,'newsCurr');

  window.loadingNews.style.display = 'none';
  newsTimer = setInterval(slideSHOW,1000*10);

});

window.newsMainTitle.textContent = checked.charAt(0).toUpperCase() + checked.slice(1) + " News";

}



function slideSHOW(){
 var local = JSON.parse(localStorage.getItem(window.signinas.dataset.name));
  if(local.elements.DivTopNews["hidden"]=="none"){
    clearInterval(newsTimer);
    return;
  }
  var newsElems = document.querySelectorAll(".spanNewsSlide");
  for(var item of newsElems){

    var index = parseInt(item.dataset.newsIndex,10);

    index = item.offsetLeft < 0 ? index+3 : index;

    item.style.display = null;


      item.style.left = item.offsetLeft == "0" ? "-100%" : item.offsetLeft < 0 ? "100%" : "0px";


      if(item.offsetLeft < 0){
        index = index >= news.length ? 2 : index < 0 ? news.length-1 : index;

        createELEM(index,item.id);
        item.style.display = 'none';
      }

  }
}




window.newsSettings.addEventListener('click', function(){
  clearInterval(newsTimer);
  toggle_settings('settings_','100%',loadNews);

});


function toggle_settings(id,height,cb){
  var checked =  document.querySelector('input[name="section"]:checked').value;

  var local = JSON.parse(localStorage.getItem(window.signinas.dataset.name));

  local["newCat"] = checked;
  localStorage.setItem(window.signinas.dataset.name,JSON.stringify(local));

  var  el = document.getElementById(id);
  if(el.offsetHeight == 0){
    el.style.height = height;

  }else{
     el.style.height = height;
     cb();
   }
}
