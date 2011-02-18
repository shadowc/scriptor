// JavaScript Document
/* 
*  httpReqiest version 1.0b
*
*  Manages multiple asyncronous xmlHttpRequests easily.
*
* Part of the Scriptor framework
*/

/* httpRequest
*
*  Parameters are:
*  ApiCall : String determining the api to call
*  method : POST or GET
*  Type : text, xml or json to parse data if necessary
*  onLoad : function to call on load
*  onError : function to call on error
*  requestHeaders : Optional reques headers as an array of array strings
*  example (this is automatically provided by httprequest):
*  	[ ['Content-Type', 'text/plain'] ]
*/
httpRequest = Scriptor.httpRequest = function(opts) {
	var localOpts = {
		ApiCall : null,
		method : 'POST',
		Type : 'json',
		onLoad : null,
		onError : null,
		requestHeaders : []
	};
	Scriptor.mixin(localOpts, opts);
	
	if (typeof(localOpts.ApiCall) != 'string' || localOpts.ApiCall == '') {
		Scriptor.error.report('httpRequest Error: first parameter must be a string.');	
		return;
	}
		
	this.ApiCall = localOpts.ApiCall;
	
	this.method = 'POST';
	if (typeof(localOpts.method) == 'string')
		this.method = localOpts.method.toUpperCase() == 'POST' ? 'POST' : 'GET';
	
	this.Type = 'text';
	if (typeof(localOpts.Type) == 'string')
	{
		switch (localOpts.Type.toLowerCase())
		{
			case ('xml'):
				this.Type = 'xml';
				break;
			case ('json'):
				this.Type = 'json';
				break;
			case ('text'):
			default:
				this.Type = 'text';
				break;
		}
	}
	
	this._mimeTypes = { xml : 'text/xml', text : 'text/plain', json : 'text/plain' };
	
	this.onLoad = null;
	if (typeof(localOpts.onLoad) == 'function') 
		this.onLoad = localOpts.onLoad;
	
	this.onError = null;
	if (typeof(localOpts.onError) == 'function')
		this.onError = localOpts.onError;
		
	this.requestHeaders = [];
	if (localOpts.requestHeaders && localOpts.requestHeaders.length) {
		for (var n=0; n < localOpts.requestHeaders.length; n++) {
			if (typeof(localOpts.requestHeaders[n][0]) == 'string' && typeof(localOpts.requestHeaders[n][1]) == 'string') {
				this.requestHeaders.push([localOpts.requestHeaders[n][0], localOpts.requestHeaders[n][1]]);
			}
		}
	}
	
	this.inRequest = false;
	this.http_request = null;
	
	// create the http_request object we're going to use
	this.createRequest();
};

httpRequest.prototype = {
	/* httpRequest.createRequest 
	*
	*  Creates the http_request internal object. For internal use only
	*/
	createRequest : function() {
		if (!this.http_request)
		{
			if (window.XMLHttpRequest) {
				this.http_request = new XMLHttpRequest();
				if (this.http_request.overrideMimeType) {
					this.http_request.overrideMimeType(this._mimeTypes[this.Type]);
				}
			} else if (window.ActiveXObject) {
				try {
					this.http_request = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						this.http_request = new ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {
						Scriptor.error.report('httpRequest could not create Ajax object.');
					}
				}
			}
		}
	},
	
	/*
	* httpRequest.send
	*
	* Send the request to the specified api
	* Params: String with optional query string parameters 
	*/
	send : function(params) {
		if (this.inRequest)
		{
			this.http_request.abort();
			this.inRequest = false;
		}
		
		var url = this.ApiCall;
		if (this.method == 'GET')
			url += '?' + params;
			
		this.http_request.open(this.method, url, true );
		if (this.method == 'POST')
			this.http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if (this.requestHeaders.length)
		{
			for (var n=0; n < this.requestHeaders.length; n++)
				this.http_request.setRequestHeader(this.requestHeaders[n][0], this.requestHeaders[n][1]);
		}
		
		this.http_request.onreadystatechange = Scriptor.bind(this.handleRequest, this);
		this.http_request.send(params);
		
		this.inRequest = true;
	},
	
	/* handleRequest 
	*
	*/
	handleRequest : function() {
		if (this.inRequest && this.http_request.readyState == 4)
		{		
			this.inRequest = false;
			if (this.http_request.status == 200) {
				if (this.onLoad)
				{
					// TODO: handle different types
					var response = null;
					switch (this.Type)
					{
						case ('xml'):
							response = this.http_request.responseXML;
							break;
						case ('json'):
							response = JSON.parse(this.http_request.responseText);
							break;
						case ('text'):
						default:
							response = this.http_request.responseText;
							break;
					}
					this.onLoad(response);
				}
			}
			else {
				if (this.onError)
					this.onError(this.http_request.status);
			}	
		}
	}
};
