
default: app

dmg: app
	hdiutil create -srcfolder SaltyBear.app -volname SaltyBear -fs HFS+ -fsargs "-c c=64,a=16,e=16" -format UDRW -size 200000k foo.dmg

app: SaltyBear.app/Contents/MacOS/Electron
app: SaltyBear.app/Contents/Resources/SaltyBear.icns
app: SaltyBear.app/Contents/Resources/app/package.json
app: SaltyBear.app/Contents/Resources/app/SaltyBear.png
app: SaltyBear.app/Contents/Resources/app/index.js
app: SaltyBear.app/Contents/Resources/app/index.html
app: SaltyBear.app/Contents/Resources/app/youtube.html
app: SaltyBear.app/Contents/Resources/app/audiofile.html
app: SaltyBear.app/Contents/Resources/app/css/photon.css
app: SaltyBear.app/Contents/Resources/app/css/photon.min.css
app: SaltyBear.app/Contents/Resources/app/fonts/photon-entypo.eot
app: SaltyBear.app/Contents/Resources/app/fonts/photon-entypo.svg
app: SaltyBear.app/Contents/Resources/app/fonts/photon-entypo.ttf
app: SaltyBear.app/Contents/Resources/app/fonts/photon-entypo.woff
app: SaltyBear.app/Contents/Resources/app/js/audiofile.js
app: SaltyBear.app/Contents/Resources/app/js/wavesurfer.min.js
app: SaltyBear.app/Contents/Resources/app/js/wavesurfer.min.js.map
app: SaltyBear.app/Contents/Resources/app/js/plugin/wavesurfer.timeline.min.js
app: SaltyBear.app/Contents/Resources/app/images/orange-metal.jpg
app: SaltyBear.app/Contents/Resources/app/images/orange-sound-waves.jpg
app: SaltyBear.app/Contents/Resources/app/images/gold-leaf.jpg
app: SaltyBear.app/Contents/Resources/app/images/swirl-brushed-steel.jpg
app: SaltyBear.app/Contents/Resources/app/images/latch-metal.jpg
app: SaltyBear.app/Contents/Resources/app/images/gold-riveted-metal.jpg

app: SaltyBear.app/Contents/Resources/app/demo.wav

SaltyBear.app/Contents/Resources/app/%: %
	@mkdir -p SaltyBear.app/Contents/Resources/app
	@mkdir -p SaltyBear.app/Contents/Resources/app/css
	@mkdir -p SaltyBear.app/Contents/Resources/app/fonts
	@mkdir -p SaltyBear.app/Contents/Resources/app/js/plugin
	@mkdir -p SaltyBear.app/Contents/Resources/app/images
	install $< $@

SaltyBear.app/Contents/MacOS/Electron: node_modules/electron/dist/Electron.app/Contents/MacOS/Electron
	mkdir SaltyBear.app
	( cd node_modules/electron/dist/Electron.app ; tar cf - . ) | ( cd SaltyBear.app ; tar xvf - )
	cp Info.plist SaltyBear.app/Contents/Info.plist

SaltyBear.app/Contents/Resources/SaltyBear.icns: SaltyBear.icns
	cp SaltyBear.icns SaltyBear.app/Contents/Resources/SaltyBear.icns

SaltyBear.icns: SaltyBear.iconset
	iconutil -c icns SaltyBear.iconset

SaltyBear.iconset: SaltyBear.png
	mkdir SaltyBear.iconset
	sips -z  16  16 SaltyBear.png --out SaltyBear.iconset/icon_16x16.png
	sips -z  32  32 SaltyBear.png --out SaltyBear.iconset/icon_16x16@2x.png
	sips -z  32  32 SaltyBear.png --out SaltyBear.iconset/icon_32x32.png
	sips -z  64  64 SaltyBear.png --out SaltyBear.iconset/icon_32x32@2x.png
	sips -z 128 128 SaltyBear.png --out SaltyBear.iconset/icon_128x128.png
	sips -z 256 256 SaltyBear.png --out SaltyBear.iconset/icon_128x128@2x.png
	sips -z 256 256 SaltyBear.png --out SaltyBear.iconset/icon_256x256.png
	sips -z 512 512 SaltyBear.png --out SaltyBear.iconset/icon_256x256@2x.png
	sips -z 512 512 SaltyBear.png --out SaltyBear.iconset/icon_512x512.png
	cp SaltyBear.png SaltyBear.iconset/icon_512x512@2x.png

node_modules/electron/dist/Electron.app/Contents/MacOS/Electron:
	npm install electron

clean:
	rm -rf SaltyBear.app node_modules SaltyBear.iconset SaltyBear.icns
