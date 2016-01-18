Function.prototype.debounce=function(limit,soon){var fn=this,limit=limit<0?0:limit,started,context,args,timer,delayed=function(){var timeSince=Date.now()-started;if(timeSince>=limit){if(!soon)fn.apply(context,args);if(timer)clearTimeout(timer);timer=context=args=null}else timer=setTimeout(delayed,limit-timeSince)};return function(){context=this,args=arguments;if(!limit)return fn.apply(context,args);started=Date.now();if(!timer){if(soon)fn.apply(context,args);timer=setTimeout(delayed,limit)}}};


var acc = [];
function runDemo(config){
	var each          = Array.prototype.forEach;
	config            = config || {};
	config.autoResize = false;

	each.call(document.querySelectorAll(".accordion"), function(el){
		acc.push(new Accordion(el, config));
	});

	window.addEventListener("resize", function(e){
		for(var i = 0, l = accordions.length; i < l; ++i)
			acc[i].update();
	}.debounce(100));
}
