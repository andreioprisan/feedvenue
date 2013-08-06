// for robots
Meteor.Router.add('/robots.txt', 'GET', function(id) {
  return [200, 'User-agent: *'];
});

Meteor.Router.add('/api/twiml/voice', 'POST', function() {
	var rawIn = this.request.body;
	console.log(rawIn);
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		twilioRawIn.insert(rawIn);
		Phone.insert(rawIn);
	}

	var question = {};
	console.log(rawIn.Body);
	if (rawIn.Body) {
		question.inputQuestion = rawIn.Body;
		question.source = "sms";
	} else if (rawIn.TranscriptionText) {
		question.inputQuestion = rawIn.TranscriptionText;
		question.source = "voicemail";
	} else {
		return;
	}
	question.inputName = rawIn.From;
	    		
	var toOrig = rawIn.To;
	toOrig = toOrig.replace(/\+1/g, "");
	var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
	var eventDetails = Events.findOne({phone: toPretty});

	if (_.size(eventDetails) == 0) {
		return;
	} else {
		question.slug = eventDetails.slug;
	}

    Meteor.call('questionCreate', question, function(error, res) {

    });

	var xml = '<Response><Say voice="man">Please speak your question after the tone. You may hang up when you\'re finished</Say><Record maxLength="180" transcribe="true" transcribeCallback="https://feedvenue.com/api/twiml/transcribe" /></Response>';
    return [200, {"Content-Type": "text/xml"}, xml];
});

Meteor.Router.add('/api/twiml/sms', 'POST', function() {
	var rawIn = this.request.body;
	console.log(rawIn);
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		twilioRawIn.insert(rawIn);
		SMS.insert(rawIn);
	}

	var question = {};
	console.log(rawIn.Body);
	if (rawIn.Body) {
		question.inputQuestion = rawIn.Body;
		question.source = "sms";
	} else if (rawIn.TranscriptionText) {
		question.inputQuestion = rawIn.TranscriptionText;
		question.source = "voicemail";
	} else {
		return;
	}
	question.inputName = rawIn.From;
	    		
	var toOrig = rawIn.To;
	toOrig = toOrig.replace(/\+1/g, "");
	var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
	var eventDetails = Events.findOne({phone: toPretty});

	if (_.size(eventDetails) == 0) {
		return;
	} else {
		question.slug = eventDetails.slug;
	}

    Meteor.call('questionCreate', question, function(error, res) {

    });

	var xml = '<Response><Sms>Thank you for submitting your question!</Sms></Response>';
    return [200, {"Content-Type": "text/xml"}, xml];
});

Meteor.Router.add('/api/twiml/transcribe', 'POST', function() {
	var rawIn = this.request.body;
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		twilioRawIn.insert(rawIn);
		Phone.insert(rawIn);
	}

	var question = {};
	console.log(rawIn.Body);
	if (rawIn.Body) {
		question.inputQuestion = rawIn.Body;
		question.source = "sms";
	} else if (rawIn.TranscriptionText) {
		question.inputQuestion = rawIn.TranscriptionText;
		question.source = "voicemail";
	} else {
		return;
	}
	question.inputName = rawIn.From;
	    		
	var toOrig = rawIn.To;
	toOrig = toOrig.replace(/\+1/g, "");
	var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
	var eventDetails = Events.findOne({phone: toPretty});

	if (_.size(eventDetails) == 0) {
		return;
	} else {
		question.slug = eventDetails.slug;
	}

    Meteor.call('questionCreate', question, function(error, res) {

    });

    return [200, {"Content-Type": "application/json"}, "ok"];
});

Meteor.Router.add('/api/email', 'POST', function(id) {
	if (this.request.query != undefined &&
		this.request.query.user != undefined &&
		this.request.query.domain == "feedvenue.com") {

		var rawIn = this.request.body;
		var parsedMessage = {};

		_.each(rawIn, function(piece, key) {
			if (key == "message-headers" ||
				key == "signature" ||
				key == "stripped-signature" ||
				key == "X-Mailgun-Incoming" ||
				key == "X-Gm-Message-State" ||
				key == "Content-Type" ||
				key == "X-Envelope-From" ||
				key == "X-Google-Dkim-Signature" ||
				key == "Mime-Version" ||
				key == "X-Received" ||
				key == "Date" ||
				key == "Message-Id" ||
				key == "Received" ||
				key == "X-Originating-Ip" ||
				key == "Subject" ||
				key == "From" ||
				key == "Subject" ||
				key == "timestamp" ||
				key == "X-Proofpoint-Virus-Version" ||
				key == "X-Proofpoint-Spam-Details" ||
				key == "X-Mailer" ||
				key == "Content-Transfer-Encoding") {
				return piece;
			}

			if (piece != undefined) {
				parsedMessage[key.replace(/\-/g, '')] = piece.replace(/\+/g, ' ');
			}
		});		
		
		parsedMessage.receivedAt = moment().format();
		parsedMessage.raw = rawIn;
		parsedMessage.mailbox = this.request.query.user;
		parsedMessage.domain = this.request.query.domain;

		EmailIn.insert(parsedMessage);
		
		var question = {};
		question.inputQuestion = parsedMessage.strippedtext.replace(/\r/g, ' ').replace(/\n/g, ' ');
		question.inputName = parsedMessage.from;
		question.slug = parsedMessage.mailbox;
		question.source = "email";

		Meteor.call('questionCreate', question, function(error, res) {
			
		});
	}

  	return [200, 'ok'];
});

Meteor.Router.add('/api/provision', 'GET', function(id) {
  obj = { item1: "item1val", item2: "item2val" };
  return [200, {"Content-Type": "application/json"}, JSON.stringify(obj)];
});


