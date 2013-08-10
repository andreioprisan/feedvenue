function setLefteventCount() {
    Meteor.call('getLeftoverEventsCount', this._id, function(error, res) {
        Session.set('eventsLeft', res);
        if (res <= 0) {
            Session.set('exceededEvents', true);
        } else {
            Session.set('exceededEvents', false);                   
        }
    });    
}

Template.eventlist.user = function() {
    return Meteor.user();
};

Template.eventlist.events({
    "click .deleteEvent": function(event){
        event.preventDefault();    
        Meteor.call('eventDelete', this._id, function(error, res) {
            Session.set('eventsLeft', res);
            if (res <= 0) {
                Session.set('exceededEvents', true);
            } else {
                Session.set('exceededEvents', false);                   
            }
        });
    },
});

Template.eventlist.helpers({
    eventsList: function () {
        setLefteventCount();
        if (Meteor.user() != undefined)
            return Events.find({owner: Meteor.userId()});
        else
            return null;
    },
    hasEventsList: function () {
        if (Meteor.user() != undefined)
            return Events.find({owner: Meteor.userId()}).count() > 0;
        else
            return null;
    },
    planDetails: function() {
        Meteor.call('getPlanDetails', function(error, res) {
            return res;
        });
    },    
    hasExceededEventsLimit: function () {
        return Session.get('exceededEvents');
    }
});
