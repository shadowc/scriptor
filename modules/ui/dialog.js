/* JavaScript Document
*
* Dialog system for the Scriptor framework
*
* This object is part of the scriptor framework
*/

/*
* Dialog
*
* Scriptor Dialog component
*
* options are:
* 	title: The dialog title, if null, no title will be shown
* 	resizable: adds a resize handler to resize the dialog
*	centerOnShow: center dialog on screen on show
* 	closable: true if you want a close button on the title
*/
Scriptor.Dialog = function(opts)
{
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		centerOnShow : true,
		x : 0,
		y : 0,
		width: 400,
		height: 300,
		resizable: false,
		closable : true,
		title : "Dialog",
		animation: false
	};
	
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.Dialog";
	
	this.centerOnShow = localOpts.centerOnShow ? true : false;
	this.closable = localOpts.closable ? true : false;
	this.title = localOpts.title;
	this.animation = localOpts.animation;
	
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
	
	// redefine component implementation
	/*
	* We need to redefine show / hide for dialogs in order to provide animations!
	*/
	
	this.showing = false;
	this.show = function() {
		var e = Scriptor.event.fire(this, 'onbeforeshow');
		if (!e.returnValue)
			return;
		
		if (!this.created)
			this.create();

		if (!this.visible && this.target && !this.showing && !this.hiding) {
			if (this.centerOnShow)
			{
				this.x = (Scriptor.body().offsetWidth / 2) - (this.width / 2);
				this.y = (Scriptor.body().offsetHeight /2) - (this.height / 2);
			}
			
			this.showing = true;
			this.__updatePosition();
			Scriptor.className.remove(this.target, 'jsComponentHidden');

			if (this.animation) {
				this.target.style.opacity = '0';
				this.target.style.mozOpacity = '0';

				var eId = Scriptor.effects.scheduleEffect({
					elem : this.target,
					property : ['style.opacity', 'style.mozOpacity'],
					start : [0, 0],
					end : [1, 1],
					unit : [0, 0],
					duration : 200,
					callback : Scriptor.bind(this.doShow, this)
				});
				Scriptor.effects.start(eId);
			} else {
				this.doShow();
			}
		}
	};
	
	this.doShow = function() {
		this.target.style.opacity = '1';
		this.target.style.mozOpacity = '1';
		
		this.showing = false;
		this.visible = true;
		
		for (var n=0; n < this.components.length; n++) 
			this.components[n].show();	
		
		if (this.parent)
			this.parent.resize();
		else
			this.resize();	// we're doing component layout here!
		
		this.focus();
		
		Scriptor.event.fire(this, 'onshow');
	};
	
	this.hiding = false;
	this.hide = function() {
		var e = Scriptor.event.fire(this, 'onbeforehide');
		if (!e.returnValue)
			return;
		
		if (this.visible && this.target && !this.hiding && !this.showing) {
			
			this.hiding = true;

			if (this.animation) {
				this.target.style.opacity = '0';
				this.target.style.mozOpacity = '0';

				var eId = Scriptor.effects.scheduleEffect({
					elem : this.target,
					property : ['style.opacity', 'style.mozOpacity'],
					start : [1, 1],
					end : [0, 0],
					unit : [0, 0],
					duration : 200,
					callback : Scriptor.bind(this.doHide, this)
				});
				
				Scriptor.effects.start(eId);
			} else {
				this.doHide();
			}
		}
	};
	
	this.doHide = function() {
		this.target.style.opacity = '1';
		this.target.style.mozOpacity = '1';
		
		Scriptor.className.add(this.target, 'jsComponentHidden');
		this.hiding = false;
		this.visible = false;
		
		for (var n=0; n < this.components.length; n++) 
			this.components[n].hide();
		
		if (this.parent)
			this.parent.resize();
		else
			this.resize();	// we're doing component layout here!
			
		this.passFocus();
		
		Scriptor.event.fire(this, 'onhide');
	};

	// replace the contents of the component's target div
	// or child target with the passed HTMLElement or component
	this.setContent = function(ref) {
		if (ref) {
			if (ref.CMP_SIGNATURE) {
				this._bodyPanel.addChild(ref);
				return true;
			} else if (Scriptor.isHtmlElement(ref)) {
				this._bodyPanel.cmpTarget.appendChild(ref);
				this.resize();
				return true;
			} else if (typeof(ref) == "string") {
				this._bodyPanel.cmpTarget.innerHTML = ref;
				this.resize();
				return true;
			}
		}

		return false;
	};
	
	// create component
	this.create();
	Scriptor.className.add(this.target, "jsDialog");
	Scriptor.body().appendChild(this.target);
	
	this.resize();
	this.onDOMAdded();
	
	this._titlePanel = new Scriptor.Panel({
		"id": this.divId + "_title",
		"style": "height: 22px; width: 100%;",
		"className": "jsDialogTitle",
		"region": "top"
	});
	this.addChild(this._titlePanel);

	this._titlePanel.setContent('<span id="'+this.divId+'_titleText">'+this.title+'</span><span id="'+this.divId+'_closeHandle" class="jsDialogClose"></span>');

	this._closeHandle = this._titlePanel.cmpTarget.firstChild.nextSibling;
	if (!this.title) {
		Scriptor.className.add(this._titlePanel.cmpTarget, 'jsDialogTitleHidden');
	}

	if (!this.closable && this._closeHandle) {
		Scriptor.className.add(this._closeHandle, 'jsDialogCloseHidden');
	}

	Scriptor.event.attach(this._closeHandle, 'onclick', Scriptor.bind(this.hide, this));


	this._bodyPanel = new Scriptor.Panel({
		"id": this.divId + "_body",
		"style": "width: 100%; height: 100%; padding: 5px 5px 27px 5px;",
		"className": "jsDialogBody",
		"region": "center"
	});
	this.addChild(this._bodyPanel);

	
	
	// add drag events to title
	Scriptor.event.attach(this._titlePanel.cmpTarget, 'onmousedown', Scriptor.bindAsEventListener(this._startDragging, this));
	this._dragMoveEvent = null;
	this._dragDropEvent = null;
	this._cacheX = 0;
	this._cacheY = 0;
	
	

	if (localOpts.resizable) {
		var resizeHandle = document.createElement('div');
		resizeHandle.className = 'jsDialogResize';
		this.cmpTarget.appendChild(resizeHandle);
		Scriptor.event.attach(resizeHandle, 'onmousedown', Scriptor.bindAsEventListener(this._startResizing, this));
	}	
};

Scriptor.Dialog.prototype._calculateXY = function (e) {
	var x = 0, y = 0;

	if (e) {
		if (typeof(e.pageX) == 'number') {
			x = e.pageX;
			y = e.pageY;
		} else {
			if (typeof(e.clientX) == 'number') {
				x = (e.clientX + document.documentElement.scrollLeft);
				y = (e.clientY + document.documentElement.scrollTop);
			} else {
				x = 0;
				y = 0;
			}
		}
	}

	return {
		x: x,
		y: y
	};
};

Scriptor.Dialog.prototype._startResizing = function(e) {
	if (!e) e = window.event;
	
	this._resizingMoveEvent = Scriptor.event.attach(document, 'onmousemove', Scriptor.bindAsEventListener(this._moveResizing, this));
	this._resizingDropEvent = Scriptor.event.attach(document, 'onmouseup', Scriptor.bindAsEventListener(this._stopResizing, this));
	
	var coords = this._calculateXY(e);
	
	this._cacheResizingX = coords.x;
	this._cacheResizingY = coords.y;
	
	Scriptor.event.cancel(e, true);
};

Scriptor.Dialog.prototype._moveResizing = function(e) {
	if (!e)	e = window.event;
	
	var coords = this._calculateXY(e);
	
	var deltaX = coords.x - this._cacheResizingX;
	var deltaY = coords.y - this._cacheResizingY;
	
	this.resizeTo({
		width: this.width + deltaX,
		height: this.height + deltaY
	});

	this._cacheResizingX = coords.x;
	this._cacheResizingY = coords.y;
	
	Scriptor.event.cancel(e, true);
};

Scriptor.Dialog.prototype._stopResizing = function(e) {
	if (!e)	e = window.event;
	
	Scriptor.event.detach(this._resizingMoveEvent);
	Scriptor.event.detach(this._resizingDropEvent);
	
	this._resizingMoveEvent = null;
	this._resizingDropEvent = null;
	
	Scriptor.event.cancel(e, true);
};


Scriptor.Dialog.prototype.getTitle = function() {
	return this._titlePanel.cmpTarget.firstChild.innerHTML;
};

Scriptor.Dialog.prototype.setTitle = function(title) {
	return this._titlePanel.cmpTarget.firstChild.innerHTML = title;
};

Scriptor.Dialog.prototype.setClosable = function(closable) {
	if (!closable && this._closeHandle) {
		Scriptor.className.add(this._closeHandle, 'jsDialogCloseHidden');
	} else if (this._closeHandle){
		Scriptor.className.remove(this._closeHandle, 'jsDialogCloseHidden');
	}
	this.closable = closable;
};

Scriptor.Dialog.prototype._startDragging = function(e) {
	if (!e)	e = window.event;
	
	this._dragMoveEvent = Scriptor.event.attach(document, 'onmousemove', Scriptor.bindAsEventListener(this._moveDrag, this));
	this._dragDropEvent = Scriptor.event.attach(document, 'onmouseup', Scriptor.bindAsEventListener(this._stopDragging, this));
	
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
	
	this._cacheX = x;
	this._cacheY = y;
	
	Scriptor.event.cancel(e, true);
};

Scriptor.Dialog.prototype._moveDrag = function(e) {
	if (!e)	e = window.event;
	
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
	
	var deltaX = x - this._cacheX;
	var deltaY = y - this._cacheY;
	
	this.x += deltaX;
	this.y += deltaY;
	this.__updatePosition();
	
	this._cacheX = x;
	this._cacheY = y;
	
	Scriptor.event.cancel(e, true);
};

Scriptor.Dialog.prototype._stopDragging = function(e) {
	if (!e)	e = window.event;
	
	Scriptor.event.detach(this._dragMoveEvent);
	Scriptor.event.detach(this._dragDropEvent);
	
	this._dragMoveEvent = null;
	this._dragDropEvent = null;
	
	Scriptor.event.cancel(e, true);
};
