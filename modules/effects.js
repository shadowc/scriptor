
var _effectsLastId = 0;	
var _effectGenerateId = function() {
	return 'q' + (_effectsLastId++);
};

Scriptor.effects = {
	effectsQueue : {},
	lastId : 0,
	intervalId : null,
	started : false,
	
	requestAnimFrame : (/*window.requestAnimationFrame    || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     || */
					null),
	
	scheduleEffect : function(opts) {
		var queueId = _effectGenerateId();
		this.effectsQueue[queueId] = this._getEffectInstance();
		
		// merge defined properties with effect
		Scriptor.mixin(this.effectsQueue[queueId], opts);
		
		return queueId;
	},
	
	startAll : function() {
		for (var fId in this.effectsQueue) 
			this.effectsQueue[fId].started = true;
			
		if (!this.started)
		{
			if (this.requestAnimFrame)
				this.requestAnimFrame(Scriptor.bind(this.loop, this));
			else
				this.intervalId = setInterval(Scriptor.bind(this.loop, this), 10);
				
			this.started = true;
		}
	},
	
	start : function(fId) {
		if (this.effectsQueue[fId])
			this.effectsQueue[fId].started = true;
			
		if (!this.started)
		{
			if (this.requestAnimFrame)
				this.requestAnimFrame(Scriptor.bind(this.loop, this));
			else
				this.intervalId = setInterval(Scriptor.bind(this.loop, this), 10);
				
			this.started = true;
		}
	},
	
	stop : function(fId) {
		if (this.effectsQueue[fId])
			this.effectsQueue[fId].started = false;
		
		this.checkInterval();
	},
	
	stopAll : function() {
		for (var fId in this.effectsQueue) 
			this.effectsQueue[fId].started = false;
		
		this.checkInterval();
	},
	
	cancelAll : function() {
		for (var fId in this.effectsQueue) 
			this.cancel(fId);
		
		this.checkInterval();
	},
	
	cancel : function(fId) {
		var effectInstance = this.effectsQueue[fId];
		for (var n=0; n < effectInstance.property.length; n++) 
			effectInstance.elem.style[effectInstance.property[n]] = effectInstance.end[n] + effectInstance.unit[n];
		
		if (typeof(effectInstance.callback) == 'function') {
			setTimeout(jsOs.bind(this.callBackAndDestroy, this, fId), 10);
		}
		else {
			delete this.effectsQueue[fId];
			this.checkInterval();
		}
	},
	
	callBackAndDestroy : function(fId) {
		if (this.effectsQueue[fId]) {
			this.effectsQueue[fId].callback();
			delete this.effectsQueue[fId];
			this.checkInterval();
		}
	},
	
	loop : function(curTime) {
		if (typeof(curTime) == 'undefined')
			curTime = new Date().getTime();
		
		for (var fId in this.effectsQueue) {
			var effectInstance = this.effectsQueue[fId];
			
			if (effectInstance.started) {
				if (effectInstance.startTime == null)
					effectInstance.startTime = curTime;
					
				if ((effectInstance.startTime + effectInstance.duration) <= curTime) {
					this.cancel(fId);
				}
				else {
					var curPercentile = (curTime - effectInstance.startTime) / effectInstance.duration;
					
					for (var n=0; n < effectInstance.property.length; n++) {
						var curPos = effectInstance.start[n] + ((effectInstance.end[n] - effectInstance.start[n]) * curPercentile);
						
						effectInstance.elem.style[effectInstance.property[n]] = curPos + effectInstance.unit[n];
					}
				}
			}
		}
		
		this.checkGoOn();
	},
	
	checkInterval : function() {
		var loops = false;
		for (var fId in this.effectsQueue) {
			if (this.effectsQueue[fId].started) {
				loops = true;
				break;
			}
		}
		
		if (!loops && this.started) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.started = false;
		}
	},
	
	checkGoOn : function() {
		if (this.started)
		{
			var loops = false;
			for (var fId in this.effectsQueue) {
				if (this.effectsQueue[fId].started) {
					loops = true;
					break;
				}
			}
			
			if (loops)
			{
				if (this.requestAnimFrame)
					this.requestAnimFrame(Scriptor.bind(this.loop, this));
			}
		}
	},
	
	_getEffectInstance : function() {
		return {
			elem : null,	// Needed!
			property : [],
			start : [],
			end : [],
			unit : [],
			duration : 500,
			callback : null,
			//system
			started : false,
			startTime : null
		};
	}
};
