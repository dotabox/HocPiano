window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 1000 / 60);
        };
})();


var BKGM = BKGM||{};

(function(){
    

    ((typeof(cordova) == 'undefined') && (typeof(phonegap) == 'undefined')) ? BKGM._isCordova=false : BKGM._isCordova=true;
    var lastTime=0;
    var t = 0;
    var sceneTime = 0;
    var frameTime=1000/60;
    var _statesLoop=[];
    var _count=[];
    
    var debug=document.createElement("div");
    var debugconsole=document.createElement("div");
    var debugfps=document.createElement("div");
    debugconsole.id='console';
    debug.style.position="absolute";
    debug.style.color="red";
    debug.id='debug';
    debug.appendChild(debugconsole);
    debug.appendChild(debugfps);
    var addLoop = function(_this){
        _statesLoop.push(_this);
    };
    var _loop = function(){
        var time=new Date();
        for (var i = _statesLoop.length - 1; i >= 0; i--) {
            var now =new Date();
            var dt =  now - lastTime;//Khoang thoi gian giua 2 lan cap nhat
            lastTime = now;
            t += dt ;//Thoi gian delay giua 2 lan cap nhat
            while (t >= frameTime) {//Chay chi khi thoi gian delay giua 2 lan lon hon 10ms
                t -= frameTime;//Dung de xac dinh so buoc' tinh toan
                sceneTime += frameTime;
                _statesLoop[i].update(_statesLoop[i], sceneTime);
                _statesLoop[i].time=sceneTime;
            }   
            _statesLoop[i].loop(_statesLoop[i]);
        };
        var _drawtime=(new Date()- time);
        var drawtime=0;
        _count.push(_drawtime);
        for (var i = _count.length - 1; i >= 0; i--) {
            drawtime+=_count[i];
        };
        
        if (_count.length>=100) {
            _count.unshift();

        }
        if(debugfps && BKGM.debug)debugfps.innerHTML="draw time: "+(drawtime/_count.length*100>>0)/100 +"</br> FPS: "+_statesLoop[0].FPS;  
        requestAnimFrame(function(){
            _loop();
        });
    };
    
    BKGM = function(obj){
        var _this=this;
        _this.gravity={x:0,y:0,z:0};
        BKGM.SINGLE_TOUCH=0;
        BKGM.MULTI_TOUCH=1;
        BKGM.TYPE_TOUCH=BKGM.SINGLE_TOUCH;
        if(BKGM.DeviceMotion)
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', function(eventData){
                        if(eventData.accelerationIncludingGravity)
                            _this.gravity = {x:eventData.accelerationIncludingGravity.y/3,y:eventData.accelerationIncludingGravity.x/3,z:eventData.accelerationIncludingGravity.z};

                    }, false);

        } else {
            if(navigator &&  navigator.accelerometer){
                 // The watch id references the current `watchAcceleration`
                var watchID = null;


                

                // Start watching the acceleration
                //
                function startWatch() {

                    // Update acceleration every 1000/60 seconds
                    var options = { frequency: 1000/60 };

                    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
                }

                // Stop watching the acceleration
                //
                function stopWatch() {
                    if (watchID) {
                        navigator.accelerometer.clearWatch(watchID);
                        watchID = null;
                    }
                }


                function onSuccess(acceleration) {
                    _this.gravity = {x:acceleration.x/3,y:acceleration.y/3,z:acceleration.z};
                };

                function onError() {
                    alert('onError!');
                };
                startWatch();
                // navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);*/
            } else
                console.log("Not supported on your device or browser.  Sorry.")
        }
        
        
        if(obj){
            this.setup=obj.setup||this.setup;
            this.update=obj.update||this.update;
            this.draw=obj.draw||this.draw;
        }
        this.resource={};
        this.childrentList=[];

        if (document.getElementById("game"))
            this.canvas = document.getElementById("game");
        else {
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute("id", "game");
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;
            document.body.appendChild(this.canvas);
        }       
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        // this.ctx.textAlign = "center";
        

        // this.ctx.imageSmoothingEnabled= true;
        // this.ctx.mozImageSmoothingEnabled= true;
        // this.ctx.webkitImageSmoothingEnabled= true;
        // this._circle = document.createElement('canvas');
        // this._circle.width=200;
        // this._circle.height=200;
        // var _ctx = this._circle.getContext('2d');
        // _ctx.arc(100,100,100,0,Math.PI*2);
        // _ctx.fillStyle='#fff';
        // _ctx.fill();
       
        this._fps = {
            startTime : 0,
            frameNumber : 0,
            getFPS : function(){
                this.frameNumber++;
                var d = new Date().getTime(),
                    currentTime = ( d - this.startTime ) / 1000,
                    result = Math.floor( ( this.frameNumber / currentTime ) );

                if( currentTime > 1 ){
                    this.startTime = new Date().getTime();
                    this.frameNumber = 0;
                }
                return result;

            }

        };
        //this.ctx.globalCompositeOperation = 'source-atop';
        addMouseTouchEvent(this);
        addKeyEvent(this);
        window.playMIDI=function(a,b,c){
            if (_this.playMIDI) _this.playMIDI(a,b,c);
        }
        return this;
    }
    BKGM.prototype = {
        time:0,
        SCALEX:1,
        SCALEY:1,
        font:"Times New Roman",
        loop:function(_this){
            if(BKGM.debug)          
            _this.FPS=_this._fps.getFPS();            
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this._staticDraw();
            _this.draw(_this);
            if(_this._alertBox) _this._alertBox.draw(_this);
            return _this;
        },
        run:function(){
            if(BKGM.debug && debug){
                document.body.appendChild(debug);
            }
            this.WIDTH = this.canvas.width;
            this.HEIGHT  = this.canvas.height;
            if(BKGM._isCordova){
                this.SCALEX = this.WIDTH/window.innerWidth;
                this.SCALEY = this.HEIGHT/window.innerHeight;
            }
            else{
                this.SCALEX = this.WIDTH/this.canvas.offsetWidth;
                this.SCALEY = this.HEIGHT/this.canvas.offsetHeight;                
            }
            this.SCALE = Math.min(this.WIDTH/1366,this.HEIGHT/768) ;
            this.setup();
            if(BKGM.Codea){
                this.ctx.translate(0, this.canvas.height);
                this.ctx.scale(1,-1);
            }            
            lastTime=new Date();
            if (!this.firstTime){
                addLoop(this);
                _loop();    
                this.firstTime=true;
            }
            
            return this;
        },
        setup:function(){
            return this;
        },
        update:function(){
            return this;
        },
        draw:function(){
            return this;
        },
        _staticDraw:function(){
            if (this._bg){       
                this.ctx.beginPath();
                this.ctx.rect(0, 0, this.canvas.width, this.canvas.height); 
                this.ctx.fillStyle = 'rgb('+this._bg.R+','+this._bg.G+','+this._bg.B+')';               
                this.ctx.fill();
            }
            return this;
        },
        background:function(R, G, B){
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height); 
            this.ctx.fillStyle = 'rgb('+R+','+G+','+B+')';               
            this.ctx.fill();
            return this;
        },
        fill:function(R, G, B, A){
            this.ctx.beginPath();
            this.ctx.fillStyle="rgba("+R+", "+G+", "+B+", " + A + ")";
            // this.ctx.fill();
            return this;
        },
        rect:function(x, y, width, height){
            if(this._rectMode==="CENTER"){
                this.ctx.rect(x-width/2, y-height/2, width, height);  
            } else 
            this.ctx.rect(x, y, width, height);
            this.ctx.fill();  
            return this;
        },
        rectMode:function(Input){
            this._rectMode=Input;
            return this;
        },
        setFont:function(font){
            this.font=font;
        },
        text:function( string, x, y, fontSize,center){
            this.ctx.save();
            if(BKGM.Codea){
                
                this.ctx.translate(0, this.canvas.height);
                this.ctx.scale(1,-1);            
                this.ctx.font = fontSize+'px '+this.font||'40px '+this.font;
                this.ctx.fillText(string, x, this.canvas.height-(y-fontSize/2));
                
            } else {
                if(center) this.ctx.textAlign = "center";
                this.ctx.font = fontSize+'px '+this.font||'40px '+this.font;
                this.ctx.fillText(string, x, (y+fontSize/2));
            }
            this.ctx.restore();
           
            return this;
        },
        circle:function( x, y, diameter){
            this.ctx.beginPath();
            // this.ctx.drawImage(this._circle,0,0,this._circle.width,this._circle.width,x - diameter,y - diameter,diameter*2,diameter*2);
            this.ctx.arc(x, y, diameter, 0, Math.PI*2,false);
            this.ctx.fill(); 
            return this;
        },
        line:function(x1, y1, x2, y2){
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineCap = this._linemode||'butt';
            if (this._strokeWidth) this.ctx.lineWidth = this._strokeWidth;
            if (this._strokeColor) this.ctx.strokeStyle = this._strokeColor;
            this.ctx.stroke();
            this.ctx.closePath();
            return this;
        },
        lineCapMode:function(lineMode){
            this._linemode=lineMode;
            return this;
        },
        stroke:function(color, width){
            this._strokeColor=color;
            this._strokeWidth=width;
            return this;
        },
        addRes:function(res){
            this.resource=res;
            return this;
        },
        addChild:function(child){
            this.childrentList.push(child);
            return this;
        },
        removeChild:function(child){
            this.childrentList.splice(this.childrentList.indexOf(child),1);
            return this;
        },
        addStates:function(states){
            this.states=states;
        },
        _swipe:function(e){
            var s=this._startWipe;
            var x_1=s.x,y_1=s.y;
            var x_2=e.x,y_2=e.y;
            var delta_x = x_2 - x_1,
            delta_y = y_2 - y_1;
            var threadsold=_THREADSOLD*this.SCALE;
            if ( (delta_x < threadsold && delta_x > -threadsold) || (delta_y < threadsold && delta_y > -threadsold) ) return false;

            var tan = Math.abs(delta_y / delta_x);
            
            switch( ( (delta_y > 0 ? 1 : 2) + (delta_x > 0 ? 0 : 2) ) * (tan > 1? 1 : -1) ){
                case  1: //position.TOP_RIGHT:
                case  3: //position.TOP_LEFT:
                    this.swipe('DOWN');
                break;
                case -1: //-position.TOP_RIGHT:
                case -2: //-position.BOTTOM_RIGHT:
                    this.swipe('RIGHT');
                break;
                case -3: //-position.TOP_LEFT:
                case -4: //-position.BOTTOM_LEFT:
                    this.swipe('LEFT');
                break;
                case  2: //position.BOTTOM_RIGHT:
                case  4: //position.BOTTOM_LEFT:
                    this.swipe('UP');
                break;
            }
        },
        _touchStart:function(e){
            if(this._alertBox) {
                this._alertBox.down(e);
            } else {
                if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._startWipe=e;
                if(this.touchStart) this.touchStart(e);    
            }            
        },
        _touchEnd:function(e){
            if(this._alertBox) {
                this._alertBox.up(e);
            } else {
                if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._swipe(e);
                if(this.touchEnd) this.touchEnd(e);
            }            
        },
        _touchDrag:function(e){
            if(this._alertBox) {
                this._alertBox.drag(e);
            } else {
                if(this.touchDrag) this.touchDrag(e);
            }            
        },
        _mouseDown:function(e){
            if(this._alertBox) {
                this._alertBox.down(e);
            } else {
                if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._startWipe=e;
                if(this.mouseDown) this.mouseDown(e);
            }            
        },
        _mouseUp:function(e){
            if(this._alertBox) {
                this._alertBox.up(e);
            } else  {
                if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._swipe(e);
                if(this.mouseUp) this.mouseUp(e);   
            }
            
        },
        _mouseDrag:function(e){
            if(this._alertBox) {
                this._alertBox.drag(e);
            } else {
                if(this.mouseDrag) this.mouseDrag(e);
            }            
        },
        _mouseMove:function(e){
            if(this.mouseMove) this.mouseMove(e);
        },
        alert:function(obj){
            var self=this;
            var text=obj.text;
            var width = obj.width || 430;
            var height = obj.height || 257;
            var x=obj.x||window.innerWidth/2-width/2;
            var y=obj.y||window.innerHeight/2-height/2;
            
            var oktext=obj.oktext;
            var yestext=obj.yestext;
            var ok = obj.ok;
            var notext=obj.notext;
            var fadeIn=obj.fadeIn;
            var fadeOut=obj.fadeOut;
            var box=new BKGM.BoxUI({
                text:text,
                type:"alert",
                x:x,
                y:y,
                oktext:oktext,
                yestext:yestext,
                notext:notext,
                width:width,
                height:height,
                ok:function(){
                    ok();
                    // self._alertBox=null;
                    if(fadeOut) box.fadeOut(function(){self._alertBox=null;});
                    else self._alertBox=null;
                },
                close:function(){
                    ok();
                    if(fadeOut) box.fadeOut(function(){self._alertBox=null;});
                    else self._alertBox=null;
                }
            });
            // if(fadeIn) box.fadeIn();
            box.swipein('top')
            this._alertBox=box;
        },
        promt:function(obj){
            var self=this;
            var text=obj.text;
            var title=obj.title;
            var width = obj.width || 300;
            var height = obj.height || 200;
            var x=obj.x||window.innerWidth/2-width/2;
            var y=obj.y||window.innerHeight/2-height/2;
            var oktext=obj.oktext;
            var yestext=obj.yestext;
            var notext=obj.notext;
            var fadeIn=obj.fadeIn;
            var fadeOut=obj.fadeOut;
            var box=new BKGM.BoxUI({
                text:text,
                title:title,
                type:"yesno",
                x:x,
                y:y,
                oktext:oktext,
                yestext:yestext,
                notext:notext,
                width:width,
                height:height,
                yes: function(){
                    obj.yes();                    
                    if(fadeOut) box.fadeOut(function(){self._alertBox=null;});
                },
                no:function(){
                    obj.no();
                   if(fadeOut) box.fadeOut(function(){self._alertBox=null;});
                },
                close:function(){
                    if(fadeOut) box.fadeOut(function(){self._alertBox=null;});
                }
            });
            // if(fadeIn) box.fadeIn();
            box.swipein('top')
            this._alertBox=box;
        }

        
    }
    var _THREADSOLD = 2; //pixels
    var checkMousePos=function(e,_this){
        var x;
        var y;
        if (e.pageX || e.pageY) { 
          x = e.pageX;
          y = e.pageY;
        }
        else { 
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        x -= _this.canvas.offsetLeft;
        y -= _this.canvas.offsetTop;
        x*=_this.SCALEX;
        y*=_this.SCALEY;
        return {x:x,y:y,number:e.identifier}
    }
    
    var addMouseTouchEvent= function(_this){
        
        _this.currentTouch={ state:"ENDED" };
        window.addEventListener('touchstart', function(event) {
            this._istouch=true;
            var touchs=[];
            if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH)
                if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
                event.targetTouches > 1) {
                  return; // Ignore if touching with more than 1 finger
                }
            
            for (var i = 0; i < event.touches.length; i++) {
                
                if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH) {
                    var touch = event.touches[0];
                    var e=checkMousePos(touch,_this);
                    _this.currentTouch.state="START";
                    if(_this.states && _this.states._touchStart) _this.states._touchStart(e); else
                    if(_this._touchStart) _this._touchStart(e);
                    break;
                }
                var touch = event.touches[i];
                var e=checkMousePos(touch,_this);
                touchs.push(e);
            }
        
            if(BKGM.TYPE_TOUCH===BKGM.MULTI_TOUCH){
                if(_this.states && _this.states._touchStart) _this.states._touchStart(touchs); else
                if(_this._touchStart) _this._touchStart(touchs);  
            }
            // for (var j = _this.childrentList.length - 1; j >= 0; j--) {
            //     if(_this.childrentList[j]._eventenable &&checkEventActor( e,_this.childrentList[j])) {
            //         if(_this.childrentList[j].touchStart) _this.childrentList[j].touchStart(e)
            //         return;
            //     }
            // };
            // console.log(touch)
                 

            
            
            
           
        }, false);
        window.addEventListener('touchmove', function(event) {
            var touchs=[];
            event.preventDefault();
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                if(BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH && touch.identifier==0) {                   
                    _this.currentTouch.state="MOVING";
                    if(_this._touchDrag) _this._touchDrag(checkMousePos(touch,_this));
                    break;
                }
                var touch = event.changedTouches[i];
                var e=checkMousePos(touch,_this);
                touchs.push(e);
                
            }
            if(BKGM.TYPE_TOUCH==BKGM.MULTI_TOUCH){
                if(_this._touchDrag) _this._touchDrag(touchs);  
            }
            
        }, false);
        window.addEventListener('touchend', function(event) {
            var touchs=[];
            if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH)
                if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
                event.targetTouches > 0) {
              return; // Ignore if still touching with one or more fingers
            }
           
            for (var i = 0; i < event.changedTouches.length; i++) {
               
                if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH) {
                    // this._istouch=false;            
                    // console.log(touch)  
                     var touch = event.changedTouches[0]; 
                    _this.currentTouch.state="ENDED";
                    var e=checkMousePos(touch,_this);
                    if(_this.states && _this.states.touchEnd) _this.states._touchEnd(e); else
                    if(_this._touchEnd) _this._touchEnd(e); 
                    break;
                }
                var touch = event.changedTouches[i]; 
                // console.log(touch)  
                var e=checkMousePos(touch,_this);
                touchs.push(e)
                
                             
            }
            if(BKGM.TYPE_TOUCH===BKGM.MULTI_TOUCH){
                if(_this.states && _this.states.touchEnd) _this.states._touchEnd(touchs); else
                if(_this._touchEnd) _this._touchEnd(touchs);
            }
            
            
            
        }, false);
        window.addEventListener('mousedown', function(event) {
            if (_this._istouch) return;
            var e=checkMousePos(event,_this);
            _this._ismouseDown=true;
            _this.currentTouch.state="START";
            // for (var i = _this.childrentList.length - 1; i >= 0; i--) {
            //     if(_this.childrentList[i]._eventenable &&checkEventActor( e,_this.childrentList[i])) {
            //         _this.childrentList[i].mouseDown(e)
            //         return;
            //     }
            // };
            if(_this.states && _this.states._mouseDown) _this.states._mouseDown(e); else
                    if(_this._mouseDown) _this._mouseDown(e);
        }, false);
        window.addEventListener('mousemove', function(event) {
            if (this._istouch) return;
            var e=checkMousePos(event,_this);
            if(_this._ismouseDown) _this.currentTouch.state="MOVING";
            if(_this._ismouseDown){
                if(_this.states && _this.states._mouseDrag) _this.states._mouseDrag(e); else
                    if(_this._mouseDrag) _this._mouseDrag(e);
            }
            if(_this.states && _this.states._mouseMove) _this.states._mouseMove(e); else
            if(_this._mouseMove) _this._mouseMove(e);
            
        }, false);
        window.addEventListener('mouseup', function(event) {
            if (_this._istouch) return;
            var e=checkMousePos(event,_this);
            _this._ismouseDown=false;
            _this.currentTouch.state="ENDED";
            // for (var i = _this.childrentList.length - 1; i >= 0; i--) {
            //     if(_this.childrentList[i]._eventenable &&checkEventActor( e,_this.childrentList[i])) {
            //         _this.childrentList[i].mouseUp(e)
            //         return;
            //     }
            // };
            if(_this.states && _this.states._mouseUp) _this.states._mouseUp(e); else
                    if(_this._mouseUp) _this._mouseUp(e);
        }, false);
    }
    var addKeyEvent=function(_this){
        BKGM.KEYS = {

            /** @const */ ENTER:13,
            /** @const */ BACKSPACE:8,
            /** @const */ TAB:9,
            /** @const */ SHIFT:16,
            /** @const */ CTRL:17,
            /** @const */ ALT:18,
            /** @const */ PAUSE:19,
            /** @const */ CAPSLOCK:20,
            /** @const */ ESCAPE:27,
            /** @const */ PAGEUP:33,
            /** @const */ PAGEDOWN:34,
            /** @const */ END:35,
            /** @const */ HOME:36,
            /** @const */ LEFT:37,
            /** @const */ UP:38,
            /** @const */ RIGHT:39,
            /** @const */ DOWN:40,
            /** @const */ INSERT:45,
            /** @const */ DELETE:46,
            /** @const */ 0:48,
            /** @const */ 1:49,
            /** @const */ 2:50,
            /** @const */ 3:51,
            /** @const */ 4:52,
            /** @const */ 5:53,
            /** @const */ 6:54,
            /** @const */ 7:55,
            /** @const */ 8:56,
            /** @const */ 9:57,
            /** @const */ a:65,
            /** @const */ b:66,
            /** @const */ c:67,
            /** @const */ d:68,
            /** @const */ e:69,
            /** @const */ f:70,
            /** @const */ g:71,
            /** @const */ h:72,
            /** @const */ i:73,
            /** @const */ j:74,
            /** @const */ k:75,
            /** @const */ l:76,
            /** @const */ m:77,
            /** @const */ n:78,
            /** @const */ o:79,
            /** @const */ p:80,
            /** @const */ q:81,
            /** @const */ r:82,
            /** @const */ s:83,
            /** @const */ t:84,
            /** @const */ u:85,
            /** @const */ v:86,
            /** @const */ w:87,
            /** @const */ x:88,
            /** @const */ y:89,
            /** @const */ z:90,
            /** @const */ SELECT:93,
            /** @const */ NUMPAD0:96,
            /** @const */ NUMPAD1:97,
            /** @const */ NUMPAD2:98,
            /** @const */ NUMPAD3:99,
            /** @const */ NUMPAD4:100,
            /** @const */ NUMPAD5:101,
            /** @const */ NUMPAD6:102,
            /** @const */ NUMPAD7:103,
            /** @const */ NUMPAD8:104,
            /** @const */ NUMPAD9:105,
            /** @const */ MULTIPLY:106,
            /** @const */ ADD:107,
            /** @const */ SUBTRACT:109,
            /** @const */ DECIMALPOINT:110,
            /** @const */ DIVIDE:111,
            /** @const */ F1:112,
            /** @const */ F2:113,
            /** @const */ F3:114,
            /** @const */ F4:115,
            /** @const */ F5:116,
            /** @const */ F6:117,
            /** @const */ F7:118,
            /** @const */ F8:119,
            /** @const */ F9:120,
            /** @const */ F10:121,
            /** @const */ F11:122,
            /** @const */ F12:123,
            /** @const */ NUMLOCK:144,
            /** @const */ SCROLLLOCK:145,
            /** @const */ SEMICOLON:186,
            /** @const */ EQUALSIGN:187,
            /** @const */ COMMA:188,
            /** @const */ DASH:189,
            /** @const */ PERIOD:190,
            /** @const */ FORWARDSLASH:191,
            /** @const */ GRAVEACCENT:192,
            /** @const */ OPENBRACKET:219,
            /** @const */ BACKSLASH:220,
            /** @const */ CLOSEBRAKET:221,
            /** @const */ SINGLEQUOTE:222
        };

        /**
         * @deprecated
         * @type {Object}
         */
        BKGM.Keys= BKGM.KEYS;

        /**
         * Shift key code
         * @type {Number}
         */
        BKGM.SHIFT_KEY=    16;

        /**
         * Control key code
         * @type {Number}
         */
        BKGM.CONTROL_KEY=  17;

        /**
         * Alt key code
         * @type {Number}
         */
        BKGM.ALT_KEY=      18;

        /**
         * Enter key code
         * @type {Number}
         */
        BKGM.ENTER_KEY=    13;

        /**
         * Event modifiers.
         * @type enum
         */
        BKGM.KEY_MODIFIERS= {

            /** @const */ alt:        false,
            /** @const */ control:    false,
            /** @const */ shift:      false
        };
        window.addEventListener('keydown', function(event) {
            _this._keyDown=true;
            if(_this.keyDown) _this.keyDown(event);
        },false)
    }
})();
(function(){
    // var BKGM = BKGM||{};
    // var s1 = new BKGM.Audio().setAudio('1');
    function getPhoneGapPath() {

        var path = window.location.pathname;
        path = path.substr( path, path.length - 10 );
        return path;

    };
    BKGM.Audio = function(){
        return this;
    }
    BKGM.Audio.prototype= {

        audio   : null,

        setAudio : function( name ,callback) {
            var self=this;
            if(BKGM._isCordova){
                this.src = getPhoneGapPath() + "/" + name;
                if (callback && !self.call) {callback();self.call=1;}
               
            }else {
                this.audio= new Audio(name);
                this.audio.preload = 'auto';
              

                this.audio.load();
                
                this.audio.addEventListener('ended', function() { 
                        // this.currentTime=0;
                        if(self.ended) self.ended();
                    }, false);
                this.audio.addEventListener('canplaythrough', function() { 
                   self._onload();
                   if (callback && !self.call) {callback();self.call=1;}
                }, false);
            }
            return this;
        },

        loop : function( loop ) {
            this._loop=loop;
            return this;
        },
        forceplay:function(){
           
            if(BKGM._isCordova){
                var src=this.src;
                // var src='http://static.weareswoop.com/audio/charlestown/track_1.mp3';

                // Create Media object from src
                if(!this.audio)this.audio = new Media(src, function(){
                   self._onload();
                   
                 }, function(error){});
                // Play audio
                this.stop();
                this.audio.play();

                
            } else {
                 this.stop();
                 this.play();
            }
            
            return this;
        },
        play : function() {
            this.audio.play();
            return this;
        },

        pause : function() {
            //this.audio.pause();
            if (this.audio) {
                this.audio.pause();
            }
            return this;
        },
        stop : function(){
            if(BKGM._isCordova && this.audio) {
                this.audio.stop();
            } else {                
                this.audio.currentTime=0;
                this.audio.pause();
            }            
            return this;
        },
        ended:function(){
            return this;
        },
        _onload:function(){
            return this;
        }

    };
})();
(function(){
    BKGM.loadJS=function(url,callback){
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    };
    window.extend = function (subc, superc) {
        var subcp = subc.prototype;

        // Class pattern.
        var BKGMObj = function () {
        };
        BKGMObj.prototype = superc.prototype;

        subc.prototype = new BKGMObj();       // chain prototypes.
        subc.superclass = superc.prototype;
        subc.prototype.constructor = subc;

        // Reset constructor. See Object Oriented Javascript for an in-depth explanation of this.
        if (superc.prototype.constructor === Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }

        // los metodos de superc, que no esten en esta clase, crear un metodo que
        // llama al metodo de superc.
        for (var method in subcp) {
            if (subcp.hasOwnProperty(method)) {
                subc.prototype[method] = subcp[method];             

            }
        }
    };
    BKGM.checkMouseBox=function(e,obj){
        if(obj.w)
        return (e.x>obj.x&&e.y>obj.y&&e.x<(obj.x+obj.w)&&e.y<(obj.y+obj.h));
        else
        return (e.x>obj.x&&e.y>obj.y&&e.x<(obj.x+obj.width)&&e.y<(obj.y+obj.height));
    };
    BKGM.checkEventActor=function(e,_actor){
        var originX=_actor.x,originY=_actor.y;
        var mouseX=e.x,mouseY=e.y;
        var dx = mouseX - originX, dy = mouseY - originY;
        // distance between the point and the center of the rectangle
        var h1 = Math.sqrt(dx*dx + dy*dy);
        var currA = Math.atan2(dy,dx);
        // Angle of point rotated around origin of rectangle in opposition
        var newA = currA - _actor.rotation;
        // New position of mouse point when rotated
        var x2 = Math.cos(newA) * h1;
        var y2 = Math.sin(newA) * h1;
        // Check relative to center of rectangle
        if (x2 > -0.5 * _actor.width && x2 < 0.5 * _actor.width && y2 > -0.5 * _actor.height && y2 < 0.5 * _actor.height){
            return true;
        }
    };
    BKGM.ajax = function(obj){
        var ajax = {
            url:obj.url ? obj.url :"", //url
            type:obj.type ? obj.type : "POST",// POST or GET
            data:obj.data ? obj.data : null,
            // processData:obj.processData ? obj.processData : false,
            // contentType:obj.contentType ? obj.contentType :false,
            // cache: obj.cache ? obj.cache : true,
            responseType :obj.responseType ? obj.responseType  :null,
            success: obj.success ? obj.success : null,
            error: obj.error ? obj.error : null,
            complete: obj.complete ? obj.complete : null,
            j: obj.j ? obj.j : 0
        }
        
        var xhr = new XMLHttpRequest();
        // xhr.upload.addEventListener('progress',function(ev){
        //     console.log((ev.loaded/ev.total)+'%');
        // }, false);
        xhr.responseType=ajax.responseType;
        xhr.onreadystatechange = function(ev){
            if (ajax.responseType!='blob'){
                if (xhr.status==200) {
                    if(ajax.success) ajax.success(xhr.responseText);
                    if (xhr.readyState==4)
                        if (ajax.complete) ajax.complete(xhr.responseText,ajax.j)            
                } else {
                    if (ajax.error) ajax.error(xhr.responseText);
                }  
            } else {
                if (xhr.status==200) {
                    if(ajax.success) ajax.success(xhr.response);
                    if (xhr.readyState==4)
                        if (ajax.complete) ajax.complete(xhr.response,ajax.j)            
                } else {
                    if (ajax.error) ajax.error(xhr.response);
                } 
            }
                      
        };
        xhr.open(ajax.type, ajax.url, true);
        xhr.send(ajax.data);
    }
    BKGM.textureAtlas = function(link,callback){
        var filetype=(link.substr(link.lastIndexOf('.')+1)).toLowerCase();
        BKGM.ajax({
            url:link,
            type:"GET",
            complete:function(resText,resXML){
                // var res=JSON.parse(res);
                var images={};
                var aimages=[];
                var image=new Image();
                image.src=link.substr(0,link.lastIndexOf('.'))+".png";
                image.onload=function(){
                    var x;
                    if(filetype=="xml"){
                        x = resXML.getElementsByTagName("SubTexture");
                    }                        
                    else if (filetype=="json"){
                        var _x=JSON.parse(resText);
                        x=_x.frames;
                    }
                    // if (x == null ) return;
                    for (var n in x)
                    {
                        var atlasImage = new BKGM.AtlasImage(filetype);
                        atlasImage.load(image,x[n],n);
                        images[atlasImage.name]=atlasImage;
                        aimages.push(atlasImage);
                      // atlasMap[x[n].getAttribute("name")] = atlasImage;
                    }
                    if(callback) callback(images,aimages)
                }
                
            }
        })
    }
    BKGM.AtlasImage = function(filetype){
        this.img=document.createElement('canvas');
        var ctx=this.img.getContext('2d');
        this.m_x;
        this.m_y;
        this.m_width;
        this.m_height;
        this.m_xOffset;
        this.m_yOffset;
        this.load = function(img,elem,name)
        {
            if(filetype=="xml"){
                this.m_x = parseInt(elem.getAttribute("x")); 
                this.m_y = parseInt(elem.getAttribute("y")); 
                this.name=elem.getAttribute("name")
                this.m_width = parseInt(elem.getAttribute("width"));
                this.m_height = parseInt(elem.getAttribute("height"));
                // offset is an optional parameter
                if (elem.getAttribute("pivotX"))
                    this.m_xOffset = parseInt(elem.getAttribute("pivotX"));
                else
                  this.m_xOffset = 0;
                if (elem.getAttribute("pivotY"))
                    this.m_yOffset = parseInt(elem.getAttribute("pivotY"));
                else
                    this.m_yOffset = 0;
            } else
            if(filetype=="json"){
                this.m_x = elem.frame.x; 
                this.m_y = elem.frame.y; 
                this.name=name;
                this.m_width = elem.frame.w;
                this.m_height = elem.frame.h;
                // offset is an optional parameter
                this.m_xOffset=elem.spriteSourceSize.x;
                this.m_yOffset=elem.spriteSourceSize.y;
                // if (elem.getAttribute("pivotX"))
                //     this.m_xOffset = parseInt(elem.getAttribute("pivotX"));
                // else
                //   this.m_xOffset = 0;
                // if (elem.getAttribute("pivotY"))
                //     this.m_yOffset = parseInt(elem.getAttribute("pivotY"));
                // else
                //     this.m_yOffset = 0;
            }
            this.img.width=this.m_width;
            this.img.height=this.m_height;
            ctx.drawImage(img,this.m_x, this.m_y,this.m_width, this.m_height, this.m_xOffset, this.m_yOffset, this.m_width, this.m_height);

        }      
    };
      /*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

window.Base64Binary = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);
        
        return ab;
    },
    
    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));      
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));      
    
        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip
        
        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;
        
        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);
        
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
        for (i=0; i<bytes; i+=3) {  
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));
    
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
    
            uarray[i] = chr1;           
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }
    
        return uarray;  
    }
}

})();
(function(){
    BKGM.preload=function(){
        this.audios={};
        this.images={};
        this._maxElementLoad=0;
        this._elementLoaded=0;
    };
    BKGM.preload.prototype.load=function(type,name,url,callback){
            var self=this;
            this._maxElementLoad++;
            if (type==="image"){
                var image=new Image();
                image.src=url;
                self.images[name]=image;
                image.onload=function(){
                        self._onload();
                        if (callback) callback();
                }
            } else
            if(type==="audio"){
                
                var audio=new BKGM.Audio();
                audio.setAudio(url,function(){self._onload()});
                self.audios[name]=audio;
                if (callback) callback();
            }
            return this;
        }
    BKGM.preload.prototype._onload=function(){

        this._elementLoaded++;
        if(this._maxElementLoad<=this._elementLoaded)
            this.onloadAll();
        return this;
    }
    BKGM.preload.prototype.onloadAll=function(){
        return this;
    }
})();
(function(){
    BKGM.ScoreLocal=function(name){
        this.name=name;
    }
    BKGM.ScoreLocal.prototype={
        submitScore:function(score){
            var topScore=localStorage.getItem("BKGM."+name+".score");
            if((topScore && score>topScore)||!topScore)
                localStorage.setItem("BKGM."+name+".score",score);

        },
        getScore:function(){
            var score=localStorage.getItem("BKGM."+name+".score");
            if(!score) score=0;
            return score;
        }
       

    }
     
        
       
})();
(function(){
    BKGM.Ads=function(adunit){
        this.adunit=adunit;
        mopub_ad_unit = adunit;
        mopub_ad_width = this.width; // optional
        mopub_ad_height = this.height; // optional
    }
    BKGM.Ads.prototype={
        width:320,
        height:50,
        init:function(adunit){
           
            return this;
        },
        setSize:function(w,h){
            this.width=w;
            this.height=h;
            mopub_ad_width = this.width; // optional
            mopub_ad_height = this.height; // optional
            return this;
        },
        setKeyword:function(arr){
            this.key=arr;
            mopub_keywords = arr; // optional
            return this;
        }

    }
     
        
       
})();
(function(){
    BKGM.Effect=function(effect,callback){
        var _effect={};
        switch(effect){
            case 'fadeIn':
                _effect.alpha=0;
                var self=this;
                _effect.draw=function(ctx,_this){
                    ctx.globalAlpha=_effect.alpha;
                    _effect.alpha+=0.05;
                    if(_effect.alpha>=1){
                        ctx.globalAlpha=1;
                        if(callback) callback();
                        _effect=null;
                    }                            
                }
                break;
            case 'fadeOut':
                _effect.alpha=1;
                var self=this;
                _effect.draw=function(ctx,_this){
                    ctx.globalAlpha=_effect.alpha;
                    _effect.alpha-=0.05;
                    if(_effect.alpha<0.1){
                        ctx.globalAlpha=0;
                        if(callback) callback();
                        _effect=null;
                    }                            
                }
                break;
            case 'swipeintop':
                var startY;
                var direct =1;
                var self=this;
                _effect.draw=function(ctx,_this){
                    if(typeof startY=="undefined") {
                        startY=_this.y;
                        _this.y=-_this.height;
                    } else {
                        // _this.y+=_this.height*0.05*direct;
                        _this.move(0,_this.height*0.1*direct)
                        if(_this.y>startY+50&&direct>0) {
                            direct=-0.5;
                        } else 
                        if(direct<0 && _this.y<startY){
                            if(callback) callback();
                            _effect=null;
                        }
                    }                         
                }
                break;
            case 'swipeindown':
                _effect.alpha=1;
                var self=this;
                _effect.draw=function(ctx,_this){
                    ctx.globalAlpha=_effect.alpha;
                    _effect.alpha-=0.05;
                    if(_effect.alpha<0.1){
                        ctx.globalAlpha=0;
                        if(callback) callback();
                        _effect=null;
                    }                            
                }
                break;
        }
        // this.effect=_effect;
        this.draw=function(ctx,_this){
            if(_effect)_effect.draw(ctx,_this);
        }
    }     
        
       
})();
(function(){
    var body=new Image();
    body.src='data:image/png;base64,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';
    var greenButton=new Image();
    greenButton.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAiCAYAAADf2c6uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFxSURBVHja7Jo9SsRQFIXPS2JQRlQQsXOm0OmzCSs34DLEVrAYsXMJgltwI7aCjSiCFoKDP4V5P9ciDBIzsTAvt/F8EEj9cTj3vpcYEQHpn4QKdMhmL7un2d54uHW0ujzYFhFPNX/HGJOW1k1v7u4vLg8/Tmqid0YbZ0Vhx04ewDLpzkKar6+sbU4A1EVnS8/DV+tgS0qK0skpgMWs2dEuOM8ox8V61+xoEcALECg7DqFy2hSNSjJFR0LaRMv3QyJ4/k10CEx0zEQHVoeS6HkHFrA6olcH2hJN0RodXW0ktbiTzhteyzBkR+sMQx5YlPZoJlol0YbDUO3AwkT3v0dTtFZH82So1NFMtI7owETrDENIs1dITx3tA0VHFc2to38M76P1RPNTFu86/kF1wCD58VGAdA21mSPafuJaDIokp6A4kQbKF+Maoh+v0oPprRznA4wA8CfHbqTe4e39yZxjf1YlnH4q8P9oJb4AAAD//wMAcTQAfdCIH24AAAAASUVORK5CYII=';
    var greenButtonPressed=new Image();
    greenButtonPressed.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAiCAYAAADf2c6uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIZSURBVHja7JrNahRBFIW/W1Wd+WknGUfwJwiGIApKdu58BR8pCxc+iA8T8AkUFATJQiRmIOKYydDpvi56OtNxxh+6psfNPVDQ0LX6OJx7qrpFVTG1L2cINqNQPYz23Yt+t3MYvH+okBua5hLwherZ9GL2+vRj/gpAqui4/7TzfntbHrlQ4AO4ACIGrXFUiGN6Hnh39GMIZFeOdiF74DpKJ4XeAJIuOG+wG7taIJ1lcMQ+8O0KtHjNewO4uQvDe5DugE8MdAzoyaQAeAYcLxztke4Ahrtwew9ujMAHA9Y4Ohz0vwPwhDpKF2CrD/0dSEeQ3io3Y45umNFQlHTvAKfuV7u7ahAa5OjqMecXgHAtHLS2CjXOUdKS4VKPrkPOCwO9FtCrDiwVZa0Rt8N5BOeK4xLoiq8ulikOtP4RNKXlC2MVrZXRUbm5mA/CwhzdzjBcBdsUB/r30aELNxvolusdKjYM1zoMdbneVbGh5ugWe3Q9ow10exmtltH/oXUY6JaHofXoDZwM9Xq2WOtouUerLm8yNQSNHVhal/zLfbSBXg/ov0ZHNRhNbWS0Wr3bSHQg5X949QgxRZpaVoDOL/mgcCAJuATcFvbRMMrSMBuLLl0qnZ/I4TjhJcje2SdJQg9voBsyFiSbcnn8Rr8somSe2CIyAh4Dz4ED4C7gDVvsSOQEeFtvHRkwmb/4TPnrbmIBEqUC+AqMfw4AKOUbNXkSLEcAAAAASUVORK5CYII=';
    var closeButton=new Image();
    closeButton.src='data:image/png;base64,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';
    var closeButtonPressed=new Image();
    closeButtonPressed.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABCOSURBVHja3Jp5sGRVecB/Z7lb3377MjMMwwwzzLAMEhEVhiUaFkNSpUY0pWY1BI1DBGPKLQEt/6BS0cSUGhN3sUyUqAiiSSEGF4IMTIBS2QeY4c3GzFv7venX673nfPmj73u8efPeLMTkD29V9+3uun3u9zvf+dZzlYjwq3BofkUOO/dBKfWiBrjk3SniQRnQFhAMcKo4ThEY1po+EZTPmRYv4y5n38hP288dfDzPAQ8IwMXXpeJdZ0zxi6bZA8uId/9nah3555bW/xJko3heK8jl3sm5XvxKEY8XjxRSKaXQyqCURqPHlFKPuoyfNKb8nY/e3nwKyAE3B7flnan8v4FceG36BpB3OCdXOmmT49AGQh0S6oRAJxjCjiwqI5cGbWnQci28AysGo0IkV/e2ZuVrP/+3xm1AC2jPgW25NpX/M5ALr01fJyI3eedfkqkmGOixg/QHa+nRqymbQWLTRagTrI5QWqO0I6dFpmrM+gkq+R4msl1UWgfxGVgfI7neWT3o/+HxO5rfBWpAE8gAt2VrKr80kC1b0xLwRfHy1ow6ysJQuIHVwTkM2g2kugdjDMZYlLFoqzBWY7TGmACrA6zWaEBEqPopDmZP8FxjO/vrj5M3wboSzRn1wye+1/ir2oQ/CMwCjQLILwY6YZAtW9NzEe7wkq/JTYuBaA3rwgsYNmcQ6whvBAlywjAgDC1hGBEGFhuGBNZgrUVphdIa8IiA8RGBL1HPquxuPsQTs3eyZ+YpVDPG183kyPbsg3u3t7cBFaBaLLt8IcwJgWzZml6C8F+5tFBBzqnJFjYEv0GkEjJTR4dCHMXESUSSJMRJ53MUhYRRiLUWazVaadAKRBARnDjyPENyTZQNUG1N8XD1Fh6e+A6taVB5ws4ftW4c2da+GxgFpoF6AeNPCGTL1vRVCD/JpEkQGjYmr2at3YLTTQgz4iimVIoplVPSNKGUlkjSmCiKCMOAIDBoazFGoVAoBUIHRPA458nznHbWQmcxpt3Fz6rf5t6xL3NoooFqpOz4fvPvRra17wT2AZOF/WRbtqb+uEC2bC2dhfB4Li3CKOT0+ApW2XPITBUbQZqmpOUS5e4yXd0paTkhKcVEcUQQGGxg0MagjUIphUIK9yOI+I6fFcE7h3OeLGvhMkWSDfPk7N3cPfopJkdnoFbioZsbN40+mf0U2AOMFbaTFc55eZALt6ZWhINOsgEbKjYll7HKnk3bzBCXQtJySndPSldvF909ZUrlhKTU0YINDKYAQCmUEpgfX4p3mV9igiBecN6R5zkuc5TyVeyo/Yj/PPAJKqNNssmweecNh250GU8AI8VSm4MRu5xdCHzDixtQgWdtvIUhu4mmnexAdEd098X09KV09ySk5ZAw0YSRYI2AzvEqR5SaExnmc7rO2YtD8GhlO1cYQbSgjGACR93tZVN4Ee2wwj3hl5kNfHzJu8vX/eTvZz9ZaGEueNaA3C5jF5eK91eJyVgdb2aFOZOWmSYuWUrdIeWBmO7+hO6+iFI5xMQObzIyY0BHKL0AoHhHBFGdheUkx0kGCEo0VoeI+M4/FIgWvPLU1D7OtJdSN2Nsl9s56WXh2rUXhJftfqCdFUFzLnD6pTUi8hWvcrqjYVbazXjbwsSOpCum3B/S1R9S7rfEXRqiGs54NvdfSTUb5bnZ7ZRU3/zsHw4DXnLqrsJZPa8hMT38rHI7VkICHePxxaUdIG8caMeZ3ZcyftIOdsqTvOLq0mW7H2jvLDRRn3PJeglt/KYXv0ZbxVCwHqMDfFQnLltKvQFpf0BaQEhUp6EmObX7laxMNrKx+yJ6o1VMZSNk0iCTJrk0yKRBLk1avspUvpuTSmexNj2P4fg0Tuu6mEPuIHVfwUmLnAYZTTIaONWmxgTaGDb1XkxXf0jXyT4+9ZLwfGADcDLQByRLpPFygyhPVzBEagbxYZ2oZEh6LKU+S6nXEJY1WVilxhin976a9V3nz+XQvKz/jQzF65nJ96PQKGXQypBLk0q+l1PS8/i13tfP321DeQube65gJt/PrJ/opDHSIJM6mdRxqkVVnmcgOIVT+s4mKDvO+d14M7AWOAUYBsp6kTbWiPeXaKPotisxxkLUJiwrkl5N0qMJuiCPquSmytl9V7Kp69cPrwtUxAUDf0RPvIJfNL/FgfznHMgfYaS9ndO6Lua83jcdMXWbypdybu8baPppmr5aLMm5ZQlOtWj5BoOlNZS6Y1aeo8s9q816YA2wCui1i1zVWwQhsWVKtgsJWgSJIepWRF1gU4cPa2htuHjgGlYkm5Y0MYXmooFr2JNv577q5wlUwBV9f825PVctmz1sKl9Kaga4a+pvUXRSfifZvIZaVFFK0VdaQdZ4no2XResf+mp9bwFyYJGxy2vQkNgutLEQtgjThLAs2NSj44zQlqmpcR5p3s4VyQeWFSwk5Y9XfJ3Mt+i2q/jt/o8cMyl9pn0Pu/P7CVSCxtDJ34upUYaAmChKiOKINa/0vQ99lSFgJTBgFywrI+JfbrQhMiWUdZhYYVOPTT2mlGOjhEN6P6PyKD+vfJ0D7cf4veEvYVW4rHBvW/k1lLLHhLh94n08UP0SveZkrIqXrKZEIDCWMIgYOqsVlYf18OyYHwIGF9rIehHpNcpiTYAKckzisSXBJA4Tag6pPexzDyMIK4OzeWT2Nm4Ze/vRa2kVY7DHhLh35tP0mVMIVFK4a7VkmFZKY21A1K3U4Gm2D+gHBuZBxLMWwJgAbRUEGSbx6CTHRFC3B5hkJ4GOMESAYjg8g0drd3Dr+PUvumnw/cpN3H/oiwwHp2NVuGA5HWVyjEUp6FplSkAP0G8XWOgwAsYYlPUQZqhIY2JP207RVuMYFaCx8wFOYxiwp/JA9WaUUrxx8JMnBjF1Ez+c/hj9di1WRccFAaCVRmtI+lQIpEC3XaC1vk6DQCEmR4WCDjV5MEvD1gi1wagXIObitlEBw8Hp3DfzOWbdFG8Z+mci3XVUQVq+yvembmT7oZsZsKdiVXzcEPMJrlKEJWWBGCjbw/PETgtGTIa3Dh9BbhWB1mgVHAax0Nl6ydAqJDX9C7Lc5Q+P51B+ECcZRoXLjHvsQzp9lhCI9YIfD6EAJSjjwDowDmPAGA1KlowXmTSYzEe4vO8DvGnwk0SqfEwBEt3D1Su/wfldb2Ms24HHoVAnACCAkNcFwADBCyBOJopSC6UV2iiMVWiti5piMYQilxaVfC+X9r6XK/tuOOEZffPwZziv/FYmsp0cteezWKPiEIF6RaRo4+l5kLzNno6wHqXpVHVaoTRLQGhyaTOePcMF3VfzW/0fetFe683Dn+WM0msYbT/VufdxwLiiJVk96OSI3u/eB9u7EA55cQsMal7yRRCdBPCinndy1eDHj2EPObm0lzdcFH+w4itsTl/LRLbrmMtMRMhdm3YNxp/JpYicfh5k/Kk8F1E/c97hvFvWZnNa5NLmtQN/c0wIgFvH38O/jr7tqNeEqsSfrLyFV/VeT9NXceTLut3cZWSuzdhjntq4d0WlmC2M7OLb/Nj5nNxlKMwLzkQWGZoSBoJ1xxXs/rv6FR6p3cat4+8+5vVro5cjuCN8WNFvQSlN5lrkecaeBzIpqsM20FwI4mf2u1sRaGdNvOs0BMQvKLeBQMUoDF8f+1Pum/nsskLdOXUTP6x8jEG7npXh2Wyv3sy3xq9b9vptM5/nm+PvIlAJlsOjgkIRUkJjaGSzoGDHXS1fNB6aQO2wemTHXa0Rl+kHW+0W7XYLvMH7uW7H3LCeWHURqjJ3TH6Ae6b/ccnc6cfTH6ffrsOqGI1mMDiNB6v/wldH//AIm7ln5lN8Z/L9BComVOmCSkQKK9IYFdByDVpZg4OPCNWDzhVlbg2Y0YsCoquN+U+7zFGv1xCn8E7w7vDl5XEkupceu5p/n7qRbTNfWADxXu6d+TT9di2BShA6TQWDZTA4jV/M3sYtY9cs0MQX+I/JD9FrVxPrnvkIL/MQCkMACmrtCi53PPjluoiQFT3hGWBqcV/LAn2vel/50XRIrVi7YRUDq1LCXiFMij7VYR7H0PAVMqnz1uEvUcn3csfk++gzpxQJoBzhowTHZLaLy/s+yEnhS/jm+LUEKiHW3YW+/bw36/hIQ6ASmv4QE7P7qB7wfO6KcSfCDLAbeAS4fzGIBspn/0581UnnmZsHVpdYt/Fk4h4IU422RwZGjaHhDxUqE4yKCI6SOykUjpy2n0UAq0JClRYQOaA7tX6BEagEUZ7R+i5ajTa3bZ2RkW2tFjAOPAs8DGzXR/blaD/2nebdjSl1b61ap1KpoFyAd7JkSuRxxLoLowKsio8KMZ9oYglVmUilhKpUILRRaDTmMAilDJXWPlrNFrvuyRjZ1vKFgc8UrdODwMRSIDlQ2/652vV53VQnJyeZnqlgfNjxYrKUcB6rIowKjiuLFQStDEYFeByeHEvUcfnzECWMCqm09zBbq9Kchu/+5bQv3G0VmAAOFK+ppXZ1HdBs12Xy8e82r3NNxdj4KDPV6U6m+kvczXZkgMISHe5qVYpVIVPZCDO1CqD55tUV8bnkhZeaBPYXDe0DwLReuu1LBszuvr/94ON3tD+cNxQHRw8wPVPBqui4k7vlkpKOJ3MYgqLJMFdBWCLVhVaG8Wwn07NTaG+49R0VmXg2d4WXmiogRhZ05qt22ckq/rTj+80fIFJ+5TXJ+0fHD4B29PcNIoCX7MTqh3mPpOe90tx3q2JCVSKnwVhrF/V6DSWGb/1ZRXY/0F4Msat47St+a9jlm/EdrQCjO+5q3dmqir/wz9N3jduxcts1GegdIgwTRBzO5/OGzwL/vzDjnDPguf0RCsO2Kuo0HJQw60aZbOwla0F9THH79VMy+kS2GOJZ4GnguWJroQpkR9voUUVcSYEhYH3UrV56+Q1dbz/5fLUhSi3d5V7SpJsoiDuiS4AW3YmstHGSI0U2Oyc6aLQyWMKiThdqfoJKaz+tVgZO8fQPMu768IzPGpIvgngaeAx4stDI2Ny2wrG23hQQAGVgBbAOOGPz6+Mrz/39+MKeNZSD0FJKUuIoJQ16SO0giepBgIar0JLqYVFaY0BB7lvU3BSz7UmytodcMTXiue+favLM3U1XrIhaAbEP2FkA7FigjfmNnuPZDNULYIaLxvFGYOPZr48vPPN10aZVL9XdCGhtMKEmtCGRTQlM1NkALfLXXDIy16SdN8kzh7jObta+B3N+8e2GPHVnc2EiOOdi9xeCP10sq91FMKwe19bbMjApMAisLrSzHlg3tMmetvHyaN3Jr7C9/et0GPUqrUQX228dwxaRTgKqPI0ZYWpnzsh9bXnmRy0/uTOf08B8ElgI+3zhnXYW5/2F650Fskv+ouzv/cTs4Q/VHLPx8YLxzwWlenHDyfGn8/Hxp/MRYLh3jRka2GD6+tbYtDSgo6isjVJKt2a9qk14mdnnZPzZzM/sd0463mFOA41ilisLIPYWLnbf4u3pX39P2btMjnw66ARgakX0bxU3nipusgpYOb3XDU3vdf3Q7laKMopYaRWKFyv+sMdkXDEhjWLMQ8VY40Xa8XxxHit+n39g4KMf/ai0222cc9zHR170syhqwVJLCtvpBQaK12Bx7ivameWiiRYWrRsWaLVZaHmm0MRkYRcThfDTBUBjgT0smVv8zwCB3//MKMkl9gAAAABJRU5ErkJggg==';
    BKGM.BoxUI=function(obj){
        obj=obj||{};
        // init
        this.type=typeof obj.type!="undefined" ? obj.type : "alert";
        this.x= typeof obj.x!="undefined" ? obj.x : 0;
        this.y= typeof obj.y!="undefined" ? obj.y : 0;
        this.width= typeof obj.width!="undefined" ? obj.width : 500;
        this.height= typeof obj.height!="undefined" ? obj.height : 200;
        this.title= typeof obj.title!="undefined" ? obj.title : null;
        this.text= typeof obj.text!="undefined" ? obj.text : "UI Box";
        this.close= typeof obj.close!="undefined" ? obj.close : null;
        this.ok= typeof obj.ok!="undefined" ? obj.ok : null;
        this.yes= typeof obj.yes!="undefined" ? obj.yes : null;
        this.no= typeof obj.no!="undefined" ? obj.no : null;
        this.oktext= typeof obj.oktext!="undefined" ? obj.oktext : null;
        this.yestext= typeof obj.yestext!="undefined" ? obj.yestext : null;
        this.notext= typeof obj.notext!="undefined" ? obj.notext : null;
        this.fontSize = typeof obj.fontSize!="undefined" ? obj.fontSize : 20;
        this.fontColor = typeof obj.fontColor!="undefined" ? obj.fontColor : "#fefefe";
        this.border = typeof obj.border!="undefined" ? obj.border : 20;
        this.background = typeof obj.background!="undefined" ? obj.background : "#0e0e0e";
        this.bgImage=typeof obj.background!="undefined" ? obj.bgImage : null;
        this.closeButton=closeButton;
        this.okButton=greenButton;
        // var fadeIn
    }
    BKGM.BoxUI.prototype={
        calText:function(Game){
            Game.isBoxUI=true;
            var ctx=Game.ctx;
            var fontSize=this.fontSize;
            // cal title
            if(this.title)
            this._title={
                x:20+this.x,
                y:20+this.y,
                height:20+fontSize,
                width:this.width
            }
            // cal text
            var txtArray=[];
            var words = this.text.split(' ');            
            var line = '';
            var lineHeight=fontSize*1.5;
            var x=this.border;
            if(this.title)var y=this.border+fontSize+this._title.height;
            else var y=this.border+fontSize;
            var maxWidth=this.width-2*this.border|| 3000;
            // if(center) ctx.textAlign = "center";
            this.font=fontSize+'px '+Game.font||'40px '+Game.font;
            ctx.font = this.font;
            for(var n = 0; n < words.length; n++) {
              var testLine = line + words[n] + ' ';
              var metrics = ctx.measureText(testLine);
              var testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                // ctx.fillText(line, x, y);
                txtArray.push({
                    text:line,
                    x:x,
                    y:y
                })
                line = words[n] + ' ';
                y += lineHeight;
              }
              else {
                line = testLine;
              }
            }
            txtArray.push({
                    text:line,
                    x:x,
                    y:y
                })
            this.txtArray=txtArray;
            // cal button
            this.oktext=this.oktext||"OK";
            this._ok={
                x:this.x+this.width/2-40,
                y:this.y+this.height- 10- 40,
                width:80,
                height:40,
                _x:this.x+this.width/2-ctx.measureText(this.oktext).width/2,
                _y:this.y+this.height- 50 + fontSize
            }
            this.yestext=this.yestext||"YES";
            this._yes={
                x:this.x+this.width/2-100,
                y:this.y+this.height- 10- 40,
                width:80,
                height:40,
                _x:this.x+this.width/2-ctx.measureText(this.yestext).width/2-60,
                _y:this.y+this.height- 50 + fontSize
            }
            this.notext=this.notext||"NO";
            this._no={
                x:this.x+this.width/2+20,
                y:this.y+this.height- 10- 40,
                width:80,
                height:40,
                _x:this.x+this.width/2-ctx.measureText(this.notext).width/2+60,
                _y:this.y+this.height- 50 + fontSize
            }
            this._close={
                x:this.x+this.width-55,
                y:this.y+5,
                width:50,
                height:50
            }
        },
        fadeIn:function(callback){
            var effect=new BKGM.Effect('fadeIn',callback);
            this.effect=effect;
        },
        fadeOut:function(callback){
            var effect=new BKGM.Effect('fadeOut',callback);
            this.effect=effect;
        },
        swipein:function(direct,callback){
            var effect=new BKGM.Effect('swipein'+direct,callback);
            this.effect=effect;
        },
        swipeout:function(direct,callback){
            var effect=new BKGM.Effect('swipeout'+direct,callback);
            this.effect=effect;
        },
        draw:function(Game){
            var ctx=Game.ctx;
            ctx.save();
            ctx.globalAlpha=0.8;
            ctx.fillStyle="#0e0e0e";
            ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
            ctx.globalAlpha=1;
            if(this.effect)this.effect.draw(ctx,this);
            ctx.textBaseline = 'middle';
            var txtArray=this.txtArray;
            // background
            if(this.bgImage){
                ctx.drawImage(this.bgImage,this.x,this.y,this.width,this.height)
            } else {
                ctx.drawImage(body,this.x,this.y,this.width,this.height)
            }
            

            
            if(txtArray) {
                ctx.font=this.font;
                //title
                if(this.title){
                    ctx.fillStyle="#fefefe";
                    ctx.fillRect(this.x,this.y,this.width,this._title.height);
                    ctx.fillStyle="#0e0e0e";
                    ctx.fillText(this.title,this._title.x,this._title.y);
                }
                
                // text
                ctx.fillStyle=this.fontColor;
                for (var i = txtArray.length - 1; i >= 0; i--) {
                    ctx.fillText(txtArray[i].text,this.x+txtArray[i].x,this.y+txtArray[i].y); 
                };
                // close
                // ctx.fillStyle="#0e0e0e";
                // ctx.fillRect(this._close.x,this._close.y,this._close.width,this._close.height);
                // ctx.fillStyle="#fefefe";
                // ctx.fillText("X",this._close.x,this._close.y);
                ctx.drawImage(this.closeButton,this._close.x,this._close.y,this._close.width,this._close.height);
            } else {
                this.calText(Game);
            }

            // button
            

            // ok
            if(this.type=="alert"){
                // ctx.fillStyle="#fefefe";
                // ctx.fillRect(this._ok.x,this._ok.y,this._ok.width,this._ok.height);
                ctx.drawImage(this.okButton,this._ok.x,this._ok.y,this._ok.width,this._ok.height);
                ctx.fillStyle="#1c4e00";
                ctx.fillText(this.oktext,this._ok._x,this._ok._y);
                
            }
            // yes
            if(this.type=="yesno"){
                ctx.fillStyle="#fefefe";
                ctx.fillRect(this._yes.x,this._yes.y,this._yes.width,this._yes.height);
                ctx.fillStyle="#0e0e0e";
                ctx.fillText(this.yestext,this._yes._x,this._yes._y);
                ctx.fillStyle="#fefefe";
                ctx.fillRect(this._no.x,this._no.y,this._no.width,this._no.height);
                ctx.fillStyle="#0e0e0e";
                ctx.fillText(this.notext,this._no._x,this._no._y);
            }
            ctx.restore();

        },
        move:function(x,y){
                this.x+=x;
                this.y+=y;
                if(this.title){
                    this._title.x+=x;
                    this._title.y+=y;
                }                
                this._ok.x+=x;
                this._ok.y+=y;
                this._ok._x+=x;
                this._ok._y+=y;
                this._yes.x+=x;
                this._yes.y+=y;
                this._yes._x+=x;
                this._yes._y+=y;
                this._no.x+=x;
                this._no.y+=y;
                this._no._x+=x;
                this._no._y+=y;
                this._close.x+=x;
                this._close.y+=y;
        },
        drag:function(e){
            if(this._title && BKGM.checkMouseBox(e,{x:this.x,y:this.y,w:this._title.width,h:this._title.height})){
                if(!this.lastX){
                    this.lastX=e.x;
                    this.lastY=e.y;
                }
                var x=e.x-this.lastX;
                var y=e.y-this.lastY;
                this.lastX=e.x;
                this.lastY=e.y;
                this.move(x,y);
            }
            
        },
        down:function(e){
            this.lastX=e.x;
            this.lastY=e.y;
            if (this._close && BKGM.checkMouseBox(e,this._close)){
                this.closeButton=closeButtonPressed;
            } else
            if(this.ok && BKGM.checkMouseBox(e,this._ok)) {
                this.okButton=greenButtonPressed;
            }
            
        },
        up:function(e){
            this.closeButton=closeButton;
            this.okButton=greenButton;
            if (this._close && BKGM.checkMouseBox(e,this._close)){
                this.close(e);
            } else
            if(this.ok && BKGM.checkMouseBox(e,this._ok)) {
                this.ok(e);
            } else
            if(this.yes && BKGM.checkMouseBox(e,this._yes)) {
                this.yes(e);
            } else
            if(this.no && BKGM.checkMouseBox(e,this._no)) {
                this.no(e);
            }
        },
        keyDown:function(e){
            var keyCode = e.keyCode;
            var specialKey = [BKGM.KEYS.F5,BKGM.KEYS.F12,BKGM.KEYS.BACKSPACE];
            if(specialKey.indexOf(keyCode)!=-1) return;
            if(keyCode == BKGM.KEYS.ENTER) {
                if(this.ok) {
                    this.ok(e);
                } else
                if(this.yes) {
                    this.yes(e);
                } else
                if(this.no) {
                    this.no(e);
                }
            }
        }

    }
     
        
       
})();