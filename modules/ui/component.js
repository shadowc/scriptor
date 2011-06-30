/*
*
* Component.js
*
* Abstract class defining all Scriptor.ui basic properties.
*
* All Scriptor.ui components are derived and created from this class
*
*/

/*
* Internal component class to derive all widgets from
*/
var Component = {
	get : function(opts) {
		
		var localOpts = {
			id : null,
			region : "center",
			style : "",
			className : "",
			width : null,
			height : null,
			x : null,
			y : null,
			canHaveChildren : false,
			hasInvalidator : false,
			resizable : false,
			minHeight : null,
			maxHeight : null,
			minWidth : null,
			maxWidth : null
		};
		
		Scriptor.mixin(localOpts, opts);
		if (!localOpts.divId)
			localOpts.divId = __getNextHtmlId();
		
		var cmp = {
			CMP_SIGNATURE : "Scriptor.ui.Component",
			divId : localOpts.id,
			region : localOpts.region,
			style : localOpts.style,
			className : localOpts.className,
			target : null,
			cmpTarget : null,
			invalidator : null,
			canHaveChildren : localOpts.canHaveChildren,
			hasInvalidator : localOpts.hasInvalidator,
			
			created : false,
			visible : false,
			x : localOpts.x,
			y : localOpts.y,
			width : localOpts.width,
			height : localOpts.height,
			resizable : localOpts.resizable,
			minHeight : localOpts.minHeight,
			maxHeight : localOpts.maxHeight,
			minWidth : localOpts.minWidth,
			maxWidth : localOpts.maxWidth,
			_percentWidth : null,
			_percentHeight : null,
			_origWidth : null,
			zIndexCache : 1,
			
			components : [],
			parent : null,
			hasFocus : false,
			
			componentOffset : {
				parentX : 0,
				parentY : 0,
				windowX : 0,
				windowY : 0
			},
			
			// basic functions
			// List of functions to be optionally overriden by children
			createImplementation : function () {},
			showImplementation : function() {},
			resizeImplementation : function() {},
			focusImplementation : function() {},
			blurImplementation : function() {},
			hideImplementation : function() {},
			destroyImplementation : function() {},
			
			focus : function(e) {
				if (!e)
					e = window.event;
					
				if (!this.hasFocus) {
					this.zIndexCache = this.target.style.zIndex ? Number(this.target.style.zIndex) : 1;
					this.target.style.zIndex = this.zIndexCache +1;
					
					if (this.parent && this.parent.CMP_SIGNATURE)
						for (var n=0; n < this.parent.components.length; n++) {
							if (this.parent.components[n].hasFocus) {
								this.parent.components[n].blur();
								break;
							}
						}
					
					this.focusImplementation();
					Scriptor.event.fire(this, 'onfocus');
					
					this.hasFocus = true;
					Scriptor.className.add(this.target, 'jsComponentFocused');
				}
				
				return false;
			},
			
			blur : function() {
				if (this.hasFocus) {
					this.target.style.zIndex = this.zIndexCache;
					
					this.blurImplementation();
					Scriptor.event.fire(this, 'onblur');
						
					this.hasFocus = false;
					Scriptor.className.remove(this.target, 'jsComponentFocused');
				}
			},
			
			passFocus : function() {
				if (this.hasFocus) {
					if (this.parent && this.parent.CMP_SIGNATURE) {
						if (this.parent.components.length > 1) {
							// determine the component with focus
							var focusedCmp = false;
							for (var n=0; n < this.parent.components.length; n++) {
								if (this.parent.components[n].hasFocus) {
									focusedCmp = n;
									break;
								}
							}
							
							// give focus to the next visible component in the list
							var gaveFocus = false;
							var startingPoint = (focusedCmp == this.parent.components.length-1) ? 0 : focusedCmp+1;
							for (var n=startingPoint; n < this.parent.components.length; n++) {
								if (this.parent.components[n].visible && n != focusedCmp) {
									this.parent.components[n].focus();
									gaveFocus = true;
									break;
								}
							}
							
							// not found in the list from middle to end, so search for elements before
							if (!gaveFocus && startingPoint > 0) {
								for (var n=0; n < startingPoint; n++) {
									if (this.parent.components[n].visible && n != focusedCmp) {
										this.parent.components[n].focus();
										gaveFocus = true;
										break;
									}
								}
							}
							
							// if no visible component is present, just blur
							if (!gaveFocus)
								this.blur();
						}
						else {
							this.blur();
						}
					}
					else {
						this.blur();
					}
				}				
			},
			
			create : function() {
				if (!this.created) {
					this.target = Scriptor.ComponentRegistry.spawnTarget(this);
					
					this.__updatePosition();
					
					if (this.style)
						this.target.setAttribute('style', this.style);
					
					targetMinHeight = parseInt(this.target.style.minHeight);
					targetMaxHeight = parseInt(this.target.style.maxHeight);
					targetMinWidth = parseInt(this.target.style.minWidth);
					targetMaxWidth = parseInt(this.target.style.maxWidth);
					
					if (!isNaN(targetMinHeight))
						this.minHeight = targetMinHeight;
					if (!isNaN(targetMaxHeight))
						this.maxHeight = targetMaxHeight;
					if (!isNaN(targetMinWidth))
						this.minWidth = targetMinWidth;
					if (!isNaN(targetMaxWidth))
						this.maxWidth = targetMaxWidth;
					
					if (this.width == null && !isNaN(parseInt(this.target.style.width)))
						this.width = parseInt(this.target.style.width);
					if (this.height == null && !isNaN(parseInt(this.target.style.height)))
						this.height = parseInt(this.target.style.height);
					
					if (this.target.style.width.substr(this.target.style.width.length-1) == '%')
						this._percentWidth = this.target.style.width;
					else
						this._origWidth = this.target.style.width;
						
					if (this.target.style.height.substr(this.target.style.height.length-1) == '%')
						this._percentHeight = this.target.style.height;
						
					this.target.className = this.className ? 'jsComponent jsComponent_hidden ' + this.className : 'jsComponent jsComponent_hidden';
					Scriptor.event.attach(this.target, 'mousedown', Scriptor.bindAsEventListener(this.focus, this));
					
					if (this.canHaveChildren)
					{
						this.cmpTarget = this.target;
					}
					
					if (this.hasInvalidator)
					{
						this.invalidator = Scriptor.ComponentRegistry.spawnInvalidator(this);
					}
					
					this.createImplementation();
					
					Scriptor.event.fire(this, 'oncreate');
					
					this.created = true;
				}
			},
			
			destroy : function() {
				var e = Scriptor.event.fire(this, 'onbeforedestroy');
				if (!e.returnValue)
					return;
					
				if (this.target) {
					this.visible = false;
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].destroy();
					
					this.destroyImplementation();
					
					Scriptor.event.fire(this, 'ondestroy');
						
					this.passFocus();
					
					if (this.parent) {
						this.parent.removeChild(this);
					}
					
					this.created = false;
					Scriptor.ComponentRegistry.destroy(this);
				}
			},
			
			show : function() {
				var e = Scriptor.event.fire(this, 'onbeforeshow');
				if (!e.returnValue)
					return;
				
				if (!this.created)
					this.create();
					
				this.calculateOffset();
				
				if (!this.visible && this.target) {
					Scriptor.className.remove(this.target, 'jsComponent_hidden');
					this.visible = true;
					
					this.showImplementation();
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].show();	
					
					this.resize();	// we're doing component layout here!
					
					this.focus();
					
					Scriptor.event.fire(this, 'onshow');
				}
			},
			
			// layout the component acording to its size parameters
			// and resizes its children.
			resize : function() {
				if (this.target) {
					this.__updatePosition();
					
					if (this.components.length)
					{
						// get the component's padding if any
						var innerBox = this.__getInnerBox();
						
						// top region, stack horizontally with uniform widths
						var topChildren = this.__getChildrenForRegion("top");
						var maxTopHeight = 0;
						var topUniformWidth = (this.width - innerBox.left - innerBox.right) / topChildren.length;
						for (var n=0; n < topChildren.length; n++)
						{
							if (topChildren[n].height > maxTopHeight)
								maxTopHeight = topChildren[n].height;
							
							topChildren[n].x = innerBox.left + (n*topUniformWidth);
							topChildren[n].y = innerBox.top;
							topChildren[n].width = topUniformWidth;
							topChildren[n].height = topChildren[n].height;
						}
						
						// bottom region, stack horizontally with uniform widths
						var bottomChildren = this.__getChildrenForRegion("bottom");
						var maxBottomHeight = 0;
						var bottomUniformWidth = (this.width - innerBox.left - innerBox.right) / bottomChildren.length;
						for (var n=0; n < bottomChildren.length; n++)
						{
							if (bottomChildren[n].height > maxBottomHeight)
								maxBottomHeight = bottomChildren[n].height;
						}
						
						for (var n=0; n < bottomChildren.length; n++)
						{
							bottomChildren[n].x = innerBox.left + (n*bottomUniformWidth);
							bottomChildren[n].y = this.height - innerBox.bottom - maxBottomHeight;
							bottomChildren[n].width = bottomUniformWidth;
							bottomChildren[n].height = bottomChildren[n].height;
						}
						
						// left region, stack vertically with uniform heights
						var leftChildren = this.__getChildrenForRegion("left");
						var maxLeftWidth = 0;
						var leftUniformHeight = (this.height - innerBox.top - innerBox.bottom) / leftChildren.length;
						for (var n=0; n < leftChildren.length; n++)
						{
							if (leftChildren[n].width > maxLeftWidth)
								maxLeftWidth = leftChildren[n].width;
								
							leftChildren[n].x = innerBox.left;
							leftChildren[n].y = maxTopHeight + innerBox.top + (n*leftUniformHeight);
							leftChildren[n].height = leftUniformHeight - maxTopHeight - maxBottomHeight;
							leftChildren[n].width = leftChildren[n].width;
						}
						
						// right region, stack vertically with uniform widths
						var rightChildren = this.__getChildrenForRegion("right");
						var maxRightWidth = 0;
						var rightUniformHeight = (this.height - innerBox.top - innerBox.bottom) / rightChildren.length;
						for (var n=0; n < rightChildren.length; n++)
						{
							if (rightChildren[n].width > maxRightWidth)
								maxRightWidth = rightChildren[n].width;
						}
						
						for (var n=0; n < rightChildren.length; n++)
						{
							rightChildren[n].x = this.width - innerBox.right - maxRightWidth;
							rightChildren[n].y = maxTopHeight + innerBox.top + (n*rightUniformHeight);
							rightChildren[n].width = maxRightWidth;
							rightChildren[n].height = rightUniformHeight - maxTopHeight - maxBottomHeight;
						}
						
						// center elements, stack vertically with uniform heights
						var centerChildren = this.__getChildrenForRegion("center");
						var centerUniformHeight = (this.height - innerBox.top - innerBox.bottom - maxBottomHeight - maxTopHeight) / centerChildren.length;
						for (var n=0; n < centerChildren.length; n++)
						{
							centerChildren[n].x = innerBox.left + maxLeftWidth;
							centerChildren[n].y = innerBox.top + maxTopHeight + (n*centerUniformHeight);
							centerChildren[n].height = centerUniformHeight;
							centerChildren[n].width = this.width - innerBox.left - innerBox.right - maxLeftWidth - maxRightWidth;
						}
						
						// TODO: add splitters for automatic resizing
					}
					
					this.resizeImplementation();
					
					Scriptor.event.fire(this, 'onresize');
						
					for (var n=0; n < this.components.length; n++) 
						this.components[n].resize();
				}
			},
			
			resizeTo : function(newSize) {
				if (newSize)
				{
					if (newSize.width)
						this.width = newSize.width;
					if (newSize.height)
						this.height = newSize.height;
					
					this.__updatePosition();
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].resize();
				}
			},
			
			hide : function() {
				var e = Scriptor.event.fire(this, 'onbeforehide');
				if (!e.returnValue)
					return;
				
				if (this.visible && this.target) {
					Scriptor.className.add(this.target, 'jsComponent_hidden');
					this.visible = false;
					
					this.hideImplementation();
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].hide();	
					
					Scriptor.event.fire(this, 'onhide');
					this.passFocus();
				}
			},
			
			// replace the contents of the component's target div
			// or child target with the passed HTMLElement or component
			setContent : function(ref) {
				if (this.created)
				{
					while (this.components.length)
						this.removeChild(this.components[0]);
					
					if (ref.CMP_SIGNATURE)
					{
						this.addChild(ref);
						return true;
					}
					else if (Scriptor.isHtmlElement(ref))
					{
						this.target.appendChild(ref);
						this.resize();
						return true;
					}
				}
				
				return false;
			},
			
			// add a children component into the component's target
			// div and relayout
			addChild : function(ref) {
				if (this.created)
				{
					var found = false;
					for (var n=0; n < this.components.length; n++)
					{
						if (this.components[n] === ref)
						{
							found = true;
							break;
						}
					}
					
					if (!found && ref.CMP_SIGNATURE && this.canHaveChildren) {
						if (ref.parent)
							ref.parent.removeChild(ref);
						
						if (ref.target.parentNode)
							ref.target.parentNode.removeChild(ref.target);
							
						this.components.push(ref);
						this.cmpTarget.appendChild(ref.target);
						ref.parent = this;
						Scriptor.className.add(ref.target, 'jsComponentChild');
						this.resize();
						return true;
					}
				}
				
				return false;
			},
			
			// remove a component from its children collection, does not destroy
			// the component
			removeChild : function(ref) {
				if (this.created)
				{
					for (var n=0; n < this.components.length; n++)
					{
						if (this.components[n] === ref)
						{
							ref.target.parentNode.removeChild(ref.target);
							this.components.splice(n, 1);
							Scriptor.className.remove(ref.target, 'jsComponentChild');
							ref.parent = null;
							this.resize();
							
							return true;
						}
					}
				}
				
				return false;
			},
			
			calculateOffset : function() {
				
				var curOffsetParent = this.target;
				var foundOffsetParent = false;
				
				this.componentOffset.windowX = 0;
				this.componentOffset.windowY = 0;
				
				var isOldIe = (navigator.userAgent.indexOf('MSIE') != -1 && navigator.userAgent.indexOf('MSIE 8') == -1);
				var isGecko = (navigator.userAgent.indexOf('Gecko') != -1);
				var isIe8 = (navigator.userAgent.indexOf('MSIE 8') != -1);
				var isOpera = (navigator.userAgent.indexOf('Opera') != -1);
				
				while (curOffsetParent) {
					
					this.componentOffset.windowX += curOffsetParent.offsetLeft;
					
					// Gecko browsers need the border of the element added to the offset!
					if ((isGecko) && curOffsetParent.style.borderLeftWidth)
						this.componentOffset.windowX += parseInt(curOffsetParent.style.borderLeftWidth);
						
					this.componentOffset.windowY += curOffsetParent.offsetTop;
					if ((isGecko || isOldIe) && curOffsetParent.style.borderTopWidth)
						this.componentOffset.windowY += parseInt(curOffsetParent.style.borderTopWidth);
					
					if (curOffsetParent.scrollTop)
						this.componentOffset.windowY -= curOffsetParent.scrollTop;
					if (curOffsetParent.scrollLeft)
						this.componentOffset.windowX -= curOffsetParent.scrollLeft;
							
					curOffsetParent = curOffsetParent.offsetParent;
					
					if (this.parent && curOffsetParent == this.parent.cmpTarget) {
						foundOffsetParent = true;
						this.componentOffset.parentX = this.componentOffset.windowX;
						this.componentOffset.parentY = this.componentOffset.windowY;
					}
					
					if (curOffsetParent && (curOffsetParent.tagName == 'BODY' || curOffsetParent.tagName == 'HTML'))
						curOffsetParent = null;
				}
				
				if (!foundOffsetParent) {
					this.componentOffset.parentX = this.componentOffset.windowX;
					this.componentOffset.parentY = this.componentOffset.windowY;
				}
			},
			
			__updatePosition : function() {
				if (this.target)
				{
					var innerBox = this.__getInnerBox();
					var outerBox = this.__getOuterBox();
					
					if (this._percentWidth !== null)
					{
						this.target.style.width = this._percentWidth;
						this.width = this.target.offsetWidth;
					}
					else if (this._origWidth !== null)
					{
						if ((!this._origWidth || this._origWidth == "auto") && this.parent === null)
						{
							if (this.target.parentNode)
							{
								outerBox = this.__getOuterBox();
								this.width = this.target.parentNode.offsetWidth - outerBox.left - outerBox.right - innerBox.left - innerBox.right;
							}
						}
					}
					
					if (this._percentHeight !== null)
					{
						this.target.style.height = this._percentHeight;
						this.height = this.target.offsetHeight - outerBox.top - outerBox.bottom - innerBox.top - innerBox.bottom;
					}
					
					if (this.width !== null)
						this.target.style.width = (this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right) + 'px';
					if (this.height !== null)
						this.target.style.height = (this.height  - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom) + 'px';
					if (this.x !== null)
						this.target.style.left = this.x + 'px';
					if (this.y !== null)
						this.target.style.top = this.y + 'px';
						
					if (this.maxHeight !== null)
						this.target.style.maxHeight = this.maxHeight + 'px';
					if (this.minHeight !== null)
						this.target.style.minHeight = this.minHeight + 'px';
					if (this.maxWidth !== null)
						this.target.style.maxWidth = this.maxWidth + 'px';
					if (this.minWidth !== null)
						this.target.style.minWidth = this.minWidth + 'px';
					
				}
			},
			
			// get top, bottom, left, right values according to the component's
			// padding
			__getInnerBox : function() {
				var box = { top : 0, bottom: 0, left : 0, right : 0 };
				
				var innerTop = parseInt(this.target.style.paddingTop);
				var innerBottom = parseInt(this.target.style.paddingBottom);
				var innerLeft = parseInt(this.target.style.paddingLeft);
				var innerRight = parseInt(this.target.style.paddingRight);
				
				if (!isNaN(innerTop))
					box.top = innerTop;
				if (!isNaN(innerBottom))
					box.bottom = innerBottom;
				if (!isNaN(innerLeft))
					box.left = innerLeft;
				if (!isNaN(innerRight))
					box.right = innerRight;
				
				var borderTop = parseInt(this.target.style.borderTopWidth);
				var borderBottom = parseInt(this.target.style.borderBottomWidth)
				var borderLeft = parseInt(this.target.style.borderLeftWidth)
				var borderRight = parseInt(this.target.style.borderRightWidth)
				
				if (!isNaN(borderTop))
					box.top += borderTop;
				if (!isNaN(borderBottom))
					box.bottom += borderBottom;
				if (!isNaN(borderLeft))
					box.left += borderLeft;
				if (!isNaN(borderRight))
					box.right += borderRight;
					
				return box;
			},
			
			// get top, bottom, left, right values according to the component's
			// margin
			__getOuterBox : function() {
				var box = { top : 0, bottom: 0, left : 0, right : 0 };
				
				var outerTop = parseInt(this.target.style.marginTop);
				var outerBottom = parseInt(this.target.style.marginBottom);
				var outerLeft = parseInt(this.target.style.marginLeft);
				var outerRight = parseInt(this.target.style.marginRight);
				
				if (!isNaN(outerTop))
					box.top = outerTop;
				if (!isNaN(outerBottom))
					box.bottom = outerBottom;
				if (!isNaN(outerLeft))
					box.left = outerLeft;
				if (!isNaN(outerRight))
					box.right = outerRight;
					
				return box;
			},
			
			//returns an array with references to children that
			// has a region str
			__getChildrenForRegion : function(str) {
				var ret = [];
				
				for (var n=0; n < this.components.length; n++)
				{
					if (this.components[n].region == str)
						ret.push(this.components[n]);
				}
				
				return ret;
			}
		};
		
		var availableRegions = ["center", "left", "top", "bottom", "right"];
		var validRegion = false;
		for (var n=0; n < availableRegions.length; n++)
		{
			if (cmp.region == availableRegions[n])
			{
				validRegion = true;
				break;
			}
		}
		
		if (!validRegion)
			cmp.region = "center";
		
		return cmp;
	}
};

Scriptor.ComponentRegistry = {
	_registry : [],
	
	add : function(id, cmp) {
		if (!this.getById(id))
		{
			this._registry.push({'id' : id, 'cmp' : cmp});
		}
		else
		{
			throw 'Warning: duplicate component id '  + id;
		}
	},
	
	remove : function(ref) {
		if (typeof(ref) == 'string')
		{
			for (var n=0; n < this._registry.length; n++)
			{
				if (this._registry[n].id == ref)
				{
					this._registry.splice(n, 1);
					return;
				}
			}
		}
		else if (ref.CMP_SIGNATURE)
		{
			for (var n=0; n < this._registry.length; n++)
			{
				if (this._registry[n].cmp === ref)
				{
					this._registry.splice(n, 1);
					return;
				}
			}
		}
	},
	
	getById : function(id) {
		for (var n=0; n < this._registry.length; n++)
		{
			if (this._registry[n].id == id)
				return this._registry[n].cmp;
		}
		
		return null;
	},
	
	spawnTarget : function(cmp) {
		if (!cmp.divId)
			cmp.divId = __getNextHtmlId();
			
		var ret = document.getElementById(cmp.divId);
		if (!ret) {	// not present in DOM
			ret = document.createElement('div');
			ret.id = cmp.divId;
		}
		
		this.add(cmp.divId, cmp);
		
		return ret;
	},
	
	spawnInvalidator : function(cmp) {
		if (!cmp.divId || !cmp.target)
			return null;
		
		ret = document.createElement('div');
		ret.id = cmp.divId + '_invalidator';
		ret.className = 'jsComponentInvalidator';
		cmp.target.appendChild(ret);
		
		return ret;
	},
	
	destroy : function(cmp) {
		if (document.getElementById(cmp.divId))
		{
			cmp.target.parentNode.removeChild(cmp.target);
		}
		cmp.target = null;
		
		
		if (cmp.invalidator)
		{
			if (document.getElementById(cmp.invalidator.id))
			{
				cmp.invalidator.parentNode.removeChild(cmp.invalidator);
			}
			cmp.invalidator = null;
		}
		
		if (cmp.cmpTarget)
		{
			if (document.getElementById(cmp.cmpTarget.id))
			{
				cmp.cmpTarget.parentNode.removeChild(cmp.cmpTarget);
			}
			cmp.cmpTarget = null;
		}
		
		this.remove(cmp);
	},
	
	onWindowResized : function(e) {
		for (var n=0; n < this._registry.length; n++)
		{
			if (!this._registry[n].cmp.parent)
				this._registry[n].cmp.resize();
		}
	}
};

Scriptor.event.attach(window, 'onresize', Scriptor.bindAsEventListener(Scriptor.ComponentRegistry.onWindowResized, Scriptor.ComponentRegistry));
