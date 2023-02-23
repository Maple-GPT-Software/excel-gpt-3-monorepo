#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# only deploy for changes to ./webapp
git diff HEAD^ HEAD --quiet .

