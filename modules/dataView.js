/* JavaScript Document
*
* Data View version 3.0b
*
* Dynamic ajax based sortable data table. It gets rows of data from an XML or JSON source that
* can be displayed and sorted dynamically on any column
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor framework since 3.0
*/

/*
* dataColumn:
* Object for each of the dataView columns. Add to dataView via the addColumn method
* use deleteColum method to delete a column
* 
* members are:
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
*/
var dataColumn = function(name, type, show, width, format, display_name, sql_name) {
	this.Name = name;
	this.Type = (typeof(DVE.dataTypes[type]) != 'undefined') ? type : 'num';
	this.show = show;
	this.Width = isNaN(Number(width)) ? 80 : Number(width);
	if (this.Width < (DVE.dataStyle.sepWidth + DVE.dataStyle.cellHorizontalPadding))
		this.Width == DVE.dataStyle.sepWidth + DVE.dataStyle.cellHorizontalPadding;
		
	this.Format = format;
	this.displayName = display_name ? display_name : name;
	this.sqlName = sql_name ? sql_name : name;
	this.showToolTip = false;
	
};

/*
* dataRow
* Each of the rows in a dataView. Create via the dataView.createRow() method or
* instantiate with a columnCollection which should be an array of columns. You can
* provide dataView.columns as a parameter for instantiation which is equivalent to
* calling the createRow method.
*
* members are:
*  [colName]: Each column in the column collection creates a member in the row object
*   using the column's javascript name and initializes it with its dataType default value.
*   can be accessed directly: dataRow.<colName> or dataRow.['<colName>']
*  visible:
*   Set to false to filter the row from being shown in a dataView. Use dataView.onbeforeshow
*   event to set filtering before showing a dataView. Should not filter multipage dataViews,
*   but provide filtering information to the XML service instead (not implemented).
*/
var dataRow = function(columnCollection) {
	for (var n=0; n < columnCollection.length; n++) {
		this[columnCollection[n].Name] = dataTypes[columnCollection[n].Type]();
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
* An optional compare function might be provided for complex objects compare
*/
var dataTypes = {'num' : Number, 'alpha' : String, 'date' : function (str) {
	var ret = new Date();
	
	if (str) {
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
} };

/*
* This style object complements the stylesheet (default.css). If you change styling
* measures on dataView stylesheet you must provide a similar object to your dataView objects
* for the space calculations.
*/
var dataViewStyle = {
	'objectVerticalPadding' : 6,
		'objectHorizontalPadding' : 6,
		'paginationHeaderHeight' : 25, 
		'headerHeight' : 24, 
		'footerHeight' : 24,
		'rowHeight' : 17, 
		'cellVerticalPadding' : 0, 
		'cellHorizontalPadding' : 10, 
		'sepWidth' : 4,
		'sortWidth' : 14,
		
		'optionsIconWidth' : 25,
		'multiSelectColumnWidth' : 13,
		'optionsMenuHeight' : 20,
		'optionsMenuHorizontalPadding' : 20,
		'optionsMenuVerticalPadding' : 4,
		'optionsMenuSepHeight' : 4
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
*   optionsMenuWidth: The width in pixels of the options menu. You may adjust this value
*    before showing to adjust to the length of the column names.
*   optionsMenuHeight: The height of the options menu. for internal use only.
*
*  Lang: String. This is the language prefix of the dataLangs object.
*  langObj: set to dataLangs. You can redefine this object and set other languages. Point to the
*   language member in the object with Lang
*/
dataView = Scriptor.dataView = function(div, width, height) {
	// parameter control section
	if ((typeof(div) != 'string' && !Scriptor.isHtmlElement(div)) || div == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	this.rows = Array();
	this.columns = Array();
	
	this.selectedRow = -1;
	this.selectedRows = [];
	this.multiselect = true;	// true since 3.0
	this.enabled = true;
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onrefresh');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.visible = false;
	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.orderBy = false;
	this.orderWay = 'ASC';
	
	this.Width = isNaN(Number(width)) ? 250 : Number(width);
	this.Height = isNaN(Number(height)) ? 250 : Number(height);
	this.style = dataViewStyle;
	
	this.paginating = false;
	this.rowsPerPage = 20;
	this.curPage = 0;
	this.totalRows = 0;
	
	this.optionsMenuWidth = 120;
	this.optionsMenuHeight = 0;
	
	this.resizingXCache = 0;
	this.resColumnId = null;
	
	/*DVE.dataRegisters[DVE.dataRegisters.length] = {'dobj' : this, 'ddiv' : this.div, 
		'resizing' : false, 'resColumnId' : null, 'optionsMenu' : false };*/
	
	/*
	* dataView.createColumn()
	*  Use this function to get a column object instanciated. This function exposes
	*  dataColumn publicly
	*/
	this.createColumn = function(colName, colType, colShow, width, colFormat, display_name, sql_name) {
		return new dataColumn(colName, colType, solShow, width, colFormat, display_name, sql_name);
	};
	
	/*
	* dataView.addColumn()
	*  Adds the passed column instance to the dataView columnCollection. Updates rows information 
	*  if needed with empty objects and if dataView is visible performs a Show() to refresh.
	*/
	this.addColumn = function( column ) {
		if (this.__findColumn(column.Name) == -1) {
			this.columns.push(column);
		
			if (this.rows.length > 0) {
				for (var n=0; n < this.rows.length; n++) {
					this.rows[n][column.Name] = dataTypes[column.Type]();
				}
			}
			
			if (!this.orderBy && column.show)
				this.orderBy = column.Name;
			
			if (this.visible)
				this.Show(false);
		}
	};
	
	/*
	* dataView.deleteColumn()
	*  Deletes the column passed by the identifier parameter. Can be a column (Javascript) Name,
	*  a column index in the collection or an instance of a Column object inside the collection.
	*  will update row information if needed discarting the deleted column.
	*/
	this.deleteColumn = function( identifier ) {
		var colName = '';
		
		if (typeof(identifier) == 'string') {
			var colNdx = this.__findColumn(identifier);
			if (colNdx != -1) {
				colName = this.columns[colNdx].Name;
				this.columns.splice(colNdx,1);
			}
		}
		
		if (typeof(identifier) == 'number') {
			colName = this.columns[identifier].Name;
			this.columns.splice(identifier,1);
		}
		
		if (typeof(identifier) == 'object') {
			for (var n=0; n < this.columns.length; n++) {
				if (this.columns[n] == identifier) {
					colName = this.columns[n].Name;
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
			
			if (this.visible)
				this.Show(false);
		}
	};
		
	/*
	* dataView.createRow()
	*  Use this function to get a row object instanciated with the column informaion of the
	*  dataView object. You can initialize its values before using dataView.addRow() to
	*  add it to the row list.
	*/
	this.createRow = function() {
		return new dataRow(this.columns);
	};

	/*
	* dataView.addRow()
	*  calling addRow() will add rowObj to the rows in the dataView object. If nothing is passed
	*  as an argument, an empty row will be added. If dataView is visible it will call
	*  updateRows to reflect the changes.
	*/
	this.addRow = function(rowObj) {
		if (!rowObj) 
			rowObj = this.createRow();
			
		this.rows.push(rowObj);
			
		if (this.visible) 
			this.updateRows();
	};

	/*
	* dataView.curRow()
	*  returns the currently selected row at any time
	*/
	this.curRow = function() {
		return this.selectedRow != -1 ? this.rows[this.selectedRow] : null;
	};
	
	/* dataView.curRows()
	*  multiselect: Returns an array of the currently selected rows at any time
	*/
	this.curRows = function() {
		var rows = [];
		if (this.multiselect)
		{
			for (var n=0; n < this.selectedRows.length; n++)
				rows.push(this.rows[this.selectedRows[n]]);
		}
		
		return this.multiselect ? rows : this.curRow();
	};
	
	/*
	* dataView.insertRow()
	*  Use this the same way as addRow() to inset the row before the indicated row index.
	*  If dataView is visible it will call updateRows() to reflect changes.
	*/
	this.insertRow = function(ndx, rowObj) {
		if (isNaN(Number(ndx)))
			return;
			
		if (!rowObj)
			rowObj = this.createRow();
			
		this.rows.splice(ndx, 0, rowObj);
		
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
		
		if (this.visible) 
			this.updateRows();
	};
	
	/*
	* dataView.deleteRow()
	*  This method will delete the row identified by identifier. It can be a row index in the
	*  array of rows (i.e.: dataView.selectedRow when != -1) or an instance of a row object 
	*  in the array. If dataView is visible it will call updateRows to reflect the changes.
	*/
	dataView.prototype.deleteRow = function(identifier) {
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
			
		if (rowNdx != -1 && this.visible) 
			this.updateRows();
	};
	
	/*
	* dataView.setCellValue();
	* Dynamically updates the value in a cell, performing visual updates if needed
	* returns true on success, false on error
	*/
	this.setCellValue = function(row, columnName, value) {
		if (isNaN(Number(row)))
			return false;
			
		if (row < 0 || row > this.rows.length-1)
			return false;
			
		var colNdx = this.__findColumn(columnName);
		if (colNdx == -1)
			return false;
			
		this.rows[row][columnName] = value;
		
		if (this.visible && this.columns[colNdx].show) {	// update value
			var cell = document.getElementById(this.div + '_cell_' + row + '_' + colNdx);
			
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
		}
		
		return true;
	};
	
	/*
	* dataView.Refresh();
	*  This function will call updateRows to refresh dataView rows if visible
	*  You can use a dataSet object to connect an XML or JSON service to dataView
	*  and this will automatically retrieve information assync every time
	*  you call refresh() method.
	*/
	dataView.prototype.Refresh = function() {
		var e = Scriptor.event.fire(this, 'onrefresh');
		if (!e.returnValue)
			return;
		
		if (this.visible)
			this.updateRows();
	};
	
	/*
	*  dataView.Show()
	*   Renders the object inside the object pointed by dataView.div as its id.
	*   If passed true on withRefresh, this will perform a Refresh() after showing. 
	*/
	this.Show = function(withRefresh) {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
		
				
		if (this.visible) 	// we're redrawing
			this._oldScrollTop = document.getElementById(this.div + '_body').parentNode.scrollTop;
		
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
			Scriptor.error.report('Error: dataView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'dataViewMain';
		target.innerHTML = '';
		
		var dvTemplate = '';
		
		// adjust column widths to the total width of the object
		this.forceWidth(this.Width);
		
		// calculate total width of columns in table
		var totalWidth = 0;
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show) 
				totalWidth += this.columns[n].Width;
		}
		if (this.multiselect) 
			totalWidth += this.style.multiSelectColumnWidth + this.style.cellHorizontalPadding + this.style.sepWidth;
		
		target.style.width = this.Width + 'px';
		target.style.height = this.Height + 'px';
		target.style.display = 'block';
		target.style.overflow = 'hidden';
		
		// Create table paginating header
		if (this.paginating) {
			var totalPages = this.getTotalPages();		
			
			dvTemplate += '<div class="dataViewPaginationHeader"><ul><li>';
			dvTemplate += '<label class="dataViewPaginationPages">' + this.langObj[this.Lang].pageStart + (this.curPage + 1) +
								this.langObj[this.Lang].pageMiddle + (totalPages);
			dvTemplate += '</label></li><li>';
			dvTemplate += '<a href="#" class="dataViewPrevBtn" id="' + this.div + '_goToPagePrev"> </a>';
			dvTemplate += '<a href="#" class="dataViewNextBtn" id="' + this.div + '_goToPageNext"> </a>';		
			dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.div + '_pageInput">' + this.langObj[this.Lang].pageEnd + '</label>';
			dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.div + '_pageInput" />';
			dvTemplate += '<input type="button" value="' + this.langObj[this.Lang].pageGo + '" class="dataViewPageButton" id="' + this.div + '_pageInputBtn" />';
			dvTemplate += '</li></ul></div>';
			
		}
		
		// Create table header
		dvTemplate += '<div class="dataViewHeader" style="width: ' + this.Width + 'px; height: ' + this.style.headerHeight + 'px;" id="'+this.div+'_columnsHeader">';
		dvTemplate += '<ul style="height: ' + this.style.headerHeight + 'px;">';
		
		if (this.multiselect) {
			dvTemplate += '<li style="width: ' + this.style.multiSelectColumnWidth + 'px;">';
			dvTemplate += '<input type="checkbox" id="' + this.div + '_selectAll" class="dataViewCheckBox" /></li>';
			dvTemplate += '<li style="width: ' + this.style.sepWidth + 'px;" class="dataViewFieldSep noPointer"></li>';
		}
		
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show) {
				
				var colWidth = 0;
				if ((this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth) > 0) 			
					colWidth = (this.columns[n].Width - this.style.cellHorizontalPadding - this.style.sepWidth);
				
				dvTemplate += '<li style="width: ' + colWidth + 'px;">';
				
				var aWidth = 0;
				tmpA = document.createElement('a');		
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
		}
		
		// add field list menu
		dvTemplate += '<li style="width: ' + this.style.optionsIconWidth + 'px" id="' + this.div + '_optionsMenuBtn" class="dataViewFieldList">';
		dvTemplate += '<a href="#"> </a></li>';
		
		dvTemplate += '</ul></div>';
		
		// Create body
		var bodyHeight = 0;
		if (this.paginating) 
			bodyHeight = (this.Height - this.style.paginationHeaderHeight - this.style.headerHeight - this.style.footerHeight - this.style.objectVerticalPadding);
		else
			bodyHeight = (this.Height - this.style.headerHeight - this.style.footerHeight - this.style.objectVerticalPadding);
			
		dvTemplate += '<div style="height: ' + bodyHeight + 'px; overflow: auto;" class="dataViewOuterBody">';
		dvTemplate += '<div style="width: ' + totalWidth + 'px" class="dataViewBody" id="' + this.div + '_body"></div>';
		dvTemplate += '</div>';
		
		// Create footer
		dvTemplate += '<div id="' + this.div + '_footer" class="dataViewFooter"></div>';
		
		// create Options menu
		dvTemplate += '<div id="' + this.div + '_optionsMenu" class="dataViewOptionsMenu" style="width: ' + (this.optionsMenuWidth - this.style.optionsMenuHorizontalPadding) + 'px; display: none; overflow: hidden; position: absolute"></div>';
		
		target.innerHTML = dvTemplate;
		
		//assign some events
		if (this.multiselect) 
			Scriptor.event.attach(document.getElementById(this.div + '_selectAll'), 'click', Scriptor.bind(this.__selectAll, this));
		
		if (this.paginating) {
			Scriptor.event.attach(document.getElementById(this.div + '_goToPagePrev'), 'click', Scriptor.bind(this.__goToPagePrev, this));
			Scriptor.event.attach(document.getElementById(this.div + '_goToPageNext'), 'click', Scriptor.bind(this.__goToPageNext, this));
			Scriptor.event.attach(document.getElementById(this.div + '_pageInput'), 'keypress', Scriptor.bind(this.__checkGoToPage, this));
			Scriptor.event.attach(document.getElementById(this.div + '_pageInputBtn'), 'click', Scriptor.bind(this.__goToPage, this));
		}
		
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show) {
				Scriptor.event.attach(document.getElementById(this.div+'_columnHeader_'+n), 'click', Scriptor.bind(this.__setOrder, this, n));
				Scriptor.event.attach(document.getElementById(this.div + '_sep' + n), 'mousedown', Scriptor.bind(this.activateResizing, this));
			}
		}
		
		Scriptor.event.attach(document.getElementById(this.div + '_optionsMenuBtn'), 'click', Scriptor.bind(this.showOptionsMenu, this));
		
		this.visible = true;
		if (withRefresh) 
			this.Refresh();
		else
			this.__refreshFooter();
		
	};
	
	/*
	* dataView.setLoading(val)
	*   If val is true, show loading spinner, else show the actual rows,
	*   usefull for assync updates
	*/
	this.setLoading = function(val) {
		var body = document.getElementById(this.div + '_body');
		
		body.style.display = val ? 'none' : '';
		body.parentNode.className = val ? 'dataViewLoading' : 'dataViewOuterBody';
		
	};
	
	/*
	* __selectAll()
	*  This function executes when clicking on a dataView header checkmox in multiselect and selects all rows.
	*/
	this.__selectAll = function(e) {
		var elem = document.getElementById(this.div + '_selectAll');
		
		if (this.rows.length) {
			if (elem.checked) {
				this.selectedRow = this.rows.length -1;
				this.selectedRows = [];
				
				for (var n=0; n < this.rows.length; n++)
					this.selectedRows.push(n);
					
				obj.updateRows();
			}
			else {
				this.selectedRow = -1;
				this.selectedRows = [];
				
				obj.updateRows();
			}
		}
	};
	
	/*
	* __goToPage()
	*  This function executes when changing the page on a paginated dataView
	*/
	this.__goToPage = function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
			return;
			
		var page = document.getElementById(this.div + '_pageInput').value;
		
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
				
				this.Show(true);
			}
			
			document.getElementById(this.div + '_pageInput').focus();
		}
	};
	
	/*
	* __checkGoToPage()
	*  This function executes to capture <enter> key press on the dataView page input
	*/
	this.__checkGoToPage = function (e) {
		if (!e)
			e = window.event;
		
		if (e.keyCode == 13) {
			this.__goToPage(e)
		}
	};
	
	/*
	* __goToPagePrev
	*  This function executes when clicked on the "previous" link
	*/
	this.__goToPagePrev = function () {
		
		if (!this.enabled) 
			return;
		
		if (this.curPage > 0) {
			this.curPage--;
			this.selectedRow = -1;
			this.selectedRows = [];
				
			this.Show(true);
		}
	};
	
	/*
	* __goToPageNext
	*  This function executes when clicked on the "next" link
	*/
	this.__goToPageNext = function () {
		if (!this.enabled) 
			return;
			
		var totalPages = this.getTotalPages();
		
		if (this.curPage < totalPages -1) {
			this.curPage++;
			this.selectedRow = -1;
			this.selectedRows = [];
				
			this.Show(true);
		}
	};

	/*
	*  dataView.updateRows()
	*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
	*   dataView.updateRows() directly to update row information only without spending additional
	*   resources on the dataView frame rendering.
	*/
	this.updateRows = function() {
		if (!this.visible) {
			alert( "Can't update rows on non visible dataView object.");
			return;
		}
		
		var targetTable = document.getElementById(this.div + '_body');
		
		if (!this._oldScrollTop)
			this._oldScrollTop = targetTable.parentNode.scrollTop;
			
		var totalHeight = 0;
		var rTemplate = '';
		
		for (var n=0; n < this.rows.length; n++) {		
			
			var firstCol = true;
			rTemplate += '<ul id="' + this.div + '_row_' + n + '">';
			
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
				rTemplate += '<input type="checkbox" id="' + this.div + '_selectRow_' + n + '" class="dataViewCheckBox" ';
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
							
					rTemplate += '" id="' + this.div + '_cell_' + n + '_' + a + '" style="width: ' + colWidth + 'px;"';
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
			if (this.multiselect)
				Scriptor.event.attach(document.getElementById(this.div + '_selectRow_' + n), 'click', Scriptor.bind(this.__markRow, this, n));
				
			for (var a=0; a < this.columns.length; a++) {
				if (this.columns[a].show) {
					Scriptor.event.attach(document.getElementById(this.div + '_cell_' + n + '_' + a), 'click', Scriptor.bind(this.__selectRow, this, n));
					
					if (typeof(this.columns[a].Format) == 'function') {
						var funcRet = this.columns[a].Format(this.rows[n][this.columns[a].Name]);
						if (typeof(funcRet) != 'string')
							document.getElementById(this.div + '_cell_' + n + '_' + a).appendChild(funcRet);
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
	};
	
	/*
	* dataView.__refreshFooter()
	*   Internal function. Refreshes the footer text.
	*/
	this.__refreshFooter = function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update rows on non visible dataView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div + '_footer');
		
		var fTemplate = '<ul><li class="first">';
		
		if (!this.paginating) {
			if (this.rows.length == 0) {
				fTemplate += this.langObj[this.Lang].noRows;
			}
			else {
				if (this.rows.length == 1)
					fTemplate += '1 ' + ' ' + this.langObj[this.Lang].row;
				else
					fTemplate += this.rows.length + ' ' + this.langObj[this.Lang].rows;
			}
		}
		else {
			if (this.rows.length == 0) {
				fTemplate += this.langObj[this.Lang].noRows;
			}
			else {
				var firstRow = (this.rowsPerPage * this.curPage);
				var lastRow = (firstRow + this.rowsPerPage) > this.totalRows ? this.totalRows : (firstRow + this.rowsPerPage);
				fTemplate += (firstRow+1) + ' - ' + lastRow + ' ' + this.langObj[this.Lang].of + ' ' + this.totalRows + ' ' + this.langObj[this.Lang].rows;
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
	this.__setOrder = function (colNdx, e) {
		if (!this.enabled) 
			return;
		
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
				}
			}
			else {
				if (this.visible) {
					this.Show(true);
				}
			}
		}
	},
	
	/*
	* __selectRow()
	*  This function executes when clicking on a dataView row and selects that row.
	*/
	this.__selectRow = function (rowNdx, e) {
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
		if (this.multiselect)	// add dummy style for the first cell
			colStyles.push('MultiselectCell');
		
		for (var n=0; n < this.columns.length; n++)
			if (this.columns[n].show)
				colStyles.push(this.columns[n].Type);
			 
		var rows = document.getElementById(this.div+'_body').getElementsByTagName('ul');
		
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
							rows[obj.selectedRows[a]].childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
						}
					}
				}
			}
		}
		
		Scriptor.event.cancel(e);
		return false;
	};
	
	/*
	* __markRow()
	*  This function executes when clicking on a dataView row checkmox in multiselect and selects that row.
	*/
	this.__markRow = function(rowNdx, e) {
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
		
		elem = document.getElementById(this.div + '_selectRow_' + n);
		if (elem.checked) {	// add row to selected rows list
			this.selectedRows.push(rowNdx)
			this.selectedRow = rowNdx;
					
			var row = document.getElementById(this.div + '_row_' + rowNdx);
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
				
					var row = document.getElementById(this.div + '_row_' + rowNdx);
					for (var a = 0; a < row.childNodes.length; a++) {
						row.childNodes[a].className = 'dataView' + colStyles[a];
					}
					break;
				}
			}
		}
		
		Scriptor.event.cancel(e);
		return false;
	};
	
	/*
	*  dataView.updateOptionsMenu()
	*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
	*   dataView.updateOptiosMenu() directly to update the options menu only without spending additional
	*   resources on the dataView frame rendering. This is usefull when changing the property
	*   dataView.optionsMenuWidth to apply these changes.
	*/
	this.updateOptionsMenu = function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update optiosn menu on non visible dataView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div + '_optionsMenu');
		targetDiv.style.width = this.optionsMenuWidth - this.style.optionsMenuHorizontalPadding + 'px';
		
		var oTemplate = '<ul><li><a href="#"" id="'+this.div+'_optionsMenuRefresh">' + this.langObj[this.Lang]['refresh'] + '</a></li>';
		oTemplate += '<li class="dataViewMenuSep"></li>';
		
		this.optionsMenuHeight = this.style.optionsMenuHeight + this.style.optionsMenuVerticalPadding + this.style.optionsMenuSepHeight;
		
		// column togglers
		for (var n=0; n < this.columns.length; n++) {
			oTemplate += '<li><a href="#" id="'+this.div+'_optionsMenuItem_'+n+'"';
			
			if (this.columns[n].show)
				oTemplate += ' class="dataViewOptionChecked"';
			oTemplate += '>' + this.columns[n].displayName + '</a></li>';
			
			this.optionsMenuHeight += this.style.optionsMenuHeight
		}
		oTemplate += '</ul>';
		
		targetDiv.innerHTML = oTemplate;

		// Attach menu item events		
		Scriptor.event.attach(document.getElementById(this.div+"_optionsMenuRefresh"), 'clicl', Scriptor.bind(this.Refresh, this));
		for (var n=0; n < this.columns.length; n++)
			Scriptor.event.attach(document.getElementById(+this.div+'_optionsMenuItem_'+n), 'click', Scriptor.bind(this.toggleColumn, this, n));
	};

	/* showOptionsMenu
	*  This function shows the option menu of a dataView object. For internal use only
	*/
	// TODO: We need to refactor this with a ContextMenu Component
	this.showOptionsMenu = function(e) {
		/*if (!e)	e = window.event;
		
		if (!this.enabled) {
			Scriptor.event.cancel(e);
			return false;
		}
		
		this.updateOptionsMenu();
		
		this._optionsMenu = true;
		// find optionsMenuDiv
		optionsDiv = document.getElementById(this.div+'_optionsMenu');
		
		// calculate x, y
		var x, y;
	
		if (typeof(e.pageX) == 'number') {
			x = e.pageX - this.optionsMenuWidth;
			y = e.pageY;
		}
		else {
			if (typeof(e.clientX) == 'number') {
				x = (e.clientX + document.documentElement.scrollLeft) - this.optionsMenuWidth;
				y = (e.clientY + document.documentElement.scrollTop);
			}
			else {
				x = 0;
				y = 0;
			}
		}
		
		optionsDiv.style.top = y + 'px';
		optionsDiv.style.left = x + 'px';
		optionsDiv.style.display = 'block';
		
		document.onclick = Scriptor.bind(this.checkOptionsMenu, this);*/
		
		Scriptor.event.cancel(e);
		return false;
	};
	
	/* checkOptionsMenu
	*  for internal use only
	*/
	// TODO: take this out into ContextMenu component
	this.checkOptionsMenu = function(e) {
		/*if (!e)	e = window.event;
		
		// calculate x, y
		var x, y;
	
		if (typeof(e.pageX) == 'number') {
			x = e.pageX;
			y = e.pageY;
		}
		else {
			if (typeof(e.clientX) == 'number') {
				x = (e.clientX + document.documentElement.scrollLeft);
				y = (e.clientY + document.documentElement.scrollTop);
			}
			else {
				x = 0;
				y = 0;
			}
		}
		
		
		// search for dataViews with options menu opened and evaluate closing them
		for (var n=0; n < DVE.dataRegisters.length; n++) {
			if (DVE.dataRegisters[n].optionsMenu) { // this dataView has its optionsMenu active
				var obj = DVE.dataRegisters[n].dobj;
				
				// search object div and look at its position
				var objX, objY, objWidth, objHeight, objDiv;
				objWidth = obj.optionsMenuWidth;
				objHeight = obj.optionsMenuHeight;
				
				var objDivCollection = document.getElementById(obj.div).getElementsByTagName('div');
				
				for (var a=0; a < objDivCollection.length; a++) {
					if (objDivCollection.item(a).className == 'dataViewOptionsMenu') {
						objDiv = objDivCollection.item(a);
						objX = Number(objDiv.style.left.substr(0, objDiv.style.left.length-2));
						objY = Number(objDiv.style.top.substr(0, objDiv.style.top.length-2));
						break;
					}
				}
				
				// see if clicked outside the div
				if (objDiv) {
					if ((x < objX || x > objX+objWidth) || (y < objY || y > objY+objHeight)) {
						DVE.hideOptionsMenu(DVE.dataRegisters[n].ddiv);
						document.onclick = null;
					}
				}
				else {
					// hopefully this will never execute
					DVE.dataRegisters[n].optionsMenu = false;
					document.onclick = null;
				}
			}
		}
		*/
	};
	
	/* hideOptionsMenu
	*  Hides the options menu panel. For internal use only
	*/
	// TODO: Take this out into ContextMenu component
	this.hideOptionsMenu = function(div) {
		/*
		var objDiv = document.getElementById(this.div+'_optionsMenu');
		objDiv.style.display = 'none';
		*/
	};
	
	/*
	* toggleColumn
	*   Toggles a column on or off. OptionsMenu feature. Use dataColumn.show property along with
	*   dataView.Show(false) instead to change column configuration manually.
	*/
	this.toggleColumn = function(colNdx, e) {
		
		this.hideOptionsMenu();
		
		if (this.columns[colNdx].show) {
			this.columns[colNdx].show = false;
		}
		else {
			this.columns[colNdx].show = true;
		}
		
		this.Show(false);
	};
	
	/*
	* dataView.forceWidth()
	*  Use it to force the data viewport to a specific width. Will set the object width to
	*  the specified value and proportionally adjust the columns if needed to fill the horizontal area
	*  Use dataView.Show function instead, to force a width change
	*/
	this.forceWidth = function(w) {
		if (isNaN(Number(w)))
			return;
		
		var minWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth;
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show)
				minWidth += this.style.cellHorizontalPadding + this.style.sepWidth;
		}
		
		if (w < minWidth)
			return;
		
		this.Width = w;
		var totalWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth;
		if (this.multiselect)
			totalWidth += this.style.multiSelectColumnWidth + this.sepWidth;
		
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].show)
				totalWidth += this.columns[n].Width;
		}
		
		if (totalWidth > this.Width) {
			while (totalWidth > this.Width) {
				for (var n=0; n < this.columns.length; n++) {
					if (this.columns[n].show) {
						totalWidth -= 1;
						this.columns[n].Width -= 1;
					}
				}
			}
		}
	};
	
	/*
	* dataView.getTotalPages()
	*  When paginating, this tells the total number of pages in the object
	*/
	
	this.getTotalPages = function() {
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
	* dataView.__sort()
	*  This function performs sorting of rows depending on the sortBy and sortWay properties
	*  For internal use only. Use global function __setOrder instead.
	*/
	this.__sort = function(start) {
		var n, tempRow, swap;	
		
		if (!this.orderBy)
			return;
			
		for (n = start+1; n < this.rows.length; n++) {
			swap = false;
					
			if (this.orderWay == 'ASC') {	
				swap = (this.rows[start][this.orderBy] > this.rows[n][this.orderBy])
			}
			else {
				swap = (this.rows[start][this.orderBy] < this.rows[n][this.orderBy])
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
	this.colum_exists = function(str) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].Name == str)
				return true;
		}
		return false;
	};
	
	/*
	* dataView.__findColumn()
	*  Internal function that returns the index of a column in its collection or -1 if not found.
	*  Pass the column Name property in colName
	*/
	this.__findColumn = function(colName) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].Name == colName) 
				return n;
		}
		return -1;
	};
	
	/*
	* dataView.__getColumnSqlName(colName)
	*  Internal function that returns the column sqlName upon its Name property (colName).
	*/
	this.__getColumnSqlName = function(colName) {
		for (var n=0; n < this.columns.length; n++) {
			if (this.columns[n].Name == colName) 
				return this.columns[n].sqlName;
		}
		return false;
	};
	
	/* activateResizing
	*  This function will search for a valid dataView id and mark it for column resizing
	*/
	this.activateResizing = function(e) {
		if (!e) e = window.event;
		
		if (!obj.enabled) {
			Scriptor.event.cancel(e);
			return false;
		}
		
		var targetTable = document.getElementById(this.div+'_columsHeader');
		
		// calculate the resized column
		var curResCol = 0;
		var dColumns = targetTable.firstChild.getElementsByTagName('li');
		for (var n= obj.multiselect ? 2 : 0; n < dColumns.length; n++) {
			if (dColumns.item(n).className == 'dataViewFieldSep') {
				if (dColumns.item(n) == elem) {
					this.resColumnId = curResCol;
				}
				else {
					curResCol++;
				}
			}
		}
		
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
		
		this.resizingXCache = x;
		
		Scriptor.event.attach(document, 'mousemove', this._mouseMoveBind = Scriptor.bind(this.doResizing, this));
		Scriptor.evnet.attach(document, 'mouseup', this._mouseUpBind = Scriptor.bind(this.deactivateResizing, this));
		
		Scriptor.event.cancel(e);
		return false;
	};
	
	/* performResizing
	* This function deactivates resizing status and performs complete redrawing
	*/
	this.deactivateResizing = function(e) {
		Scriptor.event.detach(document, 'mousemove', this._mouseMoveBind);
		Scriptor.event.detach(document, 'mouseup', this._mouseUpBind);
		
		this.resColumnId = null;
		this.Show(false);
		this.resizingXCache = 0;
	};
	
	/* doResizing
	*  This function calculates the resizing upon mouse movement
	*/
	this.doResizing = function(e) {
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
		var colNdx = this.resColumnId;
		var actualColNdx = 0;
		
		// calculate actual col beign changed
		var n, a;
		for (n=0, a=0; n < this.columns.length; n++) {
			if (this.columns[n].show) {
				if (a == colNdx) {
					actualColNdx = n;
					break;
				}
				a++;
			}
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
			var totalWidth = this.style.objectHorizontalPadding + this.style.optionsIconWidth;
			if (this.multiselect)
				totalWidth += this.style.multiSelectColumnWidth + this.style.cellHorizontalPadding;
				
			for (n=0; n < this.columns.length; n++) {
				if (this.columns[n].show) 
					totalWidth += this.columns[n].Width;
			}
			
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
		var htmlHeader = document.getElementById(this.div+'_columnsHeader');
		if (htmlHeader) {
			var cols = htmlHeader.firstChild.getElementsByTagName('li');
			var offset = 0;
			if (this.multiselect)
				offset = 2;
				
			cols[offset+(colNdx*2)].style.width = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth) + 'px'; 
			if ((this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
				cols[offset+(colNdx*2)].firstChild.style.width = (this.columns[actualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) + 'px';
			else 
				cols[offset+(colNdx*2)].firstChild.style.width = '0px';
			
			if (changedNextColSize) {
				colNdx++;
				cols[offset+(colNdx*2)].style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth) + 'px';
				if ((this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) > 0) 
					cols[offset+(colNdx*2)].firstChild.style.width = (this.columns[nextActualColNdx].Width - this.style.cellHorizontalPadding - this.style.sepWidth - this.style.sortWidth) + 'px';
				else 
					cols[offset+(colNdx*2)].firstChild.style.width = '0px';
			}
		}
	};

};

/* dataView.loadXmlData
*  for internal use only - TODO: Port to dataSet object
*/
/*dataView.prototype.loadXmlData = function(xmlData, dv) {
	var root = xmlData.getElementsByTagName('root').item(0);
	
	dv.rows.length = 0;
	if (root.getAttribute('success') == '1') {
		dv.totalRows = root.getAttribute('totalrows');
		var rows = root.getElementsByTagName('row');

		for (var n=0; n < rows.length; n++) {
			var tempR = dv.createRow();				
			var cols = rows.item(n).getElementsByTagName('column');
			
			for (var a=0; a < cols.length; a++) {
				if (dv.colum_exists(cols.item(a).getAttribute('name')) && cols.item(a).firstChild) {
					var cType = dv.columns[dv.__findColumn(cols.item(a).getAttribute('name'))].Type;
					tempR[cols.item(a).getAttribute('name')] = DVE.dataTypes[cType](cols.item(a).firstChild.data);
				}
			}
			
			dv.rows[dv.rows.length] = tempR;
							
		}
			
		if (dv.onrefresh)
			dv.onrefresh(dv);
		
		if (dv.visible) {
			dv.updateRows()
		}
		else {
			dv.Show(false);
		}
		
	}
	else {
		alert( 'Unsuccessfull XML call.\nMessage: '+ root.getAttribute('error'));
		if (dv.visible) {
			dv.updateRows()
		}
		else {
			dv.Show(false);
		}
	}
};*/

/* dataView.loadError
*  for internal use only
*/
/*dataView.prototype.loadError = function(status, dv) {
	dv.rows.length = 0;
	
	if (dv.visible) {
		dv.updateRows()
	}
	else {
		dv.Show(false);
	}
};*/