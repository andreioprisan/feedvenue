SessionAmplify = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function(value, key) {
    return [key, JSON.stringify(value)]
  })),
  set: function (key, value) {
    Session.set.apply(this, arguments);
    amplify.store(key, value);
  },
});

Session.set('exceededEvents', true);
Session.set('eventsLeft', 0);

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
		

    });
}
