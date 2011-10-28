
var _effectsLastId = 0;	
var _effectGenerateId = function() {
	return 'q' + (_effectsLastId++);
};

var requestAnimFrame = (window.requestAnimationFrame    || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	null);

Scriptor.effects = {
	effectsQueue : {},
	lastId : 0,
	intervalId : null,
	started : false,
	
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
			if (requestAnimFrame)
				requestAnimFrame(this.loop);
			else
				this.intervalId = setInterval(this.loop, 10);
				
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
		
		if (effectInstance)
		{
			effectInstance.started = false;
			for (var n=0; n < effectInstance.property.length; n++)
			{
				var prop = effectInstance.property[n];
				if (prop.substr(0,6) == 'style.')
				{
					effectInstance.elem.style[prop.substr(6)] = effectInstance.end[n] + effectInstance.unit[n];
				}
				else
				{
					if (typeof(effectInstance.setAttribute) == 'function')
						effectInstance.elem.setAttribute(prop, effectInstance.end[n] + effectInstance.unit[n]);
					else
						effectInstance.elem[prop] = effectInstance.end[n] + effectInstance.unit[n];							
				}
			}
			
			if (typeof(effectInstance.callback) == 'function') {
				this.callBackAndDestroy(fId);
			}
			else {
				delete this.effectsQueue[fId];
				this.checkInterval();
			}
		}
	},
	
	callBackAndDestroy : function(fId) {
		if (this.effectsQueue[fId]) {
			this.effectsQueue[fId].callback();
			delete this.effectsQueue[fId];
			this.checkInterval();
		}
	},
	
	loop : function() {
		var curTime = new Date().getTime();
		
		for (var fId in Scriptor.effects.effectsQueue)
		{
			var effectInstance = Scriptor.effects.effectsQueue[fId];
			
			if (effectInstance.started)
			{
				if (effectInstance.startTime == null)
					effectInstance.startTime = curTime;
				
				if ((effectInstance.startTime + effectInstance.duration) <= curTime)
				{
					Scriptor.effects.cancel(fId);
				}
				else
				{
					var curPercentile = (curTime - effectInstance.startTime) / effectInstance.duration;
					
					for (var n=0; n < effectInstance.property.length; n++)
					{
						var curPos = effectInstance.start[n] + ((effectInstance.end[n] - effectInstance.start[n]) * curPercentile);
						
						var prop = effectInstance.property[n];
						if (prop.substr(0,6) == 'style.')
						{
							effectInstance.elem.style[prop.substr(6)] = curPos + effectInstance.unit[n];
						}
						else
						{
							if (typeof(effectInstance.setAttribute) == 'function')
								effectInstance.elem.setAttribute(prop, curPos + effectInstance.unit[n]);
							else
								effectInstance.elem[prop] = curPos + effectInstance.unit[n];							
						}
					}
					
					if (typeof(effectInstance.step) == 'function')
					{
						effectInstance.step(curTime);
					}
				}
			}
		}
		
		Scriptor.effects.checkGoOn();
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
				if (requestAnimFrame)
					requestAnimFrame(this.loop);
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
			step : null,
			//system
			started : false,
			startTime : null
		};
	}
};
