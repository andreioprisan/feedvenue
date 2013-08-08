Meteor.Router.add({
    '/': function() {
        Session.set("current_page", 'home');
        return 'home';
    },

    '/page/:page': function(page) {
        Session.set("current_page", page);
        return page;
    },

    '/login': function() {
        Session.set("current_page", 'login');
        return 'login';
    },

    '/signup/:plan': function(plan) {
        if (page == undefined) {
            plan = 0;
        }
        Session.set("signup_plan", plan);
        Session.set("current_page", 'signup');
        return 'signup';
    },

    '/signup': function(plan) {
        Session.set("signup_plan", 0);
        Session.set("current_page", 'signup');
        return 'signup';
    },

    '/logout': function() {
        Meteor.logout(function(error) {
            if(error) {
                alert("Could not logout!")
            } else {
                Meteor.Router.to("/");        
            }

        });
    },

    '/reset-password': function() {
        Session.set("current_page", 'recover_email');
        return 'recover_email';
    },

    '/reset-password/:token': function(token) {
        Session.set("resetPassword", token);
        Session.set("current_page", 'password_update');
        return 'password_update';
    },

    '/dashboard': function(id) {
        console.log(id);
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'dashboard');
        return 'dashboard';
    },

    '/users/:id': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'dashboard');
        return 'dashboard';
    },

    '/users/:id/edit': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'editProfile');
        return 'editProfile';
    },

    '/event/create': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'eventCreate');
        return 'eventCreate';
    },

    '/event/list': function(id) {
        if (Meteor.userId() == null) {
            Meteor.Router.to("/");
        }
        Session.set("current_page", 'dashboard');
        return 'dashboard';
    },

    '/:id': function(id) {
        var useragent = navigator.userAgent;
        var oniPhone = false;
        var oniPad = false;
        var onAndroid = false;
        if (useragent.match(/iPhone/) != null) {
            oniPhone = true;
        } else if (useragent.match(/iPad/) != null) {
            oniPad = true;
        } else if (useragent.match(/droid/) != null) {
            onAndroid = true;
        } 

        SessionAmplify.set('oniPhone', oniPhone);
        SessionAmplify.set('oniPad', oniPad);
        SessionAmplify.set('onAndroid', onAndroid);
                
        Session.set("slug", id);
        Session.set("current_page", 'eventView');
        return 'eventView';
    },

     
});


Meteor.Router.filters({
    requireLogin: function(page) {
        if (Meteor.user()) {
            return page;
        } else {
            return 'login';
        }
    }
});


//Meteor.Router.filter('checkLoggedIn', {only: ['dashboard']});


//Meteor.Router.filter('requireLogin', {except: ['page/what', 'page/fea', 'signup', 'about', 'terms']});