App = window.App || {};
var passwordUpdateError;

App.passwordUpdateSubmit = function () {
	var password = $("#passwordUpdate").val();	
	Accounts.resetPassword(Session.get('resetPassword'), password, function(error){
		if (error) {
			$("#passwordUpdateBtn").button('reset');
			if (passwordUpdateError >= 1) {
				$("#main div.alert:first").fadeOut(100).fadeIn(100);
			} else {
				$("form#passwordUpdateForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
				passwordUpdateError = 1;
			}
		} else {
			Meteor.Router.to("/login");
		}
	});
	
};


App.passwordUpdateRules = {
	rules: {
		passwordUpdate: {
			required: true,
			minlength: 3,
			maxlength: 50
		},
		password_againUpdate: {
			required: true,
			equalTo: "#passwordUpdate",
			minlength: 3,
			maxlength: 50
		},
	}
};


App.passwordUpdateMessages = {
	messages: {
		passwordUpdate: {
			required: "Please enter a valid password",
			minlength: "Your password must be least 3 characters long!",
			maxlength: "Your password can be no longer than 50 chars!"
		},
		password_againUpdate: {
			required: "Please confirm your password",
			equalTo: "Your passwords do not match! Please try again",
			minlength: "Your password must be least 3 characters long!",
			maxlength: "Your password can be no longer than 50 chars!"
		}
	}
};

App.passwordUpdateForm = "#passwordUpdateForm";

App.passwordUpdateHandleSubmit = {
	submitHandler: function () {
		$("#passwordUpdateBtn").button('loading');
		App.passwordUpdateSubmit();
		return false;
	}
};

Template.password_update.rendered = function() {
    if(Session.get("resetPassword")) {
        App.myValidation (App.passwordUpdateRules, App.passwordUpdateMessages, App.passwordUpdateForm, App.messagePlacement, App.passwordUpdateHandleSubmit);    
    } 
};
