/* JavaScript Document
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
};