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
		closable : true,
		title : "Dialog"
	};
	
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.Dialog";
	
	this.centerOnShow = localOpts.centerOnShow ? true : false;
	this.closable = localOpts.centerOnShow ? true : false;
	this.title = localOpts.title;
	
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
	Scriptor.className.add(this.target, "jsDialog");
	Scriptor.body().appendChild(this.target);
	
	this._titlePanel = document.createElement('div');
	this._titlePanel.id = this.divId + '_title';
	this._titlePanel.className = 'jsDialogTitle';
	
	if (this.title)
		this._titlePanel.innerHTML = this.title
	else
		Scriptor.className.add(this._titlePanel, 'jsDialogTitleHidden');
	this.target.insertBefore(this._titlePanel, this.cmpTarget);
	
	this.resize();
	
	this.onDOMAdded();
	
	// redefine component implementation
	/*
	* We need to redefine show / hide for dialogs in order to provide animations!
	*/
	this.resizeImplementation = function() {
		var innerBox = Scriptor.element.getInnerBox(this.target);
		
		var titleHeight = parseInt(Scriptor.className.getComputedProperty(this._titlePanel, 'height'));
		
		this.cmpTarget.style.height = (this.height - titleHeight - innerBox.top - innerBox.bottom) + 'px';
	};
	
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
			
			this.__updatePosition();
				
			Scriptor.className.remove(this.target, 'jsComponentHidden');
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
			
			this.showing = true;
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
			
			this.hiding = true;
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
};
