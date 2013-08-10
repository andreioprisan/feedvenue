var App = window.App || {};


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

App.editUserAccount = function () {
	var name = $("#name").val();	
	var bio = $("#bio").val();	

	Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.name": name, "profile.bio": bio}});
	$("#editProfileForm div.alert").remove();
	$("#saveEdit").button('reset');
	
	Meteor.Router.to("/users/" + Meteor.userId());
	
};


function getPlanName(id) {
    var plan = Plans.find({id: parseInt(id)});
    if (plan.count() == 0) {
        return "free";
    } else {
        return plan.name;
    }
}

Template.editProfile.user = function() {
    return Meteor.user();
};

Template.editProfile.planName = function() {
    return getPlanName(Meteor.user().profile.plan);
};

Template.editProfile.rendered = function() {
    App.myValidation (App.editProfileRules, App.editProfileMessages, App.editProfileForm, App.messagePlacement, App.editProfileHandleSubmit);
};


