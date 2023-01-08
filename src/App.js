import React from 'react'
import './App.css';

import { Toaster } from 'react-hot-toast';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';

function App() {


  return (
    
        <> 
            <div>
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  success : {
                    theme: {
                      primary : '#4aee88',
                    },
                  },
                }}
                />
            </div>
             <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/editor/:roomId' element={<EditorPage/>}/>
                </Routes>
              
              </BrowserRouter>

        </>
  );
}

export default App;
