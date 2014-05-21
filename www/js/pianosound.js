(function () {
	BKGM.PianoSound=function(){
		this.velocity = 127;
	}
	BKGM.PianoSound.prototype={
		playSfx:function(soundId,velocity,delay){
			var delay = delay||0; // play one note every quarter second
                       
	        var velocity = velocity||this.velocity; // how hard the note hits

			MIDI.noteOn(0,soundId, velocity, delay);
			// MIDI.noteOff(0, soundId, delay + 5);
		},
		noteOff:function(soundId,velocity,delay){
			var delay = delay||0; // play one note every quarter second
                       
	        var velocity = velocity||this.velocity; // how hard the note hits

			MIDI.noteOff(0,soundId, velocity, delay);
		}
	}
})();