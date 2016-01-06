# Minification options
MINIFY_OPTS := --mangle --compress

.PHONY: install clean watch unwatch
all:    accordion.min.js


# Generate a compressed version of the file
accordion.min.js: accordion.js
	@uglifyjs $(MINIFY_OPTS) < $< > $@



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
	@watchman -- trigger $(PWD) recompress accordion.js -- make accordion.min.js > /dev/null

unwatch:
	@watchman watch-del $(PWD) > /dev/null
