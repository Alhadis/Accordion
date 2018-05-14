var acc = [];
document.onload = function(config){
	[].forEach.call(document.querySelectorAll(".accordion"), function(el){
		acc.push(new Accordion(el, config));
	});
};
