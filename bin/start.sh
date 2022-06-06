#!/bin/bash

DEFAULTVALUE="<empty>"
SERVER="${SERVER:=$DEFAULTVALUE}"
NODE_ENV="${NODE_ENV:=development}"
RUN_MIGRATIONS=${RUN_MIGRATIONS:=false}
STORE_PROVIDER="${STORE_PROVIDER:=memory}"

echo "Starting '$SERVER-server' in mode: $NODE_ENV with store provider: ${STORE_PROVIDER}"

run_migrations() {
  echo "Should run migrations is $RUN_MIGRATIONS and store provider is $STORE_PROVIDER"
  if [[ $RUN_MIGRATIONS = true && ($STORE_PROVIDER = "mongodb" || $STORE_PROVIDER = "mongoose") ]]
  then
    echo "Running migrations for $STORE_PROVIDER"
    npm run migrations:run
  else
    echo "Skipping migrations due to conditions not met"
  fi
}

if [[ $SERVER = "web" ]]
then
  if [[ $NODE_ENV = "development" ]]
  then
    npm run start:web:dev
  else
    npm run start:web
  fi
elif [[ $SERVER = "authz" ]]
then
  run_migrations
  if [[ $NODE_ENV = "development" ]]
  then
    npm run start:authz:dev
  else
    npm run start:authz
  fi
else
  echo "no anda nada: $SERVER"
  exit 1
fi
