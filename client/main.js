var App = window.App || {};

// Add 'active' class to current page link
Handlebars.registerHelper('TabActive', function (route) {
    return (route == Session.get("current_page")) ? "active" : "";
});


// Login
Template.login.events({
    "keyup #password": function (event) {
        if (event.type == "keyup" && event.which == 13) {
            App.login();
        }
    },

    "click #login": function(event) {
        App.login();
    }
});

Template.login.rendered = function() {
    App.myValidation (App.loginRules, App.loginMessages, App.loginForm, App.messagePlacement, App.loginHandleSubmit);
};

Template.signup.rendered = function() {
    App.myValidation (App.signupRules, App.signupMessages, App.signupForm, App.messagePlacement, App.signupHandleSubmit);
};

Template.signup.events({
    "change #plan": function(event){
        var plan = event.srcElement.value;
        if (plan != 0) {
            showPaymentFields();
        } else {
            hidePaymentFields();
        }
    }
});

Template.signup.plan = function() {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    if (plan) {
        showPaymentFields();
    } else {
        hidePaymentFields();
    }
};

Handlebars.registerHelper('signup_plan', function (route) {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    if (plan) {
        showPaymentFields();
    } else {
        hidePaymentFields();
    }

    return (route == plan) ? "selected" : "";
});

Handlebars.registerHelper('show_signup_plan_payment_section', function (route) {
    var plan = Session.get("signup_plan");

    if (plan == undefined) {
        plan = 0;
    }

    if (plan) {
        showPaymentFields();
    } else {
        hidePaymentFields();
    }

    return (plan) ? "" : "hide";
});

function hidePaymentFields() {
    $('#paymentInfo').hide().addClass('hide');    
}

function showPaymentFields() {
    $('#paymentInfo').show().removeClass('hide');
}

// Logged in views
Template.editProfile.user = function() {
    return Meteor.user();
};

Template.editProfile.planName = function() {
    return getPlanName(Meteor.user().profile.plan);
};

Template.editProfile.rendered = function() {
    App.myValidation (App.editProfileRules, App.editProfileMessages, App.editProfileForm, App.messagePlacement, App.editProfileHandleSubmit);
};


Template.dashboard.events({
    "click .deleteEvent": function(event){
        event.preventDefault();    
        var eventId = this._id;
        if (eventId) {
            Events.remove(eventId);
        }
    },

});

Template.eventCreate.startDateDefault = function() {
    return moment().format("MM/DD/YY");
}

Template.eventCreate.endDateDefault = function() {
    return moment().add('days',1).format("MM/DD/YY");    
}

Template.eventCreate.rendered = function() {
        App.myValidation (App.eventCreateRules, App.eventCreateMessages, App.eventCreateForm, App.messagePlacement, App.eventCreateHandleSubmit);    
};

Template.dashboard.helpers({
    eventsList: function () {
        if (Meteor.user() != undefined)
            return Events.find({owner: Session.get('uid')});
        else
            return null;
    },
    hasEventsList: function () {
        if (Meteor.user() != undefined)
            return Events.find({owner: Session.get('uid')}).count() > 0;
        else
            return null;
    },
});

Template.eventView.events({
    "click .deleteQuestion": function(event){
        event.preventDefault();
        var id = this._id;
        if (id) {
            Questions.remove(id);
            Events.update(Session.get("eventId"), {$inc: {questions: -1}});
        }
    },
    "click .upvote": function(event){
        event.preventDefault();
        var id = this._id;

        if (id && haveUpvoted[id] != true) {
            Questions.update(id, {$inc: {r: 1}});
            haveUpvoted[id] = true;
        }
    },
    "click .downvote": function(event){
        event.preventDefault();
        var id = this._id;

        if (id && haveDownvoted[id] != true) {
            Questions.update(id, {$inc: {r: -1}});
            haveDownvoted[id] = true;
        }
    }    
});


Template.eventView.helpers({
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
        var questions = Questions.find({slug: Session.get("slug")}, {sort: {r: -1, d: -1}});
        Session.set('votes', questions.count()*2);
        return questions;
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
        if (Session.get('uid') == Meteor.userId()) {
            if (EventsStream.findOne({slug: Session.get("slug")}).owner == Session.get('uid')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
});

Template.dashboard.user = function() {
    return Meteor.user();
};

Template.dashboard.instance = function() {
    return Instances.find().fetch()[0];
}

Template.dashboard.planName = function() {
    return getPlanName(Meteor.user().profile.plan);
};

function getPlanName(id) {
    var plan = Plans.find({id: parseInt(id)}).fetch();
    if (plan.length == 0) {
        return "free";
    } else {
        return plan[0].name+" at $"+plan[0].cost+"/month";
    }
}

Template.loggedin_header.helpers({
    name: function() {
        if (Session.get('uid')) {
            var profile = Meteor.user().profile;
            return profile.name;
        } else {
            return null;
        }
    },

    id: function() {
        return Session.get('uid');
    }
});

Template.header.helpers({
    name: function() {
        if (Session.get('uid')) {
            var profile = Meteor.user().profile;
            return profile.name;
        } else {
            return null;
        }
    },

    _id: function() {
        return Session.get('uid');
    }
});

Template.password_update.rendered = function() {
    if(Session.get("resetPassword")) {
        App.myValidation (App.passwordUpdateRules, App.passwordUpdateMessages, App.passwordUpdateForm, App.messagePlacement, App.passwordUpdateHandleSubmit);    
    } 
};

Template.recover_email.rendered = function() {
        App.myValidation (App.recoverEmailRules, App.recoverEmailMessages, App.recoverEmailForm, App.messagePlacement, App.recoverEmailHandleSubmit);    
};