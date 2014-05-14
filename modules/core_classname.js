
// add classname / remove classname
Scriptor.className = {
		// check if an element has a className
		has : function(elem, className) {	
			if (!(elem)) return false;
			
			var elementClassName = elem.className;
			var classNameRegexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
			return (elementClassName.length > 0 && (elementClassName == className ||
				classNameRegexp.test(elementClassName)));
		},
		
		// add a classname if not already added
		add : function(elem, className) {
			if (typeof(className) != 'string')
				return;
			
			if (!(elem)) return;
			
			if (elem.className === undefined)
				elem.className = '';
			
			if (!Scriptor.className.has(elem, className))
				elem.className += (elem.className ? ' ' : '') + className;
		},
		
		// remove a classname if present in an element's className
		remove : function(elem, className) {
			if (typeof(className) != 'string')
				return;

			if (!(elem)) return;
		
			if (elem.className === undefined)
				elem.className = '';
			
			elem.className = elem.className.replace(
			new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').replace(/^\s+/, '').replace(/\s+$/, '');
		},
		
		// returns the actual computed style of an element
		// property must be a css property name like border-top-width
		// (with dashes)
		getComputedProperty : function(el, property) {
			if (window.getComputedStyle)	// DOM Implementation
			{
				var st = window.getComputedStyle(el, null);
				if (st)
				{
					return st.getPropertyValue(property);
				}
			}
			else if (el.currentStyle)	// IE implementation
			{
				st = el.currentStyle;
				
				if (st)
				{
					// convert dashed-css-declaration to javascriptCssDeclaration
					var convprop = '';
					var capt = false;
					for (var n=0; n < property.length; n++)
					{
						var c = property.substr(n, 1);
						if (c == '-')
						{
							capt = true;
						}
						else if (capt)
						{
							convprop += c.toUpperCase();
							capt = false;
						}
						else
						{
							convprop += c;
						}
					}
					
					return st[convprop];
				}
			}
			
			return null;
		}
	};
	