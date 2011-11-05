/*
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
	Scriptor.mixin(this, cmp);
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

	// if the div exists and has contents, put them in the proper place
	var tmpContents = '';
	if (document.getElementById(this.divId))
	{
		var elem = document.getElementById(this.divId);
		tmpContents = elem.innerHTML;
		elem.innerHTML = '';
	}
	
	this.create();

	if (tmpContents)
		this.setContent(tmpContents);

	Scriptor.className.add(this.target, "jsPanel");
};
