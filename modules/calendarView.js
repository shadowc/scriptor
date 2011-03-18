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
*  disabledDays : (array) set all dates of the given day index (sun=0) to true to disable
*  disabledDates : an array of date elements pointing to disabled dates.
*  markedDates : an array of marked dates. Usefull to display busy days.
*
*  onshow: event handler. Will be executed before anything is rendered
*   by the Show method. Usefull for filtering selectable date ranges before showing. 
*   Also by returning false you can cancel Show()
*  onselect: event handler. Will be executed after a click on a date and before anthing
*   is done to the object. You can cancel date selection by setting e.returnValue to false on that function.
*
*  visible: Should be read only. It is set to true when a successfull Show() has been performed.
*  div: string with the id of the object upon which the calendarView will be rendered or the object itself.
*
*/
calendarView = Scriptor.calendarView = function(div, opts) {
	if ((typeof(div) != 'string' && !Scriptor.isHtmlElement(div)) || div == '') {
		Scriptor.error.report('Error: first parameter must be a non empty string or a html object.');
		return;
	}
	
	var localOpts = {
		'multiselect' : false,
		'month' : new Date().getMonth(),
		'year' : new Date().getFullYear()
	}
	Scriptor.mixin(localOpts, opts);
	
	this.selectedDates = [];
	this.multiSelect = localOpts.multiselect;
	this.enabled = true;
	this.advanced = false;
	
	this.curMonth = (!isNaN(Number(localOpts.month)) && localOpts.month >= 0 && localOpts.month < 12) ? localOpts.month : new Date().getMonth();
	this.curYear = (!isNaN(Number(localOpts.year)) && localOpts.year > 0) ? localOpts.year : new Date().getFullYear();
	
	Scriptor.event.init(this);
	Scriptor.event.registerCustomEvent(this, 'onshow');
	Scriptor.event.registerCustomEvent(this, 'onhide');
	Scriptor.event.registerCustomEvent(this, 'onselect');
	
	this.disabledBefore  = null;
	this.disabledAfter = null;
	this.disabledDays = [false, false, false, false, false, false, false];
	this.disabledDates = [];
	this.markedDates = [];

	this.divElem = typeof(div) == 'string' ? document.getElementById(div) : div;
	this.div = typeof(div) == 'string' ? div : this.divElem.id;
	
	this.hookedTo = null;
};

calendarView.prototype = {
	/*
	*  calendarView.Show()
	*   Renders the object inside the object pointed by calendarView.div as its id.
	*   Show() will also call updateDates() so it renders calendarView information too.
	*/
	Show : function() {
		var e = Scriptor.event.fire(this, 'onshow');
		if (!e.returnValue)
			return;
				
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
			Scriptor.error.report('Error: calendarView DIV does not exist.');
			return;
		}
		
		var target = this.divElem;
		target.className = 'calendarView scriptor';
		target.innerHTML = '';
		
		// Create table header
		var cTemplate = '<div class="calendarViewHeader" id="' + this.div + '_header"></div>';
		
		// Create body
		cTemplate += '<table border="0" cellpadding="0" cellspacing="0" class="calendarViewBody" id="' + this.div + '_body"></table>';
		
		// create advanced dialog
		cTemplate += '<div class="calendarViewAdvanced" style="display: none;" id="'+this.div+'_advanced">';
		var targetDate = new Date();
		if (this.selectedDates.length)
			targetDate = this.selectedDates[0];
		
		// day selector
		cTemplate += '<p><label for="'+this.div+'DaySelector">'+this.lang.day+'</label>';
		cTemplate += '<input type="text" id="'+this.div+'DaySelector" value="'+targetDate.getDate()+'" /></p>';
		
		// month selector
		cTemplate += '<p><label for="'+this.div+'MonthSelector">'+this.lang.month+'</label>';
		cTemplate += '<select id="'+this.div+'MonthSelector">';
		for (var n=0; n < 12; n++) 
			cTemplate += '<option value="'+n+'"' + (targetDate.getMonth() == n ? ' selected="selected"' : '') + '>'+this.lang.longMonths[n]+'</option>';	
		cTemplate += '</select></p>';
		
		// year selector
		cTemplate += '<p><label for="'+this.div+'YearSelector">'+this.lang.year+'</label>';
		cTemplate += '<input type="text" id="'+this.div+'YearSelector" value="'+targetDate.getFullYear()+'" /></p>';
		
		// buttons
		cTemplate += '<p><a class="calendarAccept" id="'+this.div+'_advancedAccept">'+this.lang.accept+'</a>';
		cTemplate += '<a class="calendarCancel" id="'+this.div+'_advancedCancel">'+this.lang.cancel+'</a></p>';
		
		cTemplate += '</div>';
		
		// Create footer
		cTemplate += '<div class="calendarViewFooter" id="' + this.div + '_footer"></div>';
		
		target.innerHTML = cTemplate;
		
		// advanced view event handlers
		Scriptor.event.attach(document.getElementById(this.div+'_advancedAccept'), 'onclick', Scriptor.bind(this.selectAdvanced, this));
		Scriptor.event.attach(document.getElementById(this.div+'_advancedCancel'), 'onclick', Scriptor.bind(this.cancelAdvanced, this));
		
		this.visible = true;
		this.updateDates();
	},
	
	Hide : function()
	{
		var e = Scriptor.event.fire(this, 'onhide');
		if (!e.returnValue)
			return;
		
		if (this.divElem)
			this.divElem.style.display = 'none';
			
		this.visible = false;
	},
	
	/*
	*  calendarView.updateDates()
	*   When [calendarView.visible = true] which is a result of calling calendarView.Show(), 
	*   you can then call calendarView.updateDates() directly to update row information only 
	*   without spending additional resources on the calendarView frame rendering.
	*/
	updateDates : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update data on non visible calendarView object.");
			return;
		}
		
		var targetTable = document.getElementById(this.div+'_body');
		targetTable.style.display = '';
		document.getElementById(this.div+'_advanced').style.display = 'none';
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
	},
	
	/*
	* calendarView.__refreshHeader()
	*   Internal function. Refreshes the header area.
	*/
	__refreshHeader : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div+'_header');
		targetDiv.innerHTML = '';
			
		var hTemplate = '<ul><li><a class="calendarViewPrev" title="'+this.lang.prevMonth+'" id="'+this.div+'_prevMonth" href="#"> </a></li>';
		hTemplate += '<li><a class="calendarAdvanced" title="'+this.lang.advanced+'" id="'+this.div+'_viewAdvanced" href="#"> </a></li>';
		hTemplate += '<li><p class="calendarViewMonth">'+this.lang.longMonths[this.curMonth] + ' ' + this.curYear+'</p></li>';
		hTemplate += '<li><a class="calendarViewNext" title="'+this.lang.nextMonth+'" id="'+this.div+'_nextMonth" href="#"> </a></li>';
		
		targetDiv.innerHTML = hTemplate;
		
		Scriptor.event.attach(document.getElementById(this.div+'_prevMonth'), 'onclick', Scriptor.bind(this.goPrevMonth, this));
		Scriptor.event.attach(document.getElementById(this.div+'_viewAdvanced'), 'onclick', Scriptor.bind(this.setAdvanced, this));
		Scriptor.event.attach(document.getElementById(this.div+'_nextMonth'), 'onclick', Scriptor.bind(this.goNextMonth, this));
	},
	
	/*
	* calendarView.__refreshFooter()
	*   Internal function. Refreshes the footer area.
	*/
	__refreshFooter : function() {
		if (!this.visible) {
			Scriptor.error.report( "Can't update calendar on non visible calendarView object.");
			return;
		}
		
		var targetDiv = document.getElementById(this.div+'_footer');
		targetDiv.innerHTML = '';
		
		var fTemplate = '<p><a class="calendarGoHome" title="'+this.lang.homeDate+'" href="#" id="'+this.div+'_goHome"> </a>';
		
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
		Scriptor.event.attach(document.getElementById(this.div+'_goHome'), 'onclick', Scriptor.bind(this.goHomeDate, this));
	},
	
	/*
	* calendarView.setAdvanced()
	*   Internal function. Goes to advanced mode in which user will select a date using
	*   a form. Usefull to select distanct dates.
	*/
	setAdvanced : function(e) {
		if (!e) e = window.event;
		
		document.getElementById(this.div+'_body').style.display = 'none';
		document.getElementById(this.div+'_advanced').style.display = 'block';
		
		var targetDate = new Date();
		if (this.selectedDates.length)
			targetDate = this.selectedDates[0];
		
		document.getElementById(this.div + 'DaySelector').value = targetDate.getDate();
		document.getElementById(this.div + 'MonthSelector').selectedIndex = targetDate.getMonth();
		document.getElementById(this.div + 'YearSelector').value = targetDate.getFullYear();
		
		this.advanced = true;
		
		Scriptor.event.cancel(e);
		return false;
	},
	
	/*
	* calendarView.cancelAdvanced()
	*  This function will return to normal mode, canceling advanced selection in calendar instance
	*/
	cancelAdvanced : function (divId) {
		document.getElementById(this.div+'_body').style.display = '';
		document.getElementById(this.div+'_advanced').style.display = 'none';
		
		this.advanced = false;
	},
	
	/*
	* selectAdvanced()
	*  This function checks and selects the date entered in advanced mode
	*/
	selectAdvanced : function(e) {
		if (!e) e = window.event;
		
		var dayNum = document.getElementById(this.div + 'DaySelector').value;
		var monthNum = document.getElementById(this.div + 'MonthSelector').value;
		var yearNum = document.getElementById(this.div + 'YearSelector').value;
		
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
	},
	
	/*
	* selectDate()
	*  This function executes when clicking on a calendarView date and selects that date
	*/
	selectDate : function(e, date) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
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
	},
	
	/*
	* calendarView.isDisabledDate(date)
	*   This function will return true if the provided date object is within the range of
	*   disabled dates configured in the calendarView.
	*/
	isDisabledDate : function(date) {
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
	},
	
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
	* goPrevMonth()
	*  To go to a previous month
	*/
	goPrevMonth : function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
		
		this.curMonth--;
		if (this.curMonth < 0) {
			this.curMonth = 11;
			this.curYear--;
		}
		
		this.updateDates();
		
		Scriptor.event.cancel(e, true);
		return false;
	},
	
	/*
	* goNextMonth()
	*  To go to the next month
	*/
	goNextMonth : function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
			
		this.curMonth++;
		if (this.curMonth > 11) {
			this.curMonth = 0;
			this.curYear++;
		}
		
		this.updateDates();
		
		Scriptor.event.cancel(e, true);
		return false;
	},
	
	/*
	* goHomeDate()
	*  Will make selection visible, or will show current date
	*/
	goHomeDate : function (e) {
		if (!e) e = window.event;
		
		if (!this.enabled)
		{
			Scriptor.event.cancel(e, true);
			return false;
		}
			
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
	},

	
	/*
	* Hooks this calendarView instance to a text input to select a date
	*/
	hook : function(elementId) {
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
			this.onselect = CaViE.assignToHooked;
		}
	},
	
	/*
	* shows a hooked calendar to input text
	*/
	showHooked : function(e) {
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
			
		Scriptor.event.attach(document, 'onclick', this._hideHooked = Scriptor.bind(this.hideHooked, this));
		
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
		this.divElem.style.left = x + 'px';
		this.divElem.style.top = y + 'px';
		
	},
	
	/*
	* to hide the showing floating calendars
	*/
	hideHooked : function(e) {
		if (!e) e = window.event;
		
		this.Hide();
		if (this._hideHookedBind)
			Scriptor.event.detach(document, 'onclick', this._hideHookedBind);
		
	},

	/*
	* Assign selected value in a calendarView to hooked input
	*  Formatting depends on lang.isFrenchDateFormat
	*/
	assignToHooked : function() {
		
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
	}
};

