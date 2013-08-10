App = window.App || {};
var LoginErr, createUserError, recoverEmailError, passwordUpdateError;

App.loginRules = {
	rules: {
		usernameLogin: {
			required: true,
			minlength: 6,
			email: true			
		},
		passwordLogin: {
			required: true,
			minlength: 3
		}
	}
};

App.loginMessages = {
	messages: {
		usernameLogin: {
			required: "<strong>Please enter an email address!</strong>",
			minlength: "Must be at least 6 characters long"
		}, 
		passwordLogin: {
			required: "<strong>Please enter a password!</strong>",
			minlength: "Must be at least 3 characters long"
		}
	}
};

App.loginForm = "#loginForm"

App.loginHandleSubmit = {
	submitHandler: function () {
		$("#login").button('loading');
		$("#loginForm div .alert").remove();
		App.login();
		return false;
	}
};

var getPlanDetails = null;
App.login = function () {
	var username = $("#usernameLogin").val();
	var password = $("#passwordLogin").val();
	if (username == undefined ||
		password == undefined) {
		$("form#loginForm").before("<div class='alert alert-error'>Please enter a username and password!</div>");
		LoginErr = 1;
		return;		
	}

	Meteor.loginWithPassword(username, password, function (error){
		if (error) {

			if (LoginErr >= 1) {
				$("#main div.alert").fadeOut(100).fadeIn(100);
				LoginErr = LoginErr + 1;
			} else {
				$("form#loginForm").before("<div class='alert alert-error'>Incorrect username and password combination!</div>");
				LoginErr = 1;
			}


			$("#login").button('reset');
		} else {
	        Meteor.call('getLeftoverEventsCount', function(error, res) {
			    Session.set('eventsLeft', res);
	            if (res <= 0) {
	                Session.set('exceededEvents', true);
	            } else {
	                Session.set('exceededEvents', false);                   
	            }

		        Meteor.call('getCurrentPlan', function(error, res) {
				    SessionAmplify.set('eventCreatePrivate', res.private);
				    SessionAmplify.set('eventCreateEmail', res.email);
				    SessionAmplify.set('eventCreatePhone', res.voicemail);
				    SessionAmplify.set('eventCreateSMS', res.sms);
				    SessionAmplify.set('eventCreateEventsLimit', res.events);
				    SessionAmplify.set('planName', res.name);
				    SessionAmplify.set('planId', res.name);

				    SessionAmplify.set('planBranding', res.branding);
				    SessionAmplify.set('planSupport', res.support);
				    SessionAmplify.set('planTwitter', res.twitter);
				    SessionAmplify.set('planSentiment', res.sentiment);

					Meteor.Router.to("/users/"+Meteor.user()._id+"");
				});
	        });
		}
	});
}

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
