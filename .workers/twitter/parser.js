var consumerKey = 'ePyFlWIUz7gRBpfF5kFbEA',
    consumerSec = 'GZn1ex9LVWnhWkTeHsXXPoCSW3s95dfbo81Llghk3k';
process.env.MONGO_URL = 'mongodb://feedvenue:e8b19da37825a3056e84c522f05efce0@ana.mongohq.com:10097/feedvenue';

var sys = require('sys'),
    client = require('./lib/twitter').createClient();
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;    
var moment = require('moment');
var _ = require('lodash');
var sleep = require('sleep');

client.setAuth ( consumerKey, consumerSec );

var tweetsSaved = 0;
var totalTags = 0;

MongoClient.connect(process.env.MONGO_URL, function(err, db) {
    if(err) throw err;

    var events = db.collection('Events');
    var tweets = db.collection('Tweets');
    var questions = db.collection('Questions');
    
    /*
    tweets.remove(function(err, docs) { });
    questions.remove(function(err, docs) { });
    */

    client.fetchBearerToken( function( bearer, raw, status ){
        if( ! bearer ){
            console.error('Status '+status+', failed to fetch bearer token');
            return;
        }

        client.setAuth( bearer );
        console.log(bearer);

        var eventsCollection = events.find(
        {
            enddate: {$gte: moment().format('MM/DD/YY')}, 
            startdate: {$lte: moment().format('MM/DD/YY')} 
        }, {
            fields: {hashtag: 1, slug: 1, owner: 1}
        });
        eventsCollection.count(function(err, count) {
            console.log("looking for "+count+" hashtags");
            totalTags = count;
        });


        eventsCollection.toArray(function(err, eventsList) {
            _.each(eventsList, function(eventItem) {
                client._rest('get', 'search/tweets', { 
                    q: '#'+eventItem.hashtag+' #ask', 
                    count: 500, 
                    result_type: "mixed",
                    include_entities: false,
                    until: moment(eventItem.enddate).format('YYYY-MM-DD') 
                }, function( reply, error, status )
                {
                    var thisTweetsSaved = _.size(reply.statuses);
                    var newCount = 0;
                    tweetsSaved += thisTweetsSaved;
                    console.log("#"+eventItem.hashtag+": "+thisTweetsSaved);
                    _.each(reply.statuses, function(rawTweet) {
                        rawTweet.eventId = eventItem._id;
                        rawTweet.slug = eventItem.slug;
                        rawTweet.hashtag = eventItem.hashtag;
                        rawTweet.isProcessed = false;
                        
                        tweets.insert(rawTweet, function(err, docs) { 
                            if (!err) {
                                console.log('+');
                                newCount++;
                            } else {
                                console.log('-');
                            }
                        });

                        var newQuestion = {};
                        newQuestion.owner = eventItem.owner;
                        newQuestion.d = moment(rawTweet.created_at).format('MM/DD/YY h:mm A');
                        newQuestion.st = 'active';
                        newQuestion.r = rawTweet.retweet_count+rawTweet.favorite_count;
                        newQuestion.slug = eventItem.slug;
                        newQuestion.s = 'twitter';
                        newQuestion.st = 'active';
                        newQuestion.orig_twitterid = rawTweet.id;
                        newQuestion.q = rawTweet.text;
                        newQuestion.a = rawTweet.user.name+" (@"+rawTweet.user.screen_name+")";
                        
                        questions.insert(newQuestion, {safe: true}, function(errSavingQuestion, docsQ) { 
                            /*
                            if (!errSavingQuestion) {
                                events.update({slug: eventItem.slug}, {$inc: {questions: 1}}, {safe: true}, function(err, docs) { });
                            }
                            */
                        });
                    });

                    totalTags--;
                    console.log(' we have '+totalTags+' tags left');
                    if (totalTags === 0) {
                        console.log('db: waiting for 5 sec' );
                        sleep.sleep(5)//sleep for 5 seconds
                        db.close();
                        console.log('db: closed' );
                        console.log('token: invalidated' );
                        client.setAuth ( consumerKey, consumerSec );
                        client.invalidateBearerToken( bearer, function( nothing, raw, status ){
                            if( 200 !== status ){
                                console.error('Status '+status+', failed to invalidate bearer token');
                                return;
                            }

                            console.log('Done.');
                            process.exit(code=0);
                        });

                    }
                });
            });
            console.log("total: "+tweetsSaved);
        });
    });
});
