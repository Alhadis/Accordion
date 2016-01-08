"use strict";


/**
 * Represents a column of collapsible content regions.
 */
class Accordion{

	/**
	 * Instantiate a new Accordion instance.
	 *
	 * @param {HTMLElement} el - Container wrapped around each immediate fold
	 * @constructor
	 */
	constructor(el){
		let folds = [];
		
		for(let i of Array.from(el.children))
			folds.push(new Fold(this, i));
		
		el.accordion = this;
		this.el      = el;
		this.folds   = folds;
		this.update();
		
		/** Find out if this accordion's nested inside another */
		let next = el;
		while((next = next.parentNode) && 1 === next.nodeType){
			let fold = next.accordionFold;
			if(fold){
				this.parent     = fold.accordion;
				this.parentFold = fold;
				this.parent.update();
				break;
			}
		}
		
		/** Temporary shit to remove later */
		window.addEventListener("resize", e => {
			this.update();
		})
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
	
	
	updateFold(fold, offset){
		let node = fold.el;
		while(node = node.nextElementSibling){
			node.accordionFold.y += offset;
		}
		fold.height += offset;
		this.height += offset;
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
		if(parentFold){
			this.parent.updateFold(parentFold, height - this._height)
		}
		
		this.height = height;
	}
}
