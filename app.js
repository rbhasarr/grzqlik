var express = require('express');
var app = express();
var response1 = '';
var newresponse = '';
var code = '';
var codejson = '';
var venuecity = '';
var venue = '';
var finalJson = '';
var accesstoken = '';
var Port = 8080;
const request = require('request');
const clientID = 'qvnodj33a50f40c75hu0sdquct';
const clientSecret = 'd56vh393k8vilb3edg3dpotlg6';
const redirecturl = 'https://qlikmeet.azurewebsites.net/';
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get('/',urlencodedParser,function(req,res){
// Requests for oauth
  request({
    headers: {
      accept: 'application/json'
    },
    uri: 'https://secure.meetup.com/oauth2/authorize?client_id=' + clientID + '&redirect_uri=' + redirecturl + '&response_type=anonymous_code',
    method: 'get'
  }, function (err, resp, body) {
    codejson = JSON.parse(body);
    code = codejson.code;
    console.log('code', codejson.code);
    request({
      headers: {
        accept: 'application/json'
      },
      uri: 'https://secure.meetup.com/oauth2/access?client_id=' + clientID + '&redirect_uri=' + redirecturl + '&grant_type=anonymous_code&client_secret=' + clientSecret + '&code=' + code,
      method: 'post'
    }, function (error, respon, bod) {
        finalJson = JSON.parse(bod);
        accesstoken = finalJson.access_token;
        console.log('access-token', accesstoken);
        getmeetupdata(accesstoken);
       });      
  }); 
 // function for meetup data
  var getmeetupdata = function(access_token){
    request({
        uri: 'https://api.meetup.com/pro/qlik/events?photo-host=public&page=20&access_token=' + access_token,
        method: 'get'
    }, function (finalerror, finalrespon, finalbod) {
      var jsondata = JSON.parse(finalbod);
      console.log(jsondata);
      jsondata = jsondata.sort(function(a, b){
        var date1 = new Date(a.event.local_date);
        date1 = date1.getTime();
        var date2 = new Date(b.event.local_date);
        date2 = date2.getTime();
        return date1 - date2;
      });
      var i = 0;
      jsondata.forEach(function (json) {
        if (i < 5){
          const date = new Date(json.event.local_date);  // 2009-11-10
          const month = date.toLocaleString('en-us', { month: 'short' });
          const dateNumber = date.getDate();
          if(typeof json.event.group === "undefined" || json.event.group === null){
            venuecity = '';
            venue = '';
          }
          else{
            venuecity = 'At ' + json.event.group.localized_location;
            venue = json.event.group.localized_location;
          }
          newresponse = newresponse + '<li class="meetups-data" data-location="' + venue + '"><div class="event-details"><div class="date-holder"><div class="date"><span class="date-text">' + dateNumber + '</span></div><div class="month"><span class="month-text">' + month + '</span></div></div><div class="event-description"><h4><a href="' + json.event.link + '" target="_blank">' + json.event.name + '</a></h4><span class="event-place">' + venuecity + '</span><span class="event-time">' + json.event.local_time + '</span></div></div></li>';
          i++;
        }
      });
      newresponse = newresponse + '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBYvZL9yBnDq79sxZ4RdZu-b9XzQGTUrIs&callback=initMap"></script>';
      console.log(newresponse);
      res.writeHead(200, { 'Content-Type': 'text/html'});            
      res.end(newresponse);
      newresponse = '';
    });
  };
});
app.listen(Port, function () {
    console.log("Server is listening on port: " + Port);

});
