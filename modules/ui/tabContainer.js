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

Scriptor.TabContainer.prototype.addTab = function(opts, panel, ndx) {
	var localOpts = {
		title : '',
		paneId : panel.divId,
		pane : panel,
		closable : false
	};
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.pane || !localOpts.pane.CMP_SIGNATURE || !localOpts.pane.created)
		return;
	

	if (typeof(ndx) == 'undefined')
		ndx = this._tabs.length;
	else if (ndx < 0 || ndx > this._tabs.length)
		ndx = this._tabs.length;
	
	// add the tab logically
	var theTab = new TabInstance(localOpts);
	if (ndx < this._tabs.length)
		this._tabs.splice(ndx, 0, theTab);
	else
		this._tabs.push(theTab);
	
	// add the tab label to DOM
	var tabs = this._tabList.cmpTarget.childNodes;
	var tabNode = document.createElement('div');
	tabNode.id = theTab.paneId + "_tablabel";
	
	tabNode.className = 'jsTabLabel';
	if (theTab.closable)
		Scriptor.className.add(tabNode, 'jsTabClosable');
	
	// select the frist tab added
	if (this._tabs.length == 1)
	{
		this._selectedTabId = theTab.paneId;
		Scriptor.className.add(tabNode, 'jsTabSelected');
	}
	
	// TODO: add close button
	tabNode.innerHTML = '<span>' + theTab.title + '</span>';
	if (ndx == this._tabs.length-1)
		this._tabList.cmpTarget.appendChild(tabNode);
	else
		this._tabList.cmpTarget.insertBefore(tabNode, tabs[ndx]);
	
	// add the tab to the tabs page list
	this._pageContainer.addPage(theTab.pane);
	this._pageContainer.activate(this._selectedTabId);
	
	// event handlers
	Scriptor.event.attach(tabNode, 'onclick', Scriptor.bindAsEventListener(this.selectTab, this, theTab.paneId));
};

Scriptor.TabContainer.prototype.removeTab = function(ref, destroy) {
	if (typeof(destroy) == 'undefined')
		destroy = true;
	
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		// deselect tab
		var reselect = false;
		if (this._selectedTabId == this._tabs[ndx].paneId)
			var reselect = true
		
		// remove tab
		this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
		this._pageContainer.removePage(this._tabs[ndx].paneId, destroy);
		this._tabs.splice(ndx, 1);
		
		if (reselect)
		{
			if (this._tabs[ndx])
				this._selectedTabId = this._tabs[ndx].paneId;
			else if (this._tabs.length)
				this._selectedTabId = this._tabs[this._tabs.length-1].paneId;
			else
				this._selectedTabId = null;
				
			Scriptor.className.add(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
			this._pageContainer.activate(this._selectedTabId);
		}
	}
};

Scriptor.TabContainer.prototype.selectTab = function(e, ref) {
	if (arguments.length == 1)	// not a click event
		ref = e;
		
	var ndx = null;
	
	// identify tab
	if (typeof(ref) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(ref) == 'string')
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == ref)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (ref.CMP_SIGNATURE)
	{
		for (var n=0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].pane === ref)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		Scriptor.className.remove(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
		
		if (this._tabs[ndx])
			this._selectedTabId = this._tabs[ndx].paneId;
		
		Scriptor.className.add(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
		this._pageContainer.activate(this._selectedTabId);
	}
};

Scriptor.TabContainer.prototype.getSelectedTab = function() {
	for (var n=0; n < this._tabs.length; n++)
	{
		if (this._tabs[n].paneId == this._selectedTabId)
			return this._tabs[n].pane;
	}
	
	return null;
};

// private tab container inner components
/* This is the component that represents the list of tabs in the TabContainer */
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

/* This is the component that holds the Panels iteself (or other components) */
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
	
	this._pages = {};
};

TabPageContainer.prototype.addPage = function(pane) {
	Scriptor.className.add(pane.target, "jsTabPage");
	this._pages[pane.divId] = pane;
};

TabPageContainer.prototype.removePage = function(paneId, destroy) {
	if (destroy)
		this._pages[paneId].destroy();
		
	delete this._pages[paneId];
};

TabPageContainer.prototype.activate = function(paneId) {
	if (paneId)
		this.setContent(this._pages[paneId]);
	else
		this.setContent(null);
};

/* this object represents a single tab with its title and its component */
var TabInstance = function(opts) {
	var localOpts = {
		title : '',
		paneId : null,
		pane : null,
		closable : false
	};
	Scriptor.mixin(localOpts, opts);
	
	this.title = localOpts.title;
	this.paneId = localOpts.paneId;
	this.pane = localOpts.pane;
	this.closable = localOpts.closable;
};
