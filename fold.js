"use strict";

const touchEnabled = "ontouchstart" in document.documentElement;


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
		this.accordion = accordion;
		this.el        = el;
		this.heading   = el.firstElementChild;
		this.content   = el.lastElementChild;
		
		this.heading.addEventListener(touchEnabled ? "touchend" : "click", e => {
			if(e.type !== "touchend" || e.cancelable){
				this.open = !this.open;
				e.preventDefault();
			}
			return false;
		});
	}
	
	
	fit(){
		if(!this.open){
			this.height = this.headingHeight;
		}
		
		else{
			this.height = this.headingHeight + this.contentHeight;
		}
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
			this.accordion.update();
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
		if(undefined === this._height)
			return (this._height = this.headingHeight + this.contentHeight)
		return this._height;
	}
	
	set height(input){
		if((input = +input) !== this._height){
			this.el.style.height  = input + "px"
			this._height          = input;
		}
	}
	
	
	/**
	 * Return the height of the Fold's heading element.
	 *
	 * @return {Number}
	 */
	get headingHeight(){
		
		/** Heading height's not been calculated yet */
		if(undefined === this._headingHeight){
			let box    = this.heading.getBoundingClientRect();
			let height = box.bottom - box.top;
			return (this._headingHeight = height);
		}
		
		return this._headingHeight;
	}
	
	/**
	 * Set the height of the Fold's heading.
	 *
	 * Typically only ever called when headings break onto new lines due to screen resize.
	 *
	 * @param {Number} input
	 */
	set headingHeight(input){
		if((input = +input) !== this._headingHeight){
			this.heading.style.height  = input + "px";
			this._headingHeight        = input;
		}
	}
	
	
	/**
	 * Return the height of the Fold's collapsible content area.
	 *
	 * @return {Number}
	 */
	get contentHeight(){
		
		/** Internal height hasn't been calculated yet */
		if(undefined === this._contentHeight){
			let box    = this.content.getBoundingClientRect();
			let height = box.bottom - box.top;
			return (this._contentHeight = height);
		}
		
		return this._contentHeight;
	}
	
	
	/**
	 * Set the height of the Fold's collapsible content region.
	 *
	 * This will be called often when folds are toggled.
	 *
	 * @param {Number} input
	 */
	set contentHeight(input){
		if((input = +input) !== this._contentHeight){
			this.content.style.height  = input + "px";
			this._contentHeight        = input;
		}
	}
}
