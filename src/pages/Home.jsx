import React,{useState} from 'react'

import {v4 as uuidV4} from 'uuid'
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'



const Home = () => {
    const navigate = useNavigate();
    const [roomid, setRoomId] =  useState('')
    const [username, setUserName] =  useState('')


    const createNewRoom = (e) =>{
        e.preventDefault()
        const id = uuidV4()
        setRoomId(id)
        toast.success('Created a new room!')
       
    };

    const joinRoom = () =>{
     if(!roomid || !username){
         toast.error('Room Id & username is require!')
         return;
     }

     navigate(`/editor/${roomid}`, {
         state : { username }
     });

    };
   
    const handleEnter = (e) =>{
        if(e.code === 'Enter'){
            joinRoom()
        }
    };
    
  return (
    <div className='homeWrapper'>  

            <div className="formWrapper">
                  <img src="/collaboration.png" alt="collaboration" /> 

                   <h4 className='mainLabel'>Paste invitation ROOM ID</h4>

                  <div className="inputGroups">

                      <input 
                         type="text" 
                         className="inputBox"
                         value={roomid}
                         onChange={(e)=>setRoomId(e.target.value)}  
                         onKeyUp={handleEnter}
                         placeholder="ROOM ID"/>
                      <input 
                         type="text" 
                         className="inputBox"
                         value={username}
                         onChange={(e)=>setUserName(e.target.value)} 
                         onKeyUp={handleEnter}
                         placeholder="USERNAME"/>

                      <button 
                         className='btn joinBtn'
                         onClick={joinRoom}
                         >
                        JOIN</button>

                      <span className='createInfo'>
                        If you aren't join please join &nbsp;

                        <a onClick={createNewRoom} href="#" className="createnewBtn">new one</a>

                     </span>
                  </div>

                 

            </div>


            <footer>
                <h4>Built with lots of love &copy; 2022 &nbsp;
                    <a href="https://www.youtube.com/channel/UCa43_dm1_WetX7nGq11KMSw" 
                        target="_blank" rel="noreferrer">Deepak TV</a>
                </h4>
            </footer>

    </div>
  )
}

export default Home