
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
    provision: function (data) {
    	var password = data.password;
    	var connections = data.connections;
    	var memory = data.memory;
    	var databases = data.databases;
    	var port = data.port;
    	var planId = data.planId;

		if (planId === null ||
			port == null ||
			databases == null || 
			memory == null ||
			connections == null ||
			password == null) {
			return {_id: null};
		}

		var sys = Npm.require('sys');
		var exec = Npm.require('child_process').exec;
		var provCommand = "ssh root@master.redisnode.com '/etc/init.d/redis -p "+port+" -d "+databases+" -m "+memory+"mb -c "+connections+" -x "+password+" -a create && /etc/init.d/redis -p "+port+" -a start'";
		sys.print("will run:"+provCommand);

		function puts(error, stdout, stderr) { 
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			} else {

			}
		}
		exec(provCommand, puts);
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

