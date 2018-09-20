<!---*-tab-width:4;indent-tabs-mode:t;truncate-lines:t;-*- vim:set ts=4 noet nowrap:--->

Accordion
================================================================

Silky-smooth accordion widgets with no external dependencies.

~~~shell
npm install accordion --save
bower install silk-accordion --save
~~~

An simple interactive demo can be [found here](https://cdn.rawgit.com/Alhadis/Accordion/v3.0.1/demos/basic-large.htm).
More complicated and extreme demos can be found in the [`demos`](./demos/README.md) directory.


Usage
----------------------------------------------------------------

Include the following two files in your project:

	src/accordion.css
	src/accordion.js


Layout your markup like this:

~~~html
<div class="accordion">

	<div>
		<h1> Heading </h1>
		<div> Content </div>
	</div>
	
	<div>
		<h1> Heading </h1>
		<div> Content </div>
	</div>
	
</div>
~~~


Then create an `Accordion` instance with a reference to a DOM element:

~~~js
var el = document.querySelector(".accordion");
new Accordion(el);
~~~


[Options](docs/options.adoc) can be passed in a second argument:

~~~js
new Accordion(el, {
	onToggle: function(fold, isOpen){
		console.log(fold);   // -> Reference to a `Fold` instance
		console.log(isOpen); // -> true / false
	}
});
~~~

### Styling
The base stylesheet is located at `src/accordion.css`.
Embed it into your application's existing styling, tweaking it if desired.

**Note:** This stylesheet only includes properties necessary for the Accordion to function.
Making it look appealing with colours and fonts is left as an exercise to the developer.
Check the source of the [bundled demos](demos/anim-switch.htm) for some ideas.



### Using ES6 modules
If your project uses native JavaScript modules, consider loading `src/accordion.mjs` instead:

~~~html
<!-- ES6+ -->
<script type="module">
	import Accordion from "./src/accordion.mjs";
	for(const el of document.querySelectorAll(".accordion"))
		new Accordion(el);
</script>
~~~

The old `accordion.js` file contains only ES5, and can be used as a fallback for older platforms which lack ES module support:

~~~html
<!-- Fallback to ES5 for legacy browsers -->
<script nomodule src="src/accordion.js"></script>
<script nomodule>
	"use strict";
	var accordions = document.querySelectorAll(".accordion");
	for(var i = 0, l = accordions.length; i < l; ++i)
		new Accordion(accordions[i]);
</script>
~~~


### IE8 support
For IE8-9 compatibility, install [`fix-ie`](https://www.npmjs.com/package/fix-ie):

~~~shell
npm install fix-ie --save
bower install fix-ie --save
~~~


Then link to it using a conditional comment, *before any other script on the page!*

~~~html
<!DOCTYPE html>
<html lang="en">
	<head>
	<!--[if lte IE 9]>
		<script src="node_modules/fix-ie/dist/ie.lteIE9.js"></script>
	<![endif]-->
	<meta charset="utf-8" />
~~~

This [fixes](https://www.npmjs.com/package/fix-ie#ie8pp) IE's buggy handling of `Object.defineProperty`, which the Accordion makes extensive use of. `fix-ie` also provides oodles of helpful polyfills to fix IE8's shoddy DOM support.



Options
----------------------------------------------------------------

| Name                                             | Type     | Default          | Description                                                     |
|--------------------------------------------------|----------|------------------|-----------------------------------------------------------------|
| [closeClass](docs/options.adoc#closeclass)       | String   | `"closed"`       | CSS class used to mark a fold as closed                         |
| [disabled](docs/options.adoc#disabled)           | Boolean  | `false`          | Whether to disable the accordion on creation                    |
| [disabledClass](docs/options.adoc#disabledclass) | String   | `undefined`      | CSS class marking an accordion as disabled                      |
| [edgeClass](docs/options.adoc#edgeclass)         | String   | `"edge-visible"` | CSS class toggled based on whether the bottom-edge is visible   |
| [enabledClass](docs/options.adoc#enabledclass)   | String   | `"accordion"`    | CSS class marking an accordion as enabled                       |
| [heightOffset](docs/options.adoc#heightoffset)   | Number   | `0`              | Distance to offset each fold by                                 |
| [modal](docs/options.adoc#modal)                 | Boolean  | `false`          | Whether to close the current fold when opening another          |
| [noAria](docs/options.adoc#noaria)               | Boolean  | `false`          | Disable the addition and management of ARIA attributes          |
| [noKeys](docs/options.adoc#nokeys)               | Boolean  | `false`          | Disable keyboard navigation                                     |
| [noTransforms](docs/options.adoc#notransforms)   | Boolean  | `false`          | Disable CSS transforms; positioning will be used instead        |
| [onToggle](docs/options.adoc#ontoggle)           | Function | `undefined`      | Callback executed when opening or closing a fold                |
| [openClass](docs/options.adoc#openclass)         | String   | `"open"`         | CSS class controlling each fold's "open" state                  |
| [snapClass](docs/options.adoc#snapclass)         | String   | `"snap"`         | CSS class for disabling transitions between window resizes      |
| [useBorders](docs/options.adoc#useborders)       | Boolean  | `"auto"`         | Consider borders when calculating fold heights                  |
