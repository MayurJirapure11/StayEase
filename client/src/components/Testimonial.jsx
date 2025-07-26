import React from 'react'
import Title from './Title'
import {testimonials} from '../assets/assets'
import StarRating from './StarRating'

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30'>
        <Title title="What Our Guests Say" subTitle='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam rerum sunt pariatur repellat ut magni eius error tenetur laboriosam? Autem.'/>

         <div className="flex flex-wrap items-center gap-6 mt-20 justify-center">
            {/* Problem here👆🏻 in adjusting all reviews in a single row. tried justify-center but its not working. */}

            {/* Mapping the Testimonial Data into the Website👇🏻 */}
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-xl w-full sm:w-[300px] md:w-[350px]">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>

                       {/* For Mounting Star Rating Component 👇🏻 */}

                        <div className="flex items-center gap-1 mt-4">
                            <StarRating/>
                           
                        </div>


                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>



     </div>
  )
}

export default Testimonial
