(function(){
	"use strict";


	var each	=	Array.prototype.forEach,

		/**
		 * Class that represents a single segment in an Accordion object's content.
		 *
		 * @param {HTMLElement} el - Outermost element containing both heading and collapsible content.
		 * @param {Object} options - Auxiliary hash of options.
		 * @param {String} options.openClass - Name of CSS class controlling each fold's visible "open" state 
		 * @param {String} options.heading - Selector string for the fold's heading element.
		 * @param {String} options.content - Selector string for fold's child element holding togglable content.
		 */
		Fold	=	function(el, options){
			var options		=	options || {},
				openClass	=	options.openClass || "open",
				onToggle	=	options.onToggle,

				open		=	el.classList.contains(openClass),
				heading		=	options.heading ? el.querySelector(options.heading) : el.firstElementChild,
				content		=	options.content ? el.querySelector(options.content) : el.lastElementChild,
				

				/**
				 * Updates the heights of the fold's heading/body and returns the total of each.
				 *
				 * @param {Number} y - Offset to apply to the fold's node, supplied by the containing accordion.
				 * @return {Number}
				 */
				update	=	function(offset){
					var headingHeight		=	heading.scrollHeight,
						headingHeightPx		=	headingHeight + "px",

						contentHeight		=	content.scrollHeight,
						totalHeight			=	contentHeight + headingHeight;

					heading.style.height	=	headingHeightPx;
					el.style.top			=	offset ? offset+"px" : "";

					/** If opened, set the fold's height to fit both heading *and* content. */
					if(open){
						el.style.height	=	totalHeight + "px";
						return el.scrollHeight;
					}

					/** Otherwise, just cut it off at the heading. */
					else{
						el.style.height	=	headingHeightPx;
						return headingHeight;
					}
				};

				heading.addEventListener("click", function(){
					open	=	el.classList.toggle(openClass);
					if(onToggle) onToggle();
				});

				this.update	=	update;
		},



		Accordion	=	function(el){
			var	folds		=	[],
				children	=	el.children,
				
				/** Method for updating the accordion's heights on resize */
				update	=	function(){
					for(var totalHeight = 0, i = 0, l = folds.length; i < l; ++i)
						totalHeight += folds[i].update(totalHeight);

					el.style.height	=	totalHeight + "px";
					return totalHeight;
				},

				/** Iterator variables */
				i	=	0,
				l	=	children.length;


			/** Loop through the accordion's immediate descendants and initialise a new fold for each one */
			for(; i < l; ++i) folds.push(new Fold(children[i], {
				onToggle:	update
			}));


			/** Update the accordion's heights if any images have loaded. */
			each.call(el.querySelectorAll("img"), function(img){
				img.addEventListener("load", update);
			});


			/** Expose some methods/properties for external use. */
			this.update	=	update;
			this.folds	=	folds;

			/** Get this happening. */
			update();
		};


	/** Export */
	window.Accordion	=	Accordion;
}());