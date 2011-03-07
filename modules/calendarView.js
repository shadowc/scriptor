/* JavaScript Document
*
* calendarView version 1.1.0b MODIFIED!!
*
* Dynamic ajax based calendar. Shows a simple calendar component with the ability
* to select dates (or date ranges) and navigate.
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+
*/

/*
* calendarView
* This is the main object. It holds a calendar which is assigned to an HTMLElement under
*  which to be instantiated.
*
* members are:
*  selectedDates: The current selected date range. Its an array of date objects holding the
*    range of selected dates. If length equals 0, the selection is empty.
*  multiSelect: If true multiselection is enabled for the calendar.
*  enabled: If true, it will accept clicks. Otherwise table will be non functional for interaction.
*  advanced: read only. True if calendar is in advanced selection mode.
*
*  curMonth: read only, an integer representing the current month to display (zero based).
*  curYear: read only, an integer representing the current year to display.
*  
*  disabledBefore : if present, all dates before but not including this date will be disabled
*  disabledAfter : if present, all dates after but not including this date will be disabled
*  disabledDays : (array) set all dates of the given day index (sun=0) to 0 to disable
*  disabledDates : an array of date elements pointing to disabled dates.
*  markedDates : an array of marked dates. Usefull to display busy days.
*
*  onbeforeshow: event handler. Will be executed before anything is rendered
*   by the Show method. Usefull for filtering selectable date ranges before showing. 
*   Also by returning false you can cancel Show()
*  onshow: event handler. Will be executed after everything has been rendered. Usefull for some
*   formatting on the resulting calendar.
*  onbeforeselect: event handler. Will be executed after a click on a date and before anthing
*   is done to the object. You can cancel date selection by returning false on that function.
*  onselect: event handler. Will be executed after a date selection is done.
*
*  visible: Should be read only. It is set to true when a successfull Show() has been performed.
*  div: string with the id of the object upon which the calendarView will be rendered.
*  lang: a language object which must be loaded including any of the language scripts.
*
*/
calendarView = function(div, multiselect, month, year) {
	this.selectedDates = Array();
	this.multiSelect = multiselect ? true : false;
	this.enabled = true;
	this.advanced = false;
	
	this.curMonth = (!isNaN(Number(month)) && month >= 0 && month < 12) ? month : new Date().getMonth();
	this.curYear = (!isNaN(Number(year)) && year > 0) ? year : new Date().getFullYear();
	
	this.onbeforeshow = false;
	this.onshow = false;
	this.onbeforeselect = false;
	this.onselect = false;
	
	this.disabledBefore  = false;
	this.disabledAfter = false;
	this.disabledDays = Array(1, 1, 1, 1, 1, 1, 1);
	this.disabledDates = Array();
	this.markedDates = Array();

	this.visible = false;
	if (typeof(div) != 'string') {
		alert('Error: paramenter HTMLElement id must be string.');
		return false;
	}
	else {
		if (!div) {
			alert('Error: Must give the id of calendarView rendering HTMLElement');
			return false;
		}
	}
	this.div = div;
	
	CaViE.registers[CaViE.registers.length] = {'dobj' : this, 'ddiv' : this.div };
	
};

/*
*  calendarView.Show()
*   Renders the object inside the object pointed by calendarView.div as its id.
*   Show() will also call updateDates() so it renders calendarView information too.
*/
calendarView.prototype.Show = function() {
	if (!this.div || !document.getElementById(this.div)) {
		alert( 'No HTML Object assigned to calendarView.' );
		return;
	}
	
	if (!this.lang) {
		alert('Error: failed to load a language pack.');
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
	
	// Create table header
	var cvHeader = document.createElement('div');
	cvHeader.className = 'calendarViewHeader';
	
	target.appendChild( cvHeader );
	
	// Create body
	var cvBody = document.createElement('table');
	cvBody.setAttribute('border', '0');
	cvBody.setAttribute('cellpadding', '0');
	cvBody.setAttribute('cellspacing', '0');
	cvBody.className = 'calendarViewBody';	
	target.appendChild( cvBody );

	// Create footer
	var cvFooter = document.createElement('div');
	cvFooter.className = 'calendarViewFooter';
	
	target.appendChild( cvFooter );
	
	this.visible = true;
	this.updateDates();
	
	if (this.onshow) 
		this.onshow(this);
};

/*
*  calendarView.updateDates()
*   When [calendarView.visible = true] which is a result of calling calendarView.Show(), 
*   you can then call calendarView.updateDates() directly to update row information only 
*   without spending additional resources on the calendarView frame rendering.
*/
calendarView.prototype.updateDates = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update data on non visible calendarView object.");
		return;
	}
	
	var target = document.getElementById(this.div);

	var divs = target.getElementsByTagName('table');
	var targetTable = false;
	
	for (var n=0; n < divs.length; n++) {
		if (divs.item(n).className == 'calendarViewBody') {
			targetTable = divs.item(n);
			break;
		}
	}
	
	if (!targetTable) {
		alert('Error: Unable to find calendar table.');
		return;
	}
	
	while( targetTable.firstChild )
		targetTable.removeChild(targetTable.firstChild);
	
	// create table header
	var thead = document.createElement('thead');
	var tmpTr, tmpTh, tmpTd, tmpA;
	
	var tmpTr = document.createElement('tr');
	for (var n=0; n < 7; n++) {
		tmpTh = document.createElement('th');
		tmpTh.appendChild(document.createTextNode(this.lang.shortDays[n]));
		tmpTr.appendChild(tmpTh);
	}
	thead.appendChild(tmpTr);
	targetTable.appendChild(thead);
	
	// create days
	var today = new Date();
	var curMonth = new Date(this.curYear, this.curMonth, 1, 0, 0, 0, 0);
	var nextMonth = new Date(curMonth.getTime());
	nextMonth.setMonth(nextMonth.getMonth()+1);
	
	var firstDay = curMonth.getDay();
	var curDay = 0;
	
	var tbody = document.createElement('tbody');
	var tmpTr = document.createElement('tr');

	// adding space before 1st of month
	while (curDay < firstDay) {
		tmpTd = document.createElement('td');
		tmpTd.appendChild(document.createTextNode(' '));
		tmpTr.appendChild(tmpTd);
		curDay++;
	}
	
	while (curMonth < nextMonth) {
		tmpTd = document.createElement('td');
		tmpTd.setAttribute('align', 'left');
		tmpTd.setAttribute('valign', 'top');
		
		tmpA = document.createElement('a');
		tmpA.setAttribute('href', 'javascript:CaViE.selectDate(' + curMonth.getDate() + ', "' + this.div + '");');
		tmpA.appendChild(document.createTextNode(curMonth.getDate()));
		
		// detect today
		var isToday = false;
		if (CaViE.isEqual(curMonth, today)) {
			isToday = true;
		}
		
		var classChanged = false;
		// detect disabled date
		if (this.isDisabledDate(curMonth)) {
			classChanged = true;
			if (isToday) {
				tmpA.className = 'calendarDisabled calendarToday';
			}
			else {
				tmpA.className = 'calendarDisabled';
			}
		}
		
		// detect marked date
		for (var n=0; n < this.markedDates.length; n++) {
			if (CaViE.isEqual(curMonth, this.markedDates[n])) {
				classChanged = true;
				if (isToday) {
					tmpA.className = 'calendarMarked calendarToday';
				}
				else {
					tmpA.className = 'calendarMarked';
				}
			}
		}
		
		// detect selection range
		for (var n=0; n < this.selectedDates.length; n++) {
			if (CaViE.isEqual(curMonth, this.selectedDates[n])) {
				classChanged = true;
				if (isToday) {
					tmpA.className = 'calendarSelected calendarToday';
				}
				else {
					tmpA.className = 'calendarSelected';
				}
			}
		}
		
		if (!classChanged && isToday)
			tmpA.className = 'calendarToday';
		
		tmpTd.appendChild(tmpA);
		curMonth.setDate(curMonth.getDate()+1);
		tmpTr.appendChild(tmpTd);
		
		curDay++;
		if (curDay > 6) { 	// new row
			tbody.appendChild(tmpTr);
			tmpTr = document.createElement('tr');
			curDay = 0;
		}
	}
	
	// adding space after end of month
	if (curDay > 0) {
		tbody.appendChild(tmpTr);

		while (curDay < 7) {
			tmpTd = document.createElement('td');
			tmpTd.appendChild(document.createTextNode(' '));
			tmpTr.appendChild(tmpTd);
			curDay++;
		}
	}

	targetTable.appendChild(tbody);
	
	this.__refreshHeader();
	this.__refreshFooter();
};

/*
* calendarView.__refreshHeader()
*   Internal function. Refreshes the header area.
*/
calendarView.prototype.__refreshHeader = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update calendar on non visible calendarView object.");
		return;
	}
	
	var target = document.getElementById(this.div);
	
	var divs = target.getElementsByTagName('div');
	var targetDiv = false;
	
	for (var n=0; n < divs.length; n++) {
		if (divs.item(n).className == 'calendarViewHeader') {
			targetDiv = divs.item(n);
			break;
		}
	}
	if (!targetDiv) {
		alert('Error: Unable to find header.');
		return;
	}
	
	while (targetDiv.firstChild) 
		targetDiv.removeChild(targetDiv.firstChild);
		
	var tmpUl, tmpLi, tmpA, tmpP;
	
	tmpUl = document.createElement('ul');
	
	tmpLi = document.createElement('li');
	tmpA = document.createElement('a');
	tmpA.className = 'calendarViewPrev';
	tmpA.setAttribute('title', this.lang.prevMonth );
	tmpA.setAttribute('href', 'javascript:CaViE.goPrevMonth("' + this.div + '")');
	tmpA.appendChild(document.createTextNode(' '));
	tmpLi.appendChild(tmpA);
	tmpUl.appendChild(tmpLi);
	
	tmpLi = document.createElement('li');
	tmpA = document.createElement('a');
	tmpA.className = 'calendarAdvanced';
	tmpA.setAttribute('title', this.lang.advanced );
	tmpA.setAttribute('href', 'javascript:CaViE.setAdvanced("' + this.div + '")');
	tmpA.appendChild(document.createTextNode(' '));
	tmpLi.appendChild(tmpA);
	tmpUl.appendChild(tmpLi);
	
	tmpLi = document.createElement('li');
	tmpP = document.createElement('p');
	tmpP.className = 'calendarViewMonth';
	tmpP.appendChild(document.createTextNode(this.lang.longMonths[this.curMonth] + ' ' + this.curYear));
	tmpLi.appendChild(tmpP);
	tmpUl.appendChild(tmpLi);
	
	tmpLi = document.createElement('li');
	tmpA = document.createElement('a');
	tmpA.className = 'calendarViewNext';
	tmpA.setAttribute('title', this.lang.nextMonth );
	tmpA.setAttribute('href', 'javascript:CaViE.goNextMonth("' + this.div + '")');
	tmpA.appendChild(document.createTextNode(' '));
	tmpLi.appendChild(tmpA);
	tmpUl.appendChild(tmpLi);
	
	targetDiv.appendChild(tmpUl);
};

/*
* calendarView.__refreshFooter()
*   Internal function. Refreshes the footer area.
*/
calendarView.prototype.__refreshFooter = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update calendar on non visible calendarView object.");
		return;
	}
	
	var target = document.getElementById(this.div);
	
	var divs = target.getElementsByTagName('div');
	var targetDiv = false;
	
	for (var n=0; n < divs.length; n++) {
		if (divs.item(n).className == 'calendarViewFooter') {
			targetDiv = divs.item(n);
			break;
		}
	}
	if (!targetDiv) {
		alert('Error: Unable to find footer.');
		return;
	}
	
	while (targetDiv.firstChild) 
		targetDiv.removeChild(targetDiv.firstChild);
	
	var tmpP = document.createElement('p');
	var tmpA = document.createElement('a');
	tmpA.className = 'calendarGoHome';
	tmpA.setAttribute('title', this.lang.homeDate );
	tmpA.setAttribute('href', 'javascript:CaViE.goHomeDate("' + this.div + '")');
	tmpA.appendChild(document.createTextNode(' '));
	tmpP.appendChild(tmpA);
	
	if (this.selectedDates.length) {
		if (this.selectedDates.length == 1) { // single selection
			var text = this.lang.oneSelection;
			text += this.lang.shortDays[this.selectedDates[0].getDay()];
			text += ' ' + this.selectedDates[0].getDate() + ' ';
			text += this.lang.shortMonths[this.selectedDates[0].getMonth()];
			
			tmpP.appendChild(document.createTextNode(text));
		}
		else {  // multiple selection
			var text = this.lang.multipleSelection;
			for (var n=0; n < this.selectedDates.length; n++) {
				if (n > 0) {
					text += ', ';
				}
				text += this.lang.shortDays[this.selectedDates[n].getDay()];
				text += ' ' + this.selectedDates[n].getDate() + ' ';
				text += this.lang.shortMonths[this.selectedDates[n].getMonth()];
			}
			tmpP.appendChild(document.createTextNode(text));
		}
	}
	else {		// noselection
		tmpP.appendChild(document.createTextNode(this.lang.noSelection));
	}
	
	targetDiv.appendChild(tmpP);
};

/*
* calendarView.setAdvanced()
*   Internal function. Goes to advanced mode in which user will select a date using
*   a form. Usefull to select distanct dates.
*/
calendarView.prototype.setAdvanced = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't go to advanced mode on non visible calendarView object.");
		return;
	}
	
	var target = document.getElementById(this.div);

	var divs = target.getElementsByTagName('table');
	var targetTable = false;
	
	for (var n=0; n < divs.length; n++) {
		if (divs.item(n).className == 'calendarViewBody') {
			targetTable = divs.item(n);
			break;
		}
	}
	
	if (!targetTable) {
		alert('Error: Unable to find calendar table.');
		return;
	}
	
	while( targetTable.firstChild )
		targetTable.removeChild(targetTable.firstChild);
		
	var tbody, tr, td, tmpP, tmpLabel, tmpInput, tmpSel, tmpA;
	tbody = document.createElement('tbody');
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'calendarTDWide';
	
	var targetDate = new Date();
	if (this.selectedDates.length)
		targetDate = this.selectedDates[0];
	
	// day selector
	tmpP = document.createElement('p');
	tmpLabel = document.createElement('label');
	tmpLabel.setAttribute('for', this.div + 'DaySelector');
	tmpLabel.appendChild(document.createTextNode(this.lang.day));
	tmpP.appendChild(tmpLabel);
	
	tmpInput = document.createElement('input');
	tmpInput.setAttribute('type', 'text');
	tmpInput.id = this.div + 'DaySelector';
	tmpInput.setAttribute('value', targetDate.getDate());
	tmpP.appendChild(tmpInput);
	td.appendChild(tmpP);
	
	// month selector
	tmpP = document.createElement('p');
	tmpLabel = document.createElement('label');
	tmpLabel.setAttribute('for', this.div + 'MonthSelector');
	tmpLabel.appendChild(document.createTextNode(this.lang.month));
	tmpP.appendChild(tmpLabel);
	
	tmpSel = document.createElement('select');
	
	tmpSel.id = this.div + 'MonthSelector';
	tmpP.appendChild(tmpSel);
	for (var n=0; n < 12; n++) {
		tmpSel.options[tmpSel.options.length] = new Option(this.lang.longMonths[n], n);
		if (targetDate.getMonth() == n) 
			tmpSel.selectedIndex = n;
		
	}
	td.appendChild(tmpP);
	
	// year selector
	tmpP = document.createElement('p');
	tmpLabel = document.createElement('label');
	tmpLabel.setAttribute('for', this.div + 'YearSelector');
	tmpLabel.appendChild(document.createTextNode(this.lang.year));
	tmpP.appendChild(tmpLabel);
	
	tmpInput = document.createElement('input');
	tmpInput.setAttribute('type', 'text');
	tmpInput.id = this.div + 'YearSelector';
	tmpInput.setAttribute('value', targetDate.getFullYear());
	tmpP.appendChild(tmpInput);
	td.appendChild(tmpP);
	
	// buttons
	tmpP = document.createElement('p');
	tmpA = document.createElement('a');
	tmpA.className = 'calendarAccept';
	tmpA.setAttribute('href', 'javascript:CaViE.selectAdvanced("' + this.div + '");');
	tmpA.appendChild(document.createTextNode(this.lang.accept));
	tmpP.appendChild(tmpA);
	td.appendChild(tmpP);
	
	tmpA = document.createElement('a');
	tmpA.className = 'calendarCancel';
	tmpA.setAttribute('href', 'javascript:CaViE.cancelAdvanced("' + this.div + '");');
	tmpA.appendChild(document.createTextNode(this.lang.cancel));
	tmpP.appendChild(tmpA);
	td.appendChild(tmpP);
	
	tr.appendChild(td);
	tbody.appendChild(tr);
	targetTable.appendChild(tbody);
}

/*
* calendarView.isDisabledDate(date)
*   This function will return true if the provided date object is within the range of
*   disabled dates configured in the calendarView.
*/
calendarView.prototype.isDisabledDate = function(date) {
	if (this.disabledBefore) {	
		if (date.getFullYear() < this.disabledBefore.getFullYear()) {
			return true;
		}
		else {
			if (date.getFullYear() <= this.disabledBefore.getFullYear() &&
				date.getMonth() < this.disabledBefore.getMonth()) {
				return true;
			}
			else {
				if (date.getFullYear() <= this.disabledBefore.getFullYear() &&
					date.getMonth() <= this.disabledBefore.getMonth() &&
					date.getDate() < this.disabledBefore.getDate()) {
					return true;
				}
			}
		}	
	}
	
	if (this.disabledAfter) {
		if (date.getFullYear() > this.disabledAfter.getFullYear()) {
			return true;
		}
		else {
			if (date.getFullYear() >= this.disabledAfter.getFullYear() &&
				date.getMonth() > this.disabledAfter.getMonth()) {
				return true;
			}
			else {
				if (date.getFullYear() >= this.disabledAfter.getFullYear() &&
					date.getMonth() >= this.disabledAfter.getMonth() &&
					date.getDate() > this.disabledAfter.getDate()) {
					return true;
				}
			}
		}
	}
	
	if (this.disabledDays[date.getDay()] == 0) {
		return true;
	}
	
	for (var n=0; n < this.disabledDates.length; n++) {
		if (CaViE.isEqual(date, this.disabledDates[n])) {
			return true;
		}
	}
	
	return false;
};

/*
* Hooks this calendarView instance to a text input to select a date
*/
calendarView.prototype.hook = function(elementId) {
	var elem;
	
	if (elem = document.getElementById(elementId)) {
		for (var n=0; n < CaViE.registers.length; n++) {
			if (CaViE.registers[n].ddiv == this.div) {
				CaViE.registers[n].hookId = elementId;
			}
		}
		
		calElem = document.getElementById(this.div);
		elem.onfocus = CaViE.showHooked;
		calElem.style.display = 'none';
		calElem.style.position = 'absolute';
		this.Show();
		this.onselect = CaViE.assignToHooked;
	}
}

calendarView_engine = function() {
/*
* This object contains dataView objects with their respective div strings 
* (the id of the HTMLElement on which dataView is to show). 
*/
	this.registers = Array();
}

calendarView_engine.prototype = {

/*
* isEqual()
*  This function compares two date objects and returns true if they point to the same date.
*/

isEqual : function (date1, date2) {
	if (date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()) {
		return true;
	}
	else {
		return false;
	}
},

/*
* selectDate()
*  This function executes when clicking on a dataView row and selects that row.

*/
selectDate : function (date, divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
	
	if (!obj.enabled) 
		return;
		
	if (obj.onbeforeselect) {
		if (!obj.onbeforeselect())
			return;
	}
	
	var targetDate = new Date(obj.curYear, obj.curMonth, date);
	if (!obj.isDisabledDate(targetDate)) {
		if (!obj.multiSelect) {
			obj.selectedDates.length = 0;
			obj.selectedDates[0] = targetDate;
		}
		else {
			alert('Error: multiselect function not implemented.');
			return;
		}
		obj.updateDates();
		
		if (obj.onselect)
			obj.onselect(obj);
	}
},

/*
* selectAdvanced()
*  This function checks and selects the date entered in advanced mode
*/

selectAdvanced : function(divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
		
	var dayNum = document.getElementById(divId + 'DaySelector').value;
	var monthNum = document.getElementById(divId + 'MonthSelector').value;
	var yearNum = document.getElementById(divId + 'YearSelector').value;
	
	if (isNaN(Number(dayNum))) {
		alert(obj.lang.error1);
		return;
	}
	
	if (isNaN(Number(yearNum))) {
		alert(obj.lang.error2);
		return;
	}
	
	targetDate = new Date(yearNum, monthNum, dayNum);
	if (targetDate.getMonth() != monthNum) {
		alert(obj.lang.error1);
		return;
	}
	
	if (obj.isDisabledDate(targetDate)) {
		alert(obj.lang.error3);
		return;
	}
	
	if (obj.onbeforeselect) {
		if (!obj.onbeforeselect())
			return;
	}
	
	obj.selectedDates.length = 0;
	obj.selectedDates[0] = targetDate;
	CaViE.goHomeDate(divId);
	
	if (obj.onselect)
		obj.onselect(obj);
},

/*
* goPrevMonth()
*  To go to a previous month
*/
goPrevMonth : function (divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
	
	if (!obj.enabled) 
		return;
		
	obj.curMonth--;
	if (obj.curMonth < 0) {
		obj.curMonth = 11;
		obj.curYear--;
	}
	
	obj.updateDates();
},

/*
* goNextMonth()
*  To go to the next month
*/
goNextMonth : function (divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
	
	if (!obj.enabled) 
		return;
		
	obj.curMonth++;
	if (obj.curMonth > 11) {
		obj.curMonth = 0;
		obj.curYear++;
	}
	
	obj.updateDates();
},

/*
* goHomeDate()
*  Will make selection visible, or will show current date
*/
goHomeDate : function (divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
	
	if (!obj.enabled) 
		return;
		
	var showingDate;
	if (obj.selectedDates.length) {
		showingDate = obj.selectedDates[0];
	}
	else {
		showingDate = new Date();
	}
	
	obj.curMonth = showingDate.getMonth();
	obj.curYear = showingDate.getFullYear();
	obj.updateDates();
},

/*
* setAdvanced()
*  This function will trgger advanced selection mode in calendar instance
*/
setAdvanced : function (divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
	
	if (!obj.enabled) 
		return;
	
	obj.setAdvanced();
},

/*
* cancelAdvanced()
*  This function will return to normal mode, canceling advanced selection in calendar instance
*/
cancelAdvanced : function (divId) {
	var obj = CaViE.__findCalendarView(divId);
	
	if (!obj) {	
		alert('Error: Unable to find calendarView.');
		return;
	}
	
	if (!obj.enabled) 
		return;
	
	obj.updateDates();
},

/*
* __findCalendarView()
* This function searches a calendarView object in the registered list of calendarViews 
* providing its div id string
*/
__findCalendarView : function (str) {
	for (var n=0; n < CaViE.registers.length; n++) 
		if (CaViE.registers[n].ddiv == str) 
			return CaViE.registers[n].dobj;
	
	return false;
},

/*
* shows a hooked calendar to input text
*/
showHooked : function(e) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	for (var n=0; n < CaViE.registers.length; n++) {
		if (CaViE.registers[n].hookId == elem.id) {
			var date = CaViE.getDateFromStr(elem.value);
			
			var obj = CaViE.registers[n].dobj;
			obj.curMonth = date.getMonth();
			obj.curYear = date.getFullYear();
			obj.selectedDates.length = 0
			obj.selectedDates[0] = date;
			
			obj.Show();
			
			if (document.addEventListener)
				document.addEventListener('click', CaViE.hideHooked, false);
			else
				document.attachEvent('onclick', CaViE.hideHooked);
				
			var cElem = document.getElementById(CaViE.registers[n].ddiv);
			
			cElem.style.display = 'block';
			cElem.zIndex = '1000';
			if (e.offsetX) {
				x = e.offsetX;
				y = e.offsetY
			}
			else {
				x = e.pageX - document.getBoxObjectFor(elem).x;
				y = e.pageY - document.getBoxObjectFor(elem).y;
			}
			
			if (e.pageX) {
				x = e.pageX - x;
				y = e.pageY - y + 24;
			}
			else {
				if (e.x) {
					x = e.x + document.documentElement.scrollLeft - x;
					y = e.y + document.documentElement.scrollTop - y + 24;
				}
				
			}
			cElem.style.left = x + 'px';
			cElem.style.top = y + 'px';
			
			break;
		}
	}
	
},

/*
* to hide the showing floating calendars
*/
hideHooked : function(e, noDetach) {
	if (!e)
		e = window.event;
	
	var elem = (e.target) ? e.target : e.srcElement;
	
	if (elem.nodeType == 3)
		elem = elem.parentNode;
	
	for (var n=0; n < CaViE.registers.length; n++) {
		if (CaViE.registers[n].hookId) {
			var cDiv = CaViE.registers[n].ddiv;
			var hide = true;
			var curElem = elem;
			
			if (elem.id == CaViE.registers[n].hookId) {
				hide = false;
			}
			else {
				while (curElem.parentNode) {
					if (curElem.id == cDiv) {
						hide = false;
						break;
					}
					curElem = curElem.parentNode;
				}
			}
			
			if (hide) 
				document.getElementById(CaViE.registers[n].ddiv).style.display = 'none';
		}
	}
},

/*
* gets date from str. TODO: formatting!
*/
getDateFromStr : function(str) {
	var dateCmps = str.split('/');
	
	// dd/mm/yyyy
	var ret;
	if (!isNaN(Number(dateCmps[0])) && !isNaN(Number(dateCmps[1])) && !isNaN(Number(dateCmps[2]))) {
		if (dateCmps[1] > 0 && dateCmps[1] < 13 && dateCmps[0] > 0 && dateCmps[0] < 32 && dateCmps[2] > 0) {
			
			ret = new Date(dateCmps[2], dateCmps[1]-1, dateCmps[0], 0, 0, 0);
		}
		else {
			ret = new Date();
		}
	}
	else {
		ret = new Date();
	}
	
	return ret;
},

/*
* Assign selected value in a calendarView to hooked input
* TODO: formatting!
*/
assignToHooked : function(obj) {
	for (var n=0; n < CaViE.registers.length; n++) {
		if (CaViE.registers[n].ddiv == obj.div && CaViE.registers[n].hookId) {
			document.getElementById(CaViE.registers[n].ddiv).style.display = 'none';
			document.onclick = null;
			
			var date = obj.selectedDates[0];
			input = document.getElementById(CaViE.registers[n].hookId);
			// dd/mm/yyyy
			input.value =  date.getDate() + '/' + (date.getMonth() +1) + '/' + date.getFullYear();
		}
	}
}

};

CaViE = new calendarView_engine();