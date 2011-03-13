
// define the Scriptor object
var Scriptor = {
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
	}
};

// internal id generation system
var __nextIdNdx = 0;
var __lastId = 'scriptor_' + __nextIdNdx++;
var __getNextHtmlId = function() {
	while (document.getElementById(__lastId))
		__lastId = 'scriptor_' + __nextIdNdx++;
	
	return __lastId;
};

var browserWindowHeight = 0;
var browserWindowWidth = 0;