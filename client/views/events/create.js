App = window.App || {};

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
