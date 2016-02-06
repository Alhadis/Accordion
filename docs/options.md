Options
===============================================================================

* Options
	* [closeClass](#closeclass)
	* [disabled](#disabled)
	* [disabledClass](#disabledclass)
	* [edgeClass](#edgeclass)
	* [enabledClass](#enabledclass)
	* [heightOffset](#heightoffset)
	* [noAria](#noaria)
	* [noKeys](#nokeys)
	* [noTransforms](#notransforms)
	* [onToggle](#ontoggle)
	* [openClass](#openclass)
	* [snapClass](#snapclass)
	* [useBorders](#useborders)



closeClass
-----------------------------------------------------------
Default: `"closed"`  
Type: String

CSS class used to mark a fold as closed.



disabled
-----------------------------------------------------------
Default: `false`  
Type: Boolean

Whether to disable the accordion on creation.

This is basically the same as doing this:

    var acc      = new Accordion(element);
    acc.disabled = true;



disabledClass
-----------------------------------------------------------
Default: `undefined`  
Type: String

CSS class added to an accordion's element when the accordion is disabled.



edgeClass
-----------------------------------------------------------
Default: `"edge-visible"`  
Type: String

CSS class toggled based on whether the bottom-edge is visible.

This class is used to enable height transitions only when they're needed.
Animating an element's height can be jolty on mobile if there's a lot of
content that's being pushed down (or pulled upwards) by an opening or
closing accordion.




enabledClass
-----------------------------------------------------------
Default: `"accordion"`  
Type: String

CSS class marking an accordion as enabled.




heightOffset
-----------------------------------------------------------
Default: `0`  
Type: Number

Extra distance to offset each fold by.

Negative values have the effect of pulling folds up over the top of each other.



noAria
-----------------------------------------------------------
Default: `false`  
Type: Boolean

Disable the addition and management of ARIA attributes.

By default, ARIA attributes are added for the benefit of assistive technologies.
This requires the elements of each fold be identified with `id` attributes.
If a fold's heading or content nodes lack an ID, one is generated using the
ID of the fold's container element:

    <div id="topic">                  <div id="topic">
        <h1> Heading </h1>         ->     <h1 id="topic-heading"> Heading </h1>
        <p> Content </p>           ->     <p id="topic-content"> Content </p>
    </div>                            </div>

If a sibling has an ID, it's suffixed with `-heading` or `-content`, if needed:

    <div>                             <div>
        <h1> Heading </h1>         ->     <h1 id="stuff-heading"> Heading </h1>
        <p id="stuff"> Etc </p>           <p id="stuff"> Etc </p>
    </div>                            </div>
    
    <div>                             <div>
        <h1 id="etc"> Etc </h1>           <h1 id="etc"> Etc </h1>
        <p> Content </p>           ->     <p id="etc-content"> Content </p>
    </div>                            </div>


If the container also lacks an ID, one is generated as a last resort:

    <div>
        <h1 id="a1-heading"> Heading </h1>
        <p id="a1-content"> Content </p>
    </div>

You probably won't have to care about this in most cases.




noKeys
-----------------------------------------------------------
Default: `false`  
Type: Boolean

Disable keyboard navigation.



noTransforms
-----------------------------------------------------------
Default: `false`  
Type: Boolean

Disable CSS transforms; positioning will be used instead (the `top` property).

If a user's browser doesn't support transforms, positioning will be used anyway.




onToggle
-----------------------------------------------------------
Default: `undefined`  
Type: Function

Callback executed when opening or closing a fold.

The callback is passed two arguments: a reference to the fold being toggled, and
the state being changed to.

If the function returns a value of `false`, the toggle is aborted and the fold's
opened state remains the same.

    new Accordion(element, {
        onToggle: function(fold, isOpen){
            if(stillLoading) return false;
        }
    });



openClass
-----------------------------------------------------------
Default: `"open"`  
Type: String

CSS class controlling each fold's "open" state.



snapClass
-----------------------------------------------------------
Default: `"snap"`  
Type: String

CSS class for disabling transitions between window resizes.

Like [edgeClass](#edgeclass), this is a utility class used by the core styling.
It remains overridable in case it conflicts with existing styling classes.




useBorders
-----------------------------------------------------------
Default: `"auto"`  
Type: Boolean (or "auto"; see below)

If true, the height consumed by each fold's container and heading elements is considered when measuring their effective height.

If set to `"auto"` (the default), the value is set based on whether or not the fold's elements appear to have a border when it's being created.

Calculating border widths is computationally more expensive than using a fixed, predetermined value. If the size of a fold's borders are known ahead of time, consider using the [heightOffset](#heightoffset) property instead. Remember to set `useBorders` to `false` if doing so.
