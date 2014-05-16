/* Scriptor 2.3b1
  
  A tiny Javascript component library plus a few usefull functions
  
  Published under the Creative Commons License
  http://creativecommons.org/licenses/by/3.0/
  
  by Matias Jose
  http://www.matiasjose.com
  
  http://github.com/shadowc/scriptor
*/

window.__tmpScriptor = (function(document, undefined) {
	
// define the Scriptor object
var Scriptor = {
	version : {
		major : 2,
		minor : 3,
		instance : "beta 1",
		toString : function() {
			return this.major + "." + this.minor + " " + this.instance;
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
	
	body : function() {
		if (!_body)
		{
			_body = document.getElementsByTagName('body')[0];
		}
		
		return _body;
	}
};

var _body = null;
// tiny event system 

Scriptor.event = {
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
		
		attach : function(htmlElement, evt, funcObj, context) {
			if (Scriptor.isHtmlElement(htmlElement) || htmlElement === document || htmlElement === window)
			{
				if (context)
					funcObj = Scriptor.bindAsEventListener(funcObj, context);

				if (evt.substr(0,2) == 'on')	// strip the 'on' part
					evt = evt.substr(2);
				
				if (htmlElement.addEventListener) {
					if (context)
						htmlElement.addEventListener(evt, funcObj, false);
					else
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
					htmlElement._customEventStacks[evt].stack.push({ callback: funcObj, context: context });
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
						if (htmlElement._customEventStacks[evt].stack[n].callback == funcObj) {
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
			{
				var context = obj._customEventStacks[evt].stack[n].context || obj._customEventStacks[evt].context;
				obj._customEventStacks[evt].stack[n].callback.apply(context, args);
			}
			
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
	};

	return Scriptor;
})(document);

if (!window.Scriptor)
    window.Scriptor = {};

__tmpScriptor.mixin(window.Scriptor, window.__tmpScriptor);
delete window.__tmpScriptor;
