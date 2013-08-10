
Template.eventView.events({
    "click .deleteQuestion": function(event){
        event.preventDefault();
        Meteor.call('questionDelete', this._id, Session.get("eventId"));
    },
    "click .upvote": function(event){
        event.preventDefault();
        if (!Session.get("up"+this._id)) {
            Session.set("up"+this._id, true);
            Meteor.call('questionUpvote', this._id);
        }
    },
    "click .downvote": function(event){
        event.preventDefault();
        if (!Session.get("down"+this._id)) {
            Session.set("down"+this._id, true);
            Meteor.call('questionDownvote', this._id);
        }
    },
    "click #mobileSet1": function(e, i) {
        if (e.toElement.id == "mobileViewAsk") {
            Session.set("mobileViewAsk", true);
            Session.set("mobileViewInfo", false);
        } else {
            Session.set("mobileViewAsk", false);
            Session.set("mobileViewInfo", true);            
        }
    },    
    "click #mobileSet2": function(e, i) {
        if (e.toElement.id == "mobileSortNew") {
            Session.set("mobileSortNew", true);
            Session.set("mobileSortPopular", false);
        } else {
            Session.set("mobileSortNew", false);
            Session.set("mobileSortPopular", true);            
        }
    },
});


Template.eventView.helpers({
    toggle_mobileSortNew: function () {
        if (Session.get("mobileSortNew")) {
            return 'active';
        }
    },
    toggle_mobileSortPopular: function () {
        if (Session.get("mobileSortPopular")) {
            return 'active';
        }
    },
    show_mobileViewInfo: function () {
        if (Session.get("mobileViewInfo")) {
            return true;
        } else {
            return false;
        }
    },
    show_mobileViewAsk: function () {
        if (Session.get("mobileViewAsk")) {
            return true;
        } else {
            return false;
        }
    },
    toggle_mobileViewInfo: function () {
        if (Session.get("mobileViewInfo")) {
            return 'active';
        }
    },
    toggle_mobileViewAsk: function () {
        if (Session.get("mobileViewAsk")) {
            return 'active';
        }
    },
    event: function () {
        var eventsStream = EventsStream.findOne({slug: Session.get("slug")});
        Session.set("eventId", eventsStream._id);
        if (eventsStream.phone == "not available") {
            eventsStream.showPhone = false;
        } else {
            eventsStream.showPhone = true;
        }

        return eventsStream;
    },
    eventExists: function () {
        var eventsCount = EventsStream.find({slug: Session.get("slug")}).count();
        if (eventsCount) {
            return true;
        } else {
            return false;
        }
    },
    questions: function() {
        if (Session.get("mobileSortPopular")) {
            return Questions.find({slug: Session.get("slug")}, {sort: {r: -1, d: 1}});
        } else {
            return Questions.find({slug: Session.get("slug")}, {sort: {d: -1, r: 1}});
        }
    },
    questionsExist: function() {
        var questionsCount = Questions.find({slug: Session.get("slug")}).count();
        if (questionsCount) {
            return questionsCount;
        } else {
            return false;
        }
    },
    isAdministrator: function() {
        if (EventsStream.findOne({slug: Session.get("slug")}).owner == Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },
    oniPhone: function() {
        return SessionAmplify.get('oniPhone');
    },
    oniPad: function() {
        return SessionAmplify.get('oniPad');
    },
    onWeb: function() {
        return ((!SessionAmplify.get('oniPhone') && !SessionAmplify.get('oniPad')) || Session.get("current_page") != "eventView");
    }
});
