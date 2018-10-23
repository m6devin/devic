
build_browser:
	ionic cordova build browser --prod --release

build_android:
	ionic cordova build android --prod
	cp ./platforms/android/app/build/outputs/apk/debug/app-debug.apk ../public/devict.apk

run_browser:
	ionic serve

run_android:
	rm -rf www/*
	ionic cordova run android --device --livereload -c
