/* JavaScript Document
*
* Dynamic ajax based sortable data table. It gets rows of data from an XML or JSON source that
* can be displayed and sorted dynamically on any column
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor framework
*/

/*
* dataColumn:
* Object for each of the dataView columns. Add to dataView via the addColumn method
* use deleteColum method to delete a column
* 
* Options are:
*   Name: The Javascript name of the column, for use inside Javascript. It is usefull to equal
*    Name to sqlName
*   Type: The dataType of the column. Provide a string that matches any of the memebrs of the
*    dataTypes object
*   Show: set to true if the column is to be shown in the table
*   Width: provide column width in pixels
*   Format: function to process the value output. Must accept and object of the column type and return a string
*   displayName: Name to be used when displaying the column
*   sqlName: provide if different from Name. dataView uses sqlName when interacting with
*    its designated XML Service.
*   shoToolTip: Will display a tooltip (tittle attribute) for the cell to show large contents
*   Compare : functino pointer for sorting by the column
*/
var dataColumn = function(opts) {
	var localOpts = {Name : null,
		Type : 'alpha',
		show : true,
		Width : 80,
		Format : null,
		displayName : null,
		sqlName : null,
		showToolTip : false,
		Comparator : null };
	
	Scriptor.mixin(localOpts, opts)
	if (!localOpts.Name)
	{
		Scriptor.error.report('DataColumn, invalid column data provided to constructor');
		return;
	}
	
	this.Name = localOpts.Name;
	this.Type = (typeof(dataTypes[localOpts.Type]) != 'undefined') ? localOpts.Type : 'alpha';
	this.show = localOpts.show;
	this.Width = isNaN(Number(localOpts.Width)) ? 80 : Number(localOpts.Width);
	if (this.Width < (dataViewStyle.sepWidth + dataViewStyle.cellHorizontalPadding))
		this.Width = dataViewStyle.sepWidth + dataViewStyle.cellHorizontalPadding;
		
	this.Format = localOpts.Format;
	this.displayName = localOpts.displayName ? localOpts.displayName : localOpts.Name;
	this.sqlName = localOpts.sqlName ? localOpts.sqlName : localOpts.Name;
	this.showToolTip = localOpts.showToolTip;
	this.Compare = localOpts.Compare;
	
};

/*
* dataRow
* Each of the rows in a dataView. Create via the dataView.createRow() method or
* instantiate with a columnCollection which should be an array of columns. You can
* provide dataView.columns as a parameter for instantiation which is equivalent to
* calling the createRow method.
* Optionally the initialData object can be passed to indicate the initial values
* of each column
*
* members are:
*  [colName]: Each column in the column collection creates a member in the row object
*   using the column's javascript name and initializes it with its dataType default value.
*   can be accessed directly: dataRow.<colName> or dataRow.['<colName>']
*/
var dataRow = function(columnCollection, initialData) {
	initialData = initialData ? initialData : {};
	
	for (var n=0; n < columnCollection.length; n++) {
		var name = columnCollection[n].Name;
		var type = columnCollection[n].Type;
		this[name] = initialData[name] ? dataTypes[type](initialData[name]) : dataTypes[type]();
	}
	
	// now get some values like #id which could be outside of the columnCollection object
	for (var prop in initialData)
	{
		if (this[prop] === undefined)
			this[prop] = initialData[prop];
	}
};

/* dataTypes
*
* This object defines the dataView data types. Its members define 
* empty/default object for each of the dataTypes used in the dataView using the function pointer
* to the constructor for that object. Such constructor must accept a string 
* as its argument which is comming from the XML or JSON service to the object.
*
* TODO: You can define your custom dataTypes here and they will be automatically
* implemented to the object as long as they have toString method and are comparable.
*/
var dataTypes = {
	'num' : Number,
	'alpha' : String,
	'date' : function (str) {		// constructor for date objects from MySQL date strings
		if (!str)
			return '';
		
		if (str instanceof Date)
			return str;
		
		var ret = new Date();
		
		if (typeof(str) == 'string') {
			var dateParts = str.split(' ');
			
			if (dateParts[0] == '0000-00-00') {	//empty sql date field
				return '';
			}
			else {
				var dateCmp = dateParts[0].split('-');
				ret = new Date(dateCmp[0], dateCmp[1]-1, dateCmp[2]);
				
				if (dateParts[1]) {
					var timeCmp = dateParts[1].split(':');
					ret = new Date(dateCmp[0], dateCmp[1]-1, dateCmp[2], timeCmp[0], timeCmp[1], timeCmp[2]);
				}
			}
		}
		
		return ret;
	}
};

/*
* dataView
* This is the main object. It holds a (fake)table which is assigned to an HTMLElement under
*  which to be instantiated.
*
* members are:
*  rows: This is an array with the list of row objects in the table
*  columns: This is a columnCollection or an array of column objects with column information
*  selectedRow: The current selected row. -1 for no row selected
*  selectedRows: Array of the selected rows
*  multiselect: set to true if to allow multiselect
*  curRow(): a pointer to the current selected row or null if no row is selected
*  enabled: If true, it will accept clicks. Otherwise table will be non functional for interaction.
*  
*  visible: Should be read only. It is set to true when a successfull Show() has been performed.
*  div: string with the id of the object upon which the dataView will be rendered.
*
*  orderBy: should be read only. It holds information of the Javascript column Name of the
*   active ordered column. It passes it to the SQL service for multipage dataViews or for
*   refreshing purposes
*  orderWay: should be read only. It holds information of the order way to be passed to the
*   sql service on multipage dataviews or when refreshing.
*
*  Width: The width of the object in pixels. Cannot be less than total width of the columns
*   plus 20 pixels
*  Height: The height of the object in pixels. Cannot be less than header and footer height
*   plus 20 pixels
*  style: this is the style object which repeats some of the measures found on the external .css
*   so dataView can calculate some widths and heights. Change this object if you change the
*   stylesheet.
*
*	paginating: set to true if implementing pagination on table.
*	rowsPerPage: set number of rows to show per page.
*	curPage: The current page if paginating
*
*/
Scriptor.DataView = function(opts) {
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		multiselect : true,
		paginating: false,
		rowsPerPage : 20,
		columns : [] }
		
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
	this.CMP_SIGNATURE = "Scriptor.ui.DataView";
	
	this.rows = [];
	this.columns = [];
	
	this.selectedRow = -1;
	this.selectedRows = [];
	this.multiselect = localOpts.multiselect;	// true since 1.1
	
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
	Scriptor.event.registerCustomEvent(this, 'oncontentupdated');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	Scriptor.event.registerCustomEvent(this, 'oncolumnresize');
	
	this.orderBy = false;
	this.orderWay = 'ASC';
	
	this.paginating = localOpts.paginating;
	this.rowsPerPage = localOpts.rowsPerPage;
	this.curPage = 0;
	this.totalRows = 0;
	
	this.resizingXCache = 0;
	this.resizingFrom = 0;
	this.resColumnId = null;
	
	this.nextRowId = 1;
	
	this._cached = null;
	this.create();
	Scriptor.className.add(this.target, "dataViewMain");
	
	// component template 
	this.renderTemplate();
	this.canHaveChildren = false;
	
	// add predefined columns
	for (var n=0; n < localOpts.columns.length; n++)
	{
		this.addColumn(this.createColumn(localOpts.columns[n]));
	}
	// end add
	
	this.optionsMenu = new Scriptor.ContextMenu();
	
	this.resizeImplementation = function() {
		this._checkCache();
		
		if (this._cached)
		{
			// calculate toolbars height
			var innerBox = this.__getInnerBox();
			var offsetHeight = innerBox.top + innerBox.bottom;
			
			if (this._cached.pagination_header)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.pagination_header);
				//var innerBox = Scriptor.element.getInnerBox(this._cached.pagination_header);
				offsetHeight += this._cached.pagination_header.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			if (this._cached.header)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.header);
				//var innerBox = Scriptor.element.getInnerBox(this._cached.header);
				offsetHeight += this._cached.header.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			if (this._cached.footer)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.footer);
				//var innerBox = Scriptor.element.getInnerBox(this._cached.footer);
				offsetHeight += this._cached.footer.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			// TODO: real resizing
			this._cached.outer_body.style.height = (this.height - offsetHeight) + 'px';
		}
	};
};

/*
*
* Call only once on creation!
* 
*/
Scriptor.DataView.prototype.renderTemplate = function() {
	var dvTemplate = '';
	
	// Create table paginating header
	if (this.paginating) {
		dvTemplate += '<div class="dataViewPaginationHeader dataViewToolbar" id="'+this.divId+'_paginationHeader"><ul><li>';
		dvTemplate += '<label class="dataViewPaginationPages">' + this.lang.pageStart + (this.curPage + 1) +
							this.lang.pageMiddle + '<span id="' + this.divId + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
		dvTemplate += '</label></li><li>';
		dvTemplate += '<a href="#" class="dataViewPrevBtn" id="' + this.divId + '_goToPagePrev"> </a>';
		dvTemplate += '<a href="#" class="dataViewNextBtn" id="' + this.divId + '_goToPageNext"> </a>';		
		dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.divId + '_pageInput">' + this.lang.pageEnd + '</label>';
		dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.divId + '_pageInput" />';
		dvTemplate += '<input type="button" value="' + this.lang.pageGo + '" class="dataViewPageButton" id="' + this.divId + '_pageInputBtn" />';
		dvTemplate += '</li></ul></div>';
	}
	
	// Create table header
	dvTemplate += '<div class="dataViewHeader dataViewToolbar" id="'+this.divId+'_columnsHeader">';
	dvTemplate += '<ul style="height: ' + this.style.headerHeight + 'px;" id="'+this.divId+'_columnsUl">';
	
	if (this.multiselect) {
		dvTemplate += '<li class="dataViewCheckBoxHeader">';
		dvTemplate += '<input type="checkbox" id="' + this.divId + '_selectAll" class="dataViewCheckBox" /></li>';
		dvTemplate += '<li class="dataViewSep"></li>';
	}
	
	// TODO: add/remove columns dynamically
	/*for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].show) {
			
			var colWidth = 0;
			if ((this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth) > 0) 			
				colWidth = (this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth);
			
			dvTemplate += '<li style="width: ' + colWidth + 'px;">';
			
			var aWidth = 0;
			if ((this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
				aWidth = (this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth);
			
			var aClass = '';
			if (this.orderBy == this.columns[n].Name) {
				if (this.orderWay == 'ASC')
					aClass = 'dataViewSortAsc';
				else
					aClass = 'dataViewSortDesc';
			}
			
			dvTemplate += '<a id="'+ this.div + '_columnHeader_'+n+'" style="width: ' + aWidth + 'px;" href="#"' + (aClass ? ' class="' + aClass + '"' : '') + '>';
			dvTemplate += this.columns[n].displayName + '</a></li>';
			
			dvTemplate += '<li id="' + this.div + '_sep' + n + '" style="width: ' + this.style.sepWidth + 'px;" class="dataViewFieldSep"></li>';
		}
	}*/
	
	dvTemplate += '</ul>';
	
	// add field list menu
	dvTemplate += '<span id="' + this.div + '_optionsMenuBtn" class="dataViewHeaderMenu">';
	dvTemplate += '<a href="#"> </a></span></div>';
	
	// Create body
	var bodyHeight = 0;
	if (this.paginating) 
		bodyHeight = (this.height - 40);
	else
		bodyHeight = (this.height - 40);
		
	dvTemplate += '<div id="'+this.divId+'_outerBody" class="dataViewOuterBody">';
	dvTemplate += '<div class="dataViewBody" id="'+this.divId+'_body"></div>';
	dvTemplate += '</div>';
	
	// Create footer
	dvTemplate += '<div id="' + this.divId + '_footer" class="dataViewFooter dataViewToolbar"></div>';
	
	this.cmpTarget.innerHTML = dvTemplate;
	
	this._checkCache();
	
	//assign some events
	/*if (this.multiselect) 
		Scriptor.event.attach(document.getElementById(this.div + '_selectAll'), 'click', Scriptor.bindAsEventListener(this.__selectAll, this));
	
	if (this.paginating) {
		Scriptor.event.attach(document.getElementById(this.div + '_goToPagePrev'), 'click', Scriptor.bindAsEventListener(this.__goToPagePrev, this));
		Scriptor.event.attach(document.getElementById(this.div + '_goToPageNext'), 'click', Scriptor.bindAsEventListener(this.__goToPageNext, this));
		Scriptor.event.attach(document.getElementById(this.div + '_pageInput'), 'keypress', Scriptor.bindAsEventListener(this.__checkGoToPage, this));
		Scriptor.event.attach(document.getElementById(this.div + '_pageInputBtn'), 'click', Scriptor.bindAsEventListener(this.__goToPage, this));
	}
	
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].show) {
			Scriptor.event.attach(document.getElementById(this.div+'_columnHeader_'+n), 'click', Scriptor.bindAsEventListener(this.__setOrder, this, n));
			Scriptor.event.attach(document.getElementById(this.div + '_sep' + n), 'mousedown', Scriptor.bindAsEventListener(this.activateResizing, this, n));
		}
	}
	
	Scriptor.event.attach(document.getElementById(this.div + '_optionsMenuBtn'), 'click', Scriptor.bindAsEventListener(this.showOptionsMenu, this));*/
	
};

/*
*
* Internal function to cache some dom elements used in resizing
* 
*/
Scriptor.DataView.prototype._checkCache = function() {
	if (!this._cached && document.getElementById(this.divId+'_columnsHeader'))
	{
		// cache elements
		this._cached = {
			pagination_header : document.getElementById(this.divId+'_paginationHeader'),
			header : document.getElementById(this.divId+'_columnsHeader'),
			outer_body : document.getElementById(this.divId+'_outerBody'),
			body : document.getElementById(this.divId+'_body'),
			footer : document.getElementById(this.divId+'_footer')
		};
	}
};

/*
* dataView.getTotalPages()
*  When paginating, this tells the total number of pages in the object
*/
Scriptor.DataView.prototype.getTotalPages = function() {
	var totalPages = 0;
	var rowLength = this.totalRows ? this.totalRows : this.rows.length;
		
	var n=0;
	while (n < rowLength) {
		n += this.rowsPerPage;
		totalPages++;
	}
	
	return totalPages;
};