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
    var xPos2;
    var yPos2;
    var lastX2;
    var lastY2;
    var isDrawing2 = false;
    var isDrawing = false;
    var drawer = false;
    
    ws.on("serverMessage", function(data){
	$("#chat").append("<p>" + data.nam + ": " + data.msg + "</p>");
    });
    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", {msg: document.getElementById("chatBar").value, nam: name});
	document.getElementById("chatBar").value="";
    };

    ws.on("drawing",function(coordData){
	if (!drawer){
	    xPos2 = coordData[0];
	    yPos2 = coordData[1];
	    context.lineWidth = coordData[2];
	    console.log(xPos2+" "+yPos2);
	    context.beginPath();
	    context.lineJoin="round";
	    context.moveTo(lastX2,lastY2);
	    context.lineTo(xPos2,yPos2);
	    context.closePath();
	    context.stroke();
	    lastX2 = xPos2;
	    lastY2 = yPos2;
	}
    });
    
    var draw = function changeColor(event){
	var rect = canvas.getBoundingClientRect(); 
	xPos = (event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
	yPos = (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	if (isDrawing){
	    ws.emit("coordinates",{"x":xPos,"y":yPos,"color": context.strokeStyle, "width": context.lineWidth,"isDrawing": isDrawing});
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
	drawer = true;
    };
    var notDraw = function notDraw(e){
	canvas.style.cursor="default";
	isDrawing=false;
	drawer = false;
    
    
};

    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    
    canvas.addEventListener("mousemove",draw);
    canvas.addEventListener("mousedown",drawing);
    canvas.addEventListener("mouseup",notDraw);
    canvas.addEventListener("mouseout",notDraw);
});

