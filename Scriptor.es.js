/* Scriptor 3.0b
  
  A tiny Javascript component library plus a few usefull functions
  
  This is open source and I don't care about licenses
  
  by Matias Jose
  http://www.matiasjose.com
  
  http://github.com/shadowc/scriptor
*/

window.Scriptor = (function(window, document, undefined) {
	

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
var browserWindowWidth = 0;/* JavaScript Document
*
* Context Menu version 1.0b
*
* Global context menu system for the Scriptor framework
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor framework
*/

// A private stack of context menu instances, used
// to hide any instance that is visible on activation of
// another one.
var context_menus =
{
	stack : [],
	
	// to hide the active context menu
	hide_actives : function()
	{
		for (var n=0; n < this.stack.length; n++)
			if (this.stack[n].visible)
				this.stack[n].Hide();
	}
};

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
contextMenu = Scriptor.contextMenu = function(div, opts)
{
	// parameter control section
	if ((typeof(div) != 'string' && !Scriptor.isHtmlElement(div)) || div == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	var localOpts = {
			items : [],
			width : 120
		};
	Scriptor.mixin(localOpts, opts);
	
	this.items = [];
	this.Width = !isNaN(Number(localOpts.width)) ? Number(localOpts.width) : 120;
	this.Height = 0;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.visible = false;
	
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	for (var n=0; n < localOpts.items.length; n++)
		this.addItem(this.items[n]);
		
	context_menus.stack.push(this);
};

contextMenu.prototype = {
	/*
	* contextMenu.Show
	*
	* To show the actual contextMenu on screen,
	*   the function must be called from a click callback so
	*   the system gets x and y position for the menu
	*/
	Show : function(e)
	{
		if (!e) e = window.event;
		e = Scriptor.event.fire(this, 'onshow', e);
		if (!e.returnValue)
		{
			Scriptor.event.cancel(e);
			return false;
		}
		
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
			Scriptor.error.report('Error: contextMenu DIV does not exist.');
			Scriptor.event.cancel(e);
			return false;
		}
		
		// hide previously active context menus
		context_menus.hide_actives();
		
		var target = this.divElem;
		target.className = 'contextMenu scriptor';
		target.innerHTML = '';
		target.style.display = 'block';
		
		this.Height = 4;
		for (var n=0; n < this.items.length; n++)
			this.Height += (this.items[n].label == 'sep') ? 4 : 20;
		
		// calculate x, y
		var x, y;
	
		if (typeof(e.pageX) == 'number') {
			x = e.pageX - this.Width;
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
		target.style.top = y + 'px';
		target.style.left = x + 'px';
		
		if (this._checkMenuBind)
			Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
		setTimeout(Scriptor.bind(function() {	
			Scriptor.event.attach(document, 'onclick', this._checkMenuBind = Scriptor.bind(this.checkMenu, this));
		}, this), 1);
		
		this.visible = true;
		this.updateItems();
		
		Scriptor.event.cancel(e);
		return false;
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
	
	updateItems : function()
	{
		if (!this.visible)
		{
			Scriptor.error.report("Cannot update items in a non visible contextMenu.");
			return;
		}
		
		this.Height = 4;
		for (var n=0; n < this.items.length; n++)
			this.Height += (this.items[n].label == 'sep') ? 4 : 20;
			
		// TODO: render elements
		var target = this.divElem;
		target.innerHTML = '';
		target.style.width = this.Width + 'px';
		target.style.height = this.height + 'px';
		
		var cTemplate = '<ul>';
		
		for (var n=0; n < this.items.length; n++)
		{
			var item = this.items[n];
			if (item.label == 'sep')
			{
				cTemplate += '<li class="contextMenuSep"></li>';
			}
			else
			{
				cTemplate += '<li><a href="#"" id="'+this.div+'_itm_' + n + '"';
				if (item['class'])
					cTemplate += ' class="' + item['class'] + '"';
				cTemplate += '>' + item.label + '</a></li>';
			}
		}
		
		cTemplate += '</ul>';
		target.innerHTML = cTemplate;
		
		for (var n=0; n < this.items.length; n++)
		{
			if (this.items[n].label != 'sep' && typeof(this.items[n].onclick) == 'function')
			{
				Scriptor.event.attach(document.getElementById(this.div+'_itm_' + n), 'onclick', this.items[n].onclick);
			}
		}
	},
	
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
	addItem : function(opts, ndx)
	{
		var localOpts = {
			label : 'sep',
			onclick : null
		};
		Scriptor.mixin(localOpts, opts);
		
		if (!isNaN(Number(ndx)) && ndx >= 0 && ndx < this.items.length)
			this.items.splice(ndx, 0, localOpts);
		else
			this.items.push(localOpts);
			
		if (this.visible)
			this.updateItems();
	},
	
	/*
	* contextMenu.removeItem
	*
	*   Will remove the item specified by identifier, this can be
	*    a Number stating the index of the item in the array
	*    or the item itself as an Object
	*/
	removeItem : function(identifier)
	{
		if (typeof(identifier) == 'number')
		{
			if (identifier >= 0 && identifier <= this.items.length-1)
				this.items.splice(identifier, 1);
		}
		else if (typeof(identifier) == 'object')
		{
			for (var n=0; n < this.items.length; n++)
			{
				if (this.items[n] == identifier)
				{
					this.items.splice(n, 1);
					break;
				}
			}
		}
	},
	
	checkMenu : function()
	{
		if (this._checkMenuBind)
			Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
			
		// always hide after click?
		this.Hide();
	}
};/* JavaScript Document
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
	setAdvanced : function() {
		document.getElementById(this.div+'_body').style.display = 'none';
		document.getElementById(this.div+'_advanced').style.display = 'block';
		
		var targetDate = new Date();
		if (this.selectedDates.length)
			targetDate = this.selectedDates[0];
		
		document.getElementById(this.div + 'DaySelector').value = targetDate.getDate();
		document.getElementById(this.div + 'MonthSelector').selectedIndex = targetDate.getMonth();
		document.getElementById(this.div + 'YearSelector').value = targetDate.getFullYear();
		
		this.advanced = true;
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
	shortDays : ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
	longDays : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
	
	shortMonths : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
	longMonths : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 
				  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	
	noSelection : 'Sin seleccionar',
	oneSelection : 'Fecha: ',
	multipleSelection : 'Fechas: ',
	
	prevMonth : 'Mes Anterior',
	nextMonth : 'Mes Próximo',
	advanced : 'Seleccionar mes y año',
	homeDate : 'Ir a selección o al día de hoy',
	
	day : 'Día:',
	month : 'Mes:',
	year : 'Año:',
	
	accept : 'Aceptar',
	cancel : 'Cancelar',
	
	error1 : 'El campo del día ingresado es inválido.',
	error2 : 'El campo del año ingresado es inválido.',
	error3 : 'La fecha seleccionada no está disponible.',
	
	isFrenchDateFormat : true
};/* JavaScript Document
*
* Data View version 3.0b
*
* Dynamic ajax based sortable data table. It gets rows of data from an XML or JSON source that
* can be displayed and sorted dynamically on any column
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor framework since 3.0
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
* This style object complements the stylesheet (default.css). If you change styling
* measures on dataView stylesheet you must provide a similar object to your dataView objects
* for the space calculations.
*/
var dataViewStyle = {
	'objectVerticalPadding' : 8,
	'objectHorizontalPadding' : 8,
	'paginationHeaderHeight' : 25, 
	'headerHeight' : 24, 
	'footerHeight' : 25,
	'rowHeight' : 17, 
	'cellVerticalPadding' : 0, 
	'cellHorizontalPadding' : 10, 
	'sepWidth' : 4,
	'sortWidth' : 14,
	
	'optionsIconWidth' : 25,
	'multiSelectColumnWidth' : 13
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
dataView = Scriptor.dataView = function(div, opts) {
	// parameter control section
	if ((typeof(div) != 'string' && !Scriptor.isHtmlElement(div)) || div == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	var localOpts = { width : 250,
		height: 300,
		multiselect : true,
		paginating: false,
		rowsPerPage : 20,
		columns : [] }
	Scriptor.mixin(localOpts, opts);
		
	this.rows = [];
	this.columns = [];
	
	this.selectedRow = -1;
	this.selectedRows = [];
	this.multiselect = localOpts.multiselect;	// true since 3.0
	this.enabled = true;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	Scriptor.event.registerCustomEvent(this, 'oncolumnresize');
	
	this.visible = false;
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.orderBy = false;
	this.orderWay = 'ASC';
	
	this.Width = isNaN(Number(localOpts.width)) ? 250 : Number(localOpts.width);
	this.Height = isNaN(Number(localOpts.height)) ? 250 : Number(localOpts.height);
	this.style = dataViewStyle;
	
	this.paginating = localOpts.paginating;
	this.rowsPerPage = localOpts.rowsPerPage;
	this.curPage = 0;
	this.totalRows = 0;
	
	this.resizingXCache = 0;
	this.resizingFrom = 0;
	this.resColumnId = null;
	
	this.nextRowId = 1;
	
	// add predefined columns
	for (var n=0; n < localOpts.columns.length; n++)
	{
		this.addColumn(this.createColumn(localOpts.columns[n]));
	}
	// end add
	
	this.optionsMenu = null;
};

dataView.prototype = {
	/*
	* dataView.getNextRowId()
	*   Since every row needs a unique id field, we will assign one automatically if
	*   not provided
	*/
	getNextRowId : function() {
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
	},
	
	/*
	* dataView.createColumn()
	*  Use this function to get a column object instanciated. This function exposes
	*  dataColumn publicly
	*/
	createColumn : function(opts) {
		return new dataColumn(opts);
	},
	
	/*
	* dataView.addColumn()
	*  Adds the passed column instance to the dataView columnCollection. Updates rows information 
	*  if needed with empty objects and if dataView is visible performs a Show() to refresh.
	*/
	addColumn : function( column ) {
		if (this.__findColumn(column.Name) == -1) {
			this.columns.push(column);
		
			if (this.rows.length > 0) {
				for (var n=0; n < this.rows.length; n++) {
					this.rows[n][column.Name] = dataTypes[column.Type]();
				}
			}
			
			if (!this.orderBy && column.show)
				this.orderBy = column.Name;
			
			if (this.visible)
				this.Show(false);
		}
	},
	
	/*
	* dataView.__findColumn()
	*  Internal function that returns the index of a column in its collection or -1 if not found.
	*  Pass the column Name property in colName
	*/
	__findColumn : function(colName) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].Name == colName) 
				return n;
		}
		return -1;
	},
	
	/*
	* dataView.deleteColumn()
	*  Deletes the column passed by the identifier parameter. Can be a column (Javascript) Name,
	*  a column index in the collection or an instance of a Column object inside the collection.
	*  will update row information if needed discarting the deleted column.
	*/
	deleteColumn : function( identifier ) {
		var colName = '';
		
		if (typeof(identifier) == 'string') {
			var colNdx = this.__findColumn(identifier);
			if (colNdx != -1) {
				colName = this.columns[colNdx].Name;
				this.columns.splice(colNdx,1);
			}
		}
		
		if (typeof(identifier) == 'number') {
			colName = this.columns[identifier].Name;
			this.columns.splice(identifier,1);
		}
		
		if (typeof(identifier) == 'object') {
			for (var n=0; n < this.columns.length; n++) {
				if (this.columns[n] == identifier) {
					colName = this.columns[n].Name;
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
				
			if (this.visible)
				this.Show(false);
		}
	},
		
	/*
	* dataView.createRow()
	*  Use this function to get a row object instanciated with the column informaion of the
	*  dataView object. You can initialize its values before using dataView.addRow() to
	*  add it to the row list.
	*/
	createRow : function(data) {
		data = data ? data : {};
	
		if (!data.id)
			data.id = this.getNextRowId();
		
		return new dataRow(this.columns, data);
	},

	/*
	* dataView.addRow()
	*  calling addRow() will add rowObj to the rows in the dataView object. If nothing is passed
	*  as an argument, an empty row will be added. If dataView is visible it will call
	*  updateRows to reflect the changes.
	*/
	addRow : function(rowObj) {
		if (!rowObj) 
			rowObj = this.createRow();
		else
			if (!rowObj.id)
				rowObj.id = this.getNextRowId();
		
		this.rows.push(rowObj);
			
		if (this.visible) 
			this.updateRows();
	},

	/*
	* dataView.curRow()
	*  returns the currently selected row at any time
	*/
	curRow : function() {
		return this.selectedRow != -1 ? this.rows[this.selectedRow] : null;
	},
	
	/* dataView.curRows()
	*  multiselect: Returns an array of the currently selected rows at any time
	*/
	curRows : function() {
		var rows = [];
		if (this.multiselect)
		{
			for (var n=0; n < this.selectedRows.length; n++)
				rows.push(this.rows[this.selectedRows[n]]);
		}
		
		return this.multiselect ? rows : this.curRow();
	},
	
	/*
	* dataView.insertRow()
	*  Use this the same way as addRow() to inset the row before the indicated row index.
	*  If dataView is visible it will call updateRows() to reflect changes.
	*/
	insertRow : function(ndx, rowObj) {
		if (isNaN(Number(ndx)))
			return;
			
		if (!rowObj)
			rowObj = this.createRow();
		else
			if (!rowObj.id)
				rowObj.id = this.getNextRowId();
				
		this.rows.splice(ndx, 0, rowObj);
		
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
		
		if (this.visible) 
			this.updateRows();
	},
	
	/*
	* dataView.deleteRow()
	*  This method will delete the row identified by identifier. It can be a row index in the
	*  array of rows (i.e.: dataView.selectedRow when != -1) or an instance of a row object 
	*  in the array. If dataView is visible it will call updateRows to reflect the changes.
	*/
	deleteRow : function(identifier) {
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
			
		if (rowNdx != -1 && this.visible) 
			this.updateRows();
	},
	
	/*
	* dataView.setCellValue();
	* Dynamically updates the value in a cell, performing visual updates if needed
	* returns true on success, false on error
	*/
	setCellValue : function(rowId, columnName, value) {	
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
		
		if (this.visible && this.columns[colNdx].show) {	// update value
			var cell = document.getElementById(this.div + '_cell_' + rowId + '_' + colNdx);
			
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
		}
		
		return true;
	},
	
	/*
	* dataView.Refresh();
	*  This function will call updateRows to refresh dataView rows if visible
	*  You can use a dataViewConnector object to connect an XML or JSON service to dataView
	*  and this will automatically retrieve information assync every time
	*  you call refresh() method.
	*/
	Refresh : function() {
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		if (this.visible)
			this.updateRows();
	},
	
	/*
	*  dataView.Show()
	*   Renders the object inside the object pointed by dataView.div as its id.
	*   If passed true on withRefresh, this will perform a Refresh() after showing. 
	*/
	Show : function(withRefresh) {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
				
		if (this.visible) 	// we're redrawing
			this._oldScrollTop = document.getElementById(this.div + '_body').parentNode.scrollTop;
		
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
			Scriptor.error.report('Error: dataView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'dataViewMain scriptor';
		target.innerHTML = '';
		
		var dvTemplate = '';
		
		// ensure minimum width for dataView to work
		if (this.Width < this.__calculateMinWidth())
			this.Width = this.__calculateMinWidth();
			
		// adjust column widths to the total width of the object
		this.forceWidth(this.Width);
		
		// calculate total width of columns in table
		var totalWidth = this.__calculateTotalWidth();
		
		target.style.width = (this.Width - this.style.objectHorizontalPadding) + 'px';
		target.style.height = (this.Height - this.style.objectVerticalPadding) + 'px';
		target.style.display = 'block';
		target.style.overflow = 'hidden';
		
		// Create table paginating header
		if (this.paginating) {
			dvTemplate += '<div class="dataViewPaginationHeader"><ul><li>';
			dvTemplate += '<label class="dataViewPaginationPages">' + this.lang.pageStart + (this.curPage + 1) +
								this.lang.pageMiddle + '<span id="' + this.div + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
			dvTemplate += '</label></li><li>';
			dvTemplate += '<a href="#" class="dataViewPrevBtn" id="' + this.div + '_goToPagePrev"> </a>';
			dvTemplate += '<a href="#" class="dataViewNextBtn" id="' + this.div + '_goToPageNext"> </a>';		
			dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.div + '_pageInput">' + this.lang.pageEnd + '</label>';
			dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.div + '_pageInput" />';
			dvTemplate += '<input type="button" value="' + this.lang.pageGo + '" class="dataViewPageButton" id="' + this.div + '_pageInputBtn" />';
			dvTemplate += '</li></ul></div>';
			
		}
		
		// Create table header
		dvTemplate += '<div class="dataViewHeader" style="width: ' + (this.Width - this.style.objectHorizontalPadding) + 'px; height: ' + this.style.headerHeight + 'px;" id="'+this.div+'_columnsHeader">';
		dvTemplate += '<ul style="height: ' + this.style.headerHeight + 'px;">';
		
		if (this.multiselect) {
			dvTemplate += '<li style="width: ' + this.style.multiSelectColumnWidth + 'px;">';
			dvTemplate += '<input type="checkbox" id="' + this.div + '_selectAll" class="dataViewCheckBox" /></li>';
			dvTemplate += '<li style="width: ' + this.style.sepWidth + 'px;" class="dataViewFieldSep noPointer"></li>';
		}
		
		for (var n=0; n < this.columns.length; n++) {
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
		}
		
		// add field list menu
		dvTemplate += '<li style="width: ' + this.style.optionsIconWidth + 'px" id="' + this.div + '_optionsMenuBtn" class="dataViewFieldList">';
		dvTemplate += '<a href="#"> </a></li>';
		
		dvTemplate += '</ul></div>';
		
		// Create body
		var bodyHeight = 0;
		if (this.paginating) 
			bodyHeight = (this.Height - this.style.paginationHeaderHeight - this.style.headerHeight - this.style.footerHeight - this.style.objectVerticalPadding -2);
		else
			bodyHeight = (this.Height - this.style.headerHeight - this.style.footerHeight - this.style.objectVerticalPadding -2);
			
		dvTemplate += '<div style="height: ' + bodyHeight + 'px; overflow: auto;" class="dataViewOuterBody">';
		dvTemplate += '<div style="width: ' + totalWidth + 'px" class="dataViewBody" id="' + this.div + '_body"></div>';
		dvTemplate += '</div>';
		
		// Create footer
		dvTemplate += '<div id="' + this.div + '_footer" class="dataViewFooter"></div>';
		
		target.innerHTML = dvTemplate;
		
		//assign some events
		if (this.multiselect) 
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
		
		Scriptor.event.attach(document.getElementById(this.div + '_optionsMenuBtn'), 'click', Scriptor.bindAsEventListener(this.showOptionsMenu, this));
		
		this.visible = true;
		if (withRefresh) 
			this.Refresh();
		else
			this.__refreshFooter();
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
	* dataView.setLoading(val)
	*   If val is true, show loading spinner, else show the actual rows,
	*   usefull for assync updates
	*/
	setLoading : function(val) {
		var body = document.getElementById(this.div + '_body');
		
		body.style.display = val ? 'none' : '';
		body.parentNode.className = val ? 'dataViewLoading' : 'dataViewOuterBody';
		
	},
	
	/*
	* dataView.setMessage(msg)
	*	Set a message (usefull for error messages) and hide all rows in a dataView
	* 	If msg is set to false or not present, it will restore dataView to normal
	*/
	setMessage : function(msg) {
		// false, null, or msg not present resets dataView to normal
		if (msg === false || msg === null || typeof(msg) != "string")
		{
			if (document.getElementById(this.div + '_message'))
				document.getElementById(this.div + '_message').parentNode.removeChild(document.getElementById(this.div + '_message'));
				
			document.getElementById(this.div + '_body').style.display = '';
		}
		else	// if string passed, we show a message
		{
			document.getElementById(this.div + '_body').style.display = 'none';
			var msgDiv;
			if (!document.getElementById(this.div + '_message'))
			{
				msgDiv = document.createElement('div');
				msgDiv.id = this.div + '_message';
				msgDiv.className = 'dataViewMessageDiv';
				document.getElementById(this.div + '_body').parentNode.appendChild(msgDiv);
			}
			else
			{
				msgDiv = document.getElementById(this.div + '_message');
			}
			msgDiv.innerHTML = msg;
		}
	},
	
	/*
	* dataView.clearSelection()
	*
	*   Use programatically to clear all selections in the dataView
	*/
	clearSelection : function()
	{
		this.selectedRow = -1;
		this.selectedRows = [];
		
		document.getElementById(this.div + '_selectAll').checked = false;
		this.updateRows();
	},
	
	/*
	* __selectAll()
	*  This function executes when clicking on a dataView header checkmox in multiselect and selects all rows.
	*/
	__selectAll : function(e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e);
			return;
		}
		
		var elem = document.getElementById(this.div + '_selectAll');
		
		if (this.rows.length) {
			if (elem.checked) {
				this.selectedRow = this.rows.length -1;
				this.selectedRows = [];
				
				for (var n=0; n < this.rows.length; n++)
					this.selectedRows.push(n);
					
				this.updateRows();
			}
			else {
				this.selectedRow = -1;
				this.selectedRows = [];
				
				this.updateRows();
			}
		}
		else {
			elem.checked = false;
		}
	},
	
	/*
	* __goToPage()
	*  This function executes when changing the page on a paginated dataView
	*/
	__goToPage : function (e) {
		if (!this.enabled)
			return;
			
		var page = document.getElementById(this.div + '_pageInput').value;
		
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
				
				this.Show(true);
			}
			
			document.getElementById(this.div + '_pageInput').focus();
		}
	},
	
	/*
	* __checkGoToPage()
	*  This function executes to capture <enter> key press on the dataView page input
	*/
	__checkGoToPage : function (e) {
		if (!e) e = window.event;
		
		if (e.keyCode == 13) {
			this.__goToPage(e)
		}
	},
	
	/*
	* __goToPagePrev
	*  This function executes when clicked on the "previous" link
	*/
	__goToPagePrev : function (e) {
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
				
			this.Show(true);
		}
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/*
	* __goToPageNext
	*  This function executes when clicked on the "next" link
	*/
	__goToPageNext : function (e) {
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
				
			this.Show(true);
		}
		
		Scriptor.event.cancel(e);
		return false;
	},

	/*
	*  dataView.updateRows()
	*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
	*   dataView.updateRows() directly to update row information only without spending additional
	*   resources on the dataView frame rendering.
	*/
	updateRows : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update rows on non visible dataView object.");
			return;
		}
		
		var targetTable = document.getElementById(this.div + '_body');
		
		if (!this._oldScrollTop)
			this._oldScrollTop = targetTable.parentNode.scrollTop;
			
		var totalHeight = 0;
		var rTemplate = '';
		
		for (var n=0; n < this.rows.length; n++) {		
			
			var rowId = this.rows[n].id;
			var firstCol = true;
			rTemplate += '<ul id="' + this.div + '_row_' + rowId + '">';
			
			if (this.multiselect) {
				var check = false;
				rTemplate += '<li style="width: ' + (this.style.multiSelectColumnWidth + this.style.sepWidth -3) + 'px;" class="dataViewMultiselectCell';
				if (!this.multiselect) {
					if (this.selectedRow == n) {
						rTemplate += ' selectedRow';
						check = true;
					}
				}
				else {
					for (var a=0; a < this.selectedRows.length; a++) {
						if (this.selectedRows[a] == n) {
							rTemplate += ' selectedRow';
							check = true;
							break;
						}
					}
				}
				
				rTemplate += '">';
				rTemplate += '<input type="checkbox" id="' + this.div + '_selectRow_' + rowId + '" class="dataViewCheckBox" ';
				if (check)
					rTemplate += 'checked="checked" ';
				rTemplate += '/></li>';
			}
			
			for (var a=0; a < this.columns.length; a++) {
				if (this.columns[a].show) {
					
					var colWidth = (this.columns[a].Width - this.style.cellHorizontalPadding - 2);
					if (firstCol && !this.multiselect) {
						colWidth -= 1;
						firstCol = false;
					}
					else {
						colWidth += 1;
					}
					
					rTemplate += '<li class="dataView' + this.columns[a].Type;
					
					if (!this.multiselect) {
						if (this.selectedRow == n) {
							rTemplate += ' selectedRow';
							check = true;
						}
					}
					else {
						for (var i=0; i < this.selectedRows.length; i++) {
							if (this.selectedRows[i] == n) {
								rTemplate += ' selectedRow';
								check = true;
								break;
							}
						}
					}
							
					rTemplate += '" id="' + this.div + '_cell_' + rowId + '_' + a + '" style="width: ' + colWidth + 'px;"';
					if (this.columns[a].showToolTip) 
						rTemplate += ' title="' + this.rows[n][this.columns[a].Name] + '"';
					rTemplate += '>';
					
					if (typeof(this.columns[a].Format) == 'function') {
						var funcRet = this.columns[a].Format(this.rows[n][this.columns[a].Name]);
						if (typeof(funcRet) == 'string')
							rTemplate += funcRet;
						
					}
					else {
						rTemplate += this.rows[n][this.columns[a].Name];
					}
					
					rTemplate += '</li>';
				}
			}
			
			rTemplate += '</ul>';
			totalHeight += this.style.rowHeight + this.style.cellVerticalPadding;
			
		}	
		
		targetTable.innerHTML = rTemplate;
		
		// assign onclick events and search for complex formatted cells
		for (var n=0; n < this.rows.length; n++) {
			var rowId = this.rows[n].id;
			
			if (this.multiselect)
				Scriptor.event.attach(document.getElementById(this.div + '_selectRow_' + rowId), 'click', Scriptor.bindAsEventListener(this.__markRow, this, n));
				
			for (var a=0; a < this.columns.length; a++) {
				if (this.columns[a].show) {
					Scriptor.event.attach(document.getElementById(this.div + '_cell_' + rowId + '_' + a), 'click', Scriptor.bindAsEventListener(this.__selectRow, this, n));
					
					if (typeof(this.columns[a].Format) == 'function') {
						var funcRet = this.columns[a].Format(this.rows[n][this.columns[a].Name]);
						if (typeof(funcRet) != 'string')
							document.getElementById(this.div + '_cell_' + rowId + '_' + a).appendChild(funcRet);
					}
				}
			}
		}
		
		if (this.selectedRow >= this.rows.length)
			this.selectedRow = -1;
			
		for (var n=0; n < this.selectedRows.length; n++) {
			if (this.selectedRows[n] >= this.rows.length) {
				this.selectedRows.splice(n, 1);
				n--;
			}	
		}
		
		targetTable.style.height = totalHeight + 'px';
		
		// update scrolling
		if (this.selectedRow != -1) {
			var windowMin = this._oldScrollTop ? this._oldScrollTop : 0;
			var windowHeight = parseInt(targetTable.parentNode.style.height);
			var step = (this.style.rowHeight + this.style.cellVerticalPadding) * this.selectedRow;
			var windowMax = windowMin + windowHeight;
			
			if (step < windowMin || step > (windowMax - (this.style.rowHeight + this.style.cellVerticalPadding))) {
				targetTable.parentNode.scrollTop = step;
			}
			else {
				targetTable.parentNode.scrollTop = this._oldScrollTop ? this._oldScrollTop : 0;
			}
		}
		else {
			targetTable.parentNode.scrollTop = this._oldScrollTop ? this._oldScrollTop : 0;
		}
			
		this.__refreshFooter();
	},
	
	/*
	* dataView.__refreshFooter()
	*   Internal function. Refreshes the footer text.
	*/
	__refreshFooter : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update rows on non visible dataView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div + '_footer');
		
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
		
		targetDiv.innerHTML = fTemplate;
	},
	
	/*
	* __setOrder()
	*  This functions executes when clicking on a dataView column name and sets row order.
	*  Pass divId the id property of the HTMLElement asociated with the dataView object and
	*  colName the javascript Name of the column in which order must be performed. Ordering way
	*  will be switched upon subsecuent calls to __setOrder()
	*/
	__setOrder : function (e, colNdx) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e);
			return false;
		}
		
		var colName = this.columns[colNdx].Name;
		
		if (colNdx != -1) {		
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
			
			if (!this.paginating) {
				this.__sort(0);
				
				if (this.visible) {
					this.Show(false);
					this.updateRows();
				}
			}
			else {
				if (this.visible) {
					this.Show(true);
				}
			}
		}
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/*
	* __selectRow()
	*  This function executes when clicking on a dataView row and selects that row.
	*/
	__selectRow : function (e, rowNdx) {
		if (!e) e = window.event;
		
		if (!this.visible || !this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
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
		
		var colStyles = [];
		if (this.multiselect)	// add dummy style for the first cell
			colStyles.push('MultiselectCell');
		
		for (var n=0; n < this.columns.length; n++)
			if (this.columns[n].show)
				colStyles.push(this.columns[n].Type);
			 
		var rows = document.getElementById(this.div+'_body').getElementsByTagName('ul');
		
		if (rowNdx != -1) {
			if (!this.multiselect) {
				if (this.selectedRow != -1) {
					for (n=0; n < rows[this.selectedRow].childNodes.length; n++) 
						rows[this.selectedRow].childNodes[n].className = 'dataView' + colStyles[n];
				}
			}
			else {
				for (var a = 0; a < this.selectedRows.length; a++) {
					for (n=0; n < rows[this.selectedRows[a]].childNodes.length; n++) {
						if (n==0)
							rows[this.selectedRows[a]].childNodes[n].firstChild.checked = false;
						rows[this.selectedRows[a]].childNodes[n].className = 'dataView' + colStyles[n];
					}
				}
			}
			
			if (this.selectedRow == rowNdx && !this.multiselect) {
				this.selectedRow = -1;
			}
			else {
				if (!this.multiselect) {
					this.selectedRow = rowNdx;
					for (n=0; n < rows[rowNdx].childNodes.length; n++) 
						rows[rowNdx].childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
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
						for (n=0; n < rows[this.selectedRows[a]].childNodes.length; n++) {
							if (n==0)
								rows[this.selectedRows[a]].childNodes[n].firstChild.checked = true;
							rows[this.selectedRows[a]].childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
						}
					}
				}
			}
		}
		
		/*Scriptor.event.cancel(e);*/
		return false;
	},
	
	/*
	* __markRow()
	*  This function executes when clicking on a dataView row checkmox in multiselect and selects that row.
	*/
	__markRow : function(e, rowNdx) {
		if (!e) e = window.event;
		
		if (!this.visible || !this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
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
		
		var colStyles = [];
		colStyles.push('MultiselectCell');	// first cell is multiselect checkbox
		for (var n=0; n < this.columns.length; n++)
			if (this.columns[n].show)
				colStyles.push(this.columns[n].Type);
		
		var rowId = this.rows[rowNdx].id;
		
		elem = document.getElementById(this.div + '_selectRow_' + rowId);
		if (elem.checked) {	// add row to selected rows list
			this.selectedRows.push(rowNdx)
			this.selectedRow = rowNdx;
					
			var row = document.getElementById(this.div + '_row_' + rowId);
			for (var a = 0; a < row.childNodes.length; a++) 
				row.childNodes[a].className = 'dataView' + colStyles[a] + ' selectedRow';
			
		}
		else {		// remove row from selected rows list
			for (var n=0; n < this.selectedRows.length; n++) {
				if (this.selectedRows[n] == rowNdx) {
					this.selectedRows.splice(n, 1);
					if (this.selectedRows.length) 
						this.selectedRow = this.selectedRows[this.selectedRows.length-1];
					else 
						this.selectedRow = -1;
				
					var row = document.getElementById(this.div + '_row_' + rowId);
					for (var a = 0; a < row.childNodes.length; a++) {
						row.childNodes[a].className = 'dataView' + colStyles[a];
					}
					break;
				}
			}
		}
		
		return true;
	},
	
	/*
	*  dataView.updateOptionsMenu()
	*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
	*   dataView.updateOptiosMenu() directly to update the options menu only without spending additional
	*   resources on the dataView frame rendering. This is usefull when changing the property
	*   dataView.optionsMenuWidth to apply these changes.
	*/
	updateOptionsMenu : function() {
		this.optionsMenu.items = [];
		this.optionsMenu.addItem({label : this.lang.refresh, onclick : Scriptor.bindAsEventListener(function(e) {
			if (!e) e = window.event;
			
			this.Refresh();
			this.optionsMenu.Hide();
			
			Scriptor.event.cancel(e);
			return false;
		}, this)});
		this.optionsMenu.addItem({label : 'sep'});
		
		for (var n=0; n < this.columns.length; n++) {
			var className = ''
			if (this.columns[n].show)
				className = 'dataViewOptionChecked';
			this.optionsMenu.addItem({label : this.columns[n].displayName, 'class' : className, onclick : Scriptor.bindAsEventListener(this.toggleColumn, this, n)});
		}
	},

	/* showOptionsMenu
	*  This function shows the option menu of a dataView object. For internal use only
	*/
	showOptionsMenu : function(e) {
		if (!e) e = window.event;
		
		// create options menu for the first time
		if (!this.optionsMenu)
		{
			var om = document.createElement('div');
			om.id = this.div+'_optionsMenu';
			document.getElementsByTagName('body')[0].appendChild(om);
			this.optionsMenu = new Scriptor.contextMenu(om.id);
		}

		this.updateOptionsMenu();
		this.optionsMenu.Show(e);
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/*
	* toggleColumn
	*   Toggles a column on or off. OptionsMenu feature. Use dataColumn.show property along with
	*   dataView.Show(false) instead to change column configuration manually.
	*/
	toggleColumn : function(e, colNdx) {
		if (!e) e = window.event;
		
		if (this.columns[colNdx].show) {
			this.columns[colNdx].show = false;
		}
		else {
			this.columns[colNdx].show = true;
		}
		
		this.Show(false);
		this.updateRows();
		this.optionsMenu.Hide();
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/*
	* dataView.forceWidth()
	*  Use it to force the data viewport to a specific width. Will set the object width to
	*  the specified value and proportionally adjust the columns if needed to fill the horizontal area
	*  Use dataView.Show function instead, to force a width change
	*/
	forceWidth : function(w) {
		if (isNaN(Number(w)))
			return;
		
		var minWidth = this.__calculateMinWidth();
		if (w < minWidth)
			w = minWidth;
		
		this.Width = w;
		var totalWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth + this.__calculateTotalWidth();
		
		while (totalWidth > this.Width) {
			for (var n=0; n < this.columns.length; n++) {
				if (this.columns[n].show) {
					totalWidth -= 1;
					this.columns[n].Width -= 1;
				}
			}
		}
	},
	
	/*
	* Internal use only
	*/
	__calculateMinWidth : function()
	{
		var minWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth;
		for (var n=0; n < this.columns.length; n++) {
			minWidth += this.style.cellHorizontalPadding + this.style.sepWidth;
		}
		if (this.multiselect)
			minWidth += this.style.multiSelectColumnWidth + this.style.cellHorizontalPadding + this.style.sepWidth;
		
		return minWidth;
	},
	
	/*
	* Internal use only
	*/
	__calculateTotalWidth : function()
	{
		var totalWidth = 0;
		
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show) 
				totalWidth += this.columns[n].Width;
		}
		
		if (this.multiselect) 
			totalWidth += this.style.multiSelectColumnWidth + this.style.cellHorizontalPadding + this.style.sepWidth;
		
		return totalWidth ;
	},
	
	/*
	* dataView.getTotalPages()
	*  When paginating, this tells the total number of pages in the object
	*/
	getTotalPages : function() {
		var totalPages = 0;
		var rowLength = this.totalRows ? this.totalRows : this.rows.length;
			
		var n=0;
		while (n < rowLength) {
			n += this.rowsPerPage;
			totalPages++;
		}
		
		return totalPages;
	},
	
	/*
	* dataView.__sort()
	*  This function performs sorting of rows depending on the sortBy and sortWay properties
	*  For internal use only. Use global function __setOrder instead.
	*/
	__sort : function(start) {
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
	},
	
	/*
	*  dataView.colum_exists()
	*   Internal function that returns true if a column with its Name property equals to str exists
	*/
	colum_exists : function(str) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].Name == str)
				return true;
		}
		return false;
	},
	
	/*
	* dataView.__getColumnSqlName(colName)
	*  Internal function that returns the column sqlName upon its Name property (colName).
	*/
	__getColumnSqlName : function(colName) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].Name == colName) 
				return this.columns[n].sqlName;
		}
		return false;
	},
	
	/* activateResizing
	*  This function will search for a valid dataView id and mark it for column resizing
	*/
	activateResizing : function(e, colNdx) {
		if (!e) e = window.event;
		
		if (!this.enabled) {
			Scriptor.event.cancel(e);
			return false;
		}
		
		var targetTable = document.getElementById(this.div+'_columnsHeader');
		
		// calculate the resized column
		this.resColumnId = colNdx;
		
		// set x cache value for resizing
		var x;
	
		if (typeof(e.pageX) == 'number') {
			x = e.pageX;
		}
		else {
			if (typeof(e.clientX) == 'number') {
				x = (e.clientX + document.documentElement.scrollLeft);
			}
			else {
				x = 0;
			}
		}
		
		this.resizingFrom = this.columns[colNdx].Width;
		this.resizingXCache = x;
		
		Scriptor.event.attach(document, 'mousemove', this._mouseMoveBind = Scriptor.bindAsEventListener(this.doResizing, this));
		Scriptor.event.attach(document, 'mouseup', this._mouseUpBind = Scriptor.bindAsEventListener(this.deactivateResizing, this));
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/* performResizing
	* This function deactivates resizing status and performs complete redrawing
	*/
	deactivateResizing : function(e) {
		if (!e) e = window.event;
		
		Scriptor.event.detach(document, 'mousemove', this._mouseMoveBind);
		Scriptor.event.detach(document, 'mouseup', this._mouseUpBind);
		
		var ce = {};
		ce.columnId = this.resColumnId;
		ce.resizingFrom = this.resizingFrom;
		ce.resizedTo = this.columns[this.resColumnId].Width;
		
		Scriptor.event.fire(this, 'oncolumnresize', ce);
		
		this.resColumnId = null;
		this.resizingXCache = 0;
	},
	
	/* doResizing
	*  This function calculates the resizing upon mouse movement
	*/
	doResizing : function(e) {
		if (!e) e = window.event;
		// get delta x
		var x;
	
		if (typeof(e.pageX) == 'number') {
			x = e.pageX;
		}
		else {
			if (typeof(e.clientX) == 'number') {
				x = (e.clientX + document.documentElement.scrollLeft);
			}
			else {
				x = 0;
			}
		}
		
		var deltaX = Math.abs(this.resizingXCache - x);
		var growing = (this.resizingXCache < x) ? true : false;
		
		this.resizingXCache = x;
		// get the minimum width for a column;
		var minWidth = this.style.cellHorizontalPadding + this.style.sepWidth;
		var colNdx = 0;
		var actualColNdx = this.resColumnId;
		
		// calculate colNdx (the HTML element in the ul index)
		for (var n=0; n < actualColNdx; n++)
		{
			if (this.columns[n].show)
				colNdx++;
		}
		
		// get the next column in case resizing is needed
		var nextActualColNdx = actualColNdx;
		for (n = actualColNdx+1; n < this.columns.length; n++) {
			if (this.columns[n].show) {
				nextActualColNdx = n;
				break;
			}
		}
		
		// getting a smaller column is easier (?)
		var changedSize = false;
		var changedNextColSize = false;
		
		if (!growing) {
			// see if col can be shorter than it is
			if ((this.columns[actualColNdx].Width - deltaX) > minWidth) {
				this.columns[actualColNdx].Width -= deltaX;
				changedSize = true;
			}
		}
		else {
			// see if there is space for col to grow
			var totalWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth + this.__calculateTotalWidth();
			
			if ((totalWidth + deltaX) < this.Width) {	// there is space to grow
				this.columns[actualColNdx].Width += deltaX;
				changedSize = true;
			}
			else {	// no space
				if (nextActualColNdx != actualColNdx) {	// not the last col shrink next col
					if ((this.columns[nextActualColNdx].Width - deltaX) > minWidth) {
						this.columns[actualColNdx].Width += deltaX;
						this.columns[nextActualColNdx].Width -= deltaX;
						changedSize = true;
						changedNextColSize = true;
					}
				}
			}
		}
		
		// update dataView HTML header
		var htmlHeader = document.getElementById(this.div+'_columnsHeader');
		if (htmlHeader) {
			var cols = htmlHeader.firstChild.getElementsByTagName('li');
			var offset = 0;
			if (this.multiselect)
				offset = 2;
			var ndx = offset + (colNdx*2);
			
			cols[ndx].style.width = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth) + 'px'; 
			if ((this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
				cols[ndx].firstChild.style.width = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) + 'px';
			else 
				cols[ndx].firstChild.style.width = '0px';
			
			if (changedNextColSize) {
				ndx += 2;
				
				cols[ndx].style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth) + 'px';
				if ((this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
					cols[ndx].firstChild.style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) + 'px';
				else 
					cols[ndx].firstChild.style.width = '0px';
			}
		}
			
		// update row cells
		var rows = document.getElementById(this.div+'_body').getElementsByTagName('ul');
		
		// calculate total width of columns in table
		document.getElementById(this.div+'_body').style.width = this.__calculateTotalWidth()+'px';	
		
		for (var n=0; n < rows.length; n++)
		{
			var cols = rows[n].getElementsByTagName('li');
			var offset = 0;
			if (this.multiselect)
				offset = 1;
			
			var colWidth = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - 2);
			if (colNdx == 0 && !this.multiselect) {
				colWidth -= 1;
			}
			else {
				colWidth += 1;
			}
			
			cols[offset+(colNdx)].style.width = colWidth + 'px';
			
			if (changedNextColSize) {
				cols[offset+(colNdx)+1].style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding -1) + 'px';
			}
		}
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
dataViewConnector = Scriptor.dataViewConnector = function(opts) {
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

dataViewConnector.prototype = {
	_onRefresh : function(e) {
		if (!e) e = window.event;
		
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
	
			// TODO: Add/Remove/Update rows instead of replacing the whole data structure
			//   upgrade addRow, deleteRow to avoid using updateRows
			// fake visible = false so we call updateRows only once
			var oldVisible = this.dataView.visible;
			this.dataView.visible = false;
			this.dataView.rows.length = 0;
			
			if (root.getAttribute('success') == '1')
			{
				var totRows = Number(root.getAttribute('totalrows'));
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					if (this.dataView.paginating)
						document.getElementById(this.dataView.div + '_totalPagesHandler').innerHTML = this.dataView.getTotalPages();
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
					
					this.dataView.addRow(this.dataView.createRow(tempR));
				}
			}
			else
			{
				this.dataView.setMessage(root.getAttribute('errormessage'));
			}
			
			if (oldVisible)
			{
				this.dataView.visible = oldVisible;
				this.dataView.updateRows();
			}
		}
		else	// json
		{
			// TODO: Add/Remove/Update rows instead of replacing the whole data structure
			//   upgrade addRow, deleteRow to avoid using updateRows
			// fake visible = false so we call updateRows only once
			var oldVisible = this.dataView.visible;
			this.dataView.visible = false;
			this.dataView.rows.length = 0;
			
			if (data.success)
			{
				var totRows = Number(data.totalrows);
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					if (this.dataView.paginating)
						document.getElementById(this.dataView.div + '_totalPagesHandler').innerHTML = this.dataView.getTotalPages();
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
					
					this.dataView.addRow(this.dataView.createRow(tempR));
				}
			}
			else
			{
				this.dataView.setMessage(data.errormessage);
			}
			
			if (oldVisible)
			{
				this.dataView.visible = oldVisible;
				this.dataView.updateRows();
			}
		}
	},
	
	_onError : function(status)
	{
		this.dataView.setLoading(false);
		this.dataView.setMessage('Error: Unable to load dataView object (HTTP status: ' + status + ')');
	}
};// JavaScript Document
/*
* dataLangs
* This object contains the strings that have to be output by dataView in different languages.
* Create your own language prefixed object and assign the prefix to the Lang property of dataView.
*  (does not include error messages which are in English)
*/

dataView.prototype.lang = { 
  'noRows' : 'No hay filas para mostrar.',
  'rows' : 'filas.',
  'row' : 'fila.',
  'pageStart' : 'Página ',
  'pageMiddle' : ' de ',
  'pageEnd' : ' Ir a página: ',
  'pageGo' : 'Ir',
  'pagePrev' : '<< Anterior',
  'pageNext' : 'Siguiente >>',
  'refresh' : 'Actualizar',
  'of' : 'de' };
				  
// JavaScript Document
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
	errors : { createRequestError : 'Error creando objeto Ajax!',
		requestHandleError : 'Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde.' }
};/* JavaScript Document
*
*  tabView component
*
*  All purpose tab interface javascript class.
*
* Part of the scriptor javascript modular loader
*/

/*
* tabView version 2.0b
*
* This is a tab collection object. It works by taking a UL Html object and adding
* tab labels for its different panels. The pannels are DIV Html objects which ids must
* be passed along with the desired labels to the object. This will convert a list of
* divs to a panelled tab system
*
* ulDiv: the id or the Ul Html that will contain the tabs.
*
* tabsDiv: the id or the Html container element for the tab panels.
* 
* tabs is an Array og Objects on the form of [ { label : String(), elem : HTML tap panel }, ... ]
*   Here you will define the different labels and DIV ids (or actual ids) for the tab system
*
* tabView.selectedTab
*  the currently selected tab
*
* tabView.visible
*  will be true after a succesfull render of the tab list. Should be read only.
*
*/
tabView = Scriptor.tabView = function(ulDiv, tabsDiv, tabs) {
	// parameter control section
	if ((typeof(ulDiv) != 'string' && !Scriptor.isHtmlElement(ulDiv)) || ulDiv == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	if ((typeof(tabsDiv) != 'string' && !Scriptor.isHtmlElement(tabsDiv)) || tabsDiv == '') {
		Scriptor.error.report('Error: second parameter bus be a non empty string or a html object.');
		return;
	}
	
	this.ulElem = typeof(ulDiv) == 'string' ? document.getElementById(ulDiv) : ulDiv;
	this.tabsElem = typeof(tabsDiv) == 'string' ? document.getElementById(tabsDiv) : tabsDiv;
	this.ulId = typeof(ulDiv) == 'string' ? ulDiv : this.ulElem.id;
	this.tabsId = typeof(tabsDiv) == 'string' ? tabsDiv : this.tabsElem.id;
	
	if (tabs && !(tabs instanceof Array)) {
		Scriptor.error.report('Error: third parameter must be an array of objects.');
		return;
	}
	
	// tab list translating and control
	this.tabs = [];
	this.selectedTab = 0;
	if (tabs)
		for (var n=0; n < tabs.length; n++) {
			if (typeof(tabs[n].label) != 'string' || (typeof(tabs[n].elem) != 'string' && !Scriptor.isHtmlElement(tabs[n].elem))) {
				Scriptor.error.report('Error: Invalid tab collection object. (element ' + n + ')');
				return;
			}
			
			var theElem = typeof(tabs[n].elem) == 'string' ? document.getElementById(tabs[n].elem) : tabs[n].elem;
			var theId = typeof(tabs[n].elem) == 'string' ? tabs[n].elem : tabs[n].elem.id;
			this.tabs[n] = {label : tabs[n].label, divStr : theId, divElem : theElem };
		}
		
	// custom event system
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.visible = false;
};

tabView.prototype = {
	/*
	* tabView.selectTab(tabNdx)
	*
	* Use this function (rather than writing the tabView.selectedTab property) to select
	* a tab panel by code. This is the function that will be used by the event handling system
	* when a user clicks on a tab
	*
	*/
	selectTab : function(e, tabNdx) {
		if (!this.visible)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		e.selectedTab = this.selectedTab;
		e.selecting = tabNdx;
		e = Scriptor.event.fire(this, 'onselect', e);
		
		if (e.returnValue == false)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		if (tabNdx >= 0 && tabNdx < this.tabs.length) {
			if (!this.visible || !this.ulElem)
			{
				Scriptor.event.cancel(e, true);
				return false;
			}
			
			var tabElems = this.ulElem.getElementsByTagName('li');
			
			tabElems.item(this.selectedTab).className = 'tabViewLi';
			if (this.tabs[this.selectedTab] && this.tabs[this.selectedTab].divElem)
				this.tabs[this.selectedTab].divElem.style.display = 'none';
			
			tabElems.item(tabNdx).className = 'tabViewLiSelected';
			if (this.tabs[tabNdx] && this.tabs[tabNdx].divElem)
				this.tabs[tabNdx].divElem.style.display = 'block';
			
			this.selectedTab = tabNdx;
		}
		
		Scriptor.event.cancel(e, true);
		return false;
	},
	
	/*
	* tabView.Show()
	*
	* Use this function nmediately after successfully defining the tabView object in order
	* to create the tab list inside the empty UL element (shoud and will be emptied).
	*
	*/
	Show : function() {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
		if (this.visible)
		{
			this.Refresh();
			return;
		}
		
		if (!this.ulElem)
		{
			this.ulElem = document.getElementById(this.ulId);
		}
		else
		{
			if (!this.ulElem.id)
			{
				if (!this.ulId)
					this.ulId = __getNextHtmlId();
					
				this.ulElem.id = this.ulId;
			}
		}
		
		if (!this.tabsElem)
		{
			this.tabsElem = document.getElementById(this.tabsId);
		}
		else
		{
			if (!this.tabsId)
				this.tabsId = __getNextHtmlId();
			
			this.tabsElem.id = this.tabsId;
		}
		
		if (!this.ulElem) {
			Scriptor.error.report('Error: UL does not exist.');
			return;
		}
		
		if (!this.tabsElem) {
			Scriptor.error.report('Error: HTMLContainer does not exist');
			return;
		}
		
		this.ulElem.className = 'tabViewUl';
		this.ulElem.style.display = 'block';
		this.tabsElem.style.display = 'block';
		
		for (var n=0; n < this.tabs.length; n++) {
			var curTab = this.tabs[n];
			if (Scriptor.isHtmlElement(curTab.divElem) && !curTab.parentNode)
				this.tabsElem.appendChild(curTab.divElem);
				
			if (!curTab.divElem)
			{
				curTab.divElem = document.getElementById(curTab.divStr);
			}
			else
			{
				if (!curTab.divElem.id)
				{
					if (!curTab.divStr)
						curTab.divStr = __getNextHtmlId();
						
					curTab.divElem.id = curTab.divStr;
				}
			}
			
			if (!curTab.divElem)
			{
				Scriptor.error.report('Error: Tab panel div does not exist.');
				return;
			}
			
			curTab.divElem.className = 'tabViewDiv';
		}
		
		this.visible = true;
		this.Refresh();
	},
	
	Refresh : function() {
		if (!this.visible)
			return;
		
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		this.ulElem.innerHTML = '';
		var template = '';
		for (var n = 0; n < this.tabs.length; n++) {
			template += '<li class="' + (this.selectedTab == n ? 'tabViewLiSelected' : 'tabViewLi') + '">';
			template += '<a href="#" id="' + this.ulId+'_tab'+n + '"><span>' + this.tabs[n].label + '</span></a></li>';
		}
		this.ulElem.innerHTML = template;
		
		for (var n=0; n < this.tabs.length; n++)
			Scriptor.event.attach(document.getElementById(this.ulId+'_tab'+n), 'click', Scriptor.bindAsEventListener(this.selectTab, this, n));
		
		for (var n=0; n < this.tabs.length; n++) {
			if (n != this.selectedTab)
				this.tabs[n].divElem.style.display = 'none';
			else
				this.tabs[n].divElem.style.display = 'block';
		}
	},
	
	Hide : function() {
		var e = Scriptor.event.fire(this, 'onhide');
		if (!e.returnValue)
			return;
		
		if (this.ulElem)
			this.ulElem.style.display = 'none';
		if (this.tabsElem)
			this.tabsElem.style.display = 'none';
			
		this.visible = false;
	},
	
	addTab : function(tab, insertNdx) {
		if (typeof(tab.label) != 'string' || (typeof(tab.elem) != 'string' && !Scriptor.isHtmlElement(tab.elem))) {
			Scriptor.error.report('Error: Invalid tab object.');
			return;
		}
		
		var theElem = typeof(tab.elem) == 'string' ? document.getElementById(tab.elem) : tab.elem;
		var theId = typeof(tab.elem) == 'string' ? tab.elem : tab.elem.id;
		
		if ((insertNdx === undefined || isNaN(Number(insertNdx))) ||
			insertNdx < 0 || insertNdx > this.tabs.length-1)
		{
			this.tabs.push({label : tabs[n].label, divStr : theId, divElem : theElem });
			insertNdx = this.tabs.length-1;
		}
		else
		{
			this.tabs.splice(insertNdx, 0, {label : tabs[n].label, divStr : theId, divElem : theElem });
		}
		
		if (this.visible)
		{
			var curTab = this.tabs[insertNdx];
			if (Scriptor.isHtmlElement(curTab.divElem) && !curTab.parentNode)
				this.tabsElem.appendChild(curTab.divElem);
				
			if (!curTab.divElem)
			{
				curTab.divElem = document.getElementById(curTab.divStr);
			}
			else
			{
				if (!curTab.divElem.id)
				{
					if (!curTab.divStr)
						curTab.divStr = __getNextHtmlId();
						
					curTab.divElem.id = curTab.divStr;
				}
			}
			
			if (!curTab.divElem)
			{
				Scriptor.error.report('Error: Tab panel div does not exist.');
				return;
			}
			
			this.curTab.divElem.className = 'tabViewDiv';
			
			this.Refresh();
		}
	},
	
	deleteTab : function(tabNdx) {
		if (tabNdx >= 0 && tabNdx <= this.tabs.length-1)
		{
			var curTab = this.tabs[tabNdx];
			if (curTab.divElem && curTab.divElem.parentNode)
			{
				curTab.divElem.parentNode.removeChild(curTab.divElem);
				curTab.divElem = null;
			}
			
			this.tabs.splice(tabNdx, 1);
			
			if (this.selectedTab >= this.tabs.length)
				this.selectedTab = this.tabs.length-1;
				
			if (this.visible)
				this.Refresh();
		}
	},
	
	setTabLabel : function(tabNdx, label) {
		if (tabNdx >= 0 && tabNdx <= this.tabs.length-1)
		{
			this.tabs[tabNdx].label = label;
			
			if (this.visible && this.ulElem)
			{
				var tabElems = this.ulElem.getElementsByTagName('li');
				tabElems[tabNdx].getElementsByTagName('span')[0].innerHTML = label;
			}
		}
		
	}
};
// JavaScript Document
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
	getChildNodes : function(parentNode, tv)
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
	},
	
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
};
	return Scriptor;
})(window, document);

// local support for JSON parsing
// JSON implementation for unsupported browsers
if (!JSON) {
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