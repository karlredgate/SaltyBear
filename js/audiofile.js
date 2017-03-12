
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
    var filter = wavesurfer.backend.ac.createBiquadFilter();
    filter.type = band.type;
    filter.gain.value = 0;
    filter.Q.value = 1;
    filter.frequency.value = band.f;
    return filter;
}

// var filterSet = EQ.map( filter );

var config = {
    container: '#waveform',
    splitChannels: true,
    waveColor: 'orange',
    progressColor: 'darkorange'
};

var _ready_check = null;
function makewave() {
    clearInterval( _ready_check );
    var wavesurfer = WaveSurfer.create( config );
    // wavesurfer.backend.setFilters( filters );
    wavesurfer.load( 'demo.wav' );
    wavesurfer.on('ready', function () { wavesurfer.play(); } );
    wavesurfer.play();
    // document.write('loaded demo');
    var x = document.getElementById('waveform');
    // x.write('hello");
}

function whenReady() {
    if ( document.readyState === "interactive" ) {
        return makewave();
    }
    if ( document.readyState === "complete" ) {
        return makewave();
    }
}

// window.onload = whenReady;
// _ready_check = setInterval( whenReady, 2000 );
makewave();
