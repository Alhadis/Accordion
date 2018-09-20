Change Log
==========

This project honours [Semantic Versioning](http://semver.org).

[Staged]: https://github.com/Alhadis/Accordion/compare/v3.0.2...HEAD


[v3.0.2]
------------------------------------------------------------------------
**September 20th, 2018**  
Added links to interactive demos, as suggested in [`#13`][].

[`#13`]: https://github.com/Alhadis/Accordion/issues/13
[v3.0.2]: https://github.com/Alhadis/Accordion/releases/tag/v3.0.2



[v3.0.1]
------------------------------------------------------------------------
**June 16th, 2018**  
Fixed a broken link in package's readme file (reported in [`#12`][]).

[`#12`]: https://github.com/Alhadis/Accordion/issues/12
[v3.0.1]: https://github.com/Alhadis/Accordion/releases/tag/v3.0.1



[v3.0.0]
------------------------------------------------------------------------
**May 18th, 2018**  

**Breaking change:**  
Removed `dist` directory. Source code now exclusively located in `src`.
Rationale for removal is explained in the commit notes of [`e74cd3f`][].

**Bugs fixed:**  
* Inability to toggle focussed folds with spacebar
* `Enter` key not toggling folds with anchor-tag headings
* `onTouchStart` event handlers not marked as passive
* `Accordion` class not globalised in module's ES6 version

[`e74cd3f`]: https://github.com/Alhadis/Accordion/commit/e74cd3f89aac2
[v3.0.0]: https://github.com/Alhadis/Accordion/releases/tag/v3.0.0



[v2.1.1]
------------------------------------------------------------------------
**July 18th, 2017**  
This release fixes broken class-toggling in all versions of Explorer.
A minor issue with incorrect source-map linkage was also corrected.

[v2.1.1]: https://github.com/Alhadis/Accordion/releases/tag/v2.1.1



[v2.1.0]
------------------------------------------------------------------------
**February 8th, 2016**  
This release adds much-needed support for CSS3 transforms and callbacks.
Additionally, it adds proper API and option documentation, as well as an
extra folder for various module distribution flavours.

[v2.1.0]: https://github.com/Alhadis/Accordion/releases/tag/v2.1.0



[v2.0.1]
------------------------------------------------------------------------
**February 5th, 2016**  
This release simply adds configuration files for Bower and NPM.

[v2.0.1]: https://github.com/Alhadis/Accordion/releases/tag/v2.0.1



[v2.0.0]
------------------------------------------------------------------------
**February 5th, 2016**  
Half of the first version's code was written before I realised it didn't
support accordion nesting. The remaining half was packed full of everted
fixes to correct my stupid oversight, which ended up making an illogical
mess of everything. Intensely frustrated with the result, I started anew
from complete scratch, angrily pounding out one line of fresh ECMAScript
after another.

This release is the fruit of that second effort, featuring cleaner, much
more efficient code and proper nesting support. Numerous bugs pertaining
to height measurement and redraws were found and fixed along the way.

[v2.0.0]: https://github.com/Alhadis/Accordion/releases/tag/v2.0.0



[v1.0.0]
------------------------------------------------------------------------
**January 19th, 2016**  
The original build of this accordion widget, originally started in April
2015 between many exhausted commutes. The aim was creating the smoothest
possible accordions for mobile devices, which were stress-tested with an
assortment of huge images and text.

[v1.0.0]: https://github.com/Alhadis/Accordion/releases/tag/v1.0.0
