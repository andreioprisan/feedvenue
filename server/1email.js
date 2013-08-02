Meteor.startup(function () {
	process.env.MAIL_URL = "smtp://postmaster%40redisnode.com:402ma3iic7n8@smtp.mailgun.org:587";
});

Meteor.methods({
  sendEmail: function (to, subject, text) {
    this.unblock();
 
    Email.send({
      to: to,
      from: "team@redisnode.com",
      subject: subject,
      text: text
    });
  }
});
