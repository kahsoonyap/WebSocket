$(document).ready(function(){
    var ws  = io.connect("localhost:5000");
    var name = "";

    var canvas = document.getElementById("drawcanvas");
    var context = canvas.getContext("2d");
    context.strokeStyle="black";
    context.lineWidth="5";
    var rect = canvas.getBoundingClientRect();
    var xPos;
    var yPos;
    var lastX;
    var lastY;
    var isDrawing = false;
    
    ws.on("serverMessage", function(data){
	$("#chat").append("<p>" + data.nam + ": " + data.msg + "</p>");
    });
    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", {msg: document.getElementById("chatBar").value, nam: name});
	document.getElementById("chatBar").value="";
    };

    ws.on("drawing",function(coordData){
	xPos = coordData[0];
	yPos = coordData[1];
	context.lineWidth = coordData[2];
	console.log(xPos+" "+yPos);
	context.beginPath();
	context.lineJoin="round";
	context.moveTo(lastX,lastY);
	context.lineTo(xPos,yPos);
	context.closePath();
	context.stroke();
	lastX = xPos;
	lastY = yPos;
    });
    
    var draw = function changeColor(event){
	var rect = canvas.getBoundingClientRect(); 
	xPos = (event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
	yPos = (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	ws.emit("coordinates",{"x":xPos,"y":yPos,"color": context.strokeStyle, "width": context.lineWidth,"isDrawing": isDrawing});
	if (isDrawing){
	    context.beginPath();
	    context.lineJoin="round";
	    context.moveTo(lastX,lastY);
	    context.lineTo(xPos,yPos);
	    context.closePath();
	    context.stroke();
	};
	lastX = xPos;
	lastY = yPos;
    };
    var drawing = function drawing(e){
	canvas.style.cursor="crosshair";
	isDrawing=true;
    };
    var notDraw = function notDraw(e){
    canvas.style.cursor="default";
    isDrawing=false;
    
};

    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    
    canvas.addEventListener("mousemove",draw);
    canvas.addEventListener("mousedown",drawing);
    canvas.addEventListener("mouseup",notDraw);
    canvas.addEventListener("mouseout",notDraw);
});

