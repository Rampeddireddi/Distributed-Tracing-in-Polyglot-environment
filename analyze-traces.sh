#!/bin/sh

# usage check
if [ -z "$1" ]; then
  echo "Usage: $0 <min-duration-ms>"
  exit 1
fi

MIN_MS=$1

curl -s "http://localhost:16686/api/traces?service=api-gateway&minDuration=${MIN_MS}ms" \
| jq -r '.data[].traceID'
