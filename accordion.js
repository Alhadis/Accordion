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
		
		for(let i of Array.from(el.children)){
			folds.push(new Fold(this, i));
		}
		
		this.folds = folds;
		this.update();
		
		window.addEventListener("resize", e => {
			this.update();
		})
	}
	
	
	update(){
		let y = 0;
		for(let i of this.folds){
			i.y = y;
			i.fit();
			y += i.height;
		}
	}
}
