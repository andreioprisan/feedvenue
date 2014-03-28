# FeedVenue

* Supports Twitter hashtag search in real-time
* Supports email question submission
* Supports SMS and voicemail question submission
* Supports anonymous question submission, if enabled at event level

## Install

Make sure you have the right db connection variables exported in your local
```
export APP_NAME=feedvenue.com
export ROOT_URL=https://$APP_HOST
export APP_DIR=/var/www/$APP_NAME
export PORT=81
export MONGO_URL='mongodb://feedvenue:e8b19da37825a3056e84c522f05efce0@ana.mongohq.com:10097/feedvenue'
export SSH_OPT=''
export SSH_HOST=$APP_HOST
```

To run, 
```
$ ./meteor run
```

To deploy:
```
$ ./meteor deploy
```

To bundle for a regular node.js environment:
```
$ ./meteor build-run
```

## Processes

Twitter (updates every 3 minutes):
.workers/twitter - parses twitter with OAuth 1.1 and saves raw Tweets as wel as questions

Phone & SMS:
/api/twiml/voice - voice channel input stream
/api/twiml/sms   - SMS channel input stream
/api/twiml/transcribe - processed voice input stream

Crontabs:
```
* * * * * ( cd /var/git/feedvenue && git pull )
*/3 * * * * ( cd /var/git/feedvenue/.workers/twitter && node parser.js )
```

Copyright 2013 by Andrei Oprisan. Licensed under the GPL license v3: https://www.gnu.org/copyleft/gpl.html
