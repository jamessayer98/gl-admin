#!/bin/bash

################################################################################
# Management Portal Build Script
#
# Builds Order App for an environment, prepares the static assets for usage
# within WordPress, and archives them.
#
# Instructions:
#
#   Run this script for either production or staging
#   Upload the resulting tgz file to the server
#   Unpack the file to the appropriate directory
#
################################################################################

err() {
  echo "$*" >>/dev/stderr
}

usage() {
  err "Usage: build [staging|production]";
}

env=$1
builddate=`date +"%Y%m%d%H%M%S"`
buildfile="gl-management-portal.${env}.${builddate}.tgz"
dest=build/

if [ -z $env ]
then
  usage 
  exit 1
fi

if [ $env != "staging" -a $env != "production" ]
then
  usage
  exit 1
fi

rm -rf build

if [ $env == "staging" ]
then
  if [ ! -f ".env.staging" ]
  then
    err "Could not find .env.staging"
    exit 1
  fi

  echo "Starting staging build..."

  npm run build
fi

echo 

if [ $env == "production" ]
then
  if [ ! -f ".env.production" ]
  then
    err "Could not find .env.production"
    exit 1
  fi

  echo "Starting production build..."

  npm run build
fi

echo "Archiving..."

cd $dest
tar -czf $buildfile *

echo 
echo "Build complete. You can now deploy ${dest}/${buildfile}"
echo 