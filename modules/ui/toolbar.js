/*
*
* Scriptor Toolbar
*
* Toolbar component class
*
*/

Scriptor.Toolbar = function(opts) {
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
	this.CMP_SIGNATURE = "Scriptor.ui.Toolbar";
	
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
	Scriptor.className.add(this.target, "jsToolbar");
	
	this.buttons = [];
};

/*
* Scriptor.Toolbar.addButton
*
* Adds a toolbar button at the specified index
* 
* Parameters:
*   opts: button options
*   ndx: optional number defining the index to insert the button at
*   
* Options:
*   label: the label of the button
*   className: a value to be set as classname of the button
*   onclick: callback function for click on button
*   contents: alternatively, set contents to provide custom HTML
*     for the button. All other options will be ignored.
*/
Scriptor.Toolbar.prototype.addButton = function(opts, ndx) {
	var localOpts = {
		label : '',
		className : '',
		onclick : null,
		contents : null
	};
};

/*
* Scriptor.Toolbar.removeButton
*
* Removes a button specified by its index or by providing the
* button object as stored in Scriptor.Toolbar.buttons array
*/
Scriptor.Toolbar.prototype.removeButton = function(identifier) {
	
};
