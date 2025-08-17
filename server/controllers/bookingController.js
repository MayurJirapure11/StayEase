import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js"
import stripe from "stripe";


//  Function to Check Availability of Room 
const checkAvailability = async ({checkInDate ,checkOutDate, room})=>{   // we will get get this parameters data from the API
    try {
        // Using this we will  get the bookings data.
        const bookings = await Booking.find({
            room,
            checkInDate:{$lte: checkOutDate},
            checkOutDate:{$gte: checkInDate},
        });
        const isAvailable = bookings.length === 0; //If it is true than the room is available and if it is false than the room is nott available
        return isAvailable ;
    } catch (error) {
        console.error(error.message);
        
    }

}

//Now we need to create the controller function which will listen to the API Call.


// API to check Avalibility of room

// - This API EndPoint will we using POST method
// Post /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res)=>{

    try {
        const {room, checkInDate , checkOutDate } = req.body ;
        const isAvailable = await checkAvailability({checkInDate , checkOutDate , room});
        res.json({success : true , isAvailable});
        
    } catch (error) {
        res.json({success : false , message : error.message});
        
    }

}


// Now we need to Create the Booking Function - This is a Controller Function

// API to create a new Booking

//  POST /api/bookings/book

export const createBooking = async (req,res)=>{
    try {
        
        const {room , checkInDate , checkOutDate ,guests} = req.body;
        const user = req.user._id ;

        // Before booking Check Availablity

        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room,
        })

        if(!isAvailable){
            return res.json({success : false , message : "Room is not Available"})
        }
        // Get Total Price For the Room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight; // This is the price for Per Night

        // Calculate total Price Based on Nights.
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)

        const timeDiff = checkOut.getTime() - checkIn.getTime() ;
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) ; // Number of nights
        totalPrice *= nights ;

        const booking = await Booking.create({
            user,
            room,
            hotel : roomData.hotel._id ,
            guests: +guests,        // by adding this Plus sign it will convert the number into the string 
            checkInDate,
            checkOutDate,
            totalPrice,

        }) // This are the new Data that will be Stored in the Data if we create a New Booking

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: 'Hotel Booking Details',
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thank you for your booking! Here are your details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Booking Amount:</strong>  ${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you need to make any changes, feel free to contact us.</p>
      `,
    };

        await transporter.sendMail(mailOptions);

        res.json({success : true , message: "Booking Created SuccessFully!"})

    } catch (error) {
        console.log(error);
        res.json({success : false , message: "Booking Failed!" }) ;
    }
    }


    
    // API to get all Bookings for a "User"

    // Creating a New Controller Function -- API End Point
    // GET /api/bookings/user 

    export const getUserBookings = async (req,res) => {
        try {
            const user = req.user._id ;
            const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
            res.json({success: true , bookings})
            
        } catch (error) {
               res.json({success: false , message: "Failed to Fetch Bookings"});
        }
    }


    // .populate()  -  The .populate() function is a method provided by Mongoose, which is an Object Data Modeling (ODM) library 
    //                 for MongoDB and Node.js. It's used to automatically replace the specified paths in a document with
    //                 documents from other collections.

 

    // Creating New API Endpoint to get Booking Details For a Particular "Hotel Owner"

    export const getHotelBookings = async (req, res) => {
       try {
         const hotel = await Hotel.findOne({owner: req.auth.userId});
        if(!hotel){
            return res.json({success: false , message:"No Hotel Found !"})
        }

            // Now if the Hotel is Available then we have to find the Bookings For the PArticular Hotel
            const bookings = await Booking.find({hotel : hotel._id}).populate("room hotel user").sort({createdAt: -1});
            // In this bookings we will get the compelete details of room hotel and user

            //Calculating the Total Number of Bookings
            // Total Bookings
            const totalBookings = bookings.length ;
 
            // Total Revenue
            const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice , 0)
            

            // Now Sending the Response
            res.json({success: true , dashboardData: {totalBookings , totalRevenue, bookings}})

       } catch (error) {
        res.json({success: false , message: "Failed to Fetch Bookings"})
        
       }
        

    }



    // Now using these Controller Functions we will create Different API EndPoints
    // So we will create different API Routes

export const stripePayment = async (req,res) => {
    try {
      const { bookingId } = req.body;

      const booking = await Booking.findById(bookingId);
      const roomData = await Room.findById(booking.room).populate("hotel");

      const totalPrice = booking.totalPrice;

      const { origin } = req.headers;

      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

      // Create Line Items for Stripe
      const line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: roomData.hotel.name,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ];

      // Create Checkout Session
      const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/loader/my-bookings`,
        cancel_url: `${origin}/my-bookings`,
        metadata: {
          bookingId,
        },
      });
      res.json({ success: true, url: session.url });
    }catch(error){
        res.json({ success: false, message: "Payment Failed" });
    }
}