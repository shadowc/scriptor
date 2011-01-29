/* JavaScript Document
*
*  tabView component
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
* ulDiv: the id or the Ul Html that will contain the tabs.
*
* tabsDiv: the id or the Html container element for the tab panels.
* 
* tabs is an Array og Objects on the form of [ { label : String(), elem : HTML tap panel }, ... ]
*   Here you will define the different labels and DIV ids (or actual ids) for the tab system
*
* tabView.selectedTab
*  the currently selected tab
*
* tabView.visible
*  will be true after a succesfull render of the tab list. Should be read only.
*
*/
tabView = Scriptor.tabView = function(ulDiv, tabsDiv, tabs) {
	// parameter control section
	if ((typeof(ulDiv) != 'string' && !Scriptor.isHtmlElement(ulDiv)) || ulDiv == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	if ((typeof(tabsDiv) != 'string' && !Scriptor.isHtmlElement(tabsDiv)) || tabsDiv == '') {
		Scriptor.error.report('Error: second parameter bus be a non empty string or a html object.');
		return;
	}
	
	this.ulElem = typeof(ulDiv) == 'string' ? document.getElementById(ulDiv) : ulDiv;
	this.tabsElem = typeof(tabsDiv) == 'string' ? document.getElementById(tabsDiv) : tabsDiv;
	this.ulId = typeof(ulDiv) == 'string' ? ulDiv : this.ulElem.id;
	this.tabsId = typeof(tabsDiv) == 'string' ? tabsDiv : this.tabsElem.id;
	
	if (tabs && !(tabs instanceof Array)) {
		Scriptor.error.report('Error: third parameter must be an array of objects.');
		return;
	}
	
	// tab list translating and control
	this.tabs = [];
	this.selectedTab = 0;
	if (tabs)
		for (var n=0; n < tabs.length; n++) {
			if (typeof(tabs[n].label) != 'string' || (typeof(tabs[n].elem) != 'string' && !Scriptor.isHtmlElement(tabs[n].elem))) {
				Scriptor.error.report('Error: Invalid tab collection object. (element ' + n + ')');
				return;
			}
			
			var theElem = typeof(tabs[n].elem) == 'string' ? document.getElementById(tabs[n].elem) : tabs[n].elem;
			var theId = typeof(tabs[n].elem) == 'string' ? tabs[n].elem : tabs[n].elem.id;
			this.tabs[n] = {label : tabs[n].label, divStr : theId, divElem : theElem };
		}
		
	this.visible = false;
	
	/*
	* tabView.selectTab(tabNdx)
	*
	* Use this function (rather than writing the tabView.selectedTab property) to select
	* a tab panel by code. This is the function that will be used by the event handling system
	* when a user clicks on a tab
	*
	*/
	this.selectTab = function(tabNdx, e) {
		if (!this.visible)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		if (tabNdx >= 0 && tabNdx < this.tabs.length) {
			if (!this.visible || !this.ulElem)
			{
				Scriptor.event.cancel(e, true);
				return false;
			}
			
			var tabElems = this.ulElem.getElementsByTagName('li');
			
			tabElems.item(this.selectedTab).className = 'tabViewLi';
			if (this.tabs[this.selectedTab] && this.tabs[this.selectedTab].divElem)
				this.tabs[this.selectedTab].divElem.style.display = 'none';
			
			tabElems.item(tabNdx).className = 'tabViewLiSelected';
			if (this.tabs[tabNdx] && this.tabs[tabNdx].divElem)
				this.tabs[tabNdx].divElem.style.display = 'block';
			
			this.selectedTab = tabNdx;
		}
		
		Scriptor.event.cancel(e, true);
		return false;
	};
	
	/*
	* tabView.show()
	*
	* Use this function nmediately after successfully defining the tabView object in order
	* to create the tab list inside the empty UL element (shoud and will be emptied).
	*
	*/
	this.Show = function() {
		if (this.visible)
		{
			this.Refresh();
			return;
		}
		
		if (!this.ulElem)
		{
			this.ulElem = document.getElementById(this.ulId);
		}
		else
		{
			if (!this.ulElem.id)
			{
				if (!this.ulId)
					this.ulId = __getNextHtmlId();
					
				this.ulElem.id = this.ulId;
			}
		}
		
		if (!this.tabsElem)
		{
			this.tabsElem = document.getElementById(this.tabsId);
		}
		else
		{
			if (!this.tabsId)
				this.tabsId = __getNextHtmlId();
			
			this.tabsElem.id = this.tabsId;
		}
		
		if (!this.ulElem) {
			Scriptor.error.report('Error: UL does not exist.');
			return;
		}
		
		if (!this.tabsElem) {
			Scriptor.error.report('Error: HTMLContainer does not exist');
			return;
		}
		
		this.ulElem.className = 'tabViewUl';
		this.ulElem.style.display = 'block';
		this.tabsElem.style.display = 'block';
		
		for (var n=0; n < this.tabs.length; n++) {
			var curTab = this.tabs[n];
			if (Scriptor.isHtmlElement(curTab.divElem) && !curTab.parentNode)
				this.tabsElem.appendChild(curTab.divElem);
				
			if (!curTab.divElem)
			{
				curTab.divElem = document.getElementById(curTab.divStr);
			}
			else
			{
				if (!curTab.divElem.id)
				{
					if (!curTab.divStr)
						curTab.divStr = __getNextHtmlId();
						
					curTab.divElem.id = curTab.divStr;
				}
			}
			
			if (!curTab.divElem)
			{
				Scriptor.error.report('Error: Tab panel div does not exist.');
				return;
			}
			
			curTab.divElem.className = 'tabViewDiv';
		}
		
		this.visible = true;
		this.Refresh();
	};
	
	this.Refresh = function() {
		if (!this.visible)
			return;
		
		this.ulElem.innerHTML = '';
		var template = '';
		for (var n = 0; n < this.tabs.length; n++) {
			template += '<li class="' + (this.selectedTab == n ? 'tabViewLiSelected' : 'tabViewLi') + '">';
			template += '<a href="#" id="' + this.ulId+'_tab'+n + '"><span>' + this.tabs[n].label + '</span></a></li>';
		}
		this.ulElem.innerHTML = template;
		
		for (var n=0; n < this.tabs.length; n++)
			Scriptor.event.attach(document.getElementById(this.ulId+'_tab'+n), 'click', Scriptor.bind(this.selectTab, this, n));
		
		for (var n=0; n < this.tabs.length; n++) {
			if (n != this.selectedTab)
				this.tabs[n].divElem.style.display = 'none';
			else
				this.tabs[n].divElem.style.display = 'block';
		}
	};
	
	this.Hide = function() {
		if (this.ulElem)
			this.ulElem.style.display = 'none';
		if (this.tabsElem)
			this.tabsElem.style.display = 'none';
			
		this.visible = false;
	};
	
	this.addTab = function(tab, insertNdx) {
		if (typeof(tab.label) != 'string' || (typeof(tab.elem) != 'string' && !Scriptor.isHtmlElement(tab.elem))) {
			Scriptor.error.report('Error: Invalid tab object.');
			return;
		}
		
		var theElem = typeof(tab.elem) == 'string' ? document.getElementById(tab.elem) : tab.elem;
		var theId = typeof(tab.elem) == 'string' ? tab.elem : tab.elem.id;
		
		if ((insertNdx === undefined || isNaN(Number(insertNdx))) ||
			insertNdx < 0 || insertNdx > this.tabs.length-1)
		{
			this.tabs.push({label : tabs[n].label, divStr : theId, divElem : theElem });
			insertNdx = this.tabs.length-1;
		}
		else
		{
			this.tabs.splice(insertNdx, 0, {label : tabs[n].label, divStr : theId, divElem : theElem });
		}
		
		if (this.visible)
		{
			var curTab = this.tabs[insertNdx];
			if (Scriptor.isHtmlElement(curTab.divElem) && !curTab.parentNode)
				this.tabsElem.appendChild(curTab.divElem);
				
			if (!curTab.divElem)
			{
				curTab.divElem = document.getElementById(curTab.divStr);
			}
			else
			{
				if (!curTab.divElem.id)
				{
					if (!curTab.divStr)
						curTab.divStr = __getNextHtmlId();
						
					curTab.divElem.id = curTab.divStr;
				}
			}
			
			if (!curTab.divElem)
			{
				Scriptor.error.report('Error: Tab panel div does not exist.');
				return;
			}
			
			this.curTab.divElem.className = 'tabViewDiv';
			
			this.Refresh();
		}
	};
	
	this.deleteTab = function(tabNdx) {
		if (tabNdx >= 0 && tabNdx <= this.tabs.length-1)
		{
			var curTab = this.tabs[tabNdx];
			if (curTab.divElem && curTab.divElem.parentNode)
			{
				curTab.divElem.parentNode.removeChild(curTab.divElem);
				curTab.divElem = null;
			}
			
			this.tabs.splice(tabNdx, 1);
			
			if (this.selectedTab >= this.tabs.length)
				this.selectedTab = this.tabs.length-1;
				
			if (this.visible)
				this.Refresh();
		}
	};
	
	this.setTabLabel = function(tabNdx, label) {
		if (tabNdx >= 0 && tabNdx <= this.tabs.length-1)
		{
			this.tabs[tabNdx].label = label;
			
			if (this.visible && this.ulElem)
			{
				var tabElems = this.ulElem.getElementsByTagName('li');
				tabElems[tabNdx].getElementsByTagName('span')[0].innerHTML = label;
			}
		}
		
	};
};
