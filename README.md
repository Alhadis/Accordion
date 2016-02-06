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

[Options](#options) can be passed in a second argument:
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

| Name                                           | Type     | Default          | Description                                                     |
|------------------------------------------------|----------|------------------|-----------------------------------------------------------------|
| [closeClass](docs/options.md#closeclass)       | String   | `"closed"`       | CSS class used to mark a fold as closed                         |
| [disabled](docs/options.md#disabled)           | Boolean  | `false`          | Whether to disable the accordion on creation                    |
| [disabledClass](docs/options.md#disabledclass) | String   | `undefined`      | CSS class marking an accordion as disabled                      |
| [edgeClass](docs/options.md#edgeclass)         | String   | `"edge-visible"` | CSS class toggled based on whether the bottom-edge is visible   |
| [enabledClass](docs/options.md#enabledclass)   | String   | `"accordion"`    | CSS class marking an accordion as enabled                       |
| [heightOffset](docs/options.md#heightoffset)   | Number   | `0`              | Distance to offset each fold by                                 |
| [noAria](docs/options.md#noaria)               | Boolean  | `false`          | Disable the addition and management of ARIA attributes          |
| [noKeys](docs/options.md#nokeys)               | Boolean  | `false`          | Disable keyboard navigation                                     |
| [noTransforms](docs/options.md#notransforms)   | Boolean  | `false`          | Disable CSS transforms; positioning will be used instead        |
| [onToggle](docs/options.md#ontoggle)           | Function | `undefined`      | Callback executed when opening or closing a fold                |
| [openClass](docs/options.md#openclass)         | String   | `"open"`         | CSS class controlling each fold's "open" state                  |
| [snapClass](docs/options.md#snapclass)         | String   | `"snap"`         | CSS class for disabling transitions between window resizes      |
| [useBorders](docs/options.md#useborders)       | Boolean  | `"auto"`         | Consider borders when calculating fold heights                  |
