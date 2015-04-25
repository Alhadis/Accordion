Function.prototype.debounce	=	function(limit, soon){
	var fn		=	this,
		limit	=	limit < 0 ? 0 : limit,
		started, context, args, timer,


		delayed	=	function(){

			/** Get the time between now and when the function was first fired. */
			var timeSince	=	Date.now() - started;

			if(timeSince >= limit){
				if(!soon) fn.apply(context, args);
				if(timer) clearTimeout(timer);
				timer = context = args	=	null;
			}

			else timer = setTimeout(delayed, limit - timeSince);
		};


	/** Debounced copy of the original function. */
	return function(){
		context		=	this,
		args		=	arguments;

		if(!limit)
			return fn.apply(context, args);

		started	=	Date.now();
		if(!timer){
			if(soon) fn.apply(context, args);
			timer	=	setTimeout(delayed, limit);
		}
	};
};