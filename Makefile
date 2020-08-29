GPG_KEY_ID=C6D76C329EBADE2FB9C458CFC5095986493B4AA0

all: update deploy

deploy:
	rm -rf public db.json
	hexo generate
	hexo deploy

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
	gpg --armor --export $(GPG_KEY_ID) > infection.pub
