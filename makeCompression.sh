#!/bin/sh

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.en.uncompressed.js > Scriptor.en.js

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.es.uncompressed.js > Scriptor.es.js

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.core.uncompressed.js > Scriptor.core.js

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.events.uncompressed.js > Scriptor.events.js

java -jar -Dfile.encoding=ISO8859-1 shrinksafe/shrinksafe.jar Scriptor.cookie.uncompressed.js > Scriptor.cookie.js
