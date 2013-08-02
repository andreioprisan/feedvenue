Meteor.startup(function () {
  process.env.MAIL_URL = "smtp://postmaster@feedvenue.com:562jnvpdtdj9@smtp.mailgun.org:465";
});

Meteor.methods({
  sendEmail: function (to, subject, text) {
    this.unblock();
 
    Email.send({
      to: to,
      from: "team@feedvenue.com",
      subject: subject,
      text: text
    });
  }
});
