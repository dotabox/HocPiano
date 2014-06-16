(function (window) {
var loadingIcon = new Image();
loadingIcon.src = "Pack/loading-icon.png";
var spriteloading= new Image();
spriteloading.src="img/horse2.png";
loadingIcon.onload = function(){
	
}
var CANVAS_WIDTH=1920;
var CANVAS_HEIGHT=1080;
var posIconY=19;
var loginButtonWidth = 655;
var loginButtonHeight = 114;
var images=[
				["bkgmLogo","Pack/BKGM-logo-big.png"],
				["pic-background","Pack/pic-background.png"],
				["fbLoginIcon","Pack/facebook-small.png"],
				["noLoginIcon","Pack/anonymous-icon.png"],
				["pianoic-logo","Pack/pianoic-logo.png"],
				["icon_record","Pack/icon_record.png"],
				["icon_record_active","Pack/icon_record_active.png"],
				["icon_play","Pack/icon_play.png"],
				["icon_pause","Pack/icon_pause.png"],
				["icon_stop","Pack/icon_stop.png"],
				["icon_volume","Pack/icon_volume.png"],
				["icon_volume_active","Pack/icon_volume_active.png"],
				["icon_sheet","Pack/icon_sheet.png"],
				["icon_playlist","Pack/icon_playlist.png"],
				["icon_share","Pack/icon_share.png"],
				["icon_setting","Pack/icon_setting.png"],
				["icon_fullscreen","Pack/icon_fullscreen.png"],
				["icon_challenge","Pack/icon_challenge.png"],
				["key-mid","Pack/key-mid.png"],
				["key-left","Pack/key-left.png"],
				["key-right","Pack/key-right.png"],
				["key-pressed","Pack/key-pressed.png"],
				["key-black","Pack/key-black.png"],
				["key-black-pressed","Pack/key-black-pressed.png"],
				["woodbar-top","Pack/woodbar-top.png"],
				["woodbar-left","Pack/woodbar-left.png"],
				["woodbar-right","Pack/woodbar-right.png"],
				["closebutton-gray","Pack/closebutton-gray.png"],
				["closebutton-red","Pack/closebutton-red.png"],
				["icon-songlist","Pack/icon-songlist.png"],
				["icon-author","Pack/icon-author.png"],
				["icon-stats","Pack/icon-stats.png"],
				["icon-duration","Pack/icon-duration.png"],
				["cardnote-black","Pack/cardnote-black.png"],
				["cardnote-white","Pack/cardnote-white.png"],
				["cardnote-black-shift","Pack/cardnote-black-shift.png"],
				["cardnote-white-shift","Pack/cardnote-white-shift.png"],
				["hit-greenlight","Pack/hit-greenlight.png"],
				["radio-checked","Pack/radio-checked.png"],
				["radio-uncheck","Pack/radio-uncheck.png"],
				["big-facebookshare-icon","Pack/big-facebookshare-icon.png"],
				["big-share-icon","Pack/big-share-icon.png"],
				["edit","Pack/edit.png"],	
				["key-pressed-green","Pack/key-pressed-green.png"],	
				["key-pressed-red","Pack/key-pressed-red.png"],	
				["key-black-pressed-green","Pack/key-black-pressed-green.png"],	
				["key-black-pressed-red","Pack/key-black-pressed-red.png"],
				["trash","Pack/trash.png"],
				["arrow-up","Pack/arrow-up.png"],
				["arrow-reset","Pack/arrow-reset.png"],
				["arrow-down","Pack/arrow-down.png"]
				
			];
var PianoicStyle={
	images:images,
	loadActor:{
		child:{
			loadIcon:{
				image:loadingIcon,
				location:{x:CANVAS_WIDTH/2-197/2,y:CANVAS_HEIGHT/8}
			},
			loadProcess:{
				run:'sprite',
				text:{
					loadText :"Loading",
					font : "italic 50px UTM Avo"
				},
				sprite:{
					image:spriteloading,
					colum:8,
					row:1,
					FPS:80,
					AnimationIndex:[0,1,2,3,4,5,6,7]
				}
			},
			bkgmLogo:{
				image:['bkgmLogo',1,1],
				location:{x:CANVAS_WIDTH/2-197/2,y:CANVAS_HEIGHT/8}
			}
		}
	},
	// Loginform:{
	// 	child
	// 	fbLogin:{
	// 		bound:{x:CANVAS_WIDTH.width/2-loginButtonWidth/2,y:CANVAS_HEIGHT*2/3-loginButtonHeight/2,width:loginButtonWidth,height:loginButtonHeight}
	// 	},
	// 	noLogin:{
	// 		bound:{x:CANVAS_WIDTH.width/2-loginButtonWidth/2,y:CANVAS_HEIGHT*2/3+loginButtonHeight/2,width:loginButtonWidth,height:loginButtonHeight}
	// 	}
	// },	
	Background:{
		image:['pic-background',1,1],
		//bound:{x:0,y:0,width:CANVAS_WIDTH,height:CANVAS_HEIGHT}
		size:{width:CANVAS_WIDTH,
			  height:CANVAS_HEIGHT},
	  	location:{x:0,y:86},
	  	zindex:1
	},
	playbackBoard:{
		bound:{x:0,y:86,width:1920,height:700},
		child:{
			playbackKey:{
				imgs:['cardnote-black','cardnote-white',"cardnote-black-shift","cardnote-white-shift"],
				text:{
					fillStyle1 : "#000",
					fillStyle2 : "#fff",
					font : "35px UTM Avo",
					textHeight : 65
				},
				bound:{x:30,y:0,width:1855,height:700}
			},
			hitkeygreen:{
				image:['hit-greenlight',1,1]
			}
		}
	},	
	keyBoardActor:{
		bgcolor:'#0e0e0e',
		bound:{x:0,y:785,width:1920,height:296},	
		text:{
			font:"25px UTM Avo",
			font2:"20px UTM Avo"
		},	
		//bound:{x:30,y:806,width:1857,height:235},	
		child:{
			keyBoardActorWhite:{
				imgs:['key-mid','key-left','key-right'],
				bound:{x:30,y:20,width:1855,height:235},				
				fontcolor:'#000',
			},			
			keyBoardActorBlack:{
				imgs:['key-black'],
				bound:{x:30,y:20,width:1855,height:235},
				fontcolor:'#fff'					
			},
			borderKBActor:{
				bgcolor:'#0e0e0e',
				imgs:['woodbar-top','woodbar-left','woodbar-right'],
				bound:{x:0,y:0,width:1920,height:296}
			},
			whiteKey:{
				whiteKeyActor:{
					imgs:['key-pressed','key-pressed-green','key-pressed-red'],
					size:{width:49,height:235}
				}
			},
			blackKey:{
				blackKeyActor:{
					imgs:['key-black-pressed','key-black-pressed-green','key-black-pressed-red'],
					size:{width:37,height:157}
				}
			}			
		}
	},
	mouseEventActor:{
		bound:{x:30,y:805,width:1855,height:235}
	},
	// countdownActor
	clockActor:{
		bound:{x:734,y:86,width:504,height:65},
		child:{
			time:{
				bgcolor:"#5b0d0d",
				fontcolor:"#FFF",
				font : "30px UTM Avo",
				textHeight: 40,
				bound:{x:0,y:0,width:158,height:65}
			},
			stat:{
				bgcolor:"#212224",
				fontcolor:"#FFF",
				font : "30px UTM Avo",
				textHeight: 40,
				bound:{x:158,y:0,width:346,height:65},
				perfect:"#ff00f0",
				great:"#04b918",
				cool:"#048cb9",
				notbad:"#ffae00",
				miss:"#ff0042"
			}
		}
	},
	hintActor:{
		bound:{x:30,y:1040,width:1855,height:40}
	},
	showKeyActor:{
		text:{
			fillStyle : "#ededed",
			font : "35px UTM Avo"
		},		
		bound:{x:1820,y:50,width:60,height:30},
		zindex:11
	},
	// santaActor
	statisticActor:{
		location:{x:582,y:148},
		size:{width:824,height:582},
		visible:false,	
		child:{
			score:{
				bgcolor:"#8d1f1e",
				bound:{x:0,y:0,width:824,height:79},
				fontcolor:"#fff",
				font:"bold 42px UTM Avo",
				posX:48,
				posY:53
			},
			close:{
				img1:['closebutton-red',1,1],
				img2:['closebutton-gray',1,1],
				location:{x:774,y:31}
			},
			stat:{
				bgcolor:"#0e0e0e",
				bound:{x:0,y:79,width:278,height:503},
				font:"bold 35px UTM Avo",
				posY:140,
				posX:48,
				textHeight:75,
				perfect:"#ff00f0",
				great:"#04b918",
				cool:"#048cb9",
				notbad:"#ffae00",
				miss:"#ff0042",
				passed:"#bcbcbc"
			},
			multi:{
				bgcolor:"#212121",
				bound:{x:278,y:79,width:250,height:503}
			},
			total:{
				bgcolor:"#0e0e0e",
				bound:{x:528,y:79,width:296,height:503}
			}
			

		}
	},
	menuContainer:{
		bgcolor:'#9b2929',
		size:{width:CANVAS_WIDTH,
			  height:86},
	  	location:{x:0,y:0},
	  	child:{
	  		bglogoActor:{
	  			bgcolor:'#0e0e0e',
	  			bound:{x:0,y:0,width:273,height:87}
	  		},
	  		pianoiclogoActor:{
	  			image:['pianoic-logo',1,1],
			  	location:{x:20,y:posIconY}
	  		},
	  		recordButton:{
	  			img1:['icon_record',1,3],
	  			img2:['icon_record_active',1,3],
			  	location:{x:305,y:posIconY}
	  		},
	  		playButton:{
	  			img1:['icon_play',1,3],
	  			img2:['icon_pause',1,3],
			  	location:{x:400,y:posIconY}
	  		},
	  		stopButton:{
	  			img1:['icon_stop',1,3],
			  	location:{x:488,y:posIconY}
	  		},
	  		volumeButton:{
	  			img1:['icon_volume',1,3],
	  			img2:['icon_volume_active',1,3],
			  	location:{x:579,y:posIconY}
	  		},
	  		bginfosongActor:{
	  			bgcolor:'#0e0e0e',
	  			bound:{x:684,y:0,width:610,height:87},
	  			visible:false
	  		},
	  		sheetButton:{
	  			img1:['icon_sheet',1,3],
			  	location:{x:1311,y:posIconY}
	  		},
	  		playListButton:{
	  			img1:['icon_playlist',1,3],
			  	location:{x:1386,y:posIconY}
	  		},
	  		shareButton:{
	  			img1:['icon_share',1,3],
			  	location:{x:1466,y:posIconY}
	  		},
	  		settingButton:{
	  			img1:['icon_setting',1,3],
			  	location:{x:1546,y:posIconY}
	  		},
	  		fullscreenButton:{
	  			img1:['icon_fullscreen',1,3],
			  	location:{x:1620,y:posIconY}
	  		},
	  		bgshowkeyActor:{
	  			bgcolor:'#0e0e0e',
	  			bound:{x:1827,y:0,width:CANVAS_WIDTH-1827,height:87}
	  		},
	  		disableActor:{
	  			bgcolor:'#FFF',
	  			bound:{x:0,y:0,width:CANVAS_WIDTH,height:86},
	  			alpha:0.1
	  		},
	  		challengeButton:{
	  			img1:['icon_challenge',1,3],
	  			location:{x:1690,y:posIconY},	  			
	  		}
	  	},
	  	zindex:8
	},
	infosongActor:{
		bgcolor:'#0e0e0e',
		bound:{x:684,y:0,width:610,height:87},
		child:{
			songname:{
				fontcolor:'#FFF',
				font:"30px UTM Avo",
				posY:35,
				posX:25
			},
			author:{
				fontcolor:'#FFF',
				font:"italic 20px UTM Avo",
				posX: 25,
				posY:65
			},
			difficulty:{
				fontcolor:'#FFF',
				font:"30px UTM Avo",
				posX:460,
				posY :50
			}
		}
	},
	tooltips:{
		tooltip:{
			bgcolor:'#0e0e0e',
			fontcolor:'#fff',
			font:"16px UTM Avo",
			size:{width:428,height:70}
		},
		selectOption:{
			bgcolor:'#0e0e0e',
			selectFill:'#212224 ',
			fontcolor:'#fff',
			font:"25px UTM Avo",
			size:{width:428,height:260},
			posX:50
		}	  			
	},
	volumeBar:{
		text:{
			strokeStyle : "#0a0a0c",
			lineWidth : 12,
			fillStyle : '#9b2929'
		},
		bound:{x:579,y:86+12/2,width:40,height:149},
		visible:false
	},
	shareContainer:{
		bgcolor:'#8d1f1f',
		bound:{x:460,y:146,width:1166,height:560},
		child:{
			offButtonPosition:{
				img2:['closebutton-red',1,1],
				img1:['closebutton-gray',1,1],
				location:{x:1136,y:5}
			},
			radiocheck:{
					img1:["radio-checked",1,1],
					img2:["radio-uncheck",1,1],
					posX:780,
					posY:200,
					textHeight:48,
					font:"24px UTM Avo"
			},
			songlink:{
				bgcolor:'#0e0e0e',
				bound:{x:0,y:0,width:1166,height:280},
				imgs:'big-share-icon',
				text:{
					font : "30px UTM Avo",
					fontcolor : "#ffffff",
					posX:315,
					posY:80
				}
			},
			link:{
				data:{
					x:688,
					y:270,
					width:770,
					height:45,
					fontFamily : "UTM Avo",
					fontStyle : "italic",
					color:'#fff',
					textIndent:20,
					fontSize:21,
					borderLeftWidth:16,
					bgcolor:"#3e4148"
				}
			},
			sharegame:{
				bgcolor:'#294a7f',
				bound:{x:0,y:280,width:1166,height:280},
				imgs:'big-facebookshare-icon',
				text:{
					font : "30px UTM Avo",
					fontcolor : "#ffffff",
					posX:314,
					posY:160
				}
			}
		}
	},
	challengeContainer:{
		
		bound:{x:294,y:255,width:1311,height:442},
		child:{
			body:{
				bgcolor:'#8d1f1f',
				fontcolor:'#fff',
				font:"30px UTM Avo",
				font1:"20px UTM Avo",
				posX:42,
				posY:42,
				textHeight:125,
				bound:{x:0,y:60,width:1311,height:387},
			},
			title:{
				bgcolor:'#0e0e0e',
				fontcolor:'#fff',
				font:"30px UTM Avo",
				textHeight:45,
				size:{width:551,height:60}
			},
			button:{
				bgcolor:'#0e0e0e',
				fontcolor:'#fff',
				font:"24px UTM Avo",
				size:{width:180,height:60},
				posX:900
			}
		}
	},
	settingContainer:{
		bgcolor:'#8d1f1f',
		bound:{x:460,y:117,width:1426,height:644},
		child:{
			offButtonPosition:{
				img1:['closebutton-red',1,1],
				img2:['closebutton-gray',1,1],
				location:{x:1391,y:5}
			},
			radiocheck:{
					img1:["radio-checked",1,1],
					img2:["radio-uncheck",1,1],
					posX:100,
					posY:60,
					textHeight:80
			},
			general:{				
				font : "30px UTM Avo",
				fillStyle : "#ffffff",
				selectFill : "#fafafa",				
				selectAlpha :0.2,
				posX:100,
				posY:60,
				textHeight:60
			},
			keyboard:{
				font:"30px UTM Avo",
				fontcolor:"#fff",
				sizeButton:{width:380,height:66},
				posX:30,
				posY:30,
				textHeight:60,
				selectFill:'#993131',
				singlenote:{
					bound:{x:30,y:220,width:1339,height:395},
					space:{x:464,y:97,width:312},
					title:{
						imgs:['edit','trash'],
						font:"25px UTM Avo",
						fontcolor:'#fff',
						bound:{x:44,y:118,width:1300,height:38}
					},
					note:{
						font:"25px UTM Avo",
						fontcolor:'#000',
						fillStyle:'#fff',
						size:{width:70,height:42}
					},
					key:{
						font:"25px UTM Avo",
						fontcolor:'#fff',
						strokeStyle:'#fff',						
						size:{width:70,height:42}
					}
				},
				chord:{
					bound:{x:30,y:227,width:1339,height:395},
					space:{x:464,y:72,width:400},
					button:{
						posX:50,
						posY:530,
						fontcolor:'#fff'
					}
				},
				meta:{
					bound:{x:30,y:227,width:1339,height:395},
					button:{
						bgcolor:'#6d1312',
						iconcolor:'#0a0a0a',
						imgs:['arrow-up','arrow-reset','arrow-down'],
						size:{width:608,height:83},
						boxsize:{width:135,height:83},
						posX:153,
						posY:181,
						textHeight:143
					}
				}
			}
		}
	},
	chooseSetting:{
		bgcolor:'#0e0e0e',
		bound:{x:40,y:168,width:420,height:540},
		text:{
			font : "30px UTM Avo",
			fillStyle : "#ffffff",
			selectFill : "#fafafa",
			selectAlpha :0.2,
			posX:30,
			posY:60,
			textHeight:60
		}
		// child:{
		// 	general:{},
		// 	keyboard:{},
		// 	record:{},
		// 	socialplay:{}
		// }
	},
	playListContainer:{
		bgcolor:'#8d1f1f',
		bound:{x:460,y:117,width:1426,height:644},
		child:{
			offButtonPosition:{
				img1:['closebutton-red',1,1],
				img2:['closebutton-gray',1,1],
				location:{x:1391,y:5}
			},
			head:{
				bound:{x:0,y:0,width:1391,height:100},
				child:{
					iconsonglist:{
						image:['icon-songlist',1,1],
						location:{x:405,y:20}
					},
					iconauthor:{
						image:['icon-author',1,1],
						location:{x:1138,y:20}
					}
				}
			},
			songlist:{
				text:{
					fillStyle : "#ffffff",
					selectFill : "#fafafa",
					selectAlpha :0.2,
					font : "30px UTM Avo"
				},
				data:{x:104,y:120,width:833,height:500,textHeight:85}
			},
			author:{
				text:{
					font : "30px UTM Avo"
				},
				data:{x:930,y:120,width:460,height:500}
			}
		}
	},
	highScoreContainer:{
		bgcolor:'#0e0e0e',
		bound:{x:40,y:168,width:420,height:540},
		child:{
			difficulty:{
				text:{
						fillStyle : "#ffffff",
						font : "30px UTM Avo",
						textHeight:30
				},
				bound:{x:0,y:0,width:420,height:72},
				easy:{
					bgcolor:"#1f2324",
					bound:{x:0,y:0,width:130,height:72}
				},
				hard:{
					bgcolor:"#1f2324",
					bound:{x:130,y:0,width:140,height:72}
				},
				insane:{
					bgcolor:"#1f2324",
					bound:{x:270,y:0,width:150,height:72}
				}
			},
			stats:{
				text:{
					fillStyle : "#ffffff",
					font : "35px UTM Avo",
					posX:135,
					posY:40
				},
				img1:['icon-stats',1,1],
				bound:{x:54,y:135,width:350,height:60}
			},
			duration:{
				img1:['icon-duration',1,1],
				bound:{x:54,y:230,width:350,height:60}
			},
			play:{
				text:{
					fillStyle : "#ffffff",
					font : "30px UTM Avo",
					textHeight:30
				},
				bgcolor:'#5b0d0d',
				colorenter:'#5b1c19',
				bound:{x:0,y:445,width:420,height:95}
			}
		}
	}

}
var setPianoicStyle=function(director,actor,styleObj){
	var imgArr=[];
	styleObj.bgcolor?actor.setFillStyle(styleObj.bgcolor):null;
	if(styleObj.image){
		if (Array.isArray(styleObj.image))
			imgArr.push(new CAAT.SpriteImage().initialize(director.getImage(styleObj.image[0]),styleObj.image[1],styleObj.image[2]));
		else imgArr.push(styleObj.image);
		actor.setBackgroundImage(imgArr[imgArr.length-1]);
	};
	if (styleObj.img1){
			imgArr.push(new CAAT.SpriteImage().initialize(director.getImage(styleObj.img1[0]),styleObj.img1[1],styleObj.img1[2]));
	};
	if (styleObj.img2){
		imgArr.push(new CAAT.SpriteImage().initialize(director.getImage(styleObj.img2[0]),styleObj.img2[1],styleObj.img2[2]));
	};
	styleObj.imgs?imgArr=styleObj.imgs:null;
	styleObj.bound?actor.setBounds(styleObj.bound.x,styleObj.bound.y,styleObj.bound.width,styleObj.bound.height):null;
	styleObj.size?actor.setSize(styleObj.size.width,styleObj.size.height):null;
	styleObj.location?actor.setLocation(styleObj.location.x,styleObj.location.y):null;
	styleObj.alpha?actor.setAlpha(styleObj.alpha):null;
	styleObj.visible!=undefined?actor.setVisible(styleObj.visible):null;
	styleObj.text?actor.text=styleObj.text:null;
	styleObj.data?actor.data=styleObj.data:null;
	return imgArr;
}
window.setPianoicStyle=setPianoicStyle;
window.PianoicStyle=PianoicStyle;
})(window);