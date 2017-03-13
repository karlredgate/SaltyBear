
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

    wavesurfer.load( 'demo.wav' );
    wavesurfer.on('ready', readyHandler.bind(wavesurfer) );
    wavesurfer.play();
    player = wavesurfer;
}

makewave();

/* vim: set autoindent expandtab sw=4 : */
