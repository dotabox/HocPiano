(function () {
	
	var timePerLine = 1300;
	var statisticList;
	var endTime;
	var pointPenalty;
	var Point=0;
	var pointEach=[];
    CAAT.Statistic = function () {
        CAAT.Statistic.superclass.constructor.call(this);
        return this;
    }
    CAAT.Statistic.prototype = {
    	passedLine : 0,
    	showStatistic : false,
    	init : function(director,drawText,pointEach){
    		var self=this;
    		this.global = director.globalVariables;
			this.director=director;
			if (this.width||this.width==0) this.setSize(824,582);
			if(this.x==0&&this.y==0)
			this.setBounds(CANVAS_WIDTH/2-this.width/2,CANVAS_HEIGHT/2-this.height/2,this.width,this.height);
			this.drawText=drawText;
			var closestyle=PianoicStyle.statisticActor.child.close;
			var close=new CAAT.Foundation.Actor();
			arr_offbutton=setPianoicStyle(director,close,closestyle);
			close.setBackgroundImage(arr_offbutton[0]);
			close.mouseEnter = function(){
				close.setBackgroundImage(arr_offbutton[1]);
			}
			close.mouseExit = function(){
				close.setBackgroundImage(arr_offbutton[0]);
			}
			close.mouseDown = function(){				
				self.show(false);	
			}
			this.addChild(close);
			return this;
    	},
    	setEndTime : function(et){
    		endTime=et;
    		return this;
    	},
    	show : function(on){
    		this.showStatistic=on;
    		this.director.showStatistic=on;
    		this.setVisible(on);
    		return this;
    	},
    	setStatisticList : function (stlist){
    		statisticList=stlist.concat();
    		return this;
    	},
    	setPointEach : function(P){
    		pointEach=P;
    		return this;
    	},
    	setPoint : function(P){
    		Point=P;
    		return this;
    	},
    	setPointPenalty : function(P){
    		pointPenalty=P;
    		return this;
    	},
    	paint : function(director,time){
			if(!this.showStatistic) {
				this.enableEvents(false);
				this.passedLine = 0;
				
				return;
			}
			this.enableEvents(true);
			// this.drawFbIcon = false;
			var childstyle=PianoicStyle.statisticActor.child;
			var ctx = director.ctx;

			if(!this.showStatistic)ctx.globalAlpha = 0.5;
			//Score
			ctx.fillStyle=childstyle.score.bgcolor;
			ctx.fillRect(childstyle.score.bound.x,childstyle.score.bound.y,childstyle.score.bound.width,childstyle.score.bound.height);
			ctx.fillStyle=childstyle.score.fontcolor;
			ctx.font=childstyle.score.font;
			var scoretext=LANG.statis.score[this.global.LANGUAGE];
			var marginLeft=childstyle.score.posX;
			ctx.fillText(scoretext,childstyle.score.posX,childstyle.score.posY);
			//Stat
			ctx.fillStyle=childstyle.stat.bgcolor;
			ctx.fillRect(childstyle.stat.bound.x,childstyle.stat.bound.y,childstyle.stat.bound.width,childstyle.stat.bound.height);
			ctx.font=childstyle.stat.font;
			ctx.fillStyle=childstyle.stat.perfect;
			ctx.fillText("PERFECT",childstyle.stat.posX,childstyle.stat.posY);
			ctx.fillStyle=childstyle.stat.great;
			ctx.fillText("GREAT",childstyle.stat.posX,childstyle.stat.posY+childstyle.stat.textHeight);
			ctx.fillStyle=childstyle.stat.cool;
			ctx.fillText("COOL",childstyle.stat.posX,childstyle.stat.posY+childstyle.stat.textHeight*2);
			ctx.fillStyle=childstyle.stat.notbad;
			ctx.fillText("NOT BAD",childstyle.stat.posX,childstyle.stat.posY+childstyle.stat.textHeight*3);
			ctx.fillStyle=childstyle.stat.miss;
			ctx.fillText("MISSED",childstyle.stat.posX,childstyle.stat.posY+childstyle.stat.textHeight*4);
			ctx.fillStyle=childstyle.stat.passed;
			ctx.fillText("PASSED",childstyle.stat.posX,childstyle.stat.posY+childstyle.stat.textHeight*5);


			
			//Multi
			ctx.fillStyle=childstyle.multi.bgcolor;
			ctx.fillRect(childstyle.multi.bound.x,childstyle.multi.bound.y,childstyle.multi.bound.width,childstyle.multi.bound.height);
			//Total
			ctx.fillStyle=childstyle.total.bgcolor;
			ctx.fillRect(childstyle.total.bound.x,childstyle.total.bound.y,childstyle.total.bound.width,childstyle.total.bound.height);	
			ctx.fillStyle="#fff";
			var maxLength = this.maxLength||3;
			var maxLengthPoint = this.maxLengthPoint||1;
			var elapsedTime = time - endTime;
			var currentLine = this.passedLine+(elapsedTime/timePerLine)<<0;
			this.currentLine = currentLine;
			for(var i=0;i<statisticList.length;i++) {
				if(i>currentLine) break;
				var number = statisticList[i];
				if(i== currentLine) number = number*(elapsedTime%timePerLine)/timePerLine<<0;
				var length = (number+"").length;
				// this.drawText(ctx,number,false,marginLeft+120+(maxLength-length)*9,120+40*i);
				ctx.fillText(number,childstyle.multi.bound.width+childstyle.multi.bound.width/2,childstyle.stat.posY+childstyle.stat.textHeight*i);
			}
			for(var i=0;i<statisticList.length;i++){
				//ctx.drawImage(multiplierImage,marginLeft+100,125+40*i);
				//ctx.drawImage(equalImage,marginLeft+130+maxLength*20,125+40*i);
				var point;
				if(i<4) point = pointEach[i];
				else if(i==4) point = (statisticList[i]*pointPenalty);
				else point = 0;
				if(currentLine<statisticList.length){
					if(i>currentLine) continue;					
					if(i==currentLine) point = point*(elapsedTime%timePerLine)/timePerLine<<0;
				}
				else{
					if(currentLine==statisticList.length) point =  point*(1-(elapsedTime%timePerLine)/timePerLine)<<0;
					else point = 0;
				}
				
				ctx.fillText(point,childstyle.multi.bound.width+childstyle.multi.bound.width+childstyle.total.bound.width/2,childstyle.stat.posY+childstyle.stat.textHeight*i);
				//this.drawText(ctx,point,true,340,120+40*i);
			}
			//ctx.drawImage(lineBreakImage,this.width/2-lineBreakImage.width/2,360);
			//ctx.drawImage(equalImage,marginLeft+130+maxLength*20,370);
			if(currentLine>=statisticList.length){
				var number = Point;
				if(currentLine==statisticList.length)number = number*(elapsedTime%timePerLine)/timePerLine<<0;
				else {
					//ctx.drawImage(facebookIcon,60,430);
					this.drawFbIcon = true;
				}
				//this.drawText(ctx,number,true,340,365);
				ctx.fillStyle=childstyle.score.fontcolor;
				ctx.fillText(number,childstyle.multi.bound.width+childstyle.multi.bound.width+childstyle.total.bound.width/2-ctx.measureText(number+"").width/2,childstyle.score.posY);
				
			}
			
			// ctx.drawImage(statBg,0,0);
			// var marginLeft = 50;
			// ctx.drawImage(statPerfect,marginLeft,120);
			// ctx.drawImage(statGreat,marginLeft+10,160);
			// ctx.drawImage(statCool,marginLeft+20,200);
			// ctx.drawImage(statNotbad,marginLeft-10,240);
			// ctx.drawImage(statMissed,marginLeft,280);
			// ctx.drawImage(statPassed,marginLeft,320);
			// ctx.drawImage(statTotal,marginLeft+10,370);
			// ctx.fillStyle = "#FFF";
			// ctx.font = "18px Times New Roman";
			// ctx.fillText("http://facebook.com/pianoic",this.width/3,445);
			// ctx.fillText("http://pianoic.com",this.width/3,465);
			// var maxLength = this.maxLength||3;
			// var maxLengthPoint = this.maxLengthPoint||1;
			// var elapsedTime = time - endTime;
			// var currentLine = this.passedLine+(elapsedTime/timePerLine)<<0;
			// this.currentLine = currentLine;
			// for(var i=0;i<statisticList.length;i++) {
			// 	if(i>currentLine) break;
			// 	var number = statisticList[i];
			// 	if(i== currentLine) number = number*(elapsedTime%timePerLine)/timePerLine<<0;
			// 	var length = (number+"").length;
			// 	this.drawText(ctx,number,false,marginLeft+120+(maxLength-length)*9,120+40*i);
			// }
			// for(var i=0;i<statisticList.length;i++){
			// 	ctx.drawImage(multiplierImage,marginLeft+100,125+40*i);
			// 	ctx.drawImage(equalImage,marginLeft+130+maxLength*20,125+40*i);
			// 	var point;
			// 	if(i<4) point = pointEach[i];
			// 	else if(i==4) point = (statisticList[i]*pointPenalty);
			// 	else point = 0;
			// 	if(currentLine<statisticList.length){
			// 		if(i>currentLine) continue;					
			// 		if(i==currentLine) point = point*(elapsedTime%timePerLine)/timePerLine<<0;
			// 	}
			// 	else{
			// 		if(currentLine==statisticList.length) point =  point*(1-(elapsedTime%timePerLine)/timePerLine)<<0;
			// 		else point = 0;
			// 	}
			// 	this.drawText(ctx,point,true,340,120+40*i);
			// }
			
			// ctx.drawImage(lineBreakImage,this.width/2-lineBreakImage.width/2,360);
			// ctx.drawImage(equalImage,marginLeft+130+maxLength*20,370);
			// if(currentLine>=statisticList.length){
			// 	var number = Point;
			// 	if(currentLine==statisticList.length)number = number*(elapsedTime%timePerLine)/timePerLine<<0;
			// 	else {
			// 		ctx.drawImage(facebookIcon,60,430);
			// 		this.drawFbIcon = true;
			// 	}
			// 	this.drawText(ctx,number,true,340,365);
				
			// }
			//ctx.drawImage(likeIcon,70+facebookIcon.width,430);
			return this;
		},
		mouseDown : function(e){
			this.passedLine++;
			if(this.currentLine<statisticList.length+1) return;
			
			return this;
		}
    }
    
    extend(CAAT.Statistic, CAAT.Foundation.ActorContainer);
})()



