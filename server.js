require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
app.use(cors())
app.use(express.json())

app.use(express.static('build'))
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname , 'build', 'index.html'))
})

const userSocketMap = {};


function getAllConnectedClients(roomId){

   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username : userSocketMap[socketId]
        }
    })
};


io.on('connection', (socket)=>{

      console.log('Frontend connected', socket.id)


      socket.on('join', ({roomId, username})=>{
             userSocketMap[socket.id] = username;
             socket.join(roomId)

             const clients = getAllConnectedClients(roomId)
             console.log(clients)

             clients.forEach(({socketId})=>{

                io.to(socketId).emit('joined',{
                    clients,
                    username,
                    socketId: socket.id
                })
             })
      });


      socket.on('code-change', ({roomId, code})=>{
           socket.in(roomId).emit('code-change', {code})
      });

      socket.on('sync-code', ({socketId, code})=>{
        io.to(socketId).emit('code-change', {code})
      });


      socket.on('disconnecting', () =>{
          const rooms = [...socket.rooms];
          rooms.forEach((roomId)=>{
              socket.in(roomId).emit('disconnected',{
                  socketId : socket.id,
                  username : userSocketMap[socket.id]
              });
          });

          delete userSocketMap[socket.id]
          socket.leave()
      });

});

app.get('/', (req,res)=>{
    res.send('hello coolab..')
})

server.listen(5000, ()=>{
    console.log(`Server started at port ${PORT}`)
})




