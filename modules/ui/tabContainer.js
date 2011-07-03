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
	this.CMP_SIGNATURE = "Scriptor.ui.TabContainer";
	
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
	Scriptor.event.registerCustomEvent(this, 'ontabclosed');
	
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
	
	this._tabsContextMenu = new Scriptor.ContextMenu();
	
	this._canHaveChildren = false;
	this._tabs = [];
	this._selectedTabId = null;
	
	// redefine component implementation
	this.resizeImplementation = function() {
		var tabsInnerWidth = this._tabList.cmpTarget.offsetWidth;
		var orignTabsInnerWidth = tabsInnerWidth;
		
		var moreDropDown = document.getElementById(this._tabList.divId + "_more");
		if (moreDropDown)
		{
			var moreOuterLeft = parseInt(Scriptor.className.getComputedProperty(moreDropDown, 'margin-left'));
			var moreOuterRight = parseInt(Scriptor.className.getComputedProperty(moreDropDown, 'margin-right'));
			
			tabsInnerWidth -= (moreDropDown.offsetWidth + moreOuterLeft + moreOuterRight);
		}
		
		var totalTabsWidth = 0;
		var extraTabReached = false;
		for (var n=0; n < this._tabList.cmpTarget.childNodes.length; n++)
		{
			var theTab = this._tabList.cmpTarget.childNodes[n];
			
			var outerLeft = parseInt(Scriptor.className.getComputedProperty(theTab, 'margin-left'));
			var outerRight = parseInt(Scriptor.className.getComputedProperty(theTab, 'margin-right'));
			
			if (isNaN(outerLeft))
				outerLeft = 0;
				
			if (isNaN(outerRight))
				outerRight = 0;
			
			totalTabsWidth += theTab.offsetWidth + outerLeft + outerRight;
			
			if (n == this._tabList.cmpTarget.childNodes.length-1)
				tabsInnerWidth = orignTabsInnerWidth;
				
			if (totalTabsWidth >= tabsInnerWidth)
			{
				if (!this._tabList._showingMore)
					this._tabList.showMore();
				
				if (!extraTabReached)
				{
					this._tabList._extraTabs = n;
					this._updateExtraTabsContextMenu();
					extraTabReached = true;
				}
				
				theTab.style.visibility = "hidden";
			}
			else
			{
				theTab.style.visibility = "visible";
			}
		}
		
		if (totalTabsWidth < tabsInnerWidth)
		{
			if (this._tabList._showingMore)
				this._tabList.hideMore();
				
			this._tabList._extraTabs = this._tabs.length;
		}
		
	};

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
	
	tabNode.innerHTML = '<span>' + theTab.title + '</span>' +
		'<span class="jsTabCloseBtn" id="'+theTab.paneId + '_closeHandler"> </span>';
	if (ndx == this._tabs.length-1)
		this._tabList.cmpTarget.appendChild(tabNode);
	else
		this._tabList.cmpTarget.insertBefore(tabNode, tabs[ndx]);
	
	// add the tab to the tabs page list
	this._pageContainer.addPage(theTab.pane);
	this._pageContainer.activate(this._selectedTabId);
	
	var theTabCloseHandler = document.getElementById(theTab.paneId + '_closeHandler');
	if (!theTab.closable)
	{
		Scriptor.className.add(theTabCloseHandler, 'jsTabCloseHidden');
	}
	else
	{
		Scriptor.className.add(tabNode, 'jsTabClosable');
	}
	
	// event handlers
	Scriptor.event.attach(tabNode, 'onclick', Scriptor.bindAsEventListener(this.selectTab, this, theTab.paneId));
	Scriptor.event.attach(theTabCloseHandler, 'onclick', Scriptor.bindAsEventListener(this.closeTab, this, theTab.paneId));
	
	this.resize();
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
		this._pageContainer.removePage(this._tabs[ndx].pane, destroy);
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
		
		this.resize();
	}
};

Scriptor.TabContainer.prototype.selectTab = function(e, ref) {
	if (arguments.length == 1)	// not a click event
	{
		ref = e;
	}
	
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
		if (arguments.length > 1)
		{
			e.selectedTabId = this._selectedTabId;
			e.selecting = ndx;
			e = Scriptor.event.fire(this, 'onselect', e);
			
			if (e.returnValue == false)
			{
				Scriptor.event.cancel(e, true);
				return false;
			}
		}
		
		Scriptor.className.remove(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
		
		if (this._tabs[ndx])
		{
			this._selectedTabId = this._tabs[ndx].paneId;
			
			for (var n=0; n < this._tabsContextMenu.items.length; n++)
			{
				this._tabsContextMenu.checkItem(n, (n == ndx-this._tabList._extraTabs));
			}
		}
		
		Scriptor.className.add(document.getElementById(this._selectedTabId + "_tablabel"), 'jsTabSelected');
		this._pageContainer.activate(this._selectedTabId);
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

Scriptor.TabContainer.prototype.getSelectedTab = function() {
	for (var n=0; n < this._tabs.length; n++)
	{
		if (this._tabs[n].paneId == this._selectedTabId)
			return this._tabs[n].pane;
	}
	
	return null;
};

Scriptor.TabContainer.prototype.setTitle = function(ref, title) {
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
		this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML = title;
		this.resize();
	}
};

Scriptor.TabContainer.prototype.setClosable = function(ref, closable) {
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
		var theTab = this._tabList.cmpTarget.childNodes[ndx];
		var theTabCloseHandler = document.getElementById(this._tabs[ndx].paneId + "_closeHandler");
		if (closable)
		{
			Scriptor.className.add(theTab, 'jsTabClosable');
			Scriptor.className.remove(theTabCloseHandler, 'jsTabCloseHidden');
		}
		else
		{
			Scriptor.className.remove(theTab, 'jsTabClosable');
			Scriptor.className.add(theTabCloseHandler, 'jsTabCloseHidden');
		}
		
		this.resize();
	}
};

Scriptor.TabContainer.prototype.closeTab = function(e, ref) {
	if (arguments.length == 1)	// not a click event
	{
		ref = e;
	}
	
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
		if (arguments.length > 1)
		{
			e.selectedTabId = this._selectedTabId;
			e.closing = ndx;
			e = Scriptor.event.fire(this, 'ontabclosed', e);
			
			if (e.returnValue == false)
			{
				Scriptor.event.cancel(e, true);
				return false;
			}
		}
		
		this.removeTab(ndx);
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

Scriptor.TabContainer.prototype._updateExtraTabsContextMenu = function()
{
	var optsLength = this._tabs.length - this._tabList._extraTabs;
	
	if (this._tabsContextMenu.items.length != optsLength)
	{
		if (this._tabsContextMenu.items.length > optsLength)	// remove extra options
		{
			while (this._tabsContextMenu.items.length > optsLength)
				this._tabsContextMenu.removeItem(0);
		}
		else	// add new options
		{
			for (var n = 0; n < optsLength - this._tabsContextMenu.items.length; n++)
			{
				var tabNdx = this._tabList._extraTabs+n;
				this._tabsContextMenu.addItem({
					label : this._tabs[tabNdx].title,
					onclick : Scriptor.bindAsEventListener(function(e, tabNdx, xtraTabs) {
						this.selectTab(tabNdx);
					}, this, tabNdx, this._tabList._extraTabs)
				}, 0);
			}
		}
		
		var ndx = null;
		for (var n = 0; n < this._tabs.length; n++)
		{
			if (this._tabs[n].paneId == this._selectedTabId)
			{
				ndx = n;
				break;
			}
		}
		
		for (var n=0; n < this._tabsContextMenu.items.length; n++)
		{
			this._tabsContextMenu.checkItem(n, (n == ndx-this._tabList._extraTabs));
		}
		
	}
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
	
	// first ndx of extra tab not visible
	this._extraTabs = 0;
	this._showingMore = false;
	
	// add the "more" dropdown button
	var moreSpan = document.createElement('span');
	moreSpan.id = this.divId + '_more';
	moreSpan.className = 'jsTabListDropdown jsTabListDropdownHidden';
	this.target.appendChild(moreSpan);
	moreSpan.innerHTML = ' ';
	
	Scriptor.className.add(this.cmpTarget, 'jsTabListInner');
	
	// add "more" dropdown button onclick event
	Scriptor.event.attach(moreSpan, 'onclick', Scriptor.bindAsEventListener(this.onDropdownClick, this));
};

TabListObj.prototype.onDropdownClick = function(e) {
	if (!e) e = window.event;
	
	this.parent._tabsContextMenu.show(e);
	
	Scriptor.event.cancel(e, true);
	return false;
};

TabListObj.prototype.showMore = function() {
	if (!this._showingMore)
	{
		Scriptor.className.remove(document.getElementById(this.divId + '_more'), 'jsTabListDropdownHidden');
		this._showingMore = true;
	}
};

TabListObj.prototype.hideMore = function() {
	if (this._showingMore)
	{
		Scriptor.className.add(document.getElementById(this.divId + '_more'), 'jsTabListDropdownHidden');
		this._showingMore = false;
	}
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
	
};

TabPageContainer.prototype.addPage = function(pane) {
	Scriptor.className.add(pane.target, "jsTabPage");
	this.addChild(pane);
};

TabPageContainer.prototype.removePage = function(pane, destroy) {
	this.removeChild(pane)
	
	if (destroy)
		pane.destroy();
};

TabPageContainer.prototype.activate = function(paneId) {
	for (var n=0; n < this.components.length; n++)
		this.components[n].hide();
		
	for (var n=0; n < this.components.length; n++)
	{
		if (this.components[n].divId == paneId)
		{
			this.components[n].show();
		}
	}
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
