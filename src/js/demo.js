var each	=	Array.prototype.forEach;

var accordions	=	[];
each.call(document.querySelectorAll(".accordion"), function(el){
	accordions.push(new Accordion(el));
});

window.addEventListener("resize", function(e){
	for(var i = 0, l = accordions.length; i < l; ++i){
		accordions[i].update();
	}
}.debounce(100));