// for robots
Meteor.Router.add('/robots.txt', 'GET', function(id) {
  return [200, 'User-agent: *'];
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


