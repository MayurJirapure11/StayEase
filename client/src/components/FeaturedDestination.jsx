import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'


const FeaturedDestination = () => {
  const {rooms,navigate} = useAppContext();

  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-15 bg-slate-50 py-20'> 
        <Title title='Featured Destination' subTitle=' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio, consequatur. Voluptatibus, fuga ipsa, ducimus optio expedita, veritatis atque error possimus commodi ex obcaecati!'/>

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      {/* Adding here ScrollTo(0,0) So it can scroll the webpage to the Top. */}
      <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}}
      className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        
        View All Destinations

      </button>
    </div>
  )
}

export default FeaturedDestination