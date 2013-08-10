Template.publicevents.helpers({
    events: function () {
        return Events.find({"features.private": false});
    },
});
