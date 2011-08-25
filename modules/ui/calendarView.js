/* JavaScript Document
*
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
*  advanced: read only. True if calendar is in advanced selection mode.
*
*  curMonth: read only, an integer representing the current month to display (zero based).
*  curYear: read only, an integer representing the current year to display.
*  
*  disabledBefore : if present, all dates before but not including this date will be disabled
*  disabledAfter : if present, all dates after but not including this date will be disabled
*  disabledDays : (array) set all dates of the given day index (sun=0) to true to disable
*  disabledDates : an array of date elements pointing to disabled dates.
*  markedDates : an array of marked dates. Usefull to display busy days.
*
*  onselect: event handler. Will be executed after a click on a date and before anthing
*   is done to the object. You can cancel date selection by setting e.returnValue to false on that function.
*
*
*/
Scriptor.CalendarView = function(opts) {
	var curDate = new Date();
	
	var localOpts = {
		canHaveChildren : true,
		hasInvalidator : true,
		multiselect : false,
		month : curDate.getMonth(),
		year : curDate.getFullYear(),
		disabledBefore : null,
		disabledAfter : null,
		disabledDays : [false, false, false, false, false, false, false],
		disabledDates : []
	};
	
	Scriptor.mixin(localOpts, opts);
	
	var cmp = Component.get(localOpts);
	for (var prop in cmp)
	{
		this[prop] = cmp[prop];
	}
	this.CMP_SIGNATURE = "Scriptor.ui.CalendarView";
	
	this.selectedDates = [];
	this.multiSelect = localOpts.multiselect;
	this.advanced = false;
	
	this.curMonth = (!isNaN(Number(localOpts.month)) && localOpts.month >= 0 && localOpts.month < 12) ? localOpts.month : curDate.getMonth();
	this.curYear = (!isNaN(Number(localOpts.year)) && localOpts.year > 0) ? localOpts.year : new curDate.getFullYear();
	
	this.disabledBefore  = localOpts.disabledBefore;
	this.disabledAfter = localOpts.disabledAfter;
	this.disabledDays = localOpts.disabledDays;
	this.disabledDates = localOpts.disabledDates;
	this.markedDates = [];
	
	this.hookedTo = null;
	
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
	
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.create();
	Scriptor.className.add(this.cmpTarget, "calendarView");
	
	// component template 
	this.renderTemplate();
	this.canHaveChildren = false;
	
	this._registeredEvents = [];
	this.DOMAddedImplementation = function() {
		this.updateDates();
		
		// advanced view event handlers
		this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId+'_advancedAccept'), 'onclick', Scriptor.bindAsEventListener(this.selectAdvanced, this)));
		this._registeredEvents.push(Scriptor.event.attach(document.getElementById(this.divId+'_advancedCancel'), 'onclick', Scriptor.bindAsEventListener(this.cancelAdvanced, this)));
	};
	
	this.DOMRemovedImplementation = function() {
		while (this._registeredEvents.length)
			Scriptor.event.detach(this._registeredEvents.pop());
		
	};
};

Scriptor.CalendarView.prototype.renderTemplate = function () {	
	// Create table header
	var cTemplate = '<div class="calendarViewWrapper"><div class="calendarViewHeader" id="' + this.divId + '_header"></div>';
	
	// Create body
	cTemplate += '<table border="0" cellpadding="0" cellspacing="0" class="calendarViewBody" id="' + this.divId + '_body"></table>';
	
	// create advanced dialog
	cTemplate += '<div class="calendarViewAdvanced" style="display: none;" id="'+this.divId+'_advanced">';
	var targetDate = new Date();
	if (this.selectedDates.length)
		targetDate = this.selectedDates[0];
	
	// day selector
	cTemplate += '<p><label for="'+this.divId+'DaySelector">'+this.lang.day+'</label>';
	cTemplate += '<input type="text" id="'+this.divId+'DaySelector" value="'+targetDate.getDate()+'" /></p>';
	
	// month selector
	cTemplate += '<p><label for="'+this.divId+'MonthSelector">'+this.lang.month+'</label>';
	cTemplate += '<select id="'+this.divId+'MonthSelector">';
	for (var n=0; n < 12; n++) 
		cTemplate += '<option value="'+n+'"' + (targetDate.getMonth() == n ? ' selected="selected"' : '') + '>'+this.lang.longMonths[n]+'</option>';	
	cTemplate += '</select></p>';
	
	// year selector
	cTemplate += '<p><label for="'+this.divId+'YearSelector">'+this.lang.year+'</label>';
	cTemplate += '<input type="text" id="'+this.divId+'YearSelector" value="'+targetDate.getFullYear()+'" /></p>';
	
	// buttons
	cTemplate += '<p><a class="calendarAccept" id="'+this.divId+'_advancedAccept">'+this.lang.accept+'</a>';
	cTemplate += '<a class="calendarCancel" id="'+this.divId+'_advancedCancel">'+this.lang.cancel+'</a></p>';
	
	cTemplate += '</div>';
	
	// Create footer
	cTemplate += '<div class="calendarViewFooter" id="' + this.divId + '_footer"></div></div>';
	
	this.cmpTarget.innerHTML = cTemplate;
	
};


/*
*  calendarView.updateDates()
*   When [calendarView.visible = true] which is a result of calling calendarView.Show(), 
*   you can then call calendarView.updateDates() directly to update row information only 
*   without spending additional resources on the calendarView frame rendering.
*/
Scriptor.CalendarView.prototype.updateDates = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update data on non visible calendarView object.");
		return;
	}
	
	var targetTable = document.getElementById(this.divId+'_body');
	targetTable.style.display = '';
	document.getElementById(this.divId+'_advanced').style.display = 'none';
	this.advanced = false;
	
	targetTable.innerHTML = '';		
	
	// using DOM functions here to overcome possible IE bugs when rendering large tables through innerHTML
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
		tmpA.setAttribute('href', '#');
		tmpA.appendChild(document.createTextNode(curMonth.getDate()));
		
		// detect today
		var isToday = false;
		if (this.isEqual(curMonth, today)) {
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
			if (this.isEqual(curMonth, this.markedDates[n])) {
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
			if (this.isEqual(curMonth, this.selectedDates[n])) {
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
		tmpTr.appendChild(tmpTd);
		Scriptor.event.attach(tmpA, 'onclick', Scriptor.bind(this.selectDate, this, curMonth.getDate()));
		
		curMonth.setDate(curMonth.getDate()+1);
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
Scriptor.CalendarView.prototype.__refreshHeader = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.divId+'_header');
	targetDiv.innerHTML = '';
		
	var hTemplate = '<ul><li class="calendarViewLeft"><a class="calendarViewPrev" title="'+this.lang.prevMonth+'" id="'+this.divId+'_prevMonth" href="#"> </a></li>';
	hTemplate += '<li class="calendarViewLeft"><a class="calendarAdvanced" title="'+this.lang.advanced+'" id="'+this.divId+'_viewAdvanced" href="#"> </a></li>';
	hTemplate += '<li class="calendarViewRight"><a class="calendarViewNext" title="'+this.lang.nextMonth+'" id="'+this.divId+'_nextMonth" href="#"> </a></li>';
	hTemplate += '<li><p class="calendarViewMonth">'+this.lang.longMonths[this.curMonth] + ' ' + this.curYear+'</p></li>';
	hTemplate += '</ul>';
	
	targetDiv.innerHTML = hTemplate;
	
	Scriptor.event.attach(document.getElementById(this.divId+'_prevMonth'), 'onclick', Scriptor.bind(this.goPrevMonth, this));
	Scriptor.event.attach(document.getElementById(this.divId+'_viewAdvanced'), 'onclick', Scriptor.bind(this.setAdvanced, this));
	Scriptor.event.attach(document.getElementById(this.divId+'_nextMonth'), 'onclick', Scriptor.bind(this.goNextMonth, this));
};

/*
* calendarView.__refreshFooter()
*   Internal function. Refreshes the footer area.
*/
Scriptor.CalendarView.prototype.__refreshFooter = function() {
	if (!this.inDOM) {
		Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
		return;
	}
	
	var targetDiv = document.getElementById(this.divId+'_footer');
	targetDiv.innerHTML = '';
	
	var fTemplate = '<p><a class="calendarGoHome" title="'+this.lang.homeDate+'" href="#" id="'+this.divId+'_goHome"> </a>';
	
	if (this.selectedDates.length) {
		if (this.selectedDates.length == 1) { // single selection
			var text = this.lang.oneSelection;
			text += this.lang.shortDays[this.selectedDates[0].getDay()];
			text += ' ' + this.selectedDates[0].getDate() + ' ';
			text += this.lang.shortMonths[this.selectedDates[0].getMonth()];
			
			fTemplate += text;
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
			fTemplate += text;
		}
	}
	else {		// noselection
		fTemplate += this.lang.noSelection + '</p>'
	}
	
	targetDiv.innerHTML = fTemplate;
	Scriptor.event.attach(document.getElementById(this.divId+'_goHome'), 'onclick', Scriptor.bind(this.goHomeDate, this));
};

/*
* calendarView.setAdvanced()
*   Internal function. Goes to advanced mode in which user will select a date using
*   a form. Usefull to select distanct dates.
*/
Scriptor.CalendarView.prototype.setAdvanced = function(e) {
	if (!e) e = window.event;
	
	document.getElementById(this.divId+'_body').style.display = 'none';
	document.getElementById(this.divId+'_advanced').style.display = 'block';
	
	var targetDate = new Date();
	if (this.selectedDates.length)
		targetDate = this.selectedDates[0];
	
	document.getElementById(this.divId + 'DaySelector').value = targetDate.getDate();
	document.getElementById(this.divId + 'MonthSelector').selectedIndex = targetDate.getMonth();
	document.getElementById(this.divId + 'YearSelector').value = targetDate.getFullYear();
	
	this.advanced = true;
	
	Scriptor.event.cancel(e);
	return false;
};

/*
* calendarView.cancelAdvanced()
*  This function will return to normal mode, canceling advanced selection in calendar instance
*/
Scriptor.CalendarView.prototype.cancelAdvanced = function () {
	document.getElementById(this.divId+'_body').style.display = '';
	document.getElementById(this.divId+'_advanced').style.display = 'none';
	
	this.advanced = false;
};

/*
* selectAdvanced()
*  This function checks and selects the date entered in advanced mode
*/
Scriptor.CalendarView.prototype.selectAdvanced = function(e) {
	if (!e) e = window.event;
	
	var dayNum = document.getElementById(this.divId + 'DaySelector').value;
	var monthNum = document.getElementById(this.divId + 'MonthSelector').value;
	var yearNum = document.getElementById(this.divId + 'YearSelector').value;
	
	if (isNaN(Number(dayNum))) {
		alert(this.lang.error1);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	if (isNaN(Number(yearNum))) {
		alert(this.lang.error2);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var targetDate = new Date(yearNum, monthNum, dayNum);
	if (targetDate.getMonth() != monthNum) {
		alert(this.lang.error1);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	if (this.isDisabledDate(targetDate)) {
		alert(this.lang.error3);
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	var fakeE = { selecting : targetDate, selectedDates : this.selectedDates };
	fakeE = Scriptor.event.fire(this, 'onselect', fakeE);
	if (fakeE.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	this.selectedDates.length = 0;
	this.selectedDates[0] = targetDate;
	this.goHomeDate(e);
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* selectDate()
*  This function executes when clicking on a calendarView date and selects that date
*/
Scriptor.CalendarView.prototype.selectDate = function(e, date) {
	if (!e) e = window.event;
	
	var targetDate = new Date(this.curYear, this.curMonth, date);
	var fakeE = { selecting : targetDate, selectedDates : this.selectedDates };
	fakeE = Scriptor.event.fire(this, 'onselect', fakeE);
	if (fakeE.returnValue == false)
	{
		Scriptor.event.cancel(e, true);
		return false;
	}
	
	if (!this.isDisabledDate(targetDate)) {
		if (!this.multiSelect) {
			this.selectedDates.length = 0;
			this.selectedDates[0] = targetDate;
		}
		else {
			Scriptor.error.report('Error: multiselect function not implemented.');
			Scriptor.event.cancel(e, true);
			return false;
		}
		this.updateDates();
	}
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* calendarView.isDisabledDate(date)
*   This function will return true if the provided date object is within the range of
*   disabled dates configured in the calendarView.
*/
Scriptor.CalendarView.prototype.isDisabledDate = function(date) {
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
	
	if (this.disabledDays[date.getDay()]) {
		return true;
	}
	
	for (var n=0; n < this.disabledDates.length; n++) {
		if (this.isEqual(date, this.disabledDates[n])) {
			return true;
		}
	}
	
	return false;
};

Scriptor.CalendarView.prototype.isEqual = function (date1, date2) {
	if (date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()) {
		return true;
	}
	else {
		return false;
	}
};

/*
* goPrevMonth()
*  To go to a previous month
*/
Scriptor.CalendarView.prototype.goPrevMonth = function (e) {
	if (!e) e = window.event;
	
	this.curMonth--;
	if (this.curMonth < 0) {
		this.curMonth = 11;
		this.curYear--;
	}
	
	this.updateDates();
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* goNextMonth()
*  To go to the next month
*/
Scriptor.CalendarView.prototype.goNextMonth = function (e) {
	if (!e) e = window.event;
		
	this.curMonth++;
	if (this.curMonth > 11) {
		this.curMonth = 0;
		this.curYear++;
	}
	
	this.updateDates();
	
	Scriptor.event.cancel(e, true);
	return false;
};

/*
* goHomeDate()
*  Will make selection visible, or will show current date
*/
Scriptor.CalendarView.prototype.goHomeDate = function (e) {
	if (!e) e = window.event;
		
	var showingDate;
	if (this.selectedDates.length) {
		showingDate = this.selectedDates[0];
	}
	else {
		showingDate = new Date();
	}
	
	this.curMonth = showingDate.getMonth();
	this.curYear = showingDate.getFullYear();
	this.updateDates();
	
	Scriptor.event.cancel(e, true);
	return false;
};


/*
* Hooks this calendarView instance to a text input to select a date
*/
Scriptor.CalendarView.prototype.hook = function(elementId) {
	var elem = null;
	
	if (typeof(elementId) == 'string')
		elem = document.getElementById(elementId);
	else if (Scriptor.isHTMLElement(elementId))
		elem = elementId;

	if (elem) {
		this.hookedTo = elem;
		
		calElem = document.getElementById(this.div);
		Scriptor.event.attach(elem, 'onfocus', Scriptor.bind(this.showHooked, this));
		calElem.style.display = 'none';
		calElem.style.position = 'absolute';
		
		//this.Show();
		Scriptor.event.attach(this, 'onselect', Scriptor.bind(this.assignToHooked, this));
		//this.onselect = CaViE.assignToHooked;
	}
};

/*
* shows a hooked calendar to input text
*/
Scriptor.CalendarView.prototype.showHooked = function(e) {
	if (!e) e = window.event;
	
	var elem = this.hookedTo;
	
	var date = this.getDateFromStr(elem.value);
			
	this.curMonth = date.getMonth();
	this.curYear = date.getFullYear();
	this.selectedDates.length = 0
	this.selectedDates[0] = date;
			
	this.Show();
	
	if (this._hideHookedBind)
		Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
		
	Scriptor.event.attach(document, 'onclick', this._hideHookedBind = Scriptor.bind(this.hideHooked, this));
	
	this.divElem.style.display = 'block';
	this.divElem.zIndex = '1000';
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
	
	this.y = y;
	this.x = x;
	this.updateSize();
	
};

/*
* to hide the showing floating calendars
*/
Scriptor.CalendarView.prototype.hideHooked = function(e) {
	if (!e) e = window.event;
	
	this.hide();
	
	if (this._hideHookedBind)
		Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
	
};

/*
* Assign selected value in a calendarView to hooked input
*  Formatting depends on lang.isFrenchDateFormat
*/
Scriptor.CalendarView.prototype.assignToHooked = function() {
	
	var date = this.selectedDates[0];
	var input = this.hookedTo;
	
	if (this.lang.isFrenchDateFormat)
	{
		// dd/mm/yyyy
		input.value =  date.getDate() + '/' + (date.getMonth() +1) + '/' + date.getFullYear();
	}
	else
	{
		// mm/dd/yyyy
		input.value =  (date.getMonth() +1) + '/' + date.getDate() + '/' + date.getFullYear();
	}
	
	this.Hide();
	if (this._hideHookedBind)
		Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
};

/*
* gets date from str.
*/
Scriptor.CalendarView.prototype.getDateFromStr = function(str) {
	var dateCmps = str.split('/');
	
	// dd/mm/yyyy
	var ret;
	if (!isNaN(Number(dateCmps[0])) && !isNaN(Number(dateCmps[1])) && !isNaN(Number(dateCmps[2]))) {
		if (this.lang.isFrenchDateFormat)
		{
			if (dateCmps[1] > 0 && dateCmps[1] < 13 && dateCmps[0] > 0 && dateCmps[0] < 32 && dateCmps[2] > 0) {
				ret = new Date(dateCmps[2], dateCmps[1]-1, dateCmps[0], 0, 0, 0);
			}
			else {
				ret = new Date();
			}
		}
		else
		{
			if (dateCmps[0] > 0 && dateCmps[0] < 13 && dateCmps[1] > 0 && dateCmps[1] < 32 && dateCmps[2] > 0) {
				ret = new Date(dateCmps[2], dateCmps[1]-1, dateCmps[0], 0, 0, 0);
			}
			else {
				ret = new Date();
			}
		}
	}
	else {
		ret = new Date();
	}
	
	return ret;
};
