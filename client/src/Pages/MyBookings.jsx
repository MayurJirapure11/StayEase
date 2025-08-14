import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { assets, userBookingsDummyData } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

   useEffect(() => {
      if (user) {
        fetchUserBookings();
      }
   }, [user]);

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 lg:px-24 xl:px-32'>
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks."
        align="left"
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid grid-cols-[3fr_2fr_1fr] border-b border-gray-300 font-medium text-base py-3'>
          <div>Hotels</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] gap-4 border-b border-gray-300 py-6'
          >
            {/* Hotel Details */}
            <div className='flex flex-col md:flex-row'>
              <img
                src={booking.room.images[0]}
                alt='hotel'
                className='w-full md:w-44 h-32 object-cover rounded shadow'
              />
              <div className='flex flex-col gap-1.5 mt-3 md:mt-0 md:ml-4'>
                <p className='font-polyfair text-xl'>
                  {booking.hotel.name}{' '}
                  <span className='text-sm font-inter text-gray-600'>
                    ({booking.room.roomType})
                  </span>
                </p>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <img src={assets.locationIcon} alt='location' />
                  <span>{booking.hotel.address}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <img src={assets.guestsIcon} alt='guests' />
                  <span>{booking.guests} Guests</span>
                </div>
                <p className='text-base font-medium'>Total: ₹{booking.totalPrice}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className='flex flex-col justify-center gap-2 text-sm text-gray-600'>
              <div>
                <p className='font-medium text-black'>Check-In:</p>
                <p>{new Date(booking.checkInDate).toDateString()}</p>
              </div>
              <div>
                <p className='font-medium text-black'>Check-Out:</p>
                <p>{new Date(booking.checkOutDate).toDateString()}</p>
              </div>
            </div>

            {/* Payment Section */}
            <div className='flex flex-col justify-center gap-3'>
              <div className='flex items-center gap-2'>
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    booking.isPaid ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {booking.isPaid ? 'Paid' : 'Unpaid'}
                </p>
              </div>

              {!booking.isPaid && (
                <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-400 transition-all cursor-pointer'>
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;