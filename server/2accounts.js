
Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
  return Meteor.absoluteUrl('enroll-account/' + token);
};

Accounts.config({sendVerificationEmail: false, forbidClientAccountCreation: false});

Accounts.onCreateUser(function (options, user) {
	user.profile = options.profile;
//	Accounts.sendVerificationEmail(user._id, user.emails[0].address);
	return user;
});

Meteor.methods({
	email: function (data) {
	    this.unblock();
	    if (data.data.email != undefined) {
	    	var emailPayload = {};
	    	if (data.type == "welcome") {
				var emailPayload = {
					to: data.data.email,
				    subject: 'Welcome to FeedVenue!',
				    text: 	'Hi '+data.user.profile.name+",\n\n"+
				    		"Thank you for signing up for the "+data.planName+" FeedVenue account!\n\n"+
				    		"Thanks,\nThe FeedVenue Team\nfeedvenue.com | @feedvenue"
				    }

	    	}
			  
			console.log(emailPayload);

			if (emailPayload.to != undefined &&
				emailPayload.subject != undefined &&
				emailPayload.text != undefined) {
				Email.send({
			      to: emailPayload.to,
			      from: "FeedVenue Team <team@feedvenue.com>",
			      subject: emailPayload.subject,
			      text: emailPayload.text
			    });
			}
	    }
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
	    
    }
  });

