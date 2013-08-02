Meteor.startup(function () {
	process.env.MAIL_URL = "smtp://postmaster@feedvenue.com:562jnvpdtdj9@smtp.mailgun.org:465";

	Plans = new Meteor.Collection("Plans");
	Instances = new Meteor.Collection("Instances");
	Customers = new Meteor.Collection("Customers");
	Keys = new Meteor.Collection("Keys");

	if (Plans.find().count() == 0) {
		Plans.insert({name: "free", id: 0, questions: -1, events: 5, voicemail: 0, sms: 0, twitter: 0, topics: 0, sentiment: 0, email: 0, branding: 0, support: 0});
		Plans.insert({name: "growth", id: 1, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
		Plans.insert({name: "enterprise", id: 2, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
		Plans.insert({name: "custom", id: 2, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
	}

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
		stripe_secret = "sk_test_2cGa3day3OCg1ZVTPFPuRetY";
		stripe_public = "pk_test_ujzLsEV3pNMBj9KIv5qkknUC";		
	} else {
		stripe_secret = "sk_live_UEu9EQkB1BdOUOBrzYcXudBG";
		stripe_public = "pk_live_voZnzGKwR0aIZ3TjXd0vQhof";
	}

	Stripe = StripeAPI(stripe_secret);

});

