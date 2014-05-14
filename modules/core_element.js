/* some usefull html element functions */
/* requires: Scriptor.classname */
Scriptor.element = {
		// get top, bottom, left, right values according to the component's
		// padding
		getInnerBox : function(elem) {
			var box = { top : 0, bottom: 0, left : 0, right : 0 };
			
			var innerTop = parseInt(Scriptor.className.getComputedProperty(elem, 'padding-top'));
			var innerBottom = parseInt(Scriptor.className.getComputedProperty(elem, 'padding-bottom'));
			var innerLeft = parseInt(Scriptor.className.getComputedProperty(elem, 'padding-left'));
			var innerRight = parseInt(Scriptor.className.getComputedProperty(elem, 'padding-right'));
			
			if (!isNaN(innerTop))
				box.top = innerTop;
			if (!isNaN(innerBottom))
				box.bottom = innerBottom;
			if (!isNaN(innerLeft))
				box.left = innerLeft;
			if (!isNaN(innerRight))
				box.right = innerRight;
			
			var borderTop = parseInt(Scriptor.className.getComputedProperty(elem, 'border-top-width'));
			var borderBottom = parseInt(Scriptor.className.getComputedProperty(elem, 'border-bottom-width'))
			var borderLeft = parseInt(Scriptor.className.getComputedProperty(elem, 'border-left-width'))
			var borderRight = parseInt(Scriptor.className.getComputedProperty(elem, 'border-right-width'))
			
			if (!isNaN(borderTop))
				box.top += borderTop;
			if (!isNaN(borderBottom))
				box.bottom += borderBottom;
			if (!isNaN(borderLeft))
				box.left += borderLeft;
			if (!isNaN(borderRight))
				box.right += borderRight;
				
			return box;
		},
			
		// get top, bottom, left, right values according to the component's
		// margin
		getOuterBox : function(elem) {
			var box = { top : 0, bottom: 0, left : 0, right : 0 };
			
			var outerTop = parseInt(Scriptor.className.getComputedProperty(elem, 'margin-top'));
			var outerBottom = parseInt(Scriptor.className.getComputedProperty(elem, 'margin-bottom'));
			var outerLeft = parseInt(Scriptor.className.getComputedProperty(elem, 'margin-left'));
			var outerRight = parseInt(Scriptor.className.getComputedProperty(elem, 'margin-right'));
			
			if (!isNaN(outerTop))
				box.top = outerTop;
			if (!isNaN(outerBottom))
				box.bottom = outerBottom;
			if (!isNaN(outerLeft))
				box.left = outerLeft;
			if (!isNaN(outerRight))
				box.right = outerRight;
				
			return box;
		}
	};
