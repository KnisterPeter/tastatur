#!/bin/sh

# build
yarn
yarn build

# prepare
git clone -b gh-pages git@github.com:KnisterPeter/tastatur.git __page
cat tests/dev.html |sed \
  -e 's/src="\.\.\/dist\/lib\/index.js"/src="index.js"/' \
  -e 's/src="\.\.\/node_modules\/core-js\/client\/core\.js"/src="core.js"/' \
  > __page/index.html
cp node_modules/core-js/client/core.js __page/core.js
cp dist/lib/index.js __page/index.js
cd __page
git add .
git commit -m "Update page"
git push -f origin gh-pages
cd ..

# cleanup
rm -rf __page
