App = window.App || {};
var LoginErr, createUserError, recoverEmailError, passwordUpdateError;

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
        dataBlob.coupon = $("#couponCode").val();
        
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

App.signupHandleSubmit = {
    submitHandler: function () {
        $("#createUser").button('loading');
        App.createUserAccount();
        return false;
    }
};



Template.signup.rendered = function() {
    App.myValidation (App.signupRules, App.signupMessages, App.signupForm, App.messagePlacement, App.signupHandleSubmit);
};

Template.signup.events({
    "change #plan": function(event){
        var plan = event.srcElement.value;
        if (plan != 0) {
            $('#paymentInfo').show().removeClass('hide');
        } else {
            $('#paymentInfo').hide().addClass('hide');    
        }
    }
});

Template.signup.plan = function() {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    if (plan) {
        $('#paymentInfo').show().removeClass('hide');
    } else {
        $('#paymentInfo').hide().addClass('hide');    
    }
};

