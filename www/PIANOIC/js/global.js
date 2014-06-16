
var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT  = 1080;
var defaultresolution=16/9;
(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "http://connect.facebook.net/vi_VN/all.js";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	  

(function(window){
	window.fbAsyncInit = function() {
		    // init the FB JS SDK
		    FB.init({
		      appId      : '571644532917565',                        // App ID from the app dashboard
		      status     : true,                                 // Check Facebook Login status
		      xfbml      : true ,                                 // Look for social plugins on the page
		      cookie: true, // set sessions cookies to allow your server to access the session?
		      frictionlessRequests: true,
		      oauth: true
		    });
		}
    var access_token,uid;
    var sendData=function(res){
    	var dt;
    	var fd = new FormData();
        fd.append("response", res);
        try {
            $.ajax({
                url: "/user",
                type: "POST",
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function (data) {
                    console.log("success " + data);
                },
                error: function (shr, status, data) {
                    console.log("error " + data + " Status " + shr.status);
                },
                complete: function () {
                    console.log("li");
                }
            });

        } catch (e) {
            console.log(e);
        }
        return dt;
    }
    var LogoutFB=function(callback){
    	FB.logout(function(response) {
			try {
            $.ajax({
                url: "/logout",
                type: "GET",
                processData: false,
                contentType: false,
                cache: false,
                success: function (data) {
                    console.log("success " + data);
                },
                error: function (shr, status, data) {
                    console.log("error " + data + " Status " + shr.status);
                },
                complete: function () {
                    console.log("li");
                }
            });

        } catch (e) {
            console.log(e);
        }
		  if(callback) callback()
		});
    }
    var LoginFB=function(callback,mess){
        FB.getLoginStatus(function(response) {
     
            if (response.status === 'connected') {
                //If you want the user's Facebook ID or their access token, this is how you get them.
                uid = response.authResponse.userID;
                access_token = response.authResponse.accessToken;
                data=sendData(response.authResponse);
                if(callback) callback(data);
                
                
     
            } else {
        FB.login(function (response) {
                        if (response.authResponse) {
                            uid = response.authResponse.userID;
                            access_token = response.authResponse.accessToken;
                            data=sendData(response.authResponse);
                            if(callback) callback(data);
                        } else {
                        	var message=mess||"You must install the application to share your greeting \n Bạn phải cho phép ứng dụng mới có thể chia sẻ thông tin của bạn với bạn bè"
                            alert(message);
                        }
                    }, {
                        scope: 'publish_actions,publish_stream'
                    });
            }

      });
		
  }
  var postScore=function(mess1,mess2,mess3){
  		LoginFB(mess3);
    	var getName=function(){
	      	var x;

	      	var mess=prompt(mess1,mess2);

	      	if (mess!=null)
		        {
		        postIMG(mess+ "\n http://pianoic.com");
		        }
	    }
	    
	    function postIMG(mess) {
	        var canvas = document.getElementById("canvas");
	        var imageData = canvas.toDataURL("image/png");
	        try {
	            blob = dataURItoBlob(imageData);
	        } catch (e) {
	            console.log(e);
	        }
	        var fd = new FormData();
	        fd.append("access_token", access_token);
	        fd.append("source", blob);
	        fd.append("message", mess);
	        try {
	            $.ajax({
	                url: "https://graph.facebook.com/me/photos?access_token=" + access_token,
	                type: "POST",
	                data: fd,
	                processData: false,
	                contentType: false,
	                cache: false,
	                success: function (data) {
	                    console.log("success " + data);
	                    $("#poster").html("Posted Canvas Successfully");
	                },
	                error: function (shr, status, data) {
	                    console.log("error " + data + " Status " + shr.status);
	                },
	                complete: function () {
	                    console.log("Posted to facebook");
	                }
	            });

	        } catch (e) {
	            console.log(e);
	        }
	    }

	    // Convert a data URI to blob
	    function dataURItoBlob(dataURI) {
	        var byteString = atob(dataURI.split(',')[1]);
	        var ab = new ArrayBuffer(byteString.length);
	        var ia = new Uint8Array(ab);
	        for (var i = 0; i < byteString.length; i++) {
	            ia[i] = byteString.charCodeAt(i);
	        }
	        return new Blob([ab], {
	            type: 'image/png'
	        });
	    }
    }
    window.postScore=postScore;
    window.LoginFB=LoginFB;
})(window);
function download(filename, text, base) {
            var pom = document.createElement('a');
            pom.setAttribute('href', base + encodeURIComponent(text));
            pom.setAttribute('download', filename);
            pom.click();
}
/*
var SFX_VOLUME = 100;
var MUSIC_VOLUME = 100;
var PLAYBACK_SPEED = 1;
var LANGUAGE = 0; //0: English, 1: Vietnamese

var AUTOPLAY = true;		// tu danh not play 1 ban nhac
var ENABLE_PLAY_FILE = true;	// tim va phat File thay cho Note On neu co;
var PLAY_FULL_FILE = true; 	// down file Full thay vi file Simple
var AUTO_PAUSE = false; 	// down file Full thay vi file Simple
var SHOW_KEYBOARD_TEXT = true;
var SHOW_PLAYBACK_TEXT = true;

var SELECTING_RECORD = 3;
var DIFFICULTY_EASY = 0;
var DIFFICULTY_HARD = 1;
var DIFFICULTY_INSANE = 2;
var DIFFICULTY = DIFFICULTY_HARD;
var DIFFICULTY_NUMBER = 3;

var RECORDING = false;		// dang record 1 ban nhac
var PLAYING_RECORD = false;	// dang play 1 ban nhac
var PAUSING_RECORD = false;	// dang pause
var PLAY_FILE = false;		// co dang phat file khong
var JUST_LOAD_A_SONG = false;

var countingDown = false;
var pointData = [];
var Sound;

var playingAudio;
*/
function randomNumber(a){
	var output = (Math.random()*a)<<0;
	if(output==a) return 0;
	else return output;
}



// CAAT.DEBUG=1;

/*function detectResolution(){
	var realresolution=window.screen.width/window.screen.height;
	var averageresolution=(16/9+4/3)/2;
	if (realresolution<averageresolution){
		CANVAS_WIDTH=1366;
		defaultresolution=4/3;
	} else {
		CANVAS_WIDTH=1920;
		defaultresolution=16/9;
	}
}
detectResolution();*/
var UnSign = function(str) {
	    str = str.toLowerCase();
	    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	    str = str.replace(/đ/g, "d");
	    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
	    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
	    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
	    str = str.replace(/^\-+|\-+$/g, "");
	    //cắt bỏ ký tự - ở đầu và cuối chuỗi
	    return str;
	};
var convertkeyCodetoString=function(keyCode,isShift,location){
    var str="";
    var color='#000';
    if(keyCode>=65&&keyCode<=90){
        if(!isShift)
            str=String.fromCharCode(keyCode).toLowerCase();
        else
            str=String.fromCharCode(keyCode);

    } else if(keyCode>=96&&keyCode<=105){
        str=String.fromCharCode(keyCode-48);
        
    } else if(keyCode>=48&&keyCode<=57&&!isShift){
            str=String.fromCharCode(keyCode);        
    } else {
        switch(keyCode){
            //Number and shift
                case 48:str=String.fromCharCode(41);break;
                case 49:str=String.fromCharCode(33);break;
                case 50:str=String.fromCharCode(64);break;
                case 51:str=String.fromCharCode(35);break;
                case 52:str=String.fromCharCode(36);break;
                case 53:str=String.fromCharCode(37);break;
                case 54:str=String.fromCharCode(94);break;
                case 55:str=String.fromCharCode(38);break;
                case 56:str=String.fromCharCode(42);break;
                case 57:str=String.fromCharCode(40);break;
            //Other key
                case 8: str='Tb';break;
                case 13: str='Ent';break;
                case 19: str='Pau';break;
                case 33: str='PUp';break;
                case 34: str='PDn';break;
                case 35: str='End';break;
                case 36: str='Hm';break;
                case 37:str='la';break;
                case 38:str='ua';break;
                case 39:str='ra';break;
                case 40:str='da';break;
                case 45:str='Ins';break;
                case 46:str='Del';break;
                case 106:str='*';break;
                case 107:str='+';break;
                case 109:str='-';break;
                case 110:str='Del';break;
                case 111:str='/';break;
                case 112:str='f1';break;
                case 113:str='f2';break;
                case 114:str='f3';break;
                case 115:str='f4';break;
                case 116:str='f5';break;
                case 117:str='f6';break;
                case 118:str='f7';break;
                case 119:str='f8';break;
                case 120:str='f9';break;
                case 121:str='f10';break;
                case 122:str='f11';break;
                case 123:str='f12';break;
                case 145:str='Slk';break;
                case 186:isShift?str=':':str=';';break;
                case 187:isShift?str='+':str='=';break;
                case 188:isShift?str='<':str=',';break;
                case 189:isShift?str='_':str='-';break;
                case 190:isShift?str='>':str='.';break;
                case 191:isShift?str='?':str='/';break;
                case 192:isShift?str='~':str='`';break;
                case 219:isShift?str='{':str='[';break;
                case 220:isShift?str='|':str='\\';break;
                case 221:isShift?str='}':str=']';break;
                case 222:isShift?str='\"':str='\'';break;

        }
    }
    if(isShift){        
        if(location==3){
            color='#ff00f0';
        } else color='#000';
    } else {
        if(location==3){
            color='#1400d4';
        }
    }
    
    return {str:str,color:color}
};

(function(window){
    var access_token,uid;
    var LoginFB=function(callback){
        FB.getLoginStatus(function(response) {
     
            if (response.status === 'connected') {
                //If you want the user's Facebook ID or their access token, this is how you get them.
                uid = response.authResponse.userID;
                access_token = response.authResponse.accessToken;
                if(callback) callback(access_token);
                
                
     
            } else {
        FB.login(function (response) {
                        if (response.authResponse) {
                            uid = response.authResponse.userID;
                            access_token = response.authResponse.accessToken;
                            getName();
                        } else {
                            alert(LANG.fb.permission[LANGUAGE]);
                        }
                    }, {
                        scope: 'publish_actions,publish_stream'
                    });
            }

      });
        
  }
    
    window.LoginFB=LoginFB;
})(window);