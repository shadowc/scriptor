/* Scriptor 2.1b3
  
  A tiny Javascript component library plus a few usefull functions
  
  Published under the Creative Commons License
  http://creativecommons.org/licenses/by/3.0/
  
  by Matias Jose
  http://www.matiasjose.com
  
  http://github.com/shadowc/scriptor
*/

window.Scriptor = (function(window, document, undefined) {
	

// define the Scriptor object
var Scriptor = {
	version : {
		major : 2,
		minor : 1,
		instance : "beta 3",
		toString : function() {
			return this.major + "." + this.minor + " " + this.instance;
		}
	},
	
	// prototype bind
	bind : function(func, obj/*, staticArg1, staticArg2... */) {
		if (arguments.length > 2)
		{
			var staticArguments = [];
			for (var n=2; n < arguments.length; n++)
				staticArguments.push(arguments[n]);
			
			return function()
			{
				var defArgs = [];
				for (var i = 0; i < arguments.length; i++)
					defArgs.push(arguments[i]);
				
				for (var i=0; i < staticArguments.length; i++)
					defArgs.push(staticArguments[i]);
					
				return func.apply(obj, defArgs);
			};
		}
		else
		{
			return function()
			{
				return func.apply(obj, arguments);
			};
		}
	},
	
	bindAsEventListener : function(func, obj/*, staticArg1, staticArg2... */) {
		if (arguments.length > 2)
		{
			var staticArguments = [];
			for (var n=2; n < arguments.length; n++)
				staticArguments.push(arguments[n]);
			
			return function(e)
			{
				var defArgs = [e || window.event];
				
				for (var i=0; i < staticArguments.length; i++)
					defArgs.push(staticArguments[i]);
					
				return func.apply(obj, defArgs);
			};
		}
		else
		{
			return function(e)
			{
				return func.apply(obj, [e || window.event]);
			};
		}
	},
	
	// dojo mixin
	mixin : function(/*Object*/obj, /*Object...*/props) {
		if(!obj){ obj = {}; }
		for(var i=1, l=arguments.length; i<l; i++){
			Scriptor._mixin(obj, arguments[i]);
		}
		return obj; // Object
	},
	
	_mixin : function(/*Object*/ target, /*Object*/ source) {
		var extraNames, extraLen, empty = {};
		for(var i in {toString: 1}){ extraNames = []; break; }
		extraNames = extraNames || ["hasOwnProperty", "valueOf", "isPrototypeOf",
				"propertyIsEnumerable", "toLocaleString", "toString", "constructor"];
		extraLen = extraNames.length;
		
		var name, s, i;
		for(name in source){
			// the "tobj" condition avoid copying properties in "source"
			// inherited from Object.prototype.  For example, if target has a custom
			// toString() method, don't overwrite it with the toString() method
			// that source inherited from Object.prototype
			s = source[name];
			if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
				target[name] = s;
			}
		}
		// IE doesn't recognize some custom functions in for..in
		if(extraLen && source){
			for(i = 0; i < extraLen; ++i){
				name = extraNames[i];
				s = source[name];
				if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
					target[name] = s;
				}
			}
		}
		return target; // Object
	},

	// tiny event system 
	event : {
		/* init
		* Initializes an object to work with custom events
		*/
		init : function(obj) {
			obj._customEventStacks = {};
		},
		
		/*
		* Adds a custom event stack to start registering
		* custom events
		*/
		registerCustomEvent : function(obj, customName, context) {
			context = context || obj;
			
			if (obj._customEventStacks)
				obj._customEventStacks[customName] = { context : context, stack : [] };
		},
		
		attach : function(htmlElement, evt, funcObj) {
			if (Scriptor.isHtmlElement(htmlElement) || htmlElement === document || htmlElement === window)
			{
				if (evt.substr(0,2) == 'on')	// strip the 'on' part
					evt = evt.substr(2);
				
				if (htmlElement.addEventListener) {
					htmlElement.addEventListener(evt, funcObj, false);
				}
				else {
					if (htmlElement.attachEvent) {
						htmlElement.attachEvent('on' + evt, funcObj);
					}
				}
			}
			else if (htmlElement._customEventStacks)
			{
				if (htmlElement._customEventStacks[evt]) {
					// first, detach event if already attached, it will move to the end of
					// the stack
					Scriptor.event.detach(htmlElement, evt, funcObj);
					htmlElement._customEventStacks[evt].stack.push(funcObj);
				}
			}
			
			return [htmlElement, evt, funcObj];
		},
		
		detach : function(/* array | htmlElement, [ evt, funcObj ] */) {
			var htmlEleemnt, evt, funcObj;
			
			if (typeof(arguments[0]) == 'object' && arguments[0].length)
			{
				htmlElement = arguments[0][0];
				evt = arguments[0][1];
				funcObj = arguments[0][2];
			}
			else
			{
				htmlElement = arguments[0];
				evt = arguments[1];
				funcObj = arguments[2];
			}
			
			if (Scriptor.isHtmlElement(htmlElement)  || htmlElement === document || htmlElement === window)
			{
				if (evt.substr(0,2) == 'on')	// strip the 'on' part
					evt = evt.substr(2);
				if (htmlElement.removeEventListener) {
					htmlElement.removeEventListener(evt, funcObj, false);
				}
				else {
					if (htmlElement.detachEvent) {
						htmlElement.detachEvent('on' + evt, funcObj);
					}
				}
			}
			else if (htmlElement._customEventStacks)
			{
				if (htmlElement._customEventStacks[evt]) {
					for (var n=0; n < htmlElement._customEventStacks[evt].stack.length; n++) {
						if (htmlElement._customEventStacks[evt].stack[n] == funcObj) {
							htmlElement._customEventStacks[evt].stack.splice(n, 1);
							break;
						}
					}
				}
			}
		},
	
		// this will execute in the context of _customEvents object
		// obj is the object with custom event system initialized
		// evt is the event name register as a custom event
		// evtExtend is the event object (if present) with any extensions you might like
		fire : function(obj, evt, evtExtend) {
			// create fake event object
			evtExtend = typeof(evtExtend) == 'object' ? evtExtend : {};
			evtExtend.customEventName = evt;
			if (evtExtend.returnValue === undefined)
				evtExtend.returnValue = true;
			
			// no event registered? return
			if (!obj._customEventStacks || !obj._customEventStacks[evt] ||
				!obj._customEventStacks[evt].stack.length)
				return evtExtend;
			
			// create argument list and push fake event to callback arguments
			var args = [evtExtend];
			
			for (var n=0; n < obj._customEventStacks[evt].stack.length; n++)
				obj._customEventStacks[evt].stack[n].apply(obj._customEventStacks[evt].context, args);
			
			return evtExtend;
		},
	
		cancel : function(e, alsoStopPropagation) {
			if (!e)
				return;
			
			if (typeof(alsoStopPropagation) == 'undefined')
				alsoStopPropagation = true;
				
			if (typeof(e.preventDefault) == 'function')
				e.preventDefault();
	
			e.returnValue = false;
	
			if (alsoStopPropagation) {
				if (typeof(e.stopPropagation) == 'function')
					e.stopPropagation();
	
				e.cancelBubble = true;
			}
			
		},
	
		getPointXY : function(evt) {
			// check we have a real event object
			if (evt.pageX === undefined && evt.clientX === undefined)
				return {x: 0, y : 0};
			
			return {
				x: evt.pageX || (evt.clientX +
					(document.documentElement.scrollLeft || document.body.scrollLeft)),
				y: evt.pageY || (evt.clientY +
					(document.documentElement.scrollTop || document.body.scrollTop))
		  };
		}
	},
	
	// add classname / remove classname
	className : {
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
	},
	
	// Basic cookie handling system
	cookie : {
		cookies : {},
	
		init : function() {
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++)
			{
				var c = ca[i];
				while (c.charAt(0)==' ')
					c = c.substring(1,c.length);
					
				var nameEQ = c.substring(0, c.indexOf('='));
				this.cookies[nameEQ] = c.substring(nameEQ.length+1,c.length);
			}
		},
		
		get : function(name)
		{
			return this.cookies[name] ? this.cookies[name] : '';
		},
		
		create : function(name,value,days)
		{
			if (days)
			{
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
			
			this.cookies[name] = value;
		},
	
		erase : function(name)
		{
			this.create(name,"",-1);
			delete this.cookies[name];
		}
	},
	
	// function to identify if obj is an html element
	isHtmlElement : function(o) {
		// some common comarisons that would break the further testing
		var head = document.getElementsByTagName('head')[0];
		if (o === Scriptor.body() || o === head)
			return true;
		if (o == document || o === window)
			return false;
		if (!o)
			return false;
		
		// cloneNode is an object in IE8
		if (typeof(o.cloneNode) != 'function' && typeof(o.cloneNode) != 'object')
			return false;	// if we can't clone it, it's not a node
		
		// normal testing for other nodes
		var a = document.createElement('div');
		
		try
		{
			var clone = o.cloneNode(false);
			a.appendChild(clone);	// if we can append it, its an HTMLElement
			a.removeChild(clone);
			a = null;
			clone = null;
			return (o.nodeType != 3); // don't return text nodes as HTMLELements
		}
		catch (e)
		{
			a = null;
			return false;
		}
	},
	
	// window addOnLoad system
	addOnLoad : function(f) {
		if (window.onload)
		{
			var oldF = window.onload;
			window.onload = function()
				{
					oldF();
					f();
				};
		}
		else
		{
			window.onload = f;
		}
	},
	
	// error reporting system!
	error : {
		alertErrors : false,
		muteErrors : false,
		
		report : function(msg) {
			if (Scriptor.error.alertErrors)
				alert(msg);
			
			if (!Scriptor.error.muteErrors)
				throw msg;
		}
	},
	
	// make obj transparent by ndx
	makeTransparent : function(obj, ndx) { 
		if (obj.style) {
			if (obj.style.opacity !== undefined)
				obj.style.opacity = '0.' + ndx;
			else if (obj.style.MozOpacity !== undefined)
				obj.style.MozOpacity = '0.' + ndx;
			else if (obj.style.filter !== undefined) 
				obj.style.filter = 'alpha(opacity=' + ndx + ');';
		}
	},
	
	body : function() {
		if (!_body)
		{
			_body = document.getElementsByTagName('body')[0];
		}
		
		return _body;
	},
	
	/*
	* Scriptor.getInactiveLocation
	*
	* Takes the current location and adds a traling hash (#) when necessary.
	* Useful for A elements which need an inactive href, to ensure we won't
	*   be switching the page when clicked or change tha page's hash information
	*/
	getInactiveLocation : function() {
		return String((window.location.href.indexOf('#') != -1) ? window.location.href : window.location.href + "#");
	},
	
	/*
	* Scriptor.invalidate
	*
	*   Creates an invalidator blocking the interface, if
	*   state is true, it shows the invalidator, otherwise it hides
	*   it, reenabling the interface.
	*
	*   Optional msg parameter can be passed to show a message
	*   with an "ajax" spinner
	*   
	*/
	invalidate : function(state, msg)
	{
		if (state)
		{
			Scriptor._calculateBrowserSize();
			
			var invDiv = document.getElementById('scriptor_invalidator');
			if (!invDiv)
			{
				invDiv = document.createElement('div');
				invDiv.id = 'scriptor_invalidator';
				Scriptor.makeTransparent(invDiv, 50);
				invDiv.style.width = browserWindowWidth + 'px';
				invDiv.style.height = browserWindowHeight + 'px';
				document.getElementsByTagName('body')[0].appendChild(invDiv);
			}
			
			if (msg)
			{
				if (!invDiv.firstChild)
				{
					var invTemplate = '<div class="msg">'+msg+'</div>';
					invDiv.innerHTML = invTemplate;
					invDiv.firstChild.style.left = ((browserWindowWidth / 2) - 100) + 'px';
					invDiv.firstChild.style.top = ((browserWindowHeight / 2) - 15) + 'px';
				}
			}
			
			Scriptor.event.attach(window, 'onresize', Scriptor._calculateBrowserSize);
		}
		else
		{
			if (document.getElementById('scriptor_invalidator'))
			{
				document.getElementById('scriptor_invalidator').parentNode.removeChild(document.getElementById('scriptor_invalidator'));
			}
			
			Scriptor.event.detach(window, 'onresize', Scriptor._calculateBrowserSize);
		}
	},
	
	_calculateBrowserSize : function()
	{
		// calculate window width - height
		if (navigator.userAgent.indexOf('MSIE') != -1) {
			if (document.documentElement.clientWidth == 0)
				browserWindowWidth = document.body.clientWidth;
			else	
				browserWindowWidth = document.documentElement.clientWidth;
				
			if (document.documentElement.clientHeight == 0)
				browserWindowHeight = document.body.clientHeight;
			else
				browserWindowHeight = document.documentElement.clientHeight;
		}
		else {
			browserWindowWidth = window.innerWidth;
			browserWindowHeight = window.innerHeight;
		}
		
		// calculate document width height
		var x,y;
		var test1 = document.body.scrollHeight;
		var test2 = document.body.offsetHeight
		if (test1 > test2) { // all but Explorer Mac
			x = document.body.scrollWidth;
			y = document.body.scrollHeight;
		}
		else {// Explorer Mac;
			 //would also work in Explorer 6 Strict, Mozilla and Safari
			x = document.body.offsetWidth;
			y = document.body.offsetHeight;
		}
		
		// set the max of both
		browserWindowWidth = Math.max(browserWindowWidth, x);
		browserWindowHeight = Math.max(browserWindowHeight, y);
		
		// update invalidator?
		var inv = document.getElementById('scriptor_invalidator');
		if (inv)
		{
			inv.style.width = browserWindowWidth + 'px';
			inv.style.height = browserWindowHeight + 'px';
			if (inv.firstChild)
			{
				inv.firstChild.style.left = ((browserWindowWidth / 2) - 100) + 'px';
				inv.firstChild.style.top = ((browserWindowHeight / 2) - 15) + 'px';
			}
		}
	},
	
	/* some usefull html element functions */
	element : {
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
	},
	
	// SHA1 support
	SHA1 : function(msg) {
	
	   var rotate_left = function(n,s) {
		   var t4 = ( n<<s ) | (n>>>(32-s));
		   return t4;
	   };
	
	   var lsb_hex = function(val) {
		   var str="";
		   var i;
		   var vh;
		   var vl;
	
		   for( i=0; i<=6; i+=2 ) {
			   vh = (val>>>(i*4+4))&0x0f;
			   vl = (val>>>(i*4))&0x0f;
			   str += vh.toString(16) + vl.toString(16);
		   }
		   return str;
	   };
	
	   var cvt_hex = function(val) {
		   var str="";
		   var i;
		   var v;
	
		   for( i=7; i>=0; i-- ) {
			   v = (val>>>(i*4))&0x0f;
			   str += v.toString(16);
		   }
		   return str;
	   };
	
	
	   var Utf8Encode = function(string) {
		   string = string.replace(/\r\n/g,"\n");
		   var utftext = "";
	
		   for (var n = 0; n < string.length; n++) {
	
			   var c = string.charCodeAt(n);
	
			   if (c < 128) {
				   utftext += String.fromCharCode(c);
			   }
			   else if((c > 127) && (c < 2048)) {
				   utftext += String.fromCharCode((c >> 6) | 192);
				   utftext += String.fromCharCode((c & 63) | 128);
			   }
			   else {
				   utftext += String.fromCharCode((c >> 12) | 224);
				   utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				   utftext += String.fromCharCode((c & 63) | 128);
			   }
	
		   }
	
		   return utftext;
	   };
	
	   var blockstart;
	   var i, j;
	   var W = new Array(80);
	   var H0 = 0x67452301;
	   var H1 = 0xEFCDAB89;
	   var H2 = 0x98BADCFE;
	   var H3 = 0x10325476;
	   var H4 = 0xC3D2E1F0;
	   var A, B, C, D, E;
	   var temp;
	
	   msg = Utf8Encode(msg);
	
	   var msg_len = msg.length;
	
	   var word_array = new Array();
	   for( i=0; i<msg_len-3; i+=4 ) {
		   j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
		   msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
		   word_array.push( j );
	   }
	
	   switch( msg_len % 4 ) {
		   case 0:
			   i = 0x080000000;
		   break;
		   case 1:
			   i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
		   break;
	
		   case 2:
			   i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
		   break;
	
		   case 3:
			   i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
		   break;
	   }
	
	   word_array.push( i );
	
	   while( (word_array.length % 16) != 14 ) word_array.push( 0 );
	
	   word_array.push( msg_len>>>29 );
	   word_array.push( (msg_len<<3)&0x0ffffffff );
	
	
	   for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
	
		   for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
		   for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
	
		   A = H0;
		   B = H1;
		   C = H2;
		   D = H3;
		   E = H4;
	
		   for( i= 0; i<=19; i++ ) {
			   temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			   E = D;
			   D = C;
			   C = rotate_left(B,30);
			   B = A;
			   A = temp;
		   }
	
		   for( i=20; i<=39; i++ ) {
			   temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			   E = D;
			   D = C;
			   C = rotate_left(B,30);
			   B = A;
			   A = temp;
		   }
	
		   for( i=40; i<=59; i++ ) {
			   temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			   E = D;
			   D = C;
			   C = rotate_left(B,30);
			   B = A;
			   A = temp;
		   }
	
		   for( i=60; i<=79; i++ ) {
			   temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			   E = D;
			   D = C;
			   C = rotate_left(B,30);
			   B = A;
			   A = temp;
		   }
	
		   H0 = (H0 + A) & 0x0ffffffff;
		   H1 = (H1 + B) & 0x0ffffffff;
		   H2 = (H2 + C) & 0x0ffffffff;
		   H3 = (H3 + D) & 0x0ffffffff;
		   H4 = (H4 + E) & 0x0ffffffff;
	
	   }
	
	   var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	
	   return temp.toLowerCase();
 
	},
	
	// MD5 support
	/**
	*
	*  MD5 (Message-Digest Algorithm)
	*  http://www.webtoolkit.info/
	*
	**/
	 
	MD5 : function (string) {
	 
		var RotateLeft = function(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}
	 
		var AddUnsigned = function (lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}
	 
		var F = function(x,y,z) { return (x & y) | ((~x) & z); }
		var G = function(x,y,z) { return (x & z) | (y & (~z)); }
		var H = function(x,y,z) { return (x ^ y ^ z); }
		var I = function(x,y,z) { return (y ^ (x | (~z))); }
	 
		var FF = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		var GG = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		var HH = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		var II = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};
	 
		var ConvertToWordArray = function(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		};
	 
		var WordToHex = function(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		};
	 
		var Utf8Encode = function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
	 
				var c = string.charCodeAt(n);
	 
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	 
			}
	 
			return utftext;
		};
	 
		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;
	 
		string = Utf8Encode(string);
	 
		x = ConvertToWordArray(string);
	 
		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	 
		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}
	 
		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	 
		return temp.toLowerCase();
	}
};

// internal id generation system
var __nextIdNdx = 0;
var __lastId = 'scriptor_' + __nextIdNdx;
var __getNextHtmlId = function() {
	__lastId = 'scriptor_' + __nextIdNdx;
	__nextIdNdx++;
	
	while (document.getElementById(__lastId))
	{
		__nextIdNdx++;
		__lastId = 'scriptor_' + __nextIdNdx;
	}
	
	return __lastId;
};

var browserWindowHeight = 0;
var browserWindowWidth = 0;

var _body = null;

Scriptor.cookie.init();// JavaScript Document
/* 
*  httpReqiest version 2.0b
*
*  Manages multiple asyncronous xmlHttpRequests easily.
*
* Part of the Scriptor framework
*/

/* httpRequest
*
*  Parameters are:
*  ApiCall : String determining the api to call
*  method : POST or GET
*  Type : text, xml or json to parse data if necessary
*  onLoad : function to call on load
*  onError : function to call on error
*  requestHeaders : Optional reques headers as an array of array strings
*  example (this is automatically provided by httprequest):
*  	[ ['Content-Type', 'text/plain'] ]
*/
Scriptor.httpRequest = function(opts) {
	var localOpts = {
		ApiCall : null,
		method : 'POST',
		Type : 'json',
		onLoad : null,
		onError : null,
		requestHeaders : []
	};
	Scriptor.mixin(localOpts, opts);
	
	if (typeof(localOpts.ApiCall) != 'string' || localOpts.ApiCall == '') {
		Scriptor.error.report('httpRequest Error: first parameter must be a string.');	
		return;
	}
		
	this.ApiCall = localOpts.ApiCall;
	
	this.method = 'POST';
	if (typeof(localOpts.method) == 'string')
		this.method = localOpts.method.toUpperCase() == 'POST' ? 'POST' : 'GET';
	
	this.Type = 'text';
	if (typeof(localOpts.Type) == 'string')
	{
		switch (localOpts.Type.toLowerCase())
		{
			case ('xml'):
				this.Type = 'xml';
				break;
			case ('json'):
				this.Type = 'json';
				break;
			case ('text'):
			default:
				this.Type = 'text';
				break;
		}
	}
	
	this._mimeTypes = { xml : 'text/xml', text : 'text/plain', json : 'text/plain' };
	
	this.onLoad = null;
	if (typeof(localOpts.onLoad) == 'function') 
		this.onLoad = localOpts.onLoad;
	
	this.onError = null;
	if (typeof(localOpts.onError) == 'function')
		this.onError = localOpts.onError;
		
	this.requestHeaders = [];
	if (localOpts.requestHeaders && localOpts.requestHeaders.length) {
		for (var n=0; n < localOpts.requestHeaders.length; n++) {
			if (typeof(localOpts.requestHeaders[n][0]) == 'string' && typeof(localOpts.requestHeaders[n][1]) == 'string') {
				this.requestHeaders.push([localOpts.requestHeaders[n][0], localOpts.requestHeaders[n][1]]);
			}
		}
	}
	
	this.inRequest = false;
	this.http_request = null;
	
	// create the http_request object we're going to use
	this.createRequest();
};

Scriptor.httpRequest.prototype = {
	/* httpRequest.createRequest 
	*
	*  Creates the http_request internal object. For internal use only
	*/
	createRequest : function() {
		if (!this.http_request)
		{
			if (window.XMLHttpRequest) {
				this.http_request = new XMLHttpRequest();
				if (this.http_request.overrideMimeType) {
					this.http_request.overrideMimeType(this._mimeTypes[this.Type]);
				}
			} else if (window.ActiveXObject) {
				try {
					this.http_request = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						this.http_request = new ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {
						Scriptor.error.report('httpRequest could not create Ajax object.');
					}
				}
			}
		}
	},
	
	/*
	* httpRequest.send
	*
	* Send the request to the specified api
	* Params: String with optional query string parameters 
	*/
	send : function(params) {
		if (this.inRequest)
		{
			this.http_request.abort();
			this.inRequest = false;
		}
		
		var url = this.ApiCall;
		if (this.method == 'GET')
			url += '?' + params;
			
		this.http_request.open(this.method, url, true );
		if (this.method == 'POST')
			this.http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if (this.requestHeaders.length)
		{
			for (var n=0; n < this.requestHeaders.length; n++)
				this.http_request.setRequestHeader(this.requestHeaders[n][0], this.requestHeaders[n][1]);
		}
		
		this.http_request.onreadystatechange = Scriptor.bind(this.handleRequest, this);
		this.http_request.send(params);
		
		this.inRequest = true;
	},
	
	/* handleRequest 
	*
	*/
	handleRequest : function() {
		if (this.inRequest && this.http_request.readyState == 4)
		{		
			this.inRequest = false;
			if (this.http_request.status == 200) {
				if (this.onLoad)
				{
					// TODO: handle different types
					var response = null;
					switch (this.Type)
					{
						case ('xml'):
							response = this.http_request.responseXML;
							break;
						case ('json'):
							response = JSON.parse(this.http_request.responseText);
							break;
						case ('text'):
						default:
							response = this.http_request.responseText;
							break;
					}
					this.onLoad(response);
				}
			}
			else {
				if (this.onError)
					this.onError(this.http_request.status);
			}	
		}
	}
};
// JavaScript Document
/*
* httpRequest language pack Spanish
*/

Scriptor.httpRequest.prototype.lang = {
	errors : { createRequestError : 'Error loading Ajax object!',
		requestHandleError : 'There has been an error sending an Ajax object.\nPlease, try again later.' }
};/*
*
* Component.js
*
* Abstract class defining all Scriptor.ui basic properties.
*
* All Scriptor.ui components are derived and created from this class
*
*/

/*
* Internal component class to derive all widgets from
*/
var Component = {
	get : function(opts) {
		
		var localOpts = {
			id : null,
			region : "center",
			style : "",
			className : "",
			width : null,
			height : null,
			x : null,
			y : null,
			canHaveChildren : false,
			hasInvalidator : false,
			resizable : false,
			minHeight : null,
			maxHeight : null,
			minWidth : null,
			maxWidth : null
		};
		
		Scriptor.mixin(localOpts, opts);
		if (!localOpts.divId)
			localOpts.divId = __getNextHtmlId();
		
		var cmp = {
			CMP_SIGNATURE : "Scriptor.ui.Component",
			divId : localOpts.id,
			region : localOpts.region,
			style : localOpts.style,
			className : localOpts.className,
			target : null,
			cmpTarget : null,
			invalidator : null,
			canHaveChildren : localOpts.canHaveChildren,
			hasInvalidator : localOpts.hasInvalidator,
			enabled : true,
			splitters : {},
			resizingRegion : "",
			resizeStartingPosition : 0,
			resizeInterval : 20,
			lastResizeTimeStamp : null,
			
			created : false,
			inDOM : false,
			visible : false,
			x : localOpts.x,
			y : localOpts.y,
			width : localOpts.width,
			height : localOpts.height,
			resizable : localOpts.resizable,
			minHeight : localOpts.minHeight,
			maxHeight : localOpts.maxHeight,
			minWidth : localOpts.minWidth,
			maxWidth : localOpts.maxWidth,
			_percentWidth : null,
			_percentHeight : null,
			_origWidth : null,
			zIndexCache : 1,
			
			components : [],
			parent : null,
			hasFocus : false,
			
			// basic functions
			// List of functions to be optionally overriden by children
			DOMAddedImplementation : function() {},	// when component added to DOM and starts responding to document.getElementById
			DOMRemovedImplementation : function() {},	// if we relocate a component we need to re-initialize its event handlers?
			showImplementation : function() {},
			resizeImplementation : function() {},
			focusImplementation : function() {},
			blurImplementation : function() {},
			hideImplementation : function() {},
			destroyImplementation : function() {},
			
			focus : function(e) {
				if (!e)
					e = window.event;
					
				if (!this.hasFocus) {
					/*this.zIndexCache = this.target.style.zIndex ? Number(this.target.style.zIndex) : 1;
					this.target.style.zIndex = this.zIndexCache +1;*/
					
					if (this.parent && this.parent.CMP_SIGNATURE)
						for (var n=0; n < this.parent.components.length; n++) {
							if (this.parent.components[n].hasFocus) {
								this.parent.components[n].blur();
								break;
							}
						}
					
					this.focusImplementation.apply(this, arguments);
					Scriptor.event.fire(this, 'onfocus');
					
					this.hasFocus = true;
					Scriptor.className.add(this.target, 'jsComponentFocused');
				}
				
				return false;
			},
			
			blur : function() {
				if (this.hasFocus) {
					//this.target.style.zIndex = this.zIndexCache;
					
					this.blurImplementation.apply(this, arguments);
					Scriptor.event.fire(this, 'onblur');
						
					this.hasFocus = false;
					Scriptor.className.remove(this.target, 'jsComponentFocused');
					
					for (var n=0; n < this.components.length; n++)
						this.components[n].blur();
				}
			},
			
			passFocus : function() {
				if (this.hasFocus) {
					if (this.parent && this.parent.CMP_SIGNATURE) {
						if (this.parent.components.length > 1) {
							// determine the component with focus
							var focusedCmp = false;
							for (var n=0; n < this.parent.components.length; n++) {
								if (this.parent.components[n].hasFocus) {
									focusedCmp = n;
									break;
								}
							}
							
							// give focus to the next visible component in the list
							var gaveFocus = false;
							var startingPoint = (focusedCmp == this.parent.components.length-1) ? 0 : focusedCmp+1;
							for (var n=startingPoint; n < this.parent.components.length; n++) {
								if (this.parent.components[n].visible && n != focusedCmp) {
									this.parent.components[n].focus();
									gaveFocus = true;
									break;
								}
							}
							
							// not found in the list from middle to end, so search for elements before
							if (!gaveFocus && startingPoint > 0) {
								for (var n=0; n < startingPoint; n++) {
									if (this.parent.components[n].visible && n != focusedCmp) {
										this.parent.components[n].focus();
										gaveFocus = true;
										break;
									}
								}
							}
							
							// if no visible component is present, just blur
							if (!gaveFocus)
								this.blur();
						}
						else {
							this.blur();
						}
					}
					else {
						this.blur();
					}
				}				
			},
			
			create : function() {
				if (!this.created) {
					this.target = Scriptor.ComponentRegistry.spawnTarget(this);
					
					this.__updatePosition();
					
					if (this.style)
						this.target.setAttribute('style', this.style);
					
					var compClassName = this.className ? ('jsComponent jsComponentHidden ' + this.className) : 'jsComponent jsComponentHidden';
					this.target.className = this.target.className ? (compClassName + ' ' + this.target.className) : compClassName;
					
					targetMinHeight = parseInt(this.target.style.minHeight);
					targetMaxHeight = parseInt(this.target.style.maxHeight);
					targetMinWidth = parseInt(this.target.style.minWidth);
					targetMaxWidth = parseInt(this.target.style.maxWidth);
					
					if (!isNaN(targetMinHeight))
						this.minHeight = targetMinHeight;
					if (!isNaN(targetMaxHeight))
						this.maxHeight = targetMaxHeight;
					if (!isNaN(targetMinWidth))
						this.minWidth = targetMinWidth;
					if (!isNaN(targetMaxWidth))
						this.maxWidth = targetMaxWidth;
					
					if (this.width == null && !isNaN(parseInt(this.target.style.width)))
						this.width = parseInt(this.target.style.width);
					if (this.height == null && !isNaN(parseInt(this.target.style.height)))
						this.height = parseInt(this.target.style.height);
					
					if (this.target.style.width.substr(this.target.style.width.length-1) == '%')
						this._percentWidth = this.target.style.width;
					else
						this._origWidth = this.target.style.width;
					
					if (this.target.style.height.substr(this.target.style.height.length-1) == '%')
						this._percentHeight = this.target.style.height;
					
					Scriptor.event.attach(this.target, 'mousedown', Scriptor.bindAsEventListener(this.focus, this));
					
					if (this.canHaveChildren)
					{
						this.cmpTarget = document.createElement('div');
						this.cmpTarget.id = this.divId + "_cmpTarget";
						Scriptor.className.add(this.cmpTarget, "jsTargetComponent");
						this.target.appendChild(this.cmpTarget);
						
						this.splitters.top = null;
						this.splitters.left = null;
						this.splitters.right = null;
						this.splitters.bottom = null;
					}
					
					if (this.hasInvalidator)
					{
						this.invalidator = Scriptor.ComponentRegistry.spawnInvalidator(this);
					}
					
					Scriptor.event.fire(this, 'oncreate');
					
					this.created = true;
					if (document.getElementById(this.divId))
						this.onDOMAdded();
				}
			},
			
			__reReadDimentions : function() {
				if (document.getElementById(this.target.id))
				{
					targetMinHeight = parseInt(Scriptor.className.getComputedProperty(this.target, 'min-height'));
					targetMaxHeight = parseInt(Scriptor.className.getComputedProperty(this.target, 'max-height'));
					targetMinWidth = parseInt(Scriptor.className.getComputedProperty(this.target, 'min-width'));
					targetMaxWidth = parseInt(Scriptor.className.getComputedProperty(this.target, 'max-width'));
					
					if (!isNaN(targetMinHeight))
						this.minHeight = targetMinHeight;
					if (!isNaN(targetMaxHeight))
						this.maxHeight = targetMaxHeight;
					if (!isNaN(targetMinWidth))
						this.minWidth = targetMinWidth;
					if (!isNaN(targetMaxWidth))
						this.maxWidth = targetMaxWidth;
					
					var computedWidth = Scriptor.className.getComputedProperty(this.target, 'width');
					var computedHeight = Scriptor.className.getComputedProperty(this.target, 'height');
					if (this.width == null && !isNaN(parseInt(computedWidth)))
						this.width = parseInt(computedWidth);
					if (this.height == null && !isNaN(parseInt(computedHeight)))
						this.height = parseInt(computedHeight);
					
					if (computedWidth.substr(computedWidth.length-1) == '%')
						this._percentWidth = computedWidth;
					else
						this._origWidth = computedWidth;
					
					if (computedHeight.substr(computedHeight.length-1) == '%')
						this._percentHeight = computedHeight;
				}
				
				for (var n=0; n < this.components.length; n++)
					this.components[n].__reReadDimentions();
			},
			
			destroy : function() {
				var e = Scriptor.event.fire(this, 'onbeforedestroy');
				if (!e.returnValue)
					return;
					
				if (this.target) {
					this.visible = false;
					this.onDOMRemoved();
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].destroy();
					
					this.destroyImplementation.apply(this, arguments);
					
					Scriptor.event.fire(this, 'ondestroy');
						
					this.passFocus();
					
					if (this.parent) {
						this.parent.removeChild(this);
					}
					
					this.created = false;
					
					
					Scriptor.ComponentRegistry.destroy(this);
				}
			},
			
			show : function() {
				var e = Scriptor.event.fire(this, 'onbeforeshow');
				if (!e.returnValue)
					return;
				
				if (!this.created)
					this.create();
					
				if (!this.visible && this.target) {
					Scriptor.className.remove(this.target, 'jsComponentHidden');
					this.visible = true;
					
					this.showImplementation.apply(this, arguments);
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].show();	
					
					if (this.parent)
						this.parent.resize();
					else
						this.resize();	// we're doing component layout here!
					
					this.focus();
					
					Scriptor.event.fire(this, 'onshow');
				}
			},
			
			// layout the component acording to its size parameters
			// and resizes its children.
			resize : function() {
				if (this.target) {
					this.__updatePosition();
					
					if (this.components.length)
					{
						// get the component's padding if any
						var innerBox = this.__getInnerBox();
						var outerBox = this.__getOuterBox();
						// top region, stack horizontally with uniform widths
						var topChildren = this.__getChildrenForRegion("top");
						var maxTopHeight = 0;
						var topUniformWidth = (this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right) / topChildren.length;
						var topResizable = false;
						for (var n=0; n < topChildren.length; n++)
						{
							if (topChildren[n].height > maxTopHeight)
								maxTopHeight = topChildren[n].height;
							
							topChildren[n].x = (n*topUniformWidth);
							topChildren[n].y = 0;
							topChildren[n].width = topUniformWidth;
							topChildren[n].height = topChildren[n].height;
							
							if (topChildren[n].resizable)
								topResizable = true;
						}
						
						// bottom region, stack horizontally with uniform widths
						var bottomChildren = this.__getChildrenForRegion("bottom");
						var maxBottomHeight = 0;
						var bottomUniformWidth = (this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right) / bottomChildren.length;
						var bottomResizable = false;
						for (var n=0; n < bottomChildren.length; n++)
						{
							if (bottomChildren[n].height > maxBottomHeight)
								maxBottomHeight = bottomChildren[n].height;
							
							if (bottomChildren[n].resizable)
								bottomResizable = true;
						}
						
						for (var n=0; n < bottomChildren.length; n++)
						{
							bottomChildren[n].x = (n*bottomUniformWidth);
							bottomChildren[n].y = this.height - maxBottomHeight - innerBox.top - innerBox.bottom;
							bottomChildren[n].width = bottomUniformWidth;
							bottomChildren[n].height = bottomChildren[n].height;
						}
						
						// left region, stack vertically with uniform heights
						var leftChildren = this.__getChildrenForRegion("left");
						var maxLeftWidth = 0;
						var leftUniformHeight = (this.height - innerBox.top - innerBox.bottom - outerBox.left - outerBox.right) / leftChildren.length;
						var leftResizable = false;
						for (var n=0; n < leftChildren.length; n++)
						{
							if (leftChildren[n].width > maxLeftWidth)
								maxLeftWidth = leftChildren[n].width;
								
							leftChildren[n].x = 0;
							leftChildren[n].y = maxTopHeight + (n*leftUniformHeight);
							leftChildren[n].height = leftUniformHeight - maxTopHeight - maxBottomHeight;
							leftChildren[n].width = leftChildren[n].width;
							
							if (leftChildren[n].resizable)
								leftResizable = true;
						}
						
						// right region, stack vertically with uniform widths
						var rightChildren = this.__getChildrenForRegion("right");
						var maxRightWidth = 0;
						var rightUniformHeight = (this.height - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom) / rightChildren.length;
						var rightResizable = false;
						for (var n=0; n < rightChildren.length; n++)
						{
							if (rightChildren[n].width > maxRightWidth)
								maxRightWidth = rightChildren[n].width;
								
							if (rightChildren[n].resizable)
								rightResizable = true;
						}
						
						for (var n=0; n < rightChildren.length; n++)
						{
							rightChildren[n].x = this.width - maxRightWidth - innerBox.left - innerBox.right;
							rightChildren[n].y = maxTopHeight + (n*rightUniformHeight);
							rightChildren[n].width = maxRightWidth;
							rightChildren[n].height = rightUniformHeight - maxTopHeight - maxBottomHeight;
						}
						
						// center elements, stack vertically with uniform heights
						var centerChildren = this.__getChildrenForRegion("center");
						var centerUniformHeight = (this.height - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom - maxBottomHeight - maxTopHeight) / centerChildren.length;
						for (var n=0; n < centerChildren.length; n++)
						{
							centerChildren[n].x = maxLeftWidth;
							centerChildren[n].y = maxTopHeight + (n*centerUniformHeight);
							centerChildren[n].height = centerUniformHeight;
							centerChildren[n].width = this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right - maxLeftWidth - maxRightWidth;
						}
						
						// spawn splitters as needed
						if (topResizable)
						{
							if (!this.splitters.top)
							{
								this.splitters.top = document.createElement('div');
								this.splitters.top.id = this.divId + "_splitter_top";
								Scriptor.className.add(this.splitters.top, 'jsSplitter');
								Scriptor.className.add(this.splitters.top, 'jsSplitterHorizontal');
								this.cmpTarget.appendChild(this.splitters.top);
								Scriptor.event.attach(this.splitters.top, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "top"));
							}
							
							var topOuter = topChildren[0].__getOuterBox();
							
							this.splitters.top.style.width = (this.width - innerBox.left - innerBox.right) + 'px';
							this.splitters.top.style.top = (maxTopHeight - topOuter.bottom) + 'px';
						}
						else
						{
							if (this.splitters.top)
							{
								this.splitters.top.parentNode.removeChild(this.splitters.top);
								this.splitters.top = null;
							}
						}
						
						if (bottomResizable)
						{
							if (!this.splitters.bottom)
							{
								this.splitters.bottom = document.createElement('div');
								this.splitters.bottom.id = this.divId + "_splitter_bottom";
								Scriptor.className.add(this.splitters.bottom, 'jsSplitter');
								Scriptor.className.add(this.splitters.bottom, 'jsSplitterHorizontal');
								this.cmpTarget.appendChild(this.splitters.bottom);
								Scriptor.event.attach(this.splitters.bottom, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "bottom"));
							}
							
							var bottomOuter = bottomChildren[0].__getOuterBox();
							var splitterHeight = parseInt(Scriptor.className.getComputedProperty(this.splitters.bottom, 'height'));
							if (isNaN(splitterHeight))
								splitterHeight = 5;
							
							this.splitters.bottom.style.width = (this.width - innerBox.left - innerBox.right) + 'px';
							this.splitters.bottom.style.top = (this.height - maxBottomHeight - splitterHeight - bottomOuter.top) + 'px';
						}
						else
						{
							if (this.splitters.bottom)
							{
								this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
								this.splitters.bottom = null;
							}
						}
						
						if (leftResizable)
						{
							if (!this.splitters.left)
							{
								this.splitters.left = document.createElement('div');
								this.splitters.left.id = this.divId + "_splitter_left";
								Scriptor.className.add(this.splitters.left, 'jsSplitter');
								Scriptor.className.add(this.splitters.left, 'jsSplitterVertical');
								this.cmpTarget.appendChild(this.splitters.left);
								Scriptor.event.attach(this.splitters.left, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "left"));
							}
							
							var leftOuter = leftChildren[0].__getOuterBox();
							
							this.splitters.left.style.height = (this.height - innerBox.top - innerBox.bottom - maxTopHeight - maxBottomHeight) + 'px';
							this.splitters.left.style.top = (maxTopHeight) + 'px';
							this.splitters.left.style.left = (maxLeftWidth - leftOuter.right) + 'px';
						}
						else
						{
							if (this.splitters.left)
							{
								this.splitters.left.parentNode.removeChild(this.splitters.left);
								this.splitters.left = null;
							}
						}
						
						if (rightResizable)
						{
							if (!this.splitters.right)
							{
								this.splitters.right = document.createElement('div');
								this.splitters.right.id = this.divId + "_splitter_right";
								Scriptor.className.add(this.splitters.right, 'jsSplitter');
								Scriptor.className.add(this.splitters.right, 'jsSplitterVertical');
								this.cmpTarget.appendChild(this.splitters.right);
								Scriptor.event.attach(this.splitters.right, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "right"));
							}
							
							var rightOuter = rightChildren[0].__getOuterBox();
							var splitterWidth = parseInt(Scriptor.className.getComputedProperty(this.splitters.right, 'width'));
							if (isNaN(splitterWidth))
								splitterWidth = 5;
							
							this.splitters.right.style.height = (this.height - innerBox.top - innerBox.bottom - maxTopHeight - maxBottomHeight) + 'px';
							this.splitters.right.style.top = (maxTopHeight) + 'px';
							this.splitters.right.style.left = (this.width - maxRightWidth - splitterWidth - rightOuter.left) + 'px';
						}
						else
						{
							if (this.splitters.right)
							{
								this.splitters.right.parentNode.removeChild(this.splitters.right);
								this.splitters.right = null;
							}
						}
					}
					
					this.resizeImplementation.apply(this, arguments);
					
					Scriptor.event.fire(this, 'onresize');
						
					for (var n=0; n < this.components.length; n++) 
						this.components[n].resize();
				}
			},
			
			resizeTo : function(newSize) {
				if (newSize)
				{
					if (newSize.width)
					{
						this.width = newSize.width;
						this._percentWidth = null;
					}
					if (newSize.height)
					{
						this.height = newSize.height;
						this._percentHeight = null;
					}
					
					this.__updatePosition();
					
					if (this.parent)
						this.parent.resize();
					else
						for (var n=0; n < this.components.length; n++) 
							this.components[n].resize();
				}
			},
			
			hide : function() {
				var e = Scriptor.event.fire(this, 'onbeforehide');
				if (!e.returnValue)
					return;
				
				if (this.visible && this.target) {
					Scriptor.className.add(this.target, 'jsComponentHidden');
					this.visible = false;
					
					this.hideImplementation.apply(this, arguments);
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].hide();
					
					if (this.parent)
						this.parent.resize();
					else
						this.resize();	// we're doing component layout here!
						
					this.passFocus();
					
					Scriptor.event.fire(this, 'onhide');
				}
			},
			
			// replace the contents of the component's target div
			// or child target with the passed HTMLElement or component
			setContent : function(ref) {
				if (this.created && this.canHaveChildren)
				{
					while (this.components.length)
						this.removeChild(this.components[0]);
					
					if (ref)
					{
						if (ref.CMP_SIGNATURE)
						{
							this.addChild(ref);
							return true;
						}
						else if (Scriptor.isHtmlElement(ref))
						{
							this.cmpTarget.appendChild(ref);
							this.resize();
							return true;
						}
						else if (typeof(ref) == "string")
						{
							this.cmpTarget.innerHTML = ref;
							this.resize();
							return true;
						}
					}
				}
				
				return false;
			},
			
			// add a children component into the component's target
			// div and relayout
			addChild : function(ref) {
				if (this.created && this.canHaveChildren)
				{
					var found = false;
					for (var n=0; n < this.components.length; n++)
					{
						if (this.components[n] === ref)
						{
							found = true;
							break;
						}
					}
					
					if (!found && ref.CMP_SIGNATURE && this.canHaveChildren) {
						if (ref.parent)
							ref.parent.removeChild(ref);
						
						// nodeType IE8 nasty bug!
						if (ref.target.parentNode && ref.target.parentNode.nodeType !== 11)
						{
							ref.onDOMRemoved();
							ref.target.parentNode.removeChild(ref.target);
						}
						
						this.components.push(ref);
						this.cmpTarget.appendChild(ref.target);
						ref.parent = this;
						Scriptor.className.add(ref.target, 'jsComponentChild');
						this.__reReadDimentions();	// stylesheet properties are applyed at this point and
													// we should update them
						
						if (ref.visible != this.visible)
						{
							if (ref.visible)
								ref.hide();
							else
								ref.show();
						}
						
						if (this.inDOM)
							ref.onDOMAdded();
						
						this.resize();
						return true;
					}
				}
				
				return false;
			},
			
			// remove a component from its children collection, does not destroy
			// the component
			removeChild : function(ref) {
				if (this.created && this.canHaveChildren)
				{
					for (var n=0; n < this.components.length; n++)
					{
						if (this.components[n] === ref)
						{
							ref.onDOMRemoved();
							
							ref.target.parentNode.removeChild(ref.target);
							this.components.splice(n, 1);
							Scriptor.className.remove(ref.target, 'jsComponentChild');
							ref.parent = null;
							
							this.resize();
							return true;
						}
					}
				}
				
				return false;
			},
			
			onDOMAdded : function() {
				this.inDOM = true;
				
				this.DOMAddedImplementation();
				
				for (var n=0; n < this.components.length; n++)
					this.components[n].onDOMAdded();
			},
			
			onDOMRemoved : function() {
				this.inDOM = false;
				
				this.DOMRemovedImplementation();
				
				for (var n=0; n < this.components.length; n++)
					this.components[n].onDOMRemoved();
			},
			
			__updatePosition : function() {
				if (this.target)
				{
					var innerBox = this.__getInnerBox();
					var outerBox = this.__getOuterBox();
					var testWidth = 0, testHeight = 0;
					
					if (this._percentWidth !== null)
					{
						this.target.style.width = this._percentWidth;
						this.width = this.target.offsetWidth - outerBox.left - outerBox.right - innerBox.left - innerBox.right;
					}
					else if (this._origWidth !== null)
					{
						if ((!this._origWidth || this._origWidth == "auto") && this.parent === null)
						{
							if (this.target.parentNode)
							{
								outerBox = this.__getOuterBox();
								// avoid ie errors
								testWidth = this.target.parentNode.offsetWidth - outerBox.left - outerBox.right - innerBox.left - innerBox.right;
								if (isNaN(testWidth) || testWidth < 0)
									testWidth = 0;
								this.width = testWidth;
							}
						}
					}
					
					if (this._percentHeight !== null)
					{
						this.target.style.height = this._percentHeight;
						testHeight = this.target.offsetHeight - outerBox.top - outerBox.bottom - innerBox.top - innerBox.bottom;
						if (isNaN(testHeight) || testHeight < 0)
							testHeight = 0;
						this.height = testHeight;
					}
					
					
					if (this.width !== null)
					{
						// avoid IE errors
						testWidth = this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right;
						if (isNaN(testWidth) || testWidth < 0)
							testWidth = 0;
						this.target.style.width = testWidth + 'px';
					}
					if (this.height !== null)
					{
						// avoid ie errors
						testHeight = this.height  - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom;
						if (isNaN(testHeight) || testHeight < 0)
							testHeight = 0;
						this.target.style.height = testHeight + 'px';
					}
					if (this.x !== null)
						this.target.style.left = this.x + 'px';
					if (this.y !== null)
						this.target.style.top = this.y + 'px';
						
					if (this.maxHeight !== null)
						this.target.style.maxHeight = this.maxHeight + 'px';
					if (this.minHeight !== null)
						this.target.style.minHeight = this.minHeight + 'px';
					if (this.maxWidth !== null)
						this.target.style.maxWidth = this.maxWidth + 'px';
					if (this.minWidth !== null)
						this.target.style.minWidth = this.minWidth + 'px';
					
				}
			},
			
			// get top, bottom, left, right values according to the component's
			// padding
			__getInnerBox : function() {
				var box = { top : 0, bottom: 0, left : 0, right : 0 };
				
				var innerTop = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-top'));
				var innerBottom = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-bottom'));
				var innerLeft = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-left'));
				var innerRight = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-right'));
				
				if (!isNaN(innerTop))
					box.top = innerTop;
				if (!isNaN(innerBottom))
					box.bottom = innerBottom;
				if (!isNaN(innerLeft))
					box.left = innerLeft;
				if (!isNaN(innerRight))
					box.right = innerRight;
				
				var borderTop = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-top-width'));
				var borderBottom = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-bottom-width'))
				var borderLeft = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-left-width'))
				var borderRight = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-right-width'))
				
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
			__getOuterBox : function() {
				var box = { top : 0, bottom: 0, left : 0, right : 0 };
				
				var outerTop = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-top'));
				var outerBottom = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-bottom'));
				var outerLeft = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-left'));
				var outerRight = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-right'));
				
				if (!isNaN(outerTop))
					box.top = outerTop;
				if (!isNaN(outerBottom))
					box.bottom = outerBottom;
				if (!isNaN(outerLeft))
					box.left = outerLeft;
				if (!isNaN(outerRight))
					box.right = outerRight;
					
				return box;
			},
			
			//returns an array with references to children that
			// has a region str
			__getChildrenForRegion : function(str) {
				var ret = [];
				
				for (var n=0; n < this.components.length; n++)
				{
					if (this.components[n].region == str && this.components[n].visible)
						ret.push(this.components[n]);
				}
				
				return ret;
			},
			
			_onResizeStart : function(e, region) {
				if (!e)	e = window.event;
					
				this.resizingRegion = region;
				
				Scriptor.event.attach(document, 'mousemove', this._resizeMoveHandler = Scriptor.bindAsEventListener(this._onResizeMove, this));
				Scriptor.event.attach(document, 'mouseup', this._resizeStopHandler = Scriptor.bindAsEventListener(this._onResizeStop, this));
				
				if (region == "top" || region == "bottom")
					this.resizeStartingPosition = Scriptor.event.getPointXY(e).y;
				else
					this.resizeStartingPosition = Scriptor.event.getPointXY(e).x;
				
				Scriptor.event.cancel(e, true);
				return false;
			},
			
			_onResizeMove : function(e) {
				if (!e)	e = window.event;
				
				var curTime = new Date().getTime();
				
				if (this.lastResizeTimeStamp && this.lastResizeTimeStamp + this.resizeInterval > curTime)
				{
					Scriptor.event.cancel(e, true);
					return false;
				}
				
				this.lastResizeTimeStamp = curTime;
				
				var curPos = 0;
				if (this.resizingRegion == "top" || this.resizingRegion == "bottom")
					curPos = Scriptor.event.getPointXY(e).y;
				else
					curPos = Scriptor.event.getPointXY(e).x;
				var delta = curPos - this.resizeStartingPosition;
				this.resizeStartingPosition = curPos;
				
				var children = this.__getChildrenForRegion(this.resizingRegion);
				switch (this.resizingRegion)
				{
					case ("top"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({height : children[n].height + delta});
						}
						break;
					
					case ("bottom"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({height : children[n].height - delta});
						}
						break;
					
					case ("left"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({width : children[n].width + delta});
						}
						break;
					
					case ("right"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({width : children[n].width - delta});
						}
						break;
					
				}
				
				Scriptor.event.cancel(e, true);
				return false;
			},
			
			_onResizeStop : function(e) {
				if (!e)	e = window.event;
				
				Scriptor.event.detach(document, 'mousemove', this._resizeMoveHandler);
				Scriptor.event.detach(document, 'mouseup', this._resizeStopHandler);
				
				this.lastResizeTimeStamp = null;
				this.resizingRegion = "";
				
				Scriptor.event.cancel(e, true);
				return false;
			},
			
			invalidate : function() {
				if (this.invalidator && this.enabled)
				{
					this.enabled = false;
					this.invalidator.style.display = 'block';
				}
			},
			
			revalidate : function() {
				if (this.invalidator && !this.enabled)
				{
					this.enabled = true;
					this.invalidator.style.display = 'none';
				}
			}
			
		};
		
		var availableRegions = ["center", "left", "top", "bottom", "right"];
		var validRegion = false;
		for (var n=0; n < availableRegions.length; n++)
		{
			if (cmp.region == availableRegions[n])
			{
				validRegion = true;
				break;
			}
		}
		
		if (!validRegion)
			cmp.region = "center";
		
		return cmp;
	}
};

Scriptor.ComponentRegistry = {
	_registry : [],
	
	add : function(id, cmp) {
		if (!this.getById(id))
		{
			this._registry.push({'id' : id, 'cmp' : cmp});
		}
		else
		{
			throw 'Warning: duplicate component id '  + id;
		}
	},
	
	remove : function(ref) {
		if (typeof(ref) == 'string')
		{
			for (var n=0; n < this._registry.length; n++)
			{
				if (this._registry[n].id == ref)
				{
					this._registry.splice(n, 1);
					return;
				}
			}
		}
		else if (ref.CMP_SIGNATURE)
		{
			for (var n=0; n < this._registry.length; n++)
			{
				if (this._registry[n].cmp === ref)
				{
					this._registry.splice(n, 1);
					return;
				}
			}
		}
	},
	
	getById : function(id) {
		for (var n=0; n < this._registry.length; n++)
		{
			if (this._registry[n].id == id)
				return this._registry[n].cmp;
		}
		
		return null;
	},
	
	spawnTarget : function(cmp) {
		if (!cmp.divId)
			cmp.divId = __getNextHtmlId();
			
		var ret = document.getElementById(cmp.divId);
		if (!ret) {	// not present in DOM
			ret = document.createElement('div');
			ret.id = cmp.divId;
		}
		
		this.add(cmp.divId, cmp);
		
		return ret;
	},
	
	spawnInvalidator : function(cmp) {
		if (!cmp.divId || !cmp.target)
			return null;
		
		ret = document.createElement('div');
		ret.id = cmp.divId + '_invalidator';
		ret.className = 'jsComponentInvalidator';
		ret.style.display = "none";
		cmp.target.appendChild(ret);
		
		return ret;
	},
	
	destroy : function(cmp) {
		if (document.getElementById(cmp.divId))
		{
			cmp.target.parentNode.removeChild(cmp.target);
		}
		cmp.target = null;
		
		
		if (cmp.invalidator)
		{
			if (document.getElementById(cmp.invalidator.id))
			{
				cmp.invalidator.parentNode.removeChild(cmp.invalidator);
			}
			cmp.invalidator = null;
		}
		
		if (cmp.cmpTarget)
		{
			if (document.getElementById(cmp.cmpTarget.id))
			{
				cmp.cmpTarget.parentNode.removeChild(cmp.cmpTarget);
			}
			cmp.cmpTarget = null;
		}
		
		this.remove(cmp);
	},
	
	onWindowResized : function(e) {
		setTimeout(Scriptor.bind(function() {
			for (var n=0; n < this._registry.length; n++)
			{
				if (!this._registry[n].cmp.parent)
					this._registry[n].cmp.resize();
			}
		}, this), 1);
	}
};

Scriptor.event.attach(window, 'onresize', Scriptor.bindAsEventListener(Scriptor.ComponentRegistry.onWindowResized, Scriptor.ComponentRegistry));
/* JavaScript Document
*
* Global context menu system for the Scriptor framework
*
* This object is part of the scriptor framework
*/

/*
* contextMenu
*
* A menu that can be shown on rightClick (or clicking on an icon or link)
*
* div: The div id or element in which to render the menu
*
* options are:
* 	items : an array of item objects in the form { label : "label", onclick : callback }
* 	  will form the menu system, if label == "sep", it will render a separator
* 	  (see addItem for details)
*
* 	 width: the width of the context menu
*/
Scriptor.ContextMenu = function(opts)
{
	var localOpts = {
		canHaveChildren : false,
		hasInvalidator : false,
		items : []
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.ContextMenu";
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	// create component
	this.create();
	Scriptor.className.add(this.target, "jsContextMenu");
	this.target.innerHTML = '<ul id="'+this.divId+'_ul"></ul>';
	Scriptor.body().appendChild(this.target);
	this.ul = document.getElementById(this.divId+'_ul');
	
	this.onDOMAdded();
	
	// reset original width since we will leave this property to the widest option
	this._origWidth = null;
	
	this.items = [];
	for (var n=0; n < localOpts.items.length; n++)
		this.addItem(this.items[n]);
	
	// redefine component implementation
	/*
	* contextMenu.Show
	*
	* To show the actual contextMenu on screen,
	*   the function must be called from a click callback so
	*   the system gets x and y position for the menu
	*/
	this.showImplementation = function(e)
	{
		if (!e)	e = window.event;
		
		// hide previously active context menus
		for (var n=0; n < Scriptor.ComponentRegistry._registry.length; n++)
		{
			var cmp = Scriptor.ComponentRegistry._registry[n].cmp;
			if (cmp.CMP_SIGNATURE == "Scriptor.ui.ContextMenu" && cmp.visible && cmp != this)
				cmp.hide();
		}
		
		// calculate x, y
		var x = 0, y = 0;
		
		if (e)
		{
			if (typeof(e.pageX) == 'number') {
				x = e.pageX;
				y = e.pageY;
			}
			else {
				if (typeof(e.clientX) == 'number') {
					x = (e.clientX + document.documentElement.scrollLeft);
					y = (e.clientY + document.documentElement.scrollTop);
				}
				else {
					x = 0;
					y = 0;
				}
			}
		}
		
		if (x + this.width > Scriptor.body().offsetWidth)
			x = x-this.width;
		if (y + this.height > Scriptor.body().offsetHeight)
			y = y-this.height;
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		
		this.y = y;
		this.x = x;
		this.updateSize();
		
		if (this._checkMenuBind)
			Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
		setTimeout(Scriptor.bind(function() {	
			Scriptor.event.attach(document, 'onclick', this._checkMenuBind = Scriptor.bind(this.checkMenu, this));
		}, this), 1);
		
		Scriptor.event.cancel(e);
		return false;
	};
	
};

Scriptor.ContextMenu.prototype.updateSize = function()
{	
	var ubox = Scriptor.element.getOuterBox(this.ul);
	var ibox = this.__getInnerBox();
	
	this.target.style.width = "auto";
	this.width = this.ul.offsetWidth + ubox.left + ubox.right + ibox.left + ibox.right;
	this.height = this.ul.offsetHeight + ubox.top + ubox.bottom + ibox.top + ibox.bottom;
	this.__updatePosition();
};

/*
* contextMenu.addItem
*
*   Ads an item to the contextMenu dynamically
*   Options are:
*    label: the name of the item (if set to "sep" it will render a separator)
*    class: a class formatting the item
*    onclick: the callback fucntion when clicked
*    
*   ndx if specified will insert the item in the specified index
*/
Scriptor.ContextMenu.prototype.addItem = function(opts, ndx)
{
	var localOpts = {
		label : 'sep',
		onclick : null,
		checked : false
	};
	Scriptor.mixin(localOpts, opts);
	
	if (!isNaN(Number(ndx)) && ndx >= 0 && ndx < this.items.length)
	{
		this.items.splice(ndx, 0, localOpts);
	}
	else
	{
		ndx = this.items.length;
		this.items.push(localOpts);
	}
		
	if (this.target)
	{
		
		var li = document.createElement('li');
		var cTemplate = '';
		var item = localOpts;
		
		if (item.label == 'sep')
		{
			li.className = "contextMenuSep";
		}
		else
		{
			if (item.checked)
				li.className = "OptionChecked";
				
			cTemplate += '<a href="'+Scriptor.getInactiveLocation()+'" id="'+this.divId+'_itm_' + ndx + '"';
			if (item['class'])
				cTemplate += ' class="' + item['class'] + '"';
			cTemplate += '>' + item.label + '</a>';
		}
		li.innerHTML = cTemplate;
		
		if (ndx == this.items.length-1)
		{
			this.ul.appendChild(li);
		}
		else
		{
			this.ul.insertBefore(li, this.ul.getElementsByTagName('li')[ndx]);
		}
		
		if (item.label != 'sep' && typeof(item.onclick) == 'function')
		{
			Scriptor.event.attach(document.getElementById(this.divId+'_itm_' + ndx), 'onclick', item.onclick);
		}
		
		this.updateSize();
	}
};
	
/*
* contextMenu.removeItem
*
*   Will remove the item specified by identifier, this can be
*    a Number stating the index of the item in the array
*    or the item itself as an Object
*/
Scriptor.ContextMenu.prototype.removeItem = function(identifier)
{
	if (typeof(identifier) == 'number')
	{
		if (identifier >= 0 && identifier <= this.items.length-1)
		{
			this.items.splice(identifier, 1);
			if (this.target)
				this.ul.removeChild(this.ul.getElementsByTagName('li')[identifier]);
		}
	}
	else if (typeof(identifier) == 'object')
	{
		for (var n=0; n < this.items.length; n++)
		{
			if (this.items[n] == identifier)
			{
				this.items.splice(n, 1);
				if (this.target)
					this.ul.removeChild(this.ul.getElementsByTagName('li')[n]);
				break;
			}
		}
	}
	
	if (this.target)
		this.updateSize();
};

/*
* contextMenu.checkItem
* 
* 	Marks the identified item as checked, if no param
* 	 passed, unmarks all items.
* 
*/
Scriptor.ContextMenu.prototype.checkItem = function(identifier, checked)
{
	if (typeof(identifier) == 'undefined')
		return;
	
	if (typeof(checked) == 'undefined')
		checked = false;
		
	if (typeof(identifier) == 'number')
	{
		if (identifier >= 0 && identifier <= this.items.length-1)
		{
			this.items[identifier].checked = checked ? true : false;
			if (this.target)
				Scriptor.className[(checked ? "add" : "remove")](this.ul.getElementsByTagName('li')[identifier], "OptionChecked");
			
		}
	}
	else if (typeof(identifier) == 'object')
	{
		for (var n=0; n < this.items.length; n++)
		{
			if (this.items[n] == identifier)
			{
				this.items[n].checked = checked ? true : false;
				if (this.target)
					Scriptor.className[(checked ? "add" : "remove")](this.ul.getElementsByTagName('li')[n], "OptionChecked");
				break;
			}
		}
	}
}

Scriptor.ContextMenu.prototype.checkMenu = function()
{
	if (this._checkMenuBind)
		Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
	// always hide after click?
	this.hide();
	
};/*
*
* Scriptor Panel
*
* Panel component class
*
*/

Scriptor.Panel = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.Panel";
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	this.create();
	Scriptor.className.add(this.target, "jsPanel");
};
/*
*
* Scriptor TabContainer
*
* Panel component class
*
*/

Scriptor.TabContainer = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.TabContainer";
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	Scriptor.event.registerCustomEvent(this, 'onselect');
	Scriptor.event.registerCustomEvent(this, 'ontabclosed');
	
	this._tabs = [];
	this._selectedTabId = null;
	
	// redefine component implementation
	this.resizeImplementation = function() {
		var tabsInnerWidth = this._tabList.cmpTarget.offsetWidth;
		var orignTabsInnerWidth = tabsInnerWidth;
		
		if (this._tabsContextMenu.visible)
			this._tabsContextMenu.checkMenu();	// this will cause the menu to hide
		
		var moreDropDown = document.getElementById(this._tabList.divId + "_more");
		if (moreDropDown)
		{
			var moreOuterLeft = parseInt(Scriptor.className.getComputedProperty(moreDropDown, 'margin-left'));
			var moreOuterRight = parseInt(Scriptor.className.getComputedProperty(moreDropDown, 'margin-right'));
			
			tabsInnerWidth -= (moreDropDown.offsetWidth + moreOuterLeft + moreOuterRight);
		}
		
		var totalTabsWidth = 0;
		var extraTabReached = false;
		for (var n=0; n < this._tabList.cmpTarget.childNodes.length; n++)
		{
			var theTab = this._tabList.cmpTarget.childNodes[n];
			
			var outerLeft = parseInt(Scriptor.className.getComputedProperty(theTab, 'margin-left'));
			var outerRight = parseInt(Scriptor.className.getComputedProperty(theTab, 'margin-right'));
			
			if (isNaN(outerLeft))
				outerLeft = 0;
				
			if (isNaN(outerRight))
				outerRight = 0;
			
			totalTabsWidth += theTab.offsetWidth + outerLeft + outerRight;
			
			if (n == this._tabList.cmpTarget.childNodes.length-1)
				tabsInnerWidth = orignTabsInnerWidth;
				
			if (totalTabsWidth >= tabsInnerWidth)
			{
				if (!this._tabList._showingMore)
					this._tabList.showMore();
				
				if (!extraTabReached)
				{
					this._tabList._extraTabs = n;
					extraTabReached = true;
				}
				
				theTab.style.visibility = "hidden";
			}
			else
			{
				theTab.style.visibility = "visible";
			}
		}
		
		if (totalTabsWidth < tabsInnerWidth)
		{
			if (this._tabList._showingMore)
				this._tabList.hideMore();
				
			this._tabList._extraTabs = this._tabs.length;
		}
		
		this._updateExtraTabsContextMenu();
		
	};

	this.destroyImplementation = function() {
		this._tabsContextMenu.destroy();
	};
	
	this.create();
	Scriptor.className.add(this.target, "jsTabContainer");
	
	// component template
	this._tabsContextMenu = new Scriptor.ContextMenu();
	
	this._tabList = new TabListObj({
		id : this.divId + '_tabList',
		region : "top",
		className : 'jsTabList'
	});
	this.addChild(this._tabList);
	
	this._pageContainer = new TabPageContainer({
		id : this.divId + '_pageContainer',
		region : "center",
		className : 'jsPageContainer'
	});
	this.addChild(this._pageContainer);
	
	this._canHaveChildren = false;
};

Scriptor.TabContainer.prototype.addTab = function(opts, panel, ndx) {
	if (!this.inDOM)
	{
		Scriptor.error.report("TabContainer must be added to DOM before adding tabs!");
		return;
	}
	
	var localOpts = {
		title : '',
		paneId : panel.divId,
		pane : panel,
		closable : false
	};
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.pane || !localOpts.pane.CMP_SIGNATURE || !localOpts.pane.created)
		return;
	

	if (typeof(ndx) == 'undefined')
		ndx = this._tabs.length;
	else if (ndx < 0 || ndx > this._tabs.length)
		ndx = this._tabs.length;
	
	// add the tab logically
	var theTab = new TabInstance(localOpts);
	if (ndx < this._tabs.length)
		this._tabs.splice(ndx, 0, theTab);
	else
		this._tabs.push(theTab);
	
	// add the tab label to DOM
	var tabs = this._tabList.cmpTarget.childNodes;
	var tabNode = document.createElement('div');
	tabNode.id = theTab.paneId + "_tablabel";
	
	tabNode.className = 'jsTabLabel';
	if (theTab.closable)
		Scriptor.className.add(tabNode, 'jsTabClosable');
	
	// select the frist tab added
	if (this._tabs.length == 1)
	{
		this._selectedTabId = theTab.paneId;
		Scriptor.className.add(tabNode, 'jsTabSelected');
	}
	
	tabNode.innerHTML = '<span>' + theTab.title + '</span>' +
		'<span class="jsTabCloseBtn" id="'+theTab.paneId + '_closeHandler"> </span>';
	if (ndx == this._tabs.length-1)
		this._tabList.cmpTarget.appendChild(tabNode);
	else
		this._tabList.cmpTarget.insertBefore(tabNode, tabs[ndx]);
	
	// add the tab to the tabs page list
	this._pageContainer.addPage(theTab.pane);
	this._pageContainer.activate(this._selectedTabId);
	
	var theTabCloseHandler = document.getElementById(theTab.paneId + '_closeHandler');
	if (!theTab.closable)
	{
		Scriptor.className.add(theTabCloseHandler, 'jsTabCloseHidden');
	}
	else
	{
		Scriptor.className.add(tabNode, 'jsTabClosable');
	}
	
	// event handlers
	Scriptor.event.attach(tabNode, 'onclick', Scriptor.bindAsEventListener(this.selectTab, this, theTab.paneId));
	Scriptor.event.attach(theTabCloseHandler, 'onclick', Scriptor.bindAsEventListener(this.closeTab, this, theTab.paneId));
	
	this.resize();
};

Scriptor.TabContainer.prototype.removeTab = function(ref, destroy) {
	if (!this.inDOM)
	{
		Scriptor.error.report("TabContainer must be added to DOM before removing tabs!");
		return;
	}
	
	if (typeof(destroy) == 'undefined')
		destroy = true;
	
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		// deselect tab
		var reselect = false;
		if (this._selectedTabId == this._tabs[ndx].paneId)
			var reselect = true
		
		// remove tab
		this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
		this._pageContainer.removePage(this._tabs[ndx].pane, destroy);
		this._tabs.splice(ndx, 1);
		
		if (reselect)
		{
			if (this._tabs[ndx])
				this._selectedTabId = this._tabs[ndx].paneId;
			else if (this._tabs.length)
				this._selectedTabId = this._tabs[this._tabs.length-1].paneId;
			else
				this._selectedTabId = null;
				
			Scriptor.className.add(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
			this._pageContainer.activate(this._selectedTabId);
		}
		
		this.resize();
	}
};

Scriptor.TabContainer.prototype.selectTab = function(e, ref) {
	if (!this.inDOM)
	{
		Scriptor.error.report("TabContainer must be added to DOM before selecting tabs!");
		return false;
	}
	
	if (arguments.length == 1)	// not a click event
	{
		ref = e;
	}
	
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		if (arguments.length > 1)
		{
			e.selectedTabId = this._selectedTabId;
			e.selecting = ndx;
			e = Scriptor.event.fire(this, 'onselect', e);
			
			if (e.returnValue == false)
			{
				Scriptor.event.cancel(e, true);
				return false;
			}
		}
		
		Scriptor.className.remove(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
		
		if (this._tabs[ndx])
		{
			this._selectedTabId = this._tabs[ndx].paneId;
			
			for (var n=0; n < this._tabsContextMenu.items.length; n++)
			{
				this._tabsContextMenu.checkItem(n, (n == ndx-this._tabList._extraTabs));
			}
		}
		
		Scriptor.className.add(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
		this._pageContainer.activate(this._selectedTabId);
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

Scriptor.TabContainer.prototype.getSelectedTab = function() {
	for (var n=0; n < this._tabs.length; n++)
	{
		if (this._tabs[n].paneId == this._selectedTabId)
			return this._tabs[n].pane;
	}
	
	return null;
};

Scriptor.TabContainer.prototype.setTitle = function(ref, title) {
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML = title;
		this.resize();
	}
};

Scriptor.TabContainer.prototype.setClosable = function(ref, closable) {
	if (!this.inDOM)
	{
		Scriptor.error.report("TabContainer must be added to DOM before calling to setClosable!");
		return;
	}
	
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		var theTab = this._tabList.cmpTarget.childNodes[ndx];
		var theTabCloseHandler = document.getElementById(this._tabs[ndx].paneId + "_closeHandler");
		if (closable)
		{
			Scriptor.className.add(theTab, 'jsTabClosable');
			Scriptor.className.remove(theTabCloseHandler, 'jsTabCloseHidden');
		}
		else
		{
			Scriptor.className.remove(theTab, 'jsTabClosable');
			Scriptor.className.add(theTabCloseHandler, 'jsTabCloseHidden');
		}
		
		this.resize();
	}
};

Scriptor.TabContainer.prototype.closeTab = function(e, ref) {
	if (!this.inDOM)
	{
		Scriptor.error.report("TabContainer must be added to DOM before closing tabs!");
		return false;
	}
	
	if (arguments.length == 1)	// not a click event
	{
		ref = e;
	}
	
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		if (arguments.length > 1)
		{
			e.selectedTabId = this._selectedTabId;
			e.closing = ndx;
			e = Scriptor.event.fire(this, 'ontabclosed', e);
			
			if (e.returnValue == false)
			{
				Scriptor.event.cancel(e, true);
				return false;
			}
		}
		
		this.removeTab(ndx);
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

Scriptor.TabContainer.prototype._updateExtraTabsContextMenu = function()
{
	var optsLength = this._tabs.length - this._tabList._extraTabs;
	
	if (this._tabsContextMenu.items.length != optsLength)
	{
		if (this._tabsContextMenu.items.length > optsLength)	// remove extra options
		{
			while (this._tabsContextMenu.items.length > optsLength)
				this._tabsContextMenu.removeItem(0);
		}
		else	// add new options
		{
			for (var n = 0; n < optsLength - this._tabsContextMenu.items.length; n++)
			{
				var tabNdx = this._tabList._extraTabs+n;
				this._tabsContextMenu.addItem({
					label : this._tabs[tabNdx].title,
					onclick : Scriptor.bindAsEventListener(function(e, tabNdx, xtraTabs) {
						this.selectTab(tabNdx);
					}, this, tabNdx, this._tabList._extraTabs)
				}, 0);
			}
		}
		
		var ndx = null;
		for (var n = 0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == this._selectedTabId)
			{
				ndx = n;
				break;
			}
		}
		
		for (var n=0; n < this._tabsContextMenu.items.length; n++)
		{
			this._tabsContextMenu.checkItem(n, (n == ndx-this._tabList._extraTabs));
		}
		
	}
};

// private tab container inner components
/* This is the component that represents the list of tabs in the TabContainer */
var TabListObj = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : false
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.private.TabListObj";
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	this.create();
	
	// first ndx of extra tab not visible
	this._extraTabs = 0;
	this._showingMore = false;
	
	// add the "more" dropdown button
	var moreSpan = document.createElement('span');
	moreSpan.id = this.divId + '_more';
	moreSpan.className = 'jsTabListDropdown jsTabListDropdownHidden';
	this.target.appendChild(moreSpan);
	moreSpan.innerHTML = ' ';
	
	Scriptor.className.add(this.cmpTarget, 'jsTabListInner');
	
	// add "more" dropdown button onclick event
	Scriptor.event.attach(moreSpan, 'onclick', Scriptor.bindAsEventListener(this.onDropdownClick, this));
};

TabListObj.prototype.onDropdownClick = function(e) {
	if (!e) e = window.event;
	
	this.parent._tabsContextMenu.show(e);
	
	Scriptor.event.cancel(e, true);
	return false;
};

TabListObj.prototype.showMore = function() {
	if (!this._showingMore)
	{
		Scriptor.className.remove(document.getElementById(this.divId + '_more'), 'jsTabListDropdownHidden');
		this._showingMore = true;
	}
};

TabListObj.prototype.hideMore = function() {
	if (this._showingMore)
	{
		Scriptor.className.add(document.getElementById(this.divId + '_more'), 'jsTabListDropdownHidden');
		this._showingMore = false;
	}
};

/* This is the component that holds the Panels iteself (or other components) */
var TabPageContainer = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : false
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.private.TabPageContainer";
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	this.create();
	
};

TabPageContainer.prototype.addPage = function(pane) {
	Scriptor.className.add(pane.target, "jsTabPage");
	this.addChild(pane);
};

TabPageContainer.prototype.removePage = function(pane, destroy) {
	this.removeChild(pane)
	
	if (destroy)
		pane.destroy();
};

TabPageContainer.prototype.activate = function(paneId) {
	for (var n=0; n < this.components.length; n++)
		this.components[n].hide();
		
	for (var n=0; n < this.components.length; n++)
	{
		if (this.components[n].divId == paneId)
		{
			this.components[n].show();
		}
	}
};

/* this object represents a single tab with its title and its component */
var TabInstance = function(opts) {
	var localOpts = {
		title : '',
		paneId : null,
		pane : null,
		closable : false
	};
	Scriptor.mixin(localOpts, opts);
	
	this.title = localOpts.title;
	this.paneId = localOpts.paneId;
	this.pane = localOpts.pane;
	this.closable = localOpts.closable;
};
/* JavaScript Document
*
* Dynamic ajax based sortable data table. It gets rows of data from an XML or JSON source that
* can be displayed and sorted dynamically on any column
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor framework
*/

// minimum allowed column width
var MIN_COLUMN_WIDTH = 20;

/*
* dataColumn:
* Object for each of the dataView columns. Add to dataView via the addColumn method
* use deleteColum method to delete a column
* 
* Options are:
*   Name: The Javascript name of the column, for use inside Javascript. It is usefull to equal
*    Name to sqlName
*   Type: The dataType of the column. Provide a string that matches any of the memebrs of the
*    dataTypes object
*   Show: set to true if the column is to be shown in the table
*   Width: provide column width in pixels
*   Format: function to process the value output. Must accept and object of the column type and return a string
*   displayName: Name to be used when displaying the column
*   sqlName: provide if different from Name. dataView uses sqlName when interacting with
*    its designated XML Service.
*   shoToolTip: Will display a tooltip (tittle attribute) for the cell to show large contents
*   Compare : functino pointer for sorting by the column
*/
var dataColumn = function(opts) {
	var localOpts = {Name : null,
		Type : 'alpha',
		show : true,
		Width : 80,
		Format : null,
		displayName : null,
		sqlName : null,
		showToolTip : false,
		Comparator : null };
	
	Scriptor.mixin(localOpts, opts)
	if (!localOpts.Name)
	{
		Scriptor.error.report('DataColumn, invalid column data provided to constructor');
		return;
	}
	
	this.Name = localOpts.Name;
	this.Type = (typeof(dataTypes[localOpts.Type]) != 'undefined') ? localOpts.Type : 'alpha';
	this.show = localOpts.show;
	this.percentWidth = null;
	if (!isNaN(Number(localOpts.Width)))
	{
		this.Width = Number(localOpts.Width);
	}
	else
	{
		if (typeof(localOpts.Width) == "string")
		{
			if (localOpts.Width.length > 2 && localOpts.Width.substr(localOpts.Width.length-2) == "px" &&
				!isNaN(parseInt(localOpts.Width)))
			{
				this.Width = parseInt(localOpts.Width);
			}
			else if (localOpts.Width.length > 1 && localOpts.Width.substr(localOpts.Width.length-1) == "%" &&
				!isNaN(parseInt(localOpts.Width)))
			{
				this.Width = MIN_COLUMN_WIDTH;
				this.percentWidth = parseInt(localOpts.Width);
			}
		}
	}
	this.origWidth = this.Width;
		
	this.Format = localOpts.Format;
	this.displayName = localOpts.displayName ? localOpts.displayName : localOpts.Name;
	this.sqlName = localOpts.sqlName ? localOpts.sqlName : localOpts.Name;
	this.showToolTip = localOpts.showToolTip;
	this.Compare = localOpts.Compare;
	
};

/*
* dataRow
* Each of the rows in a dataView. Create via the dataView.createRow() method or
* instantiate with a columnCollection which should be an array of columns. You can
* provide dataView.columns as a parameter for instantiation which is equivalent to
* calling the createRow method.
* Optionally the initialData object can be passed to indicate the initial values
* of each column
*
* members are:
*  [colName]: Each column in the column collection creates a member in the row object
*   using the column's javascript name and initializes it with its dataType default value.
*   can be accessed directly: dataRow.<colName> or dataRow.['<colName>']
*/
var dataRow = function(columnCollection, initialData) {
	initialData = initialData ? initialData : {};
	
	for (var n=0; n < columnCollection.length; n++) {
		var name = columnCollection[n].Name;
		var type = columnCollection[n].Type;
		this[name] = initialData[name] ? dataTypes[type](initialData[name]) : dataTypes[type]();
	}
	
	// now get some values like #id which could be outside of the columnCollection object
	for (var prop in initialData)
	{
		if (this[prop] === undefined)
			this[prop] = initialData[prop];
	}
};

/* dataTypes
*
* This object defines the dataView data types. Its members define 
* empty/default object for each of the dataTypes used in the dataView using the function pointer
* to the constructor for that object. Such constructor must accept a string 
* as its argument which is comming from the XML or JSON service to the object.
*
*/
var dataTypes = {
	'num' : Number,	// backwards compatibility
	'number' : Number,
	'alpha' : String,	// backwards compatibility
	'string' : String,
	'date' : function (str) {		// constructor for date objects from MySQL date strings
		if (!str)
			return '';
		
		if (str instanceof Date)
			return str;
		
		var ret = new Date();
		
		if (typeof(str) == 'string') {
			var dateParts = str.split(' ');
			
			if (dateParts[0] == '0000-00-00') {	//empty sql date field
				return '';
			}
			else {
				var dateCmp = dateParts[0].split('-');
				ret = new Date(dateCmp[0], dateCmp[1]-1, dateCmp[2]);
				
				if (dateParts[1]) {
					var timeCmp = dateParts[1].split(':');
					ret = new Date(dateCmp[0], dateCmp[1]-1, dateCmp[2], timeCmp[0], timeCmp[1], timeCmp[2]);
				}
			}
		}
		
		return ret;
	}
};

/*
* dataView
* This is the main object. It holds a (fake)table which is assigned to an HTMLElement under
*  which to be instantiated.
*
* members are:
*  rows: This is an array with the list of row objects in the table
*  columns: This is a columnCollection or an array of column objects with column information
*  selectedRow: The current selected row. -1 for no row selected
*  selectedRows: Array of the selected rows
*  multiselect: set to true if to allow multiselect
*  curRow(): a pointer to the current selected row or null if no row is selected
*  
*  orderBy: should be read only. It holds information of the Javascript column Name of the
*   active ordered column. It passes it to the SQL service for multipage dataViews or for
*   refreshing purposes
*  orderWay: should be read only. It holds information of the order way to be passed to the
*   sql service on multipage dataviews or when refreshing.
*
*	paginating: set to true if implementing pagination on table.
*	rowsPerPage: set number of rows to show per page.
*	curPage: The current page if paginating
*
*/
Scriptor.DataView = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		multiselect : true,
		paginating: false,
		rowsPerPage : 20,
		columns : []
	};
		
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.DataView";
	
	this.rows = [];
	this.columns = [];
	
	this.selectedRow = -1;
	this.selectedRows = [];
	this.multiselect = localOpts.multiselect;	// true since 1.1
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'oncontentupdated');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	Scriptor.event.registerCustomEvent(this, 'oncolumnresize');
	
	this.orderBy = false;
	this.orderWay = 'ASC';
	
	this.paginating = localOpts.paginating;
	this.rowsPerPage = localOpts.rowsPerPage;
	this.curPage = 0;
	this.totalRows = 0;
	
	this.resizingXCache = 0;
	this.resizingFrom = 0;
	this.resColumnId = null;
	
	this.nextRowId = 1;
	
	this._cached = null;
	this._templateRendered = false;
	this._registeredEvents = [];
	
	this.resizeImplementation = function() {
		this._checkCache();
		
		if (this._cached)
		{
			// calculate toolbars height
			var innerBox = this.__getInnerBox();
			var outerBox = this.__getOuterBox();
			var offsetHeight = innerBox.top + innerBox.bottom + outerBox.top + outerBox.bottom;
			
			if (this._cached.pagination_header)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.pagination_header);
				offsetHeight += this._cached.pagination_header.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			if (this._cached.header)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.header);
				offsetHeight += this._cached.header.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			if (this._cached.footer)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.footer);
				offsetHeight += this._cached.footer.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			var bodyHeight = this.height !== null ? this.height - offsetHeight : 0;
			if (bodyHeight < 0)
				bodyHeight = 0;
			
			this._cached.outer_body.style.height = bodyHeight + 'px';
			
			this._adjustColumnsWidth(true);
		}
	};
	
	this.DOMAddedImplementation = function() {
		this._checkCache();
		
		if (this._cached)
		{
			this.__refreshFooter();
			
			//assign some events
			if (this.multiselect) 
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_selectAll'), 'click', Scriptor.bindAsEventListener(this.__selectAll, this)));
			
			if (this.paginating) {
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_goToPagePrev'), 'click', Scriptor.bindAsEventListener(this.__goToPagePrev, this)));
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_goToPageNext'), 'click', Scriptor.bindAsEventListener(this.__goToPageNext, this)));
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_pageInput'), 'keypress', Scriptor.bindAsEventListener(this.__checkGoToPage, this)));
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_pageInputBtn'), 'click', Scriptor.bindAsEventListener(this.__goToPage, this)));
			}
			
			for (var n=0; n < this.columns.length; n++)
				this._addColumnToUI(this.columns[n], n);
			
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_optionsMenuBtn'), 'click', Scriptor.bindAsEventListener(this.showOptionsMenu, this)));
			this._registeredEvents.push(Scriptor.event.attach(this._cached.headerUl, 'click', Scriptor.bindAsEventListener(this._onHeaderColumnClicked, this)));
			this._registeredEvents.push(Scriptor.event.attach(this._cached.headerUl, 'mousedown', Scriptor.bindAsEventListener(this._onHeaderColumnMousedown, this)));
			this._registeredEvents.push(Scriptor.event.attach(this._cached.rows_body, 'click', Scriptor.bindAsEventListener(this._onRowBodyClicked, this)));
			
			this.updateRows(true);
		}
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
			
		for (var n=0; n < this.columns.length; n++)
			this._removeColumnFromUI(0);
			
		this._cached = null;
	};
	
	this.destroyImplementation = function() {
		this.optionsMenu.destroy();
	};
	
	this.create();
	Scriptor.className.add(this.target, "dataViewMain");
	
	// component template 
	this.renderTemplate();
	this.canHaveChildren = false;
	
	this.optionsMenu = new Scriptor.ContextMenu();
	this.optionsMenu.addItem({label : this.lang.refresh, onclick : Scriptor.bindAsEventListener(function(e) {
		this.refresh();
	}, this)});
	this.optionsMenu.addItem({label : 'sep'});
	
	// add predefined columns
	for (var n=0; n < localOpts.columns.length; n++)
	{
		this.addColumn(this.createColumn(localOpts.columns[n]));
	}
	// end add
};

/*
*
* Call only once on creation!
* 
*/
Scriptor.DataView.prototype.renderTemplate = function() {
	if (!this._templateRendered)
	{
		var dvTemplate = '';
		var curLocation = Scriptor.getInactiveLocation();
		
		// Create table paginating header
		if (this.paginating) {
			dvTemplate += '<div class="dataViewPaginationHeader dataViewToolbar" id="'+this.divId+'_paginationHeader"><ul><li class="first">';
			dvTemplate += '<label class="dataViewPaginationPages" id="'+this.divId+'_paginationLabel">' + this.lang.pageStart + (this.curPage + 1) +
								this.lang.pageMiddle + '<span id="' + this.divId + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
			dvTemplate += '</label></li><li>';
			dvTemplate += '<a href="'+curLocation+'" class="dataViewPrevBtn" id="' + this.divId + '_goToPagePrev"> </a>';
			dvTemplate += '<a href="'+curLocation+'" class="dataViewNextBtn" id="' + this.divId + '_goToPageNext"> </a>';		
			dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.divId + '_pageInput">' + this.lang.pageEnd + '</label>';
			dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.divId + '_pageInput" />';
			dvTemplate += '<input type="button" value="' + this.lang.pageGo + '" class="dataViewPageButton" id="' + this.divId + '_pageInputBtn" />';
			dvTemplate += '</li></ul></div>';
		}
		
		// Create table header
		dvTemplate += '<div class="dataViewHeader' + (this.multiselect ? ' dataViewMultiselect' : '') + ' dataViewToolbar" id="'+this.divId+'_columnsHeader">';
		dvTemplate += '<ul id="'+this.divId+'_columnsUl">';
		
		if (this.multiselect) {
			dvTemplate += '<li class="dataViewCheckBoxHeader">';
			dvTemplate += '<input type="checkbox" id="' + this.divId + '_selectAll" class="dataViewCheckBox" /></li>';
			dvTemplate += '<li class="dataViewSep"></li>';
		}
		dvTemplate += '</ul>';
		
		// add field list menu
		dvTemplate += '<span id="' + this.divId + '_optionsMenuBtn" class="dataViewHeaderMenu">';
		dvTemplate += '<a href="'+curLocation+'"> </a></span></div>';
		
		// Create body
		dvTemplate += '<div id="'+this.divId+'_outerBody" class="dataViewOuterBody">';
		dvTemplate += '<div class="dataViewBody' + (this.multiselect ? ' dataViewMultiselect' : '') + '" id="'+this.divId+'_body"></div>';
		dvTemplate += '</div>';
		
		// Create footer
		dvTemplate += '<div id="' + this.divId + '_footer" class="dataViewFooter dataViewToolbar"></div>';
		
		this.cmpTarget.innerHTML = dvTemplate;
		
		this._templateRendered = true;
		// if the component had a present DOM element at the time of instantiation, we have called
		// DOMAddedImplementation before having the proper template created.
		if (this.inDOM && this._registeredEvents.length == 0)
		{
			this.DOMAddedImplementation();
		}
	}
};

/*
*
* Internal function to cache some dom elements used in resizing
* 
*/
Scriptor.DataView.prototype._checkCache = function() {
	if (!this._cached && document.getElementById(this.divId+'_columnsHeader'))
	{
		// cache elements
		this._cached = {
			pagination_header : document.getElementById(this.divId+'_paginationHeader'),
			header : document.getElementById(this.divId+'_columnsHeader'),
			headerUl : document.getElementById(this.divId+'_columnsUl'),
			outer_body : document.getElementById(this.divId+'_outerBody'),
			rows_body : document.getElementById(this.divId+'_body'),
			footer : document.getElementById(this.divId+'_footer')
		};
	}
};

/*
* dataView.getTotalPages()
*  When paginating, this tells the total number of pages in the object
*/
Scriptor.DataView.prototype.getTotalPages = function() {
	var totalPages = 0;
	var rowLength = this.totalRows ? this.totalRows : this.rows.length;
		
	var n=0;
	while (n < rowLength) {
		n += this.rowsPerPage;
		totalPages++;
	}
	
	return totalPages;
};

/*
* dataView.getNextRowId()
*   Since every row needs a unique id field, we will assign one automatically if
*   not provided
*/
Scriptor.DataView.prototype.getNextRowId = function() {
	var found = true;
	while (found)
	{
		found = false;
		var rowId = this.nextRowId++;
		for (var n=0; n < this.rows.length; n++)
		{
			if (this.rows[n].id == rowId)
			{
				found = true;
				break;
			}
		}
	}
	
	return rowId;
};

/*
* dataView.createColumn()
*  Use this function to get a column object instanciated. This function exposes
*  dataColumn publicly
*/
Scriptor.DataView.prototype.createColumn = function(opts) {
	return new dataColumn(opts);
};

/*
* dataView.addColumn()
*  Adds the passed column instance to the dataView columnCollection. Updates rows information 
*  if needed with empty objects and if dataView is visible performs a Show() to refresh.
*/
Scriptor.DataView.prototype.addColumn = function(column, ndx) {
	if (this.__findColumn(column.Name) == -1) {
		if (ndx === undefined)
			ndx = this.columns.length;
			
		this.columns.splice(ndx, 0, column);
	
		if (this.rows.length > 0) {
			for (var n=0; n < this.rows.length; n++) {
				this.rows[n][column.Name] = dataTypes[column.Type]();
			}
		}
		
		if (!this.orderBy && column.show)
			this.orderBy = column.Name;
		
		if (this.inDOM)
		{
			this._addColumnToUI(this.columns[ndx], ndx);
		}
	}
};

/*
* dataView.__findColumn()
*  Internal function that returns the index of a column in its collection or -1 if not found.
*  Pass the column Name property in colName
*/
Scriptor.DataView.prototype.__findColumn = function(colName) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == colName) 
			return n;
	}
	return -1;
};

/*
* dataView.deleteColumn()
*  Deletes the column passed by the identifier parameter. Can be a column (Javascript) Name,
*  a column index in the collection or an instance of a Column object inside the collection.
*  will update row information if needed discarting the deleted column.
*/
Scriptor.DataView.prototype.deleteColumn = function(identifier) {
	var colName = '';
	var ndx = null;
	
	if (typeof(identifier) == 'string') {
		var colNdx = this.__findColumn(identifier);
		if (colNdx != -1) {
			colName = this.columns[colNdx].Name;
			ndx = colNdx;
			this.columns.splice(colNdx,1);
		}
	}
	
	if (typeof(identifier) == 'number') {
		if (identifier > 0 && identifier < this.columns.length)
		{
			colName = this.columns[identifier].Name;
			ndx = identifier;
			this.columns.splice(identifier,1);
		}
	}
	
	if (typeof(identifier) == 'object') {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n] == identifier) {
				colName = this.columns[n].Name;
				ndx = n;
				this.columns.splice(n, 1);
			}
		}
	}
	
	if (colName) {
		if (this.rows.length > 0) {
			for (var n=0; n < this.rows.length; n++) {
				this.rows[n][colName] = null;
				delete this.rows[n][colName];
			}
		}
		
		if (this.orderBy == colName)
			this.orderBy = this.columns[this.columns.length-1].Name;
			
		if (this.inDOM)
		{
			this._removeColumnFromUI(ndx);
		}
	}
};

/*
* dataView._addColumnToUI()
*  Internal use only, to dynamically refresh columns on UI
*/
Scriptor.DataView.prototype._addColumnToUI = function(column, ndx) {
			
	var li = document.createElement('li');
	li.style.width = column.Width + 'px';
	var liClassName = "dataViewColumn";
	if (!column.show)
		liClassName += " dataViewColumnHidden";
	li.className = liClassName;
	
	var a = document.createElement('a');
	if (this.orderBy == column.Name) {
		if (this.orderWay == 'ASC')
			a.className = 'dataViewSortAsc';
		else
			a.className = 'dataViewSortDesc';
	}
	a.id = this.divId + '_columnHeader_'+ndx;
	a.setAttribute('href', Scriptor.getInactiveLocation());
	a.innerHTML = column.displayName;
	li.appendChild(a);
	
	li2 = document.createElement('li');
	li2.id = this.divId + '_sep_' + ndx;
	liClassName = "dataViewFieldSep";
	if (column.percentWidth !== null)
		liClassName += " dataViewFieldSepNoResize";
		
	if (!column.show)
		liClassName += " dataViewColumnHidden";
	li2.className = liClassName;
	
	var columns = this._cached.headerUl.getElementsByTagName('li');
	
	if (!columns.length)
	{
		this._cached.headerUl.appendChild(li);
		this._cached.headerUl.appendChild(li2);
	}
	else
	{
		var baseNdx = this.multiselect ? 2 : 0;
			
		if (ndx >= 0 && (baseNdx + (ndx*2)) < columns.length)
		{
			this._cached.headerUl.insertBefore(li, columns[baseNdx + (ndx*2)]);
			this._cached.headerUl.insertBefore(li2, columns[baseNdx + (ndx*2)+1]);
		}
		else
		{
			this._cached.headerUl.appendChild(li);
			this._cached.headerUl.appendChild(li2);
		}
	}
	
	this.optionsMenu.addItem({
		label : column.displayName,
		onclick : Scriptor.bindAsEventListener(function(e, ndx) {this.toggleColumn(ndx);}, this, ndx),
		checked : column.show
	}, ndx+2);
	
	if (this.rows.length) {
		for (var n=0; n < this.rows.length; n++)
		{
			this._addCellToUI(this.rows[n].id, column.Name, ndx);
		}
	}
	
	// restrict columns width if they're too wide for dataView to handle
	this._adjustColumnsWidth();
};

/*
* dataView._removeColumnFromUI()
*  Internal use only, to dynamically refresh columns on UI
*/
Scriptor.DataView.prototype._removeColumnFromUI = function(ndx) {
	var baseNdx = this.multiselect ? 2 : 0;
	var columns = this._cached.headerUl.getElementsByTagName('li');
	
	if (ndx >= 0 && (baseNdx + (ndx*2)) < columns.length)
	{
		this._cached.headerUl.removeChild(columns[baseNdx+(ndx*2)]);
		this._cached.headerUl.removeChild(columns[baseNdx+(ndx*2)]);
	}
	
	this.optionsMenu.removeItem(ndx+2);
	
	if (this.rows.length) {
		for (var n=0; n < this.rows.length; n++)
		{
			this._removeCellFromUI(this.rows[n].id, ndx);
		}
	}
	
	this._adjustColumnsWidth();
};

/*
* dataView._addRowToUI()
*  Internal use only, to dynamically add/remove rows on UI
*/
Scriptor.DataView.prototype._addRowToUI = function(rowNdx) {
	if (rowNdx < 0 || rowNdx > this.rows.length-1)
		return;
	
	var rowId = this.rows[rowNdx].id;
	
	var newUl = document.createElement('ul');
	newUl.id = this.divId + '_row_' + rowId;
	
	var check = false;
	if (!this.multiselect) {
		if (this.selectedRow == n) {
			check = true;
		}
	}
	else {
		for (var a=0; a < this.selectedRows.length; a++) {
			if (this.selectedRows[a] == n) {
				check = true;
				break;
			}
		}
	}
	
	if (check)
		newUl.className = "dataViewRowSelected";
			
	if (rowNdx % 2)
		Scriptor.className.add(newUl, "dataViewRowOdd");
		
	if (this.multiselect) {
		var newLi = document.createElement('li');
		var newLiClassName = "dataViewMultiselectCell";
		newLi.className = newLiClassName;
		
		var newCheckboxTpl = '<input type="checkbox" id="' + this.divId + '_selectRow_' + rowId + '" class="dataViewCheckBox" ';
		if (check)
			newCheckboxTpl += 'checked="checked" ';
		newCheckboxTpl += '/></li>';
		newLi.innerHTML = newCheckboxTpl;
			
		newUl.appendChild(newLi);
	}
	
	// if now rows, we simply appendChild
	var actualRows = this._cached.rows_body.getElementsByTagName('ul');
	if (actualRows.length == 0)
	{
		this._cached.rows_body.appendChild(newUl);
	}
	else
	{
		// if the row is the last row, we simply appendChild
		if (rowNdx == this.rows.length-1)
		{
			this._cached.rows_body.appendChild(newUl);
		}
		else
		{
			var insertBefore = null;
			// we search for the next row id added to DOM
			for (var n = rowNdx+1; n < this.rows.length; n++)
			{
				insertBefore = document.getElementById(this.divId + '_row_' + this.rows[n].id);
				if (insertBefore)
					break;
			}
			
			if (insertBefore)
				this._cached.rows_body.insertBefore(newUl, insertBefore);
			else
				this._cached.rows_body.appendChild(newUl);
		}
	}
	
	for (var a=0; a < this.columns.length; a++) 
		this._addCellToUI(rowId, this.columns[a].Name, a);
		
	this.__refreshFooter();
};

/*
* dataView._removeRowFromUI()
*  Internal use only, to dynamically add/remove rows on UI
*/
Scriptor.DataView.prototype._removeRowFromUI = function(rowNdx) {
	if (rowNdx < 0 || rowNdx > this.rows.length-1)
		return;
	
	var rowId = this.rows[rowNdx].id;
	var theRow = document.getElementById(this.divId + "_row_" + rowId);
	
	if (theRow)
		this._cached.rows_body.removeChild(theRow);
		
	this.__refreshFooter();
};

Scriptor.DataView.prototype._refreshRowInUI = function(rowId) {
	var row = this.getById(rowId)
	
	if (row)
	{
		var theRow = document.getElementById(this.divId + "_row_" + rowId);
	
		if (theRow)
		{
			for (var a=0; a < this.columns.length; a++)
				this.setCellValue(rowId, this.columns[a].Name, row[this.columns[a].Name]);
				
		}
	}
};

/*
* dataView._addCellToUI()
*  Internal use only, to dynamically add/remove cells on UI
*/
Scriptor.DataView.prototype._addCellToUI = function(rowId, colName, ndx) {
	var rowsUl = document.getElementById(this.divId + "_row_" + rowId);
	if (rowsUl)	// just make sure the row is there
	{
		var cells = rowsUl.getElementsByTagName('li');
		var li = document.createElement('li');
		li.id = this.divId + '_cell_' + rowId + '_' + ndx
		
		var liClassName = "dataView" + this.columns[ndx].Type;
		if (!this.columns[ndx].show)
			liClassName += " dataViewCellHidden";
		if (ndx == 0)
			liClassName += " dataViewFirstCell";
		
		li.className = liClassName;
		li.style.width = this.columns[ndx].Width + 'px';
		if (this.columns[ndx].showToolTip) 
			li.setAttribute("title", this.getById(rowId)[colName]);
		
		if (ndx >= 0 && ndx < cells.length-1)
		{
			rowsUl.insertBefore(li, cells[ndx]);
		}
		else
		{
			rowsUl.appendChild(li);
		}
		
		this.setCellValue(rowId, colName, this.getById(rowId)[colName]);
	}
};

/*
* dataView._removeCellFromUI()
*  Internal use only, to dynamically add/remove cells on UI
*/
Scriptor.DataView.prototype._removeCellFromUI = function(rowId, ndx) {
	var baseNdx = this.multiselect ? 1 : 0;
	var rowsUl = document.getElementById(this.divId + "_row_" + rowId);
	if (rowsUl)	// just make sure the row is there
	{
		var cells = rowsUl.getElementsByTagName('li');
		
		if (ndx >= 0 && (baseNdx+ndx) < cells.length)
		{
			rowsUl.removeChild(cells[baseNdx+ndx]);
		}
	}
};

/*
* dataView.createRow()
*  Use this function to get a row object instanciated with the column informaion of the
*  dataView object. You can initialize its values before using dataView.addRow() to
*  add it to the row list.
*/
Scriptor.DataView.prototype.createRow = function(data) {
	data = data ? data : {};

	if (!data.id)
		data.id = this.getNextRowId();
	
	return new dataRow(this.columns, data);
};

/*
* dataView.addRow()
*  calling addRow() will add rowObj to the rows in the dataView object. If nothing is passed
*  as an argument, an empty row will be added. If dataView is visible it will call
*  updateRows to reflect the changes.
*/
Scriptor.DataView.prototype.addRow = function(rowObj, ndx, ui) {
	if (ui === undefined)
		ui = true;
		
	if (!this.inDOM)
	{
		Scriptor.error.report("Add table to DOM before working with rows");
		return;	
	}
	
	if (!rowObj) 
		rowObj = this.createRow();
	else
		if (!rowObj.id)
			rowObj.id = this.getNextRowId();
	
	if (ndx === undefined)
		ndx = this.rows.length;
	else if (ndx < 0 || ndx > this.rows.length)
		ndx = this.rows.length;
		
	if (ndx > 0 && ndx < this.rows.length)
		this.rows.splice(ndx, 0, rowObj);
	else
		this.rows.push(rowObj);
	
	if (ui)
	{
		this._addRowToUI(ndx);
	
		if (this.selectedRow >= ndx)
		{
			this.selectedRow++;
		}
		
		if (this.multiselect)
			for (var n=0; n < this.selectedRows.length; n++)
			{
				if (this.selectedRows >= ndx)
					this.selectedRows[n]++;
			}
			
		this._UIUpdateSelection();
	}
};

/*
* dataView.deleteRow()
*  This method will delete the row identified by identifier. It can be a row index in the
*  array of rows (i.e.: dataView.selectedRow when != -1) or an instance of a row object 
*  in the array. If dataView is visible it will call updateRows to reflect the changes.
*/
Scriptor.DataView.prototype.deleteRow = function(identifier, ui) {
	if (ui === undefined)
		ui = true;
		
	if (!this.inDOM)
	{
		Scriptor.error.report("Add table to DOM before working with rows");
		return;	
	}
	
	var rowNdx = -1;
	
	if (typeof(identifier) == 'number') {
		rowNdx = identifier;
		this.rows.splice(identifier,1);
	}
	
	if (typeof(identifier) == 'object') {
		for (var n=0; n < this.rows.length; n++) {
			if (this.rows[n] == identifier) {
				rowNdx = n;
				this.rows.splice(n, 1);
			}
		}
	}
	
	if (rowNdx != -1 && ui)
	{
		this._removeRowFromUI(rowNdx);
	
		if (this.selectedRow > this.rows.length -1)
			this.selectedRow = -1;
		else if (this.selectedRow >= rowNdx)
			this.selectedRow--;
		
		if (this.multiselect)
			for (var n=0; n < this.selectedRows.length; n++)
			{
				if (this.selectedRows[n] > this.rows.length -1)
				{
					this.selectedRows.splice(n, 1);
					n--;
				}
				else if (this.selectedRows[n] >= rowNdx)
				{
					this.selectedRows[n]--;
				}
			}
		
		this._UIUpdateSelection();
	}
};

/*
* dataView.curRow()
*  returns the currently selected row at any time
*/
Scriptor.DataView.prototype.curRow = function() {
	return this.selectedRow != -1 ? this.rows[this.selectedRow] : null;
};

/* dataView.curRows()
*  multiselect: Returns an array of the currently selected rows at any time
*/
Scriptor.DataView.prototype.curRows = function() {
	var rows = [];
	if (this.multiselect)
	{
		for (var n=0; n < this.selectedRows.length; n++)
			rows.push(this.rows[this.selectedRows[n]]);
	}
	
	return this.multiselect ? rows : this.curRow();
};

/* dataView.getById()
* returns a row if found one matching the id, or null
*/
Scriptor.DataView.prototype.getById = function(id) {
	for (var n=0; n < this.rows.length; n++)
		if (this.rows[n].id == id)
			return this.rows[n];
	
	return null;
};

/* dataView.searchRow()
* returns an array of rows matching the value for the columnName given
*/
Scriptor.DataView.prototype.searchRows = function(columnName, value) {
	var ret = [];
	
	for (var n=0; n < this.rows.length; n++)
	{
		if (this.rows[n][columnName] == value)
			ret.push(this.rows[n]);
	}
	
	return ret;
};

/*
* dataView.setCellValue();
* Dynamically updates the value in a cell, performing visual updates if needed
* returns true on success, false on error
*/
Scriptor.DataView.prototype.setCellValue = function(rowId, columnName, value) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Add table to DOM before working with rows");
		return false;	
	}
	
	var colNdx = this.__findColumn(columnName);
	if (colNdx == -1)
		return false;
	
	var rowNdx = null;
	for (var n=0; n < this.rows.length; n++)
	{
		if (this.rows[n].id == rowId)
		{
			rowNdx = n;
			break;
		}
	}
	if (rowNdx === null)
		return false;
	
	this.rows[rowNdx][columnName] = value;
	
	var cell = document.getElementById(this.divId + '_cell_' + rowId + '_' + colNdx);
	
	if (typeof(this.columns[colNdx].Format) == 'function') {
		var funcRet = this.columns[colNdx].Format(value);
		cell.innerHTML = '';
		if (typeof(funcRet) == 'string')
			cell.innerHTML = funcRet;
		else
			cell.appendChild(funcRet);		
	}
	else {
		cell.innerHTML = value;
	}
	
	return true;
};

/*
* dataView.refresh();
*  This function will call updateRows to refresh dataView rows if visible
*  You can use a dataViewConnector object to connect an XML or JSON service to dataView
*  and this will automatically retrieve information assync every time
*  you call refresh() method.
*/
Scriptor.DataView.prototype.refresh = function() {
	var e = Scriptor.event.fire(this, 'onrefresh');
	if (!e.returnValue)
		return;
	
	if (this.inDOM)
		this.updateRows();
};

/*
* dataView.setLoading(val)
*   If val is true, show loading spinner, else show the actual rows,
*   usefull for assync updates
*/
Scriptor.DataView.prototype.setLoading = function(val) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Cant message on DataView not in DOM");
		return;
	}
	
	this._cached.rows_body.style.display = val ? 'none' : '';
	this._cached.outer_body.className = val ? 'dataViewOuterBody dataViewLoading' : 'dataViewOuterBody';
	
};

/*
* dataView.setMessage(msg)
*	Set a message (usefull for error messages) and hide all rows in a dataView
* 	If msg is set to false or not present, it will restore dataView to normal
*/
Scriptor.DataView.prototype.setMessage = function(msg) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Cant message on DataView not in DOM");
		return;
	}
	
	// false, null, or msg not present resets dataView to normal
	if (msg === false || msg === null || typeof(msg) != "string")
	{
		if (document.getElementById(this.divId + '_message'))
			this._cached.outer_body.removeChild(document.getElementById(this.divId + '_message'));
			
		this._cached.rows_body.style.display = '';
	}
	else	// if string passed, we show a message
	{
		this._cached.rows_body.style.display = 'none';
		var msgDiv;
		if (!document.getElementById(this.divId + '_message'))
		{
			msgDiv = document.createElement('div');
			msgDiv.id = this.divId + '_message';
			msgDiv.className = 'dataViewMessageDiv';
			this._cached.outer_body.appendChild(msgDiv);
		}
		else
		{
			msgDiv = document.getElementById(this.divId + '_message');
		}
		msgDiv.innerHTML = msg;
	}
};

/*
* dataView.clearSelection()
*
*   Use programatically to clear all selections in the dataView
*/
Scriptor.DataView.prototype.clearSelection = function()
{
	this.selectedRow = -1;
	this.selectedRows = [];
	
	document.getElementById(this.divId + '_selectAll').checked = false;
	
	if (this.inDOM)
		this._UISelectAll(false);
};

/*
* __selectAll()
*  This function executes when clicking on a dataView header checkmox in multiselect and selects all rows.
*/
Scriptor.DataView.prototype.__selectAll = function(e) {
	if (!e) e = window.event;
	
	var elem = document.getElementById(this.divId + '_selectAll');
	
	if (this.rows.length) {
		if (elem.checked) {
			this.selectedRow = this.rows.length -1;
			this.selectedRows = [];
			
			for (var n=0; n < this.rows.length; n++)
				this.selectedRows.push(n);
				
			this._UISelectAll(true);
		}
		else {
			this.selectedRow = -1;
			this.selectedRows = [];
			
			this._UISelectAll(false);
		}
	}
	else {
		elem.checked = false;
	}
};

/*
* DataView._UISelectAll()
*  Internal use only, performs a select all/none on UI
*/
Scriptor.DataView.prototype._UISelectAll = function(check) {
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	for (var n=0; n < rows.length; n++)
	{
		Scriptor.className[(check ? "add" : "remove")](rows[n], "dataViewRowSelected");
		rows[n].firstChild.firstChild.checked = check;
	}
};

/*
* DataView._UIUpdateSelection()
*  Internal use only, to reflect actual selection patern in DOM
*/
Scriptor.DataView.prototype._UIUpdateSelection = function() {
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	for (var n=0; n < rows.length; n++)
	{
		var selected = false;
		if (!this.multiselect)
		{
			if (this.selectedRow == n)
				selected = true;
		}
		else
		{
			for (var a=0; a < this.selectedRows.length; a++)
			{
				if (this.selectedRows[a] == n)
				{
					selected = true;
					break;
				}
			}
		}
		
		if (this.multiselect)
			rows[n].childNodes[0].firstChild.checked = selected;
		Scriptor.className[(selected ? "add" : "remove")](rows[n], "dataViewRowSelected");
	}
};

/*
* __goToPage()
*  This function executes when changing the page on a paginated dataView
*/
Scriptor.DataView.prototype.__goToPage = function (e) {
	if (!this.enabled)
		return;
		
	var page = document.getElementById(this.divId + '_pageInput').value;
	
	var totalPages = this.getTotalPages();
	
	if (isNaN(Number(page))) {
		alert('Invalid page number.');
		return;
	}
	else {
		if (page < 1 || Number(page) > totalPages) {
			alert('Invalid page number.');
			return;
		}
		else {
			this.curPage = Number(page) -1;
			this.selectedRow = -1;
			this.selectedRows = [];
			
			this.refresh();
		}
		
		document.getElementById(this.divId + '_pageInput').focus();
	}
};

/*
* __checkGoToPage()
*  This function executes to capture <enter> key press on the dataView page input
*/
Scriptor.DataView.prototype.__checkGoToPage = function (e) {
	if (!e) e = window.event;
	
	if (e.keyCode == 13) {
		this.__goToPage(e)
	}
};

/*
* __goToPagePrev
*  This function executes when clicked on the "previous" link
*/
Scriptor.DataView.prototype.__goToPagePrev = function (e) {
	if (!e) e = window.event;
	
	if (!this.enabled)
	{
		Scriptor.event.cancel(e);
		return false;
	}
	
	if (this.curPage > 0) {
		this.curPage--;
		this.selectedRow = -1;
		this.selectedRows = [];
			
		this.refresh();
	}
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* __goToPageNext
*  This function executes when clicked on the "next" link
*/
Scriptor.DataView.prototype.__goToPageNext = function (e) {
	if (!e) e = window.event;
	
	if (!this.enabled)
	{
		Scriptor.event.cancel(e);
		return false;
	}
	
	var totalPages = this.getTotalPages();
	
	if (this.curPage < totalPages -1) {
		this.curPage++;
		this.selectedRow = -1;
		this.selectedRows = [];
			
		this.refresh();
	}
	
	Scriptor.event.cancel(e);
	return false;
};

/*
*  dataView.updateRows()
*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
*   dataView.updateRows() directly to update row information only without spending additional
*   resources on the dataView frame rendering.
*/
Scriptor.DataView.prototype.updateRows = function(clear) {
	if (!this.inDOM) {
		Scriptor.error.report("Add table to DOM before working with rows");
		return;
	}
	
	if (clear === undefined)
		clear = false;
	
	// save selected rows as ids!
	var savedSelectedRow = null;
	if (this.selectedRow != -1 && this.rows[this.selectedRow])
		savedSelectedRow = this.rows[this.selectedRow].id;
		
	var savedSelectedRows = [];
	if (this.selectedRows.length)
		for (var n=0; n < this.selectedRows.length; n++)
			if (this.rows[this.selectedRows[n]])
				savedSelectedRows.push(this.rows[this.selectedRows[n]].id);
	
	if (!this._oldScrollTop)
		this._oldScrollTop = this._cached.outer_body.scrollTop;
		
	if (clear)	// remove all rows, we're starting over!
	{
		this._cached.rows_body.innerHTML = '';	
	}
	
	// remove all rows that were deleted in memory
	var actualRows = this._cached.rows_body.getElementsByTagName('ul');
	for (var n=0; n < actualRows.length; n++)
	{
		var rowId = actualRows[n].id.substr(actualRows[n].id.lastIndexOf('_')+1);
		if (!this.getById(rowId))	// row does not exist!
		{
			this._cached.rows_body.removeChild(actualRows[n]);
			n--;
		}
	}
	
	// add rows that don't exist and update existing ones!
	for (var n=0; n < this.rows.length; n++) {		
		if (!document.getElementById(this.divId+"_row_"+this.rows[n].id))
		{
			this._addRowToUI(n);
		}
		else
		{
			this._refreshRowInUI(this.rows[n].id);
		}
	}	
	
	// restorde previously selected rows where possible
	if (!clear)
	{
		this.selectedRow = -1;
		if (savedSelectedRow)
		{
			for (var n=0; n < this.rows.length; n++)
			{
				if (this.rows[n].id == savedSelectedRow)
				{
					this.selectedRow = n;
					break;
				}
			}	
		}
		
		this.selectedRows = [];
		if (savedSelectedRows.length)
		{
			for (var a=0; a < savedSelectedRows.length; a++)
			{
				for (var n=0; n < this.rows.length; n++)
				{
					if (this.rows[n].id == savedSelectedRows[a])
					{
						this.selectedRows.push(n);
						break;
					}
				}
			}
		}
	}
	
	this._UIUpdateSelection();
	
	// Update scrolling
	if (clear)
		this._cached.outer_body.scrollTop = this._oldScrollTop ? this._oldScrollTop : 0;
	
	this.__refreshFooter();
	
	Scriptor.event.fire(this, 'oncontentupdated');
};

/*
* dataView.__refreshFooter()
*   Internal function. Refreshes the footer text.
*/
Scriptor.DataView.prototype.__refreshFooter = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Attempt to refresh footer on DataView not added to DOM");
		return;
	}
	
	var fTemplate = '<ul><li class="first">';
	
	if (!this.paginating) {
		if (this.rows.length == 0) {
			fTemplate += this.lang.noRows;
		}
		else {
			if (this.rows.length == 1)
				fTemplate += '1 ' + ' ' + this.lang.row;
			else
				fTemplate += this.rows.length + ' ' + this.lang.rows;
		}
	}
	else {
		
		document.getElementById(this.divId+'_paginationLabel').innerHTML = this.lang.pageStart + (this.curPage + 1) +
			this.lang.pageMiddle + '<span id="' + this.divId + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
		
		if (this.rows.length == 0) {
			fTemplate += this.lang.noRows;
		}
		else {
			var firstRow = (this.rowsPerPage * this.curPage);
			var lastRow = (firstRow + this.rowsPerPage) > this.totalRows ? this.totalRows : (firstRow + this.rowsPerPage);
			fTemplate += (firstRow+1) + ' - ' + lastRow + ' ' + this.lang.of + ' ' + this.totalRows + ' ' + this.lang.rows;
		}
	}
	fTemplate += '</li></ul>';
	
	this._cached.footer.innerHTML = fTemplate;
};

/*
* __setOrder()
*  This functions executes when clicking on a dataView column name and sets row order.
*  Ordering way will be switched upon subsecuent calls to __setOrder()
*/
Scriptor.DataView.prototype.__setOrder = function (colNdx) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Cant sort a DataView not in DOM");
		return;
	}
	
	var colName = this.columns[colNdx].Name;
	
	if (colNdx >= 0 && colNdx < this.columns.length) {
		var baseNdx = this.multiselect ? 2 : 0;
		var columns = this._cached.headerUl.getElementsByTagName('li');
		
		var oldColNdx = this.__findColumn(this.orderBy);	
		Scriptor.className.remove(columns[baseNdx+(oldColNdx*2)].firstChild, (this.orderWay == 'ASC' ? "dataViewSortAsc" : "dataViewSortDesc"));
			
		if (this.orderBy != colName) {
			this.orderBy = colName;
			this.orderWay = 'ASC';
		}
		else {
			if (this.orderWay == 'ASC')
				this.orderWay = 'DESC';
			else
				this.orderWay = 'ASC';
		}
		
		Scriptor.className.add(columns[baseNdx+(colNdx*2)].firstChild, (this.orderWay == 'ASC' ? "dataViewSortAsc" : "dataViewSortDesc"));
		
		if (!this.paginating) {
			this.__sort(0);
			
			if (this.inDOM) {
				this.updateRows(true);
			}
		}
		else {
			if (this.inDOM) {
				this.refresh();
			}
		}
	}
	
	return;
};

/*
* _onRowBodyClicked()
*  This function executes when clicking on dataView row body and checks how to proceed
*  depending on the target (selectRow, or markRow)
*/
Scriptor.DataView.prototype._onRowBodyClicked = function(e) {
	if (!e) e = window.event;
	
	var target = e.target || e.srcElement;
	
	var multiselectId = this.divId + "_selectRow_";
	
	if (target.nodeName.toLowerCase() == 'input' && target.id.substr(0, multiselectId.length) == multiselectId)
	{
		var rowId = target.id.substr(target.id.lastIndexOf('_')+1);
		for (var n=0; n < this.rows.length; n++)
		{
			if (this.rows[n].id == rowId)
			{
				this.__markRow(e, n);
				break;
			}
		}
	}
	else
	{
		while (target.nodeName.toLowerCase() != 'ul')
		{
			if (target == this._cached.rows_body)	// click out of range
				return;
			
			target = target.parentNode;
		}
		
		var rowId = target.id.substr(target.id.lastIndexOf('_')+1);
		for (var n=0; n < this.rows.length; n++)
		{
			if (this.rows[n].id == rowId)
			{
				this.__selectRow(e, n);
				break;
			}
		}
	}
};

/*
* _onHeaderColumnClicked()
*  This function executes when clicking on dataView row body and checks how to proceed
*  depending on the target (selectRow, or markRow)
*/
Scriptor.DataView.prototype._onHeaderColumnClicked = function(e) {
	if (!e) e = window.event;
	
	var target = e.target || e.srcElement;
	
	if (target.nodeName.toLowerCase() == 'a')
	{
		colNdx = Number(target.id.substr(target.id.lastIndexOf('_')+1));
		if (!isNaN(colNdx))
		{
			this.__setOrder(colNdx);
		}
		
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	return true;
};


/*
* _onHeaderColumnMousedown()
*  This function executes when clicking on dataView row body and checks how to proceed
*  depending on the target (selectRow, or markRow)
*/
Scriptor.DataView.prototype._onHeaderColumnMousedown = function(e) {
	if (!e) e = window.event;
	
	var target = e.target || e.srcElement;
	
	if (target.nodeName.toLowerCase() == 'li' && target.className == 'dataViewFieldSep')
	{
		var sepNdx = Number(target.id.substr(target.id.lastIndexOf('_')+1));
		if (!isNaN(sepNdx))
		{
			this.activateResizing(e, sepNdx);
		}
	}
};

/*
* __selectRow()
*  This function executes when clicking on a dataView row and selects that row.
*/
Scriptor.DataView.prototype.__selectRow = function (e, rowNdx) {
	if (!e) e = window.event;
	
	e.selectedRow = this.selectedRow;
	if (this.multiselect)
		e.selectedRows = this.selectedRows;
		
	if (this.selectedRow == rowNdx)
	{
		e.unselecting = rowNdx;
	}
	else
	{
		if (this.multiselect)
		{
			var found = false;
			for (var n=0; n < this.selectedRows.length; n++)
			{
				if (this.selectedRows[n] == rowNdx)
				{
					found = true;
					break;
				}
			}
			if (found)
				e.unselecting = rowNdx;
			else
				e.selecting = rowNdx;
		}
		else
		{
			e.selecting = rowNdx;
		}
	}
	
	e = Scriptor.event.fire(this, 'onselect', e);
	
	if (e.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
		 
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	if (rowNdx != -1) {
		if (!this.multiselect) {
			if (this.selectedRow != -1) {
				Scriptor.className.remove(rows[this.selectedRow], "dataViewRowSelected");
			}
		}
		else {
			for (var a = 0; a < this.selectedRows.length; a++) {
				rows[this.selectedRows[a]].childNodes[0].firstChild.checked = false;
				Scriptor.className.remove(rows[this.selectedRows[a]], "dataViewRowSelected");
			}
		}
		
		if (this.selectedRow == rowNdx && !this.multiselect) {
			this.selectedRow = -1;
		}
		else {
			if (!this.multiselect) {
				this.selectedRow = rowNdx;
				Scriptor.className.add(rows[rowNdx], "dataViewRowSelected");
			}
			else {
				
				if (!e.ctrlKey && !e.shiftKey) {
					if (this.selectedRow == rowNdx) {
						this.selectedRow = -1;
						this.selectedRows = [];
					}
					else {
						this.selectedRow = rowNdx;					
						this.selectedRows = [rowNdx];
					}
				}
				
				else {
					if (e.ctrlKey) {
						var found = false;
						for (var n=0; n < this.selectedRows.length; n++) {
							if (this.selectedRows[n] == rowNdx) {
								this.selectedRows.splice(n, 1);
								if (this.selectedRows.length)
									this.selectedRow = this.selectedRows[this.selectedRows.length -1];
								else
									this.selectedRow = -1;
								found = true;
							}
						}
						
						if (!found) {
							this.selectedRow = rowNdx;
							this.selectedRows.push(rowNdx);
						}
					}
					
					else if (e.shiftKey) {
						if (this.selectedRows.length) {
							this.selectedRows.length = 1;
							if (this.selectedRows[0] == rowNdx) {
								this.selectedRows = [];
								this.selectedRow = -1;
							}
							else {
								this.selectedRow = rowNdx;
								for (var n=this.selectedRows[0]; (rowNdx > this.selectedRows[0] ? n <= rowNdx : n >= rowNdx ); (rowNdx > this.selectedRows[0] ? n++ : n-- )) {
									if (n != this.selectedRows[0])
										this.selectedRows.push(n);
								}
							}
						}
						else {
							this.selectedRows.push(rowNdx);
							this.selectedRow = rowNdx;
						}
					}
				}
				
				for (var a = 0; a < this.selectedRows.length; a++) {
					rows[this.selectedRows[a]].childNodes[0].firstChild.checked = true;
					Scriptor.className.add(rows[this.selectedRows[a]], "dataViewRowSelected");
				}
			}
		}
	}
	
	/*Scriptor.event.cancel(e);*/
	return false;
};

/*
* __markRow()
*  This function executes when clicking on a dataView row checkmox in multiselect and selects that row.
*/
Scriptor.DataView.prototype.__markRow = function(e, rowNdx) {
	if (!e) e = window.event;
	
	e.selectedRow = this.selectedRow;
	if (this.multiselect)
		e.selectedRows = this.selectedRows;
		
	e.selecting = rowNdx;
	e = Scriptor.event.fire(this, 'onselect', e);
	
	if (e.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var rowId = this.rows[rowNdx].id;
	
	elem = document.getElementById(this.divId + '_selectRow_' + rowId);
	if (elem.checked) {	// add row to selected rows list
		this.selectedRows.push(rowNdx)
		this.selectedRow = rowNdx;
				
		var row = document.getElementById(this.divId + '_row_' + rowId);
		Scriptor.className.add(row, "dataViewRowSelected");
		
	}
	else {		// remove row from selected rows list
		for (var n=0; n < this.selectedRows.length; n++) {
			if (this.selectedRows[n] == rowNdx) {
				this.selectedRows.splice(n, 1);
				if (this.selectedRows.length) 
					this.selectedRow = this.selectedRows[this.selectedRows.length-1];
				else 
					this.selectedRow = -1;
			
				var row = document.getElementById(this.divId + '_row_' + rowId);
				Scriptor.className.remove(row, "dataViewRowSelected");
				break;
			}
		}
	}
	
	return true;
};

/* showOptionsMenu
*  This function shows the option menu of a dataView object. For internal use only
*/
Scriptor.DataView.prototype.showOptionsMenu = function(e) {
	if (!e) e = window.event;
	
	this.optionsMenu.show(e);
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* toggleColumn
*   Toggles a column on or off. OptionsMenu feature. Use dataColumn.show property along with
*   dataView.Show(false) instead to change column configuration manually.
*/
Scriptor.DataView.prototype.toggleColumn = function(colNdx) {
	
	if (this.columns[colNdx].show) {
		this.columns[colNdx].show = false;
	}
	else {
		this.columns[colNdx].show = true;
	}
	
	var baseNdx = this.multiselect ? 2 : 0;
	var columns = this._cached.headerUl.getElementsByTagName('li');
	
	if (colNdx >= 0 && ((baseNdx + (colNdx*2) + 1) < columns.length))
	{
		Scriptor.className[this.columns[colNdx].show ? "remove" : "add"](columns[baseNdx+(colNdx*2)], "dataViewColumnHidden");
		Scriptor.className[this.columns[colNdx].show ? "remove" : "add"](columns[baseNdx+(colNdx*2)+1], "dataViewColumnHidden");
	}
	
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	for (var n=0; n < rows.length; n++)
	{
		baseNdx = this.multiselect ? 1 : 0;
		Scriptor.className[this.columns[colNdx].show ? "remove" : "add"](rows[n].childNodes[baseNdx + colNdx], "dataViewCellHidden");
	}
	
	this.optionsMenu.checkItem(colNdx+2, this.columns[colNdx].show);
	
	this._adjustColumnsWidth();
};

/*
* dataView._adjustColumnsWidth()
*  Internal use only
*/
Scriptor.DataView.prototype._adjustColumnsWidth = function(forceUIChange) {
	if (this.columns.length && this._cached)
	{
		if (forceUIChange === undefined)
			forceUIChange = false;
			
		var sizesChanged = false;
		var headersWidth = this._getHeadersWidth();
		
		// reset columns to original width desired by the user
		for (var n=0; n < this.columns.length; n++)
		{
			if (this.columns[n].Width != this.columns[n].origWidth)
			{
				sizesChanged = true;
				this.columns[n].Width = this.columns[n].origWidth;
			}
		}
		
		var totalWidth = 0; // this is the total width of columns minus percentage width columns
		var base = this.multiselect ? 2 : 0;
		var lis = this._cached.headerUl.getElementsByTagName('li');
		
		// perform calculations only if columns are in DOM and we have headersWidth
		if (lis.length == (this.columns.length*2) + base && headersWidth > 0)
		{
			// number of visible columns
			var visibleLength = 0;
			var widthDiffCalculated = false;
			var colBox = null;
			var widthDiff = 0;
			
			for (var n=0; n < this.columns.length; n++)
			{
				if (this.columns[n].show)
				{
					if (!widthDiffCalculated)
					{
						// lets get the difference between a column's width and its actual width in DOM
						colBox = Scriptor.element.getInnerBox(lis[base+(n*2)]);
						widthDiff = colBox.left+colBox.right+lis[base+(n*2)+1].offsetWidth;
						widthDiffCalculated = true;
						break;
					}
				}
			}
			
			for (var n=0; n < this.columns.length; n++)
			{
				if (this.columns[n].show)
				{
					visibleLength++;
					if (this.columns[n].percentWidth !== null)
					{
						totalWidth += MIN_COLUMN_WIDTH + widthDiff;
					}
					else
					{
						totalWidth += this.columns[n].Width + widthDiff;
					}
				}
			}
			
			// do this only if there is room for columns to shrink!
			if (visibleLength && headersWidth >= ((MIN_COLUMN_WIDTH + widthDiff) * visibleLength))
				while (totalWidth > headersWidth)
				{
					// columns are too wide
					for (var n=0; n < this.columns.length; n++)
					{
						if (this.columns[n].show &&
							this.columns[n].percentWidth === null &&
							this.columns[n].Width > MIN_COLUMN_WIDTH)
						{
							sizesChanged = true;
							this.columns[n].Width--;
							totalWidth--;
						}
						
						if (totalWidth == headersWidth)
							break;
					}
				}
			else
				for (var n=0; n < this.columns.length; n++)
				{
					if (this.columns[n].show)
					{
						sizesChanged = true;
						this.columns[n].Width = MIN_COLUMN_WIDTH;
					}
				}
			
			// Now use extra space to fill percentage columns
			var remainingWidth = headersWidth - totalWidth;
			if (remainingWidth)
				for (var n=0; n < this.columns.length; n++)
				{
					if (this.columns[n].percentWidth !== null)
					{
						this.columns[n].Width += remainingWidth * (this.columns[n].percentWidth / 100);
					}
				}
			
			// now adjust sizes in DOM
			if (sizesChanged || forceUIChange)
			{
				for (var n=0; n < this.columns.length; n++)
				{
					lis[base+(n*2)].style.width = this.columns[n].Width + 'px';
				}
				
				var rows = this._cached.rows_body.getElementsByTagName('ul');
				var rowsbase = this.multiselect ? 1 : 0;
				for (var a=0; a < rows.length; a++)
				{
					var rLis = rows[a].getElementsByTagName('li');
					
					for (var n=0; n < this.columns.length; n++)
					{
						rLis[rowsbase+n].style.width = this.columns[n].Width + 'px';
					}
				}
			}
		}
	}
};

/*
* Internal use only
*/
Scriptor.DataView.prototype._getHeadersWidth = function()
{
	var optionsMenuElem = document.getElementById(this.divId+'_optionsMenuBtn');
	var menuBox = Scriptor.element.getOuterBox(optionsMenuElem);
	var columnsBox = Scriptor.element.getInnerBox(this._cached.headerUl);
	
	var multiselectWidth = 0;
	
	if (this.multiselect)
	{
		var lis = this._cached.headerUl.getElementsByTagName('li');
		multiselectWidth = lis[0].offsetWidth + lis[1].offsetWidth;
	}
	
	return this._cached.headerUl.offsetWidth - columnsBox.left - multiselectWidth - (optionsMenuElem.offsetWidth + menuBox.left + menuBox.right);
};

/*
* Internal use only
*/
Scriptor.DataView.prototype.__calculateTotalWidth = function()
{
	var totalWidth = 0;
	
	var cols = this._cached.headerUl.getElementsByTagName('li');
	
	for (var n=0; n < cols.length; n++) {
		totalWidth += cols[n].offsetWidth;
	}
	
	return totalWidth ;
};

/*
* dataView.__sort()
*  This function performs sorting of rows depending on the sortBy and sortWay properties
*  For internal use only. Use global function __setOrder instead.
*/
Scriptor.DataView.prototype.__sort = function(start) {
	var n, tempRow, swap;	
	
	if (!this.orderBy)
		return;
		
	for (n = start+1; n < this.rows.length; n++) {
		var swap = false;
		var	func = this.columns[this.__findColumn(this.orderBy)].Comparator;
		
		if (this.orderWay == 'ASC') {
			
			swap = (typeof(func) == 'function') ?
				func(this.rows[start][this.orderBy], this.rows[n][this.orderBy]) > 0 : 
				(this.rows[start][this.orderBy] > this.rows[n][this.orderBy]);
		}
		else {
			swap = (typeof(func) == 'function') ?
				func(this.rows[start][this.orderBy], this.rows[n][this.orderBy] < 0) :
				(this.rows[start][this.orderBy] < this.rows[n][this.orderBy]);
		}
		
		if (swap) {
			tempRow = this.rows[start];
			this.rows[start] = this.rows[n];
			this.rows[n] = tempRow;
			
			if (this.selectedRow == start) {
				this.selectedRow = n;				
			}
			else {
				if (this.selectedRow == n) {
					this.selectedRow = start;					
				}
			}
			
			for (var a=0; a < this.selectedRows.length; a++) {
				if (this.selectedRows[a] == start)
					this.selectedRows[a] = n;
				else
					if (this.selectedRows[a] == n)
						this.selectedRows[a] = start;
			}
		}
	}
	
	if (start < this.rows.length -2)
		this.__sort( start +1 );
};

/*
*  dataView.colum_exists()
*   Internal function that returns true if a column with its Name property equals to str exists
*/
Scriptor.DataView.prototype.colum_exists = function(str) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == str)
			return true;
	}
	return false;
};

/*
* dataView.__getColumnSqlName(colName)
*  Internal function that returns the column sqlName upon its Name property (colName).
*/
Scriptor.DataView.prototype.__getColumnSqlName = function(colName) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == colName) 
			return this.columns[n].sqlName;
	}
	return false;
};

/* activateResizing
*  This function will search for a valid dataView id and mark it for column resizing
*/
Scriptor.DataView.prototype.activateResizing = function(e, colNdx) {
	if (!e) e = window.event;
	
	if (this.columns[colNdx].percentWidth === null)
	{
		// calculate the resized column
		this.resColumnId = colNdx;
		
		// set x cache value for resizing
		var x;
	
		if (typeof(e.pageX) == 'number')
		{
			x = e.pageX;
		}
		else
		{
			if (typeof(e.clientX) == 'number')
			{
				x = (e.clientX + document.documentElement.scrollLeft);
			}
			else
			{	
				x = 0;
			}
		}
		
		this.resizingFrom = this.columns[colNdx].Width;
		this.resizingXCache = x;
		
		Scriptor.event.attach(document, 'mousemove', this._mouseMoveBind = Scriptor.bindAsEventListener(this.doResizing, this));
		Scriptor.event.attach(document, 'mouseup', this._mouseUpBind = Scriptor.bindAsEventListener(this.deactivateResizing, this));
	}
	
	Scriptor.event.cancel(e);
	return false;
};

/* performResizing
* This function deactivates resizing status and performs complete redrawing
*/
Scriptor.DataView.prototype.deactivateResizing = function(e) {
	if (!e) e = window.event;
	
	Scriptor.event.detach(document, 'mousemove', this._mouseMoveBind);
	Scriptor.event.detach(document, 'mouseup', this._mouseUpBind);
	
	e.columnId = this.resColumnId;
	e.resizingFrom = this.resizingFrom;
	e.resizedTo = this.columns[this.resColumnId].Width;
	
	Scriptor.event.fire(this, 'oncolumnresize', e);
	
	this.resColumnId = null;
	this.resizingXCache = 0;
};

/* doResizing
*  This function calculates the resizing upon mouse movement
*/
Scriptor.DataView.prototype.doResizing = function(e) {
	if (!e) e = window.event;
	// get delta x
	var x;

	if (typeof(e.pageX) == 'number')
	{
		x = e.pageX;
	}
	else
	{
		if (typeof(e.clientX) == 'number')
		{
			x = (e.clientX + document.documentElement.scrollLeft);
		}
		else
		{
			x = 0;
		}
	}
	
	var deltaX = Math.abs(this.resizingXCache - x);
	var growing = (this.resizingXCache < x) ? true : false;
	this.resizingXCache = x;
	
	var colNdx = this.resColumnId;
	var changedSize = false;
	
	if (!growing)
	{
		// see if col can be shorter than allowed
		if ((this.columns[colNdx].Width - deltaX) > MIN_COLUMN_WIDTH)
		{
			this.columns[colNdx].Width -= deltaX;
			this.columns[colNdx].origWidth = this.columns[colNdx].Width;
			changedSize = true;
		}
	}
	else
	{
		// see if there is space for col to grow
		this.columns[colNdx].Width += deltaX;
		this.columns[colNdx].origWidth = this.columns[colNdx].Width;
		changedSize = true;
	}
	
	if (changedSize)
		this._adjustColumnsWidth(true);
};

/*
* DataView.addDataType
*
* This is a function that allows to add custom data types to be handled
* by all DataView objects.
*
* Parameters:
*   name: a string with the name of the data type to be set to the column Type parameter
*   constructor: a function that returns the object containing the data, must get
*     1 parameter, value, to be used to feed the data type with actual values, must be
*     comparable (you can use custom comparator functions) and have a valid toString
*     method
*
* Example:
*   myDataView.addDataType('custom', function(val) {
*		var obj = {};
*		
*		obj.val = val;
*		obj.toString = function() {return 'value is' + val};
*		
*		return obj;
*		
*	});
*	
*/
Scriptor.DataView.prototype.addDataType = function(name, constructor) {
	if (typeof(name) != 'string')
	{
		Scriptor.error.report("Invalid data type name.");
		return;
	}
	
	if (typeof(constructor) != 'object')
	{
		Scriptor.error.report("Invalid data type constructor.");
		return;
	}
	else if (typeof(constructor.toString) != 'function')
	{
		Scriptor.error.report("Data type constructor missing toString method.");
		return;
	}
	
	if (!dataTypes[name])
	{
		dataTypes[name] = constructor;
	}
	else
	{
		Scriptor.error.report("Tried to instantiate a data type but data type was already defined");
	}
};

/*
* dataViewConnector
* 	Connector object that will connect a dataView with an api call, so every time
* 	you call dataView.Refresh() it will call its api to truly refresh
* 	the object in real time
*
* 	constructor parameters:
* 	dataView: A reference to a dataView object
* 	api: A String containig the path to the api file
* 	type: either json or xml, the format of the api file
*	parameters: query string to be passed on each call to api
*
* 	Examples for Api files
* 	XML:
* 	<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>
* 	<root success="1" errormessage="" totalrows="2">
* 	   <row>
* 	   	<column name="id">1</column>
* 	   	<column name="uername">user1</column>
* 	   </row>
* 	   <row>
* 	   	<column name="id">2</column>
* 	   	<column name="username">user2</column>
* 	   </row>
* 	</root>
*
* 	JSON:
* 	{ "success" : 1, "errormessage" : "", "totalrows" : 2, "rows" : [
*		{ "id" : 1, "username" : "user1" },
*		{ "id" : 2, "username" : "user2" }
*    ]}
*
*/
if (Scriptor.DataConnectors === undefined)
	Scriptor.DataConnectors = {};
	
Scriptor.DataConnectors.DataViewConnector = function(opts) {
	var localOpts = {
		dataView : null,
		api : null,
		method : 'POST',
		type : 'json',
		parameters : ''
	};
	
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.dataView)
	{
		Scriptor.error.report('Must provide dataView reference to dataViewConnector object.');
		return;
	}
	
	if (typeof(localOpts.api) != 'string' || localOpts.api == '')
	{
		Scriptor.error.report('Invalid Api string.');
		return;
	}
	
	this.api = localOpts.api;
	this.dataView = localOpts.dataView;
	this.parameters = localOpts.parameters;
	
	this.type = 'json';
	if (localOpts.type)
		switch (localOpts.type.toLowerCase())
		{
			case ('xml'):
				this.type = 'xml';
				break;
			case ('json'):
			default:
				this.type = 'json';
				break;
		}
		
	this.method = 'POST';
	if (typeof(localOpts.method) == 'string')
		this.method = localOpts.method.toUpperCase() == 'POST' ? 'POST' : 'GET';
		
	// event attaching and httpRequest setup
	Scriptor.event.attach(this.dataView, 'onrefresh', Scriptor.bind(this._onRefresh, this));
	
	this.httpRequest = new Scriptor.httpRequest({
		ApiCall : this.api,
		method : this.method,
		Type : this.type,
		onError : Scriptor.bind(this._onError, this),
		onLoad : Scriptor.bind(this._onLoad, this)
	});
};

Scriptor.DataConnectors.DataViewConnector.prototype = {
	_onRefresh : function(e) {
		this.dataView.setLoading(true);
		this.dataView.__refreshFooter();
		
		var params = 'orderby=' + this.dataView.orderBy + '&orderway=' + this.dataView.orderWay;
		if (this.dataView.paginating)
			params += '&limit=' + (this.dataView.rowsPerPage * this.dataView.curPage) + ',' + ((this.dataView.rowsPerPage * this.dataView.curPage) + this.dataView.rowsPerPage);
		
		if (this.parameters)
			params += '&' + this.parameters;
			
		this.httpRequest.send(params);
		
		Scriptor.event.cancel(e);
	},
	
	_onLoad : function(data) {
		this.dataView.setLoading(false);
		
		if (this.type == 'xml')	// xml parsing
		{
			var root = data.getElementsByTagName('root').item(0);
	
			this.dataView.rows.length = 0;
			if (root.getAttribute('success') == '1')
			{
				var totRows = Number(root.getAttribute('totalrows'));
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					
				}
				var rows = root.getElementsByTagName('row');
		
				for (var n=0; n < rows.length; n++)
				{
					var tempR = {};
					var cols = rows[n].getElementsByTagName('column');
					
					for (var a=0; a < cols.length; a++)
					{
						var colName = cols[a].getAttribute('name');
						if (colName && cols[a].firstChild)
						{
							var cType = this.dataView.__findColumn(colName) != -1 ?
								this.dataView.columns[this.dataView.__findColumn(colName)].Type :
								'alpha';
							tempR[colName] = dataTypes[cType](cols[a].firstChild.data);
						}
					}
					
					this.dataView.addRow(this.dataView.createRow(tempR), undefined, false);
				}
			}
			else
			{
				this.dataView.setMessage(root.getAttribute('errormessage'));
			}
			
			this.dataView.updateRows();
			
		}
		else	// json
		{
			this.dataView.rows.length = 0;
			
			if (data.success)
			{
				var totRows = Number(data.totalrows);
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					
				}
				
				for (var n=0; n < data.rows.length; n++)
				{
					var tempR = {};
					
					for (var colName in data.rows[n])
					{
						var cType = this.dataView.__findColumn(colName) != -1 ?
							this.dataView.columns[this.dataView.__findColumn(colName)].Type :
							'alpha';
						tempR[colName] = dataTypes[cType](data.rows[n][colName]);	
					}
					
					this.dataView.addRow(this.dataView.createRow(tempR), undefined, false);
				}
			}
			else
			{
				this.dataView.setMessage(data.errormessage);
			}
			
			this.dataView.updateRows();
		}
	},
	
	_onError : function(status)
	{
		this.dataView.setLoading(false);
		this.dataView.setMessage('Error: Unable to load dataView object (HTTP status: ' + status + ')');
	}
};
// JavaScript Document
/*
* dataLangs
* This object contains the strings that have to be output by dataView in different languages.
* Create your own language prefixed object and assign the prefix to the Lang property of dataView.
*  (does not include error messages which are in English)
*/

Scriptor.DataView.prototype.lang = {
	'noRows' : 'No rows to show.',
	'rows' : 'rows.',
	'row' : 'row.',
	'pageStart' : 'Page ',
	'pageMiddle' : ' of ',
	'pageEnd' : ' Go to page: ',
	'pageGo' : 'Go',
	'pagePrev' : '<< Previous',
	'pageNext' : 'Next >>',
	'refresh' : 'Refresh',
	'of' : 'of' };
/*
*
*  Javascript component that displays a list of hierarchically organized data much like a
*   directory listing using an XML service to retrieve the data.
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+
*/

/* treeNode
*
* js class for every category (node) on the treeView
*/
var treeNode = function(opts) {
	var localOpts = {
		id : null,
		parentId : 0,
		parent : null,
		Name : ""
	};
	
	Scriptor.mixin(localOpts, opts);
	this.treeView = localOpts.treeView;
	
	this.id = localOpts.id !== null ? localOpts.id : this.treeView.getNextNodeId();
	this.parentId = localOpts.parentId
	this.Name = String(localOpts.Name);
	this.expanded = false;
	this.childNodes = [];
	this.parentNode = localOpts.parent;
};

treeNode.prototype = {
	searchNode : function(id)
	{
		var n;
		var srch = null;
		var srchNdx = 0;		
		for (n=0; n < this.childNodes.length; n++) {
			if (this.childNodes[n].id == id) {
				srch = this.childNodes[n];
				break;
			}			
		}
		while (!srch && srchNdx < this.childNodes.length) {
			srch = this.childNodes[srchNdx].searchNode(id);
			srchNdx++;
		}
		
		return srch;
	},
	
	/* assumes an empty ul element and fills it with al its children and subchildren
	*/
	updateChildrenNodes : function()
	{
		var parentNode = document.getElementById(this.treeView.divId + '_' + this.id + '_branch');
		var curLocation = Scriptor.getInactiveLocation();
		
		for (var i=0; i < this.childNodes.length; i++) { 
			var node = document.createElement('li');
			node.id = this.treeView.divId + '_' + this.childNodes[i].id;
			parentNode.appendChild(node);
			
			var nodeTemplate = '';
			var hasChildren = this.childNodes[i].childNodes.length;
			
			if (hasChildren) {
				// Create link to expand node
				nodeTemplate += '<a id="'+this.treeView.divId + '_' + this.childNodes[i].id + '_expandable" href="'+curLocation+'" class="';
				nodeTemplate += (this.childNodes[i].expanded ? 'treeViewCollapsableNode' : 'treeViewExpandableNode') + '"></a>';
			}
			
			// Create link to select node
			nodeTemplate += '<a id="'+this.treeView.divId+'_'+this.childNodes[i].id+'_selectNode" ';
			if (!hasChildren)
				nodeTemplate += 'class="treeViewSingleNode" ';
			nodeTemplate += 'href="'+curLocation+'">'+this.childNodes[i].Name+'</a>';
			
			if (hasChildren)
			{
				// Create subcategory list
				nodeTemplate += '<ul id="' + this.treeView.divId + '_' + this.childNodes[i].id + '_branch"></ul>';
			}
			
			node.innerHTML = nodeTemplate;
			
			// TODO: assign event listeners to component target only
			if (hasChildren)	
				Scriptor.event.attach(document.getElementById(this.treeView.divId + '_' + this.childNodes[i].id + '_expandable'),
									  'click',
									  Scriptor.bind(this.treeView._expandNode, this.treeView, this.childNodes[i].id));
				
			Scriptor.event.attach(document.getElementById(this.treeView.divId + '_' + this.childNodes[i].id + '_selectNode'),
									  'click',
									  Scriptor.bind(this.treeView._selectNode, this.treeView, this.childNodes[i].id));
			
			if (hasChildren)
				this.childNodes[i].updateChildrenNodes();
			
		}
	},
	
	toString : function() {
		return "[Name: " + this.Name + ", ParentId: " + this.parentId + 
				 ", Children: " + this.childNodes.length + "]";
	}
};

/*
* the treeView class
*/
Scriptor.TreeView = function (opts) {
	var localOpts = {
		canHaveChildren : false,
		hasInvalidator : true
	};
	
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.TreeView";
	
	this.DOMAddedImplementation = function() {
		// TODO: assign global event listener!
		
		if (this._templateRendered)
			this.updateNodes();
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
			
	};
	
	this.selectedNode = null;
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'oncontentupdated');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this });
	this.nextNodeId = 1;
	this._registeredEvents = [];
	this._templateRendered = false;
	
	this.create();
	
	Scriptor.className.add(this.target, "treeView");
	
	this.renderTemplate();
};

/*
*
* Call only once on creation!
* 
*/
Scriptor.TreeView.prototype.renderTemplate = function() {
	if (!this._templateRendered) {
		var ul = document.createElement('ul');
		ul.id = this.divId+'_0_branch';
		ul.className = 'treeViewContainer';
		this.target.insertBefore(ul, this.invalidator);
		
		this._templateRendered = true;
		if (this.inDOM)
			this.updateNodes();
	}
};

/*
*  getNextInternalId
*
*  Interface: return a unique id for a treeNode
*/
Scriptor.TreeView.prototype.getNextNodeId = function() {
	var found = true;
	while (found)
	{
		if (this.masterNode.searchNode(this.nextNodeId) === null)
			found = false;
		else
			this.nextNodeId++;
	}
	
	return this.nextNodeId;
};
	
Scriptor.TreeView.prototype.searchNode = function(id) {
	return this.masterNode.searchNode(id);
};

/*
* treeView.Refresh();
*  This function will call updateNodes to refresh treeView nodes if visible
*  You can use a treeViewConnector object to connect an XML or JSON service to treeView
*  and this will automatically retrieve information assync every time
*  you call Refresh() method.
*/
Scriptor.TreeView.prototype.refresh = function() {
	var e = Scriptor.event.fire(this, 'onrefresh');
	if (!e.returnValue)
		return;
	
	if (this.inDOM)
		this.updateNodes();
};

Scriptor.TreeView.prototype.updateNodes = function()
{
	if (!this.inDOM) {
		Scriptor.error.report("Add treeView to DOM before working with elements");
		return;
	}
	
	document.getElementById(this.divId+"_0_branch").innerHTML = '';
	this.masterNode.updateChildrenNodes();
};

Scriptor.TreeView.prototype.setLoading = function(val)
{
	Scriptor.className[val ? "add" : "remove"](this.target, "treeViewLoading");
};

/*
* treeView.setMessage(msg)
*	Set a message (usefull for error messages) and hide all info in a treeView
* 	If msg is set to false or not present, it will restore treeView to normal
*/
Scriptor.TreeView.prototype.setMessage = function(msg) {
	// false, null, or msg not present resets dataView to normal
	if (msg === false || msg === null || typeof(msg) != "string")
	{
		if (document.getElementById(this.divId + '_message'))
			document.getElementById(this.divId + '_message').parentNode.removeChild(document.getElementById(this.divId + '_message'));
			
		document.getElementById(this.divId + '_0_branch').style.display = '';
	}
	else	// if string passed, we show a message
	{
		document.getElementById(this.divId + '_0_branch').style.display = 'none';
		var msgDiv;
		if (!document.getElementById(this.divId + '_message'))
		{
			msgDiv = document.createElement('div');
			msgDiv.id = this.divId + '_message';
			msgDiv.className = 'treeViewMessageDiv';
			this.target.appendChild(msgDiv);
		}
		else
		{
			msgDiv = document.getElementById(this.divId + '_message');
		}
		msgDiv.innerHTML = msg;
	}
};

Scriptor.TreeView.prototype._expandNode = function(e, nodeId) {
	if (!e) e = window.event;
	
	var node = this.searchNode(nodeId);
	if (node.expanded)
	{
		node.expanded = false;
		document.getElementById(this.divId+'_'+nodeId+'_expandable').className = "treeViewExpandableNode";
		document.getElementById(this.divId+'_'+nodeId+'_branch').style.display = 'none';
	}
	else
	{
		node.expanded = true;
		document.getElementById(this.divId+'_'+nodeId+'_expandable').className = "treeViewCollapsableNode";
		document.getElementById(this.divId+'_'+nodeId+'_branch').style.display = 'block';
	}
	
	Scriptor.event.cancel(e);
	return false;
};

Scriptor.TreeView.prototype._selectNode = function(e, nodeNdx)
{
	if (!e) e = window.event;
	
	if (this.selectedNode !== null) {
		var selNode = this.searchNode(this.selectedNode);
		
		Scriptor.className.remove(document.getElementById(this.divId + '_' + selNode.id + '_selectNode'), "treeViewSelectedNode");		
	}
	
	if (this.selectedNode != nodeNdx)
	{
		var selNode = this.searchNode(nodeNdx);
		
		Scriptor.className.add(document.getElementById(this.divId + '_' + selNode.id + '_selectNode'), "treeViewSelectedNode");
	}
			
	this.selectedNode = (this.selectedNode == nodeNdx) ? null : nodeNdx;
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* treeView.addNode
* 	Adds a node with opts properties under parent id, optionally pass ndx to
* 	insert it between 2 children
*
*  ops:
*  	id : node Id, optional, MUST BE UNIQUE and not 0
*  	Name : Node label, must be string
*/
Scriptor.TreeView.prototype.addNode = function(opts, parent, ndx) {
	var parentNode = (parent == 0) ? this.masterNode : this.searchNode(parent);
	
	if (parentNode)
	{
		var localOpts = {
			treeView : this,
			parentId : parent,
			parent : parentNode,
			Name : ''
		};
		Scriptor.mixin(localOpts, opts);
		
		if (ndx >= 0 && ndx < parentNode.childNodes.length)
			parentNode.childNodes.splice(ndx, 0, new treeNode(localOpts));
		else
			parentNode.childNodes.push(new treeNode(localOpts));
			
		if (this.inDOM)	// TODO: Add node one by one
			this.updateNodes();
	}
};

/*
* treeView.deleteNode
* 	Deletes a node idenfitied by its id or by passing the node element
*
*  identifier: the node id or node element
*/
Scriptor.TreeView.prototype.deleteNode = function(identifier) {
	if (identifier == 0 || identifier == "0")
		return;	// can't delete master node!
	
	this._searchAndDelete(identifier, this.masterNode);
	
	if (this.inDOM)	// TODO: delete nodes one by one
		this.updateNodes();
};

/*
* treeView._searchAndDelete
*   For internal use only
*/
Scriptor.TreeView.prototype._searchAndDelete = function(identifier, node) {
	var nodeDeleted = false;

	if (typeof(identifier) == "number" || typeof(identifier) == "string")
	{
		// id passed
		for (var n=0; n < node.childNodes.length; n++)
		{
			if (node.childNodes[n].id == identifier)
			{
				if (this.selectedNode == node.childNodes[n].id)
					this.selectedNode = null;
					
				node.childNodes.splice(n, 1);
				
				nodeDeleted = true;
				break;
			}
		}
	}
	else
	{
		// look for equal node
		for (var n=0; n < node.childNodes.length; n++)
		{
			if (node.childNodes[n] == identifier)
			{
				if (this.selectedNode == node.childNodes[n].id)
					this.selectedNode = null;
					
				node.childNodes.splice(n, 1);
				nodeDeleted = true;
				break;
			}
		}
	}
	
	if (!nodeDeleted)
	{
		for (var n=0; n < node.childNodes.length; n++)
		{
			var done = this._searchAndDelete(node.childNodes[n], identifier);
			if (done)
			{
				nodeDeleted = done;
				break;
			}
		}
	}
	
	return nodeDeleted;
};

/*
* treeViewConnector
* 	Connector object that will connect a treeView with an api call, so every time
* 	you call treeView.Refresh() it will call its api to truly refresh
* 	the object in real time
*
* 	constructor parameters:
* 	treeView: A reference to a treeView object
* 	api: A String containig the path to the api file
* 	type: either json or xml, the format of the api file
*	parameters: query string to be passed on each call to api
*
* 	Examples for Api files
* 	XML:
* 	<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>
* 	<root success="1" errormessage="">
* 	   <node id="1"><label>Some node</label>
*			<node id="3"><label>Inner node 1</label></node>
*			<node id="4"><label>Inner node 2</label></node>
*		</node>
*		<node id="2"><label>Some other node</label></node>
* 	</root>
*
* 	JSON:
* 	{ "success" : 1, "errormessage" : "", "nodes" : [
*		{ "id" : 1, "label" : "Some node", nodes : [
*			{ "id" : 3, "label" : "Inner node 1" },
*			{ "id" : 4, "label" : "Inner node 2" }
*			] },
*		{ "id" : 2, "label" : "Som eother node" }
*    ]}
*
*/

if (Scriptor.DataConnectors === undefined)
	Scriptor.DataConnectors = {};
	
Scriptor.DataConnectors.TreeViewConnector = function(opts) {
	var localOpts = {
		treeView : null,
		api : null,
		method : 'POST',
		type : 'json',
		parameters : ''
	};
	
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.treeView)
	{
		Scriptor.error.report('Must provide treeView reference to treeViewConnector object.');
		return;
	}
	
	if (typeof(localOpts.api) != 'string' || localOpts.api == '')
	{
		Scriptor.error.report('Invalid Api string.');
		return;
	}
	
	this.api = localOpts.api;
	this.treeView = localOpts.treeView;
	this.parameters = localOpts.parameters;
	
	this.type = 'json';
	if (localOpts.type)
		switch (localOpts.type.toLowerCase())
		{
			case ('xml'):
				this.type = 'xml';
				break;
			case ('json'):
			default:
				this.type = 'json';
				break;
		}
		
	this.method = 'POST';
	if (typeof(localOpts.method) == 'string')
		this.method = localOpts.method.toUpperCase() == 'POST' ? 'POST' : 'GET';
		
	// event attaching and httpRequest setup
	Scriptor.event.attach(this.treeView, 'onrefresh', Scriptor.bind(this._onRefresh, this));
	
	this.httpRequest = new Scriptor.httpRequest({
		ApiCall : this.api,
		method : this.method,
		Type : this.type,
		onError : Scriptor.bind(this._onError, this),
		onLoad : Scriptor.bind(this._onLoad, this)
	});
};

Scriptor.DataConnectors.TreeViewConnector.prototype = {
	_onRefresh : function(e) {
		this.treeView.setLoading(true);
			
		this.httpRequest.send(this.parameters);
		
		Scriptor.event.cancel(e);
	},
	
	_onLoad : function(data) {
		this.treeView.setLoading(false);
		
		if (this.type == 'xml')	// xml parsing
		{
			var root = data.getElementsByTagName('root').item(0);
	
			// TODO: Add/Remove nodes instead of replacing the whole data structure
			//   upgrade addNode, implement deleteNode to avoid using updateNodes
			// fake visible = false so we call updateNodes only once
			
			// TODO: implement treeView.clear()
			delete this.treeView.masterNode;
			this.treeView.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this.treeView });
			this.treeView.nextNodeId = 1;
			this.treeView.updateNodes();
			if (root.getAttribute('success') == '1')
			{
				var nodes = this._fetchNodes(root);	// get first child nodes from xml element
				if (nodes.length)
					this._addNodesFromXml(nodes, 0);
			}
			else
			{
				this.treeView.setMessage(root.getAttribute('errormessage'));
			}
		}
		else	// json
		{
			// TODO: Add/Remove/Update rows instead of replacing the whole data structure
			//   upgrade addRow, deleteRow to avoid using updateRows
			// fake visible = false so we call updateRows only once
			// TODO: implement treeView.clear()
			delete this.treeView.masterNode;
			this.treeView.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this.treeView });
			this.treeView.nextNodeId = 1;
			this.treeView.updateNodes();
			if (data.success)
			{
				if (data.nodes && data.nodes.length)
					this._addNodesFromJson(data.nodes, 0);
					
			}
			else
			{
				this.treeView.setMessage(data.errormessage);
			}
		}
	},
	
	_fetchNodes : function(elem)
	{
		var ret = [];
		
		for (var n=0; n < elem.childNodes.length; n++)
			if (elem.childNodes[n].nodeName == 'node')
				ret.push(elem.childNodes[n]);
				
		return ret;
	},
	
	_addNodesFromXml : function(nodes, parentId)
	{
		for (var n=0; n < nodes.length; n++) {
			// look for label and childnodes
			var id = null;
			if (nodes[n].getAttribute('id'))
				id = nodes[n].getAttribute('id')
			
			var label = nodes[n].getElementsByTagName('label')[0];
			if (label)
				labelStr = label.firstChild.data;
				
			var childNodes = nodes[n].getElementsByTagName('node');
			
			this.treeView.addNode({ Name : labelStr, id : id }, parentId);
			
			if (childNodes)
				this._addNodesFromXml(this._fetchNodes(nodes[n]), id);
		}
	},
	
	_addNodesFromJson : function(nodes, parentId)
	{
		for (var n=0; n < nodes.length; n++) {
			this.treeView.addNode({Name : nodes[n].label, id : nodes[n].id }, parentId);
			
			if (nodes[n].nodes)
				this._addNodesFromJson(nodes[n].nodes, nodes[n].id);
		}
	},
	
	_onError : function(status)
	{
		this.treeView.setLoading(false);
		this.treeView.setMessage('Error: Unable to load treeView object (HTTP status: ' + status + ')');
	}
};/* JavaScript Document
*
*
* Dynamic ajax based calendar. Shows a simple calendar component with the ability
* to select dates (or date ranges) and navigate.
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+
*/

/*
* calendarView
* This is the main object. It holds a calendar which is assigned to an HTMLElement under
*  which to be instantiated.
*
* members are:
*  selectedDates: The current selected date range. Its an array of date objects holding the
*    range of selected dates. If length equals 0, the selection is empty.
*  multiSelect: If true multiselection is enabled for the calendar.
*  advanced: read only. True if calendar is in advanced selection mode.
*
*  curMonth: read only, an integer representing the current month to display (zero based).
*  curYear: read only, an integer representing the current year to display.
*  
*  disabledBefore : if present, all dates before but not including this date will be disabled
*  disabledAfter : if present, all dates after but not including this date will be disabled
*  disabledDays : (array) set all dates of the given day index (sun=0) to true to disable
*  disabledDates : an array of date elements pointing to disabled dates.
*  markedDates : an array of marked dates. Usefull to display busy days.
*
*  onselect: event handler. Will be executed after a click on a date and before anthing
*   is done to the object. You can cancel date selection by setting e.returnValue to false on that function.
*
*
*/
Scriptor.CalendarView = function(opts) {
	var curDate = new Date();
	
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		multiselect : false,
		month : curDate.getMonth(),
		year : curDate.getFullYear(),
		disabledBefore : null,
		disabledAfter : null,
		disabledDays : [false, false, false, false, false, false, false],
		disabledDates : []
	};
	
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.CalendarView";
	
	this.selectedDates = [];
	this.multiSelect = localOpts.multiselect;
	this.advanced = false;
	
	this.curMonth = (!isNaN(Number(localOpts.month)) && localOpts.month >= 0 && localOpts.month < 12) ? localOpts.month : curDate.getMonth();
	this.curYear = (!isNaN(Number(localOpts.year)) && localOpts.year > 0) ? localOpts.year : new curDate.getFullYear();
	
	this.disabledBefore  = localOpts.disabledBefore;
	this.disabledAfter = localOpts.disabledAfter;
	this.disabledDays = localOpts.disabledDays;
	this.disabledDates = localOpts.disabledDates;
	this.markedDates = [];
	
	this.hookedTo = null;
	this._registeredEvents = [];
	this._templateRendered = false;
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.DOMAddedImplementation = function() {
		if (document.getElementById(this.divId + '_body'))
		{
			this.updateDates();
			
			// advanced view event handlers
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId+'_advancedAccept'), 'onclick', Scriptor.bindAsEventListener(this.selectAdvanced, this)));
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId+'_advancedCancel'), 'onclick', Scriptor.bindAsEventListener(this.cancelAdvanced, this)));
		}
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
		
	};
	
	this.create();
	Scriptor.className.add(this.cmpTarget, "calendarView");
	
	// component template 
	this.renderTemplate();
	this.canHaveChildren = false;
};

Scriptor.CalendarView.prototype.renderTemplate = function () {
	if (!this._templateRendered)
	{
		// Create table header
		var cTemplate = '<div class="calendarViewWrapper"><div class="calendarViewHeader" id="' + this.divId + '_header"></div>';
		
		// Create body
		cTemplate += '<table border="0" cellpadding="0" cellspacing="0" class="calendarViewBody" id="' + this.divId + '_body"></table>';
		
		// create advanced dialog
		cTemplate += '<div class="calendarViewAdvanced" style="display: none;" id="'+this.divId+'_advanced">';
		var targetDate = new Date();
		if (this.selectedDates.length)
			targetDate = this.selectedDates[0];
		
		// day selector
		cTemplate += '<p><label for="'+this.divId+'DaySelector">'+this.lang.day+'</label>';
		cTemplate += '<input type="text" id="'+this.divId+'DaySelector" value="'+targetDate.getDate()+'" /></p>';
		
		// month selector
		cTemplate += '<p><label for="'+this.divId+'MonthSelector">'+this.lang.month+'</label>';
		cTemplate += '<select id="'+this.divId+'MonthSelector">';
		for (var n=0; n < 12; n++) 
			cTemplate += '<option value="'+n+'"' + (targetDate.getMonth() == n ? ' selected="selected"' : '') + '>'+this.lang.longMonths[n]+'</option>';	
		cTemplate += '</select></p>';
		
		// year selector
		cTemplate += '<p><label for="'+this.divId+'YearSelector">'+this.lang.year+'</label>';
		cTemplate += '<input type="text" id="'+this.divId+'YearSelector" value="'+targetDate.getFullYear()+'" /></p>';
		
		// buttons
		cTemplate += '<p><input type="button" class="calendarBtn calendarAccept" id="'+this.divId+'_advancedAccept" value="'+this.lang.accept+'"> ';
		cTemplate += '<input type="button" class="calendarBtn calendarCancel" id="'+this.divId+'_advancedCancel" value="'+this.lang.cancel+'"></p>';
		
		cTemplate += '</div>';
		
		// Create footer
		cTemplate += '<div class="calendarViewFooter" id="' + this.divId + '_footer"></div></div>';
		
		this.cmpTarget.innerHTML = cTemplate;
		
		this._templateRendered = true;
		// if the component had a present DOM element at the time of instantiation, we have called
		// DOMAddedImplementation before having the proper template created.
		if (this.inDOM && this._registeredEvents.length == 0)
		{
			this.DOMAddedImplementation();
		}
	}
};


/*
*  calendarView.updateDates()
*   When [calendarView.visible = true] which is a result of calling calendarView.Show(), 
*   you can then call calendarView.updateDates() directly to update row information only 
*   without spending additional resources on the calendarView frame rendering.
*/
Scriptor.CalendarView.prototype.updateDates = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update data on non visible calendarView object.");
		return;
	}
	
	var targetTable = document.getElementById(this.divId+'_body');
	targetTable.style.display = '';
	document.getElementById(this.divId+'_advanced').style.display = 'none';
	this.advanced = false;
	
	while (targetTable.firstChild)
		targetTable.removeChild(targetTable.firstChild);
		
	// IE8 doesn't like this
	//targetTable.innerHTML = '';		
	
	// using DOM functions here to overcome possible IE bugs when rendering large tables through innerHTML
	// create table header
	var thead = document.createElement('thead');
	var tmpTr, tmpTh, tmpTd, tmpA;
	
	var tmpTr = document.createElement('tr');
	for (var n=0; n < 7; n++) {
		tmpTh = document.createElement('th');
		tmpTh.appendChild(document.createTextNode(this.lang.shortDays[n]));
		tmpTr.appendChild(tmpTh);
	}
	thead.appendChild(tmpTr);
	targetTable.appendChild(thead);
	
	// create days
	var today = new Date();
	var curMonth = new Date(this.curYear, this.curMonth, 1, 0, 0, 0, 0);
	var nextMonth = new Date(curMonth.getTime());
	nextMonth.setMonth(nextMonth.getMonth()+1);
	
	var firstDay = curMonth.getDay();
	var curDay = 0;
	
	var tbody = document.createElement('tbody');
	var tmpTr = document.createElement('tr');

	// adding space before 1st of month
	while (curDay < firstDay) {
		tmpTd = document.createElement('td');
		tmpTd.appendChild(document.createTextNode(' '));
		tmpTr.appendChild(tmpTd);
		curDay++;
	}
	
	while (curMonth < nextMonth) {
		tmpTd = document.createElement('td');
		tmpTd.setAttribute('align', 'left');
		tmpTd.setAttribute('valign', 'top');
		
		tmpA = document.createElement('a');
		tmpA.setAttribute('href', Scriptor.getInactiveLocation());
		tmpA.appendChild(document.createTextNode(curMonth.getDate()));
		
		// detect today
		var isToday = false;
		if (this.isEqual(curMonth, today)) {
			isToday = true;
		}
		
		var classChanged = false;
		// detect disabled date
		if (this.isDisabledDate(curMonth)) {
			classChanged = true;
			if (isToday) {
				tmpA.className = 'calendarDisabled calendarToday';
			}
			else {
				tmpA.className = 'calendarDisabled';
			}
		}
		
		// detect marked date
		for (var n=0; n < this.markedDates.length; n++) {
			if (this.isEqual(curMonth, this.markedDates[n])) {
				classChanged = true;
				if (isToday) {
					tmpA.className = 'calendarMarked calendarToday';
				}
				else {
					tmpA.className = 'calendarMarked';
				}
			}
		}
		
		// detect selection range
		for (var n=0; n < this.selectedDates.length; n++) {
			if (this.isEqual(curMonth, this.selectedDates[n])) {
				classChanged = true;
				if (isToday) {
					tmpA.className = 'calendarSelected calendarToday';
				}
				else {
					tmpA.className = 'calendarSelected';
				}
			}
		}
		
		if (!classChanged && isToday)
			tmpA.className = 'calendarToday';
		
		tmpTd.appendChild(tmpA);
		tmpTr.appendChild(tmpTd);
		Scriptor.event.attach(tmpA, 'onclick', Scriptor.bind(this.selectDate, this, curMonth.getDate()));
		
		curMonth.setDate(curMonth.getDate()+1);
		curDay++;
		if (curDay > 6) { 	// new row
			tbody.appendChild(tmpTr);
			tmpTr = document.createElement('tr');
			curDay = 0;
		}
	}
	
	// adding space after end of month
	if (curDay > 0) {
		tbody.appendChild(tmpTr);

		while (curDay < 7) {
			tmpTd = document.createElement('td');
			tmpTd.appendChild(document.createTextNode(' '));
			tmpTr.appendChild(tmpTd);
			curDay++;
		}
	}

	targetTable.appendChild(tbody);
	
	this.__refreshHeader();
	this.__refreshFooter();
};

/*
* calendarView.__refreshHeader()
*   Internal function. Refreshes the header area.
*/
Scriptor.CalendarView.prototype.__refreshHeader = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.divId+'_header');
	targetDiv.innerHTML = '';
	var curLocation = Scriptor.getInactiveLocation();
			
	var hTemplate = '<ul><li class="calendarViewLeft"><a class="calendarViewPrev" title="'+this.lang.prevMonth+'" id="'+this.divId+'_prevMonth" href="'+curLocation+'"> </a></li>';
	hTemplate += '<li class="calendarViewLeft"><a class="calendarAdvanced" title="'+this.lang.advanced+'" id="'+this.divId+'_viewAdvanced" href="'+curLocation+'"> </a></li>';
	hTemplate += '<li class="calendarViewRight"><a class="calendarViewNext" title="'+this.lang.nextMonth+'" id="'+this.divId+'_nextMonth" href="'+curLocation+'"> </a></li>';
	hTemplate += '<li><p class="calendarViewMonth">'+this.lang.longMonths[this.curMonth] + ' ' + this.curYear+'</p></li>';
	hTemplate += '</ul>';
	
	targetDiv.innerHTML = hTemplate;
	
	Scriptor.event.attach(document.getElementById(this.divId+'_prevMonth'), 'onclick', Scriptor.bind(this.goPrevMonth, this));
	Scriptor.event.attach(document.getElementById(this.divId+'_viewAdvanced'), 'onclick', Scriptor.bind(this.setAdvanced, this));
	Scriptor.event.attach(document.getElementById(this.divId+'_nextMonth'), 'onclick', Scriptor.bind(this.goNextMonth, this));
};

/*
* calendarView.__refreshFooter()
*   Internal function. Refreshes the footer area.
*/
Scriptor.CalendarView.prototype.__refreshFooter = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.divId+'_footer');
	targetDiv.innerHTML = '';
	
	var fTemplate = '<p><a class="calendarGoHome" title="'+this.lang.homeDate+'" href="'+Scriptor.getInactiveLocation()+'" id="'+this.divId+'_goHome"> </a>';
	
	if (this.selectedDates.length) {
		if (this.selectedDates.length == 1) { // single selection
			var text = this.lang.oneSelection;
			text += this.lang.shortDays[this.selectedDates[0].getDay()];
			text += ' ' + this.selectedDates[0].getDate() + ' ';
			text += this.lang.shortMonths[this.selectedDates[0].getMonth()];
			
			fTemplate += text;
		}
		else {  // multiple selection
			var text = this.lang.multipleSelection;
			for (var n=0; n < this.selectedDates.length; n++) {
				if (n > 0) {
					text += ', ';
				}
				text += this.lang.shortDays[this.selectedDates[n].getDay()];
				text += ' ' + this.selectedDates[n].getDate() + ' ';
				text += this.lang.shortMonths[this.selectedDates[n].getMonth()];
			}
			fTemplate += text;
		}
	}
	else {		// noselection
		fTemplate += this.lang.noSelection + '</p>'
	}
	
	targetDiv.innerHTML = fTemplate;
	Scriptor.event.attach(document.getElementById(this.divId+'_goHome'), 'onclick', Scriptor.bind(this.goHomeDate, this));
};

/*
* calendarView.setAdvanced()
*   Internal function. Goes to advanced mode in which user will select a date using
*   a form. Usefull to select distanct dates.
*/
Scriptor.CalendarView.prototype.setAdvanced = function(e) {
	if (!e) e = window.event;
	
	document.getElementById(this.divId+'_body').style.display = 'none';
	document.getElementById(this.divId+'_advanced').style.display = 'block';
	
	var targetDate = new Date();
	if (this.selectedDates.length)
		targetDate = this.selectedDates[0];
	
	document.getElementById(this.divId + 'DaySelector').value = targetDate.getDate();
	document.getElementById(this.divId + 'MonthSelector').selectedIndex = targetDate.getMonth();
	document.getElementById(this.divId + 'YearSelector').value = targetDate.getFullYear();
	
	this.advanced = true;
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* calendarView.cancelAdvanced()
*  This function will return to normal mode, canceling advanced selection in calendar instance
*/
Scriptor.CalendarView.prototype.cancelAdvanced = function () {
	document.getElementById(this.divId+'_body').style.display = '';
	document.getElementById(this.divId+'_advanced').style.display = 'none';
	
	this.advanced = false;
};

/*
* selectAdvanced()
*  This function checks and selects the date entered in advanced mode
*/
Scriptor.CalendarView.prototype.selectAdvanced = function(e) {
	if (!e) e = window.event;
	
	var dayNum = document.getElementById(this.divId + 'DaySelector').value;
	var monthNum = document.getElementById(this.divId + 'MonthSelector').value;
	var yearNum = document.getElementById(this.divId + 'YearSelector').value;
	
	if (isNaN(Number(dayNum))) {
		alert(this.lang.error1);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	if (isNaN(Number(yearNum))) {
		alert(this.lang.error2);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var targetDate = new Date(yearNum, monthNum, dayNum);
	if (targetDate.getMonth() != monthNum) {
		alert(this.lang.error1);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	if (this.isDisabledDate(targetDate)) {
		alert(this.lang.error3);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var fakeE = { selecting : targetDate, selectedDates : this.selectedDates };
	fakeE = Scriptor.event.fire(this, 'onselect', fakeE);
	if (fakeE.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	this.selectedDates.length = 0;
	this.selectedDates[0] = targetDate;
	this.goHomeDate(e);
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* selectDate()
*  This function executes when clicking on a calendarView date and selects that date
*/
Scriptor.CalendarView.prototype.selectDate = function(e, date) {
	if (!e) e = window.event;
	
	var targetDate = new Date(this.curYear, this.curMonth, date);
	var fakeE = { selecting : targetDate, selectedDates : this.selectedDates };
	fakeE = Scriptor.event.fire(this, 'onselect', fakeE);
	if (fakeE.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	if (!this.isDisabledDate(targetDate)) {
		if (!this.multiSelect) {
			this.selectedDates.length = 0;
			this.selectedDates[0] = targetDate;
		}
		else {
			Scriptor.error.report('Error: multiselect function not implemented.');
			Scriptor.event.cancel(e, true);
			return false;
		}
		this.updateDates();
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* calendarView.isDisabledDate(date)
*   This function will return true if the provided date object is within the range of
*   disabled dates configured in the calendarView.
*/
Scriptor.CalendarView.prototype.isDisabledDate = function(date) {
	if (this.disabledBefore) {	
		if (date.getFullYear() < this.disabledBefore.getFullYear()) {
			return true;
		}
		else {
			if (date.getFullYear() <= this.disabledBefore.getFullYear() &&
				date.getMonth() < this.disabledBefore.getMonth()) {
				return true;
			}
			else {
				if (date.getFullYear() <= this.disabledBefore.getFullYear() &&
					date.getMonth() <= this.disabledBefore.getMonth() &&
					date.getDate() < this.disabledBefore.getDate()) {
					return true;
				}
			}
		}	
	}
	
	if (this.disabledAfter) {
		if (date.getFullYear() > this.disabledAfter.getFullYear()) {
			return true;
		}
		else {
			if (date.getFullYear() >= this.disabledAfter.getFullYear() &&
				date.getMonth() > this.disabledAfter.getMonth()) {
				return true;
			}
			else {
				if (date.getFullYear() >= this.disabledAfter.getFullYear() &&
					date.getMonth() >= this.disabledAfter.getMonth() &&
					date.getDate() > this.disabledAfter.getDate()) {
					return true;
				}
			}
		}
	}
	
	if (this.disabledDays[date.getDay()]) {
		return true;
	}
	
	for (var n=0; n < this.disabledDates.length; n++) {
		if (this.isEqual(date, this.disabledDates[n])) {
			return true;
		}
	}
	
	return false;
};

Scriptor.CalendarView.prototype.isEqual = function (date1, date2) {
	if (date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()) {
		return true;
	}
	else {
		return false;
	}
};

/*
* goPrevMonth()
*  To go to a previous month
*/
Scriptor.CalendarView.prototype.goPrevMonth = function (e) {
	if (!e) e = window.event;
	
	this.curMonth--;
	if (this.curMonth < 0) {
		this.curMonth = 11;
		this.curYear--;
	}
	
	this.updateDates();
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* goNextMonth()
*  To go to the next month
*/
Scriptor.CalendarView.prototype.goNextMonth = function (e) {
	if (!e) e = window.event;
		
	this.curMonth++;
	if (this.curMonth > 11) {
		this.curMonth = 0;
		this.curYear++;
	}
	
	this.updateDates();
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* goHomeDate()
*  Will make selection visible, or will show current date
*/
Scriptor.CalendarView.prototype.goHomeDate = function (e) {
	if (!e) e = window.event;
		
	var showingDate;
	if (this.selectedDates.length) {
		showingDate = this.selectedDates[0];
	}
	else {
		showingDate = new Date();
	}
	
	this.curMonth = showingDate.getMonth();
	this.curYear = showingDate.getFullYear();
	this.updateDates();
	
	Scriptor.event.cancel(e, true);
	return false;
};


/*
* Hooks this calendarView instance to a text input to select a date
*/
Scriptor.CalendarView.prototype.hook = function(elementId) {
	var elem = null;
	
	if (typeof(elementId) == 'string')
		elem = document.getElementById(elementId);
	else if (Scriptor.isHTMLElement(elementId))
		elem = elementId;

	if (elem) {
		this.hookedTo = elem;
		
		calElem = document.getElementById(this.div);
		Scriptor.event.attach(elem, 'onfocus', Scriptor.bind(this.showHooked, this));
		calElem.style.display = 'none';
		calElem.style.position = 'absolute';
		
		//this.Show();
		Scriptor.event.attach(this, 'onselect', Scriptor.bind(this.assignToHooked, this));
		//this.onselect = CaViE.assignToHooked;
	}
};

/*
* shows a hooked calendar to input text
*/
Scriptor.CalendarView.prototype.showHooked = function(e) {
	if (!e) e = window.event;
	
	var elem = this.hookedTo;
	
	var date = this.getDateFromStr(elem.value);
			
	this.curMonth = date.getMonth();
	this.curYear = date.getFullYear();
	this.selectedDates.length = 0
	this.selectedDates[0] = date;
			
	this.Show();
	
	if (this._hideHookedBind)
		Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
		
	Scriptor.event.attach(document, 'onclick', this._hideHookedBind = Scriptor.bind(this.hideHooked, this));
	
	this.divElem.style.display = 'block';
	this.divElem.zIndex = '1000';
	if (e.offsetX) {
		x = e.offsetX;
		y = e.offsetY
	}
	else {
		x = e.pageX - document.getBoxObjectFor(elem).x;
		y = e.pageY - document.getBoxObjectFor(elem).y;
	}
	
	if (e.pageX) {
		x = e.pageX - x;
		y = e.pageY - y + 24;
	}
	else {
		if (e.x) {
			x = e.x + document.documentElement.scrollLeft - x;
			y = e.y + document.documentElement.scrollTop - y + 24;
		}
		
	}
	
	this.y = y;
	this.x = x;
	this.updateSize();
	
};

/*
* to hide the showing floating calendars
*/
Scriptor.CalendarView.prototype.hideHooked = function(e) {
	if (!e) e = window.event;
	
	this.hide();
	
	if (this._hideHookedBind)
		Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
	
};

/*
* Assign selected value in a calendarView to hooked input
*  Formatting depends on lang.isFrenchDateFormat
*/
Scriptor.CalendarView.prototype.assignToHooked = function() {
	
	var date = this.selectedDates[0];
	var input = this.hookedTo;
	
	if (this.lang.isFrenchDateFormat)
	{
		// dd/mm/yyyy
		input.value =  date.getDate() + '/' + (date.getMonth() +1) + '/' + date.getFullYear();
	}
	else
	{
		// mm/dd/yyyy
		input.value =  (date.getMonth() +1) + '/' + date.getDate() + '/' + date.getFullYear();
	}
	
	this.Hide();
	if (this._hideHookedBind)
		Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
};

/*
* gets date from str.
*/
Scriptor.CalendarView.prototype.getDateFromStr = function(str) {
	var dateCmps = str.split('/');
	
	// dd/mm/yyyy
	var ret;
	if (!isNaN(Number(dateCmps[0])) && !isNaN(Number(dateCmps[1])) && !isNaN(Number(dateCmps[2]))) {
		if (this.lang.isFrenchDateFormat)
		{
			if (dateCmps[1] > 0 && dateCmps[1] < 13 && dateCmps[0] > 0 && dateCmps[0] < 32 && dateCmps[2] > 0) {
				ret = new Date(dateCmps[2], dateCmps[1]-1, dateCmps[0], 0, 0, 0);
			}
			else {
				ret = new Date();
			}
		}
		else
		{
			if (dateCmps[0] > 0 && dateCmps[0] < 13 && dateCmps[1] > 0 && dateCmps[1] < 32 && dateCmps[2] > 0) {
				ret = new Date(dateCmps[2], dateCmps[1]-1, dateCmps[0], 0, 0, 0);
			}
			else {
				ret = new Date();
			}
		}
	}
	else {
		ret = new Date();
	}
	
	return ret;
};
// JavaScript Document

Scriptor.CalendarView.prototype.lang = {
	shortDays : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	
	shortMonths : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agoust', 
				  'September', 'October', 'November', 'December'],
	
	noSelection : 'No date selected',
	oneSelection : 'Date: ',
	multipleSelection : 'Dates: ',
	
	prevMonth : 'Previous Month',
	nextMonth : 'Next Month',
	advanced : 'Select month and year',
	homeDate : 'Go to selection date or today',
	
	day : 'Day:',
	month : 'Month:',
	year : 'Year:',
	
	accept : 'Accept',
	cancel : 'Cancel',
	
	error1 : 'The date field entered is invalid.',
	error2 : 'The year field entered is invalid.',
	error3 : 'The selected date is not available.',
	
	isFrenchDateFormat : false
};// JavaScript Document
/*
*
*  Will display a selectable group of thumbnails with information about the image itself.
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+
*/

/* 
* gv_ImageObect
*
* This object contains the information about an image in the gallery.
* You initialize it by providing a thumbnail string which will be used in the src
* attribute of the img object. The path is the internal path to be used if you
* need to render the image in its original size, finally an optional name might
* be provided to be printed under te image's thumbnail.
* 
*/
var gv_ImageObject = function(thumbnail, path, name) {
	this.thumbnail = thumbnail;
	this.path = path;
	this.name = name;
};

/*
* galleryView
*
* This is the main component. It will set up a div element with the array of
* gv_ImageObjects representing images.
*
* Options are:
*  In opts:
*  thumbWidth: optional, the fixed width of the thumbnails in pixels
*  thumbHeight: optional, the fixed height of the thumbnails in pixles
*  showNAmes: true if you want to display labels under thumbnails
*  fuxedThumbSize: true to take thumb width and height to set the width and
*  		height of the thumbnails
*  
* Properties:
*  selectedImage: the index of the selected image in the array. -1 if none.
*  enabled: set to true if the component is enabled (events will take place and
*    event handlers will be executed).
*    
*  onrefresh: function to be executed on refresh 
*  onshow: function to be executed on show
*  onselect: function to be executed on selection of a thumbnail
*  
*  visible: readonly property. It is true if the component has been shown sucessfully
*  images: an array of gv_ImageObjects contained in the component
*/
Scriptor.GalleryView = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		thumbWidth : 154,
		thumbHeight : 184,
		showNames : true,
		fixedThumbSize : true
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.GalleryView";
	
	this.selectedImage = -1;
	this.showNames = localOpts.showNames;
	this.fixedThumbSize = localOpts.fixedThumbSize;
	this.thumbWidth = localOpts.thumbWidth;
	this.thumbHeight = localOpts.thumbHeight;
	this.images = [];
	
	this.DOMAddedImplementation = function() {
		this.updateImages();
	};
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.create();
	Scriptor.className.add(this.target, "galleryViewWrapper");
	Scriptor.className.add(this.cmpTarget, "galleryView");
	
	// component template 
	this.canHaveChildren = false;
};

/*
* galleryView.addImage
*
* Adds an image to the list, options are:
* 	thumbnail: the path to the image thumbnail
* 	path: the path to the full image (optional)
* 	name: the name of the image (optional)
* 	insertIndex: the index to insert the image in the list (optional)
*/
Scriptor.GalleryView.prototype.addImage = function(opts)
{
	var localOpts = {
		thumbnail: null,
		path: null,
		name: null,
		insertIndex: this.images.length
	};
	
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.thumbnail)
	{
		Scriptor.error.report('Missing thumbnail information for galleryView image');
		return;
	}
	
	if (localOpts.insertIndex == this.images.length)
	{
		this.images.push(new gv_ImageObject(localOpts.thumbnail, localOpts.path, localOpts.name));
	}
	else
	{
		this.images.splice(localOpts.insertIndex, 0, new gv_ImageObject(localOpts.thumbnail, localOpts.path, localOpts.name));
	}
	
	if (this.inDOM)	// TODO: a way to add one image to DOM
		this.updateImages();
};

Scriptor.GalleryView.prototype.deleteImage = function(identifier)
{
	if (typeof(identifier) == 'number')
	{
		this.images.splice(identifier,1);
	}
	else if (typeof(identifier) == 'object')
	{
		for (var n=0; n < this.images.length; n++)
		{
			if (this.images[n] == identifier)
			{
				this.images.splice(n,1);
				break;
			}
		}
	}
	
	if (this.selectedImage > this.images.length-1)
		this.selectedImage = -1;
	
	if (this.inDOM)	// TODO: a way to remove only one image from DOM
		this.updateImages();
};

Scriptor.GalleryView.prototype.refresh = function() {
	var e = Scriptor.event.fire(this, 'onrefresh');
	if (!e.returnValue)
		return;
	
	if (this.inDOM)
		this.updateImages();
};

/*
* galleryView.setLoading(val)
*   If val is true, show loading spinner, else show the actual rows,
*   usefull for assync updates
*/
Scriptor.GalleryView.prototype.setLoading = function(val) {
	Scriptor.className[(val ? "add" : "remove")](this.cmpTarget, "galleryViewLoading");
};

/*
* galleryView.setMessage(msg)
*	Set a message (usefull for error messages) and hide all info in a galleryView
* 	If msg is set to false or not present, it will restore galleryView to normal
*/
Scriptor.GalleryView.prototype.setMessage = function(msg) {
	// false, null, or msg not present resets dataView to normal
	if (msg === false || msg === null || typeof(msg) != "string")
	{
		if (document.getElementById(this.divId + '_message'))
			this.target.removeChild(document.getElementById(this.divId + '_message'));
			
		Scriptor.className.remove(this.cmpTarget, "galleryViewMessage");
	}
	else	// if string passed, we show a message
	{
		Scriptor.className.add(this.cmpTarget, "galleryViewMessage");
		var msgDiv;
		if (!document.getElementById(this.divId + '_message'))
		{
			msgDiv = document.createElement('p');
			msgDiv.id = this.divId + '_message';
			this.target.appendChild(msgDiv);
		}
		else
		{
			msgDiv = document.getElementById(this.divId + '_message');
		}
		msgDiv.innerHTML = msg;
	}
};

Scriptor.GalleryView.prototype.updateImages = function()
{
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update images on non visible galleryView object.");
		return;
	}
		
	this.cmpTarget.innerHTML = '';
	
	var iTemplate = '';
	
	for (var n=0; n < this.images.length; n++) {
		iTemplate += '<div id="' + this.divId + '_envelop_' + n + '" ';
		if (this.fixedThumbSize) 
			iTemplate += 'style="width: ' + this.thumbWidth + 'px; height: ' + this.thumbHeight + 'px; overflow: hidden;"';
		
		if (this.selectedImage == n)
			iTemplate += 'class="gvSelectedImage" ';
		iTemplate += '>';
		
		iTemplate += '<img id="' + this.divId + '_img_' + n + '" src="' + this.images[n].thumbnail + '" />';
		
		if (this.showNames && this.images[n].name) 
			iTemplate += '<p>' + this.images[n].name + '</p>'
		
		iTemplate += '</div>';
	}
	
	this.cmpTarget.innerHTML = iTemplate;
	for (var n=0; n < this.images.length; n++)
	{
		Scriptor.event.attach(document.getElementById(this.divId + '_img_' + n), 'onclick', Scriptor.bindAsEventListener(this._selectImage, this, n));
	}
	
	if (this.selectedImage >= this.images.length) 
		this.selectedImage = -1;
};

Scriptor.GalleryView.prototype._selectImage = function(e, imgNdx) {
	if (!e) e = window.event;
	
	e.selectedImage = this.selectedImage;	
	e.selecting = imgNdx;
	e = Scriptor.event.fire(this, 'onselect', e);
	
	if (e.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var imgs = this.cmpTarget.getElementsByTagName('img');
	if (imgNdx != -1) {	
		if (this.selectedImage != -1) {
			for (var a=0; a < imgs.length; a++) {
				if (imgs[a].parentNode.className == 'gvSelectedImage') {
					imgs[a].parentNode.className = '';				
					break;
				}
			}
		}
		
		if (this.selectedImage == imgNdx) {
			this.selectedImage = -1;
		}
		else {
			this.selectedImage = imgNdx;
			imgs[imgNdx].parentNode.className = 'gvSelectedImage';
		}
	}
			
	Scriptor.event.cancel(e);
	return false;
};

/*
* galleryViewConnector
* 	Connector object that will connect a galleryView with an api call, so every time
* 	you call galleryView.Refresh() it will call its api to truly refresh
* 	the object in real time
*
* 	constructor parameters:
* 	galleryView: A reference to a galleryView object
* 	api: A String containig the path to the api file
* 	type: either json or xml, the format of the api file
*	parameters: query string to be passed on each call to api
*
* 	Examples for Api files
* 	XML:
* 	<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>
* 	<root success="1" errormessage="">
* 	   <image>
*		<thumbnail>gallery/thumbnails/A210d.jpg</thumbnail>
*		<path>gallery/A210d.jpg</path>
*		<name>A210d.jpg</name>
*		<param name="one">value 1.A210d.jpg</param>
*		<param name="two">value 2.A210d.jpg</param>
*	  </image>
* 	</root>
*
* 	JSON:
* 	{ "success" : 1, "errormessage" : "", "images" : [
*		{ "thumbnail" : "gallery/thumbnails/A210d.jpg", "path" : "A210d.jpg", "name" : "A210d.jpg", "one" : "value 1.A210d.jpg" }
*    ]}
*
*/
if (Scriptor.DataConnectors === undefined)
	Scriptor.DataConnectors = {};
	
Scriptor.DataConnectors.GalleryViewConnector = function(opts) {
	var localOpts = {
		galleryView : null,
		api : null,
		method : 'POST',
		type : 'json',
		parameters : ''
	};
	
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.galleryView)
	{
		Scriptor.error.report('Must provide galleryView reference to galleryViewConnector object.');
		return;
	}
	
	if (typeof(localOpts.api) != 'string' || localOpts.api == '')
	{
		Scriptor.error.report('Invalid Api string.');
		return;
	}
	
	this.api = localOpts.api;
	this.galleryView = localOpts.galleryView;
	this.parameters = localOpts.parameters;
	
	this.type = 'json';
	if (localOpts.type)
		switch (localOpts.type.toLowerCase())
		{
			case ('xml'):
				this.type = 'xml';
				break;
			case ('json'):
			default:
				this.type = 'json';
				break;
		}
		
	this.method = 'POST';
	if (typeof(localOpts.method) == 'string')
		this.method = localOpts.method.toUpperCase() == 'POST' ? 'POST' : 'GET';
		
	// event attaching and httpRequest setup
	Scriptor.event.attach(this.galleryView, 'onrefresh', Scriptor.bind(this._onRefresh, this));
	
	this.httpRequest = new Scriptor.httpRequest({
		ApiCall : this.api,
		method : this.method,
		Type : this.type,
		onError : Scriptor.bind(this._onError, this),
		onLoad : Scriptor.bind(this._onLoad, this)
	});
};

Scriptor.DataConnectors.GalleryViewConnector.prototype = {
	_onRefresh : function(e) {
		this.galleryView.setLoading(true);
			
		this.httpRequest.send(this.parameters);
		
		Scriptor.event.cancel(e);
	},
	
	_onLoad : function(data) {
		this.galleryView.setLoading(false);
		
		if (this.type == 'xml')	// xml parsing
		{
			var root = data.getElementsByTagName('root').item(0);
	
			// TODO: Add/Remove/Update images instead of replacing the whole data structure
			//   upgrade addImage, deleteImage to avoid using updateImages
			// fake visible = false so we call updateImages only once
			this.galleryView.images.length = 0;

			if (root.getAttribute('success') == '1') {
				var images = root.getElementsByTagName('image');
				
				for (var n=0; n < images.length; n++) {
					var thumb = images.item(n).getElementsByTagName('thumbnail');
					var path = images.item(n).getElementsByTagName('path');
					var name = images.item(n).getElementsByTagName('name');
					var thumbText = '';
					var pathText = '';
					var nameText = '';
					
					if (thumb.length) {
						if (thumb.item(0).firstChild) {
							thumbText = thumb.item(0).firstChild.data;
						}
					}
					
					if (path.length) {
						if (path.item(0).firstChild) {
							pathText = path.item(0).firstChild.data;
						}
					}
					
					if (name.length) {
						if (name.item(0).firstChild) {
							nameText = name.item(0).firstChild.data;
						}
					}
					
					this.galleryView.images.push(new gv_ImageObject(thumbText, pathText, nameText));
					
					var params = images.item(n).getElementsByTagName('param');
					if (params.length) {
						for (var a=0; a < params.length; a++) {
							var paramName = params.item(a).getAttribute('name');
							var paramText = '';
							if (params.item(a).firstChild)
								paramText = params.item(a).firstChild.data;
							
							this.galleryView.images[this.galleryView.images.length-1][paramName] = paramText;
						}
					}
				}
				
			}
			else {
				this.galleryView.setMessage(root.getAttribute('errormessage'));
			}
			
			if (this.galleryView.inDOM)
				this.galleryView.updateImages();
		}
		else	// json
		{
			// TODO: Add/Remove/Update images instead of replacing the whole data structure
			//   upgrade addImage, deleteImage to avoid using updateImages
			// fake visible = false so we call updateImages only once
			this.galleryView.images.length = 0;
			
			if (data.success) {
				for (var n=0; n < data.images.length; n++) {
					var thumbText = data.images[n].thumbnail;
					var pathText = data.images[n].path;
					var nameText = data.images[n].name;
					
					this.galleryView.images.push(new gv_ImageObject(thumbText, pathText, nameText));
					
					
					for (var param in data.images[n]) {
						if (param != 'thumbnail' && param != 'path' && param != 'name')
						{
							this.galleryView.images[this.galleryView.images.length-1][param] = data.images[n][param];
						}
					}
					
				}
				
			}
			else {
				this.galleryView.setMessage(data.errormessage);
			}
			
			if (this.galleryView.inDOM)
				this.galleryView.updateImages();
			
		}
	},
	
	_onError : function(status)
	{
		this.galleryView.setLoading(false);
		this.galleryView.setMessage('Error: Unable to load galleryView object (HTTP status: ' + status + ')');
	}
};/*
*
* Scriptor Toolbar
*
* Toolbar component class
*
*/

Scriptor.Toolbar = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.Toolbar";
	
	// initialize events!
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onbeforeshow');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onbeforehide');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onbeforedestroy');
	Scriptor.event.registerCustomEvent(this, 'ondestroy');
	Scriptor.event.registerCustomEvent(this, 'oncreate');
	Scriptor.event.registerCustomEvent(this, 'onresize');
	Scriptor.event.registerCustomEvent(this, 'onfocus');
	Scriptor.event.registerCustomEvent(this, 'onblur');
	
	this.buttons = [];
	this.nextBtnId = 0;
	this._showingMore = false;
	this._extraBtns = 1;
	this._showingExtraButtons = false;
	this._checkMenuBind = null;
	
	// redefine component implementation
	this._registeredEvents = [];
	this.DOMAddedImplementation = function() {
		for (var n=0; n < this.buttons.length; n++)
			this.addClickEvent(this.buttons[n]);
		
		// add "more" dropdown button onclick event
		if (this._moreSpan)
			this._registeredEvents.push(Scriptor.event.attach(this._moreSpan, 'onclick', Scriptor.bindAsEventListener(this.onDropdownClick, this)));
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
		
	};	

	this.resizeImplementation = function() {
		if (this._showingExtraButtons)
			this.hideDropDown();
		
		var btnsInnerWidth = this.cmpTarget.offsetWidth;
		var orignBtnsInnerWidth = btnsInnerWidth;
		
		// drop down width calculation (only if displayed)
		var moreOuterLeft = parseInt(Scriptor.className.getComputedProperty(this._moreSpan, 'margin-left'));
		var moreOuterRight = parseInt(Scriptor.className.getComputedProperty(this._moreSpan, 'margin-right'));
		btnsInnerWidth -= (this._moreSpan.offsetWidth + moreOuterLeft + moreOuterRight);
		
		var totalBtnsWidth = 0;
		var extraBtnReached = false;
		for (var n=0; n < this.cmpTarget.childNodes.length; n++)
		{
			var theBtn = this.cmpTarget.childNodes[n];

			var outerLeft = parseInt(Scriptor.className.getComputedProperty(theBtn, 'margin-left'));
			var outerRight = parseInt(Scriptor.className.getComputedProperty(theBtn, 'margin-right'));
				
			if (isNaN(outerLeft))
				outerLeft = 0;
				
			if (isNaN(outerRight))
				outerRight = 0;
			
			totalBtnsWidth += theBtn.offsetWidth + outerLeft + outerRight;
			
			if (n == this.cmpTarget.childNodes.length-1)
				btnsInnerWidth = orignBtnsInnerWidth;
				
			if (totalBtnsWidth >= btnsInnerWidth)
			{
				if (!this._showingMore)
					this.showMore();
				
				if (!extraBtnReached)
				{
					this._extraBtns = n;
					extraBtnReached = true;
				}
				
				Scriptor.className.remove(theBtn, "jsToolbarLast");
				theBtn.style.visibility = "hidden";
				
				if (n > 0)
					Scriptor.className.add(this.buttons[n-1].target, "jsToolbarLast");
			}
			else
			{
				if (n < this.buttons.length-1)
					Scriptor.className.remove(theBtn, "jsToolbarLast");
				else
					Scriptor.className.add(theBtn, "jsToolbarLast");
					
				theBtn.style.visibility = "visible";
			}
		}
		
		if (totalBtnsWidth < btnsInnerWidth)
		{
			if (this._showingMore)
				this.hideMore();
				
			this._extraBtns = this.buttons.length;
		}
	};
	
	this.destroyImplementation = function() {
		this._extraButtons.parentNode.removeChild(this._extraButtons);
	};
	
	this.create();
	Scriptor.className.add(this.target, "jsToolbar");
	
	// add the "more" dropdown button
	this._moreSpan = document.createElement('span');
	this._moreSpan.id = this.divId + '_more';
	this._moreSpan.className = 'jsToolbarDropdown jsToolbarDropdownHidden';
	this.target.appendChild(this._moreSpan);
	this._moreSpan.innerHTML = ' ';
	
	/* if we created the component and DOMAddedImplementation was called instantly,
	  we need to attach the moreSpan event here, because it was not
	  present before
	*/
	if (this.inDOM)
		this._registeredEvents.push(Scriptor.event.attach(this._moreSpan, 'onclick', Scriptor.bindAsEventListener(this.onDropdownClick, this)));
		
	this._extraButtons = document.createElement('div');
	this._extraButtons.id = this.divId + "_extraBtns";
	this._extraButtons.className = 'jsComponent jsContextMenu jsToolbarExtraPanel jsToolbarExtraPanelHidden';
	Scriptor.body().appendChild(this._extraButtons);
	
};

/*
* Scriptor.Toolbar.addButton
*
* Adds a toolbar button at the specified index
* 
* Parameters:
*   opts: button options
*   ndx: optional number defining the index to insert the button at
*   
* Options:
*   label: the label of the button
*   className: a value to be set as classname of the button
*   onclick: callback function for click on button
*   onContentAdded: alternatively, call this function set contents to provide custom HTML
*     for the button. All other options will be ignored. Function first parameter
*     is the empty htmlElement of the button wrapper to be filled.
*/
Scriptor.Toolbar.prototype.addButton = function(opts, ndx) {
	var theBtn = {
		label : '',
		id : this.getNextBtnId(),
		className : '',
		onclick : null,
		onContentAdded : null,
		target: null
	};
	Scriptor.mixin(theBtn, opts);
	
	theBtn.target = document.createElement('span');
	theBtn.target.id = this.divId + '_btn_' + theBtn.id;
	
	var template = ''	
	if (typeof(theBtn.onContentAdded) != 'function')
	{
		template = '<a' + (theBtn.className ? ' class="' + theBtn.className + '" ' : '') + ' href="'+Scriptor.getInactiveLocation()+'">' + theBtn.label + '</a>';
	}
	
	if (ndx === undefined)
		ndx = this.buttons.length;
		
	if (!isNaN(Number(ndx)) && ndx >= 0 && ndx <= this.buttons.length)
	{	
		if (this._showingExtraButtons)
			this.hideDropDown();
	
		if (ndx == 0)	// adding the first button
		{
			if (this.buttons.length)
				Scriptor.className.remove(this.buttons[0].target, "jsToolbarFirst");
			
			theBtn.target.className = "jsToolbarFirst";
		}
		
		if (ndx == this.buttons.length)	// adding the last button
		{
			if (this.buttons.length)
				Scriptor.className.remove(this.buttons[this.buttons.length-1].target, "jsToolbarLast");
			
			Scriptor.className.add(theBtn.target, "jsToolbarLast");
		}
		
		if (ndx == this.buttons.length)
		{
			this.buttons.push(theBtn);
			this.cmpTarget.appendChild(theBtn.target);
		}
		else
		{
			if (ndx == 0)
			
			this.buttons.splice(ndx, 0, theBtn);
			this.cmpTarget.insertBefore(theBtn.target, this.cmpTarget.childNodes[ndx]);
		}
		
		theBtn.target.innerHTML = template;
		
		if (this.inDOM)
		{
			this.addClickEvent(this.buttons[ndx]);
			this.resize();
		}
	}
};

/*
* Scriptor.Toolbar.removeButton
*
* Internal use only
*/
Scriptor.Toolbar.prototype.addClickEvent = function(btn) {
	if (typeof(btn.onContentAdded) == 'function')
	{
		btn.target.innerHTML = '';
		btn.onContentAdded();
	}
	else
	{
		if (typeof(btn.onclick) == 'function')
			this._registeredEvents.push(Scriptor.event.attach(btn.target.firstChild, 'onclick', btn.onclick));
	}
};

/*
* Toolbar.getNextBtnId()
*   Since every button needs a unique id field, we will assign one automatically if
*   not provided
*/
Scriptor.Toolbar.prototype.getNextBtnId = function() {
	var found = true;
	while (found)
	{
		found = false;
		var btnId = this.nextBtnId++;
		for (var n=0; n < this.buttons.length; n++)
		{
			if (this.buttons[n].id == btnId)
			{
				found = true;
				break;
			}
		}
	}
	
	return btnId;
};

/*
* Scriptor.Toolbar.removeButton
*
* Removes a button specified by its index, id or by providing the
* button object as stored in Scriptor.Toolbar.buttons array
*/
Scriptor.Toolbar.prototype.removeButton = function(identifier) {
	var ndx = null;
	
	// identify tab
	if (typeof(identifier) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(identifier) == 'string')
	{
		for (var n=0; n < this.buttons.length; n++)
		{
			if (this.buttons[n].id == identifier)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (typeof(identifier) == 'object')
	{
		for (var n=0; n < this.buttons.length; n++)
		{
			if (this.buttons[n] === identifier)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		if (this._showingExtraButtons)
			this.hideDropDown();
		
		if (ndx == 0)	//removing the first button
		{
			if (this.buttons.length > 1)
			{
				Scriptor.className.add(this.buttons[1].target, "jsToolbarFirst");
			}
		}
		
		if (ndx == this.buttons.length-1)	//removing the last button
		{
			if (this.buttons.length > 1)
			{
				Scriptor.className.add(this.buttons[this.buttons.length-2].target, "jsToolbarLast");
			}
		}
		
		for (var n=0; n < this._registeredEvents.length; n++)
		{
			if (this._registeredEvents[n][0].parentNode == this.buttons[ndx].target)
			{
				Scriptor.event.detach(this._registeredEvents[n]);
				this._registeredEvents.splice(n, 1);
				break;
			}
		}
		this.buttons.splice(ndx, 1);
		
		this.cmpTarget.removeChild(this.buttons[ndx].target);
		this.resize();
	}
};

/*
* Scriptor.Toolbar.showMore
*
* Internal use only
*/
Scriptor.Toolbar.prototype.showMore = function() {
	Scriptor.className.remove(this._moreSpan, "jsToolbarDropdownHidden");
	this._showingMore = true;
};

/*
* Scriptor.Toolbar.hideMore
*
* Internal use only
*/
Scriptor.Toolbar.prototype.hideMore = function() {
	Scriptor.className.add(this._moreSpan, "jsToolbarDropdownHidden");
	this._showingMore = false;
	
	if (this._showingExtraButtons)
		this.hideDropDown();
};

/*
* Scriptor.Toolbar.onDropdownClick
*
* Internal use only
*
* TODO: replace with a floating panel (to be defined)
*/
Scriptor.Toolbar.prototype.onDropdownClick = function(e) {
	if (!e) e = window.event;
	
	if (!this._showingExtraButtons)
	{
		// trusting that appendChild effectively removes the DOM element
		// from DOM before appending, keeping its associated events!
		for (var n=this._extraBtns; n < this.buttons.length; n++) {
			this._extraButtons.appendChild(this.buttons[n].target);
			this.buttons[n].target.style.visibility = 'visible';
		}
		
		// calculate x, y
		var x = 0, y = 0;
		
		if (e)
		{
			if (typeof(e.pageX) == 'number') {
				x = e.pageX;
				y = e.pageY;
			}
			else {
				if (typeof(e.clientX) == 'number') {
					x = (e.clientX + document.documentElement.scrollLeft);
					y = (e.clientY + document.documentElement.scrollTop);
				}
				else {
					x = 0;
					y = 0;
				}
			}
		}
		
		if (x + this._extraButtons.offsetWidth > Scriptor.body().offsetWidth)
			x = x-this._extraButtons.offsetWidth;
		if (y + this._extraButtons.offsetHeight > Scriptor.body().offsetHeight)
			y = y-this._extraButtons.offsetHeight;
			
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		
		this._extraButtons.style.top = y + 'px';
		this._extraButtons.style.left = x + 'px';
		
		if (this._checkMenuBind)
			Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
		setTimeout(Scriptor.bind(function() {	
			Scriptor.event.attach(document, 'onclick', this._checkMenuBind = Scriptor.bind(this.checkDropDown, this));
		}, this), 1);
		
		Scriptor.className.remove(this._extraButtons, "jsToolbarExtraPanelHidden");
		this._showingExtraButtons = true;
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* Scriptor.Toolbar.checkDropDown
*
* Internal use only, hides dropDown component on mouse click
*/
Scriptor.Toolbar.prototype.checkDropDown = function(e) {
	if (this._checkMenuBind)
		Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
	// always hide after click?
	this.hideDropDown();
};

/*
* Scriptor.Toolbar.hideDropDown
*
* Internal use only
*
* TODO: replace with a floating panel (to be defined)
*/
Scriptor.Toolbar.prototype.hideDropDown = function() {
	if (this._showingExtraButtons)
	{
		// trusting that appendChild effectively removes the DOM element
		// from DOM before appending, keeping its associated events!
		while (this._extraButtons.childNodes.length) {
			this._extraButtons.childNodes[0].style.visibility = 'hidden';
			this.cmpTarget.appendChild(this._extraButtons.childNodes[0]);
		}
		
		this._showingExtraButtons = false;
	
		Scriptor.className.add(this._extraButtons, "jsToolbarExtraPanelHidden");
	}
};
	return Scriptor;
})(window, document);

// local support for JSON parsing
// JSON implementation for unsupported browsers
if (typeof(JSON) == 'undefined') {
    JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

            return String(value);

        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());