var request = require('request');

var options = {
  url: 'https://api-sandbox.capitalone.com/oauth2/token',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

var form = {
  client_id: 'enterpriseapi-sb-tJOw55ype3LktRNB5zY7oIHq',
  client_secret: '175384eb1888f2dded491e8d7242398f0c5901db',
  grant_type: 'client_credentials'
}

function card_callback(error, response, body) {
  
  if (!error && response.statusCode == 200) {
    cards = JSON.parse(body).products;
    for (i = 0; i < cards.length; i++) {
      if (cards[i].categoryTags) {
        for (j = 0; j < cards[i].categoryTags.length; j++) {
          if (cards[i].categoryTags[j].includes("travel")) {
            console.log(cards[i]); 
          }
        }
      }
    }
  } 
  else {
    console.log(error);
  }
}

function callback(error, response, body) {
  console.log(body)
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info)
    var access_token = info.access_token;
    console.log(access_token);
    options = {
      url: 'https://api-sandbox.capitalone.com/credit-offers/products/cards/consumer',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request.get(options, card_callback);
  }
}

request.post(options, callback).form(form);
