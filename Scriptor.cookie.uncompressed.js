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
// Basic cookie handling system
Scriptor.cookie = {
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
	};

Scriptor.cookie.init();

	return Scriptor;
})(document);

if (!window.Scriptor)
    window.Scriptor = {};

Scriptor.mixin(window.Scriptor, window.__tmpScriptor);
delete window.__tmpScriptor;
