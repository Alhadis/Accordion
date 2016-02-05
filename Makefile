#=INPUT=========================================================================

# Directories
SRC         := src
DIST        := dist

# Source files
SRC_ES5     := $(SRC)/accordion.js
SRC_ES6     := helpers.js fold.js accordion.js
EXPORT_UTIL := { touchEnabled, pressEvent, transitionEnd, debounce, uniqueID }


#=OUTPUT========================================================================

# Target filename
NAME        := accordion.js

# Distribution flavours
AMD         := $(DIST)/amd/$(NAME)
COMMON-JS   := $(DIST)/common-js/$(NAME)
RAW         := $(DIST)/raw/$(NAME)
ES6         := $(DIST)/es6


#=TASKS=========================================================================

all: clean dist

clean:
	@rm -rf $(DIST)

dist: amd common-js es6 raw


# Minify a JavaScript resource
%.min.js: %.js
	@uglifyjs -c --mangle --source-map $@.map $< > $@


# Copy a source file into the destination directory before modifying it
define copy
	rm -f $@
	mkdir -p $(@D)
	cp $< $@
endef


# Raw, browser-ready ES5 version
raw: $(RAW) $(subst .js,.min.js,$(RAW))
$(RAW): $(SRC_ES5)
	@$(call copy)


# Generate an AMD version of the file
amd: $(AMD)
$(AMD): $(SRC_ES5)
	@$(call copy)
	@perl -0777 -p \
		-e 's/^\(/define([], /; \
		s/window\.Accordion\s*=\s*(Accordion)/return $$1/; \
		s/\}\(\)\);\s*$$/});\n/' < $< > $@


# CommonJS module
common-js: $(COMMON-JS)
$(COMMON-JS): $(SRC_ES5)
	@$(call copy)
	@perl -0777 -p \
		-e 's/^\(function\(\)\{\n//; \
		s/\}\(\)\);?\s*$$//; \
		s/window\.Accordion\s*=\s*(Accordion)/module.exports = $$1/; \
		s/^\t//gm' < $< > $@



# ECMAScript 6: Expose some import/export directives
es6: $(addprefix $(ES6)/,$(SRC_ES6))

$(ES6)/%.js: $(SRC)/es6/%.js
	@$(call copy)
	@perl -0777 -pi -e 's{(/\*~~\s*|\s*~~\*/)}{}g;' $@



watch:
	$(call watch,$(SRC)/'*',dist)

unwatch:
	$(call unwatch)


# Run a Make task in response to filesystem changes
# - Requires Watchman: https://facebook.github.io/watchman/
# - Usage: $(call watch,file-pattern,task-name)
PWD := $(shell pwd)
define watch
	@watchman watch $(PWD) > /dev/null
	@watchman -- trigger $(PWD) '$(2)-$(1)' $(1) -- make $(2) > /dev/null
endef

define unwatch
	@watchman watch-del $(PWD) > /dev/null
endef

.PHONY: clean watch unwatch
