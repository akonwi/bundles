#!/usr/bin/env bash

mkdir -p ../bundles_release
cp -r ./assets ../bundles_release/
cp -r ./dist ../bundles_release/
cp -r ./lib ../bundles_release/
cp -r ./manifest.json ../bundles_release/
cp -r ./popup.html ../bundles_release/
cp -r ./styles.css ../bundles_release/
zip -r ../bundles_release.zip ../bundles_release
