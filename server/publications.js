Meteor.publish("Tweets", function () {
  return Tweets.find();
});	

Meteor.publish("myPlanData", function () {
	var planId = parseInt(Customers.findOne({owner: this.userId}).planId);
	return Plans.find({id: planId});
});

Meteor.publish("EventsStream", function () {
  // this won't work, need better solution
  //return Events.find({"features.private": false});
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
	var userId = this.userId;
	if (userId != null) {
		logger.info('user connected', {userId: userId});

		this.ready();

		this.onStop(function() {
			logger.info('user disconnected', {userId: userId});
		});
	}

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