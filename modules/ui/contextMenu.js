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
	
};