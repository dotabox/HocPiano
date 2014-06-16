
(function () {
    CAAT.HighScoreContainer = function () {
        CAAT.HighScoreContainer.superclass.constructor.call(this);
        return this;
    }

    CAAT.HighScoreContainer.prototype = {
        initialize: function (menuContainer) {
			var self = this;
            this.director = menuContainer.director;
			this.global = this.director.globalVariables;
			var global=this.global;
			var LANGUAGE=global.LANGUAGE;
			this.menuContainer = menuContainer;
			var lang=LANG.highscore.difficulty;
			this.difficultyText = [lang.easy[LANGUAGE],lang.hard[LANGUAGE],lang.insane[LANGUAGE]];
			this.playButtonWidth = 100;
			this.playButtonHeight = 40;
			this.playButtonY = this.height - 110;
			var director=this.director;
			var difficultystle=PianoicStyle.highScoreContainer.child.difficulty;
			var difficulty = new CAAT.Foundation.ActorContainer();
			setPianoicStyle(director,difficulty,difficultystle);
			this.addChild(difficulty);

			var highScoreContainerbgColor=PianoicStyle.highScoreContainer.bgcolor;
			var easy=new CAAT.Foundation.Actor();
			setPianoicStyle(director,easy,difficultystle.easy);
			var easybgcolor=difficultystle.easy.bgcolor;
			easy.paint=function(director,time){
				var ctx = director.ctx;
				ctx.fillStyle=(global.DIFFICULTY==0)?highScoreContainerbgColor:easybgcolor;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.fillStyle=difficulty.text.fillStyle;
				ctx.font=difficulty.text.font;
				var text=self.difficultyText[0];
				var posX=this.width/2- ctx.measureText(text).width/2;
				ctx.fillText(text,posX,this.height/2+ difficulty.text.textHeight/2);

			}
			easy.mouseDown=function(e){
				global.DIFFICULTY=0;
			}
			var hard=new CAAT.Foundation.Actor();
			setPianoicStyle(director,hard,difficultystle.hard);
			var hardbgcolor=difficultystle.hard.bgcolor;
			hard.paint=function(director,time){
				var ctx = director.ctx;
				ctx.fillStyle=(global.DIFFICULTY==1)?highScoreContainerbgColor:hardbgcolor;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.fillStyle=difficulty.text.fillStyle;
				ctx.font=difficulty.text.font;
				var text=self.difficultyText[1];
				var posX=this.width/2- ctx.measureText(text).width/2;
				ctx.fillText(text,posX,this.height/2+ difficulty.text.textHeight/2);

			}
			hard.mouseDown=function(e){
				global.DIFFICULTY=1;
			}
			var insane=new CAAT.Foundation.Actor();
			setPianoicStyle(director,insane,difficultystle.insane);
			var insanebgcolor=difficultystle.insane.bgcolor;
			insane.paint=function(director,time){
				var ctx = director.ctx;
				ctx.fillStyle=(global.DIFFICULTY==2)?highScoreContainerbgColor:insanebgcolor;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.fillStyle=difficulty.text.fillStyle;
				ctx.font=difficulty.text.font;
				var text=self.difficultyText[2];
				var posX=this.width/2- ctx.measureText(text).width/2;
				ctx.fillText(text,posX,this.height/2+ difficulty.text.textHeight/2);

			}
			insane.mouseDown=function(e){
				global.DIFFICULTY=2;
			}
			difficulty.addChild(easy);
			difficulty.addChild(hard);
			difficulty.addChild(insane);
			
			var statsstyle=PianoicStyle.highScoreContainer.child.stats;
			var stats = new CAAT.Foundation.ActorContainer();
			var img_stats=setPianoicStyle(self.director,stats,statsstyle);
			var iconstats=new CAAT.Foundation.Actor().setBackgroundImage(img_stats[0]);
			stats.addChild(iconstats);
			stats.paint=function(){
				var ctx = director.ctx;
				ctx.fillStyle=statsstyle.text.fillStyle;
				ctx.font=statsstyle.text.font;
				var score;
				var pointData = global.pointData;
				for (var i=0;i<pointData.length;i++)
					if(pointData[i].id==musicList[global.SELECTING_RECORD].ID)
						score = pointData[i].lv[global.DIFFICULTY]+"";
				ctx.fillText(score,statsstyle.text.posX,statsstyle.text.posY);
			}
			this.addChild(stats);
			var durationstyle=PianoicStyle.highScoreContainer.child.duration;
			var duration = new CAAT.Foundation.ActorContainer();
			var img_duration=setPianoicStyle(self.director,duration,durationstyle);
			var iconduration=new CAAT.Foundation.Actor().setBackgroundImage(img_duration[0]);
			duration.addChild(iconduration);			
			this.addChild(duration);

			var playstyle=PianoicStyle.highScoreContainer.child.play;
			var play = new CAAT.Foundation.Actor();
			setPianoicStyle(self.director,play,playstyle);
			var text_play=LANG.highscore.play[LANGUAGE];
			var playcolor=playstyle.bgcolor;
			play.paint=function(){
				var ctx = director.ctx;
				ctx.fillStyle=playcolor;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.fillStyle=playstyle.text.fillStyle;
				ctx.font=playstyle.text.font;				
				var posX=this.width/2- ctx.measureText(text_play).width/2;
				ctx.fillText(text_play,posX,this.height/2+ playstyle.text.textHeight/2);
			}
			play.mouseUp=function(){
				self.playButtonFunction();
			}
			play.mouseEnter=function(){
				playcolor=playstyle.colorenter;
			}
			play.mouseExit=function(){
				playcolor=playstyle.bgcolor;
			}
			this.addChild(play);
            return this;
        },
        paint: function (director,time) {
			CAAT.HighScoreContainer.superclass.paint.call(this, director, time);
            var ctx = director.ctx;
			
			
			
			if(this.loading){
				ctx.globalAlpha = 0.7;
				ctx.fillStyle = "#000";
				ctx.fillRect(-this.x,-this.y,director.width,director.height);
				ctx.fillStyle = "#FFF";
				var loadText = "LOADING.";
				var dotNumber = ((time/500)<<0)%4;
				for(var i=0;i<dotNumber;i++) loadText+="."
				ctx.fillText(loadText,this.width/2-60,this.height-30);
			}
            return this;
        },
		closeBehavior: function(type){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(-this.width,0);
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
				}
			});
			self.addBehavior(pathBehavior);
			if(type==2){
				this.global.JUST_LOAD_A_SONG = true;
				//if(self.loaded) this.menuContainer.playButton.fn();
			}
		},		
		playButtonFunction: function(){
			var self = this;
			var global = this.director.globalVariables;
			if(self.menuContainer.inAnimation) return;
			self.menuContainer.stopButton.fn();
			self.loading = true;
			self.menuContainer.playListContainer.loading = true;
			self.enableEvents(false);
			self.menuContainer.disable(false);
			self.menuContainer.playListContainer.enableEvents(false);
			var musicAllData = musicList[global.SELECTING_RECORD].Data;
			var source = 	musicList[global.SELECTING_RECORD].Source;
			var singleMusicData;
			switch(global.DIFFICULTY){
				case global.DIFFICULTY_EASY: singleMusicData = musicAllData.Easy; break;
				case global.DIFFICULTY_HARD: singleMusicData = musicAllData.Hard; break;
				case global.DIFFICULTY_INSANE: singleMusicData = musicAllData.Insane; break;
			}
			var audioLink;
			if((!global.PLAY_FULL_FILE)&&(singleMusicData.Simple))audioLink = singleMusicData.Simple;
			else audioLink = singleMusicData.Full;
			var playms=function(){
				self.director.currentScene.recordData=stringToRecordData(singleMusicData.fNodeData);
				global.Sound.playMusic(audioLink,
				function(){
					self.loaded = global.Sound.loaded;
					self.loading = false;
					self.menuContainer.playListContainer.loading = false;
					global.playingAudio = global.Sound.audioMusic;
					self.menuContainer.closeBehavior(2);
				},true);
				
				var musicName=musicList[global.SELECTING_RECORD].Name;
				document.title ="Pianoic - "+musicName;
				var EName=UnSign(musicName);
				var arr_name=EName.split(" ");
				var completeName="";
				for (var x=0;x<arr_name.length;x++)
					completeName+=arr_name[x];
				location.hash="/"+1+"-"+musicList[global.SELECTING_RECORD].ID+"-"+global.DIFFICULTY+"/"+completeName;
			}

			if(!singleMusicData.loaded)
			$.get(source+singleMusicData.NodeData, function(data){
					singleMusicData.loaded=true;
					var firstNodeData=LZString.decompressFromUTF16(data.substring(10,data.length-1));
					singleMusicData.fNodeData=firstNodeData;
					
				playms();
			});
			else{
				playms();
			}
			global.Sound.setVolume(global.SFX_VOLUME);
		}
		
    }
    function stringToRecordData(str){
			var outputData = [];
			if(str.length==0) return outputData;
			var stringArray = str.split(",");
			//console.log(stringArray.length);
			for(var i=0;i<stringArray.length;i++){
				var temp = stringArray[i].split(" ");
				if(temp[0].charCodeAt(0)>57){
					for(var j=0;j<keyData.length;j++){
						if(temp[0] === keyData[j].name){
							temp[0] = j;
							break;
						}
					}
				}
				outputData.push({keyIndex:temp[0]<<0,time:temp[1]<<0});
			}
			return outputData;
		}
    extend(CAAT.HighScoreContainer, CAAT.Foundation.ActorContainer);

})();

(function () {
    CAAT.PlayListContainer = function () {
        CAAT.PlayListContainer.superclass.constructor.call(this);
        return this;
    }

    CAAT.PlayListContainer.prototype = {
        initialize: function (menuContainer,posX,posY,width,height) {
			var self = this;
            this.director = menuContainer.director;
			this.menuContainer = menuContainer;

			//this.setBounds(posX,posY,width,height);
			this.playListMaxSong = 6;
			

			var offButtonstyle=PianoicStyle.playListContainer.child.offButtonPosition;
			var offButtonPosition = new CAAT.Foundation.Actor();
			var arr_offbutton=setPianoicStyle(self.director,offButtonPosition,offButtonstyle);
			offButtonPosition.setBackgroundImage(arr_offbutton[0]);
			offButtonPosition.mouseEnter = function(){
				offButtonPosition.setBackgroundImage(arr_offbutton[1]);
			}
			offButtonPosition.mouseExit = function(){
				offButtonPosition.setBackgroundImage(arr_offbutton[0]);
			}
			offButtonPosition.mouseDown = function(){				
				menuContainer.closeBehavior(1);			
			}
			this.addChild(offButtonPosition);
			this.offButtonPosition = offButtonPosition;

			var headstyle=PianoicStyle.playListContainer.child.head;
			var head = new CAAT.Foundation.ActorContainer();
			setPianoicStyle(self.director,head,headstyle);
			var iconsonglist = new CAAT.Foundation.Actor();
			var iconauthor = new CAAT.Foundation.Actor();
			setPianoicStyle(self.director,iconsonglist,headstyle.child.iconsonglist);
			setPianoicStyle(self.director,iconauthor,headstyle.child.iconauthor);
			head.addChild(iconsonglist);
			head.addChild(iconauthor);
			this.addChild(head);
			this.head=head;
			iconsonglist.cacheAsBitmap();
			iconauthor.cacheAsBitmap();
			head.cacheAsBitmap();

			var songliststyle=PianoicStyle.playListContainer.child.songlist;
			var songlist={};
			setPianoicStyle(self.director,songlist,songliststyle);
			this.songlist=songlist;
			this.textStartY=this.songlist.data.y;
			this.textHeight	=this.songlist.data.textHeight;

			var authorstyle=PianoicStyle.playListContainer.child.author;
			var author={};
			setPianoicStyle(self.director,author,authorstyle);
			this.author=author;


			
			//this.scrollPosition = 0;
			this.global = this.director.globalVariables;
			var maxValue = musicList.length;
			var maxLine=this.playListMaxSong;
			var textStartY=this.textStartY;
			var lineSpace=this.textHeight;
			var scrollPosition=0;
			var scrollerbar=new CAAT.ScrollBarContainer()
				.initialize(self.director,self,maxValue,maxLine,textStartY,lineSpace,scrollPosition);
			this.addChild(scrollerbar);
			this.scrollerbar=scrollerbar;
			
            return this;
        },
        paint: function (director,time) {
			CAAT.PlayListContainer.superclass.paint.call(this, director, time);
            var ctx = director.ctx;
			
			
			
			// var headX = this.x;
			// var headY = this.y;
			// var textPosY = headY+10;
			//var text = "SONG LIST";
			//ctx.fillText(text,this.width/2 - ctx.measureText(text).width/2,textPosY);
			var songlistdata=this.songlist.data;
			var authordata=this.author.data;
			var textStartY = songlistdata.y;
			var textHeight = songlistdata.textHeight;
			
			//ctx.strokeStyle = "#FFF";
			ctx.globalAlpha = this.songlist.text.selectAlpha||0.5;
			ctx.fillStyle = this.songlist.text.selectFill||"#ECC";
			
			
			
			// if(this.scrollerbar.scrollBar) 	{
			// 	var scrollPercent =  (100*(this.scrollerbar.scroller.y/(this.scrollerbar.scrollBar.height-this.scrollerbar.scroller.height)))<<0;
			// 	var percent = (scrollPercent==100)?scrollPercent-1:scrollPercent;
			// 	this.scrollerbar.scrollPosition = (this.scrollerbar.scroller.maxValue*percent/100)<<0;
			// }
			// else this.scrollerbar.scrollPosition = 0;
			var scrollPosition = this.scrollerbar.scrollPosition;
			var global = this.global;
			if((global.SELECTING_RECORD-scrollPosition>=0)&&(global.SELECTING_RECORD-scrollPosition<this.scrollerbar.showmaxline))
			ctx.fillRect(0,textStartY+textHeight*(global.SELECTING_RECORD-scrollPosition) - textHeight*2/3,this.width,textHeight);
			ctx.globalAlpha = 1;
			for(var i=scrollPosition;i<musicList.length;i++){
				if(i>=scrollPosition+this.scrollerbar.showmaxline) break;
				ctx.fillStyle = songlistdata.fillStyle;
				//ctx.strokeStyle = (i==global.SELECTING_RECORD)?"#000":"#FFF";
				ctx.font = this.songlist.text.font||"22px UTM Avo";
				//this.drawCircle(ctx,headX,textStartY+(i-scrollPosition)*textHeight - textHeight/6,this.circleRadius);
				var textPosY = textStartY+(i-scrollPosition)*textHeight;
				ctx.fillText(musicList[i].Name,songlistdata.x,textPosY-10);
				ctx.font = this.author.text.font||"22px UTM Avo";
				ctx.fillText(musicList[i].Author,authordata.x,textPosY+10);
				
				
			}
            return this;
        },			
		closeBehavior: function(type){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(this.director.width,0);
			self.menuContainer.inAnimation = true;
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
					self.menuContainer.inAnimation = false;
				}
			});
			self.addBehavior(pathBehavior);
			if(type == 1){
				this.global.SELECTING_RECORD = this.currentRecord;
				this.global.DIFFICULTY = this.currentDifficulty;
			}
		},
		mouseDown: function(e){
			var self = this;
			if(self.menuContainer.inAnimation) return;
			
			var startY = this.scrollerbar.textStartY - this.scrollerbar.textHeight*2/3;
			for(var i=0;i<this.scrollerbar.showmaxline;i++){
				if((e.y>startY+i*this.scrollerbar.textHeight)&&(e.y<startY+(i+1)*this.scrollerbar.textHeight)){
					this.global.SELECTING_RECORD = i+self.scrollerbar.scrollPosition;
					break;
				}
			}
		},
		mouseDblClick: function(e){
			var self = this;
			if(self.menuContainer.inAnimation) return;
			var startY = this.scrollerbar.textStartY - this.scrollerbar.textHeight*2/3;
			var posY=e.y-this.y;
			for(var i=0;i<this.scrollerbar.showmaxline;i++){
				if((posY>startY+i*this.scrollerbar.textHeight)&&(posY<startY+(i+1)*this.scrollerbar.textHeight)){
					this.global.SELECTING_RECORD = i+self.scrollerbar.scrollPosition;
					self.menuContainer.highScoreContainer.playButtonFunction();
					break;
				}
			}
		}
		
    }
    extend(CAAT.PlayListContainer, CAAT.Foundation.ActorContainer);
})();

(function () {
    CAAT.SettingContainer = function () {
        CAAT.SettingContainer.superclass.constructor.call(this);
        return this;
    }

    CAAT.SettingContainer.prototype = {
        initialize: function (menuContainer) {
			var self = this;
            this.director = menuContainer.director;
			this.menuContainer = menuContainer;
			var global=this.director.globalVariables;
			//this.offButtonPosition = {x:self.director.width - 70 ,y:40};
			


			//General Settings
			var settingList = [
				LANG.setting.autoplay,
				LANG.setting.playfile,
				LANG.setting.playfullfile,
				LANG.setting.autopause,
				LANG.setting.keyboardText,
				LANG.setting.playbackText
			];
			var checkList=[];
			for (var i=0;i<settingList.length;i++){
				var radioCheckstyle=PianoicStyle.settingContainer.child.radiocheck;			
				var radioCheck = new CAAT.RadioCheck();
				var arr_radiocheck=setPianoicStyle(self.director,radioCheck,radioCheckstyle);
				radioCheck.setVisible(false).setLocation(radioCheckstyle.posX,radioCheckstyle.textHeight*i+radioCheckstyle.posY);
				this.addChild(radioCheck);
				checkList.push(radioCheck);
			}

			checkList[0].initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],global.AUTOPLAY,function(){
				global.AUTOPLAY=!global.AUTOPLAY;
			});
			checkList[1].initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],global.ENABLE_PLAY_FILE,function(){
				global.ENABLE_PLAY_FILE=!global.ENABLE_PLAY_FILE;
			});
			checkList[2].initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],global.PLAY_FULL_FILE,function(){
				global.PLAY_FULL_FILE=!global.PLAY_FULL_FILE;
			});
			checkList[3].initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],global.AUTO_PAUSE,function(){
				global.AUTO_PAUSE=!global.AUTO_PAUSE;
			});
			checkList[4].initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],global.SHOW_KEYBOARD_TEXT,function(){
				global.SHOW_KEYBOARD_TEXT=!global.SHOW_KEYBOARD_TEXT;
			});
			checkList[5].initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],global.SHOW_PLAYBACK_TEXT,function(){
				global.SHOW_PLAYBACK_TEXT=!global.SHOW_PLAYBACK_TEXT;
			});				
			
			this.checkList=checkList;				
			this.settingList = settingList;


			//Keyboard Setting
			this.KBselect=0;
			var keyboardList=[];
			var keyboardSettingstyle=PianoicStyle.settingContainer.child.keyboard;
			var buttonsKB=[
				LANG.setting.keyboard.singlenote[global.LANGUAGE],
				LANG.setting.keyboard.chords[global.LANGUAGE],
				LANG.setting.keyboard.meta[global.LANGUAGE]];
			for (var i=0;i<buttonsKB.length;i++){
				var posX=this.width/3*i+keyboardSettingstyle.posX;
				var button = new CAAT.Foundation.ActorContainer().setBounds(posX,keyboardSettingstyle.posY,keyboardSettingstyle.sizeButton.width,keyboardSettingstyle.sizeButton.height);
				
				button.text=buttonsKB[i];
				button.paint=function(director,time){
					ctx=director.ctx;
					ctx.fillStyle=keyboardSettingstyle.selectFill;
					if(buttonsKB.indexOf(this.text)==self.KBselect)
						ctx.fillRect(0,0,this.width,this.height);					
					ctx.fillStyle=keyboardSettingstyle.fontcolor;
					ctx.font=keyboardSettingstyle.font;
					ctx.fillText(this.text,this.width/2-ctx.measureText(this.text).width/2,button.height-keyboardSettingstyle.textHeight*1/3);
				}
				this.addChild(button);
				keyboardList.push(button);
			}
			this.keyboardList=keyboardList;			
			keyboardList[0].mouseDown=function(){
				if (global._onKey) return;
				self.KBselect=0;
				if(!self.title_singlenote.visible) self.title_singlenote.setVisible(true);
				if(!self.scrollerbar1.visible) self.scrollerbar1.setVisibleScroll(true);
				if(self.scrollerbar2.visible) self.scrollerbar2.setVisibleScroll(false);
			}			
			keyboardList[1].mouseDown=function(){
				if (global._onKey) return;
				self.KBselect=1;
				if(!self.title_singlenote.visible) self.title_singlenote.setVisible(true);
				if(self.scrollerbar1.visible) self.scrollerbar1.setVisibleScroll(false);
				if(!self.scrollerbar2.visible) self.scrollerbar2.setVisibleScroll(true);
			}			
			keyboardList[2].mouseDown=function(){
				if (global._onKey) return;
				self.KBselect=2;
			}

			var titlestyle=keyboardSettingstyle.singlenote.title;
			var title_singlenote=new CAAT.Foundation.Actor();
			var arr_img=setPianoicStyle(self.director,title_singlenote,titlestyle);
			var editimg=self.director.getImage(arr_img[0]);
			var trash=self.director.getImage(arr_img[1]);
			title_singlenote.trash=trash;
			title_singlenote.text=LANG.setting.keyboard.edittitle1[global.LANGUAGE];
			title_singlenote.paint=function(director,time){
				var ctx=director.ctx;
				ctx.fillStyle=self.fillStyle;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.drawImage(editimg,10,5,editimg.width,editimg.height);
				ctx.fillStyle=titlestyle.fontcolor;
				ctx.font=titlestyle.font;
				ctx.fillText(this.text,editimg.width*2,32);
			}
			this.addChild(title_singlenote);
			keyboardList.push(title_singlenote);
			this.title_singlenote=title_singlenote;

			var keynotestyle=keyboardSettingstyle.singlenote;
			// var keynote=new CAAT.Foundation.Actor();
			// setPianoicStyle(self.director,keynote,keynotestyle);
			// keynote.paint
			// this.addChild(keynote);
			// keyboardList.push(keynote);

			var keynoteList=[];
			var chordList=[];
			var setKey=function(){
				keynoteList=[];
				chordList=[];//chordList={key:key,note:[note1,note2]};
				var cachelist=[];
				var cachelist2=[];
				for (var i=0;i<keyData.length;i++)
					for (var j=0;j<keyData[i].keyCode.length;j++){

						var note ={index:keyData[i].index,type:keyData[i].type,name:keyData[i].name};				
						var	keyname=convertkeyCodetoString(keyData[i].keyCode[j],keyData[i].isShift[j],keyData[i].location[j]);
						var name=keyname.str;
						var color=keyname.color;
						var key={keyCode:keyData[i].keyCode[j],isShift:keyData[i].isShift[j],location:keyData[i].location[j],name:name,color:color};
						keynoteList.push({note:note,key:key});
						if (cachelist[keyData[i].keyCode[j]]&&cachelist[keyData[i].keyCode[j]].key.isShift==keyData[i].isShift[j]&&cachelist[keyData[i].keyCode[j]].key.location==keyData[i].location[j]) 
						{
							//cachelist2.push({note:note,key:key});
							var id=""+key.keyCode+""+key.isShift+""+key.location;
							if (cachelist2[id]) cachelist2[id].push(note);
							else cachelist2[id]=[note];
							if(!cachelist2[id+'one']) {
								cachelist2[id+'one']=true;
								cachelist2[id].push(cachelist[keyData[i].keyCode[j]].note);
							}
						}
						else
							cachelist[keyData[i].keyCode[j]]={note:note,key:key};
						// if (!cachelist[keyData[i].keyCode[j]]) cachelist.push(keyData[i].keyCode[j]);
					}
				for (var i in cachelist2){
					if(i.substr(i.length-3)!='one'&&i.substr(i.length-3)!='set'){
						var note=cachelist2[i];
						var location=+i.substr(i.length-1);
						var isShift=(i.indexOf('true')==-1?false:true);
						var keyCode=+i.substr(0,i.indexOf(isShift+''));
						var	keyname=convertkeyCodetoString(keyCode,isShift,location);
						var name=keyname.str;
						var color=keyname.color;
						var key={keyCode:keyCode,isShift:isShift,location:location,name:name,color:color};
						chordList.push({notes:note,key:key});

					}
					
				}
				//var max=(>>0);console.log(keynoteList.length)
				if (self.scrollerbar1) self.scrollerbar1.setMaxValue(keynoteList.length/3+0.999>>0);
				if (self.scrollerbar2) self.scrollerbar2.setMaxValue(chordList.length);
				self.chordList=chordList;
				self.keynoteList=keynoteList;
				global._onKey=null;
				//menuContainer.
			}
			setKey();
			global.setKey=setKey;
			
			this.lineSpace=keynotestyle.space.y;
			this.showmaxline=4;
			this.textStartY=keynotestyle.bound.y;
			this.SELECTING_KEYNOTE=0;
			this.SELECTING_CHORD=0;

			
			//Scroll Bar keyboard singlenote
			var maxValue = (keynoteList.length/3+0.999>>0);
			var maxLine=this.showmaxline;
			var textStartY=this.textStartY;
			var lineSpace=this.lineSpace;
			var scrollPosition=0;
			var scrollerbar1=new CAAT.ScrollBarContainer()
				.initialize(self.director,self,maxValue,maxLine,textStartY,lineSpace,scrollPosition);
			this.addChild(scrollerbar1)
			this.scrollerbar1=scrollerbar1;

			var chordstyle=keyboardSettingstyle.chord;
			//Scroll Bar keyboard chord
			var maxValue = chordList.length;
			var scrollPosition=0;
			var lineSpace=chordstyle.space.y;
			var scrollerbar2=new CAAT.ScrollBarContainer()
				.initialize(self.director,self,maxValue,maxLine,textStartY,lineSpace,scrollPosition)
				.setVisibleScroll(false);
			this.addChild(scrollerbar2)
			this.scrollerbar2=scrollerbar2;


			var offButtonstyle=PianoicStyle.settingContainer.child.offButtonPosition;
			var offButtonPosition = new CAAT.Foundation.Actor();
			var arr_offbutton=setPianoicStyle(self.director,offButtonPosition,offButtonstyle);
			offButtonPosition.setBackgroundImage(arr_offbutton[0]);
			offButtonPosition.mouseEnter = function(){
				offButtonPosition.setBackgroundImage(arr_offbutton[1]);
			}
			offButtonPosition.mouseExit = function(){
				offButtonPosition.setBackgroundImage(arr_offbutton[0]);
			}
			offButtonPosition.mouseDown = function(){				
				menuContainer.closeBehavior(-1);			
			}
			this.addChild(offButtonPosition);
			this.offButtonPosition = offButtonPosition;

			this.fnChordText=LANG.setting.keyboard.createnewchord[global.LANGUAGE];
			global.changeallkeys=function(){

				var notes=self.chordList[self.SELECTING_CHORD].notes;
				var key=self.chordList[self.SELECTING_CHORD].key;
				
				global.unpressed();
				global.createChord=true;
				global._onsetChord=key;
				//if(ex<trashX+chordstyle.bound.x+spacekeyandnote||ex>trashX+chordstyle.bound.x+spacekeyandnote+spacenote*notes.length){
					for (var x=0;x<notes.length;x++){
						var note=notes[x];
						if(note.type=='black') {
							global.blackKey[note.index].pressed(1);global.changeKey(note.index);
						} else {
							global.whiteKey[note.index].pressed(1);global.changeKey(note.index+25);
						}
					}
			}
            return this;
        },
        paint: function (director,time) {
			CAAT.SettingContainer.superclass.paint.call(this, director, time);
			var self=this;
			var settingstyle=PianoicStyle.settingContainer;
			var global = this.director.globalVariables;
			var ctx = director.ctx;
			ctx.fillStyle = settingstyle.bgcolor;
			ctx.fillRect(0,0,this.width,this.height);

			
			switch (this.menuContainer.chooseSetting.selectSetting){
				case 0:
					if(!this.checkList[0].visible)
					for (var i=0;i<this.checkList.length;i++){
						this.checkList[i].setVisible(true);
					};
					if(this.keyboardList[0].visible)
					{
						for (var i=0;i<this.keyboardList.length;i++){
							this.keyboardList[i].setVisible(false);
						}
						if(self.scrollerbar1.visible) self.scrollerbar1.setVisibleScroll(false);
						if(self.scrollerbar2.visible) self.scrollerbar2.setVisibleScroll(false);
					}
					if(global.onsetkey){						
						global.onsetkey=false;
						global._onKey=null;
						global.unpressed();
					}
					ctx.fillStyle = settingstyle.child.general.fillStyle;
					ctx.font = settingstyle.child.general.font;
					for (var i=0;i<this.checkList.length;i++){
						var text=this.settingList[i][global.LANGUAGE];
						//var posY=settingstyle.child.general.posY*i+settingstyle.child.general.textHeight*2/3;
						var posY=this.checkList[i].y+settingstyle.child.general.textHeight*2/3;
						ctx.fillText(text,this.checkList[i].x+settingstyle.child.general.posX,posY);
					};					
					
					break;
				case 1:
					if(this.checkList[0].visible)
					for (var i=0;i<this.checkList.length;i++){
						this.checkList[i].setVisible(false);
					}
					if(!this.keyboardList[0].visible){
						for (var i=0;i<this.keyboardList.length;i++){
							this.keyboardList[i].setVisible(true);
						}
						this.KBselect==0?self.scrollerbar1.setVisibleScroll(true):self.scrollerbar2.setVisibleScroll(true);
					}
					switch(this.KBselect){
						case 0:
							
							if(global._onKey) this.title_singlenote.text=LANG.setting.keyboard.edittitle2[global.LANGUAGE];
							else this.title_singlenote.text=LANG.setting.keyboard.edittitle1[global.LANGUAGE];
							var textHeight=this.scrollerbar1.lineSpace;
							var scrollPosition = this.scrollerbar1.scrollPosition;
							var keynotestyle=settingstyle.child.keyboard.singlenote;
							var spacewidth=keynotestyle.space.x;
							var spacekeyandnote=keynotestyle.space.width;
							var posX=keynotestyle.bound.x;
							//global.onsetkey=true;
							ctx.fillStyle=settingstyle.child.keyboard.selectFill;
							if(((this.SELECTING_KEYNOTE/3>>0)-scrollPosition>=0)&&((this.SELECTING_KEYNOTE/3>>0)-scrollPosition<this.scrollerbar1.showmaxline))
							ctx.fillRect(settingstyle.child.keyboard.singlenote.bound.x-20+(this.SELECTING_KEYNOTE%3)*spacewidth,keynotestyle.bound.y+textHeight*((this.SELECTING_KEYNOTE/3>>0)-scrollPosition) - textHeight*1/3,settingstyle.child.keyboard.sizeButton.width+40,textHeight);
							for(var i=scrollPosition;i<(this.keynoteList.length/3>>0)+1;i++){
								if(i>=scrollPosition+this.scrollerbar1.showmaxline) break;
							
							
							var posY=keynotestyle.bound.y+(i-scrollPosition)*textHeight;
							ctx.strokeStyle=keynotestyle.key.strokeStyle;
							ctx.strokeRect(posX+spacekeyandnote,posY,keynotestyle.key.size.width,keynotestyle.key.size.height);					
							ctx.strokeRect(posX+spacekeyandnote+spacewidth,posY,keynotestyle.key.size.width,keynotestyle.key.size.height);
							ctx.strokeRect(posX+spacekeyandnote+spacewidth*2,posY,keynotestyle.key.size.width,keynotestyle.key.size.height);
							
							ctx.beginPath();
							ctx.moveTo(posX+spacekeyandnote,posY+keynotestyle.key.size.height/2);
							ctx.lineTo(posX+keynotestyle.key.size.width,posY+keynotestyle.note.size.height/2);
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							ctx.moveTo(posX+spacekeyandnote+spacewidth,posY+keynotestyle.key.size.height/2);
							ctx.lineTo(posX+keynotestyle.key.size.width+spacewidth,posY+keynotestyle.note.size.height/2);
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							ctx.moveTo(posX+spacekeyandnote+spacewidth*2,posY+keynotestyle.key.size.height/2);
							ctx.lineTo(posX+keynotestyle.key.size.width+spacewidth*2,posY+keynotestyle.note.size.height/2);
							ctx.stroke();
							ctx.closePath();
							
							ctx.fillStyle=keynotestyle.note.fillStyle;
							ctx.fillRect(posX,posY,keynotestyle.note.size.width,keynotestyle.note.size.height);
							ctx.fillRect(posX+spacewidth,posY,keynotestyle.note.size.width,keynotestyle.note.size.height);
							ctx.fillRect(posX+spacewidth*2,posY,keynotestyle.note.size.width,keynotestyle.note.size.height);

							ctx.fillStyle=keynotestyle.note.fontcolor;
							ctx.font=keynotestyle.note.font;
							var text1,text2,text3;
							if(this.keynoteList[i*3]) {
								text1=this.keynoteList[i*3].note.name;
								ctx.fillText(text1,posX+keynotestyle.note.size.width/2-ctx.measureText(text1).width/2,posY+keynotestyle.note.size.height*2/3)
							}
							if(this.keynoteList[i*3+1]){
								text2=this.keynoteList[i*3+1].note.name;
								ctx.fillText(text2,posX+spacewidth+keynotestyle.note.size.width/2-ctx.measureText(text2).width/2,posY+keynotestyle.note.size.height*2/3)
							}						
							if(this.keynoteList[i*3+2]){
								text3=this.keynoteList[i*3+2].note.name;
								ctx.fillText(text3,posX+spacewidth*2+keynotestyle.note.size.width/2-ctx.measureText(text3).width/2,posY+keynotestyle.note.size.height*2/3)
							}
							ctx.fillStyle=keynotestyle.key.fontcolor;
							ctx.font=keynotestyle.key.font;
							var text4,text5,text6;
							text1=this.keynoteList[i*3].key.name;
							ctx.fillStyle=this.keynoteList[i*3].key.color;
							ctx.fillText(text1,posX+spacekeyandnote+keynotestyle.key.size.width/2-ctx.measureText(text1).width/2,posY+keynotestyle.key.size.height*2/3)
							if(this.keynoteList[i*3+1]){
								text2=this.keynoteList[i*3+1].key.name;
								ctx.fillStyle=this.keynoteList[i*3+1].key.color;
								ctx.fillText(text2,posX+spacekeyandnote+spacewidth+keynotestyle.key.size.width/2-ctx.measureText(text2).width/2,posY+keynotestyle.key.size.height*2/3)
							}						
							if(this.keynoteList[i*3+2]){
								text3=this.keynoteList[i*3+2].key.name;
								ctx.fillStyle=this.keynoteList[i*3+2].key.color;
								ctx.fillText(text3,posX+spacekeyandnote+spacewidth*2+keynotestyle.key.size.width/2-ctx.measureText(text3).width/2,posY+keynotestyle.key.size.height*2/3)
							}					
							
							}
							break;
						case 1:
							
							this.title_singlenote.text=global.createChord?LANG.setting.keyboard.edittitle4[global.LANGUAGE]:LANG.setting.keyboard.edittitle3[global.LANGUAGE];
							var textHeight=this.scrollerbar2.lineSpace;
							var scrollPosition = this.scrollerbar2.scrollPosition;
							var keynotestyle=settingstyle.child.keyboard.singlenote;
							var chordstyle=settingstyle.child.keyboard.chord;
							var spacewidth=chordstyle.space.x;
							var spacekeyandnote=chordstyle.space.width;
							var posX=chordstyle.bound.x;
							//global.onsetkey=true;
							ctx.fillStyle=settingstyle.child.keyboard.selectFill;
							if((this.SELECTING_CHORD-scrollPosition>=0)&&(this.SELECTING_CHORD-scrollPosition<this.scrollerbar2.showmaxline))
							ctx.fillRect(chordstyle.bound.x-20,chordstyle.bound.y+textHeight*(this.SELECTING_CHORD-scrollPosition) - textHeight*1/3,chordstyle.bound.width,textHeight);
							for(var i=scrollPosition;i<this.chordList.length;i++){
								if(i>=scrollPosition+this.scrollerbar2.showmaxline) break;
							
							
							var posY=keynotestyle.bound.y+(i-scrollPosition)*textHeight;
							ctx.drawImage(this.title_singlenote.trash,posX,posY,this.title_singlenote.trash.width,this.title_singlenote.trash.height);
							var trashX=this.title_singlenote.trash.width*2;
							ctx.strokeStyle=keynotestyle.key.strokeStyle;
							ctx.strokeRect(posX+trashX,posY,keynotestyle.key.size.width,keynotestyle.key.size.height);					
							//ctx.fillStyle=keynotestyle.key.fontcolor;
							ctx.font=keynotestyle.key.font;							
							ctx.fillStyle=this.chordList[i].key.color;
							text1=this.chordList[i].key.name;
							ctx.fillText(text1,trashX+posX+keynotestyle.key.size.width/2-ctx.measureText(text1).width/2,posY+keynotestyle.key.size.height*2/3)
							var spacenote=keynotestyle.note.size.width+20;
							ctx.font=keynotestyle.note.font;
							for (var x=0;x<this.chordList[i].notes.length;x++){
								ctx.fillStyle=keynotestyle.note.fillStyle;
								ctx.fillRect(trashX+posX+spacekeyandnote+spacenote*x,posY,keynotestyle.note.size.width,keynotestyle.note.size.height);								
								ctx.fillStyle=keynotestyle.note.fontcolor;							
								var text=this.chordList[i].notes[x].name;
								ctx.fillText(text,trashX+posX+spacekeyandnote+spacenote*x+keynotestyle.note.size.width/2-ctx.measureText(text).width/2,posY+keynotestyle.note.size.height*2/3)
							}							
							
							}
							var metastyle=settingstyle.child.keyboard.meta;
							ctx.fillStyle=metastyle.button.bgcolor;
							ctx.fillRect(chordstyle.button.posX,chordstyle.button.posY,metastyle.button.size.width,metastyle.button.size.height);							
							ctx.fillStyle=metastyle.button.iconcolor;
							ctx.fillRect(chordstyle.button.posX,chordstyle.button.posY,metastyle.button.boxsize.width,metastyle.button.boxsize.height);
							ctx.fillStyle=chordstyle.button.fontcolor;
							ctx.font="60px UTM Avo";
							ctx.fillText("+",chordstyle.button.posX+metastyle.button.boxsize.width/2-15,chordstyle.button.posY+metastyle.button.boxsize.height/2+15)
							ctx.font="30px UTM Avo";
							ctx.fillText(this.fnChordText,chordstyle.button.posX+metastyle.button.boxsize.width+ 35,chordstyle.button.posY+metastyle.button.boxsize.height/2+10)
							if(global.createChord) 
								this.fnChordText =LANG.setting.keyboard.finishedit[global.LANGUAGE];
							else
								this.fnChordText =LANG.setting.keyboard.createnewchord[global.LANGUAGE];
							break;
						case 2:
							if(self.scrollerbar1.visible) self.scrollerbar1.setVisibleScroll(false);
							if(self.scrollerbar2.visible) self.scrollerbar2.setVisibleScroll(false);
							if(self.title_singlenote.visible) self.title_singlenote.setVisible(false);
							var metastyle=settingstyle.child.keyboard.meta;
							
							var posX=metastyle.button.posX;
							var posY=metastyle.button.posY;
							var space=metastyle.button.textHeight;
							var arr_img=metastyle.button.imgs;
							var img1=director.getImage(arr_img[0]);
							var img2=director.getImage(arr_img[2]);
							var img3=director.getImage(arr_img[1]);
							ctx.fillStyle=metastyle.button.bgcolor;
							ctx.fillRect(posX,posY,metastyle.button.size.width,metastyle.button.size.height);															
							ctx.fillRect(posX,posY+space,metastyle.button.size.width,metastyle.button.size.height);
							ctx.fillRect(posX,posY+space*2,metastyle.button.size.width,metastyle.button.size.height);

							ctx.fillStyle=metastyle.button.iconcolor;
							ctx.fillRect(posX,posY,metastyle.button.boxsize.width,metastyle.button.boxsize.height);
							ctx.drawImage(img1,posX+metastyle.button.boxsize.width/2-img1.width/2,posY+metastyle.button.boxsize.height/2-img1.height/2,img1.width,img1.height);
							ctx.fillRect(posX,posY+space,metastyle.button.boxsize.width,metastyle.button.boxsize.height);
							ctx.drawImage(img2,posX+metastyle.button.boxsize.width/2-img2.width/2,posY+space+metastyle.button.boxsize.height/2-img2.height/2,img2.width,img2.height);
							ctx.fillRect(posX,posY+space*2,metastyle.button.boxsize.width,metastyle.button.boxsize.height);
							ctx.drawImage(img3,posX+metastyle.button.boxsize.width/2-img3.width/2,posY+space*2+metastyle.button.boxsize.height/2-img3.height/2,img3.width,img3.height);
							break;
					}
					break;
				case 2:
					if(this.checkList[0].visible)
					for (var i=0;i<this.checkList.length;i++){
						this.checkList[i].setVisible(false);
					}
					if(this.keyboardList[0].visible)
					{
						for (var i=0;i<this.keyboardList.length;i++){
							this.keyboardList[i].setVisible(false);
						}
						if(self.scrollerbar1.visible) self.scrollerbar1.setVisibleScroll(false);
						if(self.scrollerbar2.visible) self.scrollerbar2.setVisibleScroll(false);
					}
					if(global.onsetkey){						
						global.onsetkey=false;
						global._onKey=null;
						global.unpressed();
					}
					break;
				case 3:
					if(this.checkList[0].visible)
					for (var i=0;i<this.checkList.length;i++){
						this.checkList[i].setVisible(false);
					}
					if(this.keyboardList[0].visible)
					{
						for (var i=0;i<this.keyboardList.length;i++){
							this.keyboardList[i].setVisible(false);
						}
						if(self.scrollerbar1.visible) self.scrollerbar1.setVisibleScroll(false);
						if(self.scrollerbar2.visible) self.scrollerbar2.setVisibleScroll(false);
					}
					if(global.onsetkey){						
						global.onsetkey=false;
						global._onKey=null;
						global.unpressed();
					}
					break;
			}
			
            return this;
        },
		mouseDown: function(e){
			var self = this;
			switch (this.menuContainer.chooseSetting.selectSetting){
				case 0:
					break;
				case 1:					
					switch(this.KBselect){
						case 0:							
							var textHeight=this.scrollerbar1.lineSpace;
							var global=this.director.globalVariables;
							var startY = PianoicStyle.settingContainer.child.keyboard.singlenote.bound.y - textHeight*1/3;
							var startX = PianoicStyle.settingContainer.child.keyboard.singlenote.bound.x;
							var spacewidth=PianoicStyle.settingContainer.child.keyboard.singlenote.space.x;
							if(!global._onKey)
							for(var i=0;i<(this.keynoteList.length/3>>0);i++){
								for (var j=0;j<3;j++)
									if((e.y>startY+i*textHeight)&&(e.y<startY+(i+1)*textHeight)&&(e.x>startX+j*spacewidth)&&(e.x<startX+(j+1)*spacewidth)){
										this.SELECTING_KEYNOTE = (i+self.scrollerbar1.scrollPosition)*3+j;
										if(this.keynoteList[this.SELECTING_KEYNOTE])
										{
											var note=this.keynoteList[this.SELECTING_KEYNOTE].note;
											global.unpressed();
											note.type=='black'?global.blackKey[note.index].pressed(0):global.whiteKey[note.index].pressed(0);
										}
											
										break;
									}
							}
							break;
						case 1:	
							var chordstyle=PianoicStyle.settingContainer.child.keyboard.chord;
							var trashX=this.title_singlenote.trash.width*2;
							var spacekeyandnote=chordstyle.space.width;
							var spacenote=PianoicStyle.settingContainer.child.keyboard.singlenote.note.size.width+20;
							var textHeight=this.scrollerbar2.lineSpace;
							var global=this.director.globalVariables;
							var startY = PianoicStyle.settingContainer.child.keyboard.chord.bound.y - textHeight*1/3;
							var startX = PianoicStyle.settingContainer.child.keyboard.chord.bound.x;
							var spacewidth=PianoicStyle.settingContainer.child.keyboard.chord.space.x;
							if(!global._onKey)
							for(var i=0;i<this.chordList.length;i++){
								if((e.y>startY+i*textHeight)&&(e.y<startY+(i+1)*textHeight)){
									this.SELECTING_CHORD = i+self.scrollerbar2.scrollPosition;

									if(this.chordList[this.SELECTING_CHORD]){
										if(e.x<trashX){
											var key=this.chordList[this.SELECTING_CHORD].key;
											delkey(key.keyCode,key.isShift,key.location);
											global.setKey();
										}else{
											var notes=this.chordList[this.SELECTING_CHORD].notes;
											global.unpressed();
										
											for (var x=0;x<notes.length;x++){
												var note=notes[x];
												note.type=='black'?global.blackKey[note.index].pressed(0):global.whiteKey[note.index].pressed(0)
											}									
										}
									}
									
									break;								
								}
							}	
							var metastyle=PianoicStyle.settingContainer.child.keyboard.meta;
							//ctx.fillRect(chordstyle.button.posX,chordstyle.button.posY,metastyle.button.boxsize.width,metastyle.button.boxsize.height);
							if(e.y>chordstyle.button.posY&&e.y<chordstyle.button.posY+metastyle.button.size.height&&e.x>chordstyle.button.posX&&e.x<chordstyle.button.posX+metastyle.button.size.width){
								 
								global.createChord=!global.createChord;
								if(!global.createChord){ 
									if(global._onKey&&global._onsetChord)
										delkey(global._onsetChord.keyCode,global._onsetChord.isShift,global._onsetChord.location);
									global._onsetChord=null;
									var key=this.chordList[this.SELECTING_CHORD].key;
									if(global._onKey) global._onKey(key.keyCode,key.location,key.isShift);
									global.unpressed();
								}
							}				
							break;
						case 2:
							
							var metastyle=PianoicStyle.settingContainer.child.keyboard.meta;
							var posX=metastyle.button.posX;
							var posY=metastyle.button.posY;
							var space=metastyle.button.textHeight;
							if(e.x>posX&&e.x<posX+metastyle.button.size.width)
							{
								if (e.y>posY&&e.y<posY+metastyle.button.boxsize.height){
									console.log("1")
								} else if (e.y>posY+space&&e.y<posY+metastyle.button.boxsize.height+space){
									console.log("2")
								} if (e.y>posY+space*2&&e.y<posY+metastyle.button.boxsize.height+space*2){
									console.log("3")
								}
									
							}
							break;
					}
					break;
				case 2:
					break;
			}			
		},
		mouseDblClick: function(e){			
			var self=this;
			var ex=e.x-this.x,ey=e.y-this.y;
			switch (this.menuContainer.chooseSetting.selectSetting){
				case 0:
					break;
				case 1:
					switch(this.KBselect){
						case 0:
							var textHeight=this.scrollerbar1.lineSpace;
							var global=this.director.globalVariables;
							var startY = PianoicStyle.settingContainer.child.keyboard.singlenote.bound.y - textHeight*1/3;
							var startX = PianoicStyle.settingContainer.child.keyboard.singlenote.bound.x;
							var spacewidth=PianoicStyle.settingContainer.child.keyboard.singlenote.space.x;
							
							for(var i=0;i<(this.keynoteList.length/3>>0);i++){
								for (var j=0;j<3;j++)
									if((ey>startY+i*textHeight)&&(ey<startY+(i+1)*textHeight)&&(ex>startX+j*spacewidth)&&(ex<startX+(j+1)*spacewidth)){
										this.SELECTING_KEYNOTE = (i+self.scrollerbar1.scrollPosition)*3+j;
										var note=this.keynoteList[this.SELECTING_KEYNOTE].note;
										global.unpressed();

										if(note.type=='black') {
											global.blackKey[note.index].pressed(1);global.changeKey(note.index);
										} else {
											global.whiteKey[note.index].pressed(1);global.changeKey(note.index+25);
										}
										
										break;
									}
							}
							

							break;
						case 1:
							var chordstyle=PianoicStyle.settingContainer.child.keyboard.chord;
							var trashX=this.title_singlenote.trash.width*2;
							var spacekeyandnote=chordstyle.space.width;
							var spacenote=PianoicStyle.settingContainer.child.keyboard.singlenote.note.size.width+20;
							var textHeight=this.scrollerbar2.lineSpace;
							var global=this.director.globalVariables;
							var startY = PianoicStyle.settingContainer.child.keyboard.chord.bound.y - textHeight*1/3;
							var startX = PianoicStyle.settingContainer.child.keyboard.chord.bound.x;
							var spacewidth=PianoicStyle.settingContainer.child.keyboard.chord.space.x;
							if(!global._onKey)
							for(var i=0;i<this.chordList.length;i++){
								if((ey>startY+i*textHeight)&&(ey<startY+(i+1)*textHeight)){
									this.SELECTING_CHORD = i+self.scrollerbar2.scrollPosition;
									if(this.chordList[this.SELECTING_CHORD]){
										var notes=this.chordList[this.SELECTING_CHORD].notes;
										var key=this.chordList[this.SELECTING_CHORD].key;
										global.unpressed();
										global.createChord=true;
										global._onsetChord=key;
										//if(ex<trashX+chordstyle.bound.x+spacekeyandnote||ex>trashX+chordstyle.bound.x+spacekeyandnote+spacenote*notes.length){
											for (var x=0;x<notes.length;x++){
												var note=notes[x];
												if(note.type=='black') {
													global.blackKey[note.index].pressed(1);global.changeKey(note.index);
												} else {
													global.whiteKey[note.index].pressed(1);global.changeKey(note.index+25);
												}
											}
										// } else {
										// 	for (var x=0;x<notes.length;x++){
										// 		var note=notes[x];
										// 		if(ex>trashX+chordstyle.bound.x+spacekeyandnote+spacenote*x&&ex<trashX+chordstyle.bound.x+spacekeyandnote+spacenote*(x+1))
										// 		{
										// 			if(note.type=='black') {
										// 				global.blackKey[note.index].pressed(1);global.changeKey(note.index);
										// 			} else {
										// 				global.whiteKey[note.index].pressed(1);global.changeKey(note.index+25);
										// 			}
										// 			break;
										// 		}
										// 	}
										// }
										
										//global.createChord=false;
										// if(global._onKey) delkey(key.keyCode,key.isShift,key.location)

									}
									break;								
								}
							}		
							break;
						case 2:
							break;
					}
					break;
				case 2:
					break;
			}
		},		
		closeBehavior: function(){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(this.director.width,0);
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
				}
			});
			self.addBehavior(pathBehavior);
			var global=this.director.globalVariables;
			global.onsetkey=false;
			global._onKey=null;
			global.unpressed();
			this.title_singlenote.text=LANG.setting.keyboard.edittitle1[global.LANGUAGE];
		}
    }
    var delkey=function(keyCode,isShift,location){
    	for (var x=0;x<keyData.length;x++)
		for (var j=0;j<keyData[x].keyCode.length;j++){
			//if(key.keyCode==keyData[x].keyCode[j]) console.log(key)
			if(keyCode==keyData[x].keyCode[j]&&isShift==keyData[x].isShift[j]&&location==keyData[x].location[j]){
				keyData[x].keyCode.splice(j,1);
				keyData[x].isShift.splice(j,1);
				keyData[x].location.splice(j,1);
			}
		}
    }
    extend(CAAT.SettingContainer, CAAT.Foundation.ActorContainer);
})();

(function () {
    CAAT.ChooseSetting = function () {
        CAAT.ChooseSetting.superclass.constructor.call(this);
        return this;
    }

    CAAT.ChooseSetting.prototype = {
        initialize: function (menuContainer) {
			var self = this;
            this.director = menuContainer.director;
			this.global = this.director.globalVariables;

			this.selectSetting=0;
            return this;
        },
        paint: function (director,time) {
			CAAT.HighScoreContainer.superclass.paint.call(this, director, time);
            var ctx = director.ctx;
			var chooseSettingstyle=PianoicStyle.chooseSetting;
			var ctx = director.ctx;
			ctx.fillStyle = chooseSettingstyle.bgcolor;
			ctx.fillRect(0,0,this.width,this.height);
			var selectText=this.selectSetting;
			var posY=selectText*chooseSettingstyle.text.textHeight;
			ctx.globalAlpha=chooseSettingstyle.text.selectAlpha;
			ctx.fillStyle=chooseSettingstyle.text.selectFill;
			ctx.fillRect(0,posY,this.width,chooseSettingstyle.text.textHeight);
			ctx.globalAlpha=1;
			ctx.fillStyle = chooseSettingstyle.text.fillStyle;
			ctx.font = chooseSettingstyle.text.font;
			ctx.fillText("General Settings",chooseSettingstyle.text.posX,chooseSettingstyle.text.textHeight*0+chooseSettingstyle.text.textHeight*2/3);
			ctx.fillText("Keyboard Settings",chooseSettingstyle.text.posX,chooseSettingstyle.text.textHeight*1+chooseSettingstyle.text.textHeight*2/3);
			ctx.fillText("Record Settings",chooseSettingstyle.text.posX,chooseSettingstyle.text.textHeight*2+chooseSettingstyle.text.textHeight*2/3);
			ctx.fillText("Social play Settings",chooseSettingstyle.text.posX,chooseSettingstyle.text.textHeight*3+chooseSettingstyle.text.textHeight*2/3);
			
			
            return this;
        },
        mouseDown:function(e){
        	var x=e.x,y=e.y;
        	var chooseSettingstyle=PianoicStyle.chooseSetting;
        	if (y>=0&&y<=chooseSettingstyle.text.textHeight){
        		this.selectSetting=0;
        	} else if (y>=chooseSettingstyle.text.textHeight&&y<=chooseSettingstyle.text.textHeight*2){
        		{this.selectSetting=1;this.global.onsetkey=true;}
        	} else if (y>=chooseSettingstyle.text.textHeight*2&&y<=chooseSettingstyle.text.textHeight*3){
        		this.selectSetting=2;
        	} else if (y>=chooseSettingstyle.text.textHeight*3&&y<=chooseSettingstyle.text.textHeight*4){
        		this.selectSetting=3;
        	}
        	return this;
        },
		closeBehavior: function(){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(-this.width,0);
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
				}
			});
			self.addBehavior(pathBehavior);
			return this;
		}
		
    }
    extend(CAAT.ChooseSetting, CAAT.Foundation.ActorContainer);

})();
(function () {
    CAAT.MenuContainer = function () {
        CAAT.MenuContainer.superclass.constructor.call(this);
        return this;
    }

    CAAT.MenuContainer.prototype = {
        initialize: function (director,playList) {
			var self = this;
            this.director = director;
            var main={};
			var global = director.globalVariables;
			this.currentScene = director.currentScene;
			this.hoverButton = -1;
			this.playList = playList;
			this.listNumber = playList.length;
			this.nameList = [];
			this.audioIdList = [];
			for(var i =0;i<playList.length;i++){
				this.nameList.push(playList[i].name);
				this.audioIdList.push(playList[i].audio);
			}
			//this.setFillStyle("#8d1f1f");
			this.marginLeft = 5;
			this.lineHeight = 20;
			this.inAnimation = false;
			var buttonSize=40;
			var buttonLocation=[{x:0,y:0},{x:buttonSize,y:0},{x:buttonSize*2,y:0}];
			 
			// LOGO PIANOIC
			var bglogostyle= PianoicStyle.menuContainer.child.bglogoActor;
			var bglogoActor = new CAAT.Foundation.Actor();
			setPianoicStyle(director,bglogoActor,bglogostyle);
			this.addChild(bglogoActor);			
			main.bglogoActor=bglogoActor;
			bglogoActor.cacheAsBitmap();
			
			var pianoiclogostyle= PianoicStyle.menuContainer.child.pianoiclogoActor;
			var pianoiclogoActor = new CAAT.Foundation.Actor();
			setPianoicStyle(director,pianoiclogoActor,pianoiclogostyle);
			this.addChild(pianoiclogoActor);
			main.pianoiclogoActor=pianoiclogoActor;
			pianoiclogoActor.cacheAsBitmap();
			/*bglogostyle.bgcolor?bglogoActor.setFillStyle(bglogostyle.bgcolor):null;
			bglogostyle.image?bglogoActor.setBackgroundImage(new CAAT.SpriteImage().initialize(director.getImage(bglogostyle.image[0]),bglogostyle.image[1],bglogostyle.image[2])):null;							
			bglogostyle.size?bglogoActor.setBounds(bglogostyle.size.x,bglogostyle.size.y,bglogostyle.size.width,bglogostyle.size.height)
							:null;*/

			//var bglogostyle= PianoicStyle.menuContainer.child.bglogo;
			//var pianoiclogoImage =  new CAAT.SpriteImage().initialize(director.getImage("pianoic-logo"),1,1);
			//var logoheight=pianoiclogoImage.height;
			//var logowidth=pianoiclogoImage.width;
			//var posIconY=19;
			//console.log(pianoiclogoImage.width,pianoiclogoImage.height)
			
			// var pianoiclogoActor = new CAAT.Foundation.ActorContainer().
			// 				setBounds(20,posIconY,logowidth,logoheight).
			// 				setBackgroundImage(pianoiclogoImage);
			
			

			

			//BUTTON MUSIC

			var btmsLocation = [273+32,273+126,273+215,273+306]
			var btmswidth=292;

			//Record
			var recordstyle= PianoicStyle.menuContainer.child.recordButton;
			var recordButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,recordButton,recordstyle);
			var recordImage =arr_buttonImage[0];
			var activerecordImage =arr_buttonImage[1];	
			var recordDataString=[];	
			var recordData=director.currentScene.recordData;	
			//var recordStartTime=director.currentScene.recordStartTime;
			recordButton.initialize(director,recordImage,0,1,2,0,
			function(){
				if (recordButton._isDown) recordButton._isDown();
				global.JUST_LOAD_A_SONG = false;
				if(global.PLAYING_RECORD) {
					return;
				}
				location.href="/"
				// if(!global.RECORDING){
				// 	global.RECORDING = true;
				// 	director.currentScene.recordData = [];
				// 	director.currentScene.recordStartTime = self.time;
					
				// }
				// else{
				// 	global.RECORDING = false;console.log(director.currentScene.recordData)
				// 	if(director.currentScene.recordData.length==0) return;
				// 	//if(recordDataString.length>maxRecord) return;
				// 	// addRecord();
				// 	recordDataString.push(recordDataToString(director.currentScene.recordData));
				// 	console.log(recordDataString[recordDataString.length-1]);
				// }
			});
			function recordDataToString(recordData){
				var outputString = "";
				for(var i=0;i<recordData.length;i++){
					outputString += recordData[i].keyIndex + " "+recordData[i].time;
					if(i!=recordData.length-1) outputString+=",";
				}
				return outputString;
			}
			this.recordButton=recordButton;
			this.addChild(recordButton);
			main.recordButton=recordButton;

			//Play
			var playstyle= PianoicStyle.menuContainer.child.playButton;
			var playButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,playButton,playstyle);
			var playImage =arr_buttonImage[0];
			var pauseImage =arr_buttonImage[1];			
			playButton.initialize(director,playImage,0,1,2,0,function(){

				if (playButton._isDown) playButton._isDown();
				global.JUST_LOAD_A_SONG = false;
				// global.playingAudio.currentTime=40;
				if(global.RECORDING||global.countingDown) return;
				if(!global.PLAYING_RECORD){
					global.countingDown = true;
					global.startCountdownTime = self.time;
					var musicAllData = musicList[global.SELECTING_RECORD].Data;
					var source = 	musicList[global.SELECTING_RECORD].Source;
					var singleMusicData;
					switch(global.DIFFICULTY){
						case global.DIFFICULTY_EASY: singleMusicData = musicAllData.Easy; break;
						case global.DIFFICULTY_HARD: singleMusicData = musicAllData.Hard; break;
						case global.DIFFICULTY_INSANE: singleMusicData = musicAllData.Insane; break;
					}
					var playms=function(){
						if(self.currentScene.playFunction) self.currentScene.playFunction();
						global.PAUSING_RECORD = true;
						if(global.PLAY_FILE) global.playingAudio.pause();
					}
					if(!singleMusicData.loaded)
					$.get(source+singleMusicData.NodeData, function(data){
							singleMusicData.loaded=true;
							var firstNodeData=LZString.decompressFromUTF16(data.substring(10,data.length-1));
							singleMusicData.fNodeData=firstNodeData;
						playms();
					});
					else{
						playms();
					}
					
				}
				else {
					if(!global.PAUSING_RECORD){
						global.PAUSING_RECORD = true;
						playButton.setBackgroundImage(playImage,true);
						if(global.PLAY_FILE) global.playingAudio.pause();
					}
					else{
						global.PAUSING_RECORD = false;
						if(global.PLAY_FILE) global.playingAudio.play();
						playButton.setBackgroundImage(pauseImage,true);
					}
				}

			});
			playButton.setPauseImage=function(){
				playButton.setBackgroundImage(pauseImage,true);
			}
			playButton.setPlayImage=function(){
				playButton.setBackgroundImage(playImage,true);
			}
			self.playButton = playButton;
			self.addChild(playButton);
			main.playButton=playButton;

			//Sự kiện khi chuyển tab
			var eventPause=function(on){
				if (on&&global.PLAYING_RECORD&&!global.PAUSING_RECORD)
			  		{
			  		self.playButton.fn();
				global.JUST_LOAD_A_SONG=true;
			  	}
			};
			window.onblur = function () {
				eventPause(global.AUTO_PAUSE);
			};

			//STOP
			var stopstyle= PianoicStyle.menuContainer.child.stopButton;
			var stopButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,stopButton,stopstyle);
			var stopImage =arr_buttonImage[0];
			stopButton.initialize(director,stopImage,0,1,2,0,function(){
				if(global.RECORDING) return;
				if (global.cancel()) return;
				global.JUST_LOAD_A_SONG = false;
				if (stopButton._isDown) stopButton._isDown();
				if(global.PLAYING_RECORD) {
					currentRecordIndex = 0;
					playButton.setBackgroundImage(playImage,true);
					global.PLAYING_RECORD = false;
					global.PAUSING_RECORD = false;
					if(global.PLAY_FILE){
						global.playingAudio.pause();
						global.playingAudio.currentTime = 0;
					}
					global.pausedStart = 0;
				}
			});
			self.stopButton = stopButton;
			self.addChild(stopButton);
			main.stopButton=stopButton;

			//VOLUME
			var volumestyle= PianoicStyle.menuContainer.child.volumeButton;
			var volumeButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,volumeButton,volumestyle);
			var volumeImage =arr_buttonImage[0];
			var activevolumeImage =arr_buttonImage[1];
			volumeButton.initialize(director,volumeImage,0,1,2,0,
			function(){
				if (self.volumeBar.visible) volumeButton.setBackgroundImage(volumeImage);
				else volumeButton.setBackgroundImage(activevolumeImage);
				self.volumeBar.setVisible(!self.volumeBar.visible);
			});
			this.volumeButton = volumeButton;
			this.addChild(volumeButton);
			main.volumeButton=volumeButton;

			//INFO SONG BAR		
			
			var bginfosong= PianoicStyle.menuContainer.child.bginfosongActor;
			var bginfosongActor = new CAAT.Foundation.Actor();
			setPianoicStyle(director,bginfosongActor,bginfosong);
			this.addChild(bginfosongActor);
			main.bginfosongActor=bginfosongActor;
			bginfosongActor.cacheAsBitmap();

			/*var infosongstyle= PianoicStyle.menuContainer.child.infosongActor;
			var infosongActor = new CAAT.Foundation.Actor();
			setPianoicStyle(director,infosongActor,infosongstyle);
			this.addChild(infosongActor);			
			infosongActor.cacheAsBitmap(this.time,CAAT.Foundation.Actor.CACHE_DEEP);*/

			//CREATE SHEET
			var sheetstyle= PianoicStyle.menuContainer.child.sheetButton;
			var sheetButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,sheetButton,sheetstyle);
			var sheetImage =arr_buttonImage[0];
			sheetButton.initialize(director,sheetImage,0,1,2,0,function(){
				var speed=0.5;	
				var musicAllData = musicList[global.SELECTING_RECORD].Data;
				var singleMusicData;
				switch(global.DIFFICULTY){
					case global.DIFFICULTY_EASY: singleMusicData = musicAllData.Easy; break;
					case global.DIFFICULTY_HARD: singleMusicData = musicAllData.Hard; break;
					case global.DIFFICULTY_INSANE: singleMusicData = musicAllData.Insane; break;
				}
				var recordData=stringToRecordData(singleMusicData.fNodeData);
				var record="";//console.log(recordData)
				var length=recordData.length;
				var len1=length-1;
				for (var i=0;i<length;i++){
					var currentKey = keyData[recordData[i].keyIndex];
					var key="";

					
					if ( currentKey.keyCode[0] >= 96 && currentKey.keyCode[0] <= 105){
						key='<span style="color:red">'+String.fromCharCode(currentKey.keyCode[0]-48)+'</span>';
					} else
					{
						if (currentKey.keyCode[0] >= 48 && currentKey.keyCode[0] <= 90) {
						if (!currentKey.isShift[0])
							key=String.fromCharCode(currentKey.keyCode[0]).toLowerCase();
						else
							key=String.fromCharCode(currentKey.keyCode[0]);
						}else {
							switch(currentKey.keyCode[0]){
								case 13: if (currentKey.location[0]==0) 
											key='En'; 
										else key='<span style="color:red">'+"En"+'</span>';
										break;
								case 106:key='<span style="color:red">'+"*"+'</span>';break;
								case 107:key='<span style="color:red">'+"+"+'</span>';break;
								case 109:key='<span style="color:red">'+"-"+'</span>';break;
								case 110:key='<span style="color:red">'+"D"+'</span>';break;
								case 111:key='<span style="color:red">'+"En"+'</span>';break;
							}
						}
					}
					var time=recordData[i].time;
					if (i!=len1)
						if (time==recordData[i+1].time){
							if (recordData[i].keyIndex!=recordData[i+1].keyIndex)
							record+=key;
						}					
						else if (recordData[i+1].time-time>1000*speed)
							record +=key +"</br>";
						else
							record+=key+" ";
				}
				$('#basic-modal-content').modal({autoResize :true,appendTo:'#frame',overlayClose :true,focus:false,onShow:function(){sheetButton._show=true},_onClose:function(){sheetButton._show=false},fixed:false});
			 	document.getElementById('basic-modal-content').innerHTML='<h3 id="popupsheet"></h3>\n<p id="copysheet">Examples:</p>\n<p><code id="code"></code></p>';
			 	document.getElementById('popupsheet').innerHTML=LANG.popup.popupsheet[global.LANGUAGE];
			 	document.getElementById('copysheet').innerHTML=LANG.popup.copysheet[global.LANGUAGE];		 	
			 	document.getElementById('code').innerHTML=record;
			 	//document.getElementById('share').innerHTML=" "+LANG.popup.share[global.LANGUAGE];
			 	document.getElementById('code').onmousedown=function(){selectText('code')}
			 	selectText('code');
			 	eventPause(true);
			});
			self.sheetButton = sheetButton;
			self.addChild(sheetButton);
			main.sheetButton=sheetButton;

			//PLAYLIST
			var playListstyle= PianoicStyle.menuContainer.child.playListButton;
			var playListButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,playListButton,playListstyle);
			var playListImage =arr_buttonImage[0];
			/*var deltaButton = this.width/2 - playListImage.singleHeight/2;
			this.deltaButton = deltaButton;*/
			var firstplaylist=false;
			playListButton.initialize(director,playListImage,0,1,2,0,
			function(e){
				global.JUST_LOAD_A_SONG = false;
				if(self.inAnimation) return;
				if (global.cancel()) return;
				if(global.PLAYING_RECORD&&(!global.PAUSING_RECORD)) self.playButton.fn();
				else if(global.countingDown)self.stopButton.fn();
				self.inAnimation = true;
				var playListstyle=PianoicStyle.playListContainer;
				var playListPosX = playListstyle.bound.x;
				var playListPosY = playListstyle.bound.y;
				var playListWidth = playListstyle.bound.width;
				var highScorestyle=PianoicStyle.highScoreContainer;
				var highScorePosX = highScorestyle.bound.x;
				var highScorePosY = highScorestyle.bound.y;
				var highScoreWidth = highScorestyle.bound.width;

				
				self.playListContainer.setLocation(playListPosX,playListPosY);
				self.highScoreContainer.setLocation(highScorePosX,highScorePosY);
				self.highScoreContainer.enableEvents(true);
				self.playListContainer.enableEvents(true);
				disable(true);
				self.selectPlayList = true;
				self.playListContainer.currentRecord = global.SELECTING_RECORD;
				self.playListContainer.currentDifficulty = global.DIFFICULTY;
				var path= new CAAT.PathUtil.LinearPath().
					setInitialPosition(director.width,self.y).
					setFinalPosition(self.playListContainer.x,self.playListContainer.y);
				var pathBehavior= new CAAT.PathBehavior().setPath( path ).setFrameTime(self.time,369).
				addListener({
					behaviorExpired: function(director,time){
						self.inAnimation = false;						
					}
				});
				self.playListContainer.addBehavior(pathBehavior);
				
				var path2= new CAAT.PathUtil.LinearPath().
					setInitialPosition(-self.highScoreContainer.width,self.y).
					setFinalPosition(self.highScoreContainer.x,self.highScoreContainer.y);
				var pathBehavior2= new CAAT.PathBehavior().setPath( path2 ).setFrameTime(self.time,369);
				self.highScoreContainer.addBehavior(pathBehavior2);
				
			});			
			this.playListButton = playListButton;
			this.addChild(playListButton);
			main.playListButton=playListButton;

			//SHARE
			var sharestyle= PianoicStyle.menuContainer.child.shareButton;
			var shareButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,shareButton,sharestyle);
			var shareImage =arr_buttonImage[0];			

			shareButton.initialize(director,shareImage,0,1,2,0,function(){	
				global.JUST_LOAD_A_SONG = false;
				if(global.PLAYING_RECORD&&(!global.PAUSING_RECORD)) self.playButton.fn();
				else if(global.countingDown) self.stopButton.fn();
				disable(true);
				
				var sharestyle=PianoicStyle.shareContainer;
				var sharePosX = sharestyle.bound.x;
				var sharePosY = sharestyle.bound.y;

				self.shareContainer.setLocation(sharePosX,sharePosY);
				self.shareContainer.enableEvents(true);
				var path= new CAAT.PathUtil.LinearPath().
					setInitialPosition(director.width,self.y).
					setFinalPosition(self.shareContainer.x,self.shareContainer.y);
				var pathBehavior= new CAAT.PathBehavior().setPath( path ).setFrameTime(self.time,369).
				addListener({
					behaviorExpired: function(director,time){
						div_linkshare.style.display='block';
						selectText('div_linkshare');
					}
				});
				self.shareContainer.addBehavior(pathBehavior);

				
				var musicName=musicList[global.SELECTING_RECORD].Name;
				var EName=UnSign(musicName);
				var arr_name=EName.split(" ");
				var completeName="";
				for (var x=0;x<arr_name.length;x++)
					completeName+=arr_name[x];
				var text="http://pianoic.com/#/"+self.shareContainer.number+"-"+global.SELECTING_RECORD+"-"+global.DIFFICULTY+"/"+completeName;
				
						 	
			 	document.getElementById('div_linkshare').innerHTML=text;				
			 	self.shareContainer.radioCheck.fn=function(){
			 		self.shareContainer.number=(self.shareContainer.number==0?1:0);
			 		text="http://pianoic.com/#/"+self.shareContainer.number+"-"+global.SELECTING_RECORD+"-"+global.DIFFICULTY+"/"+completeName;
			 		document.getElementById('div_linkshare').innerHTML=text;
			 		selectText('div_linkshare');
			 	};
			 	
			 	//eventPause(true);
			 	
			});
			shareButton._show=false;
			self.shareButton = shareButton;
			self.addChild(shareButton);
			main.shareButton=shareButton;


			//SETTING
			var settingstyle= PianoicStyle.menuContainer.child.settingButton;
			var settingButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,settingButton,settingstyle);
			var settingImage =arr_buttonImage[0];

			settingButton.initialize(director,settingImage,0,1,2,0,
			function(){
				global.JUST_LOAD_A_SONG = false;
				if(global.PLAYING_RECORD&&(!global.PAUSING_RECORD)) self.playButton.fn();
				else if(global.countingDown) self.stopButton.fn();
				disable(true);
				if(self.chooseSetting.selectSetting==1) global.onsetkey=true;
				self.selectSetting=true;
				var settingstyle=PianoicStyle.settingContainer;
				var settingPosX = settingstyle.bound.x;
				var settingPosY = settingstyle.bound.y;
				//var settingWidth = settingstyle.bound.width;
				var chooseSettingstyle=PianoicStyle.chooseSetting;
				var chooseSettingPosX = chooseSettingstyle.bound.x;
				var chooseSettingPosY = chooseSettingstyle.bound.y;
				// var chooseSettingWidth = chooseSettingstyle.bound.width;

				self.settingContainer.setLocation(settingPosX,settingPosY);
				self.chooseSetting.setLocation(chooseSettingPosX,chooseSettingPosY);
				self.chooseSetting.enableEvents(true);
				self.settingContainer.enableEvents(true);
				var path= new CAAT.PathUtil.LinearPath().
					setInitialPosition(director.width,self.y).
					setFinalPosition(self.settingContainer.x,self.settingContainer.y);
				var pathBehavior= new CAAT.PathBehavior().setPath( path ).setFrameTime(self.time,369);
				self.settingContainer.addBehavior(pathBehavior);

				var path2= new CAAT.PathUtil.LinearPath().
					setInitialPosition(-self.chooseSetting.width,self.y).
					setFinalPosition(self.chooseSetting.x,self.chooseSetting.y);
				var pathBehavior2= new CAAT.PathBehavior().setPath( path2 ).setFrameTime(self.time,369);
				self.chooseSetting.addBehavior(pathBehavior2);

			});
			this.settingButton = settingButton;
			this.addChild(settingButton);
			main.settingButton=settingButton;
			
		
			

			//FULL SCREEN
			var fullscreenstyle= PianoicStyle.menuContainer.child.fullscreenButton;
			var fullscreenButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,fullscreenButton,fullscreenstyle);
			var fullscreenImage =arr_buttonImage[0];
			fullscreenButton.initialize(director,fullscreenImage,0,1,2,0,function(){	
				var element=document.getElementById('frame');
				var _isFullscreen=document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement ? true : false;
				if (!_isFullscreen)  {
				  if(element.requestFullscreen) {
				    element.requestFullscreen();
				  } else if(element.mozRequestFullScreen) {
				    element.mozRequestFullScreen();
				  } else if(element.webkitRequestFullscreen) {
				  	element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				    element.webkitRequestFullscreen();
				  } else if(element.msRequestFullscreen) {
				    element.msRequestFullscreen();
				  }
				  director.setScaleProportional2(window.screen.width, window.screen.height);
				} else {
				  if(document.exitFullscreen) {
				    document.exitFullscreen();
				  } else if(document.mozCancelFullScreen) {
				    document.mozCancelFullScreen();
				  } else if(document.webkitExitFullscreen) {
				    document.webkitExitFullscreen();
				  }
				}
			});
			self.fullscreenButton = fullscreenButton;
			self.addChild(fullscreenButton);
			main.fullscreenButton=fullscreenButton;

			
			//CHALLENGE
			var challengestyle= PianoicStyle.menuContainer.child.challengeButton;
			var challengeButton = new CAAT.Button();
			var arr_buttonImage=setPianoicStyle(director,challengeButton,challengestyle);
			var challengeImage =arr_buttonImage[0];
			challengeButton.initialize(director,challengeImage,0,1,2,0,function(){	
				//challengeTip.setVisible(!challengeTip.visible);
				self.selectOption.setVisible(!self.selectOption.visible);
				self.challengeTip.setVisible(!self.selectOption.visible);
			});
			self.challengeButton = challengeButton;
			self.addChild(challengeButton);
			main.challengeButton=challengeButton;

			
			var numberChallenge=new CAAT.Foundation.Actor().setBounds(challengeButton.width*0.75,challengeButton.height*0.75,challengeButton.width*0.5,challengeButton.height*0.5);
			numberChallenge.paint=function(director,time){
				var ctx=director.ctx;
				if(self.challengeTip.numberChallenge!=0){
					ctx.beginPath();
					ctx.fillStyle='#fff';
					ctx.arc(0,0,this.width/2,0,2*Math.PI);
					ctx.fill();
					ctx.closePath();
					ctx.fillStyle='#9b2929';
					ctx.font="20px UTM Avo";
					var text=""+self.challengeTip.numberChallenge;
					ctx.fillText(text,-ctx.measureText(text).width/2,this.height/2-5);
				}
			}
			challengeButton.addChild(numberChallenge);

			
			// selectOption.paint=function(director,time){
			// 	var ctx=director.ctx;
			// 	ctx.fillStyle=selectstyle.bgcolor;
			// 	ctx.fillRect(0,21,this.width,(this.height-21)/3-1);
			// 	ctx.fillRect(0,21+(this.height-21)/3,this.width,(this.height-21)/3-1);
			// 	ctx.fillRect(0,21+(this.height-21)*2/3,this.width,(this.height-21)/3);
			// 	ctx.beginPath();
			// 	ctx.moveTo(selectstyle.size.width-challengeButton.width*5/2, 0);
			// 	ctx.lineTo(selectstyle.size.width-challengeButton.width*3, 23);
			// 	ctx.lineTo(selectstyle.size.width-challengeButton.width*2, 23);
			// 	ctx.closePath();
			// 	ctx.fill();
			// 	ctx.fillStyle=selectstyle.fontcolor;
			// 	ctx.font=selectstyle.font;
			// 	var text1="3 Challenge Requests";
			// 	var text2="Start new challenge";
			// 	var text3="Challenge history";
			// 	var posX=selectstyle.posX;
			// 	ctx.fillText(text1,posX,(this.height-21)/3-10);
			// 	ctx.fillText(text2,posX,(this.height-21)*2/3-10);
			// 	ctx.fillText(text3,posX,this.height-31);
			// }

			

			//BG ShowKey
			var bgshowkey= PianoicStyle.menuContainer.child.bgshowkeyActor;
			var bgshowkeyActor = new CAAT.Foundation.Actor();
			setPianoicStyle(director,bgshowkeyActor,bgshowkey);
			this.addChild(bgshowkeyActor);
			main.bgshowkeyActor=bgshowkeyActor;
			bgshowkeyActor.cacheAsBitmap();
			

			var disabletyle= PianoicStyle.menuContainer.child.disableActor;
			var disableActor = new CAAT.Foundation.Actor();
			setPianoicStyle(director,disableActor,disabletyle);
			this.addChild(disableActor);
			var disable=function(on){
				disableActor.enableEvents(on);
				disableActor.setVisible(on);
			}
			main.disableActor=disableActor;
			this.disable=disable;
			disableActor.cacheAsBitmap();

			
			
			
			
			//Sort Actor
			var zindexSort=function(){
				for (x in PianoicStyle.menuContainer.child){
					if(PianoicStyle.menuContainer.child[x].zindex)
					this.setZOrder(main[x],PianoicStyle.menuContainer.child[x].zindex);
				}
			}
			zindexSort();
            return this;
        },
		closeBehavior:function(type){
			switch(type){
				case -1:
					this.settingContainer.closeBehavior(type);
					this.chooseSetting.closeBehavior(type);
					break;
				case 1,2:
					this.playListContainer.closeBehavior(type);
					this.highScoreContainer.closeBehavior(type);
					break;
				case 3:
					this.shareContainer.closeBehavior(type);
					break;
				default:
					this.settingContainer.closeBehavior(type);
					this.chooseSetting.closeBehavior(type);
					this.playListContainer.closeBehavior(type);
					this.highScoreContainer.closeBehavior(type);
					this.shareContainer.closeBehavior(type);
					break;

			}
			
			this.disable(false);
		}
    }
    function selectText(element) {
			    var doc = document
			        , text = doc.getElementById(element)
			        , range, selection;    
			    if (doc.body.createTextRange) { //ms
			        range = doc.body.createTextRange();
			        range.moveToElementText(text);
			        range.select();
			    } else if (window.getSelection) { //all others
			        selection = window.getSelection();        
			        range = doc.createRange();
			        range.selectNodeContents(text);
			        selection.removeAllRanges();
			        selection.addRange(range);
			    }
			}
    function stringToRecordData(str){
			var outputData = [];
			if(str.length==0) return outputData;
			var stringArray = str.split(",");
			//console.log(stringArray.length);
			for(var i=0;i<stringArray.length;i++){
				var temp = stringArray[i].split(" ");
				if(temp[0].charCodeAt(0)>57){
					for(var j=0;j<keyData.length;j++){
						if(temp[0] === keyData[j].name){
							temp[0] = j;
							break;
						}
					}
				}
				outputData.push({keyIndex:temp[0]<<0,time:temp[1]<<0});
			}
			return outputData;
		}
    extend(CAAT.MenuContainer, CAAT.Foundation.ActorContainer);
})();

(function () {
    CAAT.KeyBoardContainer = function () {
        CAAT.KeyBoardContainer.superclass.constructor.call(this);
        return this;
    }

    CAAT.KeyBoardContainer.prototype = {
        initialize: function (director,keys,imgs) {
            this.director = director;
			this.keys = keys;
			this.imgs = [];
			for (var i=0;i<imgs.length;i++)
			this.imgs.push(director.getImage(imgs[i]));
			this.isCache=true;
            return this;
        },
        paint: function (director,time) {
			CAAT.KeyBoardContainer.superclass.paint.call(this, director, time);
            var ctx = director.ctx;
			if(!this.painted){
				this.painted = true;
				this.startTime = time;
			}
			if(time<this.startTime+1){
				//console.log(director.getImage('key-black'))
				//var img=director.getImage(this.imgs[0]);
				length=this.keys.length;
				for(var i=0;i<length;i++) {
					var key = this.keys[i];
					var width = key.width;
					var height = key.height;
					var x = key.x-this.x;
					var y = 0;
					if ((key.type == "black")||(i!=0&&i!=length-1))
						ctx.drawImage(this.imgs[0],x,  y,width,height);
					else {
						i==0?ctx.drawImage(this.imgs[1],x,  y,width,height):ctx.drawImage(this.imgs[2],x,  y,width,height);;
					}					
				}
			}
			else 
				if(!this.cached){
				this.cached = true;
				this.cacheAsBitmap(this.startTime,CAAT.Foundation.Actor.CACHE_DEEP);
			}
            return this;
        },
		repaint: function(on){
			this.painted  = false;
			this.stopCacheAsBitmap();
		}
    }
    extend(CAAT.KeyBoardContainer, CAAT.Foundation.ActorContainer);
})();
(function () {
	CAAT.PianoKey = function () {
        CAAT.PianoKey.superclass.constructor.call(this);
        return this;
    }
    CAAT.PianoKey.prototype = {
	initialize : function (director,keyBoardActor, posX, posY, type, keyIndex,imgs,playbackBoard) {
		this.director = director;
		this.keyBoardActor = keyBoardActor;
		this.x = posX;
		this.y = posY;
		width=this.width;
		height=this.height;
		this.keyIndex = keyIndex;
		this.hitting = false;
		this.type = type;
		this.imgs=imgs;
		var img=new CAAT.SpriteImage(director.getImage(imgs[0]),1,1);
		this.shadow = new CAAT.ActorContainer().setBackgroundImage(img).setBounds(posX,posY,width,height).setAlpha(0).enableEvents(false).setVisible(false);
		this.pressedgreen = new CAAT.ActorContainer().setBounds(posX,posY,width,height).enableEvents(false).setVisible(false);
		
		var hitkeygreenstyle=PianoicStyle.playbackBoard.child.hitkeygreen;
		this.hitkeygreen = new CAAT.Foundation.ActorContainer();
		var img=setPianoicStyle(director,this.hitkeygreen,hitkeygreenstyle);
		this.hitkeygreen.setLocation(posX,playbackBoard.height-img[0].height).
		//this.hitkeygreen.setLocation(posX,posY-img[0].height).
			enableEvents(false).setVisible(false);		
		keyBoardActor.addChild(this.pressedgreen);
		playbackBoard.addChild(this.hitkeygreen);
		keyBoardActor.addChild(this.shadow);
		return this;
	},
	score: function(time){
		var self = this;
		var alphaBehavior = new CAAT.Behavior.AlphaBehavior().setValues(1, 0).setDelayTime(0, 1000).setCycle(false).
			addListener({
				behaviorExpired: function(director, time) {
					self.hitkeygreen.setVisible(false);
					self.hitkeygreen.emptyBehaviorList();
				}
			});
		this.hitkeygreen.addBehavior(alphaBehavior);
		this.hitkeygreen.setVisible(true);
		return this;
	},
	hit : function(){
			var self = this;
			if(this.hitting){
				this.shadow.emptyBehaviorList();
			}
			this.hitting = true;
			var alphaBehavior = new CAAT.Behavior.AlphaBehavior().setValues(1, 0).setDelayTime(0, 1000).setCycle(false).
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
	pressed:function(type){
		var self=this;
		type==0?this.pressedgreen.setBackgroundImage(self.imgs[1]).setVisible(true):this.pressedgreen.setBackgroundImage(self.imgs[2]).setVisible(true);
	},
	unpressed:function(){
		this.pressedgreen.setBackgroundImage(this.imgs[1]).setVisible(false);
	}
	}
	extend(CAAT.PianoKey, CAAT.Foundation.ActorContainer);

})();
(function () {
	CAAT.ShareContainer = function () {
        CAAT.ShareContainer.superclass.constructor.call(this);
        return this;
    }
    CAAT.ShareContainer.prototype = {
		initialize : function (menuContainer) {
			var self=this;
			this.director = menuContainer.director;
			this.menuContainer=menuContainer;
			var global=this.director.globalVariables;
			
			var radioCheckstyle=PianoicStyle.shareContainer.child.radiocheck;
			var songlinkstyle=PianoicStyle.shareContainer.child.songlink;			
			var songlink = new CAAT.Foundation.ActorContainer();
			var imgs=setPianoicStyle(self.director,songlink,songlinkstyle);
			var content1=new CAAT.Foundation.Actor().setBounds(0,0,songlink.width,songlink.height);
			var img1=this.director.getImage(imgs);
			var text1=LANG.popup.copylink[global.LANGUAGE];
			var text2=LANG.popup.isplay[global.LANGUAGE];
			var startTime;
			var t=songlink.time;
			content1.paint=function(director,time){				
				var ctx=director.ctx;
				ctx.fillStyle=songlinkstyle.bgcolor;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.drawImage(img1,30,songlink.height/2-img1.height/2,img1.width,img1.height);
				ctx.fillStyle=songlinkstyle.text.fontcolor;
				ctx.font=songlinkstyle.text.font;
				ctx.fillText(text1,songlinkstyle.text.posX,songlinkstyle.text.posY);
				ctx.font=radioCheckstyle.font;
				ctx.fillText(text2,radioCheckstyle.posX+radioCheckstyle.textHeight*2,radioCheckstyle.posY+radioCheckstyle.textHeight*2/3);
				return this;
			
			};
			songlink.addChild(content1);
			
			// var iconShare=new CAAT.Foundation.Actor().
			// 				setBackgroundImage(img1[0]).
			// 				setLocation(30,songlink.height/2-img1[0].height/2);
			// songlink.addChild(iconShare);
			this.addChild(songlink);
			this.songlink=songlink;
			songlink.cacheAsBitmap(songlink.time,CAAT.Foundation.Actor.CACHE_DEEP);

						
			var radioCheck = new CAAT.RadioCheck();
			var arr_radiocheck=setPianoicStyle(self.director,radioCheck,radioCheckstyle);
			radioCheck.setLocation(radioCheckstyle.posX,radioCheckstyle.posY)
					.initialize(self.director,arr_radiocheck[0],arr_radiocheck[1],true,function(){
						
					});
			this.addChild(radioCheck);
			this.radioCheck=radioCheck;

			var sharegamestyle=PianoicStyle.shareContainer.child.sharegame;			
			var sharegame = new CAAT.Foundation.ActorContainer();
			var imgs=setPianoicStyle(self.director,sharegame,sharegamestyle);
			var img2=this.director.getImage(imgs);
			var text3=LANG.popup.share[global.LANGUAGE];
			var content2=new CAAT.Foundation.Actor().setBounds(0,0,sharegame.width,sharegame.height).enableEvents(false);
			content2.paint=function(director,time){				
				var ctx=director.ctx;
				ctx.fillStyle=sharegamestyle.bgcolor;
				ctx.fillRect(0,0,this.width,this.height);
				ctx.drawImage(img2,30,sharegame.height/2-img2.height/2,img2.width,img2.height);
				ctx.fillStyle=sharegamestyle.text.fontcolor;
				ctx.font=sharegamestyle.text.font;
				ctx.fillText(text3,sharegamestyle.text.posX,sharegamestyle.text.posY);
				
				return this;
			
			};
			sharegame.addChild(content2);
			// var iconFB=new CAAT.Foundation.Actor().
			// 				setBackgroundImage(img2[0]).
			// 				setLocation(30,songlink.height/2-img2[0].height/2);
			// sharegame.addChild(iconFB);
			this.addChild(sharegame);
			this.sharegame=sharegame;
			sharegame.cacheAsBitmap(sharegame.time,CAAT.Foundation.Actor.CACHE_DEEP);
			sharegame.mouseDown=function(argument) {
				// body...
				var linkshare="https://www.facebook.com/sharer/sharer.php?u=http://pianoic.com";
				var doclink=document.createElement('a');
				doclink.setAttribute('href',linkshare);
				doclink.setAttribute('target',"_blank");
				doclink.click();
			}

			var offButtonstyle=PianoicStyle.shareContainer.child.offButtonPosition;
			var offButtonPosition = new CAAT.Foundation.Actor();
			var arr_offbutton=setPianoicStyle(self.director,offButtonPosition,offButtonstyle);
			offButtonPosition.setBackgroundImage(arr_offbutton[0]);
			offButtonPosition.mouseEnter = function(){
				offButtonPosition.setBackgroundImage(arr_offbutton[1]);
			}
			offButtonPosition.mouseExit = function(){
				offButtonPosition.setBackgroundImage(arr_offbutton[0]);
			}
			offButtonPosition.mouseDown = function(){				
				menuContainer.closeBehavior(3);			
			}
			this.addChild(offButtonPosition);
			this.offButtonPosition = offButtonPosition;

			var div_linkshare=document.createElement('div');

			div_linkshare.id="div_linkshare";
			div_linkshare.style.position= "absolute";
			div_linkshare.innerHTML="  FAFAFAFA";

			var div_linksharestyle=PianoicStyle.shareContainer.child.link;
			var factor = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);			
			
			div_linkshare.style.left=div_linksharestyle.data.x*factor+document.getElementById('canvas').style.left+"px";
			div_linkshare.style.top=div_linksharestyle.data.y*factor+"px";
			div_linkshare.style.width=div_linksharestyle.data.width*factor+"px";
			div_linkshare.style.height=div_linksharestyle.data.height*factor+"px";
			div_linkshare.style.borderLeft=div_linksharestyle.data.borderLeftWidth*factor+"px solid #65B43D";
			div_linkshare.style.background=div_linksharestyle.data.bgcolor; 
			div_linkshare.style.fontFamily=div_linksharestyle.data.fontFamily; 
			div_linkshare.style.fontSize=div_linksharestyle.data.fontSize*factor+"px"; 
			div_linkshare.style.fontStyle=div_linksharestyle.data.fontStyle; 
			div_linkshare.style.color=div_linksharestyle.data.color; 
			div_linkshare.style.textIndent=div_linksharestyle.data.textIndent*factor+"px";
			div_linkshare.style.display='none';
			div_linkshare.onmousedown=function(){
				selectText('div_linkshare');
			}
			var initData=div_linksharestyle.data;
			div_linkshare.initData=JSON.stringify(initData);
			global.div_elements.push(div_linkshare);
			document.getElementById('frame').appendChild(div_linkshare);

			this.number=1;
			return this;
		},
		setLink: function(link){
			return this;
		},
		closeBehavior: function(){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(this.director.width,0);
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
				}
			});
			self.addBehavior(pathBehavior);
			div_linkshare.style.display='none';
		}
	}
	extend(CAAT.ShareContainer, CAAT.Foundation.ActorContainer);

})();
(function () {
	CAAT.ToolTipsActor = function () {
        CAAT.ToolTipsActor.superclass.constructor.call(this);
        return this;
    }
    CAAT.ToolTipsActor.prototype = {
		initialize : function (menuContainer) {
			var self=this;
			this.director = menuContainer.director;
			this.menuContainer=menuContainer;
			var global=this.director.globalVariables;
			
			var challengeButton=menuContainer.challengeButton;
			var selectstyle=PianoicStyle.tooltips.selectOption;
			this.setBounds(challengeButton.x-selectstyle.size.width+challengeButton.width*3,challengeButton.y+86,selectstyle.size.width,selectstyle.size.height);
			
			var selectOption=new CAAT.Foundation.ActorContainer().setBounds(0,0,this.width,this.height).setVisible(false);
			selectOption.paint=function(director,time){
				var ctx=director.ctx;
				ctx.fillStyle=selectstyle.bgcolor;
				ctx.beginPath();
				ctx.moveTo(this.width-challengeButton.width*5/2, 0);
				ctx.lineTo(this.width-challengeButton.width*3, 23);
				ctx.lineTo(this.width-challengeButton.width*2, 23);
				ctx.closePath();
				ctx.fill();
			};
			var texts=[
				LANG.challenge.request[global.LANGUAGE],
				LANG.challenge.startnew[global.LANGUAGE],
				LANG.challenge.history[global.LANGUAGE]
			];
			var buttons=[];
			for (var i=0;i<texts.length;i++){
				var height=(selectOption.height-21)/3;
				var posY=(selectOption.height-21)/3*i+21;
				var buttonSelectChallenge=new CAAT.Foundation.ActorContainer()
												.setFillStyle(selectstyle.bgcolor)
												.setBounds(0,posY,selectOption.width,height);
				var textActor = new CAAT.Foundation.Actor()
								.setBounds(0,0,buttonSelectChallenge.width,buttonSelectChallenge.height)
								.enableEvents(false);
				textActor.text=texts[i];
				textActor.paint=function(director,time){
					var ctx=director.ctx;
					ctx.fillStyle=selectstyle.fontcolor;
					ctx.font=selectstyle.font;
					
					ctx.fillText(this.text,this.width/2-ctx.measureText(this.text).width/2,this.height-25);
				}
				var textContainer=new CAAT.Foundation.ActorContainer();
				textContainer.addChild(textActor);
				textContainer.cacheAsBitmap(textContainer.time,CAAT.Foundation.Actor.CACHE_DEEP);
				buttonSelectChallenge.addChild(textContainer);
				buttonSelectChallenge.mouseEnter=function(){
					this.setFillStyle(selectstyle.selectFill);
				}
				buttonSelectChallenge.mouseExit=function(){
					this.setFillStyle(selectstyle.bgcolor);
				}
				buttons.push(buttonSelectChallenge);
				selectOption.addChild(buttonSelectChallenge);
			}
			this.addChild(selectOption);
			selectOption.buttons=buttons;
			menuContainer.selectOption=selectOption;

			var tipstyle=PianoicStyle.tooltips.tooltip;
			var challengeTip=new CAAT.Foundation.Actor()
						.setBounds(0,0,tipstyle.size.width,tipstyle.size.height)
						.setVisible(true);
			challengeTip.numberChallenge=3;
			challengeTip.paint=function(director,time){
				var ctx=director.ctx;
				ctx.fillStyle=tipstyle.bgcolor;
				ctx.fillRect(0,21,this.width,this.height-21);
				ctx.beginPath();
				ctx.moveTo(tipstyle.size.width-challengeButton.width*5/2, 0);
				ctx.lineTo(tipstyle.size.width-challengeButton.width*3, 23);
				ctx.lineTo(tipstyle.size.width-challengeButton.width*2, 23);
				ctx.closePath();
				ctx.fill();
				ctx.fillStyle=tipstyle.fontcolor;
				ctx.font=tipstyle.font;
				var text=LANG.challenge.tooltip1[global.LANGUAGE]+ challengeTip.numberChallenge +LANG.challenge.tooltip2[global.LANGUAGE];
				ctx.fillText(text,this.width/2-ctx.measureText(text).width/2,this.height-20);
			}
			this.addChild(challengeTip);
			menuContainer.challengeTip=challengeTip;
			
			
						
						//.setVisible(false);
			
			
			return this;
		},
		closeBehavior: function(){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(this.director.width,0);
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
				}
			});
			self.addBehavior(pathBehavior);
			div_linkshare.style.display='none';
		}
	}
	extend(CAAT.ToolTipsActor, CAAT.Foundation.ActorContainer);

})();
(function () {
	CAAT.ChallengeContainer = function () {
        CAAT.ChallengeContainer.superclass.constructor.call(this);
        return this;
    }
    CAAT.ChallengeContainer.prototype = {
		initialize : function (menuContainer) {
			var self=this;
			this.director = menuContainer.director;
			this.menuContainer=menuContainer;
			var global=this.director.globalVariables;
			this.global=global;
			var main=new CAAT.Foundation.ActorContainer().setBounds(0,0,this.width,this.height).enableEvents(false);
			global.SELECTING_CHALLENGE=0;
			var childstyle=PianoicStyle.challengeContainer.child;
			var title=new CAAT.Foundation.Actor();
			setPianoicStyle(self.director, title,childstyle.title);
			title.setLocation(self.width/2-title.width/2,0)
			title.paint=function(director,time){
	            var ctx = director.ctx;
				ctx.fillStyle=childstyle.title.bgcolor;
				ctx.fillRect(0,0,this.width,this.height);
				var text=LANG.challenge.request[global.LANGUAGE];
				ctx.fillStyle=childstyle.title.fontcolor;
				ctx.font=childstyle.title.font;
				ctx.fillText(text,this.width/2-ctx.measureText(text).width/2,childstyle.title.textHeight);
			}
			main.addChild(title);
			this.addChild(main);
			main.cacheAsBitmap(main.time,CAAT.Foundation.Actor.CACHE_DEEP);
			// var body=new CAAT.Foundation.ActorContainer();
			// setPianoicStyle(self.director, body,childstyle.body);
			
			// this.addChild(body);
			
			
			if(!global.challenge) {

				global.challenge=[{name:"Hoang Anh1",song:[{mid:1}]},{name:"Hoang Anh2",song:[{mid:2}]},{name:"Hoang Anh3",song:[{mid:3}]},{name:"Hoang Anh4",song:[{mid:4}]}];
			}
			for (var mmm in global.challenge){
				global.challenge[mmm].songname='';
				for (var idsong in global.challenge[mmm].song)
					for (var ml=0;ml<musicList.length;ml++)
						if(musicList[ml].ID==global.challenge[mmm].song[idsong].mid)
							{
								global.challenge[mmm].songname+=musicList[ml].Name+" - ";
							}
			}
			var maxValue = global.challenge.length||3;
			var maxLine=3;
			var textStartY=childstyle.body.bound.y+childstyle.body.textHeight;
			var lineSpace=childstyle.body.textHeight;
			var scrollPosition=0;
			var scrollerbar=new CAAT.ScrollBarContainer()
				.initialize(self.director,self,maxValue,maxLine,textStartY,lineSpace,scrollPosition);
			this.addChild(scrollerbar);

			this.scrollerbar=scrollerbar;

			return this;
		},
		paint:function(director,time){
			CAAT.ChallengeContainer.superclass.paint.call(this, director, time);
            var ctx = director.ctx;
            var global=director.globalVariables;
            var childstyle=PianoicStyle.challengeContainer.child;
			var scrollPosition = this.scrollerbar.scrollPosition;
			var textStartY=childstyle.body.bound.y;
			var textHeight=childstyle.body.textHeight;

			ctx.fillStyle=childstyle.body.bgcolor;
			ctx.fillRect(childstyle.body.bound.x,childstyle.body.bound.y,childstyle.body.bound.width,childstyle.body.bound.height);
			var height=childstyle.body.bound.height/this.scrollerbar.showmaxline;
			
			// ctx.fillStyle="#983132";			
			// if((global.SELECTING_CHALLENGE-scrollPosition>=0)&&(global.SELECTING_CHALLENGE-scrollPosition<this.scrollerbar.showmaxline))
			// ctx.fillRect(0,textStartY+textHeight*(global.SELECTING_CHALLENGE-scrollPosition),this.width,textHeight);
			for(var i=scrollPosition;i<global.challenge.length;i++){
				if(i>=scrollPosition+this.scrollerbar.showmaxline) break;
			// }
			
			// for (var i=0;i<this.scrollerbar.showmaxline;i++){
				var textPosY = textStartY+(i-scrollPosition)*height+childstyle.body.posY;
				ctx.fillStyle=childstyle.body.fontcolor;
				ctx.font=childstyle.body.font;
				var text=global.challenge[i].name;
				ctx.fillText(text,childstyle.body.posX,textPosY);
				ctx.font=childstyle.body.font1;
				var text2=global.challenge[i].songname;
				
				ctx.fillText(text2,childstyle.body.posX,textPosY+50);

				ctx.fillStyle=childstyle.button.bgcolor;
				ctx.fillRect(childstyle.button.posX,textPosY,childstyle.button.size.width,childstyle.button.size.height);
				ctx.fillRect(childstyle.button.posX+childstyle.button.size.width+20,textPosY,childstyle.button.size.width,childstyle.button.size.height);
				
				ctx.fillStyle=childstyle.button.fontcolor;
				ctx.font=childstyle.button.font;
				var text3=LANG.challenge.deny[global.LANGUAGE];
				var text4=LANG.challenge.accept[global.LANGUAGE];
				ctx.fillText(text3,childstyle.button.posX+childstyle.button.size.width/2-ctx.measureText(text3).width/2,textPosY+40);
				ctx.fillText(text4,childstyle.button.posX+childstyle.button.size.width*1.5-ctx.measureText(text4).width/2+20,textPosY+40);
			}
			
		},
		mouseDown: function(e){
			var self = this;
			var childstyle=PianoicStyle.challengeContainer.child;
			var height=childstyle.body.bound.height/this.scrollerbar.showmaxline;
			var buttonHeight=childstyle.button.size.height;
			var startY=childstyle.body.bound.y+childstyle.body.posY;
			if(self.menuContainer.inAnimation) return;
			for(var i=0;i<this.scrollerbar.showmaxline;i++){
				if((e.y>startY+i*height)&&(e.y<startY+i*height+buttonHeight)){
					// this.global.SELECTING_RECORD = i+self.scrollerbar.scrollPosition;
					console.log( i+self.scrollerbar.scrollPosition)
					if(e.x>childstyle.button.posX&&e.x<childstyle.button.posX+childstyle.button.size.width){
						console.log("deny")
						break;
					} else if(e.x>childstyle.button.posX+childstyle.button.size.width+20&&e.x<childstyle.button.posX+childstyle.button.size.width*2+20){
						console.log("accept");
						var song=[{mid:5,level:1}];
						self.global.nhanthachdau(-1,song);
						self.closeBehavior();
						break;
					}
					
				}
			}
		},
		closeBehavior: function(){
			var self = this;
			var path= new CAAT.PathUtil.LinearPath().
				setInitialPosition(this.x,this.y).
				setFinalPosition(this.director.width,0);
			var pathBehavior= new CAAT.PathBehavior().setPath(path).setFrameTime(self.time,369).
			addListener({
				behaviorExpired: function(director,time){
					self.emptyBehaviorList();
				}
			});
			self.addBehavior(pathBehavior);
		}
	}
	extend(CAAT.ChallengeContainer, CAAT.Foundation.ActorContainer);

})();
(function () {
	CAAT.ScrollBarContainer = function () {
        CAAT.ScrollBarContainer.superclass.constructor.call(this);
        return this;
    }
    CAAT.ScrollBarContainer.prototype = {
		initialize : function (director,container,maxValue,maxLine,textStartY,lineSpace,scrollPosition) {
			var self=this;
			this.director=director;
			this.container=container;
			this.scrollPosition = scrollPosition||0;
			this.textStartY=textStartY||0;
			this.textHeight = this.lineSpace=lineSpace||0;
			this.showmaxline=maxLine||4;
			maxValue>maxLine?this.maxValue=maxValue:this.maxValue=maxLine+1;
			var mouseWheelEventFn = function(e){
				var orientation = e.wheelDelta || -e.detail;
				if(!self.scrollBar||self.disable) return;
				if(self.x<self.director.width){
					var delta = (self.scroller.maxHeight/self.scroller.maxValue)<<0;
					if(orientation>0){
						if(self.scroller.y>=delta)self.scroller.y-=delta;
						else self.scroller.y = 0;
					}
					else{
						if(self.scroller.y<=self.scroller.maxHeight-delta) self.scroller.y+=delta;
						else self.scroller.y = self.scroller.maxHeight;
					}
				}
			}
			setWheelEvent(mouseWheelEventFn);
			//this.setBounds(this.width-20,this.textStartY - this.lineSpace*2/3, 20,this.lineSpace*this.showmaxline );
			if(this.maxValue>this.showmaxline){
				this.scrollBar = new CAAT.ActorContainer().
									setBounds(container.width-20,this.textStartY - this.lineSpace*2/3,
											20,this.lineSpace*this.showmaxline ).enableEvents(true);
									//setFillStyle("#CCC");
				this.scroller = new CAAT.ActorContainer().
									setBounds(0,this.scrollBar.width/2 - 5,
											10,this.scrollBar.height/(self.maxValue-this.showmaxline+1)).
									setFillStyle("#333").
									enableEvents(false).
									setAlpha(0.5);
				this.scrollBar.addChild(this.scroller);
				container.addChild(this.scrollBar);
				this.scroller.maxHeight = this.scrollBar.height-this.scroller.height;
				this.scroller.maxValue = this.maxValue-this.showmaxline+1;
				this.scrollBar.mouseDown = function(e){
					if((e.y>self.scroller.y)&&(e.y<self.scroller.y+self.scroller.height)) {
						self.lastMouseY = e.y;
						self.dragging = true;
					}
				}
				this.scrollBar.mouseDrag = function(e){
					if(self.dragging){
						var nextY = self.scroller.y + e.y - self.lastMouseY;
						self.lastMouseY = e.y;
						if((nextY>=0)&&(nextY<=self.scrollBar.height - self.scroller.height)){
							self.scroller.y = nextY;
						}
					}
				}
				this.scrollBar.mouseUp = function(e){
					if(self.dragging) self.dragging = false;
				}
			}
			
			return this;
		},
		paint:function(director,time){
			CAAT.ScrollBarContainer.superclass.paint.call(this, director, time);
            var ctx = director.ctx;
			if(this.scrollBar) 	{
				var scrollPercent =  (100*(this.scroller.y/(this.scrollBar.height-this.scroller.height)))<<0;
				var percent = (scrollPercent==100)?scrollPercent-1:scrollPercent;
				this.scrollPosition = (this.scroller.maxValue*percent/100)<<0;
			}
			else this.scrollPosition = 0;
		},
		setMaxValue:function(maxValue){
			if(maxValue>=this.showmaxline)		
			{	this.maxValue=maxValue;
				this.scroller.maxValue = this.maxValue-this.showmaxline+1;
			}
			return this;
		},
		setVisibleScroll:function(on){
			this.scrollBar.setVisible(on);
			this.setVisible(on);
			on?this.disable=false:this.disable=true;
			return this;
		}
	}
	extend(CAAT.ScrollBarContainer, CAAT.Foundation.ActorContainer);

})();
(function (window) {
	var eventlist=[];	
	var	setEvent=function(fn){
			eventlist.push(fn);

		};
	var	mouseWheelEvent=function(e){
			for (var i=0;i<eventlist.length;i++){
				eventlist[i](e);
			}
		};
	window.onmousewheel = mouseWheelEvent;
	document.addEventListener("DOMMouseScroll", mouseWheelEvent);
	window.setWheelEvent=setEvent;
})(window);
