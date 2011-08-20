#!/bin/sh

rm Scriptor.en.js

cat modules/intro.js 		>> Scriptor.en.js
cat modules/core.js 		>> Scriptor.en.js
cat modules/calendarView.js	>> Scriptor.en.js
cat lang/calendarView.en.js >> Scriptor.en.js
cat modules/galleryView.js	>> Scriptor.en.js
cat modules/httpRequest.js	>> Scriptor.en.js
cat lang/httpRequest.en.js	>> Scriptor.en.js
cat modules/ui/component.js		>> Scriptor.en.js
cat modules/ui/contextMenu.js	>> Scriptor.en.js
cat modules/ui/panel.js			>> Scriptor.en.js
cat modules/ui/tabContainer.js 	>> Scriptor.en.js
cat modules/ui/dataView.js		>> Scriptor.en.js
cat lang/dataView.en.js 		>> Scriptor.en.js
cat modules/ui/treeView.js		>> Scriptor.en.js
cat modules/outro.js			>> Scriptor.en.js
