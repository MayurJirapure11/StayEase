import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30'>
      <Title 
        title="What Our Guests Say" 
        subTitle='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam rerum sunt pariatur repellat ut magni eius error tenetur laboriosam? Autem.' 
      />

      {/* Changed layout here 👇 */}
      <div className="flex gap-6 mt-20 overflow-x-auto no-scrollbar">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white p-6 rounded-xl w-[300px] sm:w-[350px] flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <img 
                className="w-12 h-12 rounded-full" 
                src={testimonial.image} 
                alt={testimonial.name} 
              />
              <div>
                <p className="font-playfair text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.address}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mt-4">
              <StarRating />
            </div>

            <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial