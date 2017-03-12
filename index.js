
const electron = require('electron');
const {app, BrowserWindow, Menu, MenuItem} = electron;
const {ipcMain} = electron;

let win;

function die() {
    if ( process.platform !== 'darwin' ) app.quit();
}

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

    var open = {
        label: 'Open',
        accelerator: 'Command+O',
        click: function () { createAudioWindow(); }
    };

    var appMenu = new Menu();
    appMenu.append( new MenuItem(about) );
    appMenu.append( new MenuItem(quit) );

    var editMenu = new Menu();
    editMenu.append( new MenuItem({label: 'Junk', type: 'checkbox'}) );
    editMenu.append( new MenuItem(open) );
    editMenu.append( new MenuItem(youtube) );

    var menu = new Menu();
    menu.append( new MenuItem({label: appName, submenu: appMenu}) );
    menu.append( new MenuItem({label: 'Edit', submenu: editMenu}) );

    if ( Menu.setApplicationMenu( menu ) ) {
        app.quit();
    }
    console.log( 'added menu' );
}

function createAudioWindow() {
    // win = new BrowserWindow( {width:800, height: 600} );
    win = new BrowserWindow(  );

    // This is called a "template literal"
    // win.loadURL( `file://${__dirname}/index.html` );
    win.loadURL( 'file://' + __dirname + '/audiofile.html' );

    // win.webContents.openDevTools();
    function closewin() {
        win = null;
    }
    win.on( 'closed', closewin );
    // win.toggleDevTools();
}

function createYouTubeWindow() {
    // win = new BrowserWindow( {width:800, height: 600} );
    win = new BrowserWindow(  );

    // This is called a "template literal"
    // win.loadURL( `file://${__dirname}/index.html` );
    win.loadURL( 'file://' + __dirname + '/youtube.html' );

    // win.webContents.openDevTools();
    function closewin() {
        win = null;
    }
    win.on( 'closed', closewin );
}

function createWindow() {
    add_app_menu();

    // win = new BrowserWindow( {width:800, height: 600} );
    win = new BrowserWindow(  );

    // This is called a "template literal"
    // win.loadURL( `file://${__dirname}/index.html` );
    win.loadURL( 'file://' + __dirname + '/index.html' );

    // win.webContents.openDevTools();
    function closewin() {
        win = null;
    }
    win.on( 'closed', closewin );

    win.setProgressBar( 0.70 );
    app.dock.setBadge( '5 done' );
}

function activate() {
    if ( win === null ) createWindow();
}

app.on( 'ready', createWindow );
app.on( 'window-all-closed', die );
app.on( 'activate', activate );

// vim:autoindent expandtab sw=4
