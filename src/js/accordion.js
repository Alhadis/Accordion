(function(){
	"use strict";


	var each          = Array.prototype.forEach;
	var touchEnabled  = "ontouchstart" in document.documentElement;
	var UNDEF;


	/**
	 * Class that represents a single segment in an Accordion object's content.
	 *
	 * @param {HTMLElement} el                 - Outermost element containing both heading and collapsible content.
	 * @param {Object}      options            - Auxiliary hash of options.
	 * @param {String}      options.openClass  - Name of CSS class controlling each fold's visible "open" state 
	 * @param {String}      options.heading    - Selector string for the fold's heading element.
	 * @param {String}      options.content    - Selector string for fold's child element holding togglable content.
	 */
	function Fold(el, options){
		var options     = options || {};
		var openClass   = options.openClass || "open";
		var onToggle    = options.onToggle;

		var open        = el.classList.contains(openClass);
		var heading     = options.heading ? el.querySelector(options.heading) : el.firstElementChild;
		var content     = options.content ? el.querySelector(options.content) : el.lastElementChild;


		/**
		 * Update the heights of the fold's heading/body and returns the total of each.
		 *
		 * @param {Number} y - Offset to apply to the fold's node, supplied by the containing accordion.
		 * @return {Number}
		 */
		function update(offset){
			var headingHeight       = heading.scrollHeight;
			var headingHeightPx     = headingHeight + "px";
			var contentHeight       = content.scrollHeight;
			var totalHeight         = contentHeight + headingHeight;
			
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
	};



	/**
	 * Accordion class.
	 *
	 * @param {HTMLElement} el                 - Container holding each togglable fold of content.
	 * @param {Object}      options            - Auxiliary hash of options.
	 * @param {Boolean}     options.animHeight - Animate container height during transition. Potentially jolty.
	 * @param {String}      options.animClass  - Name of CSS class determining animated height. Default: "anim-height"
	 */
	function Accordion(el, options){
		var folds       = [];
		var options     = options || {};
		var animClass   = options.animClass || "anim-height";

		/** If animHeight's not been explicitly passed, derive it from the presence/absence of el's .anim-height class */
		var animHeight  = options.animHeight;
		var animHeight  = UNDEF === animHeight ? el.classList.contains(animClass) : animHeight;

		/** Internal use */
		var children    = el.children;
		var prevHeight  = 0;


		/** Method to update the accordion's heights on resize */
		function update(){
			for(var totalHeight = 0, i = 0, l = folds.length; i < l; ++i)
				totalHeight += folds[i].update(totalHeight);

			/** If we're not animating heights, add a CSS class to keep items visible during transitions. */
			if(!animHeight && el.classList.toggle("shrinking", totalHeight < prevHeight)){
				console.log("Height difference: " + (prevHeight - totalHeight));
			}
			
			el.style.height = totalHeight + "px";
			prevHeight      = totalHeight;
			return totalHeight;
		}


		/** Iterator variables */
		var i = 0;
		var l = children.length;
		
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
