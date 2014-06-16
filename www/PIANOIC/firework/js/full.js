var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT  = 600;
window.onload = function () {
 	windowLoad();
	function windowLoad(){	
		CAAT.DEBUG = 1;
		var director = new CAAT.Foundation.Director().initialize(CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById("canvas"));
		var scene = director.createScene();
		scene.setFillStyle("#000")
		var phaohoa = new CAAT.FireWork().initialize(director);
		scene.addChild(phaohoa);
		CAAT.loop(25);
	}
}
