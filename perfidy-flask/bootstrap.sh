#!/bin/sh

port=5000

while getopts 'p:' flag; do
  case "${flag}" in
    p) port="${OPTARG}" ;;
    *) echo "./bootstrap.sh [-p <port>]"
       exit 1 ;;
  esac
done

export FLASK_APP=./perfidy/index.py
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0 -p $port
