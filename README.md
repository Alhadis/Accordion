Accordion
==============

Silky-smooth accordion widgets with no external dependencies.

```bash
npm install accordion --save
bower install silk-accordion --save
```

Usage
-----

Include the following two files in your project:

    src/accordion.css
    src/accordion.js


Layout your markup like this:

```html
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
```


Then create an `Accordion` instance with a reference to a DOM element:
```js
var el = document.querySelector(".accordion");
new Accordion(el);
```

[Options](docs/options.adoc) can be passed in a second argument:
```js
new Accordion(el, {
    onToggle: function(fold, isOpen){
        console.log(fold);   // -> Reference to a `Fold` instance
        console.log(isOpen); // -> true / false
    }
});
```

Options
-------

| Name                                             | Type     | Default          | Description                                                     |
|--------------------------------------------------|----------|------------------|-----------------------------------------------------------------|
| [closeClass](docs/options.adoc#closeclass)       | String   | `"closed"`       | CSS class used to mark a fold as closed                         |
| [disabled](docs/options.adoc#disabled)           | Boolean  | `false`          | Whether to disable the accordion on creation                    |
| [disabledClass](docs/options.adoc#disabledclass) | String   | `undefined`      | CSS class marking an accordion as disabled                      |
| [edgeClass](docs/options.adoc#edgeclass)         | String   | `"edge-visible"` | CSS class toggled based on whether the bottom-edge is visible   |
| [enabledClass](docs/options.adoc#enabledclass)   | String   | `"accordion"`    | CSS class marking an accordion as enabled                       |
| [heightOffset](docs/options.adoc#heightoffset)   | Number   | `0`              | Distance to offset each fold by                                 |
| [noAria](docs/options.adoc#noaria)               | Boolean  | `false`          | Disable the addition and management of ARIA attributes          |
| [noKeys](docs/options.adoc#nokeys)               | Boolean  | `false`          | Disable keyboard navigation                                     |
| [noTransforms](docs/options.adoc#notransforms)   | Boolean  | `false`          | Disable CSS transforms; positioning will be used instead        |
| [onToggle](docs/options.adoc#ontoggle)           | Function | `undefined`      | Callback executed when opening or closing a fold                |
| [openClass](docs/options.adoc#openclass)         | String   | `"open"`         | CSS class controlling each fold's "open" state                  |
| [snapClass](docs/options.adoc#snapclass)         | String   | `"snap"`         | CSS class for disabling transitions between window resizes      |
| [useBorders](docs/options.adoc#useborders)       | Boolean  | `"auto"`         | Consider borders when calculating fold heights                  |


Modular use
-----------
Different distribution flavours are available in the `dist` directory:

* **amd:** For [RequireJS](http://requirejs.org/)
* **common-js:** For [NodeJS](https://nodejs.org/)-like ecosystems
* **es6:** For [Babel](http://babeljs.io/), or whenever ES6 becomes universally supported by browsers.
* **raw:** Compressed and uncompressed ES5 versions, the latter of which is also available in `src`.

The base stylesheet is located at `src/accordion.css`.
Feel free to embed it into your application's existing styling, tweaking it if desired.
