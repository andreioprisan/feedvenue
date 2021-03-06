Meteor.methods({
	myValidation: function (theseRules, theseMessages, thisForm, thisPlacement, handleSubmit) {
		var validateThis = _.extend({}, theseRules, theseMessages, thisPlacement, handleSubmit);
		$(thisForm).validate(
			validateThis
		);
		$(thisForm).keyup(function() {
			$(":focus", this).valid();
		});
	},
	provision: function (data) {
		Customers.insert({signupDate: moment().format(), planId: data.data.planId, owner: data.user._id, username: data.data.email, customer_id: data.data.customer_id});
    },
    createCustomerFromCard: function (data) {
		var Future = Npm.require('fibers/future');
		var fut = new Future();

    	var name = data.name;
    	var email = data.email;
    	var ccnum = data.ccnum;
    	var ccmonth = data.ccmonth;
    	var ccyear = data.ccyear;
    	var cczip = data.cczip;
    	var planId = data.planId;
    	var coupon = data.coupon;

    	if (!planId) {
			planId = 0;
		}

		console.log('called server side Stripe.customers.create');
    	Stripe.customers.create({
    		card: {
		        number: ccnum,
		        exp_month: ccmonth,
		        exp_year: ccyear,
		        name: name,
		        address_zip: cczip		        
		    },
		    coupon: coupon,
		    email: email,
		    description: email,
		    plan: planId
    	}, 
		function(err, customer) {
	        if (err) {
	            fut.ret(({_id: "0", error: 1}));
	        } else {
		        fut.ret({_id: customer.id, error: 0});
		    }
	    });

	    return fut.wait();
	    
    },
    eventCreatePhone: function (data) {
		var Future = Npm.require('fibers/future');
		var fut = new Future();

		var error = 0;
        var dataout = {};
		var slug = Random.id().substr(0,4).toLowerCase();

    	twilio.availablePhoneNumbers('US').local.list({ areaCode: "415"}, function(err1, numbers) 
    	{
			var newPhoneNumber = numbers.available_phone_numbers[0];
			if (!err1) 
			{
				twilio.incomingPhoneNumbers.create({
		            phoneNumber: newPhoneNumber.phone_number,
	                VoiceUrl: "https://feedvenue.com/api/twiml/voice",
					VoiceMethod: "POST",
					SmsUrl: "https://feedvenue.com/api/twiml/sms",
					SmsMethod: "POST"
		        }, function(err2, purchasedNumber) {
		        	if (!err2) 
		        	{
			        	purchasedNumber.owner = this.userId;
						purchasedNumber.slug = slug;
						delete purchasedNumber.nodeClientResponse;

			            dataout.phone = purchasedNumber;
			            dataout.phone.owner = this.userId;
			            dataout.event = {
				    		slug: slug,
				    		name: data.inputEventName, 
				    		location: data.inputLocation,
				    		description: data.inputDescription,
				    		hashtag: data.inputHashtag,
				    		startdate: data.inputStartDate,
				    		enddate: data.inputEndDate,
				    		owner: this.userId,
				    		questions: 0,
				    		features: {
				    			private: data.inputPrivate,
				    			anonymous: data.inputAnonymous,
				    			phone: data.inputPhone,
				    			sms: data.inputSMS,
				    			email: data.inputEmail
				    		},
				    		phone: purchasedNumber.friendly_name
				    	};

				    } else {
				    	error = 1;
				    }

					fut.ret(dataout);
		        });
			} else {
				error = 2;
			}
		});

		return fut.wait();
    },
    eventCreatePhoneSave: function (data) {
    	data.event.owner = this.userId;
    	data.phone.owner = this.userId;

		if (data.event) {
			Events.insert(data.event);
		}
		if (data.phone) {
			Phone.insert(data.phone);
		}

		var currentEventsCreated = Events.find({owner: this.userId}).count();
		var userDetails = Customers.findOne({owner: this.userId});
		var planDetails = Plans.findOne({id: parseInt(userDetails.planId)});
		return  planDetails.events - currentEventsCreated;
    },
    eventCreate: function (data) {
		var slug = Random.id().substr(0,4).toLowerCase();
	    var eventDetails = {
				slug: slug,
	    		name: data.inputEventName, 
	    		location: data.inputLocation,
	    		description: data.inputDescription,
	    		hashtag: data.inputHashtag,
	    		startdate: data.inputStartDate,
	    		enddate: data.inputEndDate,
	    		owner: this.userId,
	    		questions: 0,
	    		features: {
	    			private: data.inputPrivate,
	    			anonymous: data.inputAnonymous,
	    			phone: data.inputPhone,
	    			sms: data.inputSMS,
	    			email: data.inputEmail,
	    		},
	    		phone: "not available"
	    	};
		Events.insert(eventDetails);

        var currentEventsCreated = Events.find({owner: this.userId}).count();
    	var userDetails = Customers.findOne({owner: this.userId});
        var planDetails = Plans.findOne({id: parseInt(userDetails.planId)});
		return  planDetails.events - currentEventsCreated;		
    },
    questionCreate: function (data) {
    	var eventDetails = Events.find({slug: data.slug}).fetch()[0];
    	if (eventDetails.features.anonymous == true &&
    		(data.source == "email" || data.source == "voicemail" || data.source == "sms")) {
    		data.inputName = "anonymous";
    	}
    	var ownerId = eventDetails.owner;
    	if (ownerId) {
	    	Questions.insert({
	    		q: data.inputQuestion, 
	    		a: data.inputName, 
	    		owner: ownerId, 
	    		d: moment().format('MM/DD/YY h:mm A'), 
	    		st: 'active', 
	    		s: data.source, 
	    		r: 0, 
	    		slug: data.slug
	    	});
	        Events.update({slug: data.slug}, {$inc: {questions: 1}});
    	}
    },
	questionUpvote: function (questionId) {
        Questions.update(questionId, {$inc: {r: 1}});
    },
	questionDownvote: function (questionId) {
        Questions.update(questionId, {$inc: {r: -1}});
    },
	questionDelete: function (questionId, eventId) {
        Questions.remove(questionId);
        Events.update(eventId, {$inc: {questions: -1}});
    },
    hasExceededEventsLimit: function() {
    	var userDetails = Customers.findOne({owner: this.userId});
        var planDetails = Plans.findOne({id: parseInt(userDetails.planId)});
        var eventsLimit = planDetails.events;
    	
    	if (Events.find({owner: this.userId}).count() >= eventsLimit)
    		return true;
    	else 
    		return false;
	},
	getCurrentPlan: function() {
    	var userDetails = Customers.findOne({owner: this.userId});
        var planDetails = Plans.findOne({id: parseInt(userDetails.planId)});
        return planDetails;
	},
	eventDelete: function(eventId) {
        Events.remove(eventId);

        var currentEventsCreated = Events.find({owner: this.userId}).count();
    	var userDetails = Customers.findOne({owner: this.userId});
        var planDetails = Plans.findOne({id: parseInt(userDetails.planId)});
		return  planDetails.events - currentEventsCreated;
	},
	getLeftoverEventsCount: function() {
        var currentEventsCreated = Events.find({owner: this.userId}).count();
    	var userDetails = Customers.findOne({owner: this.userId});
        var planDetails = Plans.findOne({id: parseInt(userDetails.planId)});
		return  planDetails.events - currentEventsCreated;		
	}
});
