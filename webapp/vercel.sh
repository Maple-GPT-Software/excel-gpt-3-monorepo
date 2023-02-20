#!/bin/bash

# only deploy for changes to ./webapp
git diff HEAD^ HEAD --quiet ./webapp

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# allow staging deployments for branches that start with staging/
# and main
if [[ "$VERCEL_GIT_COMMIT_REF" == "staging/*" || "$VERCEL_GIT_COMMIT_REF" == "main"  ]] ; then
  # Proceed with the build
    echo "✅ - Build can proceed"
    npm run build
    exit 0;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi