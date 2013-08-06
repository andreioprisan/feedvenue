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

Template.dashboard.events({
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

Template.eventCreate.planFeatures = function() {
    if (Meteor.userId() && Meteor.hasOwnProperty('user') && Meteor.user().hasOwnProperty('profile')) {
        return Plans.findOne({id: parseInt(Meteor.user().profile.plan)});
    } else {
        return Plans.findOne({id: 0});
    }
}

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
        if (EventsStream.findOne({slug: Session.get("slug")}).owner == Meteor.userId()) {
            return true;
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
    var plan = Plans.find({id: parseInt(id)});
    if (plan.count() == 0) {
        return "free";
    } else {
        return plan.name;
    }
}

Template.loggedin_header.helpers({
    name: function() {
        var profile = Meteor.user().profile;
        return profile.name;
    },

    id: function() {
        return Meteor.userId();
    }

});

Template.header.helpers({
    name: function() {
        if (Meteor.userId()) {
            var profile = Meteor.user().profile;
            return profile.name;
        } else {
            return null;
        }
    },

    _id: function() {
        return Meteor.userId();
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