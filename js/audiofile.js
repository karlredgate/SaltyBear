
const {ipcRenderer} = require('electron');
var fileName = 'EMPTY';

var dispatch = {
    loadFile:
        function ( arg ) {
            fileName = arg.fileName;
            makewave();
        },
    exportProgressUpdate:
        function ( arg ) {
            var progressBar = document.querySelector( '#exportProgress' );
            progressBar.style.width = arg.progress;
        },
    ping:
        function ( arg ) {
            this.sender.send('asynchronous-reply', 'pong');
        },
    pong:
        function (arg) {
            // notification??
        }
};

function messageHandler( event, messageType, arg ) {
    var n = new window.Notification( 'Complete', { body: messageType } );
    var handler = dispatch[messageType];
    if ( handler == null ) ; // error
    handler.call( event, arg );
}

ipcRenderer.on( 'asynchronous-message', messageHandler );
ipcRenderer.on( 'synchronous-message', messageHandler );

var EQ = [
    { f:    32, type: 'lowshelf'  },
    { f:    64, type: 'peaking'   },
    { f:   125, type: 'peaking'   },
    { f:   250, type: 'peaking'   },
    { f:   500, type: 'peaking'   },
    { f:  1000, type: 'peaking'   },
    { f:  2000, type: 'peaking'   },
    { f:  4000, type: 'peaking'   },
    { f:  8000, type: 'peaking'   },
    { f: 16000, type: 'highshelf' }
];

function filter(band) {
    var wavesurfer = this;
    var filter = wavesurfer.backend.ac.createBiquadFilter();
    filter.type = band.type;
    filter.gain.value = 0;
    filter.Q.value = 1;
    filter.frequency.value = band.f;
    return filter;
}

var config = {
    container: '#waveform',
    barWidth: 3,
    splitChannels: true,
    cursorColor: 'gold',
    waveColor: 'orange',
    progressColor: 'orangered'
};

function createFilterControl( filter ) {
    var wavesurfer = this;

    var filterConfig = {
        type: 'range',
        min: -40,
        max: 40,
        value: 0,
        title: filter.frequency.value
    };

    var input = document.createElement('input');
    wavesurfer.util.extend( input, filterConfig );
    input.style.display = 'inline-block';
    input.setAttribute( 'orient', 'vertical' );

    var drawerStyle = {
        'webkitAppearance': 'slider-vertical',
        width: '50px', height: '150px'
    };
    wavesurfer.drawer.style( input, drawerStyle );

    var container = document.querySelector( '#equalizer' );
    container.appendChild( input );
    function onChange( event ) {
        filter.gain.value = ~~event.target.value;
    }
    input.addEventListener( 'input', onChange );
    input.addEventListener( 'change', onChange );
}

var player = null;

function makewave() {
    var wavesurfer = WaveSurfer.create( config );

    function readyHandler() {
        var timeline = Object.create(WaveSurfer.Timeline);
        var config = {
            wavesurfer: this,
            primaryFontColor: 'gold',
            container: '#timeline'
        };
        timeline.init( config );
        this.play();
    }

    var filterSet = EQ.map( filter.bind(wavesurfer) );
    wavesurfer.backend.setFilters( filterSet );
    filterSet.forEach( createFilterControl.bind(wavesurfer) );
    wavesurfer.filters = filterSet;

    wavesurfer.load( fileName );
    wavesurfer.on('ready', readyHandler.bind(wavesurfer) );
    wavesurfer.play();
    player = wavesurfer;

    var container = document.querySelector( '#filename' );
    container.textContent = fileName;
    var progressBar = document.querySelector( '#exportProgress' );
    // progressBar.style.width = '50%';
}

// makewave();

function exportFile() {
    if ( fileName == 'EMPTY' ) ; // error
    ipcRenderer.send( 'asynchronous-message', 'exportFile', {type: 'mp3', fileName: fileName} );
}

/* vim: set autoindent expandtab sw=4 : */
