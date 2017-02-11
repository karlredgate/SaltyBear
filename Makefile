
default: app

app: SaltyBear.app/Contents/MacOS/Electron
app: SaltyBear.app/Contents/Resources/app/package.json
app: SaltyBear.app/Contents/Resources/app/index.js
app: SaltyBear.app/Contents/Resources/app/index.html

SaltyBear.app/Contents/Resources/app/%: %
	mkdir -p SaltyBear.app/Contents/Resources/app
	cp $< $@

SaltyBear.app/Contents/MacOS/Electron: node_modules/electron/dist/Electron.app/Contents/MacOS/Electron
	mkdir SaltyBear.app
	( cd node_modules/electron/dist/Electron.app ; tar cf - . ) | ( cd SaltyBear.app ; tar xvf - )
	cp Info.plist SaltyBear.app/Contents/Info.plist

node_modules/electron/dist/Electron.app/Contents/MacOS/Electron:
	npm install electron

clean:
	rm -rf SaltyBear.app node_modules
