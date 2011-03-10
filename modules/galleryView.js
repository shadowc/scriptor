// JavaScript Document
/*
*
*  galleryView version 2.0b
*
*  Will display a selectable group of thumbnails with information about the image itself.
*  Compatible with scriptor dynamic javascript+css script loader
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+
*/

/* 
* gv_ImageObect
*
* This object contains the information about an image in the gallery.
* You initialize it by providing a thumbnail string which will be used in the src
* attribute of the img object. The path is the internal path to be used if you
* need to render the image in its original size, finally an optional name might
* be provided to be printed under te image's thumbnail.
* 
*/
var gv_ImageObject = function(thumbnail, path, name) {
	this.thumbnail = thumbnail;
	this.path = path;
	this.name = name;
};

/*
* galleryView
*
* This is the main component. It will set up a div element with the array of
* gv_ImagePbjects representing images.
*
* Options are:
*  div: a string with the id attribute of a unique div element to be the container of
*    the component or the actual HTML element
*  In opts:
*  thumbWidth: optional, the fixed width of the thumbnails in pixels
*  thumbHeight: optional, the fixed height of the thumbnails in pixles
*  showNAmes: true if you want to display labels under thumbnails
*  fuxedThumbSize: true to take thumb width and height to set the width and
*  		height of the thumbnails
*  
* Properties:
*  selectedImage: the index of the selected image in the array. -1 if none.
*  enabled: set to true if the component is enabled (events will take place and
*    event handlers will be executed).
*    
*  onrefresh: function to be executed on refresh 
*  onshow: function to be executed on show
*  onselect: function to be executed on selection of a thumbnail
*  
*  visible: readonly property. It is true if the component has been shown sucessfully
*  images: an array of gv_ImageObjects contained in the component
*/
galleryView = Scriptor.galleryView = function(div, opts) /*sqlService, thumbWidth, thumbHeight)*/ {
	var localOpts = {
		thumbWidth : 154,
		thumbHeight : 184,
		showNames : true,
		fixedThumbSize : true
	};
	Scriptor.mixin(localOpts, opts);
	
	this.selectedImage = -1;
	this.enabled = true;
	this.showNames = localOpts.showNames;
	this.fixedThumbSize = localOpts.fixedThumbSize;
	this.thumbWidth = localOpts.thumbWidth;
	this.thumbHeight = localOpts.thumbHeight;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.visible = false;
	
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.images = [];
	
};

galleryView.prototype = {
	/*
	* galleryView.addImage
	*
	* Adds an image to the list, options are:
	* 	thumbnail: the path to the image thumbnail
	* 	path: the path to the full image (optional)
	* 	name: the name of the image (optional)
	* 	insertIndex: the index to insert the image in the list (optional)
	*/
	addImage : function(opts)
	{
		var localOpts = {
			thumbnail: null,
			path: null,
			name: null,
			insertIndex: this.images.length
		};
		
		Scriptor.mixin(localOpts, opts);
		
		if (!localOpts.thumbnail)
		{
			Scriptor.error.report('Missing thumbnail information for galleryView image');
			return;
		}
		
		if (localOpts.insertIndex == this.images.length)
		{
			this.images.push(new gv_ImageObject(localOpts.thumbnail, localOpts.path, localOpts.name));
		}
		else
		{
			this.images.splice(localOpts.insertIndex, 0, new gv_ImageObject(localOpts.thumbnail, localOpts.path, localOpts.name));
		}
		
		if (this.visible)
			this.updateImages();
	},

	deleteImage : function(identifier)
	{
		if (typeof(identifier) == 'number')
		{
			this.images.splice(identifier,1);
		}
		else if (typeof(identifier) == 'object')
		{
			for (var n=0; n < this.images.length; n++)
			{
				if (this.images[n] == identifier)
				{
					this.images.splice(n,1);
					break;
				}
			}
		}
		
		if (this.selectedImage > this.images.length-1)
			this.selectedImage = -1;
		
		if (this.visible)
			this.updateImages();
	},

	Refresh : function() {
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		if (this.visible)
			this.updateImages();
	},

/* galleryView.loadXmlData
*  for internal use only
*/
/*galleryView.prototype.loadXmlData = function(xmlData, gv) {
	var root = xmlData.getElementsByTagName('root').item(0);


	if (root.getAttribute('success') == '1') {
		var images = root.getElementsByTagName('image');
		gv.images.length = 0;
		for (var n=0; n < images.length; n++) {
			var thumb = images.item(n).getElementsByTagName('thumbnail');
			var path = images.item(n).getElementsByTagName('path');
			var name = images.item(n).getElementsByTagName('name');
			var thumbText = '';
			var pathText = '';
			var nameText = '';
			
			if (thumb.length) {
				if (thumb.item(0).firstChild) {
					thumbText = thumb.item(0).firstChild.data;
				}
			}
			
			if (path.length) {
				if (path.item(0).firstChild) {
					pathText = path.item(0).firstChild.data;
				}
			}
			
			if (name.length) {
				if (name.item(0).firstChild) {
					nameText = name.item(0).firstChild.data;
				}
			}
			
			gv.images[gv.images.length] = new gv_ImageObject(thumbText, pathText, nameText);
			
			var params = images.item(n).getElementsByTagName('param');
			if (params.length) {
				for (var a=0; a < params.length; a++) {
					var paramName = params.item(a).getAttribute('name');
					var paramText = '';
					if (params.item(a).firstChild)
						paramText = params.item(a).firstChild.data;
					
					gv.images[gv.images.length-1][paramName] = paramText;
				}
			}
		}
			
		if (gv.onrefresh)
			gv.onrefresh(gv);
		
		if (gv.visible) {
			gv.updateImages()
		}
		else {
			gv.Show(false);
		}
	}
	else {
		alert( 'Unsuccessfull XML call.\nMessage: '+ root.getAttribute('error'));
		if (gv.visible) {
			gv.updateImages()
		}
		else {
			gv.Show(false);
		}
		return;
	}
};*/

/* galleryView.loadError
*  for internal use only
*/
/*galleryView.prototype.loadError = function(status, gv) {
	gv.images.length = 0;
	
	if (gv.visible) {
		gv.updateRows()
	}
	else {
		gv.Show(false);
	}
};*/

	Show : function(withRefresh)
	{
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
				
		if (this.visible) 	// we're redrawing
			this._oldScrollTop = document.getElementById(this.div).scrollTop;
		
		if (!this.divElem)
		{
			this.divElem = document.getElementById(this.div);
		}
		else
		{
			if (!this.divElem.id)
			{
				if (!this.div)
					this.div = __getNextHtmlId();
					
				this.divElem.id = this.div;
			}
		}
		
		if (!this.divElem) {
			Scriptor.error.report('Error: galleryView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'galleryView scriptor';
		target.innerHTML = '';
		
		this.visible = true;
		if (withRefresh) 
			this.Refresh();
		
	},

	Hide : function()
	{
		var e = Scriptor.event.fire(this, 'onhide');
		if (!e.returnValue)
			return;
		
		if (this.divElem)
			this.divElem.style.display = 'none';
			
		this.visible = false;
	},
	
	/*
	* galleryView.setLoading(val)
	*   If val is true, show loading spinner, else show the actual rows,
	*   usefull for assync updates
	*/
	setLoading : function(val) {
		var body = document.getElementById(this.div);
		
		body.className = val ? 'galleryView scriptor galleryViewLoading' : 'galleryView scriptor';		
	},
	
	/*
	* galleryView.setMessage(msg)
	*	Set a message (usefull for error messages) and hide all info in a galleryView
	* 	If msg is set to false or not present, it will restore galleryView to normal
	*/
	setMessage : function(msg) {
		// false, null, or msg not present resets dataView to normal
		if (msg === false || msg === null || typeof(msg) != "string")
		{
			if (document.getElementById(this.div + '_message'))
				document.getElementById(this.div + '_message').parentNode.removeChild(document.getElementById(this.div + '_message'));
				
			this.divElem.className = 'galleryView scriptor';
		}
		else	// if string passed, we show a message
		{
			this.divElem.className = 'galleryView scriptor galleryViewMessage';
			var msgDiv;
			if (!document.getElementById(this.div + '_message'))
			{
				msgDiv = document.createElement('p');
				msgDiv.id = this.div + '_message';
				document.getElementById(this.div).appendChild(msgDiv);
			}
			else
			{
				msgDiv = document.getElementById(this.div + '_message');
			}
			msgDiv.innerHTML = msg;
		}
	},
	
	updateImages : function()
	{
		if (!this.visible) {
			Scriptor.error.report( "Can't update rows on non visible galleryView object.");
			return;
		}
			
		var target = document.getElementById(this.div);
		if (!this._oldScrollTop)
			this._oldScrollTop = target.parentNode.scrollTop;
			
		target.innerHTML = '';
			
		var iTemplate = '';
		
		for (var n=0; n < this.images.length; n++) {
			iTemplate += '<div id="' + this.div + '_envelop_' + n + '" ';
			if (this.fixedThumbSize) 
				iTemplate += 'style="width: ' + this.thumbWidth + 'px; height: ' + this.thumbHeight + 'px; overflow: hidden;"';
			
			if (this.selectedImage == n)
				iTemplate += 'class="gvSelectedImage" ';
			iTemplate += '>';
			
			iTemplate += '<img id="' + this.div + '_img_' + n + '" src="' + this.images[n].thumbnail + '" />';
			
			if (this.showNames && this.images[n].name) 
				iTemplate += '<p>' + this.images[n].name + '</p>'
			
			iTemplate += '</div>';
		}
		
		target.innerHTML = iTemplate;
		for (var n=0; n < this.images.length; n++)
		{
			Scriptor.event.attach(document.getElementById(this.div + '_img_' + n), 'onclick', Scriptor.bind(this._selectImage, this, n));
		}
		
		if (this.selectedImage >= this.images.length) 
			this.selectedImage = -1;
		
	},
	
	_selectImage : function(e, imgNdx) {
		if (!this.visible || !this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		e.selectedImage = this.selectedImage;	
		e.selecting = imgNdx;
		e = Scriptor.event.fire(this, 'onselect', e);
		
		if (e.returnValue == false)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		var imgs = this.divElem.getElementsByTagName('img');
		if (imgNdx != -1) {	
			if (this.selectedImage != -1) {
				for (var a=0; a < imgs.length; a++) {
					if (imgs[a].parentNode.className == 'gvSelectedImage') {
						imgs[a].parentNode.className = '';				
						break;
					}
				}
			}
			
			if (this.selectedImage == imgNdx) {
				this.selectedImage = -1;
			}
			else {
				this.selectedImage = imgNdx;
				imgs[imgNdx].parentNode.className = 'gvSelectedImage';
			}
		}
				
		Scriptor.event.cancel(e);
		return false;
	}
}