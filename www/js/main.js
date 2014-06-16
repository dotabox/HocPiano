(function(){
// var dmno=new BKGM.Audio().setAudio("audio/slap")
	// Wait for device API libraries to load
            //
            
            window.addEventListener("load", bodyload, false);

            // device APIs are available
            //
            function bodyload(){
            	onDeviceReady()
            	// document.addEventListener("deviceready", onDeviceReady, false);

            }
            function onDeviceReady() { 

            	((typeof(cordova) == 'undefined') && (typeof(phonegap) == 'undefined')) ? BKGM._isCordova=false : BKGM._isCordova=true;
            	// interface to download soundfont, then execute callback;
				// MIDI.loadPlugin(function(){console.log("done")});
				// // simple example to get started;
				var _oneLoad=false;
				MIDI.loadPlugin({
				    instrument: "acoustic_grand_piano", // or the instrument code 1 (aka the default)
				    callback: function() { 
				    	if(_oneLoad) windowLoad(preload);
				    	_oneLoad=true;
				    }
				});
            	var preload= new BKGM.preload();           	
				preload					   
					   .load("audio","beep1","audio/1.mp3")
					   .load("audio","beep2","audio/2.mp3")
					   .load("image","whitebutton","img/white_button.png")
					   .load("image","blackbutton","img/button.png")
					   .load("image","count3","img/count/3.png")
					   .load("image","count2","img/count/2.png")
					   .load("image","count1","img/count/1.png")
					   .load("image","count0","img/count/go.png")
					   .load("image","lvl1.sol","data/level1/img/sol.jpg")
					   .load("image","woodbar.left","img/keyboard/woodbar-left.png")
					   .load("image","woodbar.right","img/keyboard/woodbar-right.png")
					   .load("image","woodbar.top","img/keyboard/woodbar-top.png")
					   .load("image","key.left","img/keyboard/key-left.png")
					   .load("image","key.mid","img/keyboard/key-mid.png")
					   .load("image","key.right","img/keyboard/key-right.png")
					   .load("image","key.pressed","img/keyboard/key-pressed.png")
					   .load("image","key.pressed.green","img/keyboard/key-pressed-green.png")
					   .load("image","key.pressed.red","img/keyboard/key-pressed-red.png")
					   .load("image","key.black","img/keyboard/key-black.png")
					   .load("image","key.black.pressed","img/keyboard/key-black-pressed.png")
					   .load("image","key.black.pressed.green","img/keyboard/key-black-pressed-green.png")
					   .load("image","key.black.pressed.red","img/keyboard/key-black-pressed-red.png")
					   .load("image","cardnote.white","img/cardnote/cardnote-white.png")
					   .load("image","cardnote.black","img/cardnote/cardnote-black.png")
					   .load("image","bg","img/pic-background.png")
					   .load("image","back","img/back.png")
					   ;
				preload.onloadAll= function(){
					if(_oneLoad) windowLoad(preload);
				    	_oneLoad=true;
				}
            }
	// window.onload=function(){
        function windowLoad(preload) {
        	// Tạo mới canvas 
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", "game"); 
            document.body.appendChild(canvas);
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            var ctx = canvas.getContext("2d");

            

            // Tạo sự kiện khi kéo file vào canvas
            canvas.ondragover = function () { this.className = 'hover'; return false; };
			canvas.ondragend = function () { this.className = ''; return false; };
            canvas.ondrop=function(e){
            	e.preventDefault();

			  	var file = e.dataTransfer.files[0];
			    var reader = new FileReader();
			  	reader.onload = function (event) {

			  		var str=event.target.result;console.log(str);
			  		str=str.substr(str.lastIndexOf(',')+1);
					var str1=atob(str);
				  	var t = str1 || "" ;
					var ff = [];
					var mx = t.length;
					var scc= String.fromCharCode;
					for (var z = 0; z < mx; z++) {
						ff[z] = scc(t.charCodeAt(z) & 255);
					}
					var data=ff.join("");
					midiFile = new MidiFile(data);
			  		var replayer= new Replayer(midiFile, 1);
					var data = replayer.getData();
			  	}
			  	reader.readAsDataURL(file);
            }

			var Metronome= new BKGM.Metronome();


            var director;
            var _fb;
            // BKGM.debug=1;
            for (var i = MusicData.length - 1; i >= 0; i--) {
            	var msdata=MusicData[i];
            	var lesson=msdata.lesson;
            	for (var j = msdata.learn.length - 1; j >= 0; j--) {            		
            		BKGM.ajax({url:"data/"+msdata.learn[j],type:"GET",data:"",responseType :"blob",j:j,
		            	complete:function(ev,num){
		            		var num=num+1;
		            		var blob = new Blob([ev], {type: 'audio/mid'});
		            		var reader = new FileReader();
						  	reader.onload = function (event) {

						  		var str=event.target.result;						  		
								var lvl="level"+lesson+".b"+num;
								BKGM.MIDIDATA[lvl]=str;
						  	}

						  	reader.readAsDataURL(blob);
		            	}})
            	};
            	for (var g = msdata.learn_hand.length - 1; g >= 0; g--) {            		
            		BKGM.ajax({url:"data/"+msdata.learn_hand[g],type:"GET",data:"",
		            	complete:function(ev){
		            		eval(ev)
		            	}})
            	};
            	for (var j = msdata.play.length - 1; j >= 0; j--) {            		
            		BKGM.ajax({url:"data/"+msdata.play[j],type:"GET",data:"",responseType :"blob",j:j,
		            	complete:function(ev,num){
		            		var num=num+1;
		            		var blob = new Blob([ev], {type: 'audio/mid'});
		            		var reader = new FileReader();
						  	reader.onload = function (event) {

						  		var str=event.target.result;						  		
								var lvl="level"+lesson+".play"+num;
								BKGM.MIDIDATA[lvl]=str;
						  	}

						  	reader.readAsDataURL(blob);
		            	}})
            	};
            	for (var g = msdata.play_hand.length - 1; g >= 0; g--) {            		
            		BKGM.ajax({url:"data/"+msdata.play_hand[g],type:"GET",data:"",
		            	complete:function(ev){
		            		eval(ev)
		            	}})
            	};
            	
            };

            var Game = new BKGM({
			    setup: function(){
			        director = new BKGM.States();
			        var Game = this;
			        // Đặt quản lý states của game là director
			        // Game.addStates(director);
			        
			        // Context cua Game
			        var ctx=Game.ctx;
			        // Nạp tài nguyên vào Game
			        Game.addRes(preload);
			        // Đặt tất cả ảnh vào biến Gimages
			        var Gimages=Game.resource.images;
			        // Biến xác nhận có đang học ko?
			        var isLearning=false;
			        // Biến để dữ liệu file midi
            		var MIDIDATA0=[];        // Tay phải    		
            		var MIDIDATA1=[];        // Tay trái
            		var MIDIDATA2=[];        // Hai tay    		
            		// Index của nốt hiện tại
            		var currentNoteIndex=0;
            		// Nốt hiện tại sẽ là MIDIDATA[currentNoteIndex].note
            		var currentNote=[];
			        // Tạo mới obj lưu thứ tự bấm nốt của tay
			        Game.hand={left:null,right:null};
			        // Đặt các hằng số cho tay
			        BKGM.HAND_LEFT=1;
			        BKGM.HAND_RIGHT=0;
			        BKGM.HAND_BOTH=2;
			        // Tay đang dùng hiện tại
			        var currentHand=BKGM.HAND_BOTH;
			        // Tạo 1 đàn piano ảo
			        var Piano = new BKGM.Piano(Game);
			        // Callback khi đang play file midi
			        var _callbackMIDI;
			        // Bắt sự kiện khi play file midi
			        MIDI.Player.addListener(function(data,noteRegistrar) { // set it to your own function!
					    var now = data.now; // where we are now
					    var end = data.end; // time when song ends
					    var channel = data.channel; // channel note is playing on
					    var message = data.message; // 128 is noteOff, 144 is noteOn
					    var note = data.note; // the note
					    var velocity = data.velocity; // the velocity of the note
					    var track = data.track // them vao sau
					    var pressed = message==144? false : true;
					    // Piano.playSfx(MIDIDATA1[currentNoteIndex].note,MIDIDATA1[currentNoteIndex].velocity,false,true,1);
					    
					    if(typeof track != 'undefined'&&(!MIDIDATA2[currentNoteIndex].played||!pressed))
					    	Piano.playSfx(note,velocity,pressed,pressed,track);
					    else Piano.playSfx(note,velocity,pressed,pressed);
					    // data.velocity=0;
					    if(_callbackMIDI) _callbackMIDI(note,velocity,pressed,track);
					    // then do whatever you want with the information!
					});
					var currentData='level1';
					var lvlhientai=1;
			       	// _fb = new BKGM.FBConnect();
			       	// _fb.init({appId:"296632137153437"});
			       	// Game.touchStart=function(e){
			       	// 		// _fb.postCanvas("Test post diem");
			       	// 		// mb.setTarget(e.x,e.y);
			       			
			       	// }
			       
			        Game.random = function(min, max){
			        	return Math.floor(min + Math.random()*(max-min));
			        };
			        

    				
				    director.state("ready", [	
				    	"setup0",
				     	"background",
				     	"HocChoi"
				     	// "intro"
				    ]);
				    
				    director.state("menu", [
				    	"background",
				    	"chooselevel"	    	
				    ]);


				    // Hien noi dung bai hoc cua bai, choi tung ban nhac
				    director.state("level1.start", [
				    	"lvl1.setup.start",
				    	"lvl1.background",
				    	"lvl1.tut",				    	
				    	"lvl1.keyboard.update",
				    	"lvl1.keyboard.draw"
				    	//"keyboard"
				    	//"start_state"	    	
				    ]);		

				    // Count time lvl

				    director.state("level1.count", [
				    	"lvl1.count.setup",
				    	"lvl1.background",
				    	"lvl1.keyboard.draw",
				    	"count"
				    	//"start_state"	    	
				    ]);	

				    // choi tung ban nhac
				    director.state("level1.learn", [
				    	"lvl1.keyboard.setup",
				    	"lvl1.background",	    	
				    	"lvl1.keyboard.update",
				    	"lvl1.keyboard.draw",
				    	"lvl1.hand.draw",
				    	"handButton"
				    	//"start_state"	    	
				    ]);		

				    // Giải trí		    
				    director.state("level1.play", [
				    	"lvl1.keyboard.playsetup",
				    	"lvl1.background1",				    	
				    	"lvl1.playback",
				    	"lvl1.keyboard.update",
				    	"lvl1.keyboard.draw",
				    	"lvl1.hand.draw",
				    	"nextprePlay"
				    	//"start_state"	    	
				    ]);	

				    // Hien noi dung bai hoc cua bai, choi tung ban nhac
				    director.state("level.start", [
				    	"lvl.setup.start",
				    	"lvl.background",
				    	"lvl.tut",				    	
				    	"lvl.keyboard.update",
				    	"lvl.keyboard.draw"
				    	//"keyboard"
				    	//"start_state"	    	
				    ]);	
				    // Count time lvl

				    director.state("level.count", [
				    	"lvl.count.setup",
				    	"lvl.background",
				    	"lvl.keyboard.draw",
				    	"count"
				    	//"start_state"	    	
				    ]);	

				    // choi tung ban nhac
				    director.state("level.learn", [
				    	"lvl.keyboard.setup",
				    	"lvl.background",	    	
				    	"lvl.keyboard.update",
				    	"lvl.keyboard.draw",
				    	"lvl.hand.draw",
				    	"handButton"
				    	//"start_state"	    	
				    ]);		
				    //Hoc chi tiet cac ban nhac
				    //Co thoi gian cho`
				    director.state("startLevel", [
				    	"background"				    	
				    	//"keyboard"
				    	//"tut"
				    	//"tut"
				    	//"show_music"	    	
				    ]);

				    //Giai tri, tap choi
				    //Danh theo nhip
				    director.state("playLevel", [
				    	"background"				    	
				    	//"keyboard"
				    	//"tut"
				    	//"show_music"	    	
				    ]);

				    director.task("background", function(){
				        Game.background(16, 16, 16, 1);
				    }, true);
				    // var pianoic;
				    var globalBack={
				    	image:Gimages.back,
				    	x:0,
				    	y:0,
				    	w:100,
				    	h:100,
				    	action:function(){
				    		if(Intro) Intro.close();
				    		switch (director.current){
				    			case "menu":director.switch("ready",true);break;
				    			case "level1.start":director.switch("menu",true);break;
				    			case "level1.learn":director.switch("level1.start",true);break;
				    			case "level1.play":director.switch("level1.start",true);break;
				    		}
				    		
				    			
				    	}
				    }
				    director.taskOnce("setup0", function(){				    	
				        Game.font='UTM Avo';
				        var Intro=new BKGM.Intro(Game);
				        // Game.intro=Intro;
				        // Game.intro.open();
				        Intro.open();
				        // pianoic=new BKGM.Intro(Game,'PIANOIC/index.html',0,0,Game.WIDTH,Game.HEIGHT,1);
				    });
				    
				    var chooseHoc={
				    	image:Gimages.whitebutton,
				    	x:Game.WIDTH*1/3,
				    	y:Game.WIDTH/7,
				    	w:Game.WIDTH/3,
				    	h:Game.HEIGHT/3-Game.HEIGHT/5
				    }
				    var chooseChoi={
				    	image:Gimages.whitebutton,
				    	x:Game.WIDTH*1/3,
				    	y:Game.HEIGHT*3/5,
				    	w:Game.WIDTH/3,
				    	h:Game.HEIGHT/3-Game.HEIGHT/5
				    }
				   	director.task("HocChoi", function(){
				   		// Fill màu trắng để vẽ tiêu đề
				        Game.fill(222,222,222,1);
				        var text0="Học và chơi PIANO";
				        ctx.font = (50*Game.SCALE)+'px '+Game.font;
            			ctx.fillText(text0, Game.WIDTH/2-ctx.measureText(text0).width/2, 75);
            			// Fill màu đen để vẽ chữ            			
            			Game.fill(16,16,16,1);
            			// Vẽ button image cho nút học
            			ctx.drawImage(chooseHoc.image,chooseHoc.x,chooseHoc.y,chooseHoc.w,chooseHoc.h);
            			var text1="Học PIANO";
            			ctx.font = 'bold '+ (30*Game.SCALE)+'px '+Game.font;
            			ctx.fillText(text1, Game.WIDTH/2-ctx.measureText(text1).width/2, chooseHoc.y+10+chooseHoc.h/2);
            			// Vẽ nút chơi
            			ctx.drawImage(chooseChoi.image,chooseChoi.x,chooseChoi.y,chooseChoi.w,chooseChoi.h);
            			var text2="Chơi game PIANOIC";
            			ctx.fillText(text2, Game.WIDTH/2-ctx.measureText(text2).width/2, chooseChoi.y+10+chooseChoi.h/2);
				    }, true);

				    var trinhdo1={
				    	image:Gimages.whitebutton,
				    	x:Game.WIDTH*1/3,
				    	y:Game.WIDTH/7,
				    	w:Game.WIDTH/3,
				    	h:Game.HEIGHT/3-Game.HEIGHT/5,
				    	action:function(){
				    		Game.level1={};
							Game.level1.load=true;
							Game.level1.fullData={};
							Game.level1.b=1;
							Game.level1.p=1;
							Game.lvl='level1';
							Game.lvlmax=4;
							Game.lvlpmax=2;
							td1=true;
				    	}
				    }
				    var trinhdo2={
				    	image:Gimages.whitebutton,
				    	x:Game.WIDTH*1/3,
				    	y:Game.HEIGHT*3/5-50,
				    	w:Game.WIDTH/3,
				    	h:Game.HEIGHT/3-Game.HEIGHT/5,
				    	action:function(){
				    		Game.level2={};
							Game.level2.load=true;
							Game.level2.fullData={};
							Game.level2.b=1;
							Game.level2.p=1;
							Game.lvl='level2';
							Game.lvlmax=2;
							Game.lvlpmax=2;
							td1=false;
				    	}
				    }
				    var trinhdo3={
				    	image:Gimages.whitebutton,
				    	x:Game.WIDTH*1/3,
				    	y:Game.HEIGHT*3/5+100,
				    	w:Game.WIDTH/3,
				    	h:Game.HEIGHT/3-Game.HEIGHT/5
				    }
				    var trinhdo=[trinhdo1,trinhdo2];

				    director.task("chooselevel", function(){
				   		// Fill màu trắng để vẽ tiêu đề
				        Game.fill(222,222,222,1);
				        var text0="Học PIANO";
				        ctx.font = (50*Game.SCALE)+'px '+Game.font;
            			ctx.fillText(text0, Game.WIDTH/2-ctx.measureText(text0).width/2, 75);
            			// Fill màu đen để vẽ chữ            			
            			Game.fill(16,16,16,1);
            			ctx.drawImage(trinhdo1.image,trinhdo1.x,trinhdo1.y,trinhdo1.w,trinhdo1.h);
            			var text1="Trình độ 1";
            			ctx.font = 'bold '+ (30*Game.SCALE)+'px '+Game.font;
            			ctx.fillText(text1, Game.WIDTH/2-ctx.measureText(text1).width/2, trinhdo1.y+10+trinhdo1.h/2);
            			
            			ctx.drawImage(trinhdo2.image,trinhdo2.x,trinhdo2.y,trinhdo2.w,trinhdo2.h);
            			var text2="Trình độ 2";
            			ctx.fillText(text2, Game.WIDTH/2-ctx.measureText(text2).width/2, trinhdo2.y+10+trinhdo2.h/2);
            			ctx.drawImage(globalBack.image,globalBack.x,globalBack.y,globalBack.w,globalBack.h)
            			// ctx.drawImage(trinhdo3.image,trinhdo3.x,trinhdo3.y,trinhdo3.w,trinhdo3.h);
            			// var text2="Trình độ 3";
            			// ctx.fillText(text2, Game.WIDTH/2-ctx.measureText(text2).width/2, trinhdo3.y+10+trinhdo3.h/2);
				    }, true);
					var scale = 0.7;
					var khuongnhac={x:0,y:0,w:1,h:1};
					var Intro=new BKGM.Intro(Game,'data/level1/lvl1.html',30,100,Game.WIDTH,100,1);
					var nhacdem={};
					var td1=true;
					director.taskOnce("lvl1.setup.start", function(){
						if(td1)
				        Intro.open();
				        scale=0.7;
				        MIDI.Player.stop();
				  		if(dem) dem.stop();
				  		Metronome.stop();
				        var keywhitewidth=Gimages['key.mid'].width*scale;
				   		
				        khuongnhac.x=Game.WIDTH/2-keywhitewidth*8-10;
				        khuongnhac.y=Game.HEIGHT-220;
				        khuongnhac.w=keywhitewidth*16.6;
				        khuongnhac.h=Gimages['lvl1.sol'].height;
				        
				        // Setup keyboard
				        startkey=38;
				    	Piano.startKey=startkey;
				    	drawkeyboard(scale,16,startkey);
				    	drawborder(scale);
				    	border._x=Game.WIDTH/2-border.width/2;
				   		border._y=Game.HEIGHT-230-keyBoardActorWhite.height;
				   		keyBoardActorBlack.x=keyBoardActorWhite.x=border._x+Gimages['woodbar.left'].width*scale;
				   		keyBoardActorBlack.y=keyBoardActorWhite.y=border._y+Gimages['woodbar.top'].height*scale;
				   		nhacdem.level1=[];
						// BKGM.loadJS("./data/level1/sound/sounddata.js",function(){
						// 	Game.level2.load=true;
						// 	for (var x in BKGM.MIDIDATA['level1.dem']){
						// 		var audio=new BKGM.Audio();
						// 		audio.setAudio("./data/level1/sound/"+BKGM.MIDIDATA['level1.dem'][x])
						// 		nhacdem.level1.push(audio);
						// 	}
														
						// })
				    });
					
					director.task("lvl1.background", function(){
				   		Game.background(244,238,216);
				    }, true);

				    var chooseLearn={
				    	x:Game.WIDTH/2-100-60,
				    	y:Game.HEIGHT-80,
				    	w:120,
				    	h:60,
				    	action:function(){
				    		director.switch("level1.count",true);
				    		
				    	}
				    }

				    var choosePlay={
				    	x:Game.WIDTH/2+100-60,
				    	y:Game.HEIGHT-80,
				    	w:120,
				    	h:60,
				    	action:function(){
				    		director.switch("level1.play",true);
				    	}
				    }

				    director.task("lvl1.tut", function(){
				    	Game.fill(16,16,16,1);
				    	if(td1){
				    		var text0="TRÌNH ĐỘ MỘT";
					        ctx.font = 'bold '+ (30*Game.SCALE)+'px '+Game.font;
	            			ctx.fillText(text0, Game.WIDTH/2-ctx.measureText(text0).width/2, 75);
				    	}				    	
            			// ctx.font = 'bold '+ (20*Game.SCALE)+'px '+Game.font;
            			ctx.drawImage(Gimages['lvl1.sol'],khuongnhac.x,khuongnhac.y,khuongnhac.w,khuongnhac.h);
            			
            			ctx.drawImage(Gimages.blackbutton,chooseLearn.x,chooseLearn.y,chooseLearn.w,chooseLearn.h);
            			ctx.drawImage(Gimages.blackbutton,choosePlay.x,choosePlay.y,choosePlay.w,choosePlay.h);
            			ctx.fillStyle="#e0e0e0";
            			ctx.font = 'bold '+ (25*Game.SCALE)+'px '+Game.font;
            			var text1="Học";
            			var text2="Chơi";
            			var width=chooseLearn.w/2;
            			var y=chooseLearn.y+chooseLearn.h/2+(25*Game.SCALE)/2;
            			ctx.fillText(text1, chooseLearn.x+width-ctx.measureText(text1).width/2, y);
            			ctx.fillText(text2, choosePlay.x+width-ctx.measureText(text2).width/2, y);

				    }, true);

				    // Khởi tạo phím startkey;
				    var startkey=21;
				    // Vẽ bàn phím piano
				    // Vẽ viền
				    var border = document.createElement('canvas');
				    var drawborder = function(_scale){
				    	var scale=_scale||1;
				    	var ctx=border.getContext("2d");
				    	var width = keyBoardActorWhite.width + Gimages['woodbar.right'].width*2*scale;
				    	border.width=width;
				    	border.height=Gimages['woodbar.left'].height*scale;
				    	ctx.drawImage(Gimages['woodbar.top'],0,0,width,Gimages['woodbar.top'].height*scale);
				    	ctx.drawImage(Gimages['woodbar.left'],0,0,Gimages['woodbar.left'].width*scale,Gimages['woodbar.left'].height*scale);				    	
				    	ctx.drawImage(Gimages['woodbar.right'],width-Gimages['woodbar.right'].width*scale,0,Gimages['woodbar.right'].width*scale,Gimages['woodbar.right'].height*scale);
				    	
				    }
				    // Vẽ bàn phím trắng
				    
				    var keyBoardActorWhite = Piano.keyBoardActorWhite;
				    var keyBoardActorBlack = Piano.keyBoardActorBlack;
				    var whiteKeyWidth;
				    var drawkeyboard = function(_scale,wkl,stk){
				    	var scale=_scale||1;
				    	// Khởi tạo số phím trắng và đen
				        var whiteKeyLength=wkl||22;
				        var startkey=stk%7||0;
				        
	        			// Khởi tạo vị trí và kích thước phím
	        			// Kích thước phím bấm
	        			var keywhitewidth=Gimages['key.mid'].width;
	        			var keywhiteheight=Gimages['key.mid'].height;
	        			var keyblackwidth=Gimages['key.black'].width;
	        			var keyblackheight=Gimages['key.black'].height;
				        keyBoardActorWhite.x=keyBoardActorBlack.x=0;
				        keyBoardActorWhite.y=keyBoardActorBlack.y=0;
				        keyBoardActorWhite.width=keyBoardActorBlack.width=whiteKeyLength*keywhitewidth+whiteKeyLength;
				        keyBoardActorWhite.height=keyBoardActorBlack.height=keywhiteheight+20;
				        // 2 phím trắng ở ngoài cùng và các phím bên trong
				        var key_imgs=[Gimages['key.mid'],Gimages['key.left'],Gimages['key.right']];
				        // Khởi tạo các phím trắng
				        var whiteKey=[];
				    	var minispacekey=(keyBoardActorWhite.width-keywhitewidth*whiteKeyLength)/(whiteKeyLength-2);
				    	
				    	// Khởi tạo từng phím trắng
				    	whiteKeyWidth=keywhitewidth+minispacekey;
				    	for(var i=0;i<whiteKeyLength;i++){			
				    		var whiteKeyActor = new BKGM.PianoKey();
				    		whiteKeyImgs=[Gimages['key.pressed'],Gimages['key.pressed.green'],Gimages['key.pressed.red']];
				    		whiteKeyActor.width=keywhitewidth;			
				    		whiteKeyActor.height=keywhiteheight;			
				    		whiteKeyActor.initialize(director,keyBoardActorWhite.x+whiteKeyWidth*i,keyBoardActorWhite.y,"white",i,whiteKeyImgs,_scale);
				    		// var whiteKeyActor = new CAAT.PianoKey().initialize(director,keyBoardActor,whiteKeyWidth*i,0,"white",i+blackKeyLength);
				    		whiteKey.push(whiteKeyActor);
				    	}

				    	// Khởi tạo các phím đen
				    	var blackKey=[];
				    	// Khởi tạo từng phím đen
				    	var blackKeyIndex = 0;
				    	// 2 vị trí ko có nốt đen
				    	startkey = (7- startkey)%7;
				    	var vt1=(startkey+2)%7;
				    	var vt2=(startkey+6)%7;
						for(var i=0;i<whiteKeyLength-1;i++){
							if((i%7!=vt1)&&(i%7!=vt2)){								
								var blackKeyActor = new BKGM.PianoKey();
								blackKeyActor.width=keyblackwidth;			
				    			blackKeyActor.height=keyblackheight;
								blackKeyImgs=[Gimages['key.black.pressed'],Gimages['key.black.pressed.green'],Gimages['key.black.pressed.red']];
								blackKeyActor.initialize(director,keyBoardActorWhite.x+whiteKeyWidth-keyblackwidth/2+whiteKeyWidth*i,keyBoardActorBlack.y,"black",blackKeyIndex,blackKeyImgs,_scale);
								// var blackKeyActor = new CAAT.PianoKey().initialize(director,keyBoardActor,whiteKeyWidth-keyblackwidth/2+whiteKeyWidth*i,0,"black",blackKeyIndex);
								
								blackKey.push(blackKeyActor);
								blackKeyIndex++;
							}
						}

						// Init các phím vào keyboard để vẽ
				    	keyBoardActorWhite.initialize(Game,whiteKey,key_imgs,_scale);
						keyBoardActorBlack.initialize(Game,blackKey,[Gimages['key.black']],_scale);
				    }
				    	
				    director.taskOnce("lvl1.keyboard.setup", function(){
				    	
						Metronome.toogleplay();

				   		// Game.background(243,238,216,1);
				    });
				    director.task("lvl1.keyboard.update", function(){
				   		// Game.background(243,238,216,1);
				   		Piano.update(1000/60);

				    });
				    director.task("lvl1.keyboard.draw", function(){
				   		
				   		ctx.beginPath();
				   		ctx.fillStyle="#0e0e0e";
				   		ctx.rect(border._x,border._y,border.width,border.height);
				   		ctx.fill();
				   		ctx.closePath();
				   		ctx.drawImage(border,border._x,border._y);
				   		Piano.draw(Game);
				   		ctx.drawImage(globalBack.image,globalBack.x,globalBack.y,globalBack.w,globalBack.h)
				   		// console.log(border.width,border.height)
				    }, true);
				    function initDataMIDI(){
				    	console.log(BKGM.MIDIDATA)
				    	data=Game.lvl+".b"+Game[Game.lvl].b;
				    	right=Game.lvl+".p"+Game[Game.lvl].b;
				    	left=Game.lvl+".t"+Game[Game.lvl].b;
				    	txt=Game.lvl+".txt"+Game[Game.lvl].b;
				    	Game._txt=BKGM.MIDIDATA[txt];
				    	Game.hand.right=BKGM.MIDIDATA[right].split(" ");
				    	Game.hand.left=BKGM.MIDIDATA[left].split(" ");
				    	
				    	var data = window.atob(BKGM.MIDIDATA[data].split(",")[1]);
				    	MIDIDATA0=[];
				    	MIDIDATA1=[];
				    	MIDIDATA2=[];
				    	currentNote=[];
				    	midiFile = new MidiFile(data);
				  		var replayer= new Replayer(midiFile, 1);
						var _data = replayer.getData();
						var length = _data.length;
						var time0=0;
						var time1=0;
						var time=0;
						for (j=0;j<length;j++) {
							// var currentTime=_data[j][1];
							var track = _data[j][0].track;
							time0+=_data[j][1];
							time1+=_data[j][1];
							time+=_data[j][1];
							//if (_data[n][0][j].velocity) time+=_data[n][0][j].velocity;
							if (_data[j][0].event.type=="channel" && _data[j][0].event.channel==0)
								if (_data[j][0].event.subtype=="noteOn"){
									
									var noteNum=_data[j][0].event.noteNumber;
									var velocity=_data[j][0].event.velocity;
									
									if(track==0){
										MIDIDATA0.push({note:noteNum,time:time0,velocity:velocity});
										time0=0;
									}
									else if(track==1){										
										MIDIDATA1.push({note:noteNum,time:time1,velocity:velocity});
										time1=0;
									}
									MIDIDATA2.push({note:noteNum,time:time,velocity:velocity,track:track});;
									time=0;
									
								}									
						}
						isLearning=true;
						var handleftindex,handrightindex;
						currentNoteIndex=handleftindex=handrightindex=0;
						var maxDataIndex;
						if(currentHand==BKGM.HAND_LEFT){
							maxDataIndex=MIDIDATA1.length-1;
						} else
						if(currentHand==BKGM.HAND_RIGHT){
							maxDataIndex=MIDIDATA0.length-1;
						} else
							maxDataIndex=MIDIDATA2.length-1;
						// console.log(MIDIDATA0)
						

						Piano.callbackSfx=function(soundId,velocity,unpress,nosound,type,noteNumber,hand){
							if(!unpress&&nosound){
								//console.log(type,noteNumber,currentNoteIndex,Game.hand.left[currentNoteIndex])
								// var hand=MIDIDATA2[currentNoteIndex].track;
								if(type=='white'){
									if(hand==BKGM.HAND_LEFT){
										Piano.keyBoardActorWhite.keys[noteNumber].showHandNumber(Game.hand.left[handleftindex]);
										handleftindex++;
									}										
									else if(hand==BKGM.HAND_RIGHT){
										Piano.keyBoardActorWhite.keys[noteNumber].showHandNumber(Game.hand.right[handrightindex]);
										handrightindex++
									}
										
								}									
								else
									if(hand==BKGM.HAND_LEFT){
										Piano.keyBoardActorBlack.keys[noteNumber].showHandNumber(Game.hand.left[handleftindex]);
										handleftindex++;
									}										
									else if(hand==BKGM.HAND_RIGHT){
										Piano.keyBoardActorBlack.keys[noteNumber].showHandNumber(Game.hand.right[handrightindex]);
										handrightindex++
									}
							}
							
							if(!unpress&&!nosound){
								// if(currentHand==BKGM.HAND_LEFT) nextTime=MIDIDATA0[currentNoteIndex].time;
								// else if(currentHand==BKGM.HAND_RIGHT) nextTime=MIDIDATA1[currentNoteIndex].time;
								// else if(currentHand==BKGM.HAND_BOTH){
								// 	nextTime=MIDIDATA2[currentNoteIndex].time;
								// }
								// if()

								for (var i = currentNote.length - 1; i >= 0; i--) {
									if (currentNote[i]==soundId) currentNote.splice(i,1);
								};
								if(currentNote.length>0) return;

								if(currentNoteIndex<maxDataIndex){

									currentNoteIndex++;
									var nextTime;
									if(currentHand==BKGM.HAND_RIGHT) nextTime=MIDIDATA0[currentNoteIndex].time;
										else if(currentHand==BKGM.HAND_LEFT) nextTime=MIDIDATA1[currentNoteIndex].time;
										else if(currentHand==BKGM.HAND_BOTH){
											nextTime=MIDIDATA2[currentNoteIndex].time;
										}
									setTimeout(function(){
										if(currentHand==BKGM.HAND_RIGHT) {
											currentNote.push(MIDIDATA0[currentNoteIndex].note);
											Piano.playSfx(MIDIDATA0[currentNoteIndex].note,MIDIDATA0[currentNoteIndex].velocity,false,true,0);
										}
										else if(currentHand==BKGM.HAND_LEFT) {
											currentNote.push(MIDIDATA1[currentNoteIndex].note);
											Piano.playSfx(MIDIDATA1[currentNoteIndex].note,MIDIDATA1[currentNoteIndex].velocity,false,true,1);
										}
										else if(currentHand==BKGM.HAND_BOTH){
											currentNote.push(MIDIDATA2[currentNoteIndex].note);
											Piano.playSfx(MIDIDATA2[currentNoteIndex].note,MIDIDATA2[currentNoteIndex].velocity,false,true,MIDIDATA2[currentNoteIndex].track);							
											while(MIDIDATA2[currentNoteIndex+1].time==0){
												currentNoteIndex++;
												currentNote.push(MIDIDATA2[currentNoteIndex].note);
												nextTime=MIDIDATA2[currentNoteIndex].time;
												Piano.playSfx(MIDIDATA2[currentNoteIndex].note,MIDIDATA2[currentNoteIndex].velocity,false,true,MIDIDATA2[currentNoteIndex].track);
											} 
										}

									},nextTime,false);
								} else {
									// alert("END");
								}

								
							}
						}
						if(currentHand==BKGM.HAND_RIGHT) {
							currentNote.push(MIDIDATA0[currentNoteIndex].note);
							Piano.playSfx(MIDIDATA0[currentNoteIndex].note,MIDIDATA0[currentNoteIndex].velocity,false,true,0);
						}
						else if(currentHand==BKGM.HAND_LEFT) {
							currentNote.push(MIDIDATA1[currentNoteIndex].note);
							Piano.playSfx(MIDIDATA1[currentNoteIndex].note,MIDIDATA1[currentNoteIndex].velocity,false,true,1);
						}
						else if(currentHand==BKGM.HAND_BOTH){
							currentNote.push(MIDIDATA2[currentNoteIndex].note);
							Piano.playSfx(MIDIDATA2[currentNoteIndex].note,MIDIDATA2[currentNoteIndex].velocity,false,true,MIDIDATA2[currentNoteIndex].track);							
							
							while(MIDIDATA2[currentNoteIndex+1].time==0){
								currentNoteIndex++;
								currentNote.push(MIDIDATA2[currentNoteIndex].note);
								Piano.playSfx(MIDIDATA2[currentNoteIndex].note,MIDIDATA2[currentNoteIndex].velocity,false,true,MIDIDATA2[currentNoteIndex].track);
							} 
						}
				    }
				    director.taskOnce("lvl1.count.setup", function(){
				    	Game.lvl1count=false;
				    	Intro.close();
				    	startkey=21;
				    	Piano.startKey=startkey;
				    	scale=0.5;
				    	drawkeyboard(scale,38,startkey);
				    	drawborder(scale);
				    	border._x=Game.WIDTH/2-border.width/2;
				   		border._y=Game.HEIGHT-170-keyBoardActorWhite.height;
				   		keyBoardActorBlack.x=keyBoardActorWhite.x=border._x+Gimages['woodbar.left'].width*scale;
				   		keyBoardActorBlack.y=keyBoardActorWhite.y=border._y+Gimages['woodbar.top'].height*scale;
				   		initDataMIDI();
				   		if(Game._txt)
				    	Game.alert({
				    		text:Game._txt,
				    		ok:function(){
				    			Game.count=4;
						   		

						   		Metronome.toogleplay();
						   		
						   		Game.lvl1count=true;
						   		
				    		},
				    		exit:function(){
				    			Game.count=4;
						   		Metronome.toogleplay();					   		
						   		Game.lvl1count=true;
				    		}
				    	})
				   		else {
				   			Game.count=4;
					   		Metronome.toogleplay();					   		
					   		Game.lvl1count=true;
				   		}
				   	// 	MIDI.Player.loadFile(BKGM.MIDIDATA['level1.b1'], function(){
				   	// 		Metronome.toogleplay();
				  		// 	MIDI.Player.start();
				  			
				  		// });

						// Dữ liệu 2 tay
						
				   		
				    });
				    
				    director.task("count", function(){
				    	if(!Game.lvl1count) return;
				    	if(Game.count<0) {				    		
				    		director.switch('level1.learn',true);
				    		return;
				    	}
				   			
				   		Game.count-=1/60;
				   		
				   		var count=Game.count>>0;
				   		switch(count){
				   			case 0:Game._countImg=Gimages['count0'];break;
				   			case 1:Game._countImg=Gimages['count1'];break;
				   			case 2:Game._countImg=Gimages['count2'];break;
				   			case 3:Game._countImg=Gimages['count3'];break;
				   		}
				   		

				    });
				    director.task("count", function(){
				    	if(!Game.lvl1count) return;
				    	if(Game.count<0) return;
				   		
				   		if(Game._countImg)ctx.drawImage(Game._countImg,Game.WIDTH/2-Game._countImg.width/2,Game.HEIGHT/2-Game._countImg.height/2)
				   		
				    }, true);

				    var handButton={};
				    handButton.left={
				    	x:Game.WIDTH/2-150-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){
				    		currentHand=BKGM.HAND_LEFT;
				    		director.switch('level1.count',true);
				    	}
				    }
				     handButton.both={
				    	x:Game.WIDTH/2-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){
				    		currentHand=BKGM.HAND_BOTH;
				    		director.switch('level1.count',true);
				    	}
				    }
				    handButton.right={
				    	x:Game.WIDTH/2+150-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){
				    		currentHand=BKGM.HAND_RIGHT;
				    		director.switch('level1.count',true);
				    	}
				    }
				    handButton.next={
				    	x:Game.WIDTH/2+300-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){
				    		// console.log(Game[Game.lvl].b,Game.lvlmax)
				    		if(Game[Game.lvl].b<Game.lvlmax){
				    			Game[Game.lvl].b++;
				    			director.switch('level1.count',true);
				    		} else {
				    			director.switch('level1.start',true);
				    		}
				    		
				    	}
				    }
				    handButton.back={
				    	x:Game.WIDTH/2-300-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){
				    		if(Game[Game.lvl].b>1){
				    			Game[Game.lvl].b--;
				    			director.switch('level1.count',true);
				    		} else {
				    			director.switch('level1.start',true);
				    		}
				    	}
				    }
				    director.task("handButton", function(){
				    	
				    	ctx.drawImage(Gimages['blackbutton'],handButton.left.x,handButton.left.y,handButton.left.w,handButton.left.h);
				    	
				    	ctx.drawImage(Gimages['blackbutton'],handButton.both.x,handButton.both.y,handButton.both.w,handButton.both.h);
				   		
				    	ctx.drawImage(Gimages['blackbutton'],handButton.right.x,handButton.right.y,handButton.right.w,handButton.right.h);

				    	ctx.drawImage(Gimages['blackbutton'],handButton.back.x,handButton.back.y,handButton.back.w,handButton.back.h);

				    	ctx.drawImage(Gimages['blackbutton'],handButton.next.x,handButton.next.y,handButton.next.w,handButton.next.h);
				   		ctx.fillStyle="#e0e0e0";
				   		ctx.font = "25px UTM Avo";
				   		var text0="Trái";
				   		var text1="Phải";
				   		var text2="Hai tay";
				   		var text3="Quay lại";
				   		var text4="Tiếp theo";
				   		var width=handButton.left.w/2;
				   		ctx.fillText(text0, handButton.left.x+width-ctx.measureText(text0).width/2,handButton.left.y+handButton.left.h*0.5+15);
				   		ctx.fillText(text1, handButton.right.x+width-ctx.measureText(text1).width/2,handButton.right.y+handButton.right.h*0.5+15);
				   		ctx.fillText(text2, handButton.both.x+width-ctx.measureText(text2).width/2,handButton.both.y+handButton.both.h*0.5+15);
				   		ctx.fillText(text3, handButton.back.x+width-ctx.measureText(text3).width/2,handButton.back.y+handButton.back.h*0.5+15);
				   		ctx.fillText(text4, handButton.next.x+width-ctx.measureText(text4).width/2,handButton.next.y+handButton.next.h*0.5+15);
				    }, true);

				    var clock=0;
				    var tempo=120.0;
				    var dem;
				    director.taskOnce("lvl1.keyboard.playsetup", function(){
				    	Metronome.stop();
				    	Game.metro=false;
				    	
				    	Game.count=4;
				   		Intro.close();
				   		startkey=21;
				    	Piano.startKey=startkey;
				    	scale=0.5;
				    	drawkeyboard(scale,38,startkey);
				    	drawborder(scale);
				    	border._x=Game.WIDTH/2-border.width/2;
				   		border._y=Game.HEIGHT-170-keyBoardActorWhite.height;
				   		keyBoardActorBlack.x=keyBoardActorWhite.x=border._x+Gimages['woodbar.left'].width*scale;
				   		keyBoardActorBlack.y=keyBoardActorWhite.y=border._y+Gimages['woodbar.top'].height*scale;
				   		MIDI.Player.stop();
				  		if(dem) dem.stop();
				   		MIDI.Player.loadFile(BKGM.MIDIDATA[Game.lvl+".play"+Game[Game.lvl].p], function(){
				   			// Metronome.toogleplay();
				  			// MIDI.Player.start();
				  			
				  		});
				  		// dem=nhacdem[Game.lvl][Game[Game.lvl].p-1];
				  		
				  		_callbackMIDI=function(note,velocity,unpressed,track){
				  			if(!unpressed){
				  				MIDIDATA2[currentNoteIndex].played=true;
				  				currentNoteIndex++;
				  			}
				  				
				  		}
						// Dữ liệu 2 tay
						Game.hand.right=BKGM.MIDIDATA[Game.lvl+".playp"+Game[Game.lvl].p].split(" ");
				    	Game.hand.left=BKGM.MIDIDATA[Game.lvl+".playt"+Game[Game.lvl].p].split(" ");
				    	// reset data
				    	MIDIDATA0=[];
				    	MIDIDATA1=[];
				    	MIDIDATA2=[];
				    	currentNote=[];
				    	var data = window.atob(BKGM.MIDIDATA[Game.lvl+".play"+Game[Game.lvl].p].split(",")[1]);
				    	midiFile = new MidiFile(data);
				  		var replayer= new Replayer(midiFile, 1);
						var _data = replayer.getData();
						var length = _data.length;
						var time=0;
						var numerator=4;
						var denominator=4;
						for (j=0;j<length;j++) {
							// var currentTime=_data[j][1];
							var track = _data[j][0].track;
							time+=_data[j][1];
							//if (_data[n][0][j].velocity) time+=_data[n][0][j].velocity;
							if (_data[j][0].event.type=="channel" && _data[j][0].event.channel==0)
							{	
								if (_data[j][0].event.subtype=="noteOn"){
									
									var noteNum=_data[j][0].event.noteNumber;
									var velocity=_data[j][0].event.velocity;									
									
									MIDIDATA2.push({note:noteNum,time:time,velocity:velocity,track:track});;
									time=0;
									
								}
							} else if(_data[j][0].event.type=="meta" && _data[j][0].event.subtype=="timeSignature")	{
								numerator=_data[j][0].event.numerator;
								denominator=_data[j][0].event.denominator;								
							}						
						}
						isLearning=false;
						var handleftindex,handrightindex;
						currentNoteIndex=handleftindex=handrightindex=0;
						// var maxDataIndex=MIDIDATA2.length-1;
						tempo=120.0;
						
				    	clock=-numerator*60.0/tempo*1000*4/denominator;
				    	Game.numerator=numerator;
				    	Game.denominator=denominator;
				    	Metronome.setTempo(tempo);
				    	Metronome.play();
				    	var midilength=MIDIDATA2.length;
				    	var time=0;
				    	var handleftindex,handrightindex;
						handleftindex=handrightindex=0;
						Piano.callbackSfx=function(soundId,velocity,unpress,nosound,type,noteNumber,hand){
							if(!unpress&&!nosound){
								// console.log(type,noteNumber,currentNoteIndex,hand)
								// var hand=MIDIDATA2[currentNoteIndex].track;
								if(type=='white'){
									if(hand==BKGM.HAND_LEFT){
										Piano.keyBoardActorWhite.keys[noteNumber].showHandNumber(Game.hand.left[handleftindex]);
										handleftindex++;
									}										
									else if(hand==BKGM.HAND_RIGHT){
										Piano.keyBoardActorWhite.keys[noteNumber].showHandNumber(Game.hand.right[handrightindex]);
										handrightindex++
									}
										
								}									
								else{
									if(hand==BKGM.HAND_LEFT){
										Piano.keyBoardActorBlack.keys[noteNumber].showHandNumber(Game.hand.left[handleftindex]);
										handleftindex++;
									}										
									else if(hand==BKGM.HAND_RIGHT){
										Piano.keyBoardActorBlack.keys[noteNumber].showHandNumber(Game.hand.right[handrightindex]);
										handrightindex++
									}
										
								}				
							}
							
							
				   		
				    	};
						for(var i=currentNoteIndex;i<midilength;i++){
							var currentKey = MIDIDATA2[i];							
							var noteNum=currentKey.note-(startkey/7*12>>0);
							var xcast=noteNum%12;
							var type;
							if (noteNum%12==1||noteNum%12==3||noteNum%12==6||noteNum%12==8||noteNum%12==10)
							{
								type='black';
								var mmm=(noteNum/12)>>0;
								switch(xcast){
									case 1:noteNum=mmm*5+0;break;
									case 3:noteNum=mmm*5+1;break;
									case 6:noteNum=mmm*5+2;break;
									case 8:noteNum=mmm*5+3;break;
									case 10:noteNum=mmm*5+4;break;
								}
							} else
							{
								type='white';
								var mmm=(noteNum/12)>>0;
								switch(xcast){
									case 0:noteNum=mmm*7+0;break;
									case 2:noteNum=mmm*7+1;break;
									case 4:noteNum=mmm*7+2;break;
									case 5:noteNum=mmm*7+3;break;
									case 7:noteNum=mmm*7+4;break;
									case 9:noteNum=mmm*7+5;break;											
									case 11:noteNum=mmm*7+6;break;
								}
								// noteNum+=25;
							}
							MIDIDATA2[i].index=noteNum;
							time+=currentKey.time;
							MIDIDATA2[i].playtime=time;
							MIDIDATA2[i].type=type;
								
								
						}
				    });
					
					director.task("lvl1.background1", function(){
						ctx.drawImage(Gimages['bg'],0,0,Game.WIDTH,Game.HEIGHT)
				    }, true);

					var currentPlayBack={};
					var playbackstop=false;
				    director.task("lvl1.playback", function(){
				    	clock+=1000/60;
				    	if(!Game.metro&&clock>=0){
				    		Metronome.stop();
				    		// MIDI.Player.stop();
				    		MIDI.Player.start();
				    		if(dem) {
				    			dem.play();
				    		}
				    		MIDI.Player.right=Game.hand.right;
				    		MIDI.Player.left=Game.hand.left;
				    		Game.metro=true;
				    	}
				    	var playedTime=clock;
				  //   	if(!playbackstop)
				  //   	if(playedTime>=MIDIDATA2[currentNoteIndex].playtime){
						// 	if((currentNoteIndex>MIDIDATA2.length-1)&&
						// 		(playedTime<MIDIDATA2[currentNoteIndex].playtime+1000)) return;
						// 	// if(global.AUTOPLAY){
						// 		// if(global.PLAY_FILE)
						// 			// playKey(MIDIDATA2[currentNoteIndex].keyIndex,true);
						// 		// else 
						// 		Piano.playSoundId(MIDIDATA2[currentNoteIndex].note,MIDIDATA2[currentNoteIndex].velocity);
						// 	// }
						// 	if(currentNoteIndex===MIDIDATA2.length-1) {
						// 		playbackstop=true;
						// 		// global.PLAYING_RECORD = false;
						// 		// endPlayback();
						// 		// menuContainer.playButton.setPlayImage();
						// 		// console.log("end");
						// 	}
						// 	else currentNoteIndex++;
						// }
						
						// for(var i=currentNoteIndex+1;i<MIDIDATA2.length;i++){
						// 	if(playedTime<MIDIDATA2[i].playtime+200) {
						// 		break;
						// 	}
						// 	else{
						// 		currentNoteIndex++;
						// 	}
						// }
				    });
					var nextprePlay={};
					nextprePlay.refresh={
				    	x:Game.WIDTH/2-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){				    		
				    		director.switch('level1.play',true);				    		
				    		
				    	}
				    }
					nextprePlay.next={
				    	x:Game.WIDTH/2+150-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){
				    		// console.log(Game[Game.lvl].b,Game.lvlmax)
				    		if(Game[Game.lvl].p<Game.lvlpmax){
				    			Game[Game.lvl].p++;
				    			director.switch('level1.play',true);
				    		} else {
				    			director.switch('level1.start',true);
				    		}
				    		
				    	}
				    }
				    nextprePlay.back={
				    	x:Game.WIDTH/2-150-60,
				    	y:Game.HEIGHT-60,
				    	w:120,
				    	h:50,
				    	action:function(){				    		
				    		if(Game[Game.lvl].p>1){
				    			Game[Game.lvl].p--;
				    			director.switch('level1.play',true);
				    		} else {
				    			director.switch('level1.start',true);
				    		}
				    		
				    	}
				    }
				    director.task("nextprePlay", function(){
				   		
				    	ctx.drawImage(Gimages['blackbutton'],nextprePlay.refresh.x,nextprePlay.refresh.y,nextprePlay.refresh.w,nextprePlay.refresh.h);

				    	ctx.drawImage(Gimages['blackbutton'],nextprePlay.back.x,nextprePlay.back.y,nextprePlay.back.w,nextprePlay.back.h);

				    	ctx.drawImage(Gimages['blackbutton'],nextprePlay.next.x,nextprePlay.next.y,nextprePlay.next.w,nextprePlay.next.h);
				   		ctx.fillStyle="#e0e0e0";
				   		ctx.font = "25px UTM Avo";
				   		var text2="Chơi lại";
				   		var text3="Quay lại";
				   		var text4="Tiếp theo";
				   		var width=nextprePlay.refresh.w/2;				   		
				   		// Game.text(text2, nextprePlay.refresh.x,nextprePlay.refresh.y+nextprePlay.refresh.h*0.5+15,25,false,nextprePlay.back.w);
				   		ctx.fillText(text2, nextprePlay.refresh.x+width-ctx.measureText(text2).width/2,nextprePlay.refresh.y+nextprePlay.refresh.h*0.5+15);
				   		ctx.fillText(text3, nextprePlay.back.x+width-ctx.measureText(text3).width/2,nextprePlay.back.y+nextprePlay.back.h*0.5+15);
				   		ctx.fillText(text4, nextprePlay.next.x+width-ctx.measureText(text4).width/2,nextprePlay.next.y+nextprePlay.next.h*0.5+15);
				    }, true);

				    var timePerScene=3000;
				    director.task("lvl1.playback", function(){
				    	var height=border._y;
						var playedTime = clock;//((global.PAUSING_RECORD)?pausedStart:time) - recordStartTime;
						var passedPixel = playedTime/timePerScene*height//*this.height;
						var whiteKey = keyBoardActorWhite.keys;
						
						//if(recordData[10].time==scene.recordData[10].time)console.log("scene.recordData");
						var midilength=MIDIDATA2.length;
						if(currentNoteIndex>midilength-2) return;
						Game.stroke("#f00",1);
						var milisecondperBeat=Game.numerator*60000/tempo*4/Game.denominator;
						var beatindex=(playedTime/milisecondperBeat+0.9)>>0;
						var numberBeat=timePerScene/milisecondperBeat+beatindex;
						// console.log(beatindex,numberBeat)
						for (var i = beatindex; i < numberBeat; i++) {
							var y = height + passedPixel-i*milisecondperBeat/timePerScene*height;
							// var y=passedPixel*i;
							Game.line(0,y,Game.WIDTH,y);
						};						
						for(var i=currentNoteIndex;i<midilength;i++){
							var currentKey = MIDIDATA2[i];
							// if(playerKeyData[i]) continue;
							// console.log(currentKey)
							if(currentKey.playtime>(playedTime+timePerScene)) break;
							var hitKeyActor;
							// ctx.font = "30px UTM Avo";
							// var giftboxSize =30;
							// var key="";
							// var bgcolor;
							
							// key= global.PIANO_KEY_SHOW ? keyData[key.keyIndex].name : convertkeyCodetoString(keyData[key.keyIndex].keyCode[0],key.isShift,0).str;
							// 	bgcolor=objkey.color;
							if(currentKey.type=="white"){
								
								hitKeyActor = whiteKey[currentKey.index];
								// ctx.fillStyle = bgcolor||"#FFF";
								// ctx.strokeStyle = "#000";
								var posY = height + passedPixel -Gimages['cardnote.white'].height*scale - currentKey.playtime/timePerScene*height;
								//ctx.fillRect(hitKeyActor.x,posY,hitKeyActor.width,hitKeyActor.width);
								//ctx.strokeRect(hitKeyActor.x,posY,hitKeyActor.width,hitKeyActor.width);

								// whitecard=(currentKey.isShift[0]?director.getImage(playbackKeystyle.imgs[3]):director.getImage(playbackKeystyle.imgs[1]));
								// var x= (hitKeyActor.x-Gimages['cardnote.white'].width/2)*scale;
								var x= (keyBoardActorWhite.x+hitKeyActor._x);
								var y=(posY);
								// document.getElementById('console').innerHTML=x+"-"+y;
								// console.log(y)
								ctx.drawImage(Gimages['cardnote.white'],x,y,Gimages['cardnote.white'].width*scale,Gimages['cardnote.white'].height*scale)//,giftboxSize,giftboxSize);
								// console.log(hitKeyActor.x-hitKeyActor.width/2,posY+hitKeyActor.width,Gimages['cardnote.white'].width,Gimages['cardnote.white'].height)
								// if(global.SHOW_PLAYBACK_TEXT){
								// 	ctx.fillStyle = bgcolor||playbackKeystyle.text.fillStyle1;
								// 	ctx.font=playbackKeystyle.text.font;
								// 	ctx.fillText(key,hitKeyActor.x-hitKeyActor.width/2+whitecard.width/2-ctx.measureText(key).width/2,playbackKeystyle.text.textHeight+posY);
								// }
								//ctx.fillStyle = "#000";
								//ctx.fillText(key.toLowerCase(),hitKeyActor.x+2,hitKeyActor.width+posY-2);
							} 
							else {
								hitKeyActor = blackKey[currentKey.index];
							// 	ctx.fillStyle = bgcolor||"#000";
								var posY = height + passedPixel - Gimages['cardnote.black'].width*scale-currentKey.playtime/timePerScene*height;
								var x= (keyBoardActorBlack.x+hitKeyActor._x);
								var y=(posY);
							// 	var blackcard=(currentKey.isShift[0]?director.getImage(playbackKeystyle.imgs[2]):director.getImage(playbackKeystyle.imgs[0]));
								ctx.drawImage(Gimages['cardnote.black'],x,y,Gimages['cardnote.black'].width,Gimages['cardnote.black'].height)//,giftboxSize,giftboxSize);
							// 	if(global.SHOW_PLAYBACK_TEXT){
							// 		ctx.fillStyle = bgcolor||playbackKeystyle.text.fillStyle2;
							// 		ctx.font=playbackKeystyle.text.font;
							// 		ctx.fillText(key,hitKeyActor.x-hitKeyActor.width/2+blackcard.width/2-ctx.measureText(key).width/2-10,playbackKeystyle.text.textHeight+posY);
							// 	}
							}
						}
				   		// Game.background(243,238,216,1);
				    },true);
				    // Khi click hoac touch
				    Game.mouseDown=function(e){
				    	_down(e);
				    }
				    Game.touchStart=function(e){
				    	_down(e);
				    }
				    
				    var _checkKeyPiano=function(e){
				    	if(BKGM.checkMouseBox(e,keyBoardActorWhite)){
		   							var keyActor;
									var dx=dy=0;
									var blackKey = keyBoardActorBlack.keys;
									var whiteKey = keyBoardActorWhite.keys;
									var whiteKeyWidth=keyBoardActorWhite.width/keyBoardActorWhite.keys.length;
									var blackKeyWidth=blackKey[0].width*scale;
									var blackKeyHeight=blackKey[0].height*scale;

									var ex=e.x-keyBoardActorWhite.x;
									var ey=e.y-keyBoardActorWhite.y;
									// var whiteKeyWidth = 
									for(var i=0;i<blackKey.length;i++){
										if((ex>=blackKey[i].x*scale)&&(ex<=blackKey[i].x*scale+blackKeyWidth)&&(ey>=blackKey[i].y*scale)&&(ey<=blackKey[i].y*scale+blackKeyHeight)){
											keyActor = blackKey[i];
											break;
										}
									}
									if(!keyActor){
										var index = (ex/whiteKeyWidth)<<0;
										keyActor = whiteKey[index];
									}
									if(!keyActor) return;
									// MIDIDATA2[currentNoteIndex].played=true;
									Piano.playKey(keyActor.keyIndex,keyActor.type,startkey)
									// console.log(keyActor.keyIndex,keyActor.type)
									// Piano.playSfx(keyActor.keyIndex+50)
									// keyPress(keyActor.keyIndex);
									Piano._keyPress=keyActor;

		   						} 
		   						// else{
		   						// 	if(director.current=="level1.start"&&Game.level1.load) 
		   						// 		director.switch("level1.count")
		   						// 	else  if(Piano._isClick) {
		   						// 		MIDI.Player.resume();
		   						// 		Piano._isClick=true;
		   						// 	}
		   						// }
				    }
				    var _down=function(e){
				    	//Khi ấn chuột tại states
				   		switch(director.current){
				   			case "ready":
				   				// if(Game.Metro.turnedOn)Game.Metro.stop();
				   				// else Game.Metro.start();
				   				if(BKGM.checkMouseBox(e,chooseHoc)){
				   					director.switch("menu");
				   					Game.canvas.style.cursor= "default";
				   				}
				   				if(BKGM.checkMouseBox(e,chooseChoi)){
				   					location.href="/PIANOIC/"
				   				}
				   				break;
			   				case "menu":
			   					for (var i in trinhdo) {
		   							if(BKGM.checkMouseBox(e,trinhdo[i])){
		   								trinhdo[i].action();
		   								director.switch('level1.start');
		   							}
		   						};
			   					// if(BKGM.checkMouseBox(e,chooseHoc)){
			   					// 	lvlhientai=1;
				   				// 	director.switch('level1.start');
				   				// 	Game.canvas.style.cursor= "default";
				   				// }
				   				// if(BKGM.checkMouseBox(e,chooseChoi)){
				   				// 	lvlhientai=2;
				   				// 	director.switch('level1.start');
				   				// 	Game.canvas.style.cursor= "default";
				   				// }
			   					break;
			   				case "level1.start":
			   				// console.log(111)
			   					_checkKeyPiano(e);

			   					if(Game[Game.lvl].load)
			   					if(BKGM.checkMouseBox(e,chooseLearn)){
		   								chooseLearn.action();
	   							} else
	   							if(BKGM.checkMouseBox(e,choosePlay)){
		   								choosePlay.action();
	   							}
			   					break;
		   					case "level1.learn":
		   						_checkKeyPiano(e);
		   						for (var i in handButton) {
		   							if(BKGM.checkMouseBox(e,handButton[i])){
		   								handButton[i].action();
		   							}
		   						};
								break;
							case "level1.play":
		   						_checkKeyPiano(e);
		   						for(var i in nextprePlay) {
		   							if(BKGM.checkMouseBox(e,nextprePlay[i])){
		   								nextprePlay[i].action();
		   							}
		   						};

				   		}
				   		if(BKGM.checkMouseBox(e,globalBack)){
				   			globalBack.action();
				   		}
				   	}
				   	// Khi bỏ chuột
				   	Game.mouseUp=function(e){
				    	_up();
				    }
				   	var _up=function(e){
				   		switch(director.current){
				   			case "level1":
				   				if(Piano._keyPress) {
				   					Piano._keyPress.unpressed();
				   					Piano._keyPress=null;
				   				}
				   				break;
			   				default :
			   					if(director.current=="level1.start"||director.current=="level1.learn"||director.current=="level1.play")	
				   				if(Piano._keyPress) {
				   					Piano._keyPress.unpressed();
				   					Piano._keyPress=null;
				   				}
				   				break;
				   		}
				   		
				   	}

				   	// Khi di chuot
				   	Game.mouseMove=function(e){
				    	_move(e);
				    }
				   	var _move=function(e){
				   		switch(director.current){
				   			case "ready":				   				
				   				if(BKGM.checkMouseBox(e,chooseHoc)||BKGM.checkMouseBox(e,chooseChoi)){
				   					Game.canvas.style.cursor= "pointer";
				   				} else
				   				Game.canvas.style.cursor= "default";
				   				break;
			   				case "menu":
			   					if(BKGM.checkMouseBox(e,chooseHoc)||BKGM.checkMouseBox(e,chooseChoi)){
				   					Game.canvas.style.cursor= "pointer";
				   				} else
				   				Game.canvas.style.cursor= "default";
			   					break;
				   		}
				   		
				   	}
				    director.switch("ready");
			    },
			    draw: function(Game){
			        // Runs every interval
			        director.draw(Game);
			    },
			    update: function(){
			    	//Run every 100060 ms
			    	// 
			    	director.run();
			    }
			}).run();
        }
	// };
})()