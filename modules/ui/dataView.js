/* JavaScript Document
*
* Dynamic ajax based sortable data table. It gets rows of data from an XML or JSON source that
* can be displayed and sorted dynamically on any column
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor framework
*/

// minimum allowed column width
var MIN_COLUMN_WIDTH = 20;

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
	this.percentWidth = null;
	if (!isNaN(Number(localOpts.Width)))
	{
		this.Width = Number(localOpts.Width);
	}
	else
	{
		if (typeof(localOpts.Width) == "string")
		{
			if (localOpts.Width.length > 2 && localOpts.Width.substr(localOpts.Width.length-2) == "px" &&
				!isNaN(parseInt(localOpts.Width)))
			{
				this.Width = parseInt(localOpts.Width);
			}
			else if (localOpts.Width.length > 1 && localOpts.Width.substr(localOpts.Width.length-1) == "%" &&
				!isNaN(parseInt(localOpts.Width)))
			{
				this.Width = MIN_COLUMN_WIDTH;
				this.percentWidth = parseInt(localOpts.Width);
			}
		}
	}
	this.origWidth = this.Width;
		
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
	'num' : Number,	// backwards compatibility
	'number' : Number,
	'alpha' : String,	// backwards compatibility
	'string' : String,
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
*  
*  orderBy: should be read only. It holds information of the Javascript column Name of the
*   active ordered column. It passes it to the SQL service for multipage dataViews or for
*   refreshing purposes
*  orderWay: should be read only. It holds information of the order way to be passed to the
*   sql service on multipage dataviews or when refreshing.
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
		columns : []
	};
		
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	Scriptor.mixin(this, cmp);
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
	this._templateRendered = false;
	this._registeredEvents = [];
	
	this.resizeImplementation = function() {
		this._checkCache();
		
		if (this._cached)
		{
			// calculate toolbars height
			var innerBox = this.__getInnerBox();
			var outerBox = this.__getOuterBox();
			var offsetHeight = innerBox.top + innerBox.bottom + outerBox.top + outerBox.bottom;
			
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
			
			this._adjustColumnsWidth();
		}
	};
	
	this.DOMAddedImplementation = function() {
		this._checkCache();
		
		if (this._cached)
		{
			this.__refreshFooter();
			
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
			
			this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId + '_optionsMenuBtn'), 'click', Scriptor.bindAsEventListener(this.showOptionsMenu, this)));
			this._registeredEvents.push(Scriptor.event.attach(this._cached.headerUl, 'click', Scriptor.bindAsEventListener(this._onHeaderColumnClicked, this)));
			this._registeredEvents.push(Scriptor.event.attach(this._cached.headerUl, 'mousedown', Scriptor.bindAsEventListener(this._onHeaderColumnMousedown, this)));
			this._registeredEvents.push(Scriptor.event.attach(this._cached.rows_body, 'click', Scriptor.bindAsEventListener(this._onRowBodyClicked, this)));
			
			this.updateRows(true);
		}
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
			
		for (var n=0; n < this.columns.length; n++)
			this._removeColumnFromUI(0);
			
		this._cached = null;
	};
	
	this.destroyImplementation = function() {
		this.optionsMenu.destroy();
	};
	
	this.create();
	Scriptor.className.add(this.target, "dataViewMain");
	
	// component template 
	this.renderTemplate();
	this.canHaveChildren = false;
	
	this.optionsMenu = new Scriptor.ContextMenu();
	this.optionsMenu.addItem({label : this.lang.refresh, onclick : Scriptor.bindAsEventListener(function(e) {
		this.refresh();
	}, this)});
	this.optionsMenu.addItem({label : 'sep'});
	
	// add predefined columns
	for (var n=0; n < localOpts.columns.length; n++)
	{
		this.addColumn(this.createColumn(localOpts.columns[n]));
	}
	// end add
};

/*
*
* Call only once on creation!
* 
*/
Scriptor.DataView.prototype.renderTemplate = function() {
	if (!this._templateRendered)
	{
		var dvTemplate = '';
		var curLocation = Scriptor.getInactiveLocation();
		
		// Create table paginating header
		if (this.paginating) {
			dvTemplate += '<div class="dataViewPaginationHeader dataViewToolbar" id="'+this.divId+'_paginationHeader"><ul><li class="first">';
			dvTemplate += '<label class="dataViewPaginationPages" id="'+this.divId+'_paginationLabel">' + this.lang.pageStart + (this.curPage + 1) +
								this.lang.pageMiddle + '<span id="' + this.divId + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
			dvTemplate += '</label></li><li>';
			dvTemplate += '<a href="'+curLocation+'" class="dataViewPrevBtn" id="' + this.divId + '_goToPagePrev"> </a>';
			dvTemplate += '<a href="'+curLocation+'" class="dataViewNextBtn" id="' + this.divId + '_goToPageNext"> </a>';		
			dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.divId + '_pageInput">' + this.lang.pageEnd + '</label>';
			dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.divId + '_pageInput" />';
			dvTemplate += '<input type="button" value="' + this.lang.pageGo + '" class="dataViewPageButton" id="' + this.divId + '_pageInputBtn" />';
			dvTemplate += '</li></ul></div>';
		}
		
		// Create table header
		dvTemplate += '<div class="dataViewHeader' + (this.multiselect ? ' dataViewMultiselect' : '') + ' dataViewToolbar" id="'+this.divId+'_columnsHeader">';
		dvTemplate += '<ul id="'+this.divId+'_columnsUl">';
		
		if (this.multiselect) {
			dvTemplate += '<li class="dataViewCheckBoxHeader">';
			dvTemplate += '<input type="checkbox" id="' + this.divId + '_selectAll" class="dataViewCheckBox" /></li>';
			dvTemplate += '<li class="dataViewSep"></li>';
		}
		dvTemplate += '</ul>';
		
		// add field list menu
		dvTemplate += '<span id="' + this.divId + '_optionsMenuBtn" class="dataViewHeaderMenu">';
		dvTemplate += '<a href="'+curLocation+'"> </a></span></div>';
		
		// Create body
		dvTemplate += '<div id="'+this.divId+'_outerBody" class="dataViewOuterBody">';
		dvTemplate += '<div class="dataViewBody' + (this.multiselect ? ' dataViewMultiselect' : '') + '" id="'+this.divId+'_body"></div>';
		dvTemplate += '</div>';
		
		// Create footer
		dvTemplate += '<div id="' + this.divId + '_footer" class="dataViewFooter dataViewToolbar"></div>';
		
		this.cmpTarget.innerHTML = dvTemplate;
		
		this._templateRendered = true;
		// if the component had a present DOM element at the time of instantiation, we have called
		// DOMAddedImplementation before having the proper template created.
		if (this.inDOM && this._registeredEvents.length == 0)
		{
			this.DOMAddedImplementation();
		}
	}
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
	var liClassName = "dataViewColumn";
	if (!column.show)
		liClassName += " dataViewColumnHidden";
	li.className = liClassName;
	
	var a = document.createElement('a');
	if (this.orderBy == column.Name) {
		if (this.orderWay == 'ASC')
			a.className = 'dataViewSortAsc';
		else
			a.className = 'dataViewSortDesc';
	}
	a.id = this.divId + '_columnHeader_'+ndx;
	a.setAttribute('href', Scriptor.getInactiveLocation());
	a.innerHTML = column.displayName;
	li.appendChild(a);
	
	li2 = document.createElement('li');
	li2.id = this.divId + '_sep_' + ndx;
	liClassName = "dataViewFieldSep";
	if (!column.show)
		liClassName += " dataViewColumnHidden";
	li2.className = liClassName;
	
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
			this._cached.headerUl.insertBefore(li2, columns[baseNdx + (ndx*2)+1]);
		}
		else
		{
			this._cached.headerUl.appendChild(li);
			this._cached.headerUl.appendChild(li2);
		}
	}
	
	this.optionsMenu.addItem({
		label : column.displayName,
		onclick : Scriptor.bindAsEventListener(function(e, ndx) {this.toggleColumn(ndx);}, this, ndx),
		checked : column.show
	}, ndx+2);
	
	if (this.rows.length) {
		for (var n=0; n < this.rows.length; n++)
		{
			this._addCellToUI(this.rows[n].id, column.Name, ndx);
		}
	}
	
	// restrict columns width if they're too wide for dataView to handle
	this._adjustColumnsWidth();
};

/*
* dataView._removeColumnFromUI()
*  Internal use only, to dynamically refresh columns on UI
*/
Scriptor.DataView.prototype._removeColumnFromUI = function(ndx) {
	var baseNdx = this.multiselect ? 2 : 0;
	var columns = this._cached.headerUl.getElementsByTagName('li');
	
	if (ndx >= 0 && (baseNdx + (ndx*2)) < columns.length)
	{
		this._cached.headerUl.removeChild(columns[baseNdx+(ndx*2)]);
		this._cached.headerUl.removeChild(columns[baseNdx+(ndx*2)]);
	}
	
	this.optionsMenu.removeItem(ndx+2);
	
	if (this.rows.length) {
		for (var n=0; n < this.rows.length; n++)
		{
			this._removeCellFromUI(this.rows[n].id, ndx);
		}
	}
	
	this._adjustColumnsWidth();
};

/*
* dataView._addRowToUI()
*  Internal use only, to dynamically add/remove rows on UI
*/
Scriptor.DataView.prototype._addRowToUI = function(rowNdx) {
	if (rowNdx < 0 || rowNdx > this.rows.length-1)
		return;
	
	var rowId = this.rows[rowNdx].id;
	
	var newUl = document.createElement('ul');
	newUl.id = this.divId + '_row_' + rowId;
	
	var check = false;
	if (!this.multiselect) {
		if (this.selectedRow == n) {
			check = true;
		}
	}
	else {
		for (var a=0; a < this.selectedRows.length; a++) {
			if (this.selectedRows[a] == n) {
				check = true;
				break;
			}
		}
	}
	
	if (check)
		newUl.className = "dataViewRowSelected";
			
	if (rowNdx % 2)
		Scriptor.className.add(newUl, "dataViewRowOdd");
		
	if (this.multiselect) {
		var newLi = document.createElement('li');
		var newLiClassName = "dataViewMultiselectCell";
		newLi.className = newLiClassName;
		
		var newCheckboxTpl = '<input type="checkbox" id="' + this.divId + '_selectRow_' + rowId + '" class="dataViewCheckBox" ';
		if (check)
			newCheckboxTpl += 'checked="checked" ';
		newCheckboxTpl += '/></li>';
		newLi.innerHTML = newCheckboxTpl;
			
		newUl.appendChild(newLi);
	}
	
	// if now rows, we simply appendChild
	var actualRows = this._cached.rows_body.getElementsByTagName('ul');
	if (actualRows.length == 0)
	{
		this._cached.rows_body.appendChild(newUl);
	}
	else
	{
		// if the row is the last row, we simply appendChild
		if (rowNdx == this.rows.length-1)
		{
			this._cached.rows_body.appendChild(newUl);
		}
		else
		{
			var insertBefore = null;
			// we search for the next row id added to DOM
			for (var n = rowNdx+1; n < this.rows.length; n++)
			{
				insertBefore = document.getElementById(this.divId + '_row_' + this.rows[n].id);
				if (insertBefore)
					break;
			}
			
			if (insertBefore)
				this._cached.rows_body.insertBefore(newUl, insertBefore);
			else
				this._cached.rows_body.appendChild(newUl);
		}
	}
	
	for (var a=0; a < this.columns.length; a++) 
		this._addCellToUI(rowId, this.columns[a].Name, a);
		
	this.__refreshFooter();
};

/*
* dataView._removeRowFromUI()
*  Internal use only, to dynamically add/remove rows on UI
*/
Scriptor.DataView.prototype._removeRowFromUI = function(rowNdx) {
	if (rowNdx < 0 || rowNdx > this.rows.length-1)
		return;
	
	var rowId = this.rows[rowNdx].id;
	var theRow = document.getElementById(this.divId + "_row_" + rowId);
	
	if (theRow)
		this._cached.rows_body.removeChild(theRow);
		
	this.__refreshFooter();
};

Scriptor.DataView.prototype._refreshRowInUI = function(rowId) {
	var row = this.getById(rowId)
	
	if (row)
	{
		var theRow = document.getElementById(this.divId + "_row_" + rowId);
	
		if (theRow)
		{
			for (var a=0; a < this.columns.length; a++)
				this.setCellValue(rowId, this.columns[a].Name, row[this.columns[a].Name]);
				
		}
	}
};

/*
* dataView._addCellToUI()
*  Internal use only, to dynamically add/remove cells on UI
*/
Scriptor.DataView.prototype._addCellToUI = function(rowId, colName, ndx) {
	var rowsUl = document.getElementById(this.divId + "_row_" + rowId);
	if (rowsUl)	// just make sure the row is there
	{
		var cells = rowsUl.getElementsByTagName('li');
		var li = document.createElement('li');
		li.id = this.divId + '_cell_' + rowId + '_' + ndx
		
		var liClassName = "dataView" + this.columns[ndx].Type;
		if (!this.columns[ndx].show)
			liClassName += " dataViewCellHidden";
		if (ndx == 0)
			liClassName += " dataViewFirstCell";
		
		li.className = liClassName;
		li.style.width = this.columns[ndx].Width + 'px';
		if (this.columns[ndx].showToolTip) 
			li.setAttribute("title", this.getById(rowId)[colName]);
		
		if (ndx >= 0 && ndx < cells.length-1)
		{
			rowsUl.insertBefore(li, cells[ndx]);
		}
		else
		{
			rowsUl.appendChild(li);
		}
		
		this.setCellValue(rowId, colName, this.getById(rowId)[colName]);
	}
};

/*
* dataView._removeCellFromUI()
*  Internal use only, to dynamically add/remove cells on UI
*/
Scriptor.DataView.prototype._removeCellFromUI = function(rowId, ndx) {
	var baseNdx = this.multiselect ? 1 : 0;
	var rowsUl = document.getElementById(this.divId + "_row_" + rowId);
	if (rowsUl)	// just make sure the row is there
	{
		var cells = rowsUl.getElementsByTagName('li');
		
		if (ndx >= 0 && (baseNdx+ndx) < cells.length)
		{
			rowsUl.removeChild(cells[baseNdx+ndx]);
		}
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
Scriptor.DataView.prototype.addRow = function(rowObj, ndx, ui) {
	if (ui === undefined)
		ui = true;
		
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
	
	if (ui)
	{
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
			
		this._UIUpdateSelection();
	}
};

/*
* dataView.deleteRow()
*  This method will delete the row identified by identifier. It can be a row index in the
*  array of rows (i.e.: dataView.selectedRow when != -1) or an instance of a row object 
*  in the array. If dataView is visible it will call updateRows to reflect the changes.
*/
Scriptor.DataView.prototype.deleteRow = function(identifier, ui) {
	if (ui === undefined)
		ui = true;
		
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
	
	if (rowNdx != -1 && ui)
	{
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
		
		this._UIUpdateSelection();
	}
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
* dataView.refresh();
*  This function will call updateRows to refresh dataView rows if visible
*  You can use a dataViewConnector object to connect an XML or JSON service to dataView
*  and this will automatically retrieve information assync every time
*  you call refresh() method.
*/
Scriptor.DataView.prototype.refresh = function() {
	var e = Scriptor.event.fire(this, 'onrefresh');
	if (!e.returnValue)
		return;
	
	if (this.inDOM)
		this.updateRows();
};

/*
* dataView.setLoading(val)
*   If val is true, show loading spinner, else show the actual rows,
*   usefull for assync updates
*/
Scriptor.DataView.prototype.setLoading = function(val) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Cant message on DataView not in DOM");
		return;
	}
	
	this._cached.rows_body.style.display = val ? 'none' : '';
	this._cached.outer_body.className = val ? 'dataViewOuterBody dataViewLoading' : 'dataViewOuterBody';
	
};

/*
* dataView.setMessage(msg)
*	Set a message (usefull for error messages) and hide all rows in a dataView
* 	If msg is set to false or not present, it will restore dataView to normal
*/
Scriptor.DataView.prototype.setMessage = function(msg) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Cant message on DataView not in DOM");
		return;
	}
	
	// false, null, or msg not present resets dataView to normal
	if (msg === false || msg === null || typeof(msg) != "string")
	{
		if (document.getElementById(this.divId + '_message'))
			this._cached.outer_body.removeChild(document.getElementById(this.divId + '_message'));
			
		this._cached.rows_body.style.display = '';
	}
	else	// if string passed, we show a message
	{
		this._cached.rows_body.style.display = 'none';
		var msgDiv;
		if (!document.getElementById(this.divId + '_message'))
		{
			msgDiv = document.createElement('div');
			msgDiv.id = this.divId + '_message';
			msgDiv.className = 'dataViewMessageDiv';
			this._cached.outer_body.appendChild(msgDiv);
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
	
	if (this.inDOM)
		this._UISelectAll(false);
};

/*
* __selectAll()
*  This function executes when clicking on a dataView header checkmox in multiselect and selects all rows.
*/
Scriptor.DataView.prototype.__selectAll = function(e) {
	if (!e) e = window.event;
	
	var elem = document.getElementById(this.divId + '_selectAll');
	
	if (this.rows.length) {
		if (elem.checked) {
			this.selectedRow = this.rows.length -1;
			this.selectedRows = [];
			
			for (var n=0; n < this.rows.length; n++)
				this.selectedRows.push(n);
				
			this._UISelectAll(true);
		}
		else {
			this.selectedRow = -1;
			this.selectedRows = [];
			
			this._UISelectAll(false);
		}
	}
	else {
		elem.checked = false;
	}
};

/*
* DataView._UISelectAll()
*  Internal use only, performs a select all/none on UI
*/
Scriptor.DataView.prototype._UISelectAll = function(check) {
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	for (var n=0; n < rows.length; n++)
	{
		Scriptor.className[(check ? "add" : "remove")](rows[n], "dataViewRowSelected");
		rows[n].firstChild.firstChild.checked = check;
	}
};

/*
* DataView._UIUpdateSelection()
*  Internal use only, to reflect actual selection patern in DOM
*/
Scriptor.DataView.prototype._UIUpdateSelection = function() {
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	for (var n=0; n < rows.length; n++)
	{
		var selected = false;
		if (!this.multiselect)
		{
			if (this.selectedRow == n)
				selected = true;
		}
		else
		{
			for (var a=0; a < this.selectedRows.length; a++)
			{
				if (this.selectedRows[a] == n)
				{
					selected = true;
					break;
				}
			}
		}
		
		if (this.multiselect)
			rows[n].childNodes[0].firstChild.checked = selected;
		Scriptor.className[(selected ? "add" : "remove")](rows[n], "dataViewRowSelected");
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
			
			this.refresh();
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
			
		this.refresh();
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
			
		this.refresh();
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
Scriptor.DataView.prototype.updateRows = function(clear) {
	if (!this.inDOM) {
		Scriptor.error.report("Add table to DOM before working with rows");
		return;
	}
	
	if (clear === undefined)
		clear = false;
	
	// save selected rows as ids!
	var savedSelectedRow = null;
	if (this.selectedRow != -1 && this.rows[this.selectedRow])
		savedSelectedRow = this.rows[this.selectedRow].id;
		
	var savedSelectedRows = [];
	if (this.selectedRows.length)
		for (var n=0; n < this.selectedRows.length; n++)
			if (this.rows[this.selectedRows[n]])
				savedSelectedRows.push(this.rows[this.selectedRows[n]].id);
	
	if (!this._oldScrollTop)
		this._oldScrollTop = this._cached.outer_body.scrollTop;
		
	if (clear)	// remove all rows, we're starting over!
	{
		this._cached.rows_body.innerHTML = '';	
	}
	
	// remove all rows that were deleted in memory
	var actualRows = this._cached.rows_body.getElementsByTagName('ul');
	for (var n=0; n < actualRows.length; n++)
	{
		var rowId = actualRows[n].id.substr(actualRows[n].id.lastIndexOf('_')+1);
		if (!this.getById(rowId))	// row does not exist!
		{
			this._cached.rows_body.removeChild(actualRows[n]);
			n--;
		}
	}
	
	// add rows that don't exist and update existing ones!
	for (var n=0; n < this.rows.length; n++) {		
		if (!document.getElementById(this.divId+"_row_"+this.rows[n].id))
		{
			this._addRowToUI(n);
		}
		else
		{
			this._refreshRowInUI(this.rows[n].id);
		}
	}	
	
	// restorde previously selected rows where possible
	if (!clear)
	{
		this.selectedRow = -1;
		if (savedSelectedRow)
		{
			for (var n=0; n < this.rows.length; n++)
			{
				if (this.rows[n].id == savedSelectedRow)
				{
					this.selectedRow = n;
					break;
				}
			}	
		}
		
		this.selectedRows = [];
		if (savedSelectedRows.length)
		{
			for (var a=0; a < savedSelectedRows.length; a++)
			{
				for (var n=0; n < this.rows.length; n++)
				{
					if (this.rows[n].id == savedSelectedRows[a])
					{
						this.selectedRows.push(n);
						break;
					}
				}
			}
		}
	}
	
	this._UIUpdateSelection();
	
	// Update scrolling
	if (clear)
		this._cached.outer_body.scrollTop = this._oldScrollTop ? this._oldScrollTop : 0;
	
	this.__refreshFooter();
	
	Scriptor.event.fire(this, 'oncontentupdated');
};

/*
* dataView.__refreshFooter()
*   Internal function. Refreshes the footer text.
*/
Scriptor.DataView.prototype.__refreshFooter = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Attempt to refresh footer on DataView not added to DOM");
		return;
	}
	
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
		
		document.getElementById(this.divId+'_paginationLabel').innerHTML = this.lang.pageStart + (this.curPage + 1) +
			this.lang.pageMiddle + '<span id="' + this.divId + '_totalPagesHandler">' + (this.getTotalPages()) + '</span>';
		
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
	
	this._cached.footer.innerHTML = fTemplate;
};

/*
* __setOrder()
*  This functions executes when clicking on a dataView column name and sets row order.
*  Ordering way will be switched upon subsecuent calls to __setOrder()
*/
Scriptor.DataView.prototype.__setOrder = function (colNdx) {
	if (!this.inDOM)
	{
		Scriptor.error.report("Cant sort a DataView not in DOM");
		return;
	}
	
	var colName = this.columns[colNdx].Name;
	
	if (colNdx >= 0 && colNdx < this.columns.length) {
		var baseNdx = this.multiselect ? 2 : 0;
		var columns = this._cached.headerUl.getElementsByTagName('li');
		
		var oldColNdx = this.__findColumn(this.orderBy);	
		Scriptor.className.remove(columns[baseNdx+(oldColNdx*2)].firstChild, (this.orderWay == 'ASC' ? "dataViewSortAsc" : "dataViewSortDesc"));
			
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
		
		Scriptor.className.add(columns[baseNdx+(colNdx*2)].firstChild, (this.orderWay == 'ASC' ? "dataViewSortAsc" : "dataViewSortDesc"));
		
		if (!this.paginating) {
			this.__sort(0);
			
			if (this.inDOM) {
				this.updateRows(true);
			}
		}
		else {
			if (this.inDOM) {
				this.refresh();
			}
		}
	}
	
	return;
};

/*
* _onRowBodyClicked()
*  This function executes when clicking on dataView row body and checks how to proceed
*  depending on the target (selectRow, or markRow)
*/
Scriptor.DataView.prototype._onRowBodyClicked = function(e) {
	if (!e) e = window.event;
	
	var target = e.target || e.srcElement;
	
	var multiselectId = this.divId + "_selectRow_";
	
	if (target.nodeName.toLowerCase() == 'input' && target.id.substr(0, multiselectId.length) == multiselectId)
	{
		var rowId = target.id.substr(target.id.lastIndexOf('_')+1);
		for (var n=0; n < this.rows.length; n++)
		{
			if (this.rows[n].id == rowId)
			{
				this.__markRow(e, n);
				break;
			}
		}
	}
	else
	{
		while (target.nodeName.toLowerCase() != 'ul')
		{
			if (target == this._cached.rows_body)	// click out of range
				return;
			
			target = target.parentNode;
		}
		
		var rowId = target.id.substr(target.id.lastIndexOf('_')+1);
		for (var n=0; n < this.rows.length; n++)
		{
			if (this.rows[n].id == rowId)
			{
				this.__selectRow(e, n);
				break;
			}
		}
	}
};

/*
* _onHeaderColumnClicked()
*  This function executes when clicking on dataView row body and checks how to proceed
*  depending on the target (selectRow, or markRow)
*/
Scriptor.DataView.prototype._onHeaderColumnClicked = function(e) {
	if (!e) e = window.event;
	
	var target = e.target || e.srcElement;
	
	if (target.nodeName.toLowerCase() == 'a')
	{
		colNdx = Number(target.id.substr(target.id.lastIndexOf('_')+1));
		if (!isNaN(colNdx))
		{
			this.__setOrder(colNdx);
		}
		
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	return true;
};


/*
* _onHeaderColumnMousedown()
*  This function executes when clicking on dataView row body and checks how to proceed
*  depending on the target (selectRow, or markRow)
*/
Scriptor.DataView.prototype._onHeaderColumnMousedown = function(e) {
	if (!e) e = window.event;
	
	var target = e.target || e.srcElement;
	
	if (target.nodeName.toLowerCase() == 'li' && target.className == 'dataViewFieldSep')
	{
		var sepNdx = Number(target.id.substr(target.id.lastIndexOf('_')+1));
		if (!isNaN(sepNdx))
		{
			this.activateResizing(e, sepNdx);
		}
	}
};

/*
* __selectRow()
*  This function executes when clicking on a dataView row and selects that row.
*/
Scriptor.DataView.prototype.__selectRow = function (e, rowNdx) {
	if (!e) e = window.event;
	
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
		 
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	if (rowNdx != -1) {
		if (!this.multiselect) {
			if (this.selectedRow != -1) {
				Scriptor.className.remove(rows[this.selectedRow], "dataViewRowSelected");
			}
		}
		else {
			for (var a = 0; a < this.selectedRows.length; a++) {
				rows[this.selectedRows[a]].childNodes[0].firstChild.checked = false;
				Scriptor.className.remove(rows[this.selectedRows[a]], "dataViewRowSelected");
			}
		}
		
		if (this.selectedRow == rowNdx && !this.multiselect) {
			this.selectedRow = -1;
		}
		else {
			if (!this.multiselect) {
				this.selectedRow = rowNdx;
				Scriptor.className.add(rows[rowNdx], "dataViewRowSelected");
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
					rows[this.selectedRows[a]].childNodes[0].firstChild.checked = true;
					Scriptor.className.add(rows[this.selectedRows[a]], "dataViewRowSelected");
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
	
	var rowId = this.rows[rowNdx].id;
	
	elem = document.getElementById(this.divId + '_selectRow_' + rowId);
	if (elem.checked) {	// add row to selected rows list
		this.selectedRows.push(rowNdx)
		this.selectedRow = rowNdx;
				
		var row = document.getElementById(this.divId + '_row_' + rowId);
		Scriptor.className.add(row, "dataViewRowSelected");
		
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
				Scriptor.className.remove(row, "dataViewRowSelected");
				break;
			}
		}
	}
	
	return true;
};

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
Scriptor.DataView.prototype.toggleColumn = function(colNdx) {
	
	if (this.columns[colNdx].show) {
		this.columns[colNdx].show = false;
	}
	else {
		this.columns[colNdx].show = true;
	}
	
	var baseNdx = this.multiselect ? 2 : 0;
	var columns = this._cached.headerUl.getElementsByTagName('li');
	
	if (colNdx >= 0 && ((baseNdx + (colNdx*2) + 1) < columns.length))
	{
		Scriptor.className[this.columns[colNdx].show ? "remove" : "add"](columns[baseNdx+(colNdx*2)], "dataViewColumnHidden");
		Scriptor.className[this.columns[colNdx].show ? "remove" : "add"](columns[baseNdx+(colNdx*2)+1], "dataViewColumnHidden");
	}
	
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	for (var n=0; n < rows.length; n++)
	{
		baseNdx = this.multiselect ? 1 : 0;
		Scriptor.className[this.columns[colNdx].show ? "remove" : "add"](rows[n].childNodes[baseNdx + colNdx], "dataViewCellHidden");
	}
	
	this.optionsMenu.checkItem(colNdx+2, this.columns[colNdx].show);
	
	this._adjustColumnsWidth();
};

/*
* dataView._adjustColumnsWidth()
*  Internal use only
*/
Scriptor.DataView.prototype._adjustColumnsWidth = function() {
	if (this.columns.length && this._cached)
	{
		var sizesChanged = false;
		var headersWidth = this._getHeadersWidth();
		
		// reset columns to original width desired by the user
		for (var n=0; n < this.columns.length; n++)
		{
			if (this.columns[n].Width != this.columns[n].origWidth)
			{
				sizesChanged = true;
				this.columns[n].Width = this.columns[n].origWidth;
			}
		}
		
		var totalWidth = 0; // this is the total width of columns minus percentage width columns
		var base = this.multiselect ? 2 : 0;
		var lis = this._cached.headerUl.getElementsByTagName('li');
		
		// perform calculations only if columns are in DOM
		if (lis.length == (this.columns.length*2) + base)
		{
			// lets get the difference between a column's width and its actual width in DOM
			var colBox = Scriptor.element.getInnerBox(lis[base]);
			var widthDiff = colBox.left+colBox.right+lis[base+1].offsetWidth;
			var visibleLength = 0;
			
			for (var n=0; n < this.columns.length; n++)
			{
				if (this.columns[n].show)
				{
					visibleLength++;
					if (this.columns[n].percentWidth !== null)
					{
						totalWidth += MIN_COLUMN_WIDTH + widthDiff;
					}
					else
					{
						totalWidth += this.columns[n].Width + widthDiff;
					}
				}
			}
			
			// do this only if there is room for columns to shrink!
			if (headersWidth >= ((MIN_COLUMN_WIDTH + widthDiff) * visibleLength))
				while (totalWidth > headersWidth)
				{
					// columns are too wide
					for (var n=0; n < this.columns.length; n++)
					{
						if (this.columns[n].show &&
							this.columns[n].percentWidth === null &&
							this.columns[n].Width > MIN_COLUMN_WIDTH)
						{
							sizesChanged = true;
							this.columns[n].Width--;
							totalWidth--;
						}
						
						if (totalWidth == headersWidth)
							break;
					}
				}
			
			// TODO: now use extra space to fill percentage columns
			
			// now adjust sizes in DOM
			if (sizesChanged)
			{
				for (var n=0; n < this.columns.length; n++)
				{
					lis[base+(n*2)].style.width = this.columns[n].Width + 'px';
				}
				
				var rows = this._cached.rows_body.getElementsByTagName('ul');
				var rowsbase = this.multiselect ? 1 : 0;
				for (var a=0; a < rows.length; a++)
				{
					var rLis = rows[a].getElementsByTagName('li');
					
					for (var n=0; n < this.columns.length; n++)
					{
						rLis[rowsbase+n].style.width = this.columns[n].Width + 'px';
					}
				}
			}
		}
	}
};

/*
* Internal use only
*/
Scriptor.DataView.prototype._getHeadersWidth = function()
{
	var optionsMenuElem = document.getElementById(this.divId+'_optionsMenuBtn');
	var menuBox = Scriptor.element.getOuterBox(optionsMenuElem);
	var columnsBox = Scriptor.element.getInnerBox(this._cached.headerUl);
	
	var multiselectWidth = 0;
	
	if (this.multiselect)
	{
		var lis = this._cached.headerUl.getElementsByTagName('li');
		multiselectWidth = lis[0].offsetWidth + lis[1].offsetWidth;
	}
	
	return this._cached.headerUl.offsetWidth - columnsBox.left - multiselectWidth - (optionsMenuElem.offsetWidth + menuBox.left + menuBox.right);
};

/*
* Internal use only
*/
Scriptor.DataView.prototype.__calculateTotalWidth = function()
{
	var totalWidth = 0;
	
	var cols = this._cached.headerUl.getElementsByTagName('li');
	
	for (var n=0; n < cols.length; n++) {
		totalWidth += cols[n].offsetWidth;
	}
	
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
	
	e.columnId = this.resColumnId;
	e.resizingFrom = this.resizingFrom;
	e.resizedTo = this.columns[this.resColumnId].Width;
	
	Scriptor.event.fire(this, 'oncolumnresize', e);
	
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
	var colNdx = this.resColumnId;
	
	// get the next column in case resizing is needed
	var nextActualColNdx = colNdx;
	for (n = colNdx+1; n < this.columns.length; n++) {
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
		if ((this.columns[colNdx].Width - deltaX) > 0) {
			this.columns[colNdx].Width -= deltaX;
			changedSize = true;
		}
	}
	else {
		// see if there is space for col to grow
		var totalWidth = this.__calculateTotalWidth();
		
		if ((totalWidth + deltaX) < this._cached.headerUl.offsetWidth) {	// there is space to grow
			this.columns[colNdx].Width += deltaX;
			changedSize = true;
		}
		else {	// no space
			if (nextActualColNdx != colNdx) {	// not the last col shrink next col
				if ((this.columns[nextActualColNdx].Width - deltaX) > 0) {
					this.columns[colNdx].Width += deltaX;
					this.columns[nextActualColNdx].Width -= deltaX;
					changedSize = true;
					changedNextColSize = true;
				}
			}
		}
	}
	
	// update dataView HTML header
	var htmlHeader = this._cached.headerUl;
	if (htmlHeader) {
		var cols = htmlHeader.getElementsByTagName('li');
		var offset = (this.multiselect ? 2 : 0);
		
		var ndx = offset + (colNdx*2);
		
		cols[ndx].style.width = this.columns[colNdx].Width + 'px'; 
		
		if (changedNextColSize) {
			ndx += 2;
			
			cols[ndx].style.width = this.columns[nextActualColNdx].Width + 'px';
		}
	}
		
	// update row cells
	var rows = this._cached.rows_body.getElementsByTagName('ul');
	
	for (var n=0; n < rows.length; n++)
	{
		var cols = rows[n].getElementsByTagName('li');
		var offset = (this.multiselect ? 1 : 0);
		
		var colWidth = this.columns[colNdx].Width;
		
		cols[offset+(colNdx)].style.width = colWidth + 'px';
		
		if (changedNextColSize) 
			cols[offset+(colNdx)+1].style.width = this.columns[nextActualColNdx].Width + 'px';
	}
};

/*
* DataView.addDataType
*
* This is a function that allows to add custom data types to be handled
* by all DataView objects.
*
* Parameters:
*   name: a string with the name of the data type to be set to the column Type parameter
*   constructor: a function that returns the object containing the data, must get
*     1 parameter, value, to be used to feed the data type with actual values, must be
*     comparable (you can use custom comparator functions) and have a valid toString
*     method
*
* Example:
*   myDataView.addDataType('custom', function(val) {
*		var obj = {};
*		
*		obj.val = val;
*		obj.toString = function() {return 'value is' + val};
*		
*		return obj;
*		
*	});
*	
*/
Scriptor.DataView.prototype.addDataType = function(name, constructor) {
	if (typeof(name) != 'string')
	{
		Scriptor.error.report("Invalid data type name.");
		return;
	}
	
	if (typeof(constructor) != 'object')
	{
		Scriptor.error.report("Invalid data type constructor.");
		return;
	}
	else if (typeof(constructor.toString) != 'function')
	{
		Scriptor.error.report("Data type constructor missing toString method.");
		return;
	}
	
	if (!dataTypes[name])
	{
		dataTypes[name] = constructor;
	}
	else
	{
		Scriptor.error.report("Tried to instantiate a data type but data type was already defined");
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
	
			this.dataView.rows.length = 0;
			if (root.getAttribute('success') == '1')
			{
				var totRows = Number(root.getAttribute('totalrows'));
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					
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
					
					this.dataView.addRow(this.dataView.createRow(tempR), undefined, false);
				}
			}
			else
			{
				this.dataView.setMessage(root.getAttribute('errormessage'));
			}
			
			this.dataView.updateRows();
			
		}
		else	// json
		{
			this.dataView.rows.length = 0;
			
			if (data.success)
			{
				var totRows = Number(data.totalrows);
				if (!isNaN(totRows))
				{
					this.dataView.totalRows = totRows;
					
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
					
					this.dataView.addRow(this.dataView.createRow(tempR), undefined, false);
				}
			}
			else
			{
				this.dataView.setMessage(data.errormessage);
			}
			
			this.dataView.updateRows();
		}
	},
	
	_onError : function(status)
	{
		this.dataView.setLoading(false);
		this.dataView.setMessage('Error: Unable to load dataView object (HTTP status: ' + status + ')');
	}
};
