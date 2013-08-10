// production check
if (window.location.hostname == "feedvenue.com" || 
    window.location.hostname == "www.feedvenue.com" ||
    window.location.hostname == "direct.feedvenue.com") {
    isProd = 1;
} else {
    isProd = 0;
}

// set Stripe keys
if (!isProd) {
    stripe_public = "pk_test_8oBtvHF4IGcTJ2W9zxd4GFTD";     
} else {
    stripe_public = "pk_live_BDPlE4g3nPfOqIYjt5F27Kfu";
}
Stripe.setPublishableKey(stripe_public);

Session.set('exceededEvents', true);
Session.set('eventsLeft', 0);
Session.set("mobileViewInfo", true);
Session.set("mobileViewAsk", false);
Session.set("mobileSortNew", false);
Session.set("mobileSortPopular", true);

EventsStream = Events;

Meteor.subscribe("Plans");
Meteor.subscribe("Instances");
Meteor.subscribe("Customers");
Meteor.subscribe("Emails");
Meteor.subscribe("Events");
Meteor.subscribe("EventsStream");
Meteor.subscribe("Questions");

if (Meteor.is_client) {
    Meteor.startup(function () {


    });
}


App = window.App || {};

App.myValidation = function (theseRules, theseMessages, thisForm, thisPlacement, handleSubmit) {
	$(function() {
		var validateThis = _.extend({}, theseRules, theseMessages, thisPlacement, handleSubmit);
		$(thisForm).validate(
			validateThis
		);
		$(thisForm).keyup(function() {
			$(":focus", this).valid();
		});
	});
};

