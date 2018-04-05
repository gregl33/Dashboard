window.openSettings.addEventListener("click",toggleSett);
window.SettingDash.addEventListener("mouseleave",toggleSett);

function toggleSett(ev){
  window.SettingDash.classList.toggle('settingHide');
}

var ex = [];
ex.push(function(){
    var exampleSocket = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
    exampleSocket.onopen = function (event) {
        console.log('Connection Open for EMAILS');
        exampleSocket.send('EMAILS');
        };
    exampleSocket.onmessage = function (event) {
        //console.log(event);
        receivedMessageFromServer(event);
        };
    return exampleSocket;
    }());

ex.push(function(){
    var exampleSocket = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
    exampleSocket.onopen = function (event) {
        console.log('Connection Open for EVENTS');
        exampleSocket.send('EVENTS');
        };
    exampleSocket.onmessage = function (event) {
        console.log('Test2: ', JSON.parse(event.data));
        };
    return exampleSocket;
    }());
