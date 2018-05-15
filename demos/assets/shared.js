var acc = [];
window.onload = function(event){
	[].forEach.call(document.querySelectorAll(".accordion"), function(el){
		acc.push(new Accordion(el, window.demoConfig));
	});
};
