"use strict";

let folds = [];


/**
 * Represents a single panel of togglable content inside an Accordion.
 *
 * @class
 */
class Fold{
	
	/**
	 * Instantiate a new Fold instance.
	 *
	 * @param {Accordion} accordion
	 * @param {HTMLElement} el
	 * @constructor
	 */
	constructor(accordion, el){
		let heading      = el.firstElementChild;
		let content      = el.lastElementChild;

		this.index       = folds.push(this) - 1;
		this.accordion   = accordion;
		this.el          = el;
		this.heading     = heading;
		this.content     = content;
		this.openClass   = accordion.openClass;
		this.closeClass  = accordion.closeClass;
		el.accordionFold = this.index;
		
		
		
		/** ARIA attributes */
		if(!(this.noAria = accordion.noAria)){
			heading.setAttribute("role", "tab");
			content.setAttribute("role", "tabpanel");
			this.checkIDs();
		}
		
		
		/** Keyboard navigation */
		if(!accordion.noKeys){
			heading.tabIndex = 0;
			heading.addEventListener("keydown", this.onKeyDown = e => {
				const key = e.keyCode;
				let fold;
				
				switch(key){
					
					/** Enter: Toggle */
					case 13: {
						this.open = !this.open;
						break;
					}
					
					/** Escape: Clear focus */
					case 27:{
						e.target.blur();
						break;
					}
					
					
					/** Up arrow: Previous section */
					case 38:{
						
						/** Is there a previous sibling to navigate up to? */
						if(fold = this.previousFold){
							let children = fold.childAccordions;
							
							/** Is it open, and does it have nested accordions? */
							if(fold.open && children){
								let lastAcc;
								let lastFold;
								
								/** Locate the deepest/nearest accordion that's currently exposed */
								while(children){
									lastAcc  = children[children.length - 1];
									lastFold = lastAcc.folds[lastAcc.folds.length - 1];
									if(!lastFold.open) break;
									children = lastFold.childAccordions;
								}
								
								lastFold.heading.focus();
							}
							
							/** Nope */
							else fold.heading.focus();
						}
						
						/** Is there a higher level we can jump back up to? */
						else if(this.accordion.parent)
							this.accordion.parentFold.heading.focus();
						
						/** There's nothing to move back to, so just let the browser run its usual behaviour */
						else return true;
						
						e.preventDefault();
						return false;
						break;
					}
					
					
					
					/** Down arrow: Next section */
					case 40:{
						const children = this.childAccordions;
						
						/** Is there a nested accordion to jump into? */
						if(this.open && children)
							children[0].folds[0].heading.focus();
						
						/** No, there isn't. Is there another sibling to move down to? */
						else if(fold = this.nextFold)
							fold.heading.focus();
						
						/** Is there a containing accordion we can navigate back up to? */
						else if(this.accordion.parent){
							let parent = this;
							while(parent = parent.accordion.parentFold)
								if(fold = parent.nextFold){
									fold.heading.focus();
									break;
								}
							
							/** Nowhere left to go... */
							if(!parent) return true;
						}
						
						/** Nah. Just scroll the window normally, as per browser default */
						else return true;
						
						e.preventDefault();
						return false;
						break;
					}
					
					
					/** Left arrow */
					case 37:{
						
						/** Close an opened section */
						if(this.open) this.open = false;
						
						/** Switch focus back to parent */
						else if(this.accordion.parent)
							this.accordion.parentFold.heading.focus();
						
						break;
					}
					
					/** Right arrow */
					case 39:{
						
						/** Open a closed section */
						if(!this.open) this.open = true;
						
						/** Switch focus to a nested accordion */
						else if(this.childAccordions)
							this.childAccordions[0].folds[0].heading.focus();
						
						break;
					}
				}
			});
		}
		
		
		heading.addEventListener(touchEnabled ? "touchend" : "click", this.onPress = e => {
			if(e.type !== "touchend" || e.cancelable){
				this.open = !this.open;
				e.preventDefault();
			}
			return false;
		});
	}
	
	
	
	/**
	 * Ensure the fold's elements have unique ID attributes.
	 *
	 * If no ID attributes are present, or they conflict with another DOM element's
	 * identifier, new IDs are generated for each element (randomly if needed).
	 *
	 * Internal-use only, called from instance's constructor.
	 *
	 * @private
	 */
	checkIDs(){
		const headingSuffix = "-heading";
		const contentSuffix = "-content";
		let elID            = this.el.id;
		let heading         = this.heading;
		let content         = this.content;
		let id;
		
		/** Neither of the fold's elements have an ID attribute */
		if(!heading.id && !content.id){
			id             = elID || uniqueID("a");
			heading.id     = id + headingSuffix;
			content.id     = id + contentSuffix;
		}
		
		/** Either the heading or element lack an ID */
		else if(!content.id) content.id   = (elID || heading.id) + contentSuffix;
		else if(!heading.id) heading.id   = (elID || content.id) + headingSuffix;
		
		/** Finally, double-check each element's ID is really unique */
		const $ = s => document.querySelectorAll("#"+s);
		while($(content.id).length > 1 || $(heading.id).length > 1){
			id         = uniqueID("a");
			content.id = id + contentSuffix;
			heading.id = id + headingSuffix;
		}
		
		/** Update ARIA attributes */
		heading.setAttribute("aria-controls",    content.id);
		content.setAttribute("aria-labelledby",  heading.id);
	}
	
	
	
	/**
	 * Adjust a fold's container to fit its content.
	 */
	fit(){
		let height = this.heading.scrollHeight;
		if(this.open)
			height += this.content.scrollHeight;
		this.height = height;
	}
	
	
	
	/**
	 * Whether or not the fold's currently opened.
	 *
	 * @property
	 * @type {Boolean}
	 */
	get open(){
		
		/** Derive the fold's opened state from the DOM if it's not been determined yet */
		if(undefined === this._open){
			let classes = this.el.classList;
			let open    = classes.contains(this.openClass);
			classes.toggle(this.closeClass, !open);
			return (this._open = open);
		}
		
		return this._open;
	}
	
	set open(input){
		if((input = !!input) !== this._open){
			this.el.classList.toggle(this.openClass,   input);
			this.el.classList.toggle(this.closeClass, !input);
			this._open = input;
			
			/** Update ARIA attributes */
			if(!this.noAria){
				const heading = this.heading;
				heading.setAttribute("aria-selected",      input);
				heading.setAttribute("aria-expanded",      input);
				this.content.setAttribute("aria-hidden",  !input);
			}
			
			
			/** If this fold was closed when the screen resized, run a full update in case its contents were juggled around */
			if(this.needsRefresh){
				delete this.needsRefresh;
				this.accordion.refresh();
			}
			else this.accordion.update();
		}
	}
	
	
	
	/**
	 * Vertical position of the fold within an accordion's container.
	 *
	 * @property
	 * @type {Number}
	 */
	get y(){
		if(undefined === this._y)
			return (this._y = parseInt(this.el.style.top) || 0);
		return this._y;
	}
	
	set y(input){
		if((input = +input) !== this._y){
			this.el.style.top  = input + "px";
			this._y            = input;
		}
	}
	
	
	
	/**
	 * Height of the fold's outermost container.
	 *
	 * @property
	 * @type {Number}
	 */
	get height(){
		if(undefined === this._height){
			let height           = this.heading.scrollHeight + this.content.scrollHeight;
			this.el.style.height = height + "px";
			return (this._height = height);
		}
		return this._height;
	}
	
	set height(input){
		if(input && (input = +input) !== this._height){
			this.el.style.height = input + "px"
			this._height         = input;
		}
	}
	
	
	
	/**
	 * Whether the fold's container has been resized incorrectly.
	 *
	 * @type {Boolean}
	 * @readonly
	 * @property
	 */
	get wrongSize(){
		return this.heading.scrollHeight + this.content.scrollHeight !== this.el.scrollHeight;
	}
}
