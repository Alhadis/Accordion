#!/usr/bin/env node --es_staging
"use strict";


const STDIN = process.stdin;

let output  = "";
STDIN.setEncoding("utf8");
STDIN.on("readable", () => {
	let chunk = STDIN.read();
	if(null !== chunk) scaffold(chunk);
})



function scaffold(data){
	let counters = {top: 0};
	
	let tree = tokeniseOutline(data, i => {
		let parent = i.parent;
		
		if(!parent) i.title = bijectiveBase26(++counters.top)
		
		else{
			counters[parent.title] = counters[parent.title] || 0;
			i.title = parent.title + "." + (++counters[parent.title]);
		}
		
		i.toString = function(){
			let open    = this.name === "+";
			let depth   = Math.min(6, this.level + 1);
			let subacc  = !this.children ? ""
				: ('<ul class="accordion">' + this.children.map(o => o + "").join("\n") + "</ul>");
			
			return `<li${open ? ' class="open"' : ""}>
				<h${depth}>${this.title}</h${depth}>
				<div class="fold">
					<p>%LIPSUM%</p>
					${subacc}
				</div>
			</li>`;
		};
	});
	
	console.log(`<ul class="accordion">` + tree.join("\n") + "</ul>");
}


/**
 * Convert an integer to bijective hexavigesimal notation (alphabetic base-26).
 *
 * @param {Number} int - A positive integer above zero
 * @return {String} The number's value expressed in uppercased bijective base-26
 */
function bijectiveBase26(int){
	const sequence    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const length      = sequence.length;
	
	if(int <= 0)      return int;
	if(int <= length) return sequence[int - 1];
	
	
	let index  = (int % length) || length;
	let result = [sequence[index - 1]];
	
	while((int = Math.floor((int - 1) / length)) > 0){
		index = (int % length) || length;
		result.push(sequence[index - 1]);
	}
	
	return result.reverse().join("")
}


/**
 * Generate a generic AST based on line indentation.
 *
 * The returned array is populated with objects, which are in turn enumerated with
 * 1-2 properties: "name" (holding the line's textual content, sans whitespace),
 * and "children" (an array of child objects holding the same data).
 *
 * The parent/child relationships are described by their leading indentation.
 *
 * NOTE: Only proper indentation is considered (hard tabs). "Soft tabs" will NOT work.
 *
 * @param {String}
 * @return {Array}
 */
function tokeniseOutline(str, cb){
	
	/** Drop leading and trailing blank lines */
	str = str.replace(/^([\x20\t]*\n)*|(\n\s*)*$/g, "");
	
	/** Define how many leading tabs to ignore based on the first line's indentation */
	let indent = str.match(/^[\t\x20]+(?=\S)/);
	if(indent)
		str = str.replace(new RegExp("^"+indent[0], "gm"), "");
	
	
	/** Start going through lines */
	let lines        = str.split(/\n+/g);
	let results      = [];
	let currentLevel = 0;
	let previousItem;
	
	for(let l of lines){
		let level = l.match(/^\t*/)[0].length;
		let name  = l.replace(/^\t+/, "");
		let item  = {
			level:  level,
			name:   name,
			toJSON: function(){
				let result = Object.assign({}, this);
				delete result.parent;
				return result;
			}
		};
		

		/** Indenting */
		if(level > currentLevel){
			item.parent = previousItem;
			(previousItem.children = previousItem.children || []).push(item);
			currentLevel = level;
		}
		
		/** Outdenting */
		else if(level < currentLevel){
			while(previousItem){
				if(previousItem.level <= level){
					currentLevel = previousItem.level;
					previousItem.parent
						? previousItem.parent.children.push(item)
						: results.push(item);
					item.parent = previousItem.parent;
					break;
				}
				previousItem = previousItem.parent;
			}
		}
		
		
		/** New sibling */
		else{
			if(level){
				previousItem = previousItem.parent;
				previousItem.children.push(item)
				item.parent = previousItem;
			}
			else results.push(item)
		}
		
		previousItem = item;
		cb && cb.call(null, item);
	}
	
	return results;
}
