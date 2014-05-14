#!/bin/sh

rm Scriptor.en.uncompressed.js

cat modules/intro.js 			>> Scriptor.en.uncompressed.js
cat modules/core.js 			>> Scriptor.en.uncompressed.js
cat modules/core_misc.js 		>> Scriptor.en.uncompressed.js
cat modules/core_events.js 		>> Scriptor.en.uncompressed.js
cat modules/core_element.js 	>> Scriptor.en.uncompressed.js
cat modules/core_error.js 		>> Scriptor.en.uncompressed.js
cat modules/core_classname.js 	>> Scriptor.en.uncompressed.js
cat modules/core_cookie.js 		>> Scriptor.en.uncompressed.js
cat modules/httpRequest.js		>> Scriptor.en.uncompressed.js
cat lang/httpRequest.en.js		>> Scriptor.en.uncompressed.js
cat modules/effects.js			>> Scriptor.en.uncompressed.js
cat modules/ui/component.js		>> Scriptor.en.uncompressed.js
cat modules/ui/contextMenu.js	>> Scriptor.en.uncompressed.js
cat modules/ui/panel.js			>> Scriptor.en.uncompressed.js
cat modules/ui/tabContainer.js 	>> Scriptor.en.uncompressed.js
cat modules/ui/dataView.js		>> Scriptor.en.uncompressed.js
cat lang/dataView.en.js 		>> Scriptor.en.uncompressed.js
cat modules/ui/treeView.js		>> Scriptor.en.uncompressed.js
cat modules/ui/calendarView.js	>> Scriptor.en.uncompressed.js
cat lang/calendarView.en.js 	>> Scriptor.en.uncompressed.js
cat modules/ui/galleryView.js	>> Scriptor.en.uncompressed.js
cat modules/ui/toolbar.js		>> Scriptor.en.uncompressed.js
cat modules/ui/dialog.js		>> Scriptor.en.uncompressed.js
cat modules/outro.js			>> Scriptor.en.uncompressed.js

rm Scriptor.es.uncompressed.js

cat modules/intro.js 			>> Scriptor.es.uncompressed.js
cat modules/core.js 			>> Scriptor.es.uncompressed.js
cat modules/core_misc.js 		>> Scriptor.es.uncompressed.js
cat modules/core_events.js 		>> Scriptor.es.uncompressed.js
cat modules/core_element.js 	>> Scriptor.es.uncompressed.js
cat modules/core_error.js 		>> Scriptor.es.uncompressed.js
cat modules/core_classname.js 	>> Scriptor.es.uncompressed.js
cat modules/core_cookie.js 		>> Scriptor.es.uncompressed.js
cat modules/httpRequest.js		>> Scriptor.es.uncompressed.js
cat lang/httpRequest.es.js		>> Scriptor.es.uncompressed.js
cat modules/effects.js			>> Scriptor.es.uncompressed.js
cat modules/ui/component.js		>> Scriptor.es.uncompressed.js
cat modules/ui/contextMenu.js	>> Scriptor.es.uncompressed.js
cat modules/ui/panel.js			>> Scriptor.es.uncompressed.js
cat modules/ui/tabContainer.js	>> Scriptor.es.uncompressed.js
cat modules/ui/dataView.js		>> Scriptor.es.uncompressed.js
cat lang/dataView.es.js 		>> Scriptor.es.uncompressed.js
cat modules/ui/treeView.js		>> Scriptor.es.uncompressed.js
cat modules/ui/calendarView.js	>> Scriptor.es.uncompressed.js
cat lang/calendarView.es.js 	>> Scriptor.es.uncompressed.js
cat modules/ui/galleryView.js	>> Scriptor.es.uncompressed.js
cat modules/ui/toolbar.js		>> Scriptor.es.uncompressed.js
cat modules/ui/dialog.js		>> Scriptor.es.uncompressed.js
cat modules/outro.js			>> Scriptor.es.uncompressed.js

rm Scriptor.core.uncompressed.js

cat modules/intro.js 			>> Scriptor.core.uncompressed.js
cat modules/core_misc.js 		>> Scriptor.core.uncompressed.js
cat modules/core_events.js 		>> Scriptor.core.uncompressed.js
cat modules/core_element.js 	>> Scriptor.core.uncompressed.js
cat modules/core_error.js 		>> Scriptor.core.uncompressed.js
cat modules/core_classname.js 	>> Scriptor.core.uncompressed.js
cat modules/core_cookie.js 		>> Scriptor.core.uncompressed.js
cat modules/outro.js			>> Scriptor.core.uncompressed.js

rm Scriptor.events.uncompressed.js

cat modules/intro.js 		>> Scriptor.events.uncompressed.js
cat modules/core.js 		>> Scriptor.events.uncompressed.js
cat modules/core_events.js 	>> Scriptor.events.uncompressed.js
cat modules/outro.js		>> Scriptor.events.uncompressed.js

rm Scriptor.cookie.uncompressed.js

cat modules/intro.js 		>> Scriptor.cookie.uncompressed.js
cat modules/core.js 		>> Scriptor.cookie.uncompressed.js
cat modules/core_cookie.js 	>> Scriptor.cookie.uncompressed.js
cat modules/outro.js		>> Scriptor.cookie.uncompressed.js
