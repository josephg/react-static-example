watch:
	mkdir -p public
	watchify -v -t [ babelify  ] client.js -o public/build.js
