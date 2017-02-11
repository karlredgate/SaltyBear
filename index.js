const {app, BrowserWindow} = require('electron');
let win;

function die() {
    if ( process.platform !== 'darwin' ) app.quit();
}

function createWindow() {
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
}

function activate() {
    if ( win === null ) createWindow();
}

app.on( 'ready', createWindow );
app.on( 'window-all-closed', die );
app.on( 'activate', activate );

// vim:autoindent expandtab sw=4
