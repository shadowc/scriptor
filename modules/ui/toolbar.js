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
	Scriptor.mixin(this, cmp);
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
	
	this.buttons = [];
	this.nextBtnId = 0;
	this._showingMore = false;
	this._extraBtns = 1;
	this._showingExtraButtons = false;
	this._checkMenuBind = null;
	
	// redefine component implementation
	this._registeredEvents = [];
	this.DOMAddedImplementation = function() {
		for (var n=0; n < this.buttons.length; n++)
			this.addClickEvent(this.buttons[n]);
		
		// add "more" dropdown button onclick event
		if (this._moreSpan)
			this._registeredEvents.push(Scriptor.event.attach(this._moreSpan, 'onclick', Scriptor.bindAsEventListener(this.onDropdownClick, this)));
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
		
	};	

	this.resizeImplementation = function() {
		if (this._showingExtraButtons)
			this.hideDropDown();
		
		var btnsInnerWidth = this.cmpTarget.offsetWidth;
		var orignBtnsInnerWidth = btnsInnerWidth;
		
		// drop down width calculation (only if displayed)
		var moreOuterLeft = parseInt(Scriptor.className.getComputedProperty(this._moreSpan, 'margin-left'));
		var moreOuterRight = parseInt(Scriptor.className.getComputedProperty(this._moreSpan, 'margin-right'));
		btnsInnerWidth -= (this._moreSpan.offsetWidth + moreOuterLeft + moreOuterRight);
		
		var totalBtnsWidth = 0;
		var extraBtnReached = false;
		for (var n=0; n < this.cmpTarget.childNodes.length; n++)
		{
			var theBtn = this.cmpTarget.childNodes[n];

			var outerLeft = parseInt(Scriptor.className.getComputedProperty(theBtn, 'margin-left'));
			var outerRight = parseInt(Scriptor.className.getComputedProperty(theBtn, 'margin-right'));
				
			if (isNaN(outerLeft))
				outerLeft = 0;
				
			if (isNaN(outerRight))
				outerRight = 0;
			
			totalBtnsWidth += theBtn.offsetWidth + outerLeft + outerRight;
			
			if (n == this.cmpTarget.childNodes.length-1)
				btnsInnerWidth = orignBtnsInnerWidth;
				
			if (totalBtnsWidth >= btnsInnerWidth)
			{
				if (!this._showingMore)
					this.showMore();
				
				if (!extraBtnReached)
				{
					this._extraBtns = n;
					extraBtnReached = true;
				}
				
				theBtn.style.visibility = "hidden";
			}
			else
			{
				theBtn.style.visibility = "visible";
			}
		}
		
		if (totalBtnsWidth < btnsInnerWidth)
		{
			if (this._showingMore)
				this.hideMore();
				
			this._extraBtns = this.buttons.length;
		}
		
	};
	
	this.destroyImplementation = function() {
		this._extraButtons.parentNode.removeChild(this._extraButtons);
	};
	
	this.create();
	Scriptor.className.add(this.target, "jsToolbar");
	
	// add the "more" dropdown button
	this._moreSpan = document.createElement('span');
	this._moreSpan.id = this.divId + '_more';
	this._moreSpan.className = 'jsToolbarDropdown jsToolbarDropdownHidden';
	this.target.appendChild(this._moreSpan);
	this._moreSpan.innerHTML = ' ';
	
	/* if we created the component and DOMAddedImplementation was called instantly,
	  we need to attach the moreSpan event here, because it was not
	  present before
	*/
	if (this.inDOM)
		this._registeredEvents.push(Scriptor.event.attach(this._moreSpan, 'onclick', Scriptor.bindAsEventListener(this.onDropdownClick, this)));
		
	this._extraButtons = document.createElement('div');
	this._extraButtons.id = this.divId + "_extraBtns";
	this._extraButtons.className = 'jsComponent jsContextMenu jsToolbarExtraPanel jsToolbarExtraPanelHidden';
	Scriptor.body().appendChild(this._extraButtons);
	
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
*   onContentAdded: alternatively, call this function set contents to provide custom HTML
*     for the button. All other options will be ignored. Function first parameter
*     is the empty htmlElement of the button wrapper to be filled.
*/
Scriptor.Toolbar.prototype.addButton = function(opts, ndx) {
	var theBtn = {
		label : '',
		id : this.getNextBtnId(),
		className : '',
		onclick : null,
		onContentAdded : null,
		target: null
	};
	Scriptor.mixin(theBtn, opts);
	
	theBtn.target = document.createElement('span');
	theBtn.target.id = this.divId + '_btn_' + theBtn.id;
	
	var template = ''	
	if (typeof(theBtn.onContentAdded) != 'function')
	{
		template = '<a' + (theBtn.className ? ' class="' + theBtn.className + '" ' : '') + ' href="'+Scriptor.getInactiveLocation()+'">' + theBtn.label + '</a>';
	}
	
	if (ndx === undefined)
		ndx = this.buttons.length;
		
	if (!isNaN(Number(ndx)) && ndx >= 0 && ndx <= this.buttons.length)
	{
		if (this._showingExtraButtons)
			this.hideDropDown();
		
		if (ndx == this.buttons.length)
		{
			this.buttons.push(theBtn);
			this.cmpTarget.appendChild(theBtn.target);
		}
		else
		{
			this.buttons.splice(ndx, 0, theBtn);
			this.cmpTarget.insertBefore(theBtn.target, this.cmpTarget.childNodes[ndx]);
		}
		
		theBtn.target.innerHTML = template;
		
		if (this.inDOM)
		{
			this.addClickEvent(this.buttons[ndx]);
			this.resize();
		}
	}
};

/*
* Scriptor.Toolbar.removeButton
*
* Internal use only
*/
Scriptor.Toolbar.prototype.addClickEvent = function(btn) {
	if (typeof(btn.onContentAdded) == 'function')
	{
		btn.target.innerHTML = '';
		btn.onContentAdded();
	}
	else
	{
		if (typeof(btn.onclick) == 'function')
			this._registeredEvents.push(Scriptor.event.attach(btn.target.firstChild, 'onclick', btn.onclick));
	}
};

/*
* Toolbar.getNextBtnId()
*   Since every button needs a unique id field, we will assign one automatically if
*   not provided
*/
Scriptor.Toolbar.prototype.getNextBtnId = function() {
	var found = true;
	while (found)
	{
		found = false;
		var btnId = this.nextBtnId++;
		for (var n=0; n < this.buttons.length; n++)
		{
			if (this.buttons[n].id == btnId)
			{
				found = true;
				break;
			}
		}
	}
	
	return btnId;
};

/*
* Scriptor.Toolbar.removeButton
*
* Removes a button specified by its index, id or by providing the
* button object as stored in Scriptor.Toolbar.buttons array
*/
Scriptor.Toolbar.prototype.removeButton = function(identifier) {
	var ndx = null;
	
	// identify tab
	if (typeof(identifier) == 'number')
	{
		ndx = ref;
	}
	else if (typeof(identifier) == 'string')
	{
		for (var n=0; n < this.buttons.length; n++)
		{
			if (this.buttons[n].id == identifier)
			{
				ndx = n;
				break;
			}
		}
	}
	else if (typeof(identifier) == 'object')
	{
		for (var n=0; n < this.buttons.length; n++)
		{
			if (this.buttons[n] === identifier)
			{
				ndx = n;
				break;
			}
		}
	}
	
	if (ndx !== null)
	{
		if (this._showingExtraButtons)
			this.hideDropDown();
		
		for (var n=0; n < this._registeredEvents.length; n++)
		{
			if (this._registeredEvents[n][0].parentNode == this.buttons[ndx].target)
			{
				Scriptor.event.detach(this._registeredEvents[n]);
				this._registeredEvents.splice(n, 1);
				break;
			}
		}
		this.buttons.splice(ndx, 1);
		
		this.cmpTarget.removeChild(this.buttons[ndx].target);
		this.resize();
	}
};

/*
* Scriptor.Toolbar.showMore
*
* Internal use only
*/
Scriptor.Toolbar.prototype.showMore = function() {
	Scriptor.className.remove(this._moreSpan, "jsToolbarDropdownHidden");
	this._showingMore = true;
};

/*
* Scriptor.Toolbar.hideMore
*
* Internal use only
*/
Scriptor.Toolbar.prototype.hideMore = function() {
	Scriptor.className.add(this._moreSpan, "jsToolbarDropdownHidden");
	this._showingMore = false;
	
	if (this._showingExtraButtons)
		this.hideDropDown();
};

/*
* Scriptor.Toolbar.onDropdownClick
*
* Internal use only
*
* TODO: replace with a floating panel (to be defined)
*/
Scriptor.Toolbar.prototype.onDropdownClick = function(e) {
	if (!e) e = window.event;
	
	if (!this._showingExtraButtons)
	{
		// trusting that appendChild effectively removes the DOM element
		// from DOM before appending, keeping its associated events!
		for (var n=this._extraBtns; n < this.buttons.length; n++) {
			this._extraButtons.appendChild(this.buttons[n].target);
			this.buttons[n].target.style.visibility = 'visible';
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
		
		if (x + this._extraButtons.offsetWidth > Scriptor.body().offsetWidth)
			x = x-this._extraButtons.offsetWidth;
		if (y + this._extraButtons.offsetHeight > Scriptor.body().offsetHeight)
			y = y-this._extraButtons.offsetHeight;
			
		this._extraButtons.style.top = y + 'px';
		this._extraButtons.style.left = x + 'px';
		
		if (this._checkMenuBind)
			Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
		setTimeout(Scriptor.bind(function() {	
			Scriptor.event.attach(document, 'onclick', this._checkMenuBind = Scriptor.bind(this.checkDropDown, this));
		}, this), 1);
		
		Scriptor.className.remove(this._extraButtons, "jsToolbarExtraPanelHidden");
		this._showingExtraButtons = true;
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* Scriptor.Toolbar.checkDropDown
*
* Internal use only, hides dropDown component on mouse click
*/
Scriptor.Toolbar.prototype.checkDropDown = function(e) {
	if (this._checkMenuBind)
		Scriptor.event.detach(document, 'onclick', this._checkMenuBind);
		
	// always hide after click?
	this.hideDropDown();
};

/*
* Scriptor.Toolbar.hideDropDown
*
* Internal use only
*
* TODO: replace with a floating panel (to be defined)
*/
Scriptor.Toolbar.prototype.hideDropDown = function() {
	if (this._showingExtraButtons)
	{
		// trusting that appendChild effectively removes the DOM element
		// from DOM before appending, keeping its associated events!
		while (this._extraButtons.childNodes.length) {
			this._extraButtons.childNodes[0].style.visibility = 'hidden';
			this.cmpTarget.appendChild(this._extraButtons.childNodes[0]);
		}
		
		this._showingExtraButtons = false;
	
		Scriptor.className.add(this._extraButtons, "jsToolbarExtraPanelHidden");
	}
};