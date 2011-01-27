/* JavaScript Document
*
*  tabView 1.5.1
*
*  All purpose tab interface javascript class.
*
* Part of the scriptor javascript modular loader
*/

/*
* tabView
*
* This is a tab collection object. It works by taking a UL Html object and adding
* tab labels for its different panels. The pannels are DIV Html objects which ids must
* be passed along with the desired labels to the object. This will convert a list of
* divs to a panelled tab system
*
* ulDiv: is a String with the name if the id of the Ul Html that will contain the
*   tabs.
*
* tabs is an Array og Objects on the form of [ { label : String(), id : String() }, ... ]
*   Here you will define the different labels and DIV ids for the tab system
*
* tabView.selectedTab
*  the currently selected tab
*
* tabView.visible
*  will be true after a succesfull render of the tab list. Should be read only.
*
*/
tabView = function(ulDiv, tabs) {
	// parameter control section
	if (typeof(ulDiv) != 'string' || ulDiv == '') {
		alert('Error: first parameter must be a non empty string.');
		return false;
	}
	
	this.ulId = ulDiv;
	this.ulElem = null;
	
	if (!(tabs instanceof Array)) {
		alert('Error: second parameter must be an array of objects.');
		return false;
	}
	
	// tab list translating and control
	this.tabs = Array();
	this.selectedTab = 0;
	for (var n=0; n < tabs.length; n++) {
		if (typeof(tabs[n].label) != 'string' || typeof(tabs[n].id) != 'string') {
			alert('Error: Invalid tab collection object. (element ' + n + ')');
			return false;
		}
		
		this.tabs[n] = {label : tabs[n].label, divStr : tabs[n].id };
	}
	this.visible = false;
	
	// add tabview register
	TVE.tabViewRegisters[TVE.tabViewRegisters.length] = {obj : this, ulId : this.ulId};
};

/*
* tabView.show()
*
* Use this function nmediately after successfully defining the tabView object in order
* to create the tab list inside the empty UL element (shoud and will be emptied).
*
*/
tabView.prototype.Show = function() {
	this.ulElem = document.getElementById(this.ulId);
	
	if (!this.ulElem) {
		alert('Error: UL does not exist.');
		return false;
	}
	
	while (this.ulElem.firstChild) 
		this.ulElem.removeChild(this.ulElem.firstChild);
	
	var tmpLi, tmpA, tmpSpan, tmpImg, tmpImg2;
	
	for (var n = 0; n < this.tabs.length; n++) {
		tmpLi = document.createElement('li');
		if (this.selectedTab == n) 
			tmpLi.className = 'tabViewLiSelected';
		else 
			tmpLi.className = 'tabViewLi';
		
		tmpA = document.createElement('a')
		tmpA.setAttribute('href', 'javascript:TVE.selectTab(\'' + this.ulId + '\', '+n+');');
		tmpSpan = document.createElement('span');
		tmpSpan.appendChild(document.createTextNode(this.tabs[n].label));
		tmpA.appendChild(tmpSpan);
		
		tmpLi.appendChild(tmpA);
		this.ulElem.appendChild(tmpLi);
	}
	
	for (var n=0; n < this.tabs.length; n++) {
		if (!document.getElementById(this.tabs[n].divStr)) {
			alert('Error: Tab panel div does not exist.');
			return false;
		}
		
		this.tabs[n].divElem = document.getElementById(this.tabs[n].divStr);
		
		if (n > 0)
			this.tabs[n].divElem.style.display = 'none';
	}
	
	this.visible = true;
};

/*
* tabView.selectTab(tabNdx)
*
* Use this functio (rather than writing the tabView.selectedTab property) to select
* a tab panel by code. This is the function that will be used by the event handling system
* when a user clicks on a tab
*
*/
tabView.prototype.selectTab = function(tabNdx) {
	if (!this.visible)
		return;
	
	if (tabNdx >= 0 && tabNdx < this.tabs.length) {
		var tabElems = this.ulElem.getElementsByTagName('li');
		tabElems.item(this.selectedTab).className = 'tabViewLi';
		this.tabs[this.selectedTab].divElem.style.display = 'none';
		
		tabElems.item(tabNdx).className = 'tabViewLiSelected';
		this.tabs[tabNdx].divElem.style.display = 'block';
		
		this.selectedTab = tabNdx;
	}
};

tabView_engine = function() {
	this.tabViewRegisters = Array();
};

tabView_engine.prototype = {
	selectTab : function (ulId, ndx) {
		var obj = TVE.__searchTabView(ulId);
		if (!obj) {
			alert('Error: tabView onject not found.');
			return;
		}
		
		if (ndx >= 0 && ndx < obj.tabs.length) {
			obj.selectTab(ndx);
		}
	},
	
	__searchTabView : function(str) {
		for (var n=0; n < TVE.tabViewRegisters.length; n++) 
			if (TVE.tabViewRegisters[n].ulId == str) 
				return TVE.tabViewRegisters[n].obj;
	
		return false;
	}
};

TVE = new tabView_engine();