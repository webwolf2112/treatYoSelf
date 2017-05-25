var http = require('http');


var code = 'DEN';

var options = {
  host: 'prismtechstudios.com',
  port: 80,
  path: '/test/airports/get-city-and-state.php?code=' + escape(code)
};

http.get(options, function(res) {
	
	res.setEncoding('utf8');
	res.on('data', function (body) {
	  console.log(body); // returns {"city":"Denver","state":"Colorado"}
	});
  
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});