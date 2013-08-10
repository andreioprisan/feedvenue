Meteor.startup(function () {
	twilio = Twilio('ACfb2eee13019a12826319cf09bba4d700','129da8b9d79d701ff9d5eb72ca7cac41');
    process.env.MAIL_URL = "smtp://postmaster%40feedvenue.com:562jnvpdtdj9@smtp.mailgun.org:587";

	var Papertrail = Meteor.require('winston-papertrail').Papertrail;
    logger = Meteor.require('winston');
	logger.add(Papertrail, {
	  host: "logs.papertrailapp.com",
	  port: 49218,
	  logFormat: function(level, message) {
	      return '[' + level + '] ' + message;
	  },
	  inlineMeta: true
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

