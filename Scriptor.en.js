/* Scriptor 3.0b
  
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
		minor : 0,
		instance : "alpha 2",
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
		},
		
		detach : function(htmlElement, evt, funcObj) {
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
		// add a classname if not already added
		add : function(elem, className) {
			if (typeof(className) != 'string')
				return;
			
			if (typeof(elem.className) == 'undefined')
				elem.className = '';
			
			var classes = elem.className.split(' ');
			var found = false;
			
			for (var n=0; n < classes.length; n++)
			{
				if (classes[n] == className)
				{
					found = true;
					break;
				}
			}
			
			if (!found)
				classes.push(className);
				
			var newClassName = classes.join(' ');
			if (newClassName.substr(0, 1) == ' ')
				newClassName = newClassName.substr(1);
				
			elem.className = newClassName;
		},
		
		remove : function(elem, className) {
			if (typeof(className) != 'string')
				return;
			
			if (typeof(elem.className) == 'undefined')
				elem.className = '';
			
			var classes = elem.className.split(' ');
			
			for (var n=0; n < classes.length; n++)
			{
				if (classes[n] == className)
				{
					classes.splice(n, 1);
					n--;
				}
			}
			
			var newClassName = classes.join(' ');
			if (newClassName.substr(0, 1) == ' ')
				newClassName = newClassName.substr(1);
				
			elem.className = newClassName;
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

Scriptor.cookie.init();/* JavaScript Document
*
* calendarView version 1.1.0b MODIFIED!!
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
*  enabled: If true, it will accept clicks. Otherwise table will be non functional for interaction.
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
*  onshow: event handler. Will be executed before anything is rendered
*   by the Show method. Usefull for filtering selectable date ranges before showing. 
*   Also by returning false you can cancel Show()
*  onselect: event handler. Will be executed after a click on a date and before anthing
*   is done to the object. You can cancel date selection by setting e.returnValue to false on that function.
*
*  visible: Should be read only. It is set to true when a successfull Show() has been performed.
*  div: string with the id of the object upon which the calendarView will be rendered or the object itself.
*
*/
calendarView = Scriptor.calendarView = function(div, opts) {
	if ((typeof(div) != 'string' && !Scriptor.isHtmlElement(div)) || div == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	var localOpts = {
		'multiselect' : false,
		'month' : new Date().getMonth(),
		'year' : new Date().getFullYear()
	}
	Scriptor.mixin(localOpts, opts);
	
	this.selectedDates = [];
	this.multiSelect = localOpts.multiselect;
	this.enabled = true;
	this.advanced = false;
	
	this.curMonth = (!isNaN(Number(localOpts.month)) && localOpts.month >= 0 && localOpts.month < 12) ? localOpts.month : new Date().getMonth();
	this.curYear = (!isNaN(Number(localOpts.year)) && localOpts.year > 0) ? localOpts.year : new Date().getFullYear();
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.disabledBefore  = null;
	this.disabledAfter = null;
	this.disabledDays = [false, false, false, false, false, false, false];
	this.disabledDates = [];
	this.markedDates = [];

	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.hookedTo = null;
};

calendarView.prototype = {
	/*
	*  calendarView.Show()
	*   Renders the object inside the object pointed by calendarView.div as its id.
	*   Show() will also call updateDates() so it renders calendarView information too.
	*/
	Show : function() {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
				
		if (!this.divElem)
		{
			this.divElem = document.getElementById(this.div);
		}
		else
		{
			if (!this.divElem.id)
			{
				if (!this.div)
					this.div = __getNextHtmlId();
					
				this.divElem.id = this.div;
			}
		}
		
		if (!this.divElem) {
			Scriptor.error.report('Error: calendarView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'calendarView scriptor';
		target.innerHTML = '';
		
		// Create table header
		var cTemplate = '<div class="calendarViewHeader" id="' + this.div + '_header"></div>';
		
		// Create body
		cTemplate += '<table border="0" cellpadding="0" cellspacing="0" class="calendarViewBody" id="' + this.div + '_body"></table>';
		
		// create advanced dialog
		cTemplate += '<div class="calendarViewAdvanced" style="display: none;" id="'+this.div+'_advanced">';
		var targetDate = new Date();
		if (this.selectedDates.length)
			targetDate = this.selectedDates[0];
		
		// day selector
		cTemplate += '<p><label for="'+this.div+'DaySelector">'+this.lang.day+'</label>';
		cTemplate += '<input type="text" id="'+this.div+'DaySelector" value="'+targetDate.getDate()+'" /></p>';
		
		// month selector
		cTemplate += '<p><label for="'+this.div+'MonthSelector">'+this.lang.month+'</label>';
		cTemplate += '<select id="'+this.div+'MonthSelector">';
		for (var n=0; n < 12; n++) 
			cTemplate += '<option value="'+n+'"' + (targetDate.getMonth() == n ? ' selected="selected"' : '') + '>'+this.lang.longMonths[n]+'</option>';	
		cTemplate += '</select></p>';
		
		// year selector
		cTemplate += '<p><label for="'+this.div+'YearSelector">'+this.lang.year+'</label>';
		cTemplate += '<input type="text" id="'+this.div+'YearSelector" value="'+targetDate.getFullYear()+'" /></p>';
		
		// buttons
		cTemplate += '<p><a class="calendarAccept" id="'+this.div+'_advancedAccept">'+this.lang.accept+'</a>';
		cTemplate += '<a class="calendarCancel" id="'+this.div+'_advancedCancel">'+this.lang.cancel+'</a></p>';
		
		cTemplate += '</div>';
		
		// Create footer
		cTemplate += '<div class="calendarViewFooter" id="' + this.div + '_footer"></div>';
		
		target.innerHTML = cTemplate;
		
		// advanced view event handlers
		Scriptor.event.attach(document.getElementById(this.div+'_advancedAccept'), 'onclick', Scriptor.bind(this.selectAdvanced, this));
		Scriptor.event.attach(document.getElementById(this.div+'_advancedCancel'), 'onclick', Scriptor.bind(this.cancelAdvanced, this));
		
		this.visible = true;
		this.updateDates();
	},
	
	Hide : function()
	{
		var e = Scriptor.event.fire(this, 'onhide');
		if (!e.returnValue)
			return;
		
		if (this.divElem)
			this.divElem.style.display = 'none';
			
		this.visible = false;
	},
	
	/*
	*  calendarView.updateDates()
	*   When [calendarView.visible = true] which is a result of calling calendarView.Show(), 
	*   you can then call calendarView.updateDates() directly to update row information only 
	*   without spending additional resources on the calendarView frame rendering.
	*/
	updateDates : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update data on non visible calendarView object.");
			return;
		}
		
		var targetTable = document.getElementById(this.div+'_body');
		targetTable.style.display = '';
		document.getElementById(this.div+'_advanced').style.display = 'none';
		this.advanced = false;
		
		targetTable.innerHTML = '';		
		
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
			tmpA.setAttribute('href', '#');
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
	},
	
	/*
	* calendarView.__refreshHeader()
	*   Internal function. Refreshes the header area.
	*/
	__refreshHeader : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div+'_header');
		targetDiv.innerHTML = '';
			
		var hTemplate = '<ul><li><a class="calendarViewPrev" title="'+this.lang.prevMonth+'" id="'+this.div+'_prevMonth" href="#"> </a></li>';
		hTemplate += '<li><a class="calendarAdvanced" title="'+this.lang.advanced+'" id="'+this.div+'_viewAdvanced" href="#"> </a></li>';
		hTemplate += '<li><p class="calendarViewMonth">'+this.lang.longMonths[this.curMonth] + ' ' + this.curYear+'</p></li>';
		hTemplate += '<li><a class="calendarViewNext" title="'+this.lang.nextMonth+'" id="'+this.div+'_nextMonth" href="#"> </a></li>';
		
		targetDiv.innerHTML = hTemplate;
		
		Scriptor.event.attach(document.getElementById(this.div+'_prevMonth'), 'onclick', Scriptor.bind(this.goPrevMonth, this));
		Scriptor.event.attach(document.getElementById(this.div+'_viewAdvanced'), 'onclick', Scriptor.bind(this.setAdvanced, this));
		Scriptor.event.attach(document.getElementById(this.div+'_nextMonth'), 'onclick', Scriptor.bind(this.goNextMonth, this));
	},
	
	/*
	* calendarView.__refreshFooter()
	*   Internal function. Refreshes the footer area.
	*/
	__refreshFooter : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div+'_footer');
		targetDiv.innerHTML = '';
		
		var fTemplate = '<p><a class="calendarGoHome" title="'+this.lang.homeDate+'" href="#" id="'+this.div+'_goHome"> </a>';
		
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
		Scriptor.event.attach(document.getElementById(this.div+'_goHome'), 'onclick', Scriptor.bind(this.goHomeDate, this));
	},
	
	/*
	* calendarView.setAdvanced()
	*   Internal function. Goes to advanced mode in which user will select a date using
	*   a form. Usefull to select distanct dates.
	*/
	setAdvanced : function(e) {
		if (!e) e = window.event;
		
		document.getElementById(this.div+'_body').style.display = 'none';
		document.getElementById(this.div+'_advanced').style.display = 'block';
		
		var targetDate = new Date();
		if (this.selectedDates.length)
			targetDate = this.selectedDates[0];
		
		document.getElementById(this.div + 'DaySelector').value = targetDate.getDate();
		document.getElementById(this.div + 'MonthSelector').selectedIndex = targetDate.getMonth();
		document.getElementById(this.div + 'YearSelector').value = targetDate.getFullYear();
		
		this.advanced = true;
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/*
	* calendarView.cancelAdvanced()
	*  This function will return to normal mode, canceling advanced selection in calendar instance
	*/
	cancelAdvanced : function (divId) {
		document.getElementById(this.div+'_body').style.display = '';
		document.getElementById(this.div+'_advanced').style.display = 'none';
		
		this.advanced = false;
	},
	
	/*
	* selectAdvanced()
	*  This function checks and selects the date entered in advanced mode
	*/
	selectAdvanced : function(e) {
		if (!e) e = window.event;
		
		var dayNum = document.getElementById(this.div + 'DaySelector').value;
		var monthNum = document.getElementById(this.div + 'MonthSelector').value;
		var yearNum = document.getElementById(this.div + 'YearSelector').value;
		
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
	},
	
	/*
	* selectDate()
	*  This function executes when clicking on a calendarView date and selects that date
	*/
	selectDate : function(e, date) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
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
	},
	
	/*
	* calendarView.isDisabledDate(date)
	*   This function will return true if the provided date object is within the range of
	*   disabled dates configured in the calendarView.
	*/
	isDisabledDate : function(date) {
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
	},
	
	isEqual : function (date1, date2) {
		if (date1.getFullYear() == date2.getFullYear() &&
				date1.getMonth() == date2.getMonth() &&
				date1.getDate() == date2.getDate()) {
			return true;
		}
		else {
			return false;
		}
	},
	
	/*
	* goPrevMonth()
	*  To go to a previous month
	*/
	goPrevMonth : function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		this.curMonth--;
		if (this.curMonth < 0) {
			this.curMonth = 11;
			this.curYear--;
		}
		
		this.updateDates();
		
		Scriptor.event.cancel(e, true);
		return false;
	},
	
	/*
	* goNextMonth()
	*  To go to the next month
	*/
	goNextMonth : function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
			
		this.curMonth++;
		if (this.curMonth > 11) {
			this.curMonth = 0;
			this.curYear++;
		}
		
		this.updateDates();
		
		Scriptor.event.cancel(e, true);
		return false;
	},
	
	/*
	* goHomeDate()
	*  Will make selection visible, or will show current date
	*/
	goHomeDate : function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
			
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
	},

	
	/*
	* Hooks this calendarView instance to a text input to select a date
	*/
	hook : function(elementId) {
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
			this.onselect = CaViE.assignToHooked;
		}
	},
	
	/*
	* shows a hooked calendar to input text
	*/
	showHooked : function(e) {
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
			
		Scriptor.event.attach(document, 'onclick', this._hideHooked = Scriptor.bind(this.hideHooked, this));
		
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
		this.divElem.style.left = x + 'px';
		this.divElem.style.top = y + 'px';
		
	},
	
	/*
	* to hide the showing floating calendars
	*/
	hideHooked : function(e) {
		if (!e) e = window.event;
		
		this.Hide();
		if (this._hideHookedBind)
			Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
		
	},

	/*
	* Assign selected value in a calendarView to hooked input
	*  Formatting depends on lang.isFrenchDateFormat
	*/
	assignToHooked : function() {
		
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
	},

	/*
	* gets date from str. TODO: formatting!
	*/
	getDateFromStr : function(str) {
		var dateCmps = str.split('/');
		
		// dd/mm/yyyy
		var ret;
		if (!isNaN(Number(dateCmps[0])) && !isNaN(Number(dateCmps[1])) && !isNaN(Number(dateCmps[2]))) {
			if (dateCmps[1] > 0 && dateCmps[1] < 13 && dateCmps[0] > 0 && dateCmps[0] < 32 && dateCmps[2] > 0) {
				
				ret = new Date(dateCmps[2], dateCmps[1]-1, dateCmps[0], 0, 0, 0);
			}
			else {
				ret = new Date();
			}
		}
		else {
			ret = new Date();
		}
		
		return ret;
	}
};

// JavaScript Document

calendarView.prototype.lang = {
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
*  galleryView version 2.0b
*
*  Will display a selectable group of thumbnails with information about the image itself.
*  Compatible with scriptor dynamic javascript+css script loader
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
* gv_ImagePbjects representing images.
*
* Options are:
*  div: a string with the id attribute of a unique div element to be the container of
*    the component or the actual HTML element
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
galleryView = Scriptor.galleryView = function(div, opts) /*sqlService, thumbWidth, thumbHeight)*/ {
	var localOpts = {
		thumbWidth : 154,
		thumbHeight : 184,
		showNames : true,
		fixedThumbSize : true
	};
	Scriptor.mixin(localOpts, opts);
	
	this.selectedImage = -1;
	this.enabled = true;
	this.showNames = localOpts.showNames;
	this.fixedThumbSize = localOpts.fixedThumbSize;
	this.thumbWidth = localOpts.thumbWidth;
	this.thumbHeight = localOpts.thumbHeight;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.visible = false;
	
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.images = [];
	
};

galleryView.prototype = {
	/*
	* galleryView.addImage
	*
	* Adds an image to the list, options are:
	* 	thumbnail: the path to the image thumbnail
	* 	path: the path to the full image (optional)
	* 	name: the name of the image (optional)
	* 	insertIndex: the index to insert the image in the list (optional)
	*/
	addImage : function(opts)
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
		
		if (this.visible)
			this.updateImages();
	},

	deleteImage : function(identifier)
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
		
		if (this.visible)
			this.updateImages();
	},

	Refresh : function() {
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		if (this.visible)
			this.updateImages();
	},

	Show : function(withRefresh)
	{
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
				
		if (this.visible) 	// we're redrawing
			this._oldScrollTop = document.getElementById(this.div).scrollTop;
		
		if (!this.divElem)
		{
			this.divElem = document.getElementById(this.div);
		}
		else
		{
			if (!this.divElem.id)
			{
				if (!this.div)
					this.div = __getNextHtmlId();
					
				this.divElem.id = this.div;
			}
		}
		
		if (!this.divElem) {
			Scriptor.error.report('Error: galleryView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'galleryView scriptor';
		target.innerHTML = '';
		
		this.visible = true;
		if (withRefresh) 
			this.Refresh();
		
	},

	Hide : function()
	{
		var e = Scriptor.event.fire(this, 'onhide');
		if (!e.returnValue)
			return;
		
		if (this.divElem)
			this.divElem.style.display = 'none';
			
		this.visible = false;
	},
	
	/*
	* galleryView.setLoading(val)
	*   If val is true, show loading spinner, else show the actual rows,
	*   usefull for assync updates
	*/
	setLoading : function(val) {
		var body = document.getElementById(this.div);
		
		body.className = val ? 'galleryView scriptor galleryViewLoading' : 'galleryView scriptor';		
	},
	
	/*
	* galleryView.setMessage(msg)
	*	Set a message (usefull for error messages) and hide all info in a galleryView
	* 	If msg is set to false or not present, it will restore galleryView to normal
	*/
	setMessage : function(msg) {
		// false, null, or msg not present resets dataView to normal
		if (msg === false || msg === null || typeof(msg) != "string")
		{
			if (document.getElementById(this.div + '_message'))
				document.getElementById(this.div + '_message').parentNode.removeChild(document.getElementById(this.div + '_message'));
				
			this.divElem.className = 'galleryView scriptor';
		}
		else	// if string passed, we show a message
		{
			this.divElem.className = 'galleryView scriptor galleryViewMessage';
			var msgDiv;
			if (!document.getElementById(this.div + '_message'))
			{
				msgDiv = document.createElement('p');
				msgDiv.id = this.div + '_message';
				document.getElementById(this.div).appendChild(msgDiv);
			}
			else
			{
				msgDiv = document.getElementById(this.div + '_message');
			}
			msgDiv.innerHTML = msg;
		}
	},
	
	updateImages : function()
	{
		if (!this.visible) {
			Scriptor.error.report( "Can't update rows on non visible galleryView object.");
			return;
		}
			
		var target = document.getElementById(this.div);
		if (!this._oldScrollTop)
			this._oldScrollTop = target.parentNode.scrollTop;
			
		target.innerHTML = '';
			
		var iTemplate = '';
		
		for (var n=0; n < this.images.length; n++) {
			iTemplate += '<div id="' + this.div + '_envelop_' + n + '" ';
			if (this.fixedThumbSize) 
				iTemplate += 'style="width: ' + this.thumbWidth + 'px; height: ' + this.thumbHeight + 'px; overflow: hidden;"';
			
			if (this.selectedImage == n)
				iTemplate += 'class="gvSelectedImage" ';
			iTemplate += '>';
			
			iTemplate += '<img id="' + this.div + '_img_' + n + '" src="' + this.images[n].thumbnail + '" />';
			
			if (this.showNames && this.images[n].name) 
				iTemplate += '<p>' + this.images[n].name + '</p>'
			
			iTemplate += '</div>';
		}
		
		target.innerHTML = iTemplate;
		for (var n=0; n < this.images.length; n++)
		{
			Scriptor.event.attach(document.getElementById(this.div + '_img_' + n), 'onclick', Scriptor.bind(this._selectImage, this, n));
		}
		
		if (this.selectedImage >= this.images.length) 
			this.selectedImage = -1;
		
	},
	
	_selectImage : function(e, imgNdx) {
		if (!e) e = window.event;
		
		if (!this.visible || !this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		e.selectedImage = this.selectedImage;	
		e.selecting = imgNdx;
		e = Scriptor.event.fire(this, 'onselect', e);
		
		if (e.returnValue == false)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		var imgs = this.divElem.getElementsByTagName('img');
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
	}
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
galleryViewConnector = Scriptor.galleryViewConnector = function(opts) {
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

galleryViewConnector.prototype = {
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
			var oldVisible = this.galleryView.visible;
			this.galleryView.visible = false;
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
			
			if (oldVisible)
			{
				this.galleryView.visible = oldVisible;
				this.galleryView.updateImages();
			}
		}
		else	// json
		{
			// TODO: Add/Remove/Update images instead of replacing the whole data structure
			//   upgrade addImage, deleteImage to avoid using updateImages
			// fake visible = false so we call updateImages only once
			var oldVisible = this.galleryView.visible;
			this.galleryView.visible = false;
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
			
			if (oldVisible)
			{
				this.galleryView.visible = oldVisible;
				this.galleryView.updateImages();
			}
		}
	},
	
	_onError : function(status)
	{
		this.galleryView.setLoading(false);
		this.galleryView.setMessage('Error: Unable to load galleryView object (HTTP status: ' + status + ')');
	}
};// JavaScript Document
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
httpRequest = Scriptor.httpRequest = function(opts) {
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

httpRequest.prototype = {
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

httpRequest.prototype.lang = {
	errors : { createRequestError : 'Error loading Ajax object!',
		requestHandleError : 'There has been an error sending an Ajax object.\nPlease, try again later.' }
};// JavaScript Document
/*
*
*  treeView Version 3.0b
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
	// TODO: Remove this function and set it on treeNodeConnector, XML
	/*getChildNodes : function(parentNode, tv)
	{
		for (var n=0; n<parentNode.childNodes.length; n++) {
			if (parentNode.childNodes[n].nodeName == 'category') {
				var ndx = this.childNodes.length;

				nodeId = parentNode.childNodes[n].getAttribute('id');
				nodeParentId = parentNode.childNodes[n].getAttribute('parentid');
				nodeName = parentNode.childNodes[n].getAttribute('name');

				this.childNodes[ndx] = new treeNode(nodeId, nodeParentId, nodeName, parentNode, tv);
				if (parentNode.childNodes[n].childNodes.length > 0) {
					this.childNodes[ndx].getChildNodes( this.parentNode.childNodes[n], tv );
				}
			}
		}
	},*/
	
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
		var parentNode = document.getElementById(this.treeView.div + '_' + this.id + '_branch');
		
		for (var i=0; i < this.childNodes.length; i++) { 
			var node = document.createElement('li');
			node.id = this.treeView.div + '_' + this.childNodes[i].id;
			parentNode.appendChild(node);
			
			var nodeTemplate = '';
			var hasChildren = this.childNodes[i].childNodes.length;
			
			if (hasChildren) {
				// Create link to expand node
				nodeTemplate += '<a id="'+this.treeView.div + '_' + this.childNodes[i].id + '_expandable" href="#" class="';
				nodeTemplate += (this.childNodes[i].expanded ? 'treeViewCollapsableNode' : 'treeViewExpandableNode') + '"></a>';
			}
			
			// Create link to select node
			nodeTemplate += '<a id="'+this.treeView.div+'_'+this.childNodes[i].id+'_selectNode" ';
			if (!hasChildren)
				nodeTemplate += 'class="treeViewSingleNode" ';
			nodeTemplate += 'href="#">'+this.childNodes[i].Name+'</a>';
			
			if (hasChildren)
			{
				// Create subcategory list
				nodeTemplate += '<ul id="' + this.treeView.div + '_' + this.childNodes[i].id + '_branch"></ul>';
			}
			
			node.innerHTML = nodeTemplate;
			
			if (hasChildren)	
				Scriptor.event.attach(document.getElementById(this.treeView.div + '_' + this.childNodes[i].id + '_expandable'),
									  'click',
									  Scriptor.bind(this.treeView._expandNode, this.treeView, this.childNodes[i].id));
				
			Scriptor.event.attach(document.getElementById(this.treeView.div + '_' + this.childNodes[i].id + '_selectNode'),
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
treeView = Scriptor.treeView = function (div) {
	this.selectedNode = null;
	this.enabled = true;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onselect');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	
	this.visible = false;
	
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this });
	this.nextNodeId = 1;
};

treeView.prototype = {
	/*
	*  getNextInternalId
	*
	*  Interface: return a unique id for a treeNode
	*/
	getNextNodeId : function() {
		var found = true;
		while (found)
		{
			if (this.masterNode.searchNode(this.nextNodeId) === null)
				found = false;
			else
				this.nextNodeId++;
		}
		
		return this.nextNodeId;
	},
	
	searchNode : function(id) {
		return this.masterNode.searchNode(id);
	},
	
	/*
	* treeView.Refresh();
	*  This function will call updateNodes to refresh treeView nodes if visible
	*  You can use a treeViewConnector object to connect an XML or JSON service to treeView
	*  and this will automatically retrieve information assync every time
	*  you call Refresh() method.
	*/
	Refresh : function() {
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		if (this.visible)
			this.updateNodes();
	},
	
	Show : function(withRefresh) {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
		if (!this.divElem)
		{
			this.divElem = document.getElementById(this.div);
		}
		else
		{
			if (!this.divElem.id)
			{
				if (!this.div)
					this.div = __getNextHtmlId();
					
				this.divElem.id = this.div;
			}
		}
		
		if (!this.divElem) {
			Scriptor.error.report('Error: treeView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.style.display = '';
		target.className = 'treeView scriptor';
		target.innerHTML = '<ul id="'+this.div+'_0_branch" class="treeViewContainer"></ul>';
		
		this.visible = true;
		if (withRefresh) 
			this.Refresh();
	},
	
	Hide : function()
	{
		var e = Scriptor.event.fire(this, 'onhide');
		if (!e.returnValue)
			return;
		
		if (this.divElem)
			this.divElem.style.display = 'none';
			
		this.visible = false;
	},
	
	updateNodes : function()
	{
		if (this.visible)
		{
			document.getElementById(this.div+"_0_branch").innerHTML = '';
			this.masterNode.updateChildrenNodes();
		}
	},
	
	setLoading : function(val)
	{
		this.divElem.className = "treeView" + (val ? " treeViewLoading" : "");
	},
	
	/*
	* treeView.setMessage(msg)
	*	Set a message (usefull for error messages) and hide all info in a treeView
	* 	If msg is set to false or not present, it will restore treeView to normal
	*/
	setMessage : function(msg) {
		// false, null, or msg not present resets dataView to normal
		if (msg === false || msg === null || typeof(msg) != "string")
		{
			if (document.getElementById(this.div + '_message'))
				document.getElementById(this.div + '_message').parentNode.removeChild(document.getElementById(this.div + '_message'));
				
			document.getElementById(this.div + '_0_branch').style.display = '';
		}
		else	// if string passed, we show a message
		{
			document.getElementById(this.div + '_0_branch').style.display = 'none';
			var msgDiv;
			if (!document.getElementById(this.div + '_message'))
			{
				msgDiv = document.createElement('div');
				msgDiv.id = this.div + '_message';
				msgDiv.className = 'treeViewMessageDiv';
				document.getElementById(this.div).appendChild(msgDiv);
			}
			else
			{
				msgDiv = document.getElementById(this.div + '_message');
			}
			msgDiv.innerHTML = msg;
		}
	},
	
	_expandNode : function(e, nodeId) {
		if (!e) e = window.event;
		
		var node = this.searchNode(nodeId);
		if (node.expanded)
		{
			node.expanded = false;
			document.getElementById(this.div+'_'+nodeId+'_branch').style.display = 'none';
		}
		else
		{
			node.expanded = true;
			document.getElementById(this.div+'_'+nodeId+'_branch').style.display = 'block';
		}
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	_selectNode : function(e, nodeNdx)
	{
		if (!e) e = window.event;
		
		if (this.selectedNode !== null) {
			var selNode = this.searchNode(this.selectedNode);
			
			if (selNode.childNodes.length)
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = '';
			else
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = 'treeViewSingleNode';
		}
		
		if (this.selectedNode != nodeNdx)
		{
			var selNode = this.searchNode(nodeNdx);
			if (selNode.childNodes.length) 
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = 'treeViewSelectedNode';
			else
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = 'treeViewSingleNode treeViewSelectedNode';
		}
				
		this.selectedNode = (this.selectedNode == nodeNdx) ? null : nodeNdx;
		
		Scriptor.event.cancel(e, true);
		return false;
	},
	
	/*
	* treeView.addNode
	* 	Adds a node with opts properties under parent id, optionally pass ndx to
	* 	insert it between 2 children
	*
	*  ops:
	*  	id : node Id, optional, MUST BE UNIQUE and not 0
	*  	Name : Node label, must be string
	*/
	addNode : function(opts, parent, ndx) {
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
				
			if (this.visible)
				this.updateNodes();
		}
	}
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
treeViewConnector = Scriptor.treeViewConnector = function(opts) {
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

treeViewConnector.prototype = {
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
			var oldVisible = this.treeView.visible;
			this.treeView.visible = false;
			// TODO: implement treeView.clear()
			delete this.treeView.masterNode;
			this.treeView.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this.treeView });
			this.treeView.nextNodeId = 1;
			
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
			
			if (oldVisible)
			{
				this.treeView.visible = oldVisible;
				this.treeView.updateNodes();
			}
		}
		else	// json
		{
			// TODO: Add/Remove/Update rows instead of replacing the whole data structure
			//   upgrade addRow, deleteRow to avoid using updateRows
			// fake visible = false so we call updateRows only once
			var oldVisible = this.treeView.visible;
			this.treeView.visible = false;
			// TODO: implement treeView.clear()
			delete this.treeView.masterNode;
			this.treeView.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this.treeView });
			this.treeView.nextNodeId = 1;
			
			if (data.success)
			{
				if (data.nodes && data.nodes.length)
					this._addNodesFromJson(data.nodes, 0);
					
			}
			else
			{
				this.treeView.setMessage(data.errormessage);
			}
			
			if (oldVisible)
			{
				this.treeView.visible = oldVisible;
				this.treeView.updateNodes();
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
					this.zIndexCache = this.target.style.zIndex ? Number(this.target.style.zIndex) : 1;
					this.target.style.zIndex = this.zIndexCache +1;
					
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
					this.target.style.zIndex = this.zIndexCache;
					
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
					
					this.target.className = this.className ? 'jsComponent jsComponentHidden ' + this.className : 'jsComponent jsComponentHidden';
					
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
						
						if (ref.target.parentNode)
							ref.target.parentNode.removeChild(ref.target);
							
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
		for (var n=0; n < this._registry.length; n++)
		{
			if (!this._registry[n].cmp.parent)
				this._registry[n].cmp.resize();
		}
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
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
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
			var cmp = Scriptor.ComponentRegistry._registry[n];
			if (cmp.CMP_SIGNATURE == "Scriptor.ui.ContextMenu" && cmp.visible)
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
					x = (e.clientX + document.documentElement.scrollLeft) - this.Width;
					y = (e.clientY + document.documentElement.scrollTop);
				}
				else {
					x = 0;
					y = 0;
				}
			}
		}
		
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
	}
};

Scriptor.ContextMenu.prototype.updateSize = function()
{
		
	/*for (var n=0; n < this.items.length; n++)
	{
		var item = this.items[n];
		if (item.label == 'sep')
		{
			cTemplate += '<li class="contextMenuSep"></li>';
		}
		else
		{
			cTemplate += '<li' + (n == this._checkedItemNdx ? ' class="OptionChecked"' : '') + '><a href="#" id="'+this.divId+'_itm_' + n + '"';
			if (item['class'])
				cTemplate += ' class="' + item['class'] + '"';
			cTemplate += '>' + item.label + '</a></li>';
		}
	}*/
	
	var ubox = Scriptor.element.getOuterBox(this.ul);
	var ibox = this.__getInnerBox();
	
	this.width = this.ul.offsetWidth + ubox.left + ubox.right + ibox.left + ibox.right;
	this.height = this.ul.offsetHeight + ubox.top + ubox.bottom + ibox.top + ibox.bottom;
	this.__updatePosition();
	
	/*for (var n=0; n < this.items.length; n++)
	{
		if (this.items[n].label != 'sep' && typeof(this.items[n].onclick) == 'function')
		{
			Scriptor.event.attach(document.getElementById(this.divId+'_itm_' + n), 'onclick', this.items[n].onclick);
		}
	}*/
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
				
			cTemplate += '<a href="#" id="'+this.divId+'_itm_' + ndx + '"';
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
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
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
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
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
	
	this.create();
	Scriptor.className.add(this.target, "jsTabContainer");
	
	// component template
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
	
	this._tabsContextMenu = new Scriptor.ContextMenu();
	
	this._canHaveChildren = false;
	this._tabs = [];
	this._selectedTabId = null;
	
	// redefine component implementation
	this.resizeImplementation = function() {
		var tabsInnerWidth = this._tabList.cmpTarget.offsetWidth;
		var orignTabsInnerWidth = tabsInnerWidth;
		
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

};

Scriptor.TabContainer.prototype.addTab = function(opts, panel, ndx) {
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
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
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
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
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
	this.Width = isNaN(Number(localOpts.Width)) ? 80 : Number(localOpts.Width);
	if (this.Width < (dataViewStyle.sepWidth + dataViewStyle.cellHorizontalPadding))
		this.Width = dataViewStyle.sepWidth + dataViewStyle.cellHorizontalPadding;
		
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
* TODO: You can define your custom dataTypes here and they will be automatically
* implemented to the object as long as they have toString method and are comparable.
*/
var dataTypes = {
	'num' : Number,
	'alpha' : String,
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
*  enabled: If true, it will accept clicks. Otherwise table will be non functional for interaction.
*  
*  visible: Should be read only. It is set to true when a successfull Show() has been performed.
*  div: string with the id of the object upon which the dataView will be rendered.
*
*  orderBy: should be read only. It holds information of the Javascript column Name of the
*   active ordered column. It passes it to the SQL service for multipage dataViews or for
*   refreshing purposes
*  orderWay: should be read only. It holds information of the order way to be passed to the
*   sql service on multipage dataviews or when refreshing.
*
*  Width: The width of the object in pixels. Cannot be less than total width of the columns
*   plus 20 pixels
*  Height: The height of the object in pixels. Cannot be less than header and footer height
*   plus 20 pixels
*  style: this is the style object which repeats some of the measures found on the external .css
*   so dataView can calculate some widths and heights. Change this object if you change the
*   stylesheet.
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
		columns : [] }
		
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
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
	this.create();
	Scriptor.className.add(this.target, "jsDataView");
	
	// component template 
	this.renderTemplate();
	this.canHaveChildren = false;
	
	// add predefined columns
	for (var n=0; n < localOpts.columns.length; n++)
	{
		this.addColumn(this.createColumn(localOpts.columns[n]));
	}
	// end add
	
	this.optionsMenu = new Scriptor.ContextMenu();
	
	this.resizeImplementation = function() {
		this._checkCache();
		
		if (this._cached)
		{
			// TODO: real resizing
			this._cached.outer_body.style.height = (this.height - 40) + 'px';
		}
	};
};

/*
*
* Call only once on creation!
* 
*/
Scriptor.DataView.prototype.renderTemplate = function() {
	var dvTemplate = '';
	
	// Create table paginating header
	if (this.paginating) {
		dvTemplate += '<div class="dataViewPaginationHeader"><ul><li>';
		dvTemplate += '<label class="dataViewPaginationPages">' + this.lang.pageStart + (this.curPage + 1) +
							this.lang.pageMiddle + '<span id="' + this.divId + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
		dvTemplate += '</label></li><li>';
		dvTemplate += '<a href="#" class="dataViewPrevBtn" id="' + this.divId + '_goToPagePrev"> </a>';
		dvTemplate += '<a href="#" class="dataViewNextBtn" id="' + this.divId + '_goToPageNext"> </a>';		
		dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.divId + '_pageInput">' + this.lang.pageEnd + '</label>';
		dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.divId + '_pageInput" />';
		dvTemplate += '<input type="button" value="' + this.lang.pageGo + '" class="dataViewPageButton" id="' + this.divId + '_pageInputBtn" />';
		dvTemplate += '</li></ul></div>';
	}
	
	// Create table header
	dvTemplate += '<div class="dataViewHeader" id="'+this.divId+'_columnsHeader">';
	dvTemplate += '<ul style="height: ' + this.style.headerHeight + 'px;" id="'+this.divId+'_columnsUl">';
	
	if (this.multiselect) {
		dvTemplate += '<li class="dataViewCheckBoxHeader">';
		dvTemplate += '<input type="checkbox" id="' + this.divId + '_selectAll" class="dataViewCheckBox" /></li>';
	}
	
	// TODO: add/remove columns dynamically
	/*for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].show) {
			
			var colWidth = 0;
			if ((this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth) > 0) 			
				colWidth = (this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth);
			
			dvTemplate += '<li style="width: ' + colWidth + 'px;">';
			
			var aWidth = 0;
			if ((this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
				aWidth = (this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth);
			
			var aClass = '';
			if (this.orderBy == this.columns[n].Name) {
				if (this.orderWay == 'ASC')
					aClass = 'dataViewSortAsc';
				else
					aClass = 'dataViewSortDesc';
			}
			
			dvTemplate += '<a id="'+ this.div + '_columnHeader_'+n+'" style="width: ' + aWidth + 'px;" href="#"' + (aClass ? ' class="' + aClass + '"' : '') + '>';
			dvTemplate += this.columns[n].displayName + '</a></li>';
			
			dvTemplate += '<li id="' + this.div + '_sep' + n + '" style="width: ' + this.style.sepWidth + 'px;" class="dataViewFieldSep"></li>';
		}
	}*/
	
	// add field list menu
	dvTemplate += '<li id="' + this.div + '_optionsMenuBtn" class="dataViewHeaderMenu">';
	dvTemplate += '<a href="#"> </a></li>';
	
	dvTemplate += '</ul></div>';
	
	// Create body
	var bodyHeight = 0;
	if (this.paginating) 
		bodyHeight = (this.height - 40);
	else
		bodyHeight = (this.height - 40);
		
	dvTemplate += '<div id="'+this.divId+'_outerBody" class="dataViewOuterBody">';
	dvTemplate += '<div class="dataViewBody" id="'+this.divId+'_body"></div>';
	dvTemplate += '</div>';
	
	// Create footer
	dvTemplate += '<div id="' + this.divId + '_footer" class="dataViewFooter"></div>';
	
	this.cmpTarget.innerHTML = dvTemplate;
	
	this._checkCache();
	
	//assign some events
	/*if (this.multiselect) 
		Scriptor.event.attach(document.getElementById(this.div + '_selectAll'), 'click', Scriptor.bindAsEventListener(this.__selectAll, this));
	
	if (this.paginating) {
		Scriptor.event.attach(document.getElementById(this.div + '_goToPagePrev'), 'click', Scriptor.bindAsEventListener(this.__goToPagePrev, this));
		Scriptor.event.attach(document.getElementById(this.div + '_goToPageNext'), 'click', Scriptor.bindAsEventListener(this.__goToPageNext, this));
		Scriptor.event.attach(document.getElementById(this.div + '_pageInput'), 'keypress', Scriptor.bindAsEventListener(this.__checkGoToPage, this));
		Scriptor.event.attach(document.getElementById(this.div + '_pageInputBtn'), 'click', Scriptor.bindAsEventListener(this.__goToPage, this));
	}
	
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].show) {
			Scriptor.event.attach(document.getElementById(this.div+'_columnHeader_'+n), 'click', Scriptor.bindAsEventListener(this.__setOrder, this, n));
			Scriptor.event.attach(document.getElementById(this.div + '_sep' + n), 'mousedown', Scriptor.bindAsEventListener(this.activateResizing, this, n));
		}
	}
	
	Scriptor.event.attach(document.getElementById(this.div + '_optionsMenuBtn'), 'click', Scriptor.bindAsEventListener(this.showOptionsMenu, this));*/
	
};

Scriptor.DataView.prototype._checkCache = function() {
	if (!this._cached && document.getElementById(this.divId+'_columnsHeader'))
	{
		// cache elements
		this._cached = {
			header : document.getElementById(this.divId+'_columnsHeader'),
			outer_body : document.getElementById(this.divId+'_outerBody'),
			body : document.getElementById(this.divId+'_body'),
			footer : document.getElementById(this.divId+'_footer')
		};
	}
};// JavaScript Document
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