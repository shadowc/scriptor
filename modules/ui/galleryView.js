// JavaScript Document
/*
*
*  Will display a selectable group of thumbnails with information about the image itself.
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
* gv_ImageObjects representing images.
*
* Options are:
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
Scriptor.GalleryView = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		thumbWidth : 154,
		thumbHeight : 184,
		showNames : true,
		fixedThumbSize : true
	};
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
	this.CMP_SIGNATURE = "Scriptor.ui.GalleryView";
	
	this.selectedImage = -1;
	this.showNames = localOpts.showNames;
	this.fixedThumbSize = localOpts.fixedThumbSize;
	this.thumbWidth = localOpts.thumbWidth;
	this.thumbHeight = localOpts.thumbHeight;
	this.images = [];
	
	this.DOMAddedImplementation = function() {
		this.updateImages();
	};
	
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
	
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.create();
	Scriptor.className.add(this.target, "galleryViewWrapper");
	Scriptor.className.add(this.cmpTarget, "galleryView");
	
	// component template 
	this.canHaveChildren = false;
};

/*
* galleryView.addImage
*
* Adds an image to the list, options are:
* 	thumbnail: the path to the image thumbnail
* 	path: the path to the full image (optional)
* 	name: the name of the image (optional)
* 	insertIndex: the index to insert the image in the list (optional)
*/
Scriptor.GalleryView.prototype.addImage = function(opts)
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
	
	if (this.inDOM)	// TODO: a way to add one image to DOM
		this.updateImages();
};

Scriptor.GalleryView.prototype.deleteImage = function(identifier)
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
	
	if (this.inDOM)	// TODO: a way to remove only one image from DOM
		this.updateImages();
};

Scriptor.GalleryView.prototype.refresh = function() {
	var e = Scriptor.event.fire(this, 'onrefresh');
	if (!e.returnValue)
		return;
	
	if (this.inDOM)
		this.updateImages();
};

/*
* galleryView.setLoading(val)
*   If val is true, show loading spinner, else show the actual rows,
*   usefull for assync updates
*/
Scriptor.GalleryView.prototype.setLoading = function(val) {
	Scriptor.className[(val ? "add" : "remove")](this.cmpTarget, "galleryViewLoading");
};

/*
* galleryView.setMessage(msg)
*	Set a message (usefull for error messages) and hide all info in a galleryView
* 	If msg is set to false or not present, it will restore galleryView to normal
*/
Scriptor.GalleryView.prototype.setMessage = function(msg) {
	// false, null, or msg not present resets dataView to normal
	if (msg === false || msg === null || typeof(msg) != "string")
	{
		if (document.getElementById(this.divId + '_message'))
			this.target.removeChild(document.getElementById(this.divId + '_message'));
			
		Scriptor.className.remove(this.cmpTarget, "galleryViewMessage");
	}
	else	// if string passed, we show a message
	{
		Scriptor.className.add(this.cmpTarget, "galleryViewMessage");
		var msgDiv;
		if (!document.getElementById(this.divId + '_message'))
		{
			msgDiv = document.createElement('p');
			msgDiv.id = this.divId + '_message';
			this.target.appendChild(msgDiv);
		}
		else
		{
			msgDiv = document.getElementById(this.divId + '_message');
		}
		msgDiv.innerHTML = msg;
	}
};

Scriptor.GalleryView.prototype.updateImages = function()
{
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update images on non visible galleryView object.");
		return;
	}
		
	this.cmpTarget.innerHTML = '';
	
	var iTemplate = '';
	
	for (var n=0; n < this.images.length; n++) {
		iTemplate += '<div id="' + this.divId + '_envelop_' + n + '" ';
		if (this.fixedThumbSize) 
			iTemplate += 'style="width: ' + this.thumbWidth + 'px; height: ' + this.thumbHeight + 'px; overflow: hidden;"';
		
		if (this.selectedImage == n)
			iTemplate += 'class="gvSelectedImage" ';
		iTemplate += '>';
		
		iTemplate += '<img id="' + this.divId + '_img_' + n + '" src="' + this.images[n].thumbnail + '" />';
		
		if (this.showNames && this.images[n].name) 
			iTemplate += '<p>' + this.images[n].name + '</p>'
		
		iTemplate += '</div>';
	}
	
	this.cmpTarget.innerHTML = iTemplate;
	for (var n=0; n < this.images.length; n++)
	{
		Scriptor.event.attach(document.getElementById(this.divId + '_img_' + n), 'onclick', Scriptor.bindAsEventListener(this._selectImage, this, n));
	}
	
	if (this.selectedImage >= this.images.length) 
		this.selectedImage = -1;
};

Scriptor.GalleryView.prototype._selectImage = function(e, imgNdx) {
	if (!e) e = window.event;
	
	e.selectedImage = this.selectedImage;	
	e.selecting = imgNdx;
	e = Scriptor.event.fire(this, 'onselect', e);
	
	if (e.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var imgs = this.cmpTarget.getElementsByTagName('img');
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
};

/*
* galleryViewConnector
* 	Connector object that will connect a galleryView with an api call, so every time
* 	you call galleryView.Refresh() it will call its api to truly refresh
* 	the object in real time
*
* 	constructor parameters:
* 	galleryView: A reference to a galleryView object
* 	api: A String containig the path to the api file
* 	type: either json or xml, the format of the api file
*	parameters: query string to be passed on each call to api
*
* 	Examples for Api files
* 	XML:
* 	<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>
* 	<root success="1" errormessage="">
* 	   <image>
*		<thumbnail>gallery/thumbnails/A210d.jpg</thumbnail>
*		<path>gallery/A210d.jpg</path>
*		<name>A210d.jpg</name>
*		<param name="one">value 1.A210d.jpg</param>
*		<param name="two">value 2.A210d.jpg</param>
*	  </image>
* 	</root>
*
* 	JSON:
* 	{ "success" : 1, "errormessage" : "", "images" : [
*		{ "thumbnail" : "gallery/thumbnails/A210d.jpg", "path" : "A210d.jpg", "name" : "A210d.jpg", "one" : "value 1.A210d.jpg" }
*    ]}
*
*/
if (Scriptor.DataConnectors === undefined)
	Scriptor.DataConnectors = {};
	
Scriptor.DataConnectors.GalleryViewConnector = function(opts) {
	var localOpts = {
		galleryView : null,
		api : null,
		method : 'POST',
		type : 'json',
		parameters : ''
	};
	
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.galleryView)
	{
		Scriptor.error.report('Must provide galleryView reference to galleryViewConnector object.');
		return;
	}
	
	if (typeof(localOpts.api) != 'string' || localOpts.api == '')
	{
		Scriptor.error.report('Invalid Api string.');
		return;
	}
	
	this.api = localOpts.api;
	this.galleryView = localOpts.galleryView;
	this.parameters = localOpts.parameters;
	
	this.type = 'json';
	if (localOpts.type)
		switch (localOpts.type.toLowerCase())
		{
			case ('xml'):
				this.type = 'xml';
				break;
			case ('json'):
			default:
				this.type = 'json';
				break;
		}
		
	this.method = 'POST';
	if (typeof(localOpts.method) == 'string')
		this.method = localOpts.method.toUpperCase() == 'POST' ? 'POST' : 'GET';
		
	// event attaching and httpRequest setup
	Scriptor.event.attach(this.galleryView, 'onrefresh', Scriptor.bind(this._onRefresh, this));
	
	this.httpRequest = new Scriptor.httpRequest({
		ApiCall : this.api,
		method : this.method,
		Type : this.type,
		onError : Scriptor.bind(this._onError, this),
		onLoad : Scriptor.bind(this._onLoad, this)
	});
};

Scriptor.DataConnectors.GalleryViewConnector.prototype = {
	_onRefresh : function(e) {
		this.galleryView.setLoading(true);
			
		this.httpRequest.send(this.parameters);
		
		Scriptor.event.cancel(e);
	},
	
	_onLoad : function(data) {
		this.galleryView.setLoading(false);
		
		if (this.type == 'xml')	// xml parsing
		{
			var root = data.getElementsByTagName('root').item(0);
	
			// TODO: Add/Remove/Update images instead of replacing the whole data structure
			//   upgrade addImage, deleteImage to avoid using updateImages
			// fake visible = false so we call updateImages only once
			this.galleryView.images.length = 0;

			if (root.getAttribute('success') == '1') {
				var images = root.getElementsByTagName('image');
				
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
					
					this.galleryView.images.push(new gv_ImageObject(thumbText, pathText, nameText));
					
					var params = images.item(n).getElementsByTagName('param');
					if (params.length) {
						for (var a=0; a < params.length; a++) {
							var paramName = params.item(a).getAttribute('name');
							var paramText = '';
							if (params.item(a).firstChild)
								paramText = params.item(a).firstChild.data;
							
							this.galleryView.images[this.galleryView.images.length-1][paramName] = paramText;
						}
					}
				}
				
			}
			else {
				this.galleryView.setMessage(root.getAttribute('errormessage'));
			}
			
			if (this.galleryView.inDOM)
				this.galleryView.updateImages();
		}
		else	// json
		{
			// TODO: Add/Remove/Update images instead of replacing the whole data structure
			//   upgrade addImage, deleteImage to avoid using updateImages
			// fake visible = false so we call updateImages only once
			this.galleryView.images.length = 0;
			
			if (data.success) {
				for (var n=0; n < data.images.length; n++) {
					var thumbText = data.images[n].thumbnail;
					var pathText = data.images[n].path;
					var nameText = data.images[n].name;
					
					this.galleryView.images.push(new gv_ImageObject(thumbText, pathText, nameText));
					
					
					for (var param in data.images[n]) {
						if (param != 'thumbnail' && param != 'path' && param != 'name')
						{
							this.galleryView.images[this.galleryView.images.length-1][param] = data.images[n][param];
						}
					}
					
				}
				
			}
			else {
				this.galleryView.setMessage(data.errormessage);
			}
			
			if (this.galleryView.inDOM)
				this.galleryView.updateImages();
			
		}
	},
	
	_onError : function(status)
	{
		this.galleryView.setLoading(false);
		this.galleryView.setMessage('Error: Unable to load galleryView object (HTTP status: ' + status + ')');
	}
};