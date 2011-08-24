
// define the Scriptor object
var Scriptor = {
	version : {
		major : 2,
		minor : 0,
		instance : "alpha 6",
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
				var st = window.getComputedStyle(el);
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
		var body = document.getElementsByTagName('body')[0];
		var head = document.getElementsByTagName('head')[0];
		if (o === body || o === head)
			return true;
		if (o == document || o === window)
			return false;
		if (!o)
			return false;
		
		if (typeof(o.cloneNode) != 'function')
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

Scriptor.cookie.init();