/* JavaScript Document
*
*
* Global context menu system for the Scriptor framework
*
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
	
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.create();
	Scriptor.className.add(this.target, "jsContextMenu");
	Scriptor.body().appendChild(this.target);
	
	// reset original width since we will leave this property to the widest option
	this._origWidth = null;
	
	this.items = [];
	this._checkedItemNdx = null;
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
		this.updateItems();
		
		if (this._checkMenuBind)
			Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
		setTimeout(Scriptor.bind(function() {	
			Scriptor.event.attach(document, 'onclick', this._checkMenuBind = Scriptor.bind(this.checkMenu, this));
		}, this), 1);
		
		Scriptor.event.cancel(e);
		return false;
	}
};

Scriptor.ContextMenu.prototype.updateItems = function()
{
	var target = this.target;
	target.innerHTML = '';
	
	var cTemplate = '<ul id="'+this.divId+'_ul">';
	
	for (var n=0; n < this.items.length; n++)
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
	}
	
	cTemplate += '</ul>';
	target.innerHTML = cTemplate;
	
	var ul = document.getElementById(this.divId+"_ul");
	var ubox = Scriptor.element.getOuterBox(ul);
	var ibox = this.__getInnerBox();
	
	this.width = ul.offsetWidth + ubox.left + ubox.right + ibox.left + ibox.right;
	this.height = ul.offsetHeight + ubox.top + ubox.bottom + ibox.top + ibox.bottom;
	this.__updatePosition();
	
	for (var n=0; n < this.items.length; n++)
	{
		if (this.items[n].label != 'sep' && typeof(this.items[n].onclick) == 'function')
		{
			Scriptor.event.attach(document.getElementById(this.divId+'_itm_' + n), 'onclick', this.items[n].onclick);
		}
	}
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
		onclick : null
	};
	Scriptor.mixin(localOpts, opts);
	
	if (!isNaN(Number(ndx)) && ndx >= 0 && ndx < this.items.length)
		this.items.splice(ndx, 0, localOpts);
	else
		this.items.push(localOpts);
		
	if (this.visible)
		this.updateItems();
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
	
	if (this.visible)
		this.updateItems();
};

/*
* contextMenu.checkItem
* 
* 	Marks the identified item as checked, if no param
* 	 passed, unmarks all items.
* 
*/
Scriptor.ContextMenu.prototype.checkItem = function(identifier)
{
	if (typeof(identifier) != 'undefined')
	{
		if (typeof(identifier) == 'number')
		{
			if (identifier >= 0 && identifier <= this.items.length-1)
				this._checkedItemNdx = identifier;
		}
		else if (typeof(identifier) == 'object')
		{
			for (var n=0; n < this.items.length; n++)
			{
				if (this.items[n] == identifier)
				{
					this._checkedItemNdx = n;
					break;
				}
			}
		}
	}
	else
	{
		this._checkedItemNdx = null;
	}
	
	if (this.target)
	{
		var itms = this.target.getElementsByTagName('li');
		// unmark items
		for (var n=0; n < itms.length; n++)
		{
			Scriptor.className.remove(itms[n], 'OptionChecked')
		}
		
		if (typeof(identifier) != 'undefined')
		{
			if (typeof(identifier) == 'number')
			{
				if (identifier >= 0 && identifier <= this.items.length-1)
					Scriptor.className.add(itms[identifier], 'OptionChecked');
			}
			else if (typeof(identifier) == 'object')
			{
				for (var n=0; n < this.items.length; n++)
				{
					if (this.items[n] == identifier)
					{
						Scriptor.className.add(itms[n], 'OptionChecked');
						break;
					}
				}
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
	
};