(function () {
	var GetKeyBefore = function(startKey){
		var beforekeys = (startKey/7>>0)*12;
        	switch(startKey%7){
        		case 0: break;
        		case 1: beforekeys+=2;
        				break;
        		case 2: beforekeys+=4;
        				break;
				case 3: beforekeys+=5;
						break;
        		case 4: beforekeys+=7;
        				break;
        		case 5: beforekeys+=9;
        				break;
				case 6: beforekeys+=11;
						break;
        	}
        return beforekeys;
	}
    BKGM.Piano = function (Game,startKey) {
    	this.keyBoardActorWhite = new BKGM.KeyBoardContainer();
	    this.keyBoardActorBlack = new BKGM.KeyBoardContainer();
	    this.sound = new BKGM.PianoSound();
	    this.Game=Game;
	    this.startKey=startKey||21;
	    var _this=this;
	    Game.playMIDI=function(a,b,c){_this.playMIDI(a,b,c)};
        return this;
    }

    BKGM.Piano.prototype = {
    	_keyPress:null,
    	autoPlay:false,
    	playSfx:function(soundId,velocity,unpress,nosound,hand){
    		
    		
    		var type="";
    		var noteNum=soundId;
			
				noteNum=noteNum-(GetKeyBefore(this.startKey)/12>>0)*12;
			var xcast=noteNum%12;
			if (noteNum%12==1||noteNum%12==3||noteNum%12==6||noteNum%12==8||noteNum%12==10)
			{
				
				var mmm=(noteNum/12)>>0;
				switch(xcast){
					case 1:noteNum=mmm*5+0;break;
					case 3:noteNum=mmm*5+1;break;
					case 6:noteNum=mmm*5+2;break;
					case 8:noteNum=mmm*5+3;break;
					case 10:noteNum=mmm*5+4;break;
				}
				var num=this.startKey%7;
				if (num==0) noteNum=noteNum;
				else if(num<2) noteNum-=num;
				else if(num<6) noteNum-=num-1;
				else noteNum-=num-2;
				type="black";
			} else
			{
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
				noteNum-=this.startKey%7;
				type="white";
			}
			if(type==='white') {
				if(this.keyBoardActorWhite.keys[noteNum])
				{
					if(!unpress){
						// this.keyBoardActorWhite.keys[noteNum].showHandNumber(this.Game.hand.left[currentNoteIndex]);
						this.keyBoardActorWhite.keys[noteNum].pressed();
					}						
					else
						this.keyBoardActorWhite.keys[noteNum].unpressed();
				}
			} else 
			if(type === 'black'){
				if(this.keyBoardActorBlack.keys[noteNum])
				{
					if(!unpress){
						this.keyBoardActorBlack.keys[noteNum].pressed();
					}						
					else
						this.keyBoardActorBlack.keys[noteNum].unpressed();
				}
			}

			if(!unpress&&!nosound) this.sound.playSfx(soundId,velocity);
			if(this.callbackSfx) this.callbackSfx(soundId,velocity,unpress,nosound,type,noteNum,hand);
    	},
    	// Nhận từ phím piano
    	playMIDI:function(a,b,c){
    		if(c!='00')
    			this.playSfx(b,c,false);
    		else
    			this.playSfx(b,c,true);
    	},
    	// Chạy piano với soundId
        playSoundId:function(soundId,velocity){
        	this.playSfx(soundId,velocity);
        	var self=this;
        	// setTimeout(function(){
        		self.playSfx(soundId,0,true);
        	// },1000,false)
        },
        // Chạy piano theo key
        playKey:function(id,type,startKey){ //id: thứ tự nốt, type: trắng hay đen, stk: startKey
        	var soundId=0;
        	if (type==='white') startKey = startKey+id;
        	var soundId = (startKey/7>>0)*12;
        	switch(startKey%7){
        		case 0: break;
        		case 1: soundId+=2;
        				break;
        		case 2: soundId+=4;
        				break;
				case 3: soundId+=5;
						break;
        		case 4: soundId+=7;
        				break;
        		case 5: soundId+=9;
        				break;
				case 6: soundId+=11;
						break;
        	}
        	if (type==='white'){
        		this.playSfx(soundId);
        	} else {
        		soundId+=(id/5>>0)*12;
        		var blackId=id%5;
        		switch(startKey%7)
        		{
	        		case 0: if(blackId==0) soundId++;
	        				else if(blackId==1) soundId+=3;
	        				else if (blackId==2) soundId+=6;
	        				else if (blackId==3) soundId+=8;
	        				else if (blackId==4) soundId+=10;
	        				break;
	        		case 1: if(blackId==0) soundId++;
	        				else if(blackId==1) soundId+=4;
	        				else if (blackId==2) soundId+=6;
	        				else if (blackId==3) soundId+=8;
	        				else if (blackId==4) soundId+=11;
	        				break;
	        		case 2: if(blackId==0) soundId+=2;
	        				else if(blackId==1) soundId+=4;
	        				else if (blackId==2) soundId+=6;
	        				else if (blackId==3) soundId+=9;
	        				else if (blackId==4) soundId+=11;
	        				break;
					case 3: if(blackId==0) soundId++;
	        				else if(blackId==1) soundId+=3;
	        				else if (blackId==2) soundId+=5;
	        				else if (blackId==3) soundId+=8;
	        				else if (blackId==4) soundId+=10;
							break;
	        		case 4: if(blackId==0) soundId++;
	        				else if(blackId==1) soundId+=3;
	        				else if (blackId==2) soundId+=6;
	        				else if (blackId==3) soundId+=8;
	        				else if (blackId==4) soundId+=11;
	        				break;
	        		case 5: if(blackId==0) soundId++;
	        				else if(blackId==1) soundId+=4;
	        				else if (blackId==2) soundId+=6;
	        				else if (blackId==3) soundId+=9;
	        				else if (blackId==4) soundId+=11;
	        				break;
					case 6: if(blackId==0) soundId+=2;
	        				else if(blackId==1) soundId+=4;
	        				else if (blackId==2) soundId+=7;
	        				else if (blackId==3) soundId+=9;
	        				else if (blackId==4) soundId+=11;
							break;
	        	}
        		this.playSfx(soundId);
        	}
        },
        update:function(dt){
        	this.keyBoardActorWhite.update(dt);
	    	this.keyBoardActorBlack.update(dt);
        },
        draw:function(Game){
        	this.keyBoardActorWhite.draw(Game);
	    	this.keyBoardActorBlack.draw(Game);
        }
    }
})();
(function () {
    BKGM.KeyBoardContainer = function () {
        return this;
    }

    BKGM.KeyBoardContainer.prototype = {
        initialize: function (Game,keys,imgs,scale) {
			this.keys = keys;
			var canvas=document.createElement('canvas');
			var ctx=canvas.getContext('2d');
			var length=this.keys.length;
			var width = keys[0].width;
			var height = keys[0].height;
			canvas.width=this.width;
			canvas.height=this.height;
			
			for(var i=0;i<length;i++) {
				var key = this.keys[i];
				
				var x = key.x-this.x;
				var y = 0;
				if ((key.type == "black")||(i!=0&&i!=length-1))
					ctx.drawImage(imgs[0],x,  y,width,height);
				else {
					
					i==0?ctx.drawImage(imgs[1],x,  y,width,height):ctx.drawImage(imgs[2],x,  y,width,height);;
				}					
			}
			this.canvas=document.createElement('canvas');
			var ctx=this.canvas.getContext('2d');
			this.width*=scale;
			this.height*=scale;
			this.canvas.width=this.width;
			this.canvas.height=this.height;
			ctx.drawImage(canvas,0,0,this.width,this.height);
            return this;
        },
        update:function(dt){
        	var i = this.keys.length - 1; 
        	for (i;i >= 0; i--) {
				this.keys[i].update(dt);
			};
        },
        draw: function (Game,time) {
            var ctx = Game.ctx;

			if(this.canvas){				
				ctx.drawImage(this.canvas,this.x,this.y);
				var i = this.keys.length - 1; 
				for (i;i >= 0; i--) {
					this.keys[i].draw(Game,this.x,this.y);
				};								
			}
            return this;
        }
    }
})();
(function () {
	BKGM.PianoKey = function () {
        BKGM.PianoKey.superclass.constructor.call(this);
        return this;
    }
    BKGM.PianoKey.prototype = {
	initialize : function (director, posX, posY, type, keyIndex,imgs,scale) {
		this.director = director;
		// this.keyBoardActor = keyBoardActor;
		this.x = posX;
		this.y = posY;
		this._x=posX*scale;
		this._y=posY*scale;
		width=this.width;
		height=this.height;
		this.keyIndex = keyIndex;
		this.hitting = false;
		this.type = type;
		this.imgs=imgs;
		this.img=imgs[1];
		this.visible=false;
		var canvas=document.createElement('canvas');
		var ctx=canvas.getContext('2d');
		canvas.width=this.width;
		canvas.height=this.height;
		ctx.drawImage(this.img,0,0,width,height);
		this.count=0;
		this.canvas=document.createElement('canvas');
		var ctx=this.canvas.getContext('2d');
		// this.width*=scale;
		// this.height*=scale;
		this.canvas.width=this.width*scale;
		this.canvas.height=this.height*scale;
		ctx.drawImage(canvas,0,0,this.canvas.width,this.canvas.height);
		// var img=new BKGM.SpriteImage(director.getImage(imgs[0]),1,1);
		// this.shadow = new BKGM.ActorContainer().setBackgroundImage(img).setBounds(posX,posY,width,height).setAlpha(0).enableEvents(false).setVisible(false);
		// this.pressedgreen = new BKGM.ActorContainer().setBounds(posX,posY,width,height).enableEvents(false).setVisible(false);
		
		// // var hitkeygreenstyle=PianoicStyle.playbackBoard.child.hitkeygreen;
		// this.hitkeygreen = new BKGM.Foundation.ActorContainer();
		// var img=setPianoicStyle(director,this.hitkeygreen,hitkeygreenstyle);
		// this.hitkeygreen.setLocation(posX,playbackBoard.height-img[0].height).
		//this.hitkeygreen.setLocation(posX,posY-img[0].height).
			// enableEve	nts(false).setVisible(false);		
		// keyBoardActor.addChild(this.pressedgreen);
		// playbackBoard.addChild(this.hitkeygreen);
		// keyBoardActor.addChild(this.shadow);
		return this;
	},
	update:function(dt){
		if(!this.visible||!this.count) return;
		this.count-=dt;
		if(this.count<0.1){
			this.visible=false;
			// this.showText=false;
		}
	},
	draw: function(Game,x,y){
		if(this.visible){
			var ctx=Game.ctx;
			if(this.canvas) {
				ctx.save();
				if(this.count) {
					ctx.globalAlpha=this.count*0.001;
				}
				ctx.drawImage(this.canvas,x+this._x,y+this._y);
				ctx.restore();
				if(this.showText){
					ctx.fillStyle="0e0e0e";
				ctx.font = "bold "+(30*Game.SCALE)+'px '+Game.font;
				var text=this.number;
				ctx.fillText(text, x+this._x, y+this._y+this.height-20);
				}				
			}
		}
		
	},
	score: function(time){
		var self = this;
		// var alphaBehavior = new BKGM.Behavior.AlphaBehavior().setValues(1, 0).setDelayTime(0, 1000).setCycle(false).
		// 	addListener({
		// 		behaviorExpired: function(director, time) {
		// 			self.hitkeygreen.setVisible(false);
		// 			self.hitkeygreen.emptyBehaviorList();
		// 		}
		// 	});
		// this.hitkeygreen.addBehavior(alphaBehavior);
		this.hitkeygreen.setVisible(true);
		return this;
	},
	hit : function(){
			var self = this;
			if(this.hitting){
				this.shadow.emptyBehaviorList();
			}
			this.hitting = true;
			var alphaBehavior = new BKGM.Behavior.AlphaBehavior().setValues(1, 0).setDelayTime(0, 1000).setCycle(false).
			addListener({
				behaviorExpired: function(director, time) {
					self.shadow.setVisible(false);
					self.shadow.emptyBehaviorList();
				}
			});
			this.shadow.addBehavior(alphaBehavior);
			this.shadow.setVisible(true);
			return this;
	},
	showHandNumber:function(number){
		this.number=number+"";
		this.showText=true;
	},
	pressed:function(type){
		var self=this;
		this.img=this.imgs[1];
		this.visible=true;
		this.count=null;

		// type==0?this.pressedgreen.setBackgroundImage(self.imgs[1]).setVisible(true):this.pressedgreen.setBackgroundImage(self.imgs[2]).setVisible(true);
	},
	unpressed:function(){
		this.count=1000;
		this.showText=false;
		// this.pressedgreen.setBackgroundImage(this.imgs[1]).setVisible(false);
	}
	}
	extend(BKGM.PianoKey, BKGM.Actor);

})();