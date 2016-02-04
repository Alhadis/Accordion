# Minification options
MINIFY_OPTS := --mangle --compress

.PHONY: install clean watch unwatch
all:    accordion.min.js


# Generate a compressed version of the file
accordion.min.js: src/accordion.js
	@perl -0777 -pe 's{/\*\~+\s*(\w+)?\s*\*/.*?/\*\s*\1?\s*\~+\*/}{}gsi' < $< | \
	uglifyjs $(MINIFY_OPTS) > $@



# Install required NPM modules, if needed
install:
	@npm -g install uglifyjs


# Wipe anything that Make generated
clean:
	@rm accordion.min.js


# Enter the Watchman
PWD := $(shell pwd)
watch:
	@watchman watch $(PWD) > /dev/null
	@watchman -- trigger $(PWD) recompress src/accordion.js -- make accordion.min.js > /dev/null

unwatch:
	@watchman watch-del $(PWD) > /dev/null


# Options to switch between the transpiled version and the original ES6 sources
DEMOS := $(wildcard demos/*.htm)
use-src:
	@perl -pi -e 's/(<script src="\.\.\/src\/(?=\w+\.js))/$$1es6\//gi' $(DEMOS)

use-compiled:
	@perl -pi -e 's/(<script src="\.\.\/src\/)es6\//$$1/gi' $(DEMOS)

.PHONY: use-src use-compiled
