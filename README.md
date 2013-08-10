# FeedVenue

* Supports Twitter hashtag search in real-time
* Supports email question submission
* Supports SMS and voicemail question submission
* Supports anonymous question submission, if enabled at event level

## Install

To run, 
$ ./meteor run

To deploy:
$ ./meteor deploy

To bundle for a regular node.js environment:
$ ./meteor build-run

## Processes

Twitter (updates every 3 minutes):
.workers/twitter - parses twitter with OAuth 1.1 and saves raw Tweets as wel as questions

Phone & SMS:
/api/twiml/voice - voice channel input stream
/api/twiml/sms   - SMS channel input stream
/api/twiml/transcribe - processed voice input stream

Crontabs:
* * * * * ( cd /var/git/feedvenue && git pull )
*/3 * * * * ( cd /var/git/feedvenue/.workers/twitter && node parser.js )

Copyright 2013 by Andrei Oprisan