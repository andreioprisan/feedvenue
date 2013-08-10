UserVoice = window.UserVoice || [];

Template.footer.helpers({
    onWeb: function() {
        return ((!SessionAmplify.get('oniPhone') && !SessionAmplify.get('oniPad')) || 
            Session.get("current_page") != "eventView");
    }
});

Template.footer.events({
    "click .showClassicWidget": function(event){
      UserVoice.push(['showLightbox', 'classic_widget', {
        mode: 'full',
        primary_color: '#cc6d00',
        link_color: '#007dbf',
        default_mode: 'support',
        forum_id: 217839
      }]);
    },
});
