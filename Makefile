# See https://tech.davis-hansson.com/p/make/
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

.DEFAULT_GOAL := help

GPG_KEY_ID=C6D76C329EBADE2FB9C458CFC5095986493B4AA0

.PHONY: help
help:
	@printf "\033[33mUsage:\033[0m\n  make TARGET\n\n\033[32m#\n# Commands\n#---------------------------------------------------------------------------\033[0m\n\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//' | awk 'BEGIN {FS = ":"}; {printf "\033[33m%s:\033[0m%s\n", $$1, $$2}'

.PHONY: all
all:	## Executes all the commands
all: update deploy

.PHONY: deploy
deploy: ## Build and deploy the website
deploy:
	rm -rf public db.json
	hexo generate
	hexo deploy

.PHONY: update
update:	## Updates the Vue version & the installation guide
update:
	cd ../vue && \
		git checkout -- dist && \
		git checkout master && \
		npm run build
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.js themes/vue/source/js/vue.js
	node update.js

infection.pub:
	gpg --recv-keys $(GPG_KEY_ID)
	gpg --edit-key $(GPG_KEY_ID) minimize clean save
	gpg --keyserver hkps.pool.sks-keyservers.net --send-keys $(GPG_KEY_ID)
	gpg --keyserver pgp.mit.edu --send-keys $(GPG_KEY_ID)
	gpg --send-keys $(GPG_KEY_ID)
	gpg --armor --export $(GPG_KEY_ID) > $@
	touch -c $@
