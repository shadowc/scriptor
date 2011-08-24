#!/bin/sh

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.en.uncompressed.js > Scriptor.en.js

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.es.uncompressed.js > Scriptor.es.js
