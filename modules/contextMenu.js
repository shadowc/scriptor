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
var context_menus = {
	stack : [],
	
	// to hide the active context menu
	hide_actives : function() {
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
	
	this.items = items;
	this.Width = !isNan(Number(localOpts.width)) ? Number(localOpts.width) : 120;
	this.Height = 0;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.visible = false;
	
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
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
		
		var target = this.divElem;
		target.className = 'contextMenu scriptor';
		target.innerHTML = '';
		target.style.display = 'block';
		
		
		// TODO: render elements and calculate this.Height
		
		this.visible = true;
		
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
	}
};