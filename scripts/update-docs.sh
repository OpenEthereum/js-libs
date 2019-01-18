#!/bin/bash

# Generate docs for a package, and update the docs in parity-js/${package_name}, in the gh-pages branch.

set -e

# Take the --scope flag if it exists
if [[ "$1" == --scope* ]]; then
	SCOPES=`cut -d "=" -f 2 <<< "$1"`
fi

# Quit if there's no scope
[[ -z  $SCOPES ]] && echo No scope provided. && exit 1

# Find all scopes, separated by comma
IFS=',' read -r -a ARRAY <<< "$SCOPES"

TMPDIR=$(mktemp -d)

# Generate docs in the SCOPE folder
for SCOPE in "${ARRAY[@]}"
do
    # Generate latest version of docs
    echo "Generating docs for $SCOPE"
    pushd . # We're in the root folder
    cd "packages/$SCOPE"
    yarn docs
    cd docs
    gitbook build

    # Copy these generated html docs temporarily in a temp folder
    cp -r "_book" "$TMPDIR/$SCOPE"
    popd # Go back to root folder
done

# Docs are updated on master, we commit back
git add .
git commit -m "[ci skip] Update docs"

# Copy the generated html files in gh-pages
git checkout gh-pages
echo $SCOPES | tr ',' ' ' | rm -rf # Replace "abi,light.js" with "abi light.js"
cp -r "$TMPDIR/*" .
