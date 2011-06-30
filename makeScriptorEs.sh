#!/bin/sh

rm Scriptor.es.js

cat modules/intro.js 		>> Scriptor.es.js
cat modules/core.js 		>> Scriptor.es.js
cat modules/contextMenu.js	>> Scriptor.es.js
cat modules/calendarView.js	>> Scriptor.es.js
cat lang/calendarView.es.js >> Scriptor.es.js
cat modules/dataView.js		>> Scriptor.es.js
cat lang/dataView.es.js 	>> Scriptor.es.js
cat modules/galleryView.js	>> Scriptor.es.js
cat modules/httpRequest.js	>> Scriptor.es.js
cat lang/httpRequest.es.js	>> Scriptor.es.js
cat modules/tabView.js		>> Scriptor.es.js
cat modules/treeView.js		>> Scriptor.es.js
cat modules/ui/component.js	>> Scriptor.es.js
cat modules/ui/panel.js		>> Scriptor.es.js
cat modules/ui/tabContainer.js >> Scriptor.es.js
cat modules/outro.js		>> Scriptor.es.js
