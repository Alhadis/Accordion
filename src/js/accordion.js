(function(){
	"use strict";


	var each          = Array.prototype.forEach,
		touchEnabled  = "ontouchstart" in document.documentElement,
		undef,


		/**
		 * Class that represents a single segment in an Accordion object's content.
		 *
		 * @param {HTMLElement} el - Outermost element containing both heading and collapsible content.
		 * @param {Object} options - Auxiliary hash of options.
		 * @param {String} options.openClass - Name of CSS class controlling each fold's visible "open" state 
		 * @param {String} options.heading - Selector string for the fold's heading element.
		 * @param {String} options.content - Selector string for fold's child element holding togglable content.
		 */
		Fold = function(el, options){
			var options     = options || {},
				openClass   = options.openClass || "open",
				onToggle    = options.onToggle,

				open        = el.classList.contains(openClass),
				heading     = options.heading ? el.querySelector(options.heading) : el.firstElementChild,
				content     = options.content ? el.querySelector(options.content) : el.lastElementChild,


				/**
				 * Updates the heights of the fold's heading/body and returns the total of each.
				 *
				 * @param {Number} y - Offset to apply to the fold's node, supplied by the containing accordion.
				 * @return {Number}
				 */
				update = function(offset){
					var headingHeight       = heading.scrollHeight,
						headingHeightPx     = headingHeight + "px",

						contentHeight       = content.scrollHeight,
						totalHeight         = contentHeight + headingHeight;

					heading.style.height    = headingHeightPx;
					el.style.top            = offset ? offset+"px" : "";

					/** If opened, set the fold's height to fit both heading *and* content. */
					if(open){
						el.style.height = totalHeight + "px";
						return el.scrollHeight;
					}

					/** Otherwise, just cut it off at the heading. */
					else{
						el.style.height = headingHeightPx;
						return headingHeight;
					}
				};

				heading.addEventListener(touchEnabled ? "touchend" : "click", function(e){
					open = el.classList.toggle(openClass);
					if(onToggle) onToggle();
					e.preventDefault();
					return false;
				});

				this.update = update;
		},



		/**
		 * Accordion class.
		 *
		 * @param {HTMLElement} el - Container holding each togglable fold of content.
		 * @param {Object} options - Auxiliary hash of options.
		 * @param {Boolean} options.animHeight - Animate container height during transition. Potentially jolty.
		 * @param {String} options.animClass - Name of CSS class determining animated height. Default: "anim-height"
		 */
		Accordion = function(el, options){
			var folds       = [],
				options     = options || {},
				animClass   = options.animClass || "anim-height",

				/** If animHeight's not been explicitly passed, derive it from the presence/absence of el's .anim-height class */
				animHeight  = options.animHeight,
				animHeight  = undef === animHeight ? el.classList.contains(animClass) : animHeight,


				/** Internal use */
				children    = el.children,
				prevHeight  = 0,


				/** Method for updating the accordion's heights on resize */
				update      = function(){
					for(var totalHeight = 0, i = 0, l = folds.length; i < l; ++i)
						totalHeight += folds[i].update(totalHeight);

					/** If we're not animating heights, add a CSS class to keep items visible during transitions. */
					if(!animHeight && el.classList.toggle("shrinking", totalHeight < prevHeight)){
						console.log("Height difference: " + (prevHeight - totalHeight));
					}

					el.style.height = totalHeight + "px";
					prevHeight      = totalHeight;
					return totalHeight;
				},


				/** Iterator variables */
				i = 0,
				l = children.length;


			/** Loop through the accordion's immediate descendants and initialise a new fold for each one */
			for(; i < l; ++i) folds.push(new Fold(children[i], {
				onToggle: update
			}));


			/** Update the accordion's heights if any images have loaded. */
			each.call(el.querySelectorAll("img"), function(img){
				img.addEventListener("load", update);
			});


			/** Configure any options passed in. */
			el.classList.toggle(animClass, animHeight);


			/** Expose some methods/properties for external use. */
			this.update = update;
			this.folds  = folds;

			/** Get this happening. */
			update();
		};


	/** Export */
	window.Accordion = Accordion;
}());
