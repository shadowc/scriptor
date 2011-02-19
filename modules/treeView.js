// JavaScript Document
/*
*
*  treeView Version 2.0b
*
*  Javascript component that displays a list of hierarchically organized data much like a
*   directory listing using an XML service to retrieve the data.
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+
*/

/* treeNode
*
* js class for every category (node) on the treeView
*/
var treeNode = function(opts) /*id, pid, Name, parent, tv)*/ {
	var localOpts = {
		id : null,
		parentId : 0,
		parent : null,
		Name : ""
	};
	
	Scriptor.mixin(localOpts, opts);
	this.treeView = localOpts.treeView;
	
	this.id = localOpts.id !== null ? localOpts.id : this.treeView.getNextNodeId();
	this.parentId = localOpts.parentId
	this.Name = String(localOpts.Name);
	this.expanded = false;
	this.childNodes = [];
	this.parentNode = localOpts.parent;
};

treeNode.prototype = {
	// TODO: Remove this function and set it on treeNodeConnector, XML
	getChildNodes : function(parentNode, tv)
	{
		for (var n=0; n<parentNode.childNodes.length; n++) {
			if (parentNode.childNodes[n].nodeName == 'category') {
				var ndx = this.childNodes.length;

				nodeId = parentNode.childNodes[n].getAttribute('id');
				nodeParentId = parentNode.childNodes[n].getAttribute('parentid');
				nodeName = parentNode.childNodes[n].getAttribute('name');

				this.childNodes[ndx] = new treeNode(nodeId, nodeParentId, nodeName, parentNode, tv);
				if (parentNode.childNodes[n].childNodes.length > 0) {
					this.childNodes[ndx].getChildNodes( this.parentNode.childNodes[n], tv );
				}
			}
		}
	},
	
	searchNode : function(id)
	{
		var n;
		var srch = null;
		var srchNdx = 0;		
		for (n=0; n < this.childNodes.length; n++) {
			if (this.childNodes[n].id == id) {
				srch = this.childNodes[n];
				break;
			}			
		}
		while (!srch && srchNdx < this.childNodes.length) {
			srch = this.childNodes[srchNdx].searchNode(id);
			srchNdx++;
		}
		
		return srch;
	},
	
	/* assumes an empty ul element and fills it with al its children and subchildren
	*/
	updateChildrenNodes : function()
	{
		var parentNode = document.getElementById(this.treeView.div + '_' + this.id + '_branch');
		
		for (var i=0; i < this.childNodes.length; i++) { 
			var node = document.createElement('li');
			node.id = this.treeView.div + '_' + this.childNodes[i].id;
			parentNode.appendChild(node);
			
			var nodeTemplate = '';
			var hasChildren = this.childNodes[i].childNodes.length;
			
			if (hasChildren) {
				// Create link to expand node
				nodeTemplate += '<a id="'+this.treeView.div + '_' + this.childNodes[i].id + '_expandable" href="#" class="';
				nodeTemplate += (this.childNodes[i].expanded ? 'treeViewCollapsableNode' : 'treeViewExpandableNode') + '"></a>';
			}
			
			// Create link to select node
			nodeTemplate += '<a id="'+this.treeView.div+'_'+this.childNodes[i].id+'_selectNode" ';
			if (!hasChildren)
				nodeTemplate += 'class="treeViewSingleNode" ';
			nodeTemplate += 'href="#">'+this.childNodes[i].Name+'</a>';
			
			if (hasChildren)
			{
				// Create subcategory list
				nodeTemplate += '<ul id="' + this.treeView.div + '_' + this.childNodes[i].id + '_branch"></ul>';
			}
			
			node.innerHTML = nodeTemplate;
			
			if (hasChildren)	
				Scriptor.event.attach(document.getElementById(this.treeView.div + '_' + this.childNodes[i].id + '_expandable'),
									  'click',
									  Scriptor.bind(this.treeView._expandNode, this.treeView, this.childNodes[i].id));
				
			Scriptor.event.attach(document.getElementById(this.treeView.div + '_' + this.childNodes[i].id + '_selectNode'),
									  'click',
									  Scriptor.bind(this.treeView._selectNode, this.treeView, this.childNodes[i].id));
			
			if (hasChildren)
				this.childNodes[i].updateChildrenNodes();
			
		}
	},
	
	toString : function() {
		return "[Name: " + this.Name + ", ParentId: " + this.parentId + 
				 ", Children: " + this.childNodes.length + "]";
	}
};

/*
* the treeView class
*/
treeView = Scriptor.treeView = function (div) {
	this.selectedNode = null;
	this.enabled = true;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onselect');
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	
	this.visible = false;
	
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.masterNode = new treeNode({id : 0, parentId : 0, parent : null, Name : "root", treeView : this });
	this.nextNodeId = 1;
};

treeView.prototype = {
	/*
	*  getNextInternalId
	*
	*  Interface: return a unique id for a treeNode
	*/
	getNextNodeId : function() {
		var found = true;
		while (found)
		{
			if (this.masterNode.searchNode(this.nextNodeId) === null)
				found = false;
			else
				this.nextNodeId++;
		}
		
		return this.nextNodeId;
	},
	
	searchNode : function(id) {
		return this.masterNode.searchNode(id);
	},
	
	/*
	* treeView.Refresh();
	*  This function will call updateNodes to refresh treeView nodes if visible
	*  You can use a treeViewConnector object to connect an XML or JSON service to treeView
	*  and this will automatically retrieve information assync every time
	*  you call Refresh() method.
	*/
	Refresh : function() {
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		if (this.visible)
			this.updateNodes();
	},
	
	Show : function(withRefresh) {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
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
			Scriptor.error.report('Error: treeView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'treeView';
		target.innerHTML = '<ul id="'+this.div+'_0_branch" class="treeViewContainer"></ul>';
		
		this.visible = true;
		if (withRefresh) 
			this.Refresh();
	},
	
	updateNodes : function()
	{
		if (this.visible)
		{
			document.getElementById(this.div+"_0_branch").innerHTML = '';
			this.masterNode.updateChildrenNodes();
		}
	},
	
	setLoading : function(val)
	{
		this.divElem.className = "treeViewMain" + (val ? " treeViewLoading" : "");
	},
	
	/*
	* treeView.setMessage(msg)
	*	Set a message (usefull for error messages) and hide all info in a treeView
	* 	If msg is set to false or not present, it will restore treeView to normal
	*/
	setMessage : function(msg) {
		// false, null, or msg not present resets dataView to normal
		if (msg === false || msg === null || typeof(msg) != "string")
		{
			if (document.getElementById(this.div + '_message'))
				document.getElementById(this.div + '_message').parentNode.removeChild(document.getElementById(this.div + '_message'));
				
			document.getElementById(this.div + '_0_branch').style.display = '';
		}
		else	// if string passed, we show a message
		{
			document.getElementById(this.div + '_0_branch').style.display = 'none';
			var msgDiv;
			if (!document.getElementById(this.div + '_message'))
			{
				msgDiv = document.createElement('div');
				msgDiv.id = this.div + '_message';
				msgDiv.className = 'treeViewMessageDiv';
				document.getElementById(this.div).appendChild(msgDiv);
			}
			else
			{
				msgDiv = document.getElementById(this.div + '_message');
			}
			msgDiv.innerHTML = msg;
		}
	},
	
	/* treeView.loadXmlData
	*  for internal use only
	*/
	// TODO: Move to treeView connector
	/*treeView.prototype.loadXmlData = function(xmlData, tv) {
		var root = xmlData.getElementsByTagName('root').item(0);
		if (root.getAttribute('success') == '1') {
			tv.childNodes.length = 0;
			
			var categories = root.getElementsByTagName('categories').item(0);
			for (var i=0; i<categories.childNodes.length; i++) {
				if (categories.childNodes[i].nodeName == 'category') {
					nodeId = categories.childNodes[i].getAttribute('id');
					nodeParentId = categories.childNodes[i].getAttribute('parentid');
					nodeName = categories.childNodes[i].getAttribute('name');
	
					ndx = tv.childNodes.length;
					tv.childNodes[ndx] = new treeNode(nodeId, nodeParentId, nodeName, categories.childNodes[i], tv);
					tv.childNodes[ndx].getChildNodes(categories.childNodes[i], tv);
				}
			}
			
			if (tv.onrefresh)
				tv.onrefresh(tv);
					
			tv.Show(false);
	
		} else {
			alert( 'Unsuccessful XML call.\nMessage: '+ root.getAttribute('error'));
			tv.Show(false);
			return;
		}
		
	};*/
	
	/* treeView.loadError
	*  for internal use only
	*/
	// TODO: move to treeViewConnector
	/*treeView.prototype.loadError = function(status, tv) {
		tv.childNodes.length = 0;
		
		if (tv.visible) {
			tv.updateRows()
		}
		else {
			tv.Show(false);
		}
	};*/
	
	_expandNode : function(e, nodeId) {
		var node = this.searchNode(nodeId);
		if (node.expanded)
		{
			node.expanded = false;
			document.getElementById(this.div+'_'+nodeId+'_branch').style.display = 'none';
		}
		else
		{
			node.expanded = true;
			document.getElementById(this.div+'_'+nodeId+'_branch').style.display = 'block';
		}
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	_selectNode : function(e, nodeNdx)
	{
		if (this.selectedNode !== null) {
			var selNode = this.searchNode(this.selectedNode);
			
			if (selNode.childNodes.length)
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = '';
			else
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = 'treeViewSingleNode';
		}
		
		if (this.selectedNode != nodeNdx)
		{
			var selNode = this.searchNode(nodeNdx);
			if (selNode.childNodes.length) 
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = 'treeViewSelectedNode';
			else
				document.getElementById(this.div + '_' + selNode.id + '_selectNode').className = 'treeViewSingleNode treeViewSelectedNode';
		}
				
		this.selectedNode = (this.selectedNode == nodeNdx) ? null : nodeNdx;
	},
	
	/*
	* treeView.addNode
	* 	Adds a node with opts properties under parent id, optionally pass ndx to
	* 	insert it between 2 children
	*
	*  ops:
	*  	id : node Id, optional, MUST BE UNIQUE and not 0
	*  	Name : Node label, must be string
	*/
	addNode : function(opts, parent, ndx) {
		var parentNode = (parent == 0) ? this.masterNode : this.searchNode(parent);
		
		if (parentNode)
		{
			localOpts = {
				treeView : this,
				parentId : parent,
				parent : parentNode,
				Name : ''
			};
			Scriptor.mixin(localOpts, opts);
			
			if (ndx >= 0 && ndx < parentNode.childNodes.length)
				parentNode.childNodes.splice(ndx, 0, new treeNode(localOpts));
			else
				parentNode.childNodes.push(new treeNode(localOpts));
				
			if (this.visible)
				this.updateNodes();
		}
	}
};
