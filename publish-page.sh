#!/bin/sh

# clone
git clone git@github.com:KnisterPeter/tastatur.git page
cd page

# build
yarn
yarn build

# prepare
git clone git@github.com:KnisterPeter/tastatur.git page
cd page
git checkout gh-pages
cd ..
cat tests/dev.html |sed -e 's/src="\.\.\/dist\/lib\/index.js"/src="index.js"/' > page/index.html
cp dist/lib/index.js page/index.js
cd page
git add .
git commit -m "Update page"
git push -f origin gh-pages
cd ..

# cleanup
cd ..
rm -rf page
