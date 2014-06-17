// Basic cookie handling system
Scriptor.cookie = {
		cookies : {},
		initialized: false,
	
		init : function() {
			if (!Scriptor.cookie.initialized)
			{
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++)
				{
					var c = ca[i];
					while (c.charAt(0)==' ')
						c = c.substring(1,c.length);
						
					var nameEQ = c.substring(0, c.indexOf('='));
					this.cookies[nameEQ] = c.substring(nameEQ.length+1,c.length);
				}
			}
		},
		
		get : function(name)
		{
			return this.cookies[name] ? this.cookies[name] : '';
		},
		
		create : function(name,value,days,path)
		{
			if (path === undefined)
				path = '/';

			if (days)
			{
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path="+path;
			
			this.cookies[name] = value;
		},
	
		erase : function(name)
		{
			this.create(name,"",-1);
			delete this.cookies[name];
		}
	};

Scriptor.cookie.init();
