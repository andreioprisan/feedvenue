#!/bin/bash 

# IP or URL of the server you want to deploy to
export APP_HOST=feedvenue.com

# Uncomment this if your host is an EC2 instance
# export EC2_PEM_FILE=path/to/your/file.pem

# You usually don't need to change anything below this line

export APP_NAME=feedvenue.com
export ROOT_URL=https://$APP_HOST
export APP_DIR=/var/www/$APP_NAME
export PORT=81
export MONGO_URL='mongodb://feedvenue:e8b19da37825a3056e84c522f05efce0@ana.mongohq.com:10097/feedvenue'
export SSH_OPT=''
export SSH_HOST=$APP_HOST

if [ -z "$EC2_PEM_FILE" ]; then
    export SSH_HOST="root@$APP_HOST" SSH_OPT=""
  else
    export SSH_HOST="ubuntu@$APP_HOST" SSH_OPT="-i $EC2_PEM_FILE"
fi

if [ -d ".meteor/meteorite" ]; then
    export METEOR_CMD=mrt
  else
    export METEOR_CMD=meteor
fi

case "$1" in
  setup )
  echo Preparing the server...
  echo Get some coffee, this will take a while.
  ssh $SSH_OPT $SSH_HOST DEBIAN_FRONTEND=noninteractive 'sudo -E bash -s' > /dev/null 2>&1 <<'ENDSSH'
apt-get update
apt-get install -y python-software-properties
add-apt-repository ppa:chris-lea/node.js-legacy
apt-get update
npm install -g forever
ENDSSH
  echo Done. You can now deploy your app.
  ;;
build-run )
  #v0.10.10 is possible
  #v0.8.14 is safe
  rm -fr demeteorized &&
  demeteorizer -n v0.8.14 -o demeteorized &&
  cd demeteorized &&
  sed 's/-meteor",/",/g' package.json > package.json.new &&
  mv package.json package.json.orig &&
  mv package.json.new package.json &&
  npm install &&
  npm shrinkwrap &&
  echo "demeteorized node package is set up" &&
  export ROOT_URL=http://localhost &&
  node main.js &&
  echo "application running on $ROOT_URL:$PORT"
  ;;
build-clean )
  rm -fr demeteorized
  ;;
deploy )
  echo Deploying with $METEOR_CMD

  $METEOR_CMD bundle bundle.tgz --production &&
  scp $SSH_OPT bundle.tgz $SSH_HOST:/tmp/  &&
  rm bundle.tgz > /dev/null 2>&1 &&
  ssh $SSH_OPT $SSH_HOST MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR 'sudo -E bash -s' > /dev/null 2>&1 <<'ENDSSH'
if [ ! -d "$APP_DIR" ]; then
mkdir -p $APP_DIR
chown -R www-data:www-data $APP_DIR
fi
pushd $APP_DIR
forever stopall
forever stop bundle/main.js
rm -rf bundle
tar xfz /tmp/bundle.tgz -C $APP_DIR
rm /tmp/bundle.tgz
pushd bundle/server/node_modules
rm -rf fibers
( cd $APP_DIR/bundle/server && npm install fibers@1.0.0 )
popd
chown -R www-data:www-data bundle
patch -u bundle/server/server.js <<'ENDPATCH'
@@ -286,6 +286,8 @@
     app.listen(port, function() {
       if (argv.keepalive)
         console.log("LISTENING"); // must match run.js
+      process.setgid('www-data');
+      process.setuid('www-data');
     });
 
   }).run();
ENDPATCH
MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR PORT=81 forever start bundle/main.js PORT=81
MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR PORT=82 forever start bundle/main.js PORT=82
popd
ENDSSH
  echo Your app is deployed and serving on: $ROOT_URL
  echo I ran MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR PORT=81 forever start bundle/main.js PORT=81
  ;;
* )
  cat <<'ENDCAT'
  ./meteor.sh [action]

  Available actions:

  setup   - Install a meteor environment on a fresh Ubuntu server
  deploy  - Deploy the app to the server
ENDCAT
  ;;
esac
