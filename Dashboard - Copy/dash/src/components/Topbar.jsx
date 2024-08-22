import React from 'react'
import './Topbar.css'
import search from '../assets/search.png'
import { IoMdArrowDropdown } from "react-icons/io";

const Topbar = () => {
  return (
    <div className='main-top'>
      <div>
        <h1>
          Home
        </h1>

      </div>

      <div className='searchbar'>
        <input type="text" placeholder='Search' />
        <a href="#"><img style={{ width: "18px" }} src={search} alt="" /></a>
      </div>


      <div className='dropbutton'>
        <nav>
          <select className='dropdown'>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <span className='dropicon'><IoMdArrowDropdown /></span>

          {/* <ul>
                <li><a href="#">Home</a></li>
                <li></li>
            </ul> */}
        </nav>

        <div>
        

        </div>
        <div>
        

        </div>
        <div>
        
        

        </div>
      </div>
      


    </div>
  )
}


export default Topbar