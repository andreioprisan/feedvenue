Plans = new Meteor.Collection("Plans");
Meteor.subscribe("Plans");

Instances = new Meteor.Collection("Instances");
Meteor.subscribe("Instances");

Customers = new Meteor.Collection("Customers");
Meteor.subscribe("Customers");

if (window.location.hostname == "redisnode.com" || window.location.hostname == "www.redisnode.com") {
    isProd = 1;
} else {
    isProd = 0;
}

if (!isProd) {
    stripe_public = "pk_test_ujzLsEV3pNMBj9KIv5qkknUC";     
} else {
    stripe_public = "pk_live_voZnzGKwR0aIZ3TjXd0vQhof";
}
Stripe.setPublishableKey(stripe_public);


