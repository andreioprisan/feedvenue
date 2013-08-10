App = window.App || {};
var recoverEmailError;

App.recoverEmailSubmit = function () {
	
	// get the values form the input elements 
	var email = $("#email").val();	
	Accounts.forgotPassword({email: email}, function(error){
		if (error) {
			$("#recoverEmail").button('reset');
			if (recoverEmailError >= 1) {
				$("#main div.alert:first").fadeOut(100).fadeIn(100);
			} else {
				$("form#recoverEmailForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
				recoverEmailError = 1;
			}
		} else {
			Meteor.Router.to("/login");
		}
	});
	
};

App.recoverEmailRules = {
	rules: {
		email: {
			required: true,
			email: true
		}
	}
};


App.recoverEmailMessages = {
	messages: {
		email: {
			required: "Please enter your email adress!",
			email: "Your email must look like name@domain.com"
		}
	}
};

App.recoverEmailForm = "#recoverEmailForm";


App.recoverEmailHandleSubmit = {
	submitHandler: function () {
		$("#recoverEmail").button('loading');
		App.recoverEmailSubmit();
		return false;
	}
};

Template.recover_email.rendered = function() {
        App.myValidation (App.recoverEmailRules, App.recoverEmailMessages, App.recoverEmailForm, App.messagePlacement, App.recoverEmailHandleSubmit);    
};