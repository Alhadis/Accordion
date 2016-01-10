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
		this.index       = folds.push(this) - 1;
		
		this.accordion   = accordion;
		this.el          = el;
		this.heading     = el.firstElementChild;
		this.content     = el.lastElementChild;
		el.accordionFold = this;
		
		this.heading.addEventListener(touchEnabled ? "touchend" : "click", e => {
			if(e.type !== "touchend" || e.cancelable){
				this.open = !this.open;
				e.preventDefault();
			}
			return false;
		});
	}
	
	
	fit(){
		let height = this.heading.scrollHeight;
		if(this.open)
			height += this.content.scrollHeight;
		this.height = height;
	}
	
	
	
	get open(){
		if(undefined === this._open)
			return (this._open = this.el.classList.contains("open"));
		return this._open;
	}
	
	set open(input){
		if((input = !!input) !== this._open){
			this.el.classList.toggle("open", input);
			this._open = input;
			
			/** If this fold was closed when the screen resized, run a full update in case its contents were juggled around */
			if(this.needsRefresh){
				delete this.needsRefresh;
				this.accordion.updateWidth();
			}
			else this.accordion.update();
		}
	}
	
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
	 * Height of the Fold's outermost container.
	 *
	 * @return {Number}
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
}
