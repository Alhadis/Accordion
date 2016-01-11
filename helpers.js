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



/**
 * Run a callback once an image's dimensions are accessible.
 *
 * The function will also be executed if an image fails to load, and should
 * serve as no indicator of the image's actual loading status. Note that IE
 * doesn't fire this event if the user cancels the loading of a webpage
 * before an image has a chance to begin loading.
 *
 * @param {HTMLImageElement} img - Image element to monitor
 * @param {Function} fn - Callback to execute
 */
function onSizeKnown(img, fn){
	
	/** Huzzah, nothing to do here! Everybody go home early! */
	if((isReady = function(){ return img.complete || img.naturalWidth || img.naturalHeight })()){
		fn.call(null, img); return;
	}
	
	var isReady;
	var eventTypes = ["abort", "error", "load"];
	var check   = function(e){(isReady() || (e && e.type === "error")) && done()};
	var done    = function(){
		clearInterval(intervalID);
		for(i = 0; i < 3; ++i) img.removeEventListener(eventTypes[i], check);
		fn.call(null, img);
	}
	
	var intervalID = setInterval(check, 20), i;
	for(i = 0; i < 3; ++i) img.addEventListener(eventTypes[i], check)
}
