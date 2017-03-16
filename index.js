
const electron = require('electron');
const {app, BrowserWindow, Menu, MenuItem} = electron;
const {ipcMain} = electron;
const {dialog} = electron;

let win;

function die() {
    if ( process.platform !== 'darwin' ) app.quit();
}

var dispatch = {
    exportAudio:
        function (arg) {
        },
    ping:
        function (arg) {
            this.sender.send('asynchronous-reply', 'pong');
        },
    pong:
        function (arg) {
            // notification
        }
};

function ipc_handler( event, arg ) {
    console.log(arg);
    if ( arg === 'download' ) {
        event.sender.send('asynchronous-reply', 'downloaed');
        return;
    }
    event.sender.send('asynchronous-reply', 'pong');
}

ipcMain.on('asynchronous-message', ipc_handler );

function add_app_menu() {
    const appName = app.getName();

    var about = {
        label: 'About',
        role: 'about'
    };

    var quit = {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit(); }
    };

    var youtube = {
        label: 'YouTube',
        accelerator: 'Command+Y',
        click: function () { createYouTubeWindow(); }
    };

    var openFile = {
        label: 'Open File',
        accelerator: 'Command+O',
        click: function () { openAudioWindow(); }
    };

    var exportAudioFile = {
        label: 'Export',
        accelerator: 'Command+E',
        click: function () { requestExport(); }
    };

    var appMenu = new Menu();
    appMenu.append( new MenuItem(about) );
    appMenu.append( new MenuItem(quit) );

    var fileMenu = new Menu();
    fileMenu.append( new MenuItem(openFile) );
    fileMenu.append( new MenuItem(youtube) );

    var editMenu = new Menu();
    editMenu.append( new MenuItem({label: 'Junk', type: 'checkbox'}) );

    var menu = new Menu();
    menu.append( new MenuItem({label: appName, submenu: appMenu}) );
    menu.append( new MenuItem({label: 'File', submenu: fileMenu}) );
    menu.append( new MenuItem({label: 'Edit', submenu: editMenu}) );

    if ( Menu.setApplicationMenu( menu ) ) {
        app.quit();
    }
    console.log( 'added menu' );
}

function requestExport() {
    // how to select current active window
    // Then get fileName from that window
}

function createAudioFileWindow( path ) {
    var config = {
        titleBarStyle: 'hidden',
        useContentSize: true,
        resizable: false
    };
    var win = new BrowserWindow( config );
    win.loadURL( 'file://' + __dirname + '/audiofile.html' );

    function closewin() {
        win = null;
    }
    win.on( 'closed', closewin );
    win.webContents.on( 'did-finish-load', function () {
        win.webContents.send( 'asynchronous-message', 'loadFile', {fileName:path} );
    });
    // win.toggleDevTools();
}

function openAudioWindow() {
    var config = {
        properties: ['openFile']
    };
    function openFile( paths ) {
        if ( paths == null ) return;
        createAudioFileWindow( paths[0] );
    }
    dialog.showOpenDialog( config, openFile );
}

function createYouTubeWindow() {
    // win = new BrowserWindow( {width:800, height: 600} );
    var win = new BrowserWindow(  );

    // This is called a "template literal"
    // win.loadURL( `file://${__dirname}/index.html` );
    win.loadURL( 'file://' + __dirname + '/youtube.html' );

    // win.webContents.openDevTools();
    function closewin() {
        win = null;
    }
    win.on( 'closed', closewin );
}

function createSplashScreen() {
    add_app_menu();

    // win = new BrowserWindow( {width:800, height: 600} );
    // win = new BrowserWindow( {width:600, height: 427} );
    var win = new BrowserWindow( {width:600, height: 530, frame: false} );
    // win = new BrowserWindow(  );

    // This is called a "template literal"
    // win.loadURL( `file://${__dirname}/index.html` );
    win.loadURL( 'file://' + __dirname + '/index.html' );

    // win.webContents.openDevTools();
    function closewin() {
        win = null;
    }
    win.on( 'closed', closewin );

    function closeSplash() { win.close(); }
    function scheduleCloseSplash() { setTimeout( closeSplash, 3000 ); }

    win.webContents.on( 'did-finish-load', scheduleCloseSplash );

    // win.setProgressBar( 0.70 );
    // app.dock.setBadge( '5 done' );
}

function activate() {
    if ( win === null ) createSplashScreen();
}

app.on( 'ready', createSplashScreen );
app.on( 'window-all-closed', die );
app.on( 'activate', activate );

// vim:autoindent expandtab sw=4
