"use strict";

const touchEnabled = "ontouchstart" in document.documentElement;


/** Name of the onTransitionEnd event supported by this browser. */
const transitionEnd = (function(){
	for(var names = "transitionend webkitTransitionEnd oTransitionEnd otransitionend".split(" "), i = 0; i < 4; ++i)
		if("on"+names[i].toLowerCase() in window) return names[i];
	return names[0];
}());



/**
 * Stop a function from firing too quickly.
 *
 * Returns a copy of the original function that runs only after the designated
 * number of milliseconds have elapsed. Useful for throttling onResize handlers.
 *
 * @param {Number} limit - Threshold to stall execution by, in milliseconds.
 * @param {Boolean} soon - If TRUE, will call the function *before* the threshold's elapsed, rather than after.
 * @return {Function}
 */
function debounce(fn, limit, soon){
	var limit = limit < 0 ? 0 : limit,
		started, context, args, timer,

		delayed = function(){

			/** Get the time between now and when the function was first fired. */
			var timeSince = Date.now() - started;

			if(timeSince >= limit){
				if(!soon) fn.apply(context, args);
				if(timer) clearTimeout(timer);
				timer = context = args = null;
			}

			else timer = setTimeout(delayed, limit - timeSince);
		};


	/** Debounced copy of the original function. */
	return function(){
		context = this,
		args    = arguments;

		if(!limit)
			return fn.apply(context, args);

		started = Date.now();
		if(!timer){
			if(soon) fn.apply(context, args);
			timer = setTimeout(delayed, limit);
		}
	};
};
