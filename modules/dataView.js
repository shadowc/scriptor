/* JavaScript Document
*
* Data View version 2.5b
*
* Dynamic ajax based sortable data table. It gets rows of data from an XML Service that
* can be displayed and sorted dynamically on any column
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+ (for Windows)
*
* This object is part of the scriptor modular loader since version 1.0.2b
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
dataColumn = function(name, type, show, width, format, display_name, sql_name) {
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
dataRow = function(columnCollection) {
	for (var n=0; n < columnCollection.length; n++) {
		this[columnCollection[n].Name] = DVE.dataTypes[columnCollection[n].Type]();
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
*  selectedRow: Array of the selected rows
*  multiselect: set to true if to allow multiselect
*  curRow: a pointer to the current selected row or null if no row is selected
*  enabled: If true, it will accept clicks. Otherwise table will be non functional for interaction.
*  
*  onbeforerefresh: event handler. Will be executed before the XML service call. You can cancel the
*   refresh by returning false on the function
*  onrefresh: event handler. Will be executed after a succesfull XML service call and rows updated
*  onbeforeshow: event handler. Will be executed after a Refresh() and before anything is rendered
*   by the Show method. Usefull for filtering a table before showing. Also by returning false
*   you can cancel Show()
*  onshow: event handler. Will be executed after everything has been rendered. Usefull for some
*   formatting on the resulting (fake)tables.
*  onbeforeselect: event handler. Will be executed after a click on a row and before anthing
*   is done to the object. You can cancel row selection by returning false on that function.
*  onselect: event handler. Will be executed after a row selection is done.
*
*  visible: Should be read only. It is set to true when a successfull Show() has been performed.
*  sqlService: String with the path/name of the XML service which updates the dataView information.
*  div: string with the id of the object upon which the dataView will be rendered.
*  http_request: internal object. This is the XMLHttpRequest object.
*  optParams: String with optional url encoded parameters to pass to every refresh function by 
*   default
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
dataView = function(div, sqlService, width, height) {
	this.rows = Array();
	this.columns = Array();
	
	this.selectedRow = -1;
	this.selectedRows = [];
	this.multiselect = false;
	this.curRow = null;
	this.enabled = true;
	
	this.onbeforerefresh = false;
	this.onrefresh = false;
	this.onbeforeshow = false;
	this.onshow = false;
	this.onbeforeselect = false;
	this.onselect = false;
	
	this.visible = false;
	this.sqlService = sqlService;
	this.optParams = '';
	
	this.div = div;
	this.http_request = false;
	
	this.orderBy = false;
	this.orderWay = 'ASC';
	
	this.Width = isNaN(Number(width)) ? 250 : Number(width);
	this.Height = isNaN(Number(height)) ? 250 : Number(height);
	this.style = DVE.dataStyle;
	
	this.paginating = false;
	this.rowsPerPage = 20;
	this.curPage = 0;
	this.totalRows = 0;
	
	this.optionsMenuWidth = 120;
	this.optionsMenuHeight = 0;
	
	DVE.dataRegisters[DVE.dataRegisters.length] = {'dobj' : this, 'ddiv' : this.div, 
		'resizing' : false, 'resColumnId' : null, 'optionsMenu' : false };
};

/*
* dataView.addColumn()
*  Adds the passed column instance to the dataView columnCollection. Updates rows information 
*  if needed with empty objects and if dataView is visible performs a Show() to refresh.
*/
dataView.prototype.addColumn = function( column ) {
	if (this.__findColumn(column.Name) == -1) {
		this.columns[this.columns.length] = column;
	
		if (this.rows.length > 0) {
			for (var n=0; n < this.rows.length; n++) {
				this.rows[n][column.Name] = DVE.dataTypes[column.Type]();
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
dataView.prototype.deleteColumn = function( identifier ) {
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
dataView.prototype.createRow = function() {
	return new dataRow(this.columns);
};

/*
* dataView.addRow()
*  calling addRow() will add rowObj to the rows in the dataView object. If nothing is passed
*  as an argument, an empty row will be added. If dataView is visible it will call
*  updateRows to reflect the changes.
*/
dataView.prototype.addRow = function(rowObj) {
	if (!rowObj) 
		rowObj = this.createRow();
		
	this.rows[this.rows.length] = rowObj;
	
	if (this.selectedRow != -1)
		this.curRow = this.rows[this.selectedRow];
	else
		this.curRow = null;
		
	if (this.visible) 
		this.updateRows();
};

/*
* dataView.insertRow()
*  Use this the same way as addRow() to inset the row before the indicated row index.
*  If dataView is visible it will call updateRows() to reflect changes.
*/
dataView.prototype.insertRow = function(ndx, rowObj) {
	if (isNaN(Number(ndx)))
		return;
		
	if (!rowObj)
		rowObj = this.createRow();
		
	this.rows.splice(ndx, 0, rowObj);
	
	if (this.selectedRow != -1)
		this.curRow = this.rows[this.selectedRow];
	else
		this.curRow = null;
		
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
	
	if (this.selectedRow != -1)
		this.curRow = this.rows[this.selectedRow];
	else
		this.curRow = null;
		
	if (rowNdx != -1) {
		if (this.visible)
			this.updateRows();
	}
};

/*
* dataView.Refresh();
* Dynamically updates the value in a cell, performing visual updates if needed
* returns true on success, false on error
*/
dataView.prototype.setCellValue = function(row, columnName, value) {
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
*  This function will call the XML Service and update row information inside the dataView.
*  If you need to reflect the changes visually, call Show instead which, in turn, can call Refresh()
*  Set dataView.optParams to a string with optional URL encoded parameters to pass to the XML Service.
*  Example: dataView.Refresh();
*  Refresh() will in turn add '&orderby=xxx&orderway=ASC' to optParams so XML service will get
*  the sqlName of the column which has to be ordered by and its order way in sql format
*  Refresh() will also send a SQL LIMIT command on form of '&limit=99,99' in case Xml pagination
*  is in efect.
*/
dataView.prototype.Refresh = function() {
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
	
	if (this.optParams) 
		request = this.optParams + '&';
	else
		request = '';
	
	if (this.paginating) {
		var limit = (this.rowsPerPage * this.curPage) + ',' + this.rowsPerPage;
		request += 'limit=' + limit + '&';
	}
	
	this.http_request.send( request + 'orderby=' + this.__getColumnSqlName(this.orderBy) + '&orderway=' + this.orderWay );
	
};

/* dataView.loadXmlData
*  for internal use only
*/
dataView.prototype.loadXmlData = function(xmlData, dv) {
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
};

/* dataView.loadError
*  for internal use only
*/
dataView.prototype.loadError = function(status, dv) {
	dv.rows.length = 0;
	
	if (dv.visible) {
		dv.updateRows()
	}
	else {
		dv.Show(false);
	}
};

/*
*  dataView.Show()
*   Renders the object inside the object pointed by dataView.div as its id.
*   If passed true on withRefresh, this will perform a Refresh() before showing. You can
*   pass aditional parameters to Refresh with dataView.optParams (se dataView.Refresh())
*   Show() will also call updateRows() so it renders dataView information too.
*/
dataView.prototype.Show = function(withRefresh) {

	if (withRefresh) {
		this.Refresh();
		//return;
	}
	
	if (!this.div || !document.getElementById(this.div)) {
		alert( 'No HTML Object assigned to dataView.' );
		return;
	}
	
	if (this.onbeforeshow) {
		if (!this.onbeforeshow(this)) {
			return;
		}
	}
			
	if (this.visible) 	// we're redrawing
		this._oldScrollTop = document.getElementById(this.div + '_body').parentNode.scrollTop;
	
	var target = document.getElementById(this.div);
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
	target.style.overflow = 'hidden';
	
	// Create table paginating header
	if (this.paginating) {
		var totalPages = this.getTotalPages();		
		
		dvTemplate += '<div class="dataViewPaginationHeader"><ul><li>';
		dvTemplate += '<label class="dataViewPaginationPages">' + this.langObj[this.Lang].pageStart + (this.curPage + 1) +
							this.langObj[this.Lang].pageMiddle + (totalPages);
		dvTemplate += '</label></li><li>';
		dvTemplate += '<a href="javascript:DVE.__goToPagePrev(\'' + this.div + '\')" class="dataViewPrevBtn"> </a>';
		dvTemplate += '<a href="javascript:DVE.__goToPageNext(\'' + this.div + '\')" class="dataViewNextBtn"> </a>';		
		dvTemplate += '</li><li><label class="dataViewPaginationGotoPage" for="' + this.div + '_pageInput">' + this.langObj[this.Lang].pageEnd + '</label>';
		dvTemplate += '<input type="text" class="dataViewPaginationInput" id="' + this.div + '_pageInput" />';
		dvTemplate += '<input type="button" value="' + this.langObj[this.Lang].pageGo + '" class="dataViewPageButton" id="' + this.div + '_pageInputBtn" />';
		dvTemplate += '</li></ul></div>';
		
	}
	
	// Create table header
	dvTemplate += '<div class="dataViewHeader" style="width: ' + this.Width + 'px; height: ' + this.style.headerHeight + 'px;">';
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
			
			dvTemplate += '<a style="width: ' + aWidth + 'px;" href="javascript:DVE.__setOrder(\'' + this.div + '\', \'' + this.columns[n].Name + '\');"' + (aClass ? ' class="' + aClass + '"' : '') + '>';
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
		
	dvTemplate += '<div style="height: ' + bodyHeight + 'px; overflow: auto;"';
	
	if (withRefresh) {
		this.visible = false;
		dvTemplate += ' class="dataViewLoading"';
	}
	else {
		dvTemplate += ' class="dataViewOuterBody"';
	}
	dvTemplate += '>';
	
	if (!withRefresh) 
		dvTemplate += '<div style="width: ' + totalWidth + 'px" class="dataViewBody" id="' + this.div + '_body"></div>';
	
	dvTemplate += '</div>';
	
	// Create footer
	dvTemplate += '<div id="' + this.div + '_footer" class="dataViewFooter"></div>';
	
	// create Options menu
	dvTemplate += '<div id="' + this.div + '_optionsMenu" class="dataViewOptionsMenu" style="width: ' + (this.optionsMenuWidth - this.style.optionsMenuHorizontalPadding) + 'px; display: none; overflow: hidden; position: absolute"></div>';
	
	target.innerHTML = dvTemplate;
	
	//assign some events
	if (this.multiselect) {
		document.getElementById(this.div + '_selectAll').onclick = DVE.__selectAll;
	}
	
	if (this.paginating) {
		document.getElementById(this.div + '_pageInput').onkeypress = DVE.__checkGoToPage;
		document.getElementById(this.div + '_pageInputBtn').onclick = DVE.__goToPage;
	}
	
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].show) {
			document.getElementById(this.div + '_sep' + n).onmousedown = DVE.activateResizing;
		}
	}
	document.getElementById(this.div + '_optionsMenuBtn').onclick = DVE.showOptionsMenu;
	
	if (!withRefresh) {
		this.visible = true;
		this.updateRows();
		this.updateOptionsMenu();
		
		if (this.onshow) 
			this.onshow(this);
	}
};

/*
*  dataView.updateRows()
*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
*   dataView.updateRows() directly to update row information only without spending additional
*   resources on the dataView frame rendering.
*/
dataView.prototype.updateRows = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update rows on non visible dataView object.");
		return;
	}
	
	var targetTable = document.getElementById(this.div + '_body');
	
	
	if (!targetTable) {
		alert('Error: Unable to find rows table.');
		return;
	}
	
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
			document.getElementById(this.div + '_selectRow_' + n).onclick = DVE.__markRow;
			
		for (var a=0; a < this.columns.length; a++) {
			if (this.columns[a].show) {
				document.getElementById(this.div + '_cell_' + n + '_' + a).onclick = DVE.__selectRow;
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
dataView.prototype.__refreshFooter = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update rows on non visible dataView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.div + '_footer');
	
	if (!targetDiv) {
		alert('Error: Unable to find footer.');
		return;
	}
	
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
*  dataView.updateOptionsMenu()
*   When [dataView.visible = true] which is a result of calling dataView.Show(), you can then call
*   dataView.updateOptiosMenu() directly to update the options menu only without spending additional
*   resources on the dataView frame rendering. This is usefull when changing the property
*   dataView.optionsMenuWidth to apply these changes.
*/
dataView.prototype.updateOptionsMenu = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update optiosn menu on non visible dataView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.div + '_optionsMenu');

	if (!targetDiv) {
		alert('Error: Unable to find options menu div.');
		return;
	}
	
	targetDiv.style.width = this.optionsMenuWidth - this.style.optionsMenuHorizontalPadding + 'px';
	
	var oTemplate = '<ul><li><a href="javascript:DVE.refreshDataView(\''+this.div+'\');">' + this.langObj[this.Lang]['refresh'] + '</a></li>';
	oTemplate += '<li class="dataViewMenuSep"></li>';
	
	this.optionsMenuHeight = this.style.optionsMenuHeight + this.style.optionsMenuVerticalPadding + this.style.optionsMenuSepHeight;
	
	// column togglers
	for (var n=0; n < this.columns.length; n++) {
		oTemplate += '<li><a href="javascript:DVE.toggleColumn(\''+this.div+'\', ' + n + ');"';
		
		if (this.columns[n].show)
			oTemplate += ' class="dataViewOptionChecked"';
		oTemplate += '>' + this.columns[n].displayName + '</a></li>';
		
		this.optionsMenuHeight += this.style.optionsMenuHeight
	}
	oTemplate += '</ul>';
	
	targetDiv.innerHTML = oTemplate;
};

/*
* dataView.forceWidth()
*  Use it to force the data viewport to a specific width. Will set the object width to
*  the specified value and proportionally adjust the columns if needed to fill the horizontal area
*  Use dataView.Show function instead, to force a width change
*/
dataView.prototype.forceWidth = function(w) {
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
}

/*
* dataView.getTotalPages()
*  When paginating, this tells the total number of pages in the object
*/

dataView.prototype.getTotalPages = function() {
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
dataView.prototype.__sort = function(start) {
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
dataView.prototype.colum_exists = function(str) {
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
dataView.prototype.__findColumn = function(colName) {
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
dataView.prototype.__getColumnSqlName = function(colName) {
	for (var n=0; n < this.columns.length; n++) {
		if (this.columns[n].Name == colName) 
			return this.columns[n].sqlName;
	}
	return false;
};

dataView_engine = function() {
	
/* dataTypes
*
* This object defines the dataView data types. Its members define 
* empty/default object for each of the dataTypes used in the dataView using the function pointer
* to the constructor for that object. Such constructor must accept a string 
* as its argument which is comming from the XML service to the object.
*
* You can define your custom dataTypes here and they will be automatically
* implemented to the object as long as they have toString method and are comparable.
* A compare function to the sorting engine is yet to be implemented.
*/
	this.dataTypes = {'num' : Number, 'alpha' : String, 'date' : function (str) {
		var ret = new Date();
		
		if (str) {
			var dateParts = str.split(' ');
			
			if (dateParts[0] == '0000-00-00') {	//empty sql date field
				return '';
			}
			else {
				var dateCmp = dateParts[0].split('-');
				ret.setYear(dateCmp[0]);
				ret.setMonth(dateCmp[1]-1);
				ret.setDate(dateCmp[2]);
				
				if (dateParts[1]) {
					var timeCmp = dateParts[1].split(':');
					ret.setHours(timeCmp[0]);
					ret.setMinutes(timeCmp[1]);
					ret.setSeconds(timeCmp[2]);
				}
			}
		}
		
		return ret;
	} };

/*
* This object contains dataView objects with their respective div strings 
* (the id of the HTMLElement on which dataView is to show). 
*/
	this.dataRegisters = Array();

/*
* column resizer values
*/
	this.curResizingNdx = null;
	this.resizingXCache = 0;
	
/*
* This style object complements the stylesheet (default.css). If you change styling
* measures on dataView stylesheet you must provide a similar object to your dataView objects
* for the space calculations.
*/
	this.dataStyle = { 
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

}

dataView_engine.prototype = {
/*
* __setOrder()
*  This functions executes when clicking on a dataView column name and sets row order.
*  Pass divId the id property of the HTMLElement asociated with the dataView object and
*  colName the javascript Name of the column in which order must be performed. Ordering way
*  will be switched upon subsecuent calls to __setOrder()
*/
__setOrder : function (divId, colName) {
	var obj = DVE.__findDataView(divId);
	if (!obj)
		return;
	
	if (!obj.enabled) 
		return;
		
	var colNdx = obj.__findColumn(colName)
	
	if (colNdx != -1) {		
		if (obj.orderBy != colName) {
			obj.orderBy = colName;
			obj.orderWay = 'ASC';
		}
		else {
			if (obj.orderWay == 'ASC')
				obj.orderWay = 'DESC';
			else
				obj.orderWay = 'ASC';
		}
		
		if (!obj.paginating) {
			obj.__sort(0);
			
			if (obj.visible) {
				obj.Show(false);
			}
		}
		else {
			if (obj.visible) {
				obj.Show(true);
			}
		}
	}
},

/*
* __selectRow()
*  This function executes when clicking on a dataView row and selects that row.
*/
__selectRow : function (e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var targetTable = false;
	var curElem = elem;
	while (curElem.parentNode) {
		targetTable = curElem.parentNode;
		if (targetTable.className == 'dataViewBody')
			break;
		else
			targetTable = false;
		curElem = curElem.parentNode;
	}
	
	if (!targetTable) {	
		alert('Error: Unable to find rows table.');
		return;
	}
	
	var obj = DVE.__findDataView(targetTable.parentNode.parentNode.id);
	if (!obj) {
		alert( 'Error: dataView object not found.' );
		return;
	}
	
	if (!obj.enabled) 
		return;
		
	if (obj.onbeforeselect) {
		if (!obj.onbeforeselect())
			return;
	}
	
	var rows = targetTable.getElementsByTagName('ul');
	var rowNdx = -1;
	for (var n=0; n < rows.length; n++) {
		if (rows.item(n) == elem.parentNode) {
			rowNdx = n;
			break;
		}
	}
	
	var colStyles = [];
	if (obj.multiselect)	// add dummy style for the first cell
		colStyles.push('MultiselectCell');
	
	for (var n=0; n < obj.columns.length; n++)
		if (obj.columns[n].show)
			colStyles.push(obj.columns[n].Type);
		 
	if (rowNdx != -1) {
		if (!obj.multiselect) {
			if (obj.selectedRow != -1) {
				for (n=0; n < rows.item(obj.selectedRow).childNodes.length; n++) 
					rows.item(obj.selectedRow).childNodes[n].className = 'dataView' + colStyles[n];
			}
		}
		else {
			for (var a = 0; a < obj.selectedRows.length; a++) {
				for (n=0; n < rows.item(obj.selectedRows[a]).childNodes.length; n++) {
					if (n==0)
						rows.item(obj.selectedRows[a]).childNodes[n].firstChild.checked = false;
					rows.item(obj.selectedRows[a]).childNodes[n].className = 'dataView' + colStyles[n];
				}
			}
		}
		
		if (obj.selectedRow == rowNdx && !obj.multiselect) {
			obj.selectedRow = -1;
		}
		else {
			if (!obj.multiselect) {
				obj.selectedRow = rowNdx;
				for (n=0; n < rows.item(rowNdx).childNodes.length; n++) 
					rows.item(rowNdx).childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
			}
			else {
				
				if (!e.ctrlKey && !e.shiftKey) {
					if (obj.selectedRow == rowNdx) {
						obj.selectedRow = -1;
						obj.selectedRows = [];
					}
					else {
						obj.selectedRow = rowNdx;					
						obj.selectedRows = [ rowNdx ];
					}
				}
				
				else {
					if (e.ctrlKey) {
						var found = false;
						for (var n=0; n < obj.selectedRows.length; n++) {
							if (obj.selectedRows[n] == rowNdx) {
								obj.selectedRows.splice(n, 1);
								if (obj.selectedRows.length)
									obj.selectedRow = obj.selectedRows[obj.selectedRows.length -1];
								else
									obj.selectedRow = -1;
								found = true;
							}
						}
						
						if (!found) {
							obj.selectedRow = rowNdx;
							obj.selectedRows.push(rowNdx);
						}
					}
					
					else if (e.shiftKey) {
						if (obj.selectedRows.length) {
							obj.selectedRows.length = 1;
							if (obj.selectedRows[0] == rowNdx) {
								obj.selectedRows = [];
								obj.selectedRow = -1;
							}
							else {
								obj.selectedRow = rowNdx;
								for (var n=obj.selectedRows[0]; (rowNdx > obj.selectedRows[0] ? n <= rowNdx : n >= rowNdx ); (rowNdx > obj.selectedRows[0] ? n++ : n-- )) {
									if (n != obj.selectedRows[0])
										obj.selectedRows.push(n);
								}
							}
						}
						else {
							obj.selectedRows.push(rowNdx);
							obj.selectedRow = rowNdx;
						}
					}
				}
				
				for (var a = 0; a < obj.selectedRows.length; a++) {
					for (n=0; n < rows.item(obj.selectedRows[a]).childNodes.length; n++) {
						if (n==0)
							rows.item(obj.selectedRows[a]).childNodes[n].firstChild.checked = true;
						rows.item(obj.selectedRows[a]).childNodes[n].className = 'dataView' + colStyles[n] + ' selectedRow';
					}
				}
			}
		}
	}
	
	if (obj.selectedRow != -1) {
		obj.curRow = obj.rows[obj.selectedRow];
	}
	else {
		obj.curRow = null;
	}
	
	if (obj.onselect)
		obj.onselect(obj);
	
},

/*
* __markRow()
*  This function executes when clicking on a dataView row checkmox in multiselect and selects that row.
*/
__markRow : function(e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var targetTable = false;
	var curElem = elem;
	while (curElem.parentNode) {
		targetTable = curElem.parentNode;
		if (targetTable.className == 'dataViewBody')
			break;
		else
			targetTable = false;
		curElem = curElem.parentNode;
	}
	
	if (!targetTable) {	
		alert('Error: Unable to find rows table.');
		return;
	}
	
	var obj = DVE.__findDataView(targetTable.parentNode.parentNode.id);
	if (!obj) {
		alert( 'Error: dataView object not found.' );
		return;
	}
	
	if (!obj.enabled) 
		return;
		
	if (obj.onbeforeselect) {
		if (!obj.onbeforeselect())
			return;
	}
	
	var rowNdx = elem.id.substr(elem.id.lastIndexOf('_')+1);
	var colStyles = [];
	colStyles.push('MultiselectCell');	// first cell is multiselect checkbox
	for (var n=0; n < obj.columns.length; n++)
		if (obj.columns[n].show)
			colStyles.push(obj.columns[n].Type);
			
	if (elem.checked) {	// add row to selected rows list
		obj.selectedRows.push(rowNdx)
		obj.selectedRow = obj.selectedRows[obj.selectedRows.length-1];
				
		var row = document.getElementById(obj.div + '_row_' + rowNdx);
		for (var a = 0; a < row.childNodes.length; a++) 
			row.childNodes[a].className = 'dataView' + colStyles[a] + ' selectedRow';
		
	}
	else {		// remove row from selected rows list
		for (var n=0; n < obj.selectedRows.length; n++) {
			if (obj.selectedRows[n] == rowNdx) {
				obj.selectedRows.splice(n, 1);
				if (obj.selectedRows.length) 
					obj.selectedRow = obj.selectedRows[obj.selectedRows.length-1];
				else 
					obj.selectedRow = -1;
			
				var row = document.getElementById(obj.div + '_row_' + rowNdx);
				for (var a = 0; a < row.childNodes.length; a++) {
					row.childNodes[a].className = 'dataView' + colStyles[a];
				}
				break;
			}
		}
	}
	
	if (obj.selectedRow != -1) {
		obj.curRow = obj.rows[obj.selectedRow];
	}
	else {
		obj.curRow = null;
	}
	
	if (obj.onselect)
		obj.onselect(obj);
},

/*
* __selectAll()
*  This function executes when clicking on a dataView header checkmox in multiselect and selects all rows.
*/
__selectAll : function(e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var obj = DVE.__findDataView(elem.id.substr(0, elem.id.indexOf('_')));
	if (!obj) {
		alert( 'Error: dataView object not found.' );
		return;
	}
	
	if (obj.rows.length) {
		if (elem.checked) {
			obj.selectedRow = obj.rows.length -1;
			obj.selectedRows = [];
			obj.curRow = obj.rows[obj.selectedRow];
			
			for (var n=0; n < obj.rows.length; n++)
				obj.selectedRows.push(n);
				
			obj.updateRows();
		}
		else {
			obj.selectedRow = -1;
			obj.selectedRows = [];
			obj.curRow = null;
			
			obj.updateRows();
		}
	}
},

/*
* __goToPage()
*  This function executes when changing the page on a paginated dataView
*/

__goToPage : function (e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;

	var targetTable = false;
	var curElem = elem;
	while (curElem.parentNode) {
		targetTable = curElem.parentNode;
		if (targetTable.className == 'dataViewPaginationHeader')
			break;
		else
			targetTable = false;
		curElem = curElem.parentNode;
	}
	
	if (!targetTable) {	
		alert('Error: Unable to find pagination header.');
		return;
	}

	var obj = DVE.__findDataView(targetTable.parentNode.id);
	
	if (!obj) {
		alert( 'Error: dataView object not found.' );
		return;
	}
	
	if (!obj.enabled)
		return;
		
	var page = document.getElementById(obj.div + '_pageInput').value;
	
	var totalPages = obj.getTotalPages();
	
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
			obj.curPage = Number(page) -1;
			obj.selectedRow = -1;
			obj.curRow = null;
			obj.selectedRows = [];
			
			obj.Show(true);
		}
		
		document.getElementById(obj.div + '_pageInput').focus();
	}
},

/*
* __checkGoToPage()
*  This function executes to capture <enter> key press on the dataView page input
*/

__checkGoToPage : function (e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;

	if (e.keyCode == 13) {
		DVE.__goToPage(e)
	}
},

/*
* __goToPagePrev
*  This function executes when clicked on the "previous" link
*/
__goToPagePrev : function (divId) {
	var obj = DVE.__findDataView(divId);
	if (!obj)
		return;
	
	if (!obj.enabled) 
		return;
	
	if (obj.curPage > 0) {
		obj.curPage--;
		obj.selectedRow = -1;
		obj.curRow = null;
		obj.selectedRows = [];
			
		obj.Show(true);
		
	}
},

/*
* __goToPageNext
*  This function executes when clicked on the "next" link
*/
__goToPageNext : function (divId) {
	var obj = DVE.__findDataView(divId);
	if (!obj)
		return;
	
	if (!obj.enabled) 
		return;
		
	var totalPages = obj.getTotalPages();
	
	if (obj.curPage < totalPages -1) {
		obj.curPage++;
		obj.selectedRow = -1;
		obj.curRow = null;
		obj.selectedRows = [];
			
		obj.Show(true);
		
	}
},

/* activateResizing
*  This function will search for a valid dataView id and mark it for column resizing
*/
activateResizing : function(e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var targetTable = false;
	var curElem = elem;
	while (curElem.parentNode) {
		targetTable = curElem.parentNode;
		if (targetTable.className == 'dataViewHeader')
			break;
		else
			targetTable = false;
		curElem = curElem.parentNode;
	}
	
	if (!targetTable) {	
		alert('Error: Unable to find dataView header.');
		return;
	}
	
	var obj = DVE.__findDataView(targetTable.parentNode.id);
	if (!obj) {
		alert( 'Error: dataView object not found.' );
		return;
	}
	
	if (!obj.enabled) 
		return;
	
	// set active resizing dataView object
	DVE.curResizingNdx = DVE.__getDataViewNdx(obj.div);
	DVE.dataRegisters[DVE.curResizingNdx].resizing = true;
	
	// calculate the resized column
	var curResCol = 0;
	var dColumns = targetTable.firstChild.getElementsByTagName('li');
	for (var n= obj.multiselect ? 2 : 0; n < dColumns.length; n++) {
		if (dColumns.item(n).className == 'dataViewFieldSep') {
			if (dColumns.item(n) == elem) {
				DVE.dataRegisters[DVE.curResizingNdx].resColumnId = curResCol;
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
	
	DVE.resizingXCache = x;
	
	document.onmousemove = DVE.doResizing;
	document.onmouseup = DVE.deactivateResizing;
},

/* performResizing
* This function deactivates resizing status and performs complete redrawing
*/
deactivateResizing : function(e) {
	document.onmousemove = null;
	document.onmouseup = null;
	if (DVE.curResizingNdx != null) {
		DVE.dataRegisters[DVE.curResizingNdx].resizing = false;
		DVE.dataRegisters[DVE.curResizingNdx].resColumnId = null;
		
		DVE.dataRegisters[DVE.curResizingNdx].dobj.Show(false);
		
		DVE.resizingXCache = 0;
		DVE.curResizingNdx = null;
	}
},

/* doResizing
*  This function calculates the resizing upon mouse movement
*/
doResizing : function(e) {
	if (!e)
		e = window.event;
	
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
	
	var deltaX = Math.abs(DVE.resizingXCache - x);
	var growing = (DVE.resizingXCache < x) ? true : false;
	
	DVE.resizingXCache = x;
	// get the minimum width for a column;
	
	var obj = DVE.dataRegisters[DVE.curResizingNdx].dobj;
	var minWidth = obj.style.cellHorizontalPadding + obj.style.sepWidth;
	var colNdx = DVE.dataRegisters[DVE.curResizingNdx].resColumnId;
	var actualColNdx = 0;
	
	// calculate actual col beign changed
	var n, a;
	for (n=0, a=0; n < obj.columns.length; n++) {
		if (obj.columns[n].show) {
			if (a == colNdx) {
				actualColNdx = n;
				break;
			}
			a++;
		}
	}
	
	// get the next column in case resizing is needed
	var nextActualColNdx = actualColNdx;
	for (n = actualColNdx+1; n < obj.columns.length; n++) {
		if (obj.columns[n].show) {
			nextActualColNdx = n;
			break;
		}
	}
	
	// getting a smaller column is easier (?)
	var changedSize = false;
	var changedNextColSize = false;
	
	if (!growing) {
		// see if col can be shorter than it is
		if ((obj.columns[actualColNdx].Width - deltaX) > minWidth) {
			obj.columns[actualColNdx].Width -= deltaX;
			changedSize = true;
		}
	}
	else {
		// see if there is space for col to grow
		var totalWidth = obj.style.objectHorizontalPadding + obj.style.optionsIconWidth;
		if (obj.multiselect)
			totalWidth += obj.style.multiSelectColumnWidth + obj.style.cellHorizontalPadding;
			
		for (n=0; n < obj.columns.length; n++) {
			if (obj.columns[n].show) 
				totalWidth += obj.columns[n].Width;
		}
		
		if ((totalWidth + deltaX) < obj.Width) {	// there is space to grow
			obj.columns[actualColNdx].Width += deltaX;
			changedSize = true;
		}
		else {	// no space
			if (nextActualColNdx != actualColNdx) {	// not the last col shrink next col
				if ((obj.columns[nextActualColNdx].Width - deltaX) > minWidth) {
					obj.columns[actualColNdx].Width += deltaX;
					obj.columns[nextActualColNdx].Width -= deltaX;
					changedSize = true;
					changedNextColSize = true;
				}
			}
		}
	}
	
	// update dataView HTML header
	var htmlObjContainer = document.getElementById(obj.div).getElementsByTagName('div');
	var htmlHeader = null;
	for (var n=0; n < htmlObjContainer.length; n++) {
		if (htmlObjContainer.item(n).className == 'dataViewHeader') {
			htmlHeader = htmlObjContainer.item(n);
			break;
		}
	}
	
	if (htmlHeader) {
		var cols = htmlHeader.firstChild.getElementsByTagName('li');
		var offset = 0;
		if (obj.multiselect)
			offset = 2;
			
		cols.item(offset+(colNdx*2)).style.width = (obj.columns[actualColNdx].Width - obj.style.cellHorizontalPadding - obj.style.sepWidth) + 'px'; 
		if ((obj.columns[actualColNdx].Width - obj.style.cellHorizontalPadding - obj.style.sepWidth - obj.style.sortWidth) > 0) 
			cols.item(offset+(colNdx*2)).firstChild.style.width = (obj.columns[actualColNdx].Width - obj.style.cellHorizontalPadding - obj.style.sepWidth - obj.style.sortWidth) + 'px';
		else 
			cols.item(offset+(colNdx*2)).firstChild.style.width = '0px';
		
		if (changedNextColSize) {
			colNdx++;
			cols.item(offset+(colNdx*2)).style.width = (obj.columns[nextActualColNdx].Width - obj.style.cellHorizontalPadding - obj.style.sepWidth) + 'px';
			if ((obj.columns[nextActualColNdx].Width - obj.style.cellHorizontalPadding - obj.style.sepWidth - obj.style.sortWidth) > 0) 
				cols.item(offset+(colNdx*2)).firstChild.style.width = (obj.columns[nextActualColNdx].Width - obj.style.cellHorizontalPadding - obj.style.sepWidth - obj.style.sortWidth) + 'px';
			else 
				cols.item(offset+(colNdx*2)).firstChild.style.width = '0px';
		}
	}
},

/* showOptionsMenu
*  This function shows the option menu of a dataView object. For internal use only
*/
showOptionsMenu : function(e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	var targetTable = false;
	var curElem = elem;
	while (curElem.parentNode) {
		targetTable = curElem.parentNode;
		if (targetTable.className == 'dataViewHeader')
			break;
		else
			targetTable = false;
		curElem = curElem.parentNode;
	}
	
	if (!targetTable) {	
		alert('Error: Unable to find dataView header.');
		return;
	}
	
	var obj = DVE.__findDataView(targetTable.parentNode.id);
	var objNdx = DVE.__getDataViewNdx(targetTable.parentNode.id);
	if (!obj) {
		alert( 'Error: dataView object not found.' );
		return;
	}
	
	if (!obj.enabled) 
		return;
	
	obj.updateOptionsMenu();
	// hide any active optionsMenu
	for (var n=0; n < DVE.dataRegisters.length; n++) {
		if (DVE.dataRegisters[n].optionsMenu) {
			DVE.hideOptionsMenu(DVE.dataRegisters[n].ddiv);
		}
	}
	
	DVE.dataRegisters[objNdx].optionsMenu = true;
	// find optionsMenuDiv
	optionsDiv = false;
	
	var divs = targetTable.parentNode.getElementsByTagName('div');
	for (var n=0; n < divs.length; n++) {
		if (divs.item(n).className == 'dataViewOptionsMenu') {
			optionsDiv = divs.item(n);
			break;
		}
	}
	
	if (!optionsDiv) {
		alert('Error: optionsDiv object not found.');
		return;
	}
	
	// calculate x, y
	var x, y;

	if (typeof(e.pageX) == 'number') {
		x = e.pageX - obj.optionsMenuWidth;
		y = e.pageY;
	}
	else {
		if (typeof(e.clientX) == 'number') {
			x = (e.clientX + document.documentElement.scrollLeft) - obj.optionsMenuWidth;
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
	if (e.stopPropagation) 
		e.stopPropagation();
	else
		if (e.cancelBubble)
			e.cancelBuble = true;
	
	document.onclick = DVE.checkOptionsMenu;
	
},

/* checkOptionsMenu
*  for internal use only
*/
checkOptionsMenu : function(e) {
	if (!e)
		e = window.event;
	
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
	
},

/* hideOptionsMenu
*  Hides the options menu panel. For internal use only
*/
hideOptionsMenu : function(div) {
	var obj = DVE.__findDataView(div);
	
	if (!obj)
		return;
		
	var objDivCollection = document.getElementById(obj.div).getElementsByTagName('div');
	var objDiv
	
	for (var a=0; a < objDivCollection.length; a++) {
		if (objDivCollection.item(a).className == 'dataViewOptionsMenu') {
			objDiv = objDivCollection.item(a);
			break;
		}
	}
	
	if (objDiv) {
		objDiv.style.display = 'none';
		DVE.dataRegisters[DVE.__getDataViewNdx(div)].optionsMenu = false;
	}
},

/*
* refreshDataView
*   causes a dataView object to refresh. OptionsMenu feature. Use dataView.Show(true) instead.
*/
refreshDataView : function(div) {
	var obj = DVE.__findDataView(div);
	
	if (!obj)
		return;
	
	DVE.hideOptionsMenu(div);
	obj.Show(true);
},

/*
* toggleColumn
*   Toggles a column on or off. OptionsMenu feature. Use dataColumn.show property along with
*   dataView.Show(false) instead to change column configuration manually.
*/
toggleColumn : function(div, colNdx) {
	var obj = DVE.__findDataView(div);
	
	if (!obj)
		return;
	
	DVE.hideOptionsMenu(div);
	if (obj.columns[colNdx].show) {
		obj.columns[colNdx].show = false;
	}
	else {
		obj.columns[colNdx].show = true;
	}
	obj.Show(false);
},

/*
* __findDataView()
* This function searches a dataView object in the registered list of dataViews providing its div id
* string
*/
__findDataView : function (str) {
	for (var n=0; n < DVE.dataRegisters.length; n++) 
		if (DVE.dataRegisters[n].ddiv == str) 
			return DVE.dataRegisters[n].dobj;
	
	return false;
},

/*
* __getDataViewNdx()
* This function searches a dataView object in the registered list of dataViews providing its div id
* string and returns its index on the array
*/

__getDataViewNdx : function (str) {
	for (var n=0; n < DVE.dataRegisters.length; n++) 
		if (DVE.dataRegisters[n].ddiv == str) 
			return n;
	
	return false;
} };

DVE = new dataView_engine();