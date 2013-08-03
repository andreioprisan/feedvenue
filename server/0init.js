Meteor.startup(function () {

    process.env.MAIL_URL = "smtp://postmaster%40feedvenue.com:562jnvpdtdj9@smtp.mailgun.org:587";

	Plans = new Meteor.Collection("Plans");
	Customers = new Meteor.Collection("Customers");

	EmailIn = new Meteor.Collection("EmailIn");
	Emails = new Meteor.Collection("Emails");
	Phone = new Meteor.Collection("Phone");
	SMS = new Meteor.Collection("SMS");

	Instances = new Meteor.Collection("Instances");
	Keys = new Meteor.Collection("Keys");

	if (Plans.find().count() == 0) {
		//Plans.remove({});
		Plans.insert({name: "free", id: 0, questions: -1, events: 5, voicemail: 0, sms: 0, twitter: 0, topics: 0, sentiment: 0, email: 0, branding: 0, support: 0});
		Plans.insert({name: "early", id: 3, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
		Plans.insert({name: "growth", id: 1, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
		Plans.insert({name: "enterprise", id: 2, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
		Plans.insert({name: "custom", id: 9, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
	}

	Meteor.publish("Emails", function () {
	  return Emails.find({owner: this.userId});
	});

	Meteor.publish("EmailIn", function () {
	  return EmailIn.find({owner: this.userId});
	});

	Meteor.publish("Phone", function () {
	  return Phone.find({owner: this.userId});
	});

	Meteor.publish("SMS", function () {
	  return SMS.find({owner: this.userId});
	});

	Meteor.publish("Plans", function () {
	  return Plans.find();
	});

	Meteor.publish("Instances", function () {
	  return Instances.find({owner: this.userId});
	});

	Meteor.publish("Customers", function () {
	  return Customers.find({owner: this.userId});
	});

	Meteor.publish("Keys", function () {
	  return Customers.find({owner: this.userId});
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

