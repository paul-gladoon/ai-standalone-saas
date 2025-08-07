#!/bin/bash

# Get the current directory
current_dir=$(pwd)

# Get the last part of the path
last_part=${current_dir##*/}

# Check if the last part of the path is "scripts"
if [ "$last_part" = "scripts" ]; then
  # If it is, go back to the root directory
  cd ..
fi

node ./scripts/find-versions-missmatches.mjs