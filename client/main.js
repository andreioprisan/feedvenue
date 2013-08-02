var App = window.App || {};

// Add 'active' class to current page link
Handlebars.registerHelper('TabActive', function (route) {
    return (route == Session.get("current_page")) ? "active" : "";
});


// Login
Template.login.events({
    "keyup #password": function (event) {
        if (event.type == "keyup" && event.which == 13) {
            console.log("keyup identified enter was pressed");
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




// Signup
Template.signup.rendered = function() {
    App.myValidation (App.signupRules, App.signupMessages, App.signupForm, App.messagePlacement, App.signupHandleSubmit);
};

Template.signup.events({
    "change #plan": function(event){
        if(event.srcElement.value != 0) {
            $('#paymentInfo').show();
        } else {
            $('#paymentInfo').hide();
        }
    }
});

Template.signup.plan = function() {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    if (plan > 0) {
        $('#paymentInfo').show();
    }
};

Handlebars.registerHelper('signup_plan', function (route) {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    return (route == plan) ? "selected" : "";
});

Handlebars.registerHelper('show_signup_plan_payment_section', function (route) {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    return (plan) ? "" : "hide";
});
function showPaymentFields() {
    $('#paymentInfo').show();
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
        return "32MB for free";
    } else {
        return plan[0].name+" at $"+plan[0].cost+"/month";
    }
}

Template.loggedin_header.helpers({
    fullName: function() {
        var profile = Meteor.user().profile;
        return profile.firstName + ' ' + profile.lastName;
    },

    id: function() {
        return Meteor.user()._id;
    }
});

Template.header.helpers({
    fullName: function() {
        var profile = Meteor.user().profile;
        return profile.firstName + ' ' + profile.lastName;
    },

    _id: function() {
        return Meteor.user()._id;
    }
});

Template.password_update.rendered = function() {
    if(Session.get("resetPassword")) {
        // update password
        App.myValidation (App.passwordUpdateRules, App.passwordUpdateMessages, App.passwordUpdateForm, App.messagePlacement, App.passwordUpdateHandleSubmit);    
    } 
};

Template.recover_email.rendered = function() {
    
        // password reset email form
        App.myValidation (App.recoverEmailRules, App.recoverEmailMessages, App.recoverEmailForm, App.messagePlacement, App.recoverEmailHandleSubmit);    
    
    
};