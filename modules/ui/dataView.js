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
	this.optionsMenu.addItem({label : this.lang.refresh, onclick : Scriptor.bindAsEventListener(function(e) {
		if (!e) e = window.event;
		
		this.Refresh();
		this.optionsMenu.Hide();
		
		Scriptor.event.cancel(e);
		return false;
	}, this)});
	this.optionsMenu.addItem({label : 'sep'});
	
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
				offsetHeight += this._cached.pagination_header.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			if (this._cached.header)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.header);
				offsetHeight += this._cached.header.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			if (this._cached.footer)
			{
				var outerBox = Scriptor.element.getOuterBox(this._cached.footer);
				offsetHeight += this._cached.footer.offsetHeight + outerBox.top + outerBox.bottom;
			}
			
			this._cached.outer_body.style.height = (this.height - offsetHeight) + 'px';
			
			// TODO: resize columns?
		}
	};
	
	this._registeredEvents = [];
	this.DOMAddedImplementation = function() {
		this._checkCache();
		
		//assign some events
		if (this.multiselect) 
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_selectAll'), 'click', Scriptor.bindAsEventListener(this.__selectAll, this)));
		
		if (this.paginating) {
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_goToPagePrev'), 'click', Scriptor.bindAsEventListener(this.__goToPagePrev, this)));
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_goToPageNext'), 'click', Scriptor.bindAsEventListener(this.__goToPageNext, this)));
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_pageInput'), 'keypress', Scriptor.bindAsEventListener(this.__checkGoToPage, this)));
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_pageInputBtn'), 'click', Scriptor.bindAsEventListener(this.__goToPage, this)));
		}
		
		for (var n=0; n < this.columns.length; n++)
			this._addColumnToUI(this.columns[n], n);
		
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show) {
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_columnHeader_'+n), 'click', Scriptor.bindAsEventListener(this.__setOrder, this, n)));
				this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_sep_' + n), 'mousedown', Scriptor.bindAsEventListener(this.activateResizing, this, n)));
			}
		}
		
		this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_optionsMenuBtn'), 'click', Scriptor.bindAsEventListener(this.showOptionsMenu, this)));
		
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
			
		for (var n=0; n < this.columns.length; n++)
			this._removeColumnFromUI(n);
			
		this._cached = null;
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
		dvTemplate += '<div class="dataViewPaginationHeader dataViewToolbar" id="'+this.divId+'_paginationHeader"><ul><li class="first">';
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
	dvTemplate += '</ul>';
	
	// add field list menu
	dvTemplate += '<span id="' + this.divId + '_optionsMenuBtn" class="dataViewHeaderMenu">';
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
			headerUl : document.getElementById(this.divId+'_columnsUl'),
			outer_body : document.getElementById(this.divId+'_outerBody'),
			rows_body : document.getElementById(this.divId+'_body'),
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

/*
* dataView.getNextRowId()
*   Since every row needs a unique id field, we will assign one automatically if
*   not provided
*/
Scriptor.DataView.prototype.getNextRowId = function() {
	var found = true;
	while (found)
	{
		found = false;
		var rowId = this.nextRowId++;
		for (var n=0; n < this.rows.length; n++)
		{
			if (this.rows[n].id == rowId)
			{
				found = true;
				break;
			}
		}
	}
	
	return rowId;
};

/*
* dataView.createColumn()
*  Use this function to get a column object instanciated. This function exposes
*  dataColumn publicly
*/
Scriptor.DataView.prototype.createColumn = function(opts) {
	return new dataColumn(opts);
};

/*
* dataView.addColumn()
*  Adds the passed column instance to the dataView columnCollection. Updates rows information 
*  if needed with empty objects and if dataView is visible performs a Show() to refresh.
*/
Scriptor.DataView.prototype.addColumn = function(column, ndx) {
	if (this.__findColumn(column.Name) == -1) {
		if (ndx === undefined)
			ndx = this.columns.length;
			
		this.columns.splice(ndx, 0, column);
	
		if (this.rows.length > 0) {
			for (var n=0; n < this.rows.length; n++) {
				this.rows[n][column.Name] = dataTypes[column.Type]();
			}
		}
		
		if (!this.orderBy && column.show)
			this.orderBy = column.Name;
		
		if (this.inDOM)
		{
			this._addColumnToUI(this.columns[ndx], ndx);
		}
	}
};

/*
* dataView.__findColumn()
*  Internal function that returns the index of a column in its collection or -1 if not found.
*  Pass the column Name property in colName
*/
Scriptor.DataView.prototype.__findColumn = function(colName) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == colName) 
			return n;
	}
	return -1;
};

/*
* dataView.deleteColumn()
*  Deletes the column passed by the identifier parameter. Can be a column (Javascript) Name,
*  a column index in the collection or an instance of a Column object inside the collection.
*  will update row information if needed discarting the deleted column.
*/
Scriptor.DataView.prototype.deleteColumn = function(identifier) {
	var colName = '';
	var ndx = null;
	
	if (typeof(identifier) == 'string') {
		var colNdx = this.__findColumn(identifier);
		if (colNdx != -1) {
			colName = this.columns[colNdx].Name;
			ndx = colNdx;
			this.columns.splice(colNdx,1);
		}
	}
	
	if (typeof(identifier) == 'number') {
		if (identifier > 0 && identifier < this.columns.length)
		{
			colName = this.columns[identifier].Name;
			ndx = identifier;
			this.columns.splice(identifier,1);
		}
	}
	
	if (typeof(identifier) == 'object') {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n] == identifier) {
				colName = this.columns[n].Name;
				ndx = n;
				this.columns.splice(n, 1);
			}
		}
	}
	
	if (colName) {
		if (this.rows.length > 0) {
			for (var n=0; n < this.rows.length; n++) {
				this.rows[n][colName] = null;
				delete this.rows[n][colName];
			}
		}
		
		if (this.orderBy == colName)
			this.orderBy = this.columns[this.columns.length-1].Name;
			
		if (this.inDOM)
		{
			this._removeColumnFromUI(ndx);
		}
	}
};

/*
* dataView._addColumnToUI()
*  Internal use only, to dynamically refresh columns on UI
*/
Scriptor.DataView.prototype._addColumnToUI = function(column, ndx) {
			
	var li = document.createElement('li');
	li.style.width = column.Width + 'px';
	if (!column.show)
		li.className = dataViewColumnHidden;
	
	var a = document.createElement('a');
	if (this.orderBy == column.Name) {
		if (this.orderWay == 'ASC')
			a.className = 'dataViewSortAsc';
		else
			a.className = 'dataViewSortDesc';
	}
	a.id = this.divId + '_columnHeader_'+ndx;
	a.setAttribute('href', '#');
	a.innerHTML = column.Name;
	li.appendChild(a);
	
	li2 = document.createElement('li');
	li2.id = this.divId + '_sep_' + ndx;
	li2.className = "dataViewFieldSep";
	
	var columns = this._cached.headerUl.getElementsByTagName('li');
	
	if (!columns.length)
	{
		this._cached.headerUl.appendChild(li);
		this._cached.headerUl.appendChild(li2);
	}
	else
	{
		var baseNdx = this.multiselect ? 2 : 0;
			
		if (ndx >= 0 && (baseNdx + (ndx*2)) < columns.length)
		{
			this._cached.headerUl.insertBefore(li, columns[baseNdx + (ndx*2)]);
			this._cached.headerUl.insertBEfore(li2, colunms[baseNdx + (ndx*2)+1]);
		}
		else
		{
			this._cached.headerUl.appendChild(li);
			this._cached.headerUl.appendChild(li2);
		}
	}
	
	
	if (this.rows.length) {
		var rowsUls = this._cached.rows_body.getElementsByTagName('ul');
		for (var n=0; n < this.rows.length; n++)
		{
			this._addCellToUI(n, column.Name, ndx);
		}
	}
};

/*
* dataView._removeColumnFromUI()
*  Internal use only, to dynamically refresh columns on UI
*/
Scriptor.DataView.prototype._removeColumnFromUI = function(ndx) {
	// TODO: remove columns dynamically!
};

/*
* dataView._addCellToUI()
*  Internal use only, to dynamically add/remove cells on UI
*/
Scriptor.DataView.prototype._addCellToUI = function(rowNdx, colName, ndx) {
	var rowsUls = this._cached.rows_body.getElementsByTagName('ul');
	if (rowsUls[rowNdx])	// just make sure the row is there
	{
		var cells = rowsUls[rowNdx].getElementsByTagName('li');
		var newCell = document.createElement('li');
		li.id = this.divId + '_cell_' + this.rows[rowNdx].id + '_' + colNdx
		
		// TODO: className
		
		if (ndx > 0 && ndx < cells.length)
		{
			rowsUls[rowNdx].insertBefore(li, cells[ndx]);
		}
		else
		{
			rowsUls[rowNdx].appendChild(li);
		}
		
		this.setCellValue(this.rows[rowNdx].id, colName, this.rows[rowNdx][colName]);
	}
};

/*
* dataView.createRow()
*  Use this function to get a row object instanciated with the column informaion of the
*  dataView object. You can initialize its values before using dataView.addRow() to
*  add it to the row list.
*/
Scriptor.DataView.prototype.createRow = function(data) {
	data = data ? data : {};

	if (!data.id)
		data.id = this.getNextRowId();
	
	return new dataRow(this.columns, data);
};

/*
* dataView.addRow()
*  calling addRow() will add rowObj to the rows in the dataView object. If nothing is passed
*  as an argument, an empty row will be added. If dataView is visible it will call
*  updateRows to reflect the changes.
*/
Scriptor.DataView.prototype.addRow = function(rowObj, ndx) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Add table to DOM before working with rows");
		return;	
	}
	
	if (!rowObj) 
		rowObj = this.createRow();
	else
		if (!rowObj.id)
			rowObj.id = this.getNextRowId();
	
	if (ndx === undefined)
		ndx = this.rows.length;
	else if (ndx < 0 || ndx > this.rows.length)
		ndx = this.rows.length;
		
	if (ndx > 0 && ndx < this.rows.length)
		this.rows.splice(ndx, 0, rowObj);
	else
		this.rows.push(rowObj);
	
	this._addRowToUI(ndx);
	
	if (this.selectedRow >= ndx)
	{
		this.selectedRow++;
	}
	
	if (this.multiselect)
		for (var n=0; n < this.selectedRows.length; n++)
		{
			if (this.selectedRows >= ndx)
				this.selectedRows[n]++;
		}
		
	// TODO: Refresh selection changes
	/*if (this.visible) 
		this.updateRows();*/
};

/*
* dataView.deleteRow()
*  This method will delete the row identified by identifier. It can be a row index in the
*  array of rows (i.e.: dataView.selectedRow when != -1) or an instance of a row object 
*  in the array. If dataView is visible it will call updateRows to reflect the changes.
*/
Scriptor.DataView.prototype.deleteRow = function(identifier) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Add table to DOM before working with rows");
		return;	
	}
	
	var rowNdx = -1;
	
	if (typeof(identifier) == 'number') {
		rowNdx = identifier;
		this.rows.splice(identifier,1);
	}
	
	if (typeof(identifier) == 'object') {
		for (var n=0; n < this.rows.length; n++) {
			if (this.rows[n] == identifier) {
				rowNdx = n;
				this.rows.splice(n, 1);
			}
		}
	}
	
	if (rowNdx != -1)
		this._removeRowFromUI(rowNdx);
	
	if (this.selectedRow > this.rows.length -1)
		this.selectedRow = -1;
	else if (this.selectedRow >= rowNdx)
		this.selectedRow--;
	
	if (this.multiselect)
		for (var n=0; n < this.selectedRows.length; n++)
		{
			if (this.selectedRows[n] > this.rows.length -1)
			{
				this.selectedRows.splice(n, 1);
				n--;
			}
			else if (this.selectedRows[n] >= rowNdx)
			{
				this.selectedRows[n]--;
			}
		}
	
	// TODO: reflect selection changes
	/*if (rowNdx != -1 && this.visible) 
		this.updateRows();*/
};

/*
* dataView._addRowToUI()
*  Internal use only, to dynamically add/remove rows on UI
*/
Scriptor.DataView.prototype._addRowToUI = function(rowNdx) {
	// TODO
};

/*
* dataView._removeRowFromUI()
*  Internal use only, to dynamically add/remove rows on UI
*/
Scriptor.DataView.prototype._removeRowFromUI = function(rowNdx) {
	// TODO
};

/*
* dataView.curRow()
*  returns the currently selected row at any time
*/
Scriptor.DataView.prototype.curRow = function() {
	return this.selectedRow != -1 ? this.rows[this.selectedRow] : null;
};

/* dataView.curRows()
*  multiselect: Returns an array of the currently selected rows at any time
*/
Scriptor.DataView.prototype.curRows = function() {
	var rows = [];
	if (this.multiselect)
	{
		for (var n=0; n < this.selectedRows.length; n++)
			rows.push(this.rows[this.selectedRows[n]]);
	}
	
	return this.multiselect ? rows : this.curRow();
};

/* dataView.getById()
* returns a row if found one matching the id, or null
*/
Scriptor.DataView.prototype.getById = function(id) {
	for (var n=0; n < this.rows.length; n++)
		if (this.rows[n].id == id)
			return this.rows[n];
	
	return null;
};

/* dataView.searchRow()
* returns an array of rows matching the value for the columnName given
*/
Scriptor.DataView.prototype.searchRows = function(columnName, value) {
	var ret = [];
	
	for (var n=0; n < this.rows.length; n++)
	{
		if (this.rows[n][columnName] == value)
			ret.push(this.rows[n]);
	}
	
	return ret;
};

/*
* dataView.setCellValue();
* Dynamically updates the value in a cell, performing visual updates if needed
* returns true on success, false on error
*/
Scriptor.DataView.prototype.setCellValue = function(rowId, columnName, value) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Add table to DOM before working with rows");
		return false;	
	}
	
	var colNdx = this.__findColumn(columnName);
	if (colNdx == -1)
		return false;
	
	var rowNdx = null;
	for (var n=0; n < this.rows.length; n++)
	{
		if (this.rows[n].id == rowId)
		{
			rowNdx = n;
			break;
		}
	}
	if (rowNdx === null)
		return false;
	
	this.rows[rowNdx][columnName] = value;
	
	var cell = document.getElementById(this.divId + '_cell_' + rowId + '_' + colNdx);
	
	if (typeof(this.columns[colNdx].Format) == 'function') {
		var funcRet = this.columns[colNdx].Format(value);
		cell.innerHTML = '';
		if (typeof(funcRet) == 'string')
			cell.innerHTML = funcRet;
		else
			cell.appendChild(funcRet);		
	}
	else {
		cell.innerHTML = value;
	}
	
	return true;
};

/*
* dataView.Refresh();
*  This function will call updateRows to refresh dataView rows if visible
*  You can use a dataViewConnector object to connect an XML or JSON service to dataView
*  and this will automatically retrieve information assync every time
*  you call refresh() method.
*/
Scriptor.DataView.prototype.Refresh = function() {
	var e = Scriptor.event.fire(this, 'onrefresh');
	if (!e.returnValue)
		return;
	
	if (this.created)
		this.updateRows();
};

/*
* dataView.setLoading(val)
*   If val is true, show loading spinner, else show the actual rows,
*   usefull for assync updates
*/
Scriptor.DataView.prototype.setLoading = function(val) {
	var body = document.getElementById(this.divId + '_body');
	
	body.style.display = val ? 'none' : '';
	body.parentNode.className = val ? 'dataViewLoading' : 'dataViewOuterBody';
	
};

/*
* dataView.setMessage(msg)
*	Set a message (usefull for error messages) and hide all rows in a dataView
* 	If msg is set to false or not present, it will restore dataView to normal
*/
Scriptor.DataView.prototype.setMessage = function(msg) {
	// false, null, or msg not present resets dataView to normal
	if (msg === false || msg === null || typeof(msg) != "string")
	{
		if (document.getElementById(this.divId + '_message'))
			document.getElementById(this.divId + '_message').parentNode.removeChild(document.getElementById(this.divId + '_message'));
			
		document.getElementById(this.divId + '_body').style.display = '';
	}
	else	// if string passed, we show a message
	{
		document.getElementById(this.divId + '_body').style.display = 'none';
		var msgDiv;
		if (!document.getElementById(this.divId + '_message'))
		{
			msgDiv = document.createElement('div');
			msgDiv.id = this.divId + '_message';
			msgDiv.className = 'dataViewMessageDiv';
			document.getElementById(this.divId + '_body').parentNode.appendChild(msgDiv);
		}
		else
		{
			msgDiv = document.getElementById(this.divId + '_message');
		}
		msgDiv.innerHTML = msg;
	}
};

/*
* dataView.clearSelection()
*
*   Use programatically to clear all selections in the dataView
*/
Scriptor.DataView.prototype.clearSelection = function()
{
	this.selectedRow = -1;
	this.selectedRows = [];
	
	document.getElementById(this.divId + '_selectAll').checked = false;
	// TODO: refresh selection change
	// this.updateRows();
};

/*
* __selectAll()
*  This function executes when clicking on a dataView header checkmox in multiselect and selects all rows.
*/
Scriptor.DataView.prototype.__selectAll = function(e) {
	if (!e) e = window.event;
	
	if (!this.enabled)
	{
		Scriptor.event.cancel(e);
		return;
	}
	
	var elem = document.getElementById(this.divId + '_selectAll');
	
	if (this.rows.length) {
		if (elem.checked) {
			this.selectedRow = this.rows.length -1;
			this.selectedRows = [];
			
			for (var n=0; n < this.rows.length; n++)
				this.selectedRows.push(n);
				
			// TODO: reflect selection change
			//this.updateRows();
		}
		else {
			this.selectedRow = -1;
			this.selectedRows = [];
			
			// TODO: reflect selection change
			//this.updateRows();
		}
	}
	else {
		elem.checked = false;
	}
};

/*
* __goToPage()
*  This function executes when changing the page on a paginated dataView
*/
Scriptor.DataView.prototype.__goToPage = function (e) {
	if (!this.enabled)
		return;
		
	var page = document.getElementById(this.divId + '_pageInput').value;
	
	var totalPages = this.getTotalPages();
	
	if (isNaN(Number(page))) {
		alert('Invalid page number.');
		return;
	}
	else {
		if (page < 1 || Number(page) > totalPages) {
			alert('Invalid page number.');
			return;
		}
		else {
			this.curPage = Number(page) -1;
			this.selectedRow = -1;
			this.selectedRows = [];
			
			// TODO: ?
			//this.Show(true);
		}
		
		document.getElementById(this.divId + '_pageInput').focus();
	}
};

/*
* __checkGoToPage()
*  This function executes to capture <enter> key press on the dataView page input
*/
Scriptor.DataView.prototype.__checkGoToPage = function (e) {
	if (!e) e = window.event;
	
	if (e.keyCode == 13) {
		this.__goToPage(e)
	}
};

/*
* __goToPagePrev
*  This function executes when clicked on the "previous" link
*/
Scriptor.DataView.prototype.__goToPagePrev = function (e) {
	if (!e) e = window.event;
	
	if (!this.enabled)
	{
		Scriptor.event.cancel(e);
		return false;
	}
	
	if (this.curPage > 0) {
		this.curPage--;
		this.selectedRow = -1;
		this.selectedRows = [];
			
		// TODO: ?
		//this.Show(true);
	}
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* __goToPageNext
*  This function executes when clicked on the "next" link
*/
Scriptor.DataView.prototype.__goToPageNext = function (e) {
	if (!e) e = window.event;
	
	if (!this.enabled)
	{
		Scriptor.event.cancel(e);
		return false;
	}
	
	var totalPages = this.getTotalPages();
	
	if (this.curPage < totalPages -1) {
		this.curPage++;
		this.selectedRow = -1;
		this.selectedRows = [];
			
		// TODO: ?
		//this.Show(true);
	}
	
	Scriptor.event.cancel(e);
	return false;
};

/*
*  dataView.updateRows()
*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
*   dataView.updateRows() directly to update row information only without spending additional
*   resources on the dataView frame rendering.
*/
Scriptor.DataView.prototype.updateRows = function() {
	if (!this.visible) {
		Scriptor.error.report( "Can't update rows on non visible dataView object.");
		return;
	}
	
	var targetTable = document.getElementById(this.divId + '_body');
	
	if (!this._oldScrollTop)
		this._oldScrollTop = targetTable.parentNode.scrollTop;
		
	var totalHeight = 0;
	var rTemplate = '';
	
	for (var n=0; n < this.rows.length; n++) {		
		
		var rowId = this.rows[n].id;
		var firstCol = true;
		rTemplate += '<ul id="' + this.divId + '_row_' + rowId + '">';
		
		if (this.multiselect) {
			var check = false;
			rTemplate += '<li style="width: ' + (this.style.multiSelectColumnWidth + this.style.sepWidth -3) + 'px;" class="dataViewMultiselectCell';
			if (!this.multiselect) {
				if (this.selectedRow == n) {
					rTemplate += ' selectedRow';
					check = true;
				}
			}
			else {
				for (var a=0; a < this.selectedRows.length; a++) {
					if (this.selectedRows[a] == n) {
						rTemplate += ' selectedRow';
						check = true;
						break;
					}
				}
			}
			
			rTemplate += '">';
			rTemplate += '<input type="checkbox" id="' + this.divId + '_selectRow_' + rowId + '" class="dataViewCheckBox" ';
			if (check)
				rTemplate += 'checked="checked" ';
			rTemplate += '/></li>';
		}
		
		for (var a=0; a < this.columns.length; a++) {
			if (this.columns[a].show) {
				
				var colWidth = (this.columns[a].Width - this.style.cellHorizontalPadding - 2);
				if (firstCol && !this.multiselect) {
					colWidth -= 1;
					firstCol = false;
				}
				else {
					colWidth += 1;
				}
				
				rTemplate += '<li class="dataView' + this.columns[a].Type;
				
				if (!this.multiselect) {
					if (this.selectedRow == n) {
						rTemplate += ' selectedRow';
						check = true;
					}
				}
				else {
					for (var i=0; i < this.selectedRows.length; i++) {
						if (this.selectedRows[i] == n) {
							rTemplate += ' selectedRow';
							check = true;
							break;
						}
					}
				}
						
				rTemplate += '" id="' + this.divId + '_cell_' + rowId + '_' + a + '" style="width: ' + colWidth + 'px;"';
				if (this.columns[a].showToolTip) 
					rTemplate += ' title="' + this.rows[n][this.columns[a].Name] + '"';
				rTemplate += '>';
				
				if (typeof(this.columns[a].Format) == 'function') {
					var funcRet = this.columns[a].Format(this.rows[n][this.columns[a].Name]);
					if (typeof(funcRet) == 'string')
						rTemplate += funcRet;
					
				}
				else {
					rTemplate += this.rows[n][this.columns[a].Name];
				}
				
				rTemplate += '</li>';
			}
		}
		
		rTemplate += '</ul>';
		totalHeight += this.style.rowHeight + this.style.cellVerticalPadding;
		
	}	
	
	targetTable.innerHTML = rTemplate;
	
	// assign onclick events and search for complex formatted cells
	for (var n=0; n < this.rows.length; n++) {
		var rowId = this.rows[n].id;
		
		if (this.multiselect)
			Scriptor.event.attach(document.getElementById(this.divId + '_selectRow_' + rowId), 'click', Scriptor.bindAsEventListener(this.__markRow, this, n));
			
		for (var a=0; a < this.columns.length; a++) {
			if (this.columns[a].show) {
				Scriptor.event.attach(document.getElementById(this.divId + '_cell_' + rowId + '_' + a), 'click', Scriptor.bindAsEventListener(this.__selectRow, this, n));
				
				if (typeof(this.columns[a].Format) == 'function') {
					var funcRet = this.columns[a].Format(this.rows[n][this.columns[a].Name]);
					if (typeof(funcRet) != 'string')
						document.getElementById(this.divId + '_cell_' + rowId + '_' + a).appendChild(funcRet);
				}
			}
		}
	}
	
	if (this.selectedRow >= this.rows.length)
		this.selectedRow = -1;
		
	for (var n=0; n < this.selectedRows.length; n++) {
		if (this.selectedRows[n] >= this.rows.length) {
			this.selectedRows.splice(n, 1);
			n--;
		}	
	}
	
	targetTable.style.height = totalHeight + 'px';
	
	// update scrolling
	if (this.selectedRow != -1) {
		var windowMin = this._oldScrollTop ? this._oldScrollTop : 0;
		var windowHeight = parseInt(targetTable.parentNode.style.height);
		var step = (this.style.rowHeight + this.style.cellVerticalPadding) * this.selectedRow;
		var windowMax = windowMin + windowHeight;
		
		if (step < windowMin || step > (windowMax - (this.style.rowHeight + this.style.cellVerticalPadding))) {
			targetTable.parentNode.scrollTop = step;
		}
		else {
			targetTable.parentNode.scrollTop = this._oldScrollTop ? this._oldScrollTop : 0;
		}
	}
	else {
		targetTable.parentNode.scrollTop = this._oldScrollTop ? this._oldScrollTop : 0;
	}
		
	this.__refreshFooter();
	
	Scriptor.event.fire(this, 'oncontentupdated');
};

/*
* dataView.__refreshFooter()
*   Internal function. Refreshes the footer text.
*/
Scriptor.DataView.prototype.__refreshFooter = function() {
	if (!this.visible) {
		Scriptor.error.report( "Can't update rows on non visible dataView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.divId + '_footer');
	
	var fTemplate = '<ul><li class="first">';
	
	if (!this.paginating) {
		if (this.rows.length == 0) {
			fTemplate += this.lang.noRows;
		}
		else {
			if (this.rows.length == 1)
				fTemplate += '1 ' + ' ' + this.lang.row;
			else
				fTemplate += this.rows.length + ' ' + this.lang.rows;
		}
	}
	else {
		if (this.rows.length == 0) {
			fTemplate += this.lang.noRows;
		}
		else {
			var firstRow = (this.rowsPerPage * this.curPage);
			var lastRow = (firstRow + this.rowsPerPage) > this.totalRows ? this.totalRows : (firstRow + this.rowsPerPage);
			fTemplate += (firstRow+1) + ' - ' + lastRow + ' ' + this.lang.of + ' ' + this.totalRows + ' ' + this.lang.rows;
		}
	}
	fTemplate += '</li></ul>';
	
	targetDiv.innerHTML = fTemplate;
};

/*
* __setOrder()
*  This functions executes when clicking on a dataView column name and sets row order.
*  Pass divId the id property of the HTMLElement asociated with the dataView object and
*  colName the javascript Name of the column in which order must be performed. Ordering way
*  will be switched upon subsecuent calls to __setOrder()
*/
Scriptor.DataView.prototype.__setOrder = function (e, colNdx) {
	if (!e) e = window.event;
	
	if (!this.enabled)
	{
		Scriptor.event.cancel(e);
		return false;
	}
	
	var colName = this.columns[colNdx].Name;
	
	if (colNdx != -1) {		
		if (this.orderBy != colName) {
			this.orderBy = colName;
			this.orderWay = 'ASC';
		}
		else {
			if (this.orderWay == 'ASC')
				this.orderWay = 'DESC';
			else
				this.orderWay = 'ASC';
		}
		
		if (!this.paginating) {
			this.__sort(0);
			
			if (this.visible) {
				this.Show(false);
				this.updateRows();
			}
		}
		else {
			if (this.visible) {
				this.Show(true);
			}
		}
	}
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* __selectRow()
*  This function executes when clicking on a dataView row and selects that row.
*/
Scriptor.DataView.prototype.__selectRow = function (e, rowNdx) {
	if (!e) e = window.event;
	
	if (!this.visible || !this.enabled)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	e.selectedRow = this.selectedRow;
	if (this.multiselect)
		e.selectedRows = this.selectedRows;
		
	if (this.selectedRow == rowNdx)
	{
		e.unselecting = rowNdx;
	}
	else
	{
		if (this.multiselect)
		{
			var found = false;
			for (var n=0; n < this.selectedRows.length; n++)
			{
				if (this.selectedRows[n] == rowNdx)
				{
					found = true;
					break;
				}
			}
			if (found)
				e.unselecting = rowNdx;
			else
				e.selecting = rowNdx;
		}
		else
		{
			e.selecting = rowNdx;
		}
	}
	
	e = Scriptor.event.fire(this, 'onselect', e);
	
	if (e.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var colStyles = [];
	if (this.multiselect)	// add dummy style for the first cell
		colStyles.push('MultiselectCell');
	
	for (var n=0; n < this.columns.length; n++)
		if (this.columns[n].show)
			colStyles.push(this.columns[n].Type);
		 
	var rows = document.getElementById(this.divId+'_body').getElementsByTagName('ul');
	
	if (rowNdx != -1) {
		if (!this.multiselect) {
			if (this.selectedRow != -1) {
				for (n=0; n < rows[this.selectedRow].childNodes.length; n++) 
					rows[this.selectedRow].childNodes[n].className = 'dataView' + colStyles[n];
			}
		}
		else {
			for (var a = 0; a < this.selectedRows.length; a++) {
				for (n=0; n < rows[this.selectedRows[a]].childNodes.length; n++) {
					if (n==0)
						rows[this.selectedRows[a]].childNodes[n].firstChild.checked = false;
					rows[this.selectedRows[a]].childNodes[n].className = 'dataView' + colStyles[n];
				}
			}
		}
		
		if (this.selectedRow == rowNdx && !this.multiselect) {
			this.selectedRow = -1;
		}
		else {
			if (!this.multiselect) {
				this.selectedRow = rowNdx;
				for (n=0; n < rows[rowNdx].childNodes.length; n++) 
					rows[rowNdx].childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
			}
			else {
				
				if (!e.ctrlKey && !e.shiftKey) {
					if (this.selectedRow == rowNdx) {
						this.selectedRow = -1;
						this.selectedRows = [];
					}
					else {
						this.selectedRow = rowNdx;					
						this.selectedRows = [rowNdx];
					}
				}
				
				else {
					if (e.ctrlKey) {
						var found = false;
						for (var n=0; n < this.selectedRows.length; n++) {
							if (this.selectedRows[n] == rowNdx) {
								this.selectedRows.splice(n, 1);
								if (this.selectedRows.length)
									this.selectedRow = this.selectedRows[this.selectedRows.length -1];
								else
									this.selectedRow = -1;
								found = true;
							}
						}
						
						if (!found) {
							this.selectedRow = rowNdx;
							this.selectedRows.push(rowNdx);
						}
					}
					
					else if (e.shiftKey) {
						if (this.selectedRows.length) {
							this.selectedRows.length = 1;
							if (this.selectedRows[0] == rowNdx) {
								this.selectedRows = [];
								this.selectedRow = -1;
							}
							else {
								this.selectedRow = rowNdx;
								for (var n=this.selectedRows[0]; (rowNdx > this.selectedRows[0] ? n <= rowNdx : n >= rowNdx ); (rowNdx > this.selectedRows[0] ? n++ : n-- )) {
									if (n != this.selectedRows[0])
										this.selectedRows.push(n);
								}
							}
						}
						else {
							this.selectedRows.push(rowNdx);
							this.selectedRow = rowNdx;
						}
					}
				}
				
				for (var a = 0; a < this.selectedRows.length; a++) {
					for (n=0; n < rows[this.selectedRows[a]].childNodes.length; n++) {
						if (n==0)
							rows[this.selectedRows[a]].childNodes[n].firstChild.checked = true;
						rows[this.selectedRows[a]].childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
					}
				}
			}
		}
	}
	
	/*Scriptor.event.cancel(e);*/
	return false;
};

/*
* __markRow()
*  This function executes when clicking on a dataView row checkmox in multiselect and selects that row.
*/
Scriptor.DataView.prototype.__markRow = function(e, rowNdx) {
	if (!e) e = window.event;
	
	if (!this.visible || !this.enabled)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	e.selectedRow = this.selectedRow;
	if (this.multiselect)
		e.selectedRows = this.selectedRows;
		
	e.selecting = rowNdx;
	e = Scriptor.event.fire(this, 'onselect', e);
	
	if (e.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var colStyles = [];
	colStyles.push('MultiselectCell');	// first cell is multiselect checkbox
	for (var n=0; n < this.columns.length; n++)
		if (this.columns[n].show)
			colStyles.push(this.columns[n].Type);
	
	var rowId = this.rows[rowNdx].id;
	
	elem = document.getElementById(this.divId + '_selectRow_' + rowId);
	if (elem.checked) {	// add row to selected rows list
		this.selectedRows.push(rowNdx)
		this.selectedRow = rowNdx;
				
		var row = document.getElementById(this.divId + '_row_' + rowId);
		for (var a = 0; a < row.childNodes.length; a++) 
			row.childNodes[a].className = 'dataView' + colStyles[a] + ' selectedRow';
		
	}
	else {		// remove row from selected rows list
		for (var n=0; n < this.selectedRows.length; n++) {
			if (this.selectedRows[n] == rowNdx) {
				this.selectedRows.splice(n, 1);
				if (this.selectedRows.length) 
					this.selectedRow = this.selectedRows[this.selectedRows.length-1];
				else 
					this.selectedRow = -1;
			
				var row = document.getElementById(this.divId + '_row_' + rowId);
				for (var a = 0; a < row.childNodes.length; a++) {
					row.childNodes[a].className = 'dataView' + colStyles[a];
				}
				break;
			}
		}
	}
	
	return true;
};

/*
*  dataView.updateOptionsMenu()
*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
*   dataView.updateOptiosMenu() directly to update the options menu only without spending additional
*   resources on the dataView frame rendering. This is usefull when changing the property
*   dataView.optionsMenuWidth to apply these changes.
*/
/*Scriptor.DataView.prototype.updateOptionsMenu = function() {
	
	// TODO: Move to add/remove column
	for (var n=0; n < this.columns.length; n++) {
		var className = ''
		if (this.columns[n].show)
			className = 'dataViewOptionChecked';
		this.optionsMenu.addItem({label : this.columns[n].displayName, 'class' : className, onclick : Scriptor.bindAsEventListener(this.toggleColumn, this, n)});
	}
};*/

/* showOptionsMenu
*  This function shows the option menu of a dataView object. For internal use only
*/
Scriptor.DataView.prototype.showOptionsMenu = function(e) {
	if (!e) e = window.event;
	
	this.optionsMenu.show(e);
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* toggleColumn
*   Toggles a column on or off. OptionsMenu feature. Use dataColumn.show property along with
*   dataView.Show(false) instead to change column configuration manually.
*/
Scriptor.DataView.prototype.toggleColumn = function(e, colNdx) {
	if (!e) e = window.event;
	
	if (this.columns[colNdx].show) {
		this.columns[colNdx].show = false;
	}
	else {
		this.columns[colNdx].show = true;
	}
	
	this.Show(false);
	this.updateRows();
	this.optionsMenu.Hide();
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* dataView.forceWidth()
*  Use it to force the data viewport to a specific width. Will set the object width to
*  the specified value and proportionally adjust the columns if needed to fill the horizontal area
*  Use dataView.Show function instead, to force a width change
*/
Scriptor.DataView.prototype.forceWidth = function(w) {
	if (isNaN(Number(w)))
		return;
	
	var minWidth = this.__calculateMinWidth();
	if (w < minWidth)
		w = minWidth;
	
	this.Width = w;
	var totalWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth + this.__calculateTotalWidth();
	
	while (totalWidth > this.Width) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show) {
				totalWidth -= 1;
				this.columns[n].Width -= 1;
			}
		}
	}
};

/*
* Internal use only
*/
Scriptor.DataView.prototype.__calculateMinWidth = function()
{
	var minWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth;
	for (var n=0; n < this.columns.length; n++) {
		minWidth += this.style.cellHorizontalPadding + this.style.sepWidth;
	}
	if (this.multiselect)
		minWidth += this.style.multiSelectColumnWidth + this.style.cellHorizontalPadding + this.style.sepWidth;
	
	return minWidth;
};

/*
* Internal use only
*/
Scriptor.DataView.prototype.__calculateTotalWidth = function()
{
	var totalWidth = 0;
	
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].show) 
			totalWidth += this.columns[n].Width;
	}
	
	if (this.multiselect) 
		totalWidth += this.style.multiSelectColumnWidth + this.style.cellHorizontalPadding + this.style.sepWidth;
	
	return totalWidth ;
};

/*
* dataView.__sort()
*  This function performs sorting of rows depending on the sortBy and sortWay properties
*  For internal use only. Use global function __setOrder instead.
*/
Scriptor.DataView.prototype.__sort = function(start) {
	var n, tempRow, swap;	
	
	if (!this.orderBy)
		return;
		
	for (n = start+1; n < this.rows.length; n++) {
		var swap = false;
		var	func = this.columns[this.__findColumn(this.orderBy)].Comparator;
		
		if (this.orderWay == 'ASC') {
			
			swap = (typeof(func) == 'function') ?
				func(this.rows[start][this.orderBy], this.rows[n][this.orderBy]) > 0 : 
				(this.rows[start][this.orderBy] > this.rows[n][this.orderBy]);
		}
		else {
			swap = (typeof(func) == 'function') ?
				func(this.rows[start][this.orderBy], this.rows[n][this.orderBy] < 0) :
				(this.rows[start][this.orderBy] < this.rows[n][this.orderBy]);
		}
		
		if (swap) {
			tempRow = this.rows[start];
			this.rows[start] = this.rows[n];
			this.rows[n] = tempRow;
			
			if (this.selectedRow == start) {
				this.selectedRow = n;				
			}
			else {
				if (this.selectedRow == n) {
					this.selectedRow = start;					
				}
			}
			
			for (var a=0; a < this.selectedRows.length; a++) {
				if (this.selectedRows[a] == start)
					this.selectedRows[a] = n;
				else
					if (this.selectedRows[a] == n)
						this.selectedRows[a] = start;
			}
		}
	}
	
	if (start < this.rows.length -2)
		this.__sort( start +1 );
};

/*
*  dataView.colum_exists()
*   Internal function that returns true if a column with its Name property equals to str exists
*/
Scriptor.DataView.prototype.colum_exists = function(str) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == str)
			return true;
	}
	return false;
};

/*
* dataView.__getColumnSqlName(colName)
*  Internal function that returns the column sqlName upon its Name property (colName).
*/
Scriptor.DataView.prototype.__getColumnSqlName = function(colName) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == colName) 
			return this.columns[n].sqlName;
	}
	return false;
};

/* activateResizing
*  This function will search for a valid dataView id and mark it for column resizing
*/
Scriptor.DataView.prototype.activateResizing = function(e, colNdx) {
	if (!e) e = window.event;
	
	if (!this.enabled) {
		Scriptor.event.cancel(e);
		return false;
	}
	
	var targetTable = document.getElementById(this.divId+'_columnsHeader');
	
	// calculate the resized column
	this.resColumnId = colNdx;
	
	// set x cache value for resizing
	var x;

	if (typeof(e.pageX) == 'number') {
		x = e.pageX;
	}
	else {
		if (typeof(e.clientX) == 'number') {
			x = (e.clientX + document.documentElement.scrollLeft);
		}
		else {
			x = 0;
		}
	}
	
	this.resizingFrom = this.columns[colNdx].Width;
	this.resizingXCache = x;
	
	Scriptor.event.attach(document, 'mousemove', this._mouseMoveBind = Scriptor.bindAsEventListener(this.doResizing, this));
	Scriptor.event.attach(document, 'mouseup', this._mouseUpBind = Scriptor.bindAsEventListener(this.deactivateResizing, this));
	
	Scriptor.event.cancel(e);
	return false;
};

/* performResizing
* This function deactivates resizing status and performs complete redrawing
*/
Scriptor.DataView.prototype.deactivateResizing = function(e) {
	if (!e) e = window.event;
	
	Scriptor.event.detach(document, 'mousemove', this._mouseMoveBind);
	Scriptor.event.detach(document, 'mouseup', this._mouseUpBind);
	
	var ce = {};
	ce.columnId = this.resColumnId;
	ce.resizingFrom = this.resizingFrom;
	ce.resizedTo = this.columns[this.resColumnId].Width;
	
	Scriptor.event.fire(this, 'oncolumnresize', ce);
	
	this.resColumnId = null;
	this.resizingXCache = 0;
};

/* doResizing
*  This function calculates the resizing upon mouse movement
*/
Scriptor.DataView.prototype.doResizing = function(e) {
	if (!e) e = window.event;
	// get delta x
	var x;

	if (typeof(e.pageX) == 'number') {
		x = e.pageX;
	}
	else {
		if (typeof(e.clientX) == 'number') {
			x = (e.clientX + document.documentElement.scrollLeft);
		}
		else {
			x = 0;
		}
	}
	
	var deltaX = Math.abs(this.resizingXCache - x);
	var growing = (this.resizingXCache < x) ? true : false;
	
	this.resizingXCache = x;
	// get the minimum width for a column;
	var minWidth = this.style.cellHorizontalPadding + this.style.sepWidth;
	var colNdx = 0;
	var actualColNdx = this.resColumnId;
	
	// calculate colNdx (the HTML element in the ul index)
	for (var n=0; n < actualColNdx; n++)
	{
		if (this.columns[n].show)
			colNdx++;
	}
	
	// get the next column in case resizing is needed
	var nextActualColNdx = actualColNdx;
	for (n = actualColNdx+1; n < this.columns.length; n++) {
		if (this.columns[n].show) {
			nextActualColNdx = n;
			break;
		}
	}
	
	// getting a smaller column is easier (?)
	var changedSize = false;
	var changedNextColSize = false;
	
	if (!growing) {
		// see if col can be shorter than it is
		if ((this.columns[actualColNdx].Width - deltaX) > minWidth) {
			this.columns[actualColNdx].Width -= deltaX;
			changedSize = true;
		}
	}
	else {
		// see if there is space for col to grow
		var totalWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth + this.__calculateTotalWidth();
		
		if ((totalWidth + deltaX) < this.Width) {	// there is space to grow
			this.columns[actualColNdx].Width += deltaX;
			changedSize = true;
		}
		else {	// no space
			if (nextActualColNdx != actualColNdx) {	// not the last col shrink next col
				if ((this.columns[nextActualColNdx].Width - deltaX) > minWidth) {
					this.columns[actualColNdx].Width += deltaX;
					this.columns[nextActualColNdx].Width -= deltaX;
					changedSize = true;
					changedNextColSize = true;
				}
			}
		}
	}
	
	// update dataView HTML header
	var htmlHeader = document.getElementById(this.divId+'_columnsHeader');
	if (htmlHeader) {
		var cols = htmlHeader.firstChild.getElementsByTagName('li');
		var offset = 0;
		if (this.multiselect)
			offset = 2;
		var ndx = offset + (colNdx*2);
		
		cols[ndx].style.width = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth) + 'px'; 
		if ((this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
			cols[ndx].firstChild.style.width = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) + 'px';
		else 
			cols[ndx].firstChild.style.width = '0px';
		
		if (changedNextColSize) {
			ndx += 2;
			
			cols[ndx].style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth) + 'px';
			if ((this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
				cols[ndx].firstChild.style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) + 'px';
			else 
				cols[ndx].firstChild.style.width = '0px';
		}
	}
		
	// update row cells
	var rows = document.getElementById(this.divId+'_body').getElementsByTagName('ul');
	
	// calculate total width of columns in table
	document.getElementById(this.divId+'_body').style.width = this.__calculateTotalWidth()+'px';	
	
	for (var n=0; n < rows.length; n++)
	{
		var cols = rows[n].getElementsByTagName('li');
		var offset = 0;
		if (this.multiselect)
			offset = 1;
		
		var colWidth = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - 2);
		if (colNdx == 0 && !this.multiselect) {
			colWidth -= 1;
		}
		else {
			colWidth += 1;
		}
		
		cols[offset+(colNdx)].style.width = colWidth + 'px';
		
		if (changedNextColSize) {
			cols[offset+(colNdx)+1].style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding -1) + 'px';
		}
	}
};

/*
* dataViewConnector
* 	Connector object that will connect a dataView with an api call, so every time
* 	you call dataView.Refresh() it will call its api to truly refresh
* 	the object in real time
*
* 	constructor parameters:
* 	dataView: A reference to a dataView object
* 	api: A String containig the path to the api file
* 	type: either json or xml, the format of the api file
*	parameters: query string to be passed on each call to api
*
* 	Examples for Api files
* 	XML:
* 	<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>
* 	<root success="1" errormessage="" totalrows="2">
* 	   <row>
* 	   	<column name="id">1</column>
* 	   	<column name="uername">user1</column>
* 	   </row>
* 	   <row>
* 	   	<column name="id">2</column>
* 	   	<column name="username">user2</column>
* 	   </row>
* 	</root>
*
* 	JSON:
* 	{ "success" : 1, "errormessage" : "", "totalrows" : 2, "rows" : [
*		{ "id" : 1, "username" : "user1" },
*		{ "id" : 2, "username" : "user2" }
*    ]}
*
*/
if (Scriptor.DataConnectors === undefined)
	Scriptor.DataConnectors = {};
	
Scriptor.DataConnectors.DataViewConnector = function(opts) {
	var localOpts = {
		dataView : null,
		api : null,
		method : 'POST',
		type : 'json',
		parameters : ''
	};
	
	Scriptor.mixin(localOpts, opts);
	
	if (!localOpts.dataView)
	{
		Scriptor.error.report('Must provide dataView reference to dataViewConnector object.');
		return;
	}
	
	if (typeof(localOpts.api) != 'string' || localOpts.api == '')
	{
		Scriptor.error.report('Invalid Api string.');
		return;
	}
	
	this.api = localOpts.api;
	this.dataView = localOpts.dataView;
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
	Scriptor.event.attach(this.dataView, 'onrefresh', Scriptor.bind(this._onRefresh, this));
	
	this.httpRequest = new Scriptor.httpRequest({
		ApiCall : this.api,
		method : this.method,
		Type : this.type,
		onError : Scriptor.bind(this._onError, this),
		onLoad : Scriptor.bind(this._onLoad, this)
	});
};

Scriptor.DataConnectors.DataViewConnector.prototype = {
	_onRefresh : function(e) {
		this.dataView.setLoading(true);
		this.dataView.__refreshFooter();
		
		var params = 'orderby=' + this.dataView.orderBy + '&orderway=' + this.dataView.orderWay;
		if (this.dataView.paginating)
			params += '&limit=' + (this.dataView.rowsPerPage * this.dataView.curPage) + ',' + ((this.dataView.rowsPerPage * this.dataView.curPage) + this.dataView.rowsPerPage);
		
		if (this.parameters)
			params += '&' + this.parameters;
			
		this.httpRequest.send(params);
		
		Scriptor.event.cancel(e);
	},
	
	_onLoad : function(data) {
		this.dataView.setLoading(false);
		
		if (this.type == 'xml')	// xml parsing
		{
			var root = data.getElementsByTagName('root').item(0);
	
			// TODO: Add/Remove/Update rows instead of replacing the whole data structure
			//   upgrade addRow, deleteRow to avoid using updateRows
			// fake visible = false so we call updateRows only once
			var oldVisible = this.dataView.visible;
			this.dataView.visible = false;
			this.dataView.rows.length = 0;
			
			if (root.getAttribute('success') == '1')
			{
				var totRows = Number(root.getAttribute('totalrows'));
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					if (this.dataView.paginating)
						document.getElementById(this.dataView.div + '_totalPagesHandler').innerHTML = this.dataView.getTotalPages();
				}
				var rows = root.getElementsByTagName('row');
		
				for (var n=0; n < rows.length; n++)
				{
					var tempR = {};
					var cols = rows[n].getElementsByTagName('column');
					
					for (var a=0; a < cols.length; a++)
					{
						var colName = cols[a].getAttribute('name');
						if (colName && cols[a].firstChild)
						{
							var cType = this.dataView.__findColumn(colName) != -1 ?
								this.dataView.columns[this.dataView.__findColumn(colName)].Type :
								'alpha';
							tempR[colName] = dataTypes[cType](cols[a].firstChild.data);
						}
					}
					
					this.dataView.addRow(this.dataView.createRow(tempR));
				}
			}
			else
			{
				this.dataView.setMessage(root.getAttribute('errormessage'));
			}
			
			if (oldVisible)
			{
				this.dataView.visible = oldVisible;
				this.dataView.updateRows();
			}
		}
		else	// json
		{
			// TODO: Add/Remove/Update rows instead of replacing the whole data structure
			//   upgrade addRow, deleteRow to avoid using updateRows
			// fake visible = false so we call updateRows only once
			var oldVisible = this.dataView.visible;
			this.dataView.visible = false;
			this.dataView.rows.length = 0;
			
			if (data.success)
			{
				var totRows = Number(data.totalrows);
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					if (this.dataView.paginating)
						document.getElementById(this.dataView.div + '_totalPagesHandler').innerHTML = this.dataView.getTotalPages();
				}
				
				for (var n=0; n < data.rows.length; n++)
				{
					var tempR = {};
					
					for (var colName in data.rows[n])
					{
						var cType = this.dataView.__findColumn(colName) != -1 ?
							this.dataView.columns[this.dataView.__findColumn(colName)].Type :
							'alpha';
						tempR[colName] = dataTypes[cType](data.rows[n][colName]);	
					}
					
					this.dataView.addRow(this.dataView.createRow(tempR));
				}
			}
			else
			{
				this.dataView.setMessage(data.errormessage);
			}
			
			if (oldVisible)
			{
				this.dataView.visible = oldVisible;
				this.dataView.updateRows();
			}
		}
	},
	
	_onError : function(status)
	{
		this.dataView.setLoading(false);
		this.dataView.setMessage('Error: Unable to load dataView object (HTTP status: ' + status + ')');
	}
};