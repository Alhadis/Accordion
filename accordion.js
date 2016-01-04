(function(){
	"use strict";


	var accordions    = [];
	var each          = [].forEach;
	var touchEnabled  = "ontouchstart" in document.documentElement;
	var UNDEF;


	/**
	 * Class that represents a single segment in an Accordion object's content.
	 *
	 * @param {HTMLElement} el                   - Outermost element containing both heading and collapsible content.
	 * @param {Object}      options              - Auxiliary hash of options.
	 * @param {String}      options.openClass    - Name of CSS class controlling each fold's visible "open" state 
	 * @param {String}      options.heading      - Selector string for the fold's heading element.
	 * @param {String}      options.content      - Selector string for fold's child element holding togglable content.
	 * @param {Boolean}     options.disableAria  - Disable the addition and management of ARIA attributes.
	 * @param {Boolean}     options.disableKeys  - Disable keyboard navigation
	 */
	function Fold(el, options){
		var THIS        = this;
		var options     = options || {};
		var openClass   = options.openClass || "open";
		var onToggle    = options.onToggle;
		var aria        = !options.disableAria;
		var useKeyNav   = !options.disableKeys;
		var classList   = el.classList;
		
		var open        = classList.contains(openClass);
		var heading     = options.heading ? el.querySelector(options.heading) : el.firstElementChild;
		var content     = options.content ? el.querySelector(options.content) : el.lastElementChild;
		var prevHeight;
		var randomID;

		
		/**
		 * Update the heights of the fold's heading/body and return the total of each.
		 *
		 * @param {Number} y - Offset to apply to the fold's node, supplied by the containing accordion.
		 * @return {Number}
		 */
		function update(offset){
			var headingBoundingBox  = heading.getBoundingClientRect();
			var headingHeight       = Math.round(headingBoundingBox.bottom - headingBoundingBox.top);
			var headingHeightPx     = headingHeight + "px";
			var contentHeight       = content.scrollHeight;
			var totalHeight         = contentHeight + headingHeight;
			
			heading.style.height    = headingHeightPx;
			el.style.top            = offset ? offset+"px" : "";
			
			/** Update ARIA states */
			if(aria){
				heading.setAttribute("aria-selected", open);
				heading.setAttribute("aria-expanded", open);
				content.setAttribute("aria-hidden",  !open);
			}
			
			/** Update tabindex */
			useKeyNav && content.setAttribute("tabindex", open? 0 : -1);
			
			/** If opened, set the fold's height to fit both heading *and* content. */
			if(open){
				THIS.height = totalHeight;
				return totalHeight;
			}

			/** Otherwise, just cut it off at the heading. */
			else{
				THIS.height = headingHeight;
				return headingHeight;
			}
		};
		

		/** Define getter/setter pairs */
		Object.defineProperties(THIS, {
			
			/** Whether the fold's currently opened */
			open: {
				get: function(){ return open },
				set: function(i){
					if((i = !!i) !== open){
						open = i;
						classList.toggle(openClass, i);
						if(onToggle) onToggle(THIS);
					}
				}
			},
			
			
			/** Height of the fold's container (which encloses both heading and content) */
			height: {
				get: function(){
					
					/** If we haven't calculated the height yet, do so now */
					if(undefined === prevHeight){
						console.info(heading.textContent + ": Calculating height for the first time");
						var box    = el.getBoundingClientRect();
						prevHeight = box.bottom - box.top;
					}
					
					return prevHeight;
				},
				
				set: function(i){
					el.style.height = i + "px";
					prevHeight = i;
					console.log("[%s] Height set: %s", heading.textContent, prevHeight);
				}
			}
		});
		
		
		heading.addEventListener(touchEnabled ? "touchend" : "click", function(e){
			
			/** Prevent TouchEvents triggering a change if the user's still scrolling */
			if(e.type !== "touchend" || e.cancelable){
				THIS.open = !THIS.open;
				e.preventDefault();
			}
			
			return false;
		});
		
		
		/** Keystroke handlers */
		useKeyNav && heading.addEventListener("keydown", function(e){
			var fold, key;
			switch(key = e.keyCode){
				
				/** Enter */
				case 13:{
					THIS.open = !THIS.open;
					break;
				}
				
				/** Up/down arrows: Move between sections */
				case 38:
				case 40:{
					if(fold = (38 === key ? THIS.previousFold : THIS.nextFold)){
						fold.heading.focus();
						e.preventDefault();
						return false;
					}
					break;
				}
				
				/** Left arrow: Close section */
				case 37:{
					
					/** Section must be open first */
					if(open){
						classList.remove(openClass);
						THIS.open = false;
					}
					
					break;
				}
				
				/** Right arrow: Open section */
				case 39:{
					if(!open){
						classList.add(openClass);
						THIS.open = true;
					}
					break;
				}
				
				/** Escape */
				case 27:{
					this.blur();
					break;
				}
			}
		});
		
		
		/** Configure ARIA attributes */
		if(aria){
			
			/** Set the IDs of the heading/content elements if they're blank */
			if(!heading.id && !content.id){
				randomID   = uniqueID("a");
				heading.id = randomID + "-heading";
				content.id = randomID + "-content";
			}
			
			else if(!heading.id) heading.id = content.id + "-heading";
			else if(!content.id) content.id = heading.id + "-content";
			
			/** Set ARIA roles */
			heading.setAttribute("role", "tab");
			content.setAttribute("role", "tabpanel");
			heading.setAttribute("aria-controls",   content.id);
			content.setAttribute("aria-labelledby", heading.id);
		}
		
		/** Set heading's tabindex unless keyboard navigation's disabled */
		useKeyNav && heading.setAttribute("tabindex", 0);
		
		
		/** Expose some properties/methods for external use */
		this.update  = update;
		this.heading = heading;
		this.content = content;
		this.el      = el;
	};



	/**
	 * Accordion class.
	 *
	 * @param {HTMLElement} el                   - Container holding each togglable fold of content.
	 * @param {Object}      options              - Auxiliary hash of options.
	 * @param {Boolean}     options.animHeight   - Animate container height during transition. Potentially jolty.
	 * @param {String}      options.animClass    - Name of CSS class determining animated height. Default: "anim-height"
	 * @param {Boolean}     options.autoResize   - Automatically resize folds when viewport dimensions change. Default: true
	 * @param {Boolean}     options.disableAria  - Disable the addition and management of ARIA attributes.
	 * @param {Boolean}     options.disableKeys  - Disable keyboard navigation
	 * @param {Function}    options.onToggle     - Callback triggered when a fold is toggled
	 */
	function Accordion(el, options){
		var THIS        = this;
		var folds       = [];
		var classList   = el.classList;
		var options     = options || {};
		var animClass   = options.animClass || "anim-height";
		var initialised;

		/** If animHeight's not been explicitly passed, derive it from the presence/absence of el's .anim-height class */
		var animHeight  = options.animHeight;
		animHeight      = UNDEF === animHeight ? classList.contains(animClass) : animHeight;
		
		
		/** Check if we're dynamically setting animHeight based on whether adjacent elements are being shoved into/out of sight */
		if("auto" === animHeight){
			var shouldRemoveAnim;
			var autoAnimate = true;
			animHeight      = true;
			
			/** Listener to remove animClass once accordion's bottom edge is out-of-sight */
			el.addEventListener(transitionEnd, function(e){
				if(shouldRemoveAnim && "height" === e.propertyName && e.target === el){
					classList.remove(animClass);
					shouldRemoveAnim = false;
				}
			});
		}
		

		/** Check if autoResize hasn't been explicitly disabled (it's on by default) */
		var autoResize  = options.autoResize;
		autoResize      = UNDEF === autoResize ? true : autoResize;

		/** Internal use */
		var children    = el.children;
		var prevHeight  = 0;
		
		
		/** Clone a copy of the options hash to pass to Fold instances */
		var foldOptions = (function(source, accordion){
			var result    = {};
			
			for(var i in source)
				result[i] = source[i];
			
			/** Callback triggered when folds are opened/closed */
			var onToggle    = source.onToggle;
			result.onToggle = function(fold){
				var height  = fold.height;
				update();
				
				var diff    = fold.height - height;
				var nextAcc = THIS;
				console.log("Diff: %s", diff);
				
				while(nextAcc.parentFold){
					nextAcc.parentFold.height += diff;
					nextAcc.parent.update(nextAcc.parentFold);
					nextAcc = nextAcc.parent;
				}
				
				/** Run any specified callbacks */
				onToggle && onToggle(fold, accordion);
			};
		
			return result;
		}(options, THIS));



		/** Method to update the accordion's heights on resize */
		function update(exclude){
			
			for(var totalHeight = 0, parent, i = 0, l = folds.length; i < l; ++i){
				totalHeight += exclude === folds[i]
					? folds[i].height
					: folds[i].update(totalHeight);
			}
			
			/** Check if the visibility of surrounding content will be affected by the accordion's new state */
			if(autoAnimate && initialised){
				var boundingBox = el.getBoundingClientRect();
				THIS.animHeight = boundingBox.bottom + (totalHeight - (boundingBox.bottom - boundingBox.top)) < window.innerHeight;
			}

			/** If we're not animating heights, add a CSS class to keep items visible during transitions. */
			!animHeight && classList.toggle("shrinking", totalHeight < prevHeight);
			
			el.style.height = totalHeight + "px";
			prevHeight      = totalHeight;
			
			return totalHeight;
		}
		
		
		/**
		 * Identify the instance's containing accordion, if one exists.
		 *
		 * @return {Accordion}
		 */
		function findParent(){
			var parent = el, i, f, a, l = accordions.length;
			
			/** Run through the element's ancestry */
			while(parent && (parent = parent.parentNode)){

				/** Loop through all existing accordions, and check if their elements match */
				for(i = 0; i < l; ++i){
					a = accordions[i];
					if(parent === a.el){
						a.childAccordions.push(THIS);
						
						/** Figure out which of the parent's folds contains this accordion */
						for(i = 0, l = a.folds.length; i < l; ++i){
							f = a.folds[i];
							if(f === el || f.content.contains(el)){
								THIS.parentFold = f;
								break;
							}
						}
						
						THIS.parent = a;
						return a;
					}
				}
			}
			
			return null;
		}
		
		
		/**
		 * Store on each fold a link to its adjacent siblings.
		 *
		 * If the Accordion's contents have been modified, this function should be called
		 * to maintain correct tabbing order for keyboard navigation.
		 */
		function reindex(){
			for(var i = 0, l = folds.length; i < l; ++i){
				folds[i].previousFold = folds[i - 1] || null;
				folds[i].nextFold     = folds[i + 1] || null;
			}
		}


		/** Iterator variables */
		var i = 0;
		var l = children.length;
		
		
		/** Connect the accordion with any containing accordions, if any */
		var childAccordions = [];
		findParent();
		
		
		/** Set the container's ARIA role */
		options.disableAria || el.setAttribute("role", "tablist");
		
		
		/** Loop through the accordion's immediate descendants and initialise a new fold for each one */
		for(; i < l; ++i) folds.push(new Fold(children[i], foldOptions));


		/** Update the accordion's heights if any images have loaded. */
		each.call(el.querySelectorAll("img"), function(img){
			img.addEventListener("load", update);
		});


		/** Configure any options passed in. */
		classList.toggle(animClass, animHeight);
		autoResize && window.addEventListener("resize", update);


		/** Expose some methods/properties for external use. */
		Object.defineProperties(THIS, {
			
			/** Methods */
			update:           {value: update},
			redinex:          {value: reindex},
			findParent:       {value: findParent},
			
			/** Read-only properties */
			folds:            {value: folds},
			el:               {value: el},
			childAccordions:  {value: childAccordions},
			
			
			/** Get/set whether animated heights are enabled */
			animHeight: {
				get: function(){ return animHeight },
				set: function(i){
					if((i = !!i) !== animHeight){
						animHeight = i;
						
						if(i) classList.add(animClass);
						
						/** Wait until the transition's finished before disabling animated height */
						else shouldRemoveAnim = true;
					}
				}
			}
		});
		
		
		
		/** Get this happening. */
		accordions.push(THIS);
		reindex();
		update();
		initialised = true;
	};
	
	
	/**
	 * Force all Accordion instances to recalculate their parent accordions.
	 *
	 * This method should ONLY be called if an instance has been moved from one
	 * accordion's descendants and into another.
	 */
	Accordion.resetRelationships = function(){
		for(var a, i = 0, l = accordions.length; i < l; ++i){
			a = accordions[i];
			a.childAccordions.length = 0;
			a.parent = a.findParent();
		}
	};



	var IDs     = {};
	var indexes = {};
	
	
	/**
	 * Generate a unique ID for a DOM element.
	 *
	 * By default, minimalist IDs like "_1" or "_2" are generated using internally
	 * tracked incrementation. Uglier, more collision-proof IDs can be generated by
	 * passing a truthy value to the function's first argument.
	 *
	 * Irrespective of whether values are being generated simply or randomly, the
	 * document tree is always consulted first to ensure a duplicate ID is never
	 * returned.
	 *
	 * @param {String}  prefix - Prefix prepended to result. Default: "_"
	 * @param {Boolean} random - Generate collision-proof IDs using random symbols
	 * @param {Number}  length - Length of random passwords. Default: 6
	 * @return {String}
	 */
	function uniqueID(prefix, complex, length){
		length     = +(length || 6);
		var result =  (prefix = prefix || "_");
		
		/** Simple IDs */
		if(!complex){
			
			/** Set this prefix's starting index if it's not been used yet */
			if(!indexes[prefix])
				indexes[prefix] = 0;
			
			result += ++indexes[prefix];
		}
		
		/** Uglier/safer IDs */
		else{
			var chars   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			chars      += chars.toLowerCase();
			result     += chars[ Math.round(Math.random() * (chars.length - 1)) ];
			chars      += "0123456789";
			
			while(result.length < length)
				result += chars[ Math.round(Math.random() * (chars.length - 1))];
		}
		
		return IDs[result] || document.getElementById(result)
			? uniqueID(prefix, complex)
			: (IDs[result] = true, result);
	}


	/** Name of the onTransitionEnd event supported by this browser. */
	var transitionEnd = (function(o){
		for(var names = "transitionend webkitTransitionEnd oTransitionEnd otransitionend".split(" "), i = 0; i < 4; ++i)
			if("on"+names[i].toLowerCase() in window) return names[i];
		return names[0];
	}());
	
	
	/** If IE8PP exists, it means the author wants/needs IE8 support. See also: tinyurl.com/fixIE8-9 */
	if("function" === typeof IE8PP)
		Accordion = IE8PP(Accordion),
		Fold      = IE8PP(Fold);


	/** Export */
	window.Accordion = Accordion;
	
	Object.defineProperty(window, "Accordions", {
		get: function(){ return accordions }
	})
}());
