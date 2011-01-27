// JavaScript Document
/*
*
*  galleryView Version 1.1b
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
gv_ImageObject = function(thumbnail, path, name) {
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
* Constructor:
*  div: a tring with the id attribute of a unique div element to be the container of
*    the component.
*  sqlService: a xml service that will provide the list of images to be loaded in the array
*  thumbWidth: optional, the fixed width of the thumbnails in pixels
*  thumbHeight: optional, the fixed height of the thumbnails in pixles
*
* Properties:
*  selectedImage: the index of the selected image in the array. -1 if none.
*  enabled: set to true if the component is enabled (events will take place and
*    event handlers will be executed).
*  showNames: set to true if you want to display image names under the thumbnails
*  fidexThumbSize: if set to true will take thimbWidth and thumbHeight to set
*    the width and height of the thumbnails. 
*  thumbWidth: a Number with the optional width of the thumbnails in pixels
*  thumbHeight: a Number with the optional height of the thumbnails in pixels
*  onbeforerefresh: a function to be executed before the object will perform a
*    refresh function. If the funtion returns false, the refresh will not be performed
*  onrefresh: function to be executed after a refresh has been successful
*  onbeforeshow: a function to be executed before a show operation. If this returns false
*    show will not be performed.
*  onshow: function to be executed after a show process is successful
*  onbeforeselect: function to be executed bofore a select event. If this returns false
*    the selection won't happen.
*  onselect: function to be executed after a select event is successful
*  visible: readonly property. It is true if the component has been shown sucessfully
*  sqlService: the string containing the path to the xml service that brings the image data
*    on refresh
*  optParams: a query string with optional parameters to be passed to the xml service
*    on refresh
*  div: a sting with the id attribute of the component's assigned div element
*  http_request: internal, variable to host the xmlHttpRequest object
*  images: an array of gv_ImageObjects contained in the component
*/
galleryView = function(div, sqlService, thumbWidth, thumbHeight) {
	this.selectedImage = -1;
	this.enabled = true;
	this.showNames = true;
	this.fixedThumbSize = true;
	this.thumbWidth = isNaN(Number(thumbWidth)) ? 154 : Number(thumbWidth);
	this.thumbHeight = isNaN(Number(thumbHeight)) ? 184 : Number(thumbHeight);
	
	this.onbeforerefresh = false;
	this.onrefresh = false;
	this.onbeforeshow = false;
	this.onshow = false;
	this.onbeforeselect = false;
	this.onselect = false;
	
	this.visible = false;
	this.sqlService = sqlService;
	this.optParams = '';
	
	this.div = div;
	this.http_request = false;
	
	this.images = Array();
	
	GVE.galleryRegisters[GVE.galleryRegisters.length] = {'obj' : this, 'div' : this.div };
};

galleryView.prototype.addImage = function(imgObj) {
	
};

galleryView.prototype.insertImage = function(imgObj, ndx) {
};

galleryView.prototype.deleteImage = function(identifier) {
};

galleryView.prototype.Refresh = function() {
	if (this.onbeforerefresh) {
		if (!this.onbeforerefresh(this)) {
			return;
		}
	}
	
	if (typeof(httpRequest) == 'undefined') {
		alert('Error: Failed to load httpRequest scriptor module.');
		return;
	}
	
	if (!this.http_request) {
		this.http_request = new httpRequest(this.sqlService, 'POST', this.loadXmlData, this.loadError, this);
	}
	
	if (!this.sqlService) {
		alert( 'Invalid sql XmlService.');
		return;
	}
	
	var request;
	if (this.optParams) 
		request = this.optParams;
	else
		request = '';

	this.http_request.send( request );	
	
};

/* galleryView.loadXmlData
*  for internal use only
*/
galleryView.prototype.loadXmlData = function(xmlData, gv) {
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
};

/* galleryView.loadError
*  for internal use only
*/
galleryView.prototype.loadError = function(status, gv) {
	gv.images.length = 0;
	
	if (gv.visible) {
		gv.updateRows()
	}
	else {
		gv.Show(false);
	}
};

galleryView.prototype.Show = function(withRefresh) {
	if (withRefresh)
		this.Refresh();
	
	if (!this.div || !document.getElementById(this.div)) {
		alert( 'No HTML Object assigned to galleryView.' );
		return;
	}
	
	if (this.onbeforeshow) {
		if (!this.onbeforeshow(this)) {
			return;
		}
	}
			
	var target = document.getElementById(this.div);
	
	while (target.firstChild)
		target.removeChild(target.firstChild);
		
	
	
	if (withRefresh) {
		this.visible = false;
		// display loading div
		target.className = target.className + ' galleryViewLoading';
	}
	else {
		var classes = target.className.split(' ');
		if (classes.length > 1 && classes[classes.length-1] == 'galleryViewLoading') {
			target.className = '';
			for (var n=0; n < classes.length-1; n++) {
				target.className += classes[n];
				if (n < classes.length -2)
					target.className += ' ';
			}
		}
		this.visible = true;
		this.updateImages();
		if (this.onshow) 
			this.onshow(this);
	}
	
};

galleryView.prototype.updateImages = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update rows on non visible galleryView object.");
		return;
	}
	
	var target = document.getElementById(this.div);
	while (target.firstChild)
		target.removeChild(target.firstChild);
		
	var tmpImg;
	
	for (var n=0; n < this.images.length; n++) {
		tmpImgDiv = document.createElement('div');
		if (this.fixedThumbSize) {
			tmpImgDiv.style.width = this.thumbWidth + 'px';
			tmpImgDiv.style.height = this.thumbHeight + 'px';
			tmpImgDiv.style.overflow = 'hidden';
		}
		
		tmpImg = document.createElement('img');
		tmpImg.onclick = GVE.__selectImage;
		tmpImg.setAttribute('src', this.images[n].thumbnail);
		tmpImgDiv.appendChild(tmpImg);
		
		if (this.showNames && this.images[n].name) {
			tmpP = document.createElement('p');
			tmpP.appendChild(document.createTextNode(this.images[n].name));
			tmpImgDiv.appendChild(tmpP);
		}
		
		if (this.selectedImage == n)
			tmpImgDiv.className = 'gvSelectedImage';
		
		target.appendChild(tmpImgDiv);
	}
	
	if (this.selectedImage >= this.images.length) {
		this.selectedImage = -1;
	}
};

galleryView_engine = function() {
	this.galleryRegisters = Array();
};

galleryView_engine.prototype = {
	__findGalleryView : function (str) {
		for (var n=0; n < GVE.galleryRegisters.length; n++) 
			if (GVE.galleryRegisters[n].div == str) 
				return GVE.galleryRegisters[n].obj;
		
		return false;
	},
	
	__selectImage : function(e) {
		if (!e)
			e = window.event;
		
		var elem = (e.target) ? e.target : e.srcElement;
		
		if (elem.nodeType == 3)
			elem = elem.parentNode;
		
		var target = false;
		var curElem = elem;
		while (curElem.parentNode) {
			target = curElem.parentNode;
			if (target.className == 'galleryView')
				break;
			else
				target = false;
			curElem = curElem.parentNode;
		}
		
		if (!target) {	
			alert('Error: Unable to find container. Make sure it has class attribute set to galleryView');
			return;
		}
		
		var obj = GVE.__findGalleryView(target.id);
		if (!obj) {
			alert( 'Error: galleryView object not found.' );
			return;
		}
		
		if (!obj.enabled) 
			return;
		
		if (obj.onbeforeselect) {
			if (!obj.onbeforeselect())
				return;
		}
		
		var imgs = target.getElementsByTagName('div');
		var imgNdx = -1;
		for (var n=0; n < imgs.length; n++) {
			if (imgs.item(n).firstChild == elem) {
				imgNdx = n;
				break;
			}
		}
		
		if (imgNdx != -1) {	
			if (obj.selectedImage != -1) {
				for (var a=0; a < imgs.length; a++) {
					if (imgs.item(a).className == 'gvSelectedImage') {
						imgs.item(a).className = '';				
						break;
					}
				}
			}
			
			if (obj.selectedImage == imgNdx) {
				obj.selectedImage = -1;
			}
			else {
				obj.selectedImage = imgNdx;
				imgs.item(imgNdx).className = 'gvSelectedImage';
			}
		}
		
		if (obj.onselect)
			obj.onselect(obj);
		
	}
};

GVE = new galleryView_engine();
