ng-server:
	ng serve --proxy-config proxy.config.js --live-reload=false --host 0.0.0.0

build_prod:
	rm -rf ../public/securearea/
	ng build --base-href /securearea/ --prod
	cp -r ./dist/frontend/ ../public/securearea/
	sed  -i '' -e 's/href="styles/href="\/securearea\/styles/g' -e 's/src="runtime/src="\/securearea\/runtime/g' -e 's/src="polyfills/src="\/securearea\/polyfills/g' -e 's/src="main/src="\/securearea\/main/g' ../public/securearea/index.html
	cp ../public/securearea/index.html ../resources/views/securearea.blade.php
