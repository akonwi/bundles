#!/usr/bin/env bash

rm ../bundles_release.zip
rm -rf ../bundles_release
mkdir ../bundles_release
cp -r ./assets ../bundles_release/
cp -r ./dist ../bundles_release/
cp -r ./lib ../bundles_release/
cp ./manifest.json ../bundles_release/
cp ./popup.html ../bundles_release/
cp ./styles.css ../bundles_release/
zip -r ../bundles_release.zip ../bundles_release
