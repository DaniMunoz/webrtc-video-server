const express = require('express');
const cors = require('cors');

const app = express();

const server = require('http').Server(app)

const { v4: uuidV4} = require('uuid')

//var morgan = require('morgan')
//app.use(morgan('combined'))

app.use(express.static('public'))

app.use(cors());
var corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:8000', 'https://webrtc-video-client.vercel.app/'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8000', 'https://webrtc-video-client.vercel.app/'],
        /*
        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST",
                //"Access-Control-Allow-Headers": "my-custom-header",
                //"Access-Control-Allow-Credentials": true,
            })
        }
        */
    }
});

app.use(express.json());

app.get('/message', cors(corsOptions), (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get('/room', cors(corsOptions), (req, res) => {
    //res.redirect(`/room/${uuidV4()}`)
    const room = uuidV4();
    res.json({ room: room });
})

app.get('/room/:room', cors(corsOptions), (req, res) => {
    //res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});