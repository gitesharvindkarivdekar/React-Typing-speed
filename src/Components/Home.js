import React from 'react'
import '../App.css'

function Home({onGame}) {
    //The onGame we are sending as a props from App.js
  return (
    <>
    <div className="home">
        <div className="title">
            Typing Game
        </div>
        <div className="author">
            Coding & <br />
            Design by<b> Gitesh Karivdekar</b> 
        </div>
        <button className='btnPlay' 
        onClick={()=>{
            onGame('playgame')
            //so here we have taken as prop and we are going to use it for changing the page when it is click on the button

        }}>
            Play Game
        </button>
    </div>
    </>
  )
}

export default Home
