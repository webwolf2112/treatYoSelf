/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');


const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Earth is the only planet not named after a god.',
                'Jupiter has the shortest day of all the planets.',
                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
                'The Sun contains 99.86% of the mass in the Solar System.',
                'The Sun is an almost perfect sphere.',
                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
                'The temperature inside the Sun can reach 15 million degrees Celsius.',
                'The Moon is moving approximately 3.8 cm away from our planet every year.',
            ],
            SKILL_NAME: 'Space Facts',
            GET_FACT_MESSAGE: "Here's your fact: ",
            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask',  "Want to treat yo self? Can I get a hell yeah?");
    },
    'PlanVacationIntent': function () {
        this.emit('PlanVacation');
    },
    'PlanVacation': function () {
		
		//if (this.event.request.dialogState === 'STARTED') {
          //  var updatedIntent = this.event.request.intent;
            // Pre-fill slots: update the intent object with slot values for which 
            // you have defaults, then emit :delegate with this updated intent. 
            //updatedIntent.slots.SlotName.value = 'DefaultValue';
            //this.emit(':delegate', updatedIntent);
			//return;
        //} else if (this.event.request.dialogState !== 'COMPLETED'){
         //   this.emit(':delegate');
			//return;
        //}
		
		        if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS"){
            this.context.succeed({
                "response": {
                    "directives": [
                        {
                            "type": "Dialog.Delegate"
                        }
                    ],
                    "shouldEndSession": false
                },
                "sessionAttributes": {}
            });
			return;
        }

    	var rw = require('./max_reward.js');
		
        var origin = this.event.request.intent.slots.origin.value;
		var when = this.event.request.intent.slots.when.value; //will be a string of a month, like "april"
		var howLong = this.event.request.intent.slots.how_long.value; //will be an AMAZON.Duration string (https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference#duration) -- "P3D" means three days
		
		getAirportCode(origin,  (vacation) => {
				//console.log("sent     : " + myRequest);
				//console.log("received : " + myResult);]

		var balance = rw.getMaxTravelReward(rw.rewardJson);
		var balanceMessage = 'you have ' + Math.floor(balance) + ' dollars in your Capital Rewards account! ';

		if (parseInt(Math.floor(balance)) <= parseInt(Math.floor(vacation.price))) {
			balanceMessage = 'You don\'t have enough in your Capital One Rewards, you only have ' + Math.floor(balance) + ' dollars but if you get a new Capital One Credit Card and ';
		}

		var vacationText = balanceMessage +'Your freaking going to ' + vacation.cityName + '<break time=".5s" /> the Price is ' + Math.floor(vacation.price) + ' dollars And awesome places you get to visit are <break time="0.5s" />' + vacation.POIList[0] + '<break time="0.5s" />' + vacation.POIList[1] + '<break time=".5s" />' + vacation.POIList[2] + '<break time=".5s" />You go with your bad self <break time=".5s" /> <audio src="https://s3.amazonaws.com/treat-yo-self/treat.mp3"/>';

				this.emit(':tell',  vacationText);

			}
		);
		
		
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

let index = function index(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

exports.handler = index;

var http = require('http');
// https is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/https.html
// try other APIs such as the current bitcoin price : https://btc-e.com/api/2/btc_usd/ticker  returns ticker.last

function getAirportCode(origin, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    // Update these options with the details of the web service you would like to call
    //get airport code
	var options = {
	  host: 'prismtechstudios.com',
	  port: 80,
	  path: '/test/airports/get-airport.php?city=' + escape(origin)
	};
	var request = require('request');

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data

            var airportCode = '';
			  if (returnData == 'not found') {
				//just use"Denver" as fallback
				airportCode = 'DEN';
				//console.log ('error: airport code not found');
			  } else {
				airportCode = returnData;
			  }

			  var apiKey = '6IxB1I1Mzv8PDq5WcbAEL2y8boERbGZz',
				apiTopDestinations = 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search',
				apiLocation = 'https://api.sandbox.amadeus.com/v1.2/location/',
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


			   		request(POILink, function(error, response, body) {
			   			//console.log(body);

			   			body = JSON.parse(body);
			   			var POIList = []

			   			for(var i=0; i < 3; i++) {
			   				POIList.push(body.points_of_interest[i].title);
			   			} 

			   			var vacation = {
			   				'cityName': cityName,
			   				'price': price,
			   				'POIList': POIList

			   			}

			   			 callback(vacation);
					   		
					   });
					});

	             // this will execute whatever function the caller defined, with one argument
	             	});
	        	});

    		});
    req.end();

}
