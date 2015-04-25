var	each			=	Array.prototype.forEach;



var FixedAccordion	=	function(el){
	var folds		=	[],
		children	=	el.children,

		/** Method that gets triggered on page resize to update heights. */
		update		=	function(){
			var fold, totalHeight, y = 0;

			for(var i = 0, l = folds.length; i < l; ++i){
				fold		=	folds[i];
				totalHeight	=	fold.open ? fold.node.scrollHeight : fold.heading.scrollHeight;
				fold.node.style.top	=	y+"px";
				y	+= totalHeight;
			}
		};

	/** Create a new fold from each immediate descendant of the accordion element. */
	for(var c, h, i = 0, l = children.length; i < l; ++i){
		c	=	children[i];
		h	=	c.querySelector("h3");
		h.addEventListener("click", function(e){
			e.target.parentNode.classList.toggle("open");
		});

		folds.push({
			node:			c,
			open:			c.classList.contains("open"),
			heading:		h,
			content:		c.querySelector(".fold"),
			y:				0
		});
	}

	/** Update heights when images have finished loading. */
	each.call(el.querySelectorAll("img"), function(e){
		e.addEventListener("load", update);
	});

	/** Make the accordion's update method externally accessible. */
	this.update	=	update;
	update();
};


var accordions	=	[];
each.call(document.querySelectorAll(".fixed-accordion"), function(el){
	accordions.push(new FixedAccordion(el));
});

window.addEventListener("resize", function(e){
	for(var i = 0, l = accordions.length; i < l; ++i){
		accordions[i].update();
	}
	console.log("Update")
}.debounce(100, true));