var transform;
var cubeStyle;
var angleX = 0;
var angleY = 0;
var angles = [];
angles[37] = [ 0, -90];  // left
angles[38] = [90,   0];  // up
angles[39] = [ 0,  90];  // right
angles[40] = [-90,  0];  // down
function initialize() {
	var transforms = [
		"transform",
		"WebkitTransform",
		"MozTransform",
		"OTransform",
		"msTransform"
	];
	var cubeElement = document.getElementById("cube");
	var divStyle = document.createElement("div").style;
	var count = transforms.length;
	for(var i = 0; i < count; i++) {
		var transformType = transforms[i];
		var divTransform = divStyle[transformType];
		if(typeof divTransform != "undefined") {
			transform = transformType;
			break;
		}
	}
	cubeStyle = cubeElement.style;
}
document.onkeydown = function (eventObject) {
	var angleXY = angles[eventObject.keyCode];
	if (angleXY) {
		angleX += angleXY[0];
		angleY += angleXY[1];
		cubeStyle[transform] =
			"rotateX(" + angleX + "deg) " +
			"rotateY(" + angleY + "deg)";
	}
};
initialize();
