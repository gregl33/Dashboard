'use strict';
var fs = require('fs');

const http = require('http');
const wsserver = require('ws').Server;
const express = require('express');

const server = http.createServer();
const wss = new wsserver({ server: server });
const app = express();

const mysql = require('mysql');
const config = require('./sql_config.json');
const sql = mysql.createConnection(config.mysql);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/dashboard/googleID', googleID);
app.get('/calendar/events', sendEvents);
app.get('/calendar/profile/', sendProfiles);
app.get('/calendar/weather', getweather);
app.post('/calendar/events', saveEvent);
app.delete('/calendar/events', deleteEvent);

server.on('request', app);


var clients = [];
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    clients.push({"client":message,"connectio":this});
  });
});

function ws_broadcast(con,messag) {

  for (var cl of clients){
    if(cl.client == con){
      if(cl.connectio.readyState === cl.connectio.OPEN){
        try {
          cl.connectio.send(JSON.stringify(messag));
        } catch (e) {
        }
      }

    }
  }
}



app.use(express.static(__dirname + '/webpages', { extensions: ['html', 'css', 'js'] }));

server.listen(8080, function () { console.log('Server started.'); });



var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client;

function googleID(req,res){
var resp;
oauth2Client = new OAuth2(
  "607812233664-bko64httbh9qiadhdm2t3mc54je10eif.apps.googleusercontent.com",
  "syDQmjKWa-aP0ID14DZ_YGc2"
);
var code = req.body;
oauth2Client.credentials = code;
switch (req.query.whi) {
  case "profile":
    listCal(oauth2Client,function(reee){res.json(reee);});
    break;
  case "emails":
    listLabels(oauth2Client,res);
    break;
  case "events":
    var split = req.query.id.split(/[_]+/);
    listEvents(oauth2Client,split[0].replace('|','#'),split[1],function(reee){res.json(reee);});
    break;
  case "lableEmail":
    getMail(oauth2Client,req.query.id,res);
    break;
  case "singleMail":
    getSingleMail(oauth2Client,req.query.id,res);
    break;
  default:
}

}

function listCal(auth,cb){
  var calendar = google.calendar('v3');
  calendar.calendarList.list({
    auth: auth
  }, function(err, res) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }else {
      var listOfCalendars = res.items;
      var list = [];
      for( var item of listOfCalendars){
        list.push({"id":item.id,"colour":item.backgroundColor,"profileName":item.summary.split(/[@<]+/)[0]})
      }
      console.log(list);
      cb(list);
    }
});
}

function listEvents(auth,id,date,cb) {
  var calendar = google.calendar('v3');
  var eventssss = [];
        calendar.events.list({
          auth: auth,
          calendarId: id,
          timeMin: new Date(new Date(date).setHours(0,0,0,0)).toISOString(),
          timeMax: new Date(new Date(date).setHours(24,0,0,0)).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        }, function(err, response) {
          if (err) {
            console.log(id,'The API returned an error: ' + err);
            return;
          }
          var events = response.items;
          if (events == null||events.length == 0) {
            cb([]);
          } else {
            var evv = [];
            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              var start_ = event.start.dateTime || event.start.date;
              var end_ = event.end.dateTime || event.end.date;
                var start = new Date(Date.parse(start_));
                var end = new Date(Date.parse(end_));

              var formatedEvent = {"eventName":event.summary,
                          "day":check(start.getDate()),
                          "id":event.id+"_"+response.summary,
                          "month":check(start.getMonth()+1),
                          "profileName":response.summary.split(/[@<]+/)[0],
                          "timeFrom":check(start.getHours())+":"+check(start.getMinutes()),
                          "timeTo":check(end.getHours())+":"+check(end.getMinutes()),
                          "year":start.getFullYear(),
                          "type":"google"
                        };
              evv.push(formatedEvent);
            }
            cb(evv);
          }
        });
}

function check(time){
	return time<10 ? "0"+time : time;
}


function getweather(req, response){


const async = require('async');
const request = require('request');

function httpGet(url, callback) {
  const options = {
    url :  url,
    json : true
  };
  request(options,
    function(err, res, body) {
      callback(err, body);
    }
  );
}

var urls =[];
if(req.query.type=='geo'){

urls=[
  'http://api.openweathermap.org/data/2.5/weather?lat='+req.query.lat+'&lon='+req.query.lon+'&units=metric&APPID=792e26ed0fc9e3fe2b80061ac4dc8e3e',
  'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+req.query.lat+'&lon='+req.query.lon+'&units=metric&APPID=792e26ed0fc9e3fe2b80061ac4dc8e3e'
];
}else{
urls= [
  'http://api.openweathermap.org/data/2.5/weather?q='+req.query.place+'&units=metric&APPID=792e26ed0fc9e3fe2b80061ac4dc8e3e',
  'http://api.openweathermap.org/data/2.5/forecast/daily?q='+req.query.place+'&units=metric&APPID=792e26ed0fc9e3fe2b80061ac4dc8e3e'
];
}

async.map(urls, httpGet, function (err, res){
  if (err) return console.log("some:",err);
  //console.log(res);
  response.json(res);

});
}




function sendProfiles(req, res) {

  var profile = [];

  sql.query('SELECT * FROM profile', function (err, data) {
    if (err) return error(res, 'Profile failed to get filename ', err);

    res.json(data);
  });
}


function sendEvents(req, res) {

  sql.query(sql.format('SELECT * FROM events WHERE day = ? AND month = ? AND year = ? AND profileName = ? order by timeFrom ASC;',[req.query.day, req.query.month, req.query.year, req.query.profile]), function (err, data) {
    if (err) return error(res, 'failed to get filename ', err);

    res.json(data);
  });
}




function saveEvent(req, res){

  var event_ = req.body;

  sql.query(sql.format('SELECT * FROM events WHERE id =  ? AND eventName = ?', [event_.id , event_.eventName]), function (err, data) {
    if (err) return error(res, 'failed to get event', err);

    if (data.length >= 1) {//check for duplicate
      res.sendStatus(226);
      return;
    }
  // now run the query
  sql.query(sql.format('INSERT INTO events SET ? ', event_), function (err, result) {
    if (err) return error(res, 'failed sql insert', err);
    res.sendStatus(200);

  });

  });

}


function deleteEvent(req,res){
  if(req.body.type == "google"){
    var calendar = google.calendar('v3');

    oauth2Client.credentials = req.body.auth;

    calendar.events.delete({
      auth: oauth2Client,
      calendarId: req.body.id.split("_")[1],
      eventId: req.body.id.split("_")[0]

    }, function(err, res) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log('Event deleted.');

    });

    res.sendStatus(200);
    return;
  }

  var id = req.body.id;
  var eventName_ = req.body.eventName;

  sql.query(sql.format('SELECT * FROM events WHERE id =  ? AND eventName = ?', [id ,eventName_]), function (err, data) {
    if (err) return error(res, 'failed to get event for deletion', err);

    if (data.length < 1) {
      res.sendStatus(410); // already gone
      return;
    }

  sql.query(sql.format('DELETE FROM events WHERE id = ? AND eventName = ?', [id, eventName_]), function (err, result) {
  if (err) return error(res, 'failed sql delete', err);
  res.sendStatus(200);

    });

  });

}

function error(msg, error) {
  console.error(msg + ': ' + error);
  sql.end();
}


var e_mails = [];
var emailsIDList = [];
function listLabels(auth_,res) {
  var arr = [];
  var gmail = google.gmail({ auth: auth_, version: 'v1' });
  gmail.users.labels.list({
      userId: 'me',
  },function(err, results){
     results.labels.forEach(function(re){
        gmail.users.labels.get({
          userId: 'me',
          id:re.id
        },function (err, results) {
          ws_broadcast("EMAILS",results);
        });
    });
     getMail(auth_,"INBOX",res);
  });

}


function getMail(auth_,lable,res){
  var gmail = google.gmail({ auth: auth_, version: 'v1' });

  gmail.users.threads.list({
    includeSpamTrash: false,
    labelIds:lable,
    maxResults: 10,
    q: "",
    userId: 'me'
    }, function (err, results) {
      findEmail(results,auth_);
      res.sendStatus(200);
  });
}

function getSingleMail(auth_,id,res){
console.log("\nMAIL_SINGLE");
  var gmail = google.gmail({auth: auth_, version: 'v1' });

  gmail.users.threads.get({
    'id': id,
    'userId': 'me',
  }, function(err,result){
    result["singleMail"] = "True";

    ws_broadcast("EMAILS",result);
    res.sendStatus(200);
});
}



function findEmail(res, au){

  emailsIDList = res;

  var gmail = google.gmail({auth: au, version: 'v1' });

for (let i = 0; i<emailsIDList.threads.length;i++){
  gmail.users.threads.get({
    'id': emailsIDList.threads[i].id,
    'userId': 'me',
    'format':"metadata",
    'metadataHeaders':['from', 'subject', 'date']
  }, function(err,result){
      var length = result.messages.length;
      var j = length-1;

     var obj = {
      order:i,
      id: result.id,
      labelIds: result.messages[j].labelIds,
      snippet: result.messages[j].snippet,
      headers:result.messages[j].payload.headers,
      length: length

  };
    ws_broadcast("EMAILS",obj);

  }
);
}
}
