// for robots
Meteor.Router.add('/robots.txt', 'GET', function(id) {
  return [200, 'User-agent: *'];
});

Meteor.Router.add('/api/email', 'POST', function(id) {
	console.log(this.request.query);
	console.log(this.request.body);
	
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
				parsedMessage[key] = piece.replace(/\+/g, ' ');
			}
		});		
		
		parsedMessage.receivedAt = moment(parseInt(parsedMessage.timestamp)*1000).format()
		parsedMessage.raw = rawIn;
		parsedMessage.mailbox = this.request.query.user;
		parsedMessage.domain = this.request.query.domain;

		EmailIn.insert(parsedMessage);
	}

  	return [200, 'ok'];
});


Meteor.Router.add('/api/provision', 'POST', function(id) {
  return [200, 'ok'];
});

Meteor.Router.add('/api/provision', 'GET', function(id) {
  obj = { item1: "item1val", item2: "item2val" };
  return [200, {"Content-Type": "application/json"}, JSON.stringify(obj)];
});

// INSTANCES

//  LIST
//  curl http://localhost:3000/v1/instances -u e26122852dd40a25b0cf163dcb4b9ecb:
//  {"object":"list","url":"v1/instances","data":{"plan":"0","port":31209,"password":"180c1459354e442a9703ffaabbe1e9ce"}}

Meteor.Router.add('/v1/instances', 'GET', function() {
	var apikey = null;
	var owner = null;
	var authorization_header = this.request.headers.authorization;
	if (authorization_header === undefined ||
		authorization_header.match('Basic ') == null) {
		result = {
			code: 401,
			type: "invalid_request_error",
			message: "missing authorization header, please check that your api key is passed with curl -u key:"};
		return [401, {"Content-Type": "application/json"}, JSON.stringify(result)];
	}

	var authorization_decoded = (new Buffer(authorization_header.replace("Basic ",''),'base64')).toString();
	if (authorization_decoded.match(':')) {
		var tmp = authorization_decoded.split(":");
		if (tmp.length == 0) {
			result = {
				code: 401,
				type: "invalid_request_error",
				message: "invalid api key"};
			return [401, {"Content-Type": "application/json"}, JSON.stringify(result)];			
		}
		apikey = tmp[0];
	} else {
		apikey = authorization_decoded;
	}

	if (apikey === null ||
		apikey.length != 32) {
		result = {
			code: 401,
			type: "invalid_request_error",
			message: "invalid api key length"};
		return [401, {"Content-Type": "application/json"}, JSON.stringify(result)];		
	}

	 apikeys_obj = Keys.find({val: apikey, status: "active"}, {fields: {owner:1}}).fetch();
	 if (!apikeys_obj.length ||
	 	apikeys_obj[0] == undefined ||
	 	apikeys_obj[0].owner == null) {
		result = {
			code: 401,
			type: "invalid_request_error",
			message: "invalid api key"};
		return [401, {"Content-Type": "application/json"}, JSON.stringify(result)];	 	
	 } else {
	 	owner = apikeys_obj[0].owner;
	 }

	 if (owner != null) {
		 instances_obj = Instances.find({owner: owner}, {fields: {"port": 1, "password": 1, "plan": 1}}).fetch()[0];
		 _.each(instances_obj, function(a) {
		 	delete instances_obj['_id'];
		 });
		 result = { "object": "list",  "url": "v1/instances", "count": instances_obj.length, "data": instances_obj};
		 return [200, {"Content-Type": "application/json"}, JSON.stringify(result)];
	 }
});
