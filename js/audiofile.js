
var config = {
    container: '#waveform',
    waveColor: 'orange',
    progressColor: 'red'
};

var wavesurfer = WaveSurfer.create( config );
wavesurfer.load( 'demo.wav' );
document.write('loaded demo');
