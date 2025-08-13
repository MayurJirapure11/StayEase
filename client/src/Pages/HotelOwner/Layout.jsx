import React, { useEffect } from 'react'
import Navbar from '../../components/HotelOwner/Navbar'
import Sidebar from '../../components/HotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
    // The DashBoard Should only be visible to user who is owner otherwise he'll be redirected to home page .
    const {isOwner, navigate} = useAppContext()

    useEffect( ()=>{
      if(!isOwner){  // When User is not Owner
        navigate('/')  //Navigate to Home.
      }
    }, [isOwner] )
    
  return (
    <div className='flex flex-col h-screen'>
        <Navbar/>
        <div className='flex h-full'>
            <Sidebar/>
            <div className='flex-1 p-4 md:px-10 h-full'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Layout