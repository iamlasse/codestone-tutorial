#!/bin/bash
set -e ;

logdir=${LOGDIR:-/tmp} ;
port=5000

echo "Using log directory: $logdir ..."

# start
cd api && yarn
cd react-app && yarn
# echo
# echo "Starting JAI services on port: $port"

# export http_port=$port ;
# node -r @babel/register src/api/server.js start > ${logdir}/jai.log 2>&1 &

# echo "$!" > /tmp/pid.services ;
# #cd - ;
# echo "Started: JAI services started on port $port"
