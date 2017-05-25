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
        this.emit('PlanVacation');
    },
    'PlanVacationIntent': function () {
        this.emit('PlanVacation');
    },
    'PlanVacation': function () {
		
		var http = require('http');
		
        var origin = this.event.request.intent.slots.origin.value;
		var when = this.event.request.intent.slots.when.value; //will be a string of a month, like "april"
		var howLong = this.event.request.intent.slots.how_long.value; //will be an AMAZON.Duration string (https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference#duration) -- "P3D" means three days
		
		//get airport code
		var options = {
		  host: 'prismtechstudios.com',
		  port: 80,
		  path: '/test/airports/get-airport.php?city=' + escape(cityName)
		};

		http.get(options, function(res) {
			
			res.setEncoding('utf8');
			res.on('data', function (body) {
			  var airportCode = '';
			  if (body == 'not found') {
				//just use"Denver" as fallback
				airportCode = 'DEN';
				//console.log ('error: airport code not found');
			  } else {
				airportCode = body;
			  }
			  var speechOutput = 'This is what Alexa will say. Airport code is ' + airportCode + ' (from origin: ' + origin;
		
			  this.emit(':tell', speechOutput);
			});
		  
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		});
		
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