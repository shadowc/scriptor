// JavaScript Document
/* 
*  httpReqiest version 1.0b
*
*  Manages multiple asyncronous xmlHttpRequests easily.
*
* Part of the scriptor javascript modular loader
*/

/* httpRequest
*
*
*/
httpRequest = function(xmlService, method, xmlOnload, xmlOnError, callerObj, requestHeaders) {
	if (typeof(xmlService) != 'string' || xmlService == '') {
		alert('Error: first parameter must be a string.');	
		return false;
	}
		
	this.xmlService = xmlService;
	
	this.method = 'POST';
	if (typeof(method) == 'string')
		this.method = method.toUpperCase() == 'POST' ? 'POST' : 'GET';
	
	this.xmlOnload = null;
	if (typeof(xmlOnload) == 'function') 
		this.xmlOnload = xmlOnload;
	
	this.xmlOnError = null;
	if (typeof(xmlOnError) == 'function')
		this.xmlOnError = xmlOnError;
		
	this.requestHeaders = Array();
	if (requestHeaders) {
		if (requestHeaders.length) {
			for (var n=0; n < requestHeaders.length; n++) {
				if (typeof(requestHeaders[n][0]) == 'string' && typeof(requestHeaders[n][1]) == 'string') {
					this.requestHeaders[this.requestHeaders.length] = [requestHeaders[n][0], requestHeaders[n][1]];
				}
			}
		}
	}
	
	this.callerObj = callerObj;
	this.inRequest = false;
	this.requestNumber = null;
};

/* httpRequest.send
*
*/
httpRequest.prototype.send = function(params) {
	if (this.requestNumber) {
		HTTPE.stack[this.requestNumber].req = null;
		HTTPE.stack[this.requestNumber] = null;
	}
	
	if (!(this.requestNumber = HTTPE.createRequest(this))) {
		alert(this.lang.errors.createRequestError);
		return;
	}
	
	this.inRequest = false;
	
	HTTPE.sendRequest(this.requestNumber, params);
}

/* http_request engine */
http_request_engine = function() {
	this.stack = [null];
};

http_request_engine.prototype = {
	
/* createRequest 
*
*/
createRequest : function(obj) {
	var num = HTTPE.stack.length;
	HTTPE.stack[num] = {req: null, obj: null};
	
	if (window.XMLHttpRequest) {
		HTTPE.stack[num].req = new XMLHttpRequest();
		if (HTTPE.stack[num].req.overrideMimeType) {
			HTTPE.stack[num].req.overrideMimeType('text/xml');
		}
	} else if (window.ActiveXObject) {
		try {
			HTTPE.stack[num].req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				HTTPE.stack[num].req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		}
	}
	
	if (HTTPE.stack[num].req) {
		HTTPE.stack[num].obj = obj;
		return num;
	}
	else {
		return null;
	}
},

/* sendRequest
*
*/
sendRequest : function(num, params) {
	var obj = HTTPE.stack[num].obj;
	var req = HTTPE.stack[num].req;
	
	req.open( obj.method, obj.xmlService, true );
	if (obj.method == 'POST')
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.onreadystatechange = HTTPE.handleRequest;
	req.send('httpRequestId='+num+'&'+params);
	
	obj.inRequest = true;
},

/* handleRequest 
*
*/
handleRequest : function() {
	for (var n=1; n < HTTPE.stack.length; n++) {
		if (HTTPE.stack[n]) {
			if (HTTPE.stack[n].req && HTTPE.stack[n].obj) {
				var req = HTTPE.stack[n].req;
				var obj = HTTPE.stack[n].obj;
				if (req.readyState == 4 && obj.inRequest) {
					obj.inRequest = false;
					if (req.status == 200) {
						if (obj.xmlOnload)
							obj.xmlOnload(req.responseXML, obj.callerObj);
					}
					else {
						alert(obj.lang.errors.requestHandleError + ' (' + req.status + ')');
						if (obj.xmlOnError)
							obj.xmlOnError(req.satus, obj.callerObj);
					}
				}
			}
		}
	}
}

};

HTTPE = new http_request_engine();