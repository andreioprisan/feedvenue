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

Template.dashboard.events({

});

Template.eventCreate.planFeatures = function() {
    var planFeatures = {};
    planFeatures.eventCreatePrivate = SessionAmplify.get('eventCreatePrivate');
    planFeatures.eventCreateEmail = SessionAmplify.get('eventCreateEmail');
    planFeatures.eventCreatePhone = SessionAmplify.get('eventCreatePhone');
    planFeatures.eventCreateSMS = SessionAmplify.get('eventCreateSMS');
    planFeatures.eventCreateTwitter = SessionAmplify.get('planTwitter');
    planFeatures.eventCreateBranding = SessionAmplify.get('planBranding');
    planFeatures.eventCreateSupport = SessionAmplify.get('planSupport');
    planFeatures.eventCreateSentiment = SessionAmplify.get('planSentiment');

    return planFeatures;
}

Template.eventCreate.startDateDefault = function() {
    return moment().format("MM/DD/YY");
}

Template.eventCreate.endDateDefault = function() {
    return moment().add('days',1).format("MM/DD/YY");    
}

Template.questionCreate.onWeb = function() {
    return ((!SessionAmplify.get('oniPhone') && !SessionAmplify.get('oniPad')) || Session.get("current_page") != "eventView");
}

Template.eventCreate.rendered = function() {
        App.myValidation (App.eventCreateRules, App.eventCreateMessages, App.eventCreateForm, App.messagePlacement, App.eventCreateHandleSubmit);
        $('.eventCreatePrivate').popover(
            {   animation: true, 
                html: true, 
                placement: 'top', 
                trigger: "hover", 
                title: "Private", 
                content: "Only those with the event web address can access the event. <br>Do not include this event in the searchable event roster on feedvenue.com."
            }
        );


        $('.eventCreateAnonymous').popover(
            {   animation: true, 
                html: true, 
                placement: 'top', 
                trigger: "hover", 
                title: "Anonymous", 
                content: "Ensure 100% anonymity for all web, mobile, email, phone and SMS question submissions. <br>No user origin data will be stored nor exposed in any way."
            }
        );


        $('.eventCreateEmail').popover(
            {   animation: true, 
                html: true, 
                placement: 'top', 
                trigger: "hover", 
                title: "Email Input", 
                content: "Allow participants to submit multiple questions at the same time through one email.<br>You will get a dedicated event email address."
            }
        );

        $('.eventCreatePhone').popover(
            {   animation: true, 
                html: true, 
                placement: 'top', 
                trigger: "hover", 
                title: "Phone (Voicemail)", 
                content: "Allow participants to call in with their questions. <br>FeedVenue with automatically transcribe from voice to text and submit the question to your event.<br>You will get a dedicated event phone number."
            }
        );

        $('.eventCreateSMS').popover(
            {   animation: true, 
                html: true, 
                placement: 'top', 
                trigger: "hover", 
                title: "SMS (Text Messages)", 
                content: "Allow participants to quickly provide their input through text message. <br>Expand your event feedback pool to those with traditional phones.<br>You will get a dedicated event phone number."
            }
        );


        $('.datePicker').datepicker({
            format: "mm/dd/yy",
            autoclose: true,
            todayHighlight: true
        });

};

Template.publicevents.helpers({
    events: function () {
        return Events.find({"features.private": false});
    },
});

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
    getEventsCount: function() {
        return Events.find({owner: Meteor.userId()}).count();        
    },
    hasExceededEventsLimit: function () {
        return Session.get('exceededEvents');
    }
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

UserVoice = window.UserVoice || [];

Template.footer.helpers({
    onWeb: function() {
        return ((!SessionAmplify.get('oniPhone') && !SessionAmplify.get('oniPad')) || Session.get("current_page") != "eventView");
    }
});


Template.footer.events({
    "click .showClassicWidget": function(event){
      UserVoice.push(['showLightbox', 'classic_widget', {
        mode: 'full',
        primary_color: '#cc6d00',
        link_color: '#007dbf',
        default_mode: 'support',
        forum_id: 217839
      }]);
    },
});


Template.eventlist.user = function() {
    return Meteor.user();
};

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
    },
    onWeb: function() {
        return ((!SessionAmplify.get('oniPhone') && !SessionAmplify.get('oniPad')) || Session.get("current_page") != "eventView");
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