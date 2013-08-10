App = window.App || {};

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

Template.questionCreate.onWeb = function() {
    return ((!SessionAmplify.get('oniPhone') && !SessionAmplify.get('oniPad')) || Session.get("current_page") != "eventView");
}
