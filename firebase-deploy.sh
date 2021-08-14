#!/bin/sh

echo "Removing all files from ../slapstuk/build"
rm -r ../slapstuk/build
echo "Copying files to ../slapstuk folder..."
cp -r ./build  ../slapstuk
echo "Running 'firebase deploy --only hosting' from ../slapstuk folder..."
initialpath="$cd"
cd ../slapstuk
firebase deploy --only hosting
cd "$initialpath"
echo "Deploy to Slapstuk hosting done."