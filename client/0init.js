SessionAmplify = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function(value, key) {
    return [key, JSON.stringify(value)]
  })),
  set: function (key, value) {
    Session.set.apply(this, arguments);
    amplify.store(key, value);
  },
});

Plans = new Meteor.Collection("Plans");
Meteor.subscribe("Plans");

Instances = new Meteor.Collection("Instances");
Meteor.subscribe("Instances");

Customers = new Meteor.Collection("Customers");
Meteor.subscribe("Customers");

Emails = new Meteor.Collection("Emails");
Meteor.subscribe("Emails");

Events = new Meteor.Collection("Events");
EventsStream = Events;
Meteor.subscribe("Events");
Meteor.subscribe("EventsStream");

Phone = new Meteor.Collection("Phone");
Meteor.subscribe("Phone");

SMS = new Meteor.Collection("SMS");
Meteor.subscribe("SMS");

Questions = new Meteor.Collection("Questions");
Meteor.subscribe("Questions");

if (window.location.hostname == "feedvenue.com" || 
	window.location.hostname == "www.feedvenue.com" ||
	window.location.hostname == "direct.feedvenue.com") {
    isProd = 1;
} else {
    isProd = 0;
}

if (!isProd) {
    stripe_public = "pk_test_8oBtvHF4IGcTJ2W9zxd4GFTD";     
} else {
    stripe_public = "pk_live_BDPlE4g3nPfOqIYjt5F27Kfu";
}
Stripe.setPublishableKey(stripe_public);

if (Meteor.is_client) {
    Meteor.startup(function () {
		$('.eventCreatePrivate').popover(
			{	animation: true, 
				html: true, 
				placement: 'top', 
				trigger: "hover", 
				title: "Private", 
				content: "Only those with the event web address can access the event. <br>Do not include this event in the searchable event roster on feedvenue.com."
			}
		);


		$('.eventCreateAnonymous').popover(
			{	animation: true, 
				html: true, 
				placement: 'top', 
				trigger: "hover", 
				title: "Anonymous", 
				content: "Ensure 100% anonymity for all web, mobile, email, phone and SMS question submissions. <br>No user origin data will be stored nor exposed in any way."
			}
		);


		$('.eventCreateEmail').popover(
			{	animation: true, 
				html: true, 
				placement: 'top', 
				trigger: "hover", 
				title: "Email Input", 
				content: "Allow participants to submit multiple questions at the same time through one email.<br>You will get a dedicated event email address."
			}
		);

		$('.eventCreatePhone').popover(
			{	animation: true, 
				html: true, 
				placement: 'top', 
				trigger: "hover", 
				title: "Phone (Voicemail)", 
				content: "Allow participants to call in with their questions. <br>FeedVenue with automatically transcribe from voice to text and submit the question to your event.<br>You will get a dedicated event phone number."
			}
		);

		$('.eventCreateSMS').popover(
			{	animation: true, 
				html: true, 
				placement: 'top', 
				trigger: "hover", 
				title: "SMS (Text Messages)", 
				content: "Allow participants to quickly provide their input through text message. <br>Expand your event feedback pool to those with traditional phones.<br>You will get a dedicated event phone number."
			}
		);


		$('.datePicker').datepicker({
		    format: "mm/dd/yy",
		    autoclose: true,
		    todayHighlight: true
		});

    });
}
