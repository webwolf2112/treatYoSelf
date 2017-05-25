var http = require('http');


var cityName = 'Denver';

var options = {
  host: 'prismtechstudios.com',
  port: 80,
  path: '/test/airports/get-airport.php?city=' + escape(cityName)
};

http.get(options, function(res) {
	
	res.setEncoding('utf8');
	res.on('data', function (body) {
	  if (body == 'not found') {
	    console.log ('error: airport code not found');
      } else {
	    console.log (body);
      }
	});
  
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});