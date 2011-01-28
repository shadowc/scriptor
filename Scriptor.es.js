/* Scriptor 2.0b
  
  A tiny Javascript component library plus a few usefull functions
  
  This is open source and I don't care about licenses
  
  by Matias Jose
  http://www.matiasjose.com
  
  http://github.com/shadowc/scriptor
*/

window.Scriptor = (function(window, document, undefined) {
	

// define the Scriptor object
var Scriptor = {
	// prototype bind
	bind : function(func, obj/*, staticArg1, staticArg2... */) {
		if (arguments.length > 2)
		{
			var staticArguments = [];
			for (var n=2; n < arguments.length; n++)
				staticArguments.push(arguments[n]);
			
			return function()
			{
				for (var i = 0; i < arguments.length; i++)
					staticArguments[staticArguments.length] = arguments[i];
				return func.apply(obj, staticArguments);
			};
		}
		else
		{
			return function()
			{
				return func.apply(obj, arguments);
			};
		}
	},
	
	// dojo mixin
	mixin : function(/*Object*/obj, /*Object...*/props) {
		if(!obj){ obj = {}; }
		for(var i=1, l=arguments.length; i<l; i++){
			Scriptor._mixin(obj, arguments[i]);
		}
		return obj; // Object
	},
	
	_mixin : function(/*Object*/ target, /*Object*/ source) {
		var extraNames, extraLen, empty = {};
		for(var i in {toString: 1}){ extraNames = []; break; }
		extraNames = extraNames || ["hasOwnProperty", "valueOf", "isPrototypeOf",
				"propertyIsEnumerable", "toLocaleString", "toString", "constructor"];
		extraLen = extraNames.length;
		
		var name, s, i;
		for(name in source){
			// the "tobj" condition avoid copying properties in "source"
			// inherited from Object.prototype.  For example, if target has a custom
			// toString() method, don't overwrite it with the toString() method
			// that source inherited from Object.prototype
			s = source[name];
			if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
				target[name] = s;
			}
		}
		// IE doesn't recognize some custom functions in for..in
		if(extraLen && source){
			for(i = 0; i < extraLen; ++i){
				name = extraNames[i];
				s = source[name];
				if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
					target[name] = s;
				}
			}
		}
		return target; // Object
	},

	// tiny event system 
	event : {
		attach : function(htmlElement, evt, funcObj) {
			if (htmlElement)
				if (htmlElement.addEventListener) {
					htmlElement.addEventListener(evt, funcObj, false);
				}
				else {
					if (htmlElement.attachEvent) {
						htmlElement.attachEvent('on' + evt, funcObj);
					}
				}
		},
		
		detach : function(htmlElement, evt, funcObj) {
			if (htmlElement)
				if (htmlElement.removeEventListener) {
					htmlElement.removeEventListener(evt, funcObj, false);
				}
				else {
					if (htmlElement.detachEvent) {
						htmlElement.detachEvent('on' + evt, funcObj);
					}
				}
		},
	
		cancel : function(e, alsoStopPropagation) {
			if (typeof(alsoStopPropagation) == 'undefined')
				alsoStopPropagation = true;
				
			if (typeof(e.preventDefault) == 'function')
				e.preventDefault();
	
			e.returnValue = false;
	
			if (alsoStopPropagation) {
				if (typeof(e.stopPropagation) == 'function')
					e.stopPropagation();
	
				e.cancelBubble = true;
			}
			
		},
	
		getPointXY : function(evt) {
			return {
				x: evt.pageX || (evt.clientX +
					(document.documentElement.scrollLeft || document.body.scrollLeft)),
				y: evt.pageY || (evt.clientY +
					(document.documentElement.scrollTop || document.body.scrollTop))
		  };
		}
	},
	
	addOnLoad : function(f) {
		if (window.onload)
		{
			var oldF = window.onload;
			window.onload = function()
				{
					oldF();
					f();
				};
		}
		else
		{
			window.onload = f;
		}
	},
	
	// error reporting system!
	error : {
		alertErrors : false,
		muteErrors : true,
		
		report : function(msg) {
			if (Scriptor.error.alertErrors)
				alert(msg);
			
			if (!Scriptor.error.muteErrors)
				throw msg;
		}
	}
};	
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
	cvHeader = document.createElement('div');
	cvHeader.className = 'calendarViewHeader';
	
	target.appendChild( cvHeader );
	
	// Create body
	cvBody = document.createElement('table');
	cvBody.setAttribute('border', '0');
	cvBody.setAttribute('cellpadding', '0');
	cvBody.setAttribute('cellspacing', '0');
	cvBody.className = 'calendarViewBody';	
	target.appendChild( cvBody );

	// Create footer
	cvFooter = document.createElement('div');
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
	targetDiv = false;
	
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
	targetDiv = false;
	
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

CaViE = new calendarView_engine();// JavaScript Document

calendarView.prototype.lang = {
	shortDays : ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
	longDays : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
	
	shortMonths : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
	longMonths : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 
				  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	
	noSelection : 'Sin seleccionar',
	oneSelection : 'Fecha: ',
	multipleSelection : 'Fechas: ',
	
	prevMonth : 'Mes Anterior',
	nextMonth : 'Mes Próximo',
	advanced : 'Seleccionar mes y año',
	homeDate : 'Ir a selección o al día de hoy',
	
	day : 'Día:',
	month : 'Mes:',
	year : 'Año:',
	
	accept : 'Aceptar',
	cancel : 'Cancelar',
	
	error1 : 'El campo del día ingresado es inválido.',
	error2 : 'El campo del año ingresado es inválido.',
	error3 : 'La fecha seleccionada no está disponible.'
};/* JavaScript Document
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

DVE = new dataView_engine();// JavaScript Document
/*
* dataLangs
* This object contains the strings that have to be output by dataView in different languages.
* Create your own language prefixed object and assign the prefix to the Lang property of dataView.
*  (does not include error messages which are in English)
*/

dataView.prototype.langObj = { 
  'es': { 'noRows' : 'No hay filas para mostrar.', 'rows' : 'filas.', 'row' : 'fila.', 'pageStart' : 'Página ', 'pageMiddle' : ' de ', 'pageEnd' : ' Ir a página: ', 'pageGo' : 'Ir', 'pagePrev' : '<< Anterior', 'pageNext' : 'Siguiente >>', 'refresh' : 'Actualizar', 'of' : 'de' } };
				  
dataView.prototype.Lang = 'es';// JavaScript Document
/*
*
*  galleryView Version 1.1b
*
*  Will display a selectable group of thumbnails with information about the image itself.
*  Compatible with scriptor dynamic javascript+css script loader
*
* Browser Compatibility: Gecko 1.8+, IE6+, Opera 9+, Safari 3.1+
*/

/* 
* gv_ImageObect
*
* This object contains the information about an image in the gallery.
* You initialize it by providing a thumbnail string which will be used in the src
* attribute of the img object. The path is the internal path to be used if you
* need to render the image in its original size, finally an optional name might
* be provided to be printed under te image's thumbnail.
* 
*/
gv_ImageObject = function(thumbnail, path, name) {
	this.thumbnail = thumbnail;
	this.path = path;
	this.name = name;
};

/*
* galleryView
*
* This is the main component. It will set up a div element with the array of
* gv_ImagePbjects representing images.
*
* Constructor:
*  div: a tring with the id attribute of a unique div element to be the container of
*    the component.
*  sqlService: a xml service that will provide the list of images to be loaded in the array
*  thumbWidth: optional, the fixed width of the thumbnails in pixels
*  thumbHeight: optional, the fixed height of the thumbnails in pixles
*
* Properties:
*  selectedImage: the index of the selected image in the array. -1 if none.
*  enabled: set to true if the component is enabled (events will take place and
*    event handlers will be executed).
*  showNames: set to true if you want to display image names under the thumbnails
*  fidexThumbSize: if set to true will take thimbWidth and thumbHeight to set
*    the width and height of the thumbnails. 
*  thumbWidth: a Number with the optional width of the thumbnails in pixels
*  thumbHeight: a Number with the optional height of the thumbnails in pixels
*  onbeforerefresh: a function to be executed before the object will perform a
*    refresh function. If the funtion returns false, the refresh will not be performed
*  onrefresh: function to be executed after a refresh has been successful
*  onbeforeshow: a function to be executed before a show operation. If this returns false
*    show will not be performed.
*  onshow: function to be executed after a show process is successful
*  onbeforeselect: function to be executed bofore a select event. If this returns false
*    the selection won't happen.
*  onselect: function to be executed after a select event is successful
*  visible: readonly property. It is true if the component has been shown sucessfully
*  sqlService: the string containing the path to the xml service that brings the image data
*    on refresh
*  optParams: a query string with optional parameters to be passed to the xml service
*    on refresh
*  div: a sting with the id attribute of the component's assigned div element
*  http_request: internal, variable to host the xmlHttpRequest object
*  images: an array of gv_ImageObjects contained in the component
*/
galleryView = function(div, sqlService, thumbWidth, thumbHeight) {
	this.selectedImage = -1;
	this.enabled = true;
	this.showNames = true;
	this.fixedThumbSize = true;
	this.thumbWidth = isNaN(Number(thumbWidth)) ? 154 : Number(thumbWidth);
	this.thumbHeight = isNaN(Number(thumbHeight)) ? 184 : Number(thumbHeight);
	
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
	
	this.images = Array();
	
	GVE.galleryRegisters[GVE.galleryRegisters.length] = {'obj' : this, 'div' : this.div };
};

galleryView.prototype.addImage = function(imgObj) {
	
};

galleryView.prototype.insertImage = function(imgObj, ndx) {
};

galleryView.prototype.deleteImage = function(identifier) {
};

galleryView.prototype.Refresh = function() {
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

/* galleryView.loadXmlData
*  for internal use only
*/
galleryView.prototype.loadXmlData = function(xmlData, gv) {
	var root = xmlData.getElementsByTagName('root').item(0);


	if (root.getAttribute('success') == '1') {
		var images = root.getElementsByTagName('image');
		gv.images.length = 0;
		for (var n=0; n < images.length; n++) {
			var thumb = images.item(n).getElementsByTagName('thumbnail');
			var path = images.item(n).getElementsByTagName('path');
			var name = images.item(n).getElementsByTagName('name');
			var thumbText = '';
			var pathText = '';
			var nameText = '';
			
			if (thumb.length) {
				if (thumb.item(0).firstChild) {
					thumbText = thumb.item(0).firstChild.data;
				}
			}
			
			if (path.length) {
				if (path.item(0).firstChild) {
					pathText = path.item(0).firstChild.data;
				}
			}
			
			if (name.length) {
				if (name.item(0).firstChild) {
					nameText = name.item(0).firstChild.data;
				}
			}
			
			gv.images[gv.images.length] = new gv_ImageObject(thumbText, pathText, nameText);
			
			var params = images.item(n).getElementsByTagName('param');
			if (params.length) {
				for (var a=0; a < params.length; a++) {
					var paramName = params.item(a).getAttribute('name');
					var paramText = '';
					if (params.item(a).firstChild)
						paramText = params.item(a).firstChild.data;
					
					gv.images[gv.images.length-1][paramName] = paramText;
				}
			}
		}
			
		if (gv.onrefresh)
			gv.onrefresh(gv);
		
		if (gv.visible) {
			gv.updateImages()
		}
		else {
			gv.Show(false);
		}
	}
	else {
		alert( 'Unsuccessfull XML call.\nMessage: '+ root.getAttribute('error'));
		if (gv.visible) {
			gv.updateImages()
		}
		else {
			gv.Show(false);
		}
		return;
	}
};

/* galleryView.loadError
*  for internal use only
*/
galleryView.prototype.loadError = function(status, gv) {
	gv.images.length = 0;
	
	if (gv.visible) {
		gv.updateRows()
	}
	else {
		gv.Show(false);
	}
};

galleryView.prototype.Show = function(withRefresh) {
	if (withRefresh)
		this.Refresh();
	
	if (!this.div || !document.getElementById(this.div)) {
		alert( 'No HTML Object assigned to galleryView.' );
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
		
	
	
	if (withRefresh) {
		this.visible = false;
		// display loading div
		target.className = target.className + ' galleryViewLoading';
	}
	else {
		var classes = target.className.split(' ');
		if (classes.length > 1 && classes[classes.length-1] == 'galleryViewLoading') {
			target.className = '';
			for (var n=0; n < classes.length-1; n++) {
				target.className += classes[n];
				if (n < classes.length -2)
					target.className += ' ';
			}
		}
		this.visible = true;
		this.updateImages();
		if (this.onshow) 
			this.onshow(this);
	}
	
};

galleryView.prototype.updateImages = function() {
	if (!this.visible || !document.getElementById(this.div)) {
		alert( "Can't update rows on non visible galleryView object.");
		return;
	}
	
	var target = document.getElementById(this.div);
	while (target.firstChild)
		target.removeChild(target.firstChild);
		
	var tmpImg;
	
	for (var n=0; n < this.images.length; n++) {
		tmpImgDiv = document.createElement('div');
		if (this.fixedThumbSize) {
			tmpImgDiv.style.width = this.thumbWidth + 'px';
			tmpImgDiv.style.height = this.thumbHeight + 'px';
			tmpImgDiv.style.overflow = 'hidden';
		}
		
		tmpImg = document.createElement('img');
		tmpImg.onclick = GVE.__selectImage;
		tmpImg.setAttribute('src', this.images[n].thumbnail);
		tmpImgDiv.appendChild(tmpImg);
		
		if (this.showNames && this.images[n].name) {
			tmpP = document.createElement('p');
			tmpP.appendChild(document.createTextNode(this.images[n].name));
			tmpImgDiv.appendChild(tmpP);
		}
		
		if (this.selectedImage == n)
			tmpImgDiv.className = 'gvSelectedImage';
		
		target.appendChild(tmpImgDiv);
	}
	
	if (this.selectedImage >= this.images.length) {
		this.selectedImage = -1;
	}
};

galleryView_engine = function() {
	this.galleryRegisters = Array();
};

galleryView_engine.prototype = {
	__findGalleryView : function (str) {
		for (var n=0; n < GVE.galleryRegisters.length; n++) 
			if (GVE.galleryRegisters[n].div == str) 
				return GVE.galleryRegisters[n].obj;
		
		return false;
	},
	
	__selectImage : function(e) {
		if (!e)
			e = window.event;
		
		var elem = (e.target) ? e.target : e.srcElement;
		
		if (elem.nodeType == 3)
			elem = elem.parentNode;
		
		var target = false;
		var curElem = elem;
		while (curElem.parentNode) {
			target = curElem.parentNode;
			if (target.className == 'galleryView')
				break;
			else
				target = false;
			curElem = curElem.parentNode;
		}
		
		if (!target) {	
			alert('Error: Unable to find container. Make sure it has class attribute set to galleryView');
			return;
		}
		
		var obj = GVE.__findGalleryView(target.id);
		if (!obj) {
			alert( 'Error: galleryView object not found.' );
			return;
		}
		
		if (!obj.enabled) 
			return;
		
		if (obj.onbeforeselect) {
			if (!obj.onbeforeselect())
				return;
		}
		
		var imgs = target.getElementsByTagName('div');
		var imgNdx = -1;
		for (var n=0; n < imgs.length; n++) {
			if (imgs.item(n).firstChild == elem) {
				imgNdx = n;
				break;
			}
		}
		
		if (imgNdx != -1) {	
			if (obj.selectedImage != -1) {
				for (var a=0; a < imgs.length; a++) {
					if (imgs.item(a).className == 'gvSelectedImage') {
						imgs.item(a).className = '';				
						break;
					}
				}
			}
			
			if (obj.selectedImage == imgNdx) {
				obj.selectedImage = -1;
			}
			else {
				obj.selectedImage = imgNdx;
				imgs.item(imgNdx).className = 'gvSelectedImage';
			}
		}
		
		if (obj.onselect)
			obj.onselect(obj);
		
	}
};

GVE = new galleryView_engine();
// JavaScript Document
/* 
*  httpReqiest version 1.0b
*
*  Manages multiple asyncronous xmlHttpRequests easily.
*
* Part of the scriptor javascript modular loader
*/

/* httpRequest
*
*
*/
httpRequest = function(xmlService, method, xmlOnload, xmlOnError, callerObj, requestHeaders) {
	if (typeof(xmlService) != 'string' || xmlService == '') {
		alert('Error: first parameter must be a string.');	
		return false;
	}
		
	this.xmlService = xmlService;
	
	this.method = 'POST';
	if (typeof(method) == 'string')
		this.method = method.toUpperCase() == 'POST' ? 'POST' : 'GET';
	
	this.xmlOnload = null;
	if (typeof(xmlOnload) == 'function') 
		this.xmlOnload = xmlOnload;
	
	this.xmlOnError = null;
	if (typeof(xmlOnError) == 'function')
		this.xmlOnError = xmlOnError;
		
	this.requestHeaders = Array();
	if (requestHeaders) {
		if (requestHeaders.length) {
			for (var n=0; n < requestHeaders.length; n++) {
				if (typeof(requestHeaders[n][0]) == 'string' && typeof(requestHeaders[n][1]) == 'string') {
					this.requestHeaders[this.requestHeaders.length] = [requestHeaders[n][0], requestHeaders[n][1]];
				}
			}
		}
	}
	
	this.callerObj = callerObj;
	this.inRequest = false;
	this.requestNumber = null;
};

/* httpRequest.send
*
*/
httpRequest.prototype.send = function(params) {
	if (this.requestNumber) {
		HTTPE.stack[this.requestNumber].req = null;
		HTTPE.stack[this.requestNumber] = null;
	}
	
	if (!(this.requestNumber = HTTPE.createRequest(this))) {
		alert(this.lang.errors.createRequestError);
		return;
	}
	
	this.inRequest = false;
	
	HTTPE.sendRequest(this.requestNumber, params);
}

/* http_request engine */
http_request_engine = function() {
	this.stack = [null];
};

http_request_engine.prototype = {
	
/* createRequest 
*
*/
createRequest : function(obj) {
	var num = HTTPE.stack.length;
	HTTPE.stack[num] = {req: null, obj: null};
	
	if (window.XMLHttpRequest) {
		HTTPE.stack[num].req = new XMLHttpRequest();
		if (HTTPE.stack[num].req.overrideMimeType) {
			HTTPE.stack[num].req.overrideMimeType('text/xml');
		}
	} else if (window.ActiveXObject) {
		try {
			HTTPE.stack[num].req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				HTTPE.stack[num].req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		}
	}
	
	if (HTTPE.stack[num].req) {
		HTTPE.stack[num].obj = obj;
		return num;
	}
	else {
		return null;
	}
},

/* sendRequest
*
*/
sendRequest : function(num, params) {
	var obj = HTTPE.stack[num].obj;
	var req = HTTPE.stack[num].req;
	
	req.open( obj.method, obj.xmlService, true );
	if (obj.method == 'POST')
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.onreadystatechange = HTTPE.handleRequest;
	req.send('httpRequestId='+num+'&'+params);
	
	obj.inRequest = true;
},

/* handleRequest 
*
*/
handleRequest : function() {
	for (var n=1; n < HTTPE.stack.length; n++) {
		if (HTTPE.stack[n]) {
			if (HTTPE.stack[n].req && HTTPE.stack[n].obj) {
				var req = HTTPE.stack[n].req;
				var obj = HTTPE.stack[n].obj;
				if (req.readyState == 4 && obj.inRequest) {
					obj.inRequest = false;
					if (req.status == 200) {
						if (obj.xmlOnload)
							obj.xmlOnload(req.responseXML, obj.callerObj);
					}
					else {
						alert(obj.lang.errors.requestHandleError + ' (' + req.status + ')');
						if (obj.xmlOnError)
							obj.xmlOnError(req.satus, obj.callerObj);
					}
				}
			}
		}
	}
}

};

HTTPE = new http_request_engine();// JavaScript Document
/*
* httpRequest language pack Spanish
*/

httpRequest.prototype.lang = {
	errors : { createRequestError : 'Error creando objeto Ajax!',
		requestHandleError : 'Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde.' }
};/* JavaScript Document
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
	if ((typeof(ulDiv) != 'string' && ulDiv.parentNode === undefined) || ulDiv == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	if ((typeof(tabsDiv) != 'string' && tabsDiv.parentNode === undefined) || tabsDiv == '') {
		Scriptor.error.report('Error: second parameter bus be a non empty string or a html object.');
		return;
	}
	
	this.ulElem = typeof(ulDiv) == 'string' ? document.getElementById(ulDiv) : ulDiv;
	this.tabsElem = typeof(tabsElem) == 'string' ? document.getElementById(tabsElem) : ulDiv;;
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
			if (typeof(tabs[n].label) != 'string' || (typeof(tabs[n].elem) != 'string' && tabs[n].elem.parentNode === undefined)) {
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
	this.selectTab = function(tabNdx) {
		if (!this.visible)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		if (tabNdx >= 0 && tabNdx < this.tabs.length) {
			var tabElems = this.ulElem.getElementsByTagName('li');
			
			tabElems.item(this.selectedTab).className = 'tabViewLi';
			this.tabs[this.selectedTab].divElem.style.display = 'none';
			
			tabElems.item(tabNdx).className = 'tabViewLiSelected';
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
		if (!this.ulElem)
			this.ulElem = document.getElementById(this.ulId);
		if (!this.tabsElem)
			this.tabsElem = document.getElementById(this.tabsId);
		
		if (!this.ulElem) {
			Scriptor.error.report('Error: UL does not exist.');
			return;
		}
		
		if (!this.tabsElem) {
			Scriptor.error.report('Error: HTMLContainer does not exist');
			return;
		}
		
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
			if (!document.getElementById(this.tabs[n].divStr)) {
				Scriptor.error.report('Error: Tab panel div does not exist.');
				return;
			}
			
			if (!tabs[n].divElem)
				this.tabs[n].divElem = document.getElementById(this.tabs[n].divStr);
			
			if (n != this.selectedTab)
				this.tabs[n].divElem.style.display = 'none';
		}
		
		this.visible = true;
	};
	
	
};
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
	return Scriptor;
})(window, document);