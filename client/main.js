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
    "click .deleteEvent": function(){
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
        return Events.find({owner: Meteor.user()._id});
    },
    hasEventsList: function () {
        return Events.find({owner: Meteor.user()._id}).count() > 0;
    },
});

Template.eventView.eventExists = function() {
    var slug = Session.get("slug");
    return Events.find({slug: slug}).count() > 0;
}

Template.eventView.event = function() {
    var slug = Session.get("slug");
    return Events.find({slug: slug}).fetch()[0];
}

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
        var profile = Meteor.user().profile;
        return profile.name;
    },

    id: function() {
        return Meteor.user()._id;
    }
});

Template.header.helpers({
    name: function() {
        var profile = Meteor.user().profile;
        return profile.name;
    },

    _id: function() {
        return Meteor.user()._id;
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