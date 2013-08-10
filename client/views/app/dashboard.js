Template.dashboard.user = function() {
    return Meteor.user();
};

Template.dashboard.instance = function() {
    return Instances.find().fetch()[0];
}

Template.dashboard.planName = function() {
    return getPlanName(Meteor.user().profile.plan);
};

Template.dashboard.helpers({
    planDetails: function() {
        Meteor.call('getPlanDetails', function(error, res) {
            return res;
        });
    },
    getEventsCount: function() {
        return Events.find({owner: Meteor.userId()}).count();        
    },
    hasExceededEventsLimit: function () {
        return Session.get('exceededEvents');
    }
});
