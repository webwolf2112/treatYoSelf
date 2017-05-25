
var request = require('request'),
apiKey = '6IxB1I1Mzv8PDq5WcbAEL2y8boERbGZz',
apiTopDestinations = 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
apiLocation = 'https://api.sandbox.amadeus.com/v1.2/location/',
airportCode = 'BOS',
apiTopDestinationsLink = apiTopDestinations + '?origin=' + airportCode + '&apikey=' + apiKey;


request(apiTopDestinationsLink, function (error, response, body) {
	body = JSON.parse(body);

	var randomNumber = Math.floor(Math.random() * 9) + 1;
	var selectedCity = body.results[randomNumber].destination;
	var price = body.results[randomNumber].price;

  var apiLocationLink = apiLocation + selectedCity + '?apikey=' + apiKey;

   // Print the response status code if a response was received 

   request(apiLocationLink, function(error, response, body) {
   		body = JSON.parse(body);
   		var cityName = body.city.name;
   		var latitue = body.city.location.latitude;
   		var longitude = body.city.location.longitude;

   		var POILink = 'https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle' + '?apikey=' + apiKey + '&latitude=' + latitue + '&longitude=' + longitude + '&radius=42';

   		console.log(POILink);


   		request(POILink, function(error, response, body) {
   			//console.log(body);

   			body = JSON.parse(body);
   			var POIList = []

   			for(var i=0; i < 3; i++) {
   				POIList.push(body.points_of_interest[i].title);
   			} 


   		console.log('Sweet You are Going to ' + cityName);
   		console.log('the Price is ' + price);
   			POIList.forEach(function(item) {
   				console.log(item);
   			});

   		});
   		
   });
});

