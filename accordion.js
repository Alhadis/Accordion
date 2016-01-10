"use strict";

let accordions = [];


/**
 * Represents a column of collapsible content regions.
 */
class Accordion{

	/**
	 * Instantiate a new Accordion instance.
	 *
	 * @param {HTMLElement} el - Container wrapped around each immediate fold
	 * @param {Object} options - Optional hash of settings
	 * @param {String} options.edgeClass - CSS class toggled based on whether the bottom-edge is visible
	 * @param {String} options.snapClass - CSS class for disabling transitions between window resizes
	 * @constructor
	 */
	constructor(el, options){
		this.index = accordions.push(this) - 1;
		
		/** Create a fold for each immediate descendant of the Accordion's container */
		let folds = [];
		for(let i of Array.from(el.children)){
			let fold = new Fold(this, i);
			folds.push(fold);
			
			/** Connect the fold to its previous sibling, if it's not the first to be added */
			let prev = folds[folds.length - 2];
			if(prev){
				prev.nextFold     = fold;
				fold.previousFold = prev;
			}
		}
		
		/** Parse options */
		options        = options || {};
		this.edgeClass = (undefined === options.edgeClass ? "edge-visible" : options.edgeClass);
		this.snapClass = (undefined === options.snapClass ? "snap" : options.snapClass)
		
		
		el.accordion   = this;
		this.el        = el;
		this.folds     = folds;
		this.update();
		
		
		/** Find out if this accordion's nested inside another */
		let next = el;
		while((next = next.parentNode) && 1 === next.nodeType){
			let fold = next.accordionFold;
			if(fold){
				let accordion   = fold.accordion;
				this.parent     = accordion;
				this.parentFold = fold;
				this.edgeClass && el.classList.remove(this.edgeClass);
				(accordion.children = accordion.children || []).push(this);
				while(accordion){
					accordion.update();
					accordion = accordion.parent;
				}
				break;
			}
		}
		
		
		this.edgeClass && this.el.addEventListener(transitionEnd, e => {
			if(!this.parent && e.target === el && "height" === e.propertyName && el.getBoundingClientRect().bottom > window.innerHeight)
				el.classList.remove(this.edgeClass);
		});
	}
	
	
	get height(){
		return this._height;
	}
	set height(input){
		if(input && (input = +input) !== this._height){
			this.el.style.height = input + "px";
			this._height         = input;
		}
	}
	
	
	edgeCheck(offset){
		let edgeClass = this.edgeClass;
		if(edgeClass){
			let box         = this.el.getBoundingClientRect();
			let windowEdge  = window.innerHeight;
			let classes     = this.el.classList;
			
			/** If the bottom-edge is visible (or about to be), enable height animation */
			if(box.bottom + (offset || 0) < windowEdge)
				classes.add(edgeClass)
			
			/** If the bottom-edge isn't visible anyway, disable height animation immediately */
			else if(box.bottom > windowEdge)
				classes.remove(edgeClass);
		}
	}
	
	
	updateFold(fold, offset){
		let next = fold;
		let parentFold = this.parentFold;
		
		while(next = next.nextFold)
			next.y  += offset;
		parentFold || this.edgeCheck(offset);
		fold.height += offset;
		this.height += offset;
		
		parentFold && this.parent.updateFold(parentFold, offset);
	}
	
	
	update(){
		let y = 0;
		let height = 0;
		for(let i of this.folds){
			i.y = y;
			i.fit();
			y      += i.height;
			height += i.height;
		}
		
		let parentFold = this.parentFold;
		let diff       = height - this._height;
		parentFold
			? this.parent.updateFold(parentFold, diff)
			: this.edgeCheck(diff);
		
		this.height = height;
	}
	
	
	updateWidth(){
		let snap = this.snapClass;
		snap && this.el.classList.add(snap);
		
		this.update();
		if(this.children)
			this.children.forEach(a => a.updateWidth())
		
		snap && setTimeout(e => this.el.classList.remove(snap), 20);
	}
}


Accordion.onResize = debounce(function(e){
	
	for(let i of accordions)
		i.parent || i.updateWidth();
	
}, 50);

window.addEventListener("resize", Accordion.onResize);
