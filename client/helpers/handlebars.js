Handlebars.registerHelper('TabActive', function (route) {
    return (route == Session.get("current_page")) ? "active" : "";
});

Handlebars.registerHelper('signup_plan', function (route) {
    var plan = Session.get("signup_plan");
    if (plan == undefined) {
        plan = 0;
    }

    if (plan) {
        $('#paymentInfo').show().removeClass('hide');
    } else {
        $('#paymentInfo').hide().addClass('hide');    
    }

    return (route == plan) ? "selected" : "";
});

Handlebars.registerHelper('show_signup_plan_payment_section', function (route) {
    var plan = Session.get("signup_plan");

    if (plan == undefined) {
        plan = 0;
    }

    if (plan) {
        $('#paymentInfo').show().removeClass('hide');
    } else {
        $('#paymentInfo').hide().addClass('hide');    
    }

    return (plan) ? "" : "hide";
});
