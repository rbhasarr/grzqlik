var express = require('express');
var app = express();
var response1 = '';
var venuecity = '';
var venue = '';
var newresponse = '';
var Port = 8080;
var request = require('request');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get('/',urlencodedParser,function(req,res){
    request = require("request");
    
    var options = { method: 'GET',
      url: 'https://api.meetup.com/pro/qlik/events',
      qs: 
       { 'photo-host': 'public',
         page: '20',
         sig_id: '258600237',
         sig: 'e46a3274373454a422cf66b7bd5641454c128b38' },
      headers: { 'content-type': 'text/html' } };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      response1 = body;
      var jsondata = JSON.parse(response1);
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
      res.send(newresponse);
			newresponse = '';
      res.status(200).end();
    });
});
app.listen(Port, function () {
    console.log("Server is listening on port: " + Port);
});
