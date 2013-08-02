Plans = new Meteor.Collection("Plans");
Meteor.subscribe("Plans");

Instances = new Meteor.Collection("Instances");
Meteor.subscribe("Instances");

Customers = new Meteor.Collection("Customers");
Meteor.subscribe("Customers");

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


