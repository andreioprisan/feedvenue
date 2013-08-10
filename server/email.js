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
	}
});