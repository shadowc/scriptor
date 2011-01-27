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
treeNode = function(id, pid, Name, parent, tv) {
	this.internalId = tv.getNextInternalId();
	this.id = isNaN(Number(id)) ? 0 : id;
	this.parentId = isNaN(Number(pid)) ? 0 : pid;
	this.Name = String(Name);
	this.expanded = false;
	this.childNodes = Array();
	this.parentNode = parent;
	this.treeView = tv;
	
	this.getChildNodes = function(parentNode, tv) {
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
	}
	
	this.searchNode = function(ndx) {
		var n;
		var srch = false;
		var srchNdx = 0;		
		for (n=0; n < this.childNodes.length; n++) {
			if (this.childNodes[n].internalId == ndx) {
				srch = this.childNodes[n];
				break;
			}			
		}
		while (!srch && srchNdx < this.childNodes.length) {
			srch = this.childNodes[srchNdx].searchNode(ndx);
			srchNdx++;
		}
		
		return srch;
	} 
	
	this.toString = function() {
		return "[Category Name: " + this.Name + ", ParentId: " + this.parentId + 
				 ", Children: " + this.subCategories.length + "]";
	}
};

/*
* the treeView class
*/
treeView = function (div, sqlService) {
	this.selectedNode = null;
	this.enabled = true;
	
	this.onbeforeselect = false;
	this.onselect = false;
	this.onbeforeshow = false;
	this.onshow = false;
	this.onbeforerefresh = false;
	this.onrefresh = false;

	this.visible = false;
	this.sqlService = sqlService;
	this.optParams = '';
	
	this.div = div;
	this.http_request = false;

	TrVE.dataRegisters[TrVE.dataRegisters.length] = {'dobj' : this, 'ddiv' : this.div };
	
	this.childNodes = Array();
	this.nextNodeId = 0;
}

/*
*  getNextInternalId
*
*  Interface: return a unique id for a treeNode
*/
treeView.prototype.getNextInternalId = function() {
	this.nextNodeId++;
	return new Number(this.nextNodeId);
};

treeView.prototype.searchNode = function(ndx) {
	var n;
	var srch = false;
	var srchNdx = 0;		
	for (n=0; n < this.childNodes.length; n++) {
		if (this.childNodes[n].internalId == ndx) {
			srch = this.childNodes[n];
			break;
		}			
	}
	while (!srch && srchNdx < this.childNodes.length) {
		srch = this.childNodes[srchNdx].searchNode(ndx);
		srchNdx++;
	}
	
	return srch;
};

treeView.prototype.Show = function(withRefresh) {
	if (withRefresh)
		this.Refresh();
	
	if (!this.div || !document.getElementById(this.div)) {
		alert( 'No HTML Object assigned to treeView.' );
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
	
	/* Check if element exists */
	var tree = document.createElement('ul');
	tree.id = 'mainNode_' + this.div;
	tree.className = 'treeViewContainer';
	target.appendChild(tree);
	
	if (withRefresh) {
		this.visible = false;
		// display loading div
		target.className = target.className + ' treeViewLoading';
	}
	else {
		var classes = target.className.split(' ');
		if (classes.length > 1 && classes[classes.length-1] == 'treeViewLoading') {
			target.className = '';
			for (var n=0; n < classes.length-1; n++) {
				target.className += classes[n];
				if (n < classes.length -2)
					target.className += ' ';
			}
		}
		
		this.visible = true;
		this.appendChildNodes('mainNode_' + this.div, this);
		if (this.onshow) 
			this.onshow(this);
	}
};

treeView.prototype.Refresh = function() {
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

/* treeView.loadXmlData
*  for internal use only
*/
treeView.prototype.loadXmlData = function(xmlData, tv) {
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
	
};

/* treeView.loadError
*  for internal use only
*/
treeView.prototype.loadError = function(status, tv) {
	tv.childNodes.length = 0;
	
	if (tv.visible) {
		tv.updateRows()
	}
	else {
		tv.Show(false);
	}
};

treeView.prototype.appendChildNodes = function(elementId, nodes) {
	if (!this.visible) {
		alert('treeView Error: Cannot append childnode on non visible object.');
		return;
	}
	
	var parentNode = document.getElementById(elementId);
	if (!parentNode) {
		alert('treeView Error: treeView object not found.');
		return;
	}
	
	for (var i=0; i < nodes.childNodes.length; i++) { 
		var node = document.createElement('li');
		node.id = 'tree_' + this.div + '_' + nodes.childNodes[i].internalId;

		if (nodes.childNodes[i].childNodes.length > 0) {
			/* Create link to expand node */
			var link = document.createElement('a');
			link.id = 'expandNode_' + this.div + '_' + nodes.childNodes[i].internalId;
			link.href = '#';
			link.onclick = TrVE.expandChildNode;
			link.className = 'treeViewExpandableNode';
			/*img = document.createElement('img');
			img.src = 'images/plus.gif';
			link.appendChild(img);*/
			node.appendChild(link);
			
			/* Create link to select node */
			link = document.createElement('a');
			link.id = 'selectNode_' + this.div + '_' + nodes.childNodes[i].internalId;
			link.href = '#';
			link.onclick = TrVE.selectNode;
			text = document.createTextNode(nodes.childNodes[i].Name);
			link.appendChild(text);
			node.appendChild(link);
			
			/* Create subcategory list */
			list = document.createElement('ul');
			list.id = 'branch_' + this.div + '_' + nodes.childNodes[i].internalId;
			node.appendChild(list);

			parentNode.appendChild(node);
			
			this.appendChildNodes('branch_' + this.div + '_' + nodes.childNodes[i].internalId, nodes.childNodes[i]);
		} else {
			/* Create link to select node */
			link = document.createElement('a');
			link.id = 'selectNode_' + this.div + '_' + nodes.childNodes[i].internalId;
			link.href = '#';
			link.className = 'treeViewSingleNode';
			link.onclick = TrVE.selectNode;
			text = document.createTextNode(nodes.childNodes[i].Name);
			link.appendChild(text);
			node.appendChild(link);
			
			parentNode.appendChild(node);
		}
	}
};

treeView_engine = function() {
	this.dataRegisters = Array();
};

treeView_engine.prototype = {
__findTreeView : function(str) {
	for (var n=0; n < TrVE.dataRegisters.length; n++) 
		if (TrVE.dataRegisters[n].ddiv == str) 
			return TrVE.dataRegisters[n].dobj;
	
	return false;
},

expandChildNode : function(e) {
	if (!e)
		e = window.event;
		
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var divComponents = elem.id.split('_');
	
	var tree = TrVE.__findTreeView(divComponents[1]);
	if (!tree) {
		alert('Error: treeView not found.');
	}
	
	/* Modify Link */
	elem.onclick = TrVE.collapseChildNode;
	elem.className = 'treeViewCollapsableNode';
	
	/* Expand Branch */
	var branchId = 'branch_' + divComponents[1] + '_' + divComponents[2];
	document.getElementById(branchId).style.display = 'block';
	
	return false;
},

collapseChildNode : function(e) {
	if (!e)
		e = window.event;
		
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var divComponents = elem.id.split('_');
	
	var tree = TrVE.__findTreeView(divComponents[1]);
	if (!tree) {
		alert('Error: treeView not found.');
	}
	
	/* Modify Link */
	elem.onclick = TrVE.expandChildNode;
	elem.className = 'treeViewExpandableNode';
	
	/* Expand Branch */
	var branchId = 'branch_' + divComponents[1] + '_' + divComponents[2];
	document.getElementById(branchId).style.display = 'none';	
	
	return false;
},

selectNode : function(e) {
	if (!e)
		e = window.event;
		
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var divComponents = elem.id.split('_');
	
	var tree = TrVE.__findTreeView(divComponents[1]);
	if (!tree) {
		alert('Error: treeView not found.');
	}
	
	node = divComponents[2];

	if (tree.selectedNode != null) {
		var selNode = document.getElementById('selectNode_' + tree.div + '_' + tree.selectedNode);
		selNode.onclick = TrVE.selectNode;
		
		var classes = selNode.className.split(' ');
		if (classes.length > 1) 
			selNode.className = 'treeViewSingleNode';
		else
			selNode.className = '';
	}
	tree.selectedNode = node;
	
	/* Modify Link */
	elem.onclick = TrVE.unselectNode;
	if (elem.className) 
		elem.className += ' treeViewSelectedNode';
	else
		elem.className = 'treeViewSelectedNode';
	//elem.style.backgroundColor = '#E6F0F6';
},

unselectNode : function(e) {
	if (!e)
		e = window.event;
		
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var divComponents = elem.id.split('_');
	
	var tree = TrVE.__findTreeView(divComponents[1]);
	if (!tree) {
		alert('Error: treeView not found.');
	}
	
	node = divComponents[2];
	
	tree.selectedNode = null;
	
	elem.onclick = TrVE.selectNode;
	//var selObj = tree.searchNode(divComponents[2]);
		
	var classes = elem.className.split(' ');
	if (classes.length > 1) 
		elem.className = 'treeViewSingleNode';
	else
		elem.className = '';
	
	//elem.style.backgroundColor = 'transparent';
} };

TrVE = new treeView_engine();