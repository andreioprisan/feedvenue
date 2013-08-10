Plans = new Meteor.Collection("Plans");
if (Plans.find().count() == 0) {
	//Plans.remove({});
	Plans.insert({name: "free", id: 0, questions: -1, events: 5, voicemail: 0, sms: 0, twitter: 0, topics: 0, sentiment: 0, email: 0, branding: 0, support: 0});
	Plans.insert({name: "early", id: 3, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
	Plans.insert({name: "growth", id: 1, questions: -1, events: 25, voicemail: 1, sms: 1, twitter: 1, topics: 0, sentiment: 0, email: 0, branding: 1, support: 0});
	Plans.insert({name: "enterprise", id: 2, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
	Plans.insert({name: "custom", id: 9, questions: -1, events: -1, voicemail: 1, sms: 1, twitter: 1, topics: 1, sentiment: 1, email: 1, branding: 1, support: 1});
}
