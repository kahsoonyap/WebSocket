from flask import Flask, render_template 
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/', methods=["GET","POST"])
def index():
    return render_template('index.html')

@socketio.on('clientMessage')
def recievedMessage(data):
    emit('serverMessage', data, broadcast=True)

@socketio.on("coordinates")
def coordinates(data):
    x=data["x"]
    y=data["y"]
    width = data["width"]
    isDrawing = data["isDrawing"]
    emit("drawing", [x, y, width, isDrawing], broadcast = True)
    
if __name__  ==  '__main__':
    app.debug = True
    socketio.run(app, host="0.0.0.0", port=5000)
    app.secret_key="stuff"
    
