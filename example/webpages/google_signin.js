

function signInCallback(authResult,whi,id,cb) {
refreshToken(function(res){
  authResult = res;
});

  if (id != null){
    id = id.replace('#','|');
  }
var xhr = new XMLHttpRequest();

 xhr.open('POST', '/dashboard/googleID?whi='+whi+"&id="+id+"&hostURL=http://"+window.location.hostname + ":" + (window.location.port || 80));
 xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

 if(cb){
  xhr.onload = function() {
     cb(JSON.parse(xhr.responseText));
   }
 }
 xhr.send(JSON.stringify(authResult));
}



  var token;


function refreshToken(cb){
  gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse().then(function(result){

  token = {
   "access_token":result.access_token,
   "token_type":result.token_type,
   "expires_at":result.expires_at,
   "expires_in":result.expires_in

 };
 }, function(err){
   token = "";
 }
);
cb(token);
}

function signIN(result){
  window.notSignedIn.style.display = "none";
  console.log('Signed in!');
if( window.signout.disabled == false){return;}
  token = {
   "access_token":result.Zi.access_token,
   "token_type":result.Zi.token_type,
   "expires_at":result.Zi.expires_at,
   "expires_in":result.Zi.expires_in
 };

 signInCallback(token,"emails")
 signInCallback(token,"profile","",checkBOX)
 var profile = result.getBasicProfile();
 window.signinas.textContent = "Signed in as "+profile.getName();
 window.signinas.dataset.name = profile.getName();
 window.signout.disabled = false;

 onLoad();

loadProfile();


}



function start() {
     gapi.load('auth2', function() {
       auth2 = gapi.auth2.init({
         client_id: '607812233664-bko64httbh9qiadhdm2t3mc54je10eif.apps.googleusercontent.com',
         scope: 'email',
         fetch_basic_profile: true
       });

       document.getElementById('signin').addEventListener('click', function() {
         auth2.signIn({
           scope: 'email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar',
           prompt: 'consent',
           access_type:"offline"
         }).then(function(result) {

            signIN(result);

         }, function(error) {
           console.log(error);
         });
       });
       document.getElementById('signout').addEventListener('click', function(ev) {
         window.signout.disabled = true;

         auth2.signOut();
         window.signinas.dataset.name = "root";
         loadProfile();

         window.signinas.textContent = "Singed out";

         var emailElemList = document.querySelectorAll(".emails");
         for (var i of emailElemList){
           i.innerHTML = "";
         }
         emailLabels.innerHTML = "";
         window.notSignedIn.style.display = null;
         window.emailContainer.style.height = null;
         window.emailContainer.style.overflowY = null;
         onLoad();
       });
     });
}
