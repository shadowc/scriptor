/*
*
* Scriptor TabContainer
*
* Panel component class
*
*/

Scriptor.TabContainer = function(opts) {
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
	this.CMP_SIGNATURE = "Scriptor.ui.TabContainer"
	
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
	Scriptor.className.add(this.target, "jsTabContainer");
	
	this._tabList = new TabListObj({
		id : this.divId + '_tabList',
		region : "top",
		className : 'jsTabList'
	});
	this.addChild(this._tabList);
	
	this._pageContainer = new TabPageContainer({
		id : this.divId + '_pageContainer',
		region : "center",
		className : 'jsPageContainer'
	});
	this.addChild(this._pageContainer);
	
	this._canHaveChildren = false;
	this._tabs = [];
	this._selectedTabId = null;
};

Scriptor.TabContainer.prototype.addTab = function(title, panel, ndx) {
	
};

// private tab container inner components
var TabListObj = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : false
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
	this.CMP_SIGNATURE = "Scriptor.ui.private.TabListObj";
	
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
	
	Scriptor.className.add(this.cmpTarget, 'jsTabListInner');
};

var TabPageContainer = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : false
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
	this.CMP_SIGNATURE = "Scriptor.ui.private.TabPageContainer";
	
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
};
