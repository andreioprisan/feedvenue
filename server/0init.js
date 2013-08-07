Meteor.startup(function () {
	twilio = Twilio('ACfb2eee13019a12826319cf09bba4d700','129da8b9d79d701ff9d5eb72ca7cac41');
    process.env.MAIL_URL = "smtp://postmaster%40feedvenue.com:562jnvpdtdj9@smtp.mailgun.org:587";
	
	/*
	nlp = Nlp;
	var a = "How should web sockets be best secured";
	var b = "What are security best practices with web sockets";
	var NGrams = nlp.NGrams;

	nlp.PorterStemmer.attach();

	console.log(a.tokenizeAndStem())
	console.log(b.tokenizeAndStem())

	sentiment = Sentiment;
	sentiment(a.tokenizeAndStem().toString(), function (err, result) {
		console.log(result);
	});
	sentiment(b.tokenizeAndStem().toString(), function (err, result) {
		console.log(result);
	});

	console.log(nlp.JaroWinklerDistance(a, b));
	console.log(nlp.JaroWinklerDistance(b, a));
	*/


	Plans = new Meteor.Collection("Plans");
	Customers = new Meteor.Collection("Customers");

	Events = new Meteor.Collection("Events");
	EmailIn = new Meteor.Collection("EmailIn");
	Emails = new Meteor.Collection("Emails");
	Phone = new Meteor.Collection("Phone");
	SMS = new Meteor.Collection("SMS");
	//raw tweets
	Tweets = new Meteor.Collection("Tweets");
	Meteor.publish("Tweets", function () {
	  return Tweets.find();
	});	

	Questions = new Meteor.Collection("Questions");

	if (Plans.find().count() == 0) {
		//Plans.remove({});
		Plans.insert({name: "free", id: 0, questions: -1, events: 5, voicemail: 0, sms: 0, twitter: 0, topics: 0, sentiment: 0, email: 0, branding: 0, support: 0});
		Plans.insert({name: "early", id: 3, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
		Plans.insert({name: "growth", id: 1, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
		Plans.insert({name: "enterprise", id: 2, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
		Plans.insert({name: "custom", id: 9, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
	}

	Meteor.publish("myPlanData", function () {
		var planId = parseInt(Customers.findOne({owner: this.userId}).planId);
		return Plans.find({id: planId});
	});

	Meteor.publish("EventsStream", function () {
		// this won't work, need better solution
//	  return Events.find({"features.private": false});
	  return Events.find();
	});	

	Meteor.publish("Events", function () {
	  return Events.find({owner: this.userId});
	});	

	Events.allow({
	  insert: function (userId, doc) {
	    // the user must be logged in, and the document must be owned by the user
	    return (userId && doc.owner === userId);
	  },
	  update: function (userId, doc, fields, modifier) {
	    // can only change your own documents
	    return doc.owner === userId;
	  },
	  remove: function (userId, doc) {
	    // can only remove your own documents
	    return doc.owner === userId;
	  },
	  fetch: ['owner']
	});

	Meteor.publish("Emails", function () {
	  return Emails.find({owner: this.userId});
	});

	Meteor.publish("EmailIn", function () {
	  return EmailIn.find({owner: this.userId});
	});

	twilioRawIn = new Meteor.Collection("​TwilioIn");
	Meteor.publish("TwilioIn", function () {
	  return TwilioIn.find();
	});

	Phone.allow({
	  insert: function (userId, doc) {
	    // the user must be logged in, and the document must be owned by the user
	    return (userId && doc.owner === userId);
	  },
	  update: function (userId, doc, fields, modifier) {
	    // can only change your own documents
	    return doc.owner === userId;
	  },
	  remove: function (userId, doc) {
	    // can only remove your own documents
	    return doc.owner === userId;
	  },
	  fetch: ['owner']
	});

	Meteor.publish("Plans", function () {
	  return Plans.find();
	});

	Meteor.publish("Customers", function () {
	  return Customers.find({owner: this.userId});
	});

	Meteor.publish("Questions", function () {
	  return Questions.find({}, {fields: {a: 1, d: 1, q: 1, r: 1, s: 1, slug: 1}});
	});	

	Questions.allow({
	  insert: function (userId, doc) {
	    // the user must be logged in, and the document must be owned by the user
	    return (userId && doc.owner === userId);
	  },
	  update: function (userId, doc, fields, modifier) {
	  	return (userId && doc.owner === userId);
	  },
	  remove: function (userId, doc) {
	    return (userId && doc.owner === userId);
	  },
	  fetch: ['owner']
	});	

	var os = Npm.require("os");
	if (os.hostname() == "direct.feedvenue.com" ||
		os.hostname() == "feedvenue.com") {
		isProd = 1;
	} else {
		isProd = 0;
	}

	if (!isProd) {
		stripe_secret = "sk_test_2MnplvWHhy52pTBPTP5GHJb2";
		stripe_public = "pk_test_8oBtvHF4IGcTJ2W9zxd4GFTD";		
	} else {
		stripe_secret = "sk_live_LfngklMp7aovdW6WslQKXCdY";
		stripe_public = "pk_live_BDPlE4g3nPfOqIYjt5F27Kfu";
	}

	Stripe = StripeAPI(stripe_secret);

});

