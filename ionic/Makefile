
build_browser:
	ionic cordova build browser --prod --release

run_browser:
	cp platforms/browser/platform_www/cordova.js ./www/
	cp platforms/browser/platform_www/cordova_plugins.js ./www/
	cp -r  platforms/browser/platform_www/plugins ./www/
	cp -r  platforms/browser/config.xml ./www/
	ionic serve

run_android:
	ionic cordova run android --device --livereload -c
