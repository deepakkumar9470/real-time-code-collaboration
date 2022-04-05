import React,{useState,useEffect,useRef} from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import {Navigate, useLocation,useNavigate,useParams} from 'react-router-dom'
import {initSocket} from '../socket'
import toast from 'react-hot-toast'


const EditorPage = () => {
  const socketRef = useRef(null) 
  const codeRef = useRef(null) 
  const location = useLocation()
  const {roomId} = useParams()
  const reactNavigate = useNavigate()

  console.log(location) 
  
  const [clients,setClients] = useState([]);

  useEffect(() => {

    const init = async () =>{
         socketRef.current  = await initSocket()
         socketRef.current.on('connect_error', (err)=> handleError(err))
         socketRef.current.on('connect_failed', (err)=> handleError(err))
         
         function handleError(e){
           console.log('Socket error', e)
           toast.error('Socket connection failed pls try again')
           reactNavigate('/')
         }

         socketRef.current.emit('join', {
           roomId,
           username : location.state?.username
         });
        

         // Listening to joined users events
         socketRef.current.on('joined',({clients,username,socketId})=>{

                if(username !== location.state?.username){
                  toast.success(`${username} joined the room`)
                }

                setClients(clients)

                socketRef.current.emit('sync-code', {
                  code : codeRef.current,
                  socketId
                });
          });


         // Listening disconnected users
         socketRef.current.on('disconnected', ({socketId, username}) =>{
                 toast.success(`${username} left the room`)

                 setClients((prev) => {
                   return prev.filter((client) => client.socketId !== socketId)
                 });
         })
    }

    init()

    return () => {
      // socketRef.current.disconnect()
      socketRef.current.off('joined')
      socketRef.current.off('disconnected')
      socketRef.current.disconnect()

    }
   
  }, [])
  
  const copyRoomID =  async ()=>{
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success('RoomId has been copied to your clipboard')
      
    } catch (error) {
          
      toast.error("couldn't copy roomId")

    }
  }

  const leaveRoom = () =>{
        reactNavigate('/')
        toast.success('Leaved room')
  };

  if(!location.state){
   return  <Navigate to="/"/>
  }
    
  return (
    <div className='mainWrap'>
   
        <div className="aside">

          <div className="asideInner">

            <div className="logo">
            <img className='editorlogo' src="/collaboration.png" alt="collab" />
              <div className="logoInner">

                 <p className='l'>d-Sync</p>
                 <span>REAL TIME COLLABORATION</span>
              </div>
              
            </div>
            
            <h3 className='connText'>Connected Users:</h3>

            <div className="clientslist">
                   {clients.map((c)=> (
                     <Client key={c.socketId} username={c.username}/>
                   ))}
            </div>
          </div>

          <button className='btn copyBtn' onClick={copyRoomID}>Copy Room ID</button>
          <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
        </div>


         <div className="editorWrap">
             <Editor roomId={roomId} socketRef={socketRef} onCodeChange={(code)=>{codeRef.current = code} } />
         </div>

    </div>
  )
}

export default EditorPage