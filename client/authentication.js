App = window.App || {};
var LoginErr, createUserError, recoverEmailError, passwordUpdateError;


/*==========  SIGNUP  ==========*/

App.signupRules = {
	rules: {
		usernameSignup: {
			required: true,
			alphanumeric: true,
			minlength: 6
		},
		emailSignup: {
			required: true,
			email: true
		},
		passwordSignup: {
			required: true
		},
		password_againSignup: {
			required: true,
			equalTo: "#passwordSignup",
			minlength: 6,
			maxlength: 50
		},
		nameSignup: {
			required: true,
			minlength: 2,
			maxlength: 100
		},
		ccNum: {
			required: true,
			minlength: 10,
			maxlength: 30
		},
		zipCode: {
			required: true,
			minlength: 3,
			maxlength: 20
		},		
	}
};


App.signupMessages = {
	messages: {
		usernameSignup: {
			required: "<strong>Note!</strong> required *",
			alphanumeric: "Must be alphanumerical",
			minlength: "must be at least 2 chars"
		},
		emailSignup: {
			required: "Please enter your email adress",
			email: "Your email must be in the format of name@domain.com"
		},
		password_againSignup: {
			required: "Retype your password",
			equalTo: "The passwords have to match",
			minlength: "At least 3 chars!",
			maxlength: "No longer then 12 chars!"
		},
		nameSignup: {
			required: "What is your name?",
			minlength: "At least 2 chars!",
			maxlength: "no longer then 50 chars!"
		},
		creditCardNumber: {
			required: "Please enter a valid credit card number",
		},
		zipCode: {
			required: "Please enter your billing zip code",
		},			
	}
};

App.signupForm = "#signupForm"

/*==========  LOGIN  ==========*/

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

/*==========  EVENTCREATE  ==========*/

App.eventCreateRules = {
	rules: {
		inputEventName: {
			required: true,
			minlength: 1
		},
		inputLocation: {
			required: true,
			minlength: 1
		},
		inputDescription: {
			required: true,
			minlength: 4
		},
		inputHashtag: {
			required: false,
			minlength: 3,
			maxlength: 30
		},
		inputStartDate: {
			required: true,
			minlength: 8,
			maxlength: 8
		},
		inputEndDate: {
			required: true,
			minlength: 8,
			maxlength: 8
		},
	}
};


App.eventCreateMessages = {
	messages: {
		inputEventName: {
			required: "<strong>Please enter an event name</strong>",
			minlength: "Must be at least 1 character long."
		},
		inputLocation: {
			required: "<strong>Please enter an event location</strong>",
			minlength: "Must be at least 1 character long."
		},
		inputDescription: {
			required: "<strong>Please enter an event description</strong>",
			minlength: "Must be at least 4 characters long."
		},
		inputHashtag: {
			minlength: "Must be at least 3 characters long.",
			maxlength: "Cannot exceed 30 characters long."
		},
		inputStartDate: {
			required: "<strong>Please enter an event start date</strong>",
			minlength: "Must be of the format MM/DD/YY",
			maxlength: "Must be of the format MM/DD/YY"
		},
		inputEndDate: {
			required: "<strong>Please enter an event end date</strong>",
			minlength: "Must be of the format MM/DD/YY",
			maxlength: "Must be of the format MM/DD/YY"
		},			
	}
};

App.eventCreateForm = "#createEventForm"


App.eventCreateHandleSubmit = {
	submitHandler: function () {
		$("#createEventForm #createEventFormSubmitButton").html('creating event, please wait!').addClass('disabled');
		App.eventCreateSubmit();
		return false;
	}
};

App.eventCreateSubmit = function () {
	form={};
    $.each($('#createEventForm').serializeArray(), function() {
        form[this.name] = this.value;
    });
    if (!form.inputHashtag) {
    	form.inputHashtag = null;
    }
    
	form.inputPrivate = $('#createEventForm #inputPrivate').is(':checked');
	form.inputAnonymous = $('#createEventForm #inputAnonymous').is(':checked');
	form.inputPhone = $('#createEventForm #inputPhone').is(':checked');
	form.inputSMS = $('#createEventForm #inputSMS').is(':checked');
	form.inputEmail = $('#createEventForm #inputEmail').is(':checked');
	createEventFormError = 0;

	if (form.inputPhone || form.inputSMS) {
	    Meteor.call('eventCreatePhone', form, function(error, eventCreatePhoneRes) {
	    	if (!error) {
			    Meteor.call('eventCreatePhoneSave', eventCreatePhoneRes, function(error, res) {
			    	if (!error) {
					    Session.set('eventsLeft', res);
			            if (res <= 0) {
			                Session.set('exceededEvents', true);
			            } else {
			                Session.set('exceededEvents', false);                   
			            }
						Meteor.Router.to("/event/list");
			    	}
			    });
	    	} else {
				$("#createEventForm #createEventFormSubmitButton").button('reset');
				if (createEventFormError >= 1) {
					$("#main div.alert:first").fadeOut(100).fadeIn(100);
				} else {
					$("form#createEventForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
					createEventFormError = 1;
				}    		
	    	}
	    });
	} else {
	    Meteor.call('eventCreate', form, function(error, res) {
	    	if (!error) {
	            Session.set('eventsLeft', res);
	            if (res <= 0) {
	                Session.set('exceededEvents', true);
	            } else {
	                Session.set('exceededEvents', false);                   
	            }
				Meteor.Router.to("/event/list");
	    	} else {
				$("#createEventForm #createEventFormSubmitButton").button('reset');
				if (createEventFormError >= 1) {
					$("#main div.alert:first").fadeOut(100).fadeIn(100);
				} else {
					$("form#createEventForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
					createEventFormError = 1;
				}    		
	    	}
	    });
	}

    return false;
};

/* create question */

App.questionCreateRules = {
	rules: {
		inputQuestion: {
			required: true,
			minlength: 10
		}
	}
};


App.questionCreateMessages = {
	messages: {
		inputQuestion: {
			required: "<strong>Please enter a question</strong>",
			minlength: "Must be at least 10 characters long."
		}	
	}
};

App.questionCreateForm = "#createQuestionForm"


App.questionCreateHandleSubmit = {
	submitHandler: function () {
		App.questionCreateSubmit();
		return false;
	}
};


App.questionCreateSubmit = function () {
	form={};
    $.each($('#createQuestionForm').serializeArray(), function() {
        form[this.name] = this.value;
    });
    form.slug = Session.get('slug');
    if (SessionAmplify.get('oniPhone')) {
	    form.source = "iPhone";
    } else if (SessionAmplify.get('oniPad')) {
	    form.source = "iPad";
    } else if (SessionAmplify.get('onAndroid')) {
	    form.source = "iPad";
    } else {
	    form.source = "web";
    }

	createQuestionFormError = 0;

    Meteor.call('questionCreate', form, function(error, res) {
    	if (!error) {
			//Meteor.Router.to("/"+Session.get('slug'));
			$('#createQuestionForm input').val('');
    	} else {
			if (createQuestionFormError >= 1) {
				$("#main div.alert:first").fadeOut(100).fadeIn(100);
			} else {
				$("form#createQuestionForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
				createQuestionFormError = 1;
			}    		
    	}
    });

    return false;
};

Template.questionCreate.rendered = function() {
        App.myValidation (App.questionCreateRules, App.questionCreateMessages, App.questionCreateForm, App.messagePlacement, App.questionCreateHandleSubmit);    
};


//



/* */
App.createNewUserAccount = function (data) {
	Accounts.createUser({
		username: data.email, 
		password: data.password, 
		email: data.email, 
		profile: {
			name: data.name,
			plan: data.planId
		}
	}, function(error, other) {		
		if (error) {
			$('.alert.alert-error').first().remove();
			$("#createUser").button('reset');
			$("form#signupForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
		} else {
			var planDetails = Plans.find({id: parseInt(data.planId)}).fetch()[0];
			var planName = planDetails.name;

		    Meteor.call('provision', {data: data, user: Meteor.user()}, function(err, res) {
				Meteor.call('email', {data: data, user: Meteor.user(), type: "welcome", planName: planName});
		    	if (Meteor.user() != undefined)
					Meteor.Router.to("/users/"+Meteor.user()._id+"");
		    });
		}
	});
}

App.createUserAccount = function () {
	var dataBlob = { 
		name: $("#nameSignup").val(),
		email: $("#emailSignup").val().toLowerCase(),
		password: $("#passwordSignup").val(),
		planId: $("#plan").val(),
		customer_id: null 
	};

	if (dataBlob.planId != 0 && $("#ccNum").val() != "") {
		dataBlob.ccnum = $("#ccNum").val();
		dataBlob.ccmonth = $("#ccMonth").val();
		dataBlob.ccyear = $("#ccYear").val();
		dataBlob.cczip = $("#zipCode").val();
		
	    Meteor.call('createCustomerFromCard', dataBlob, function(error, stripe_response) {
	    	if (!stripe_response.error) {
				Session.set('cardchargesuccess', 1);
				dataBlob.customer_id = stripe_response._id;

	    		App.createNewUserAccount(dataBlob);
	    	} else {
				$('.alert.alert-error').first().remove();
				$("#createUser").button('reset');
				$("form#signupForm").before("<div class='alert alert-error'>Your card could not be charged. Please try again</div>");
				Session.set('cardchargesuccess', 0);
	    	}
    	}
	    );
	} else {
		App.createNewUserAccount(dataBlob );
	}
};

App.messagePlacement = {
	onkeyup: false,
	debug: false,
	errorElement: "div",
	success: function(label) {
		label.html("<strong>Ok!</strong>");
		label.parent("div.alert").removeClass("alert-info alert-error").addClass("alert-success").addClass("hide");
	},
	errorPlacement: function(error, element) {
		if (element.parent().children("div.alert").length < 1) {
			var help_block = element.parent().children("div.help-block");
			if(help_block.length < 1) {
				element.parent().append("<div class='alert alert-error hide'></div>");
			} else {
				help_block.removeClass("help-block muted").removeClass("hide").addClass("alert alert-error");
			}
			element.next("div.alert").html(error);
		} else {
			element.next("div.alert").html(error);
		}
	},
	highlight: function(element, errorClass, validClass) {
		$(element).next("div.alert").removeClass("alert-info alert-success").addClass("alert-error").removeClass("hide");
	},
	unhighlight: function(element, errorClass, validClass) {
		$(element).next("div.alert").removeClass("alert-error alert-info").addClass("alert-success");
	}
};

App.signupHandleSubmit = {
	submitHandler: function () {
		$("#createUser").button('loading');
		App.createUserAccount();
		return false;
	}
};



/*==========  LOGIN  ==========*/
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




/*==========  EDIT PROFILE  ==========*/

App.editUserAccount = function () {
	var name = $("#name").val();	
	var bio = $("#bio").val();	

	Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.name": name, "profile.bio": bio}});
	$("#editProfileForm div.alert").remove();
	$("#saveEdit").button('reset');
	
	Meteor.Router.to("/users/" + Meteor.userId());
	
};


App.editProfileRules = {
	rules: {
		name: {
			required: true,
			minlength: 5,
			maxlength: 100
		},
	}
};


App.editProfileMessages = {
	messages: {
		name: {
			required: "What is your name?",
			minlength: "Your name must be least 5 characters long!",
			maxlength: "Your name can be no longer than 100 chars!"
		}
	}
};

App.editProfileForm = "#editProfileForm";


App.editProfileHandleSubmit = {
	submitHandler: function () {
		$("#saveEdit").button('loading');
		App.editUserAccount();
		return false;
	}
};




/*==========  RECOVERY EMAIL  ==========*/

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




/*==========  PASSWORD UPDATE  ==========*/

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

