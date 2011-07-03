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
			splitters : {},
			resizingRegion : "",
			resizeStartingPosition : 0,
			resizeInterval : 20,
			lastResizeTimeStamp : null,
			
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
					
					this.focusImplementation.apply(this, arguments);
					Scriptor.event.fire(this, 'onfocus');
					
					this.hasFocus = true;
					Scriptor.className.add(this.target, 'jsComponentFocused');
				}
				
				return false;
			},
			
			blur : function() {
				if (this.hasFocus) {
					this.target.style.zIndex = this.zIndexCache;
					
					this.blurImplementation.apply(this, arguments);
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
					
					this.target.className = this.className ? 'jsComponent jsComponentHidden ' + this.className : 'jsComponent jsComponentHidden';
					
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
					
					Scriptor.event.attach(this.target, 'mousedown', Scriptor.bindAsEventListener(this.focus, this));
					
					if (this.canHaveChildren)
					{
						this.cmpTarget = document.createElement('div');
						this.cmpTarget.id = this.divId + "_cmpTarget";
						Scriptor.className.add(this.cmpTarget, "jsTargetComponent");
						this.target.appendChild(this.cmpTarget);
						
						this.splitters.top = null;
						this.splitters.left = null;
						this.splitters.right = null;
						this.splitters.bottom = null;
					}
					
					if (this.hasInvalidator)
					{
						this.invalidator = Scriptor.ComponentRegistry.spawnInvalidator(this);
					}
					
					Scriptor.event.fire(this, 'oncreate');
					
					this.created = true;
				}
			},
			
			__reReadDimentions : function() {
				if (document.getElementById(this.target.id))
				{
					targetMinHeight = parseInt(Scriptor.className.getComputedProperty(this.target, 'min-height'));
					targetMaxHeight = parseInt(Scriptor.className.getComputedProperty(this.target, 'max-height'));
					targetMinWidth = parseInt(Scriptor.className.getComputedProperty(this.target, 'min-width'));
					targetMaxWidth = parseInt(Scriptor.className.getComputedProperty(this.target, 'max-width'));
					
					if (!isNaN(targetMinHeight))
						this.minHeight = targetMinHeight;
					if (!isNaN(targetMaxHeight))
						this.maxHeight = targetMaxHeight;
					if (!isNaN(targetMinWidth))
						this.minWidth = targetMinWidth;
					if (!isNaN(targetMaxWidth))
						this.maxWidth = targetMaxWidth;
					
					var computedWidth = Scriptor.className.getComputedProperty(this.target, 'width');
					var computedHeight = Scriptor.className.getComputedProperty(this.target, 'height');
					if (this.width == null && !isNaN(parseInt(computedWidth)))
						this.width = parseInt(computedWidth);
					if (this.height == null && !isNaN(parseInt(computedHeight)))
						this.height = parseInt(computedHeight);
					
					if (computedWidth.substr(computedWidth.length-1) == '%')
						this._percentWidth = computedWidth;
					else
						this._origWidth = computedWidth;
					
					if (computedHeight.substr(computedHeight.length-1) == '%')
						this._percentHeight = computedHeight;
				}
				
				for (var n=0; n < this.components.length; n++)
					this.components[n].__reReadDimentions();
			},
			
			destroy : function() {
				var e = Scriptor.event.fire(this, 'onbeforedestroy');
				if (!e.returnValue)
					return;
					
				if (this.target) {
					this.visible = false;
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].destroy();
					
					this.destroyImplementation.apply(this, arguments);
					
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
					
				if (!this.visible && this.target) {
					Scriptor.className.remove(this.target, 'jsComponentHidden');
					this.visible = true;
					
					this.showImplementation.apply(this, arguments);
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].show();	
					
					if (this.parent)
						this.parent.resize();
					else
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
						var outerBox = this.__getOuterBox();
						// top region, stack horizontally with uniform widths
						var topChildren = this.__getChildrenForRegion("top");
						var maxTopHeight = 0;
						var topUniformWidth = (this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right) / topChildren.length;
						var topResizable = false;
						for (var n=0; n < topChildren.length; n++)
						{
							if (topChildren[n].height > maxTopHeight)
								maxTopHeight = topChildren[n].height;
							
							topChildren[n].x = (n*topUniformWidth);
							topChildren[n].y = 0;
							topChildren[n].width = topUniformWidth;
							topChildren[n].height = topChildren[n].height;
							
							if (topChildren[n].resizable)
								topResizable = true;
						}
						
						// bottom region, stack horizontally with uniform widths
						var bottomChildren = this.__getChildrenForRegion("bottom");
						var maxBottomHeight = 0;
						var bottomUniformWidth = (this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right) / bottomChildren.length;
						var bottomResizable = false;
						for (var n=0; n < bottomChildren.length; n++)
						{
							if (bottomChildren[n].height > maxBottomHeight)
								maxBottomHeight = bottomChildren[n].height;
							
							if (bottomChildren[n].resizable)
								bottomResizable = true;
						}
						
						for (var n=0; n < bottomChildren.length; n++)
						{
							bottomChildren[n].x = (n*bottomUniformWidth);
							bottomChildren[n].y = this.height - maxBottomHeight - innerBox.top - innerBox.bottom;
							bottomChildren[n].width = bottomUniformWidth;
							bottomChildren[n].height = bottomChildren[n].height;
						}
						
						// left region, stack vertically with uniform heights
						var leftChildren = this.__getChildrenForRegion("left");
						var maxLeftWidth = 0;
						var leftUniformHeight = (this.height - innerBox.top - innerBox.bottom - outerBox.left - outerBox.right) / leftChildren.length;
						var leftResizable = false;
						for (var n=0; n < leftChildren.length; n++)
						{
							if (leftChildren[n].width > maxLeftWidth)
								maxLeftWidth = leftChildren[n].width;
								
							leftChildren[n].x = 0;
							leftChildren[n].y = maxTopHeight + (n*leftUniformHeight);
							leftChildren[n].height = leftUniformHeight - maxTopHeight - maxBottomHeight;
							leftChildren[n].width = leftChildren[n].width;
							
							if (leftChildren[n].resizable)
								leftResizable = true;
						}
						
						// right region, stack vertically with uniform widths
						var rightChildren = this.__getChildrenForRegion("right");
						var maxRightWidth = 0;
						var rightUniformHeight = (this.height - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom) / rightChildren.length;
						var rightResizable = false;
						for (var n=0; n < rightChildren.length; n++)
						{
							if (rightChildren[n].width > maxRightWidth)
								maxRightWidth = rightChildren[n].width;
								
							if (rightChildren[n].resizable)
								rightResizable = true;
						}
						
						for (var n=0; n < rightChildren.length; n++)
						{
							rightChildren[n].x = this.width - maxRightWidth - innerBox.left - innerBox.right;
							rightChildren[n].y = maxTopHeight + (n*rightUniformHeight);
							rightChildren[n].width = maxRightWidth;
							rightChildren[n].height = rightUniformHeight - maxTopHeight - maxBottomHeight;
						}
						
						// center elements, stack vertically with uniform heights
						var centerChildren = this.__getChildrenForRegion("center");
						var centerUniformHeight = (this.height - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom - maxBottomHeight - maxTopHeight) / centerChildren.length;
						for (var n=0; n < centerChildren.length; n++)
						{
							centerChildren[n].x = maxLeftWidth;
							centerChildren[n].y = maxTopHeight + (n*centerUniformHeight);
							centerChildren[n].height = centerUniformHeight;
							centerChildren[n].width = this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right - maxLeftWidth - maxRightWidth;
						}
						
						// spawn splitters as needed
						if (topResizable)
						{
							if (!this.splitters.top)
							{
								this.splitters.top = document.createElement('div');
								this.splitters.top.id = this.divId + "_splitter_top";
								Scriptor.className.add(this.splitters.top, 'jsSplitter');
								Scriptor.className.add(this.splitters.top, 'jsSplitterHorizontal');
								this.cmpTarget.appendChild(this.splitters.top);
								Scriptor.event.attach(this.splitters.top, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "top"));
							}
							
							var topOuter = topChildren[0].__getOuterBox();
							
							this.splitters.top.style.width = (this.width - innerBox.left - innerBox.right) + 'px';
							this.splitters.top.style.top = (maxTopHeight - topOuter.bottom) + 'px';
						}
						else
						{
							if (this.splitters.top)
							{
								this.splitters.top.parentNode.removeChild(this.splitters.top);
								this.splitters.top = null;
							}
						}
						
						if (bottomResizable)
						{
							if (!this.splitters.bottom)
							{
								this.splitters.bottom = document.createElement('div');
								this.splitters.bottom.id = this.divId + "_splitter_bottom";
								Scriptor.className.add(this.splitters.bottom, 'jsSplitter');
								Scriptor.className.add(this.splitters.bottom, 'jsSplitterHorizontal');
								this.cmpTarget.appendChild(this.splitters.bottom);
								Scriptor.event.attach(this.splitters.bottom, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "bottom"));
							}
							
							var bottomOuter = bottomChildren[0].__getOuterBox();
							var splitterHeight = parseInt(Scriptor.className.getComputedProperty(this.splitters.bottom, 'height'));
							if (isNaN(splitterHeight))
								splitterHeight = 5;
							
							this.splitters.bottom.style.width = (this.width - innerBox.left - innerBox.right) + 'px';
							this.splitters.bottom.style.top = (this.height - maxBottomHeight - splitterHeight - bottomOuter.top) + 'px';
						}
						else
						{
							if (this.splitters.bottom)
							{
								this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
								this.splitters.bottom = null;
							}
						}
						
						if (leftResizable)
						{
							if (!this.splitters.left)
							{
								this.splitters.left = document.createElement('div');
								this.splitters.left.id = this.divId + "_splitter_left";
								Scriptor.className.add(this.splitters.left, 'jsSplitter');
								Scriptor.className.add(this.splitters.left, 'jsSplitterVertical');
								this.cmpTarget.appendChild(this.splitters.left);
								Scriptor.event.attach(this.splitters.left, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "left"));
							}
							
							var leftOuter = leftChildren[0].__getOuterBox();
							
							this.splitters.left.style.height = (this.height - innerBox.top - innerBox.bottom - maxTopHeight - maxBottomHeight) + 'px';
							this.splitters.left.style.top = (maxTopHeight) + 'px';
							this.splitters.left.style.left = (maxLeftWidth - leftOuter.right) + 'px';
						}
						else
						{
							if (this.splitters.left)
							{
								this.splitters.left.parentNode.removeChild(this.splitters.left);
								this.splitters.left = null;
							}
						}
						
						if (rightResizable)
						{
							if (!this.splitters.right)
							{
								this.splitters.right = document.createElement('div');
								this.splitters.right.id = this.divId + "_splitter_right";
								Scriptor.className.add(this.splitters.right, 'jsSplitter');
								Scriptor.className.add(this.splitters.right, 'jsSplitterVertical');
								this.cmpTarget.appendChild(this.splitters.right);
								Scriptor.event.attach(this.splitters.right, 'mousedown', Scriptor.bindAsEventListener(this._onResizeStart, this, "right"));
							}
							
							var rightOuter = rightChildren[0].__getOuterBox();
							var splitterWidth = parseInt(Scriptor.className.getComputedProperty(this.splitters.right, 'width'));
							if (isNaN(splitterWidth))
								splitterWidth = 5;
							
							this.splitters.right.style.height = (this.height - innerBox.top - innerBox.bottom - maxTopHeight - maxBottomHeight) + 'px';
							this.splitters.right.style.top = (maxTopHeight) + 'px';
							this.splitters.right.style.left = (this.width - maxRightWidth - splitterWidth - rightOuter.left) + 'px';
						}
						else
						{
							if (this.splitters.right)
							{
								this.splitters.right.parentNode.removeChild(this.splitters.right);
								this.splitters.right = null;
							}
						}
					}
					
					this.resizeImplementation.apply(this, arguments);
					
					Scriptor.event.fire(this, 'onresize');
						
					for (var n=0; n < this.components.length; n++) 
						this.components[n].resize();
				}
			},
			
			resizeTo : function(newSize) {
				if (newSize)
				{
					if (newSize.width)
					{
						this.width = newSize.width;
						this._percentWidth = null;
					}
					if (newSize.height)
					{
						this.height = newSize.height;
						this._percentHeight = null;
					}
					
					this.__updatePosition();
					
					if (this.parent)
						this.parent.resize();
					else
						for (var n=0; n < this.components.length; n++) 
							this.components[n].resize();
				}
			},
			
			hide : function() {
				var e = Scriptor.event.fire(this, 'onbeforehide');
				if (!e.returnValue)
					return;
				
				if (this.visible && this.target) {
					Scriptor.className.add(this.target, 'jsComponentHidden');
					this.visible = false;
					
					this.hideImplementation.apply(this, arguments);
					
					for (var n=0; n < this.components.length; n++) 
						this.components[n].hide();
					
					if (this.parent)
						this.parent.resize();
					else
						this.resize();	// we're doing component layout here!
						
					this.passFocus();
					
					Scriptor.event.fire(this, 'onhide');
				}
			},
			
			// replace the contents of the component's target div
			// or child target with the passed HTMLElement or component
			setContent : function(ref) {
				if (this.created && this.canHaveChildren)
				{
					while (this.components.length)
						this.removeChild(this.components[0]);
					
					if (ref)
					{
						if (ref.CMP_SIGNATURE)
						{
							this.addChild(ref);
							return true;
						}
						else if (Scriptor.isHtmlElement(ref))
						{
							this.cmpTarget.appendChild(ref);
							this.resize();
							return true;
						}
						else if (typeof(ref) == "string")
						{
							this.cmpTarget.innerHTML = ref;
							this.resize();
							return true;
						}
					}
				}
				
				return false;
			},
			
			// add a children component into the component's target
			// div and relayout
			addChild : function(ref) {
				if (this.created && this.canHaveChildren)
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
						this.__reReadDimentions();	// stylesheet properties are applyed at this point and
													// we should update them
						
						if (ref.visible != this.visible)
						{
							if (ref.visible)
								ref.hide();
							else
								ref.show();
						}
						this.resize();
						return true;
					}
				}
				
				return false;
			},
			
			// remove a component from its children collection, does not destroy
			// the component
			removeChild : function(ref) {
				if (this.created && this.canHaveChildren)
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
			
			__updatePosition : function() {
				if (this.target)
				{
					var innerBox = this.__getInnerBox();
					var outerBox = this.__getOuterBox();
					var testWidth = 0, testHeight = 0;
					
					if (this._percentWidth !== null)
					{
						this.target.style.width = this._percentWidth;
						this.width = this.target.offsetWidth - outerBox.left - outerBox.right - innerBox.left - innerBox.right;
					}
					else if (this._origWidth !== null)
					{
						if ((!this._origWidth || this._origWidth == "auto") && this.parent === null)
						{
							if (this.target.parentNode)
							{
								outerBox = this.__getOuterBox();
								// avoid ie errors
								testWidth = this.target.parentNode.offsetWidth - outerBox.left - outerBox.right - innerBox.left - innerBox.right;
								if (isNaN(testWidth) || testWidth < 0)
									testWidth = 0;
								this.width = testWidth;
							}
						}
					}
					
					if (this._percentHeight !== null)
					{
						this.target.style.height = this._percentHeight;
						testHeight = this.target.offsetHeight - outerBox.top - outerBox.bottom - innerBox.top - innerBox.bottom;
						if (isNaN(testHeight) || testHeight < 0)
							testHeight = 0;
						this.height = testHeight;
					}
					
					
					if (this.width !== null)
					{
						// avoid IE errors
						testWidth = this.width - innerBox.left - innerBox.right - outerBox.left - outerBox.right;
						if (isNaN(testWidth) || testWidth < 0)
							testWidth = 0;
						this.target.style.width = testWidth + 'px';
					}
					if (this.height !== null)
					{
						// avoid ie errors
						testHeight = this.height  - innerBox.top - innerBox.bottom - outerBox.top - outerBox.bottom;
						if (isNaN(testHeight) || testHeight < 0)
							testHeight = 0;
						this.target.style.height = testHeight + 'px';
					}
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
				
				var innerTop = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-top'));
				var innerBottom = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-bottom'));
				var innerLeft = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-left'));
				var innerRight = parseInt(Scriptor.className.getComputedProperty(this.target, 'padding-right'));
				
				if (!isNaN(innerTop))
					box.top = innerTop;
				if (!isNaN(innerBottom))
					box.bottom = innerBottom;
				if (!isNaN(innerLeft))
					box.left = innerLeft;
				if (!isNaN(innerRight))
					box.right = innerRight;
				
				var borderTop = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-top-width'));
				var borderBottom = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-bottom-width'))
				var borderLeft = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-left-width'))
				var borderRight = parseInt(Scriptor.className.getComputedProperty(this.target, 'border-right-width'))
				
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
				
				var outerTop = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-top'));
				var outerBottom = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-bottom'));
				var outerLeft = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-left'));
				var outerRight = parseInt(Scriptor.className.getComputedProperty(this.target, 'margin-right'));
				
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
					if (this.components[n].region == str && this.components[n].visible)
						ret.push(this.components[n]);
				}
				
				return ret;
			},
			
			_onResizeStart : function(e, region) {
				if (!e)	e = window.event;
					
				this.resizingRegion = region;
				
				Scriptor.event.attach(document, 'mousemove', this._resizeMoveHandler = Scriptor.bindAsEventListener(this._onResizeMove, this));
				Scriptor.event.attach(document, 'mouseup', this._resizeStopHandler = Scriptor.bindAsEventListener(this._onResizeStop, this));
				
				if (region == "top" || region == "bottom")
					this.resizeStartingPosition = Scriptor.event.getPointXY(e).y;
				else
					this.resizeStartingPosition = Scriptor.event.getPointXY(e).x;
				
				Scriptor.event.cancel(e, true);
				return false;
			},
			
			_onResizeMove : function(e) {
				if (!e)	e = window.event;
				
				var curTime = new Date().getTime();
				
				if (this.lastResizeTimeStamp && this.lastResizeTimeStamp + this.resizeInterval > curTime)
				{
					Scriptor.event.cancel(e, true);
					return false;
				}
				
				this.lastResizeTimeStamp = curTime;
				
				var curPos = 0;
				if (this.resizingRegion == "top" || this.resizingRegion == "bottom")
					curPos = Scriptor.event.getPointXY(e).y;
				else
					curPos = Scriptor.event.getPointXY(e).x;
				var delta = curPos - this.resizeStartingPosition;
				this.resizeStartingPosition = curPos;
				
				var children = this.__getChildrenForRegion(this.resizingRegion);
				switch (this.resizingRegion)
				{
					case ("top"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({height : children[n].height + delta});
						}
						break;
					
					case ("bottom"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({height : children[n].height - delta});
						}
						break;
					
					case ("left"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({width : children[n].width + delta});
						}
						break;
					
					case ("right"):
						for (var n=0; n < children.length; n++)
						{
							children[n].resizeTo({width : children[n].width - delta});
						}
						break;
					
				}
				
				Scriptor.event.cancel(e, true);
				return false;
			},
			
			_onResizeStop : function(e) {
				if (!e)	e = window.event;
				
				Scriptor.event.detach(document, 'mousemove', this._resizeMoveHandler);
				Scriptor.event.detach(document, 'mouseup', this._resizeStopHandler);
				
				this.lastResizeTimeStamp = null;
				this.resizingRegion = "";
				
				Scriptor.event.cancel(e, true);
				return false;
			},
			
			invalidate : function() {
				if (this.invalidator)
				{
					this.invalidator.style.display = 'block';
				}
			},
			
			revalidate : function() {
				if (this.invalidator)
				{
					this.invalidator.style.display = 'none';
				}
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
		ret.style.display = "none";
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
