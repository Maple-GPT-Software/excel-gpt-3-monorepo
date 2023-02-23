#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_GIT_COMMIT_MESSAGE: $VERCEL_GIT_COMMIT_MESSAGE" 

# only deploy for changes to ./webapp
if git diff --quiet HEAD^ HEAD -- .; then
  # no changes in webapp, exit with status code 1
  echo "🛑 - Build cancelled"
  exit 0
else
  # changes detected in webapp, build & exit with status code 0
  echo "✅ - Build can proceed"
  npm run build
  exit 1
fi
