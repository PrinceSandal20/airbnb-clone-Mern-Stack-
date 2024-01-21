import React, { useContext, useEffect, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';


export default function BookingWidget({place}) {
  const [checkIn,setCheckIn] = useState("");
  const [checkOut,setCheckOut] = useState("");
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState("");
  const [phone,setphone] = useState("");
  const [redirect,setRedirect] = useState("");
  const {user} = useContext(UserContext);

  useEffect(()=>{
    if(user){
        setName(user.name);
    }
  },[user]);

  let numberOfNights = 0;
  if(checkIn && checkOut){
    numberOfNights = differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
  }

 async function bookThisPlace(){
    const response = await axios.post("/bookings",{
        checkIn,checkOut,numberOfGuests,
        name,phone,
        place:place._id,
        price:numberOfNights*place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

 if(redirect){
    return <Navigate to={redirect}/>
 }

  return (
    <div className='bg-white shadow p-4 rounded-2xl'>
        <div className='text-2xl text-center'>
        Price: ${place.price}/per night
        </div>
        <div className='border rounded-2xl mt-4'>
            <div className='flex'>
            <div className='py-3 px-4'>
                <lable>Check in:</lable>
                <input 
                value={checkIn}
                onChange={event=>setCheckIn(event.target.value)}
                type='date'/>
            </div>
            <div className='py-3 px-4 border-l'>
                <lable>Check out:</lable>
                <input 
                value={checkOut}
                onChange={event=>setCheckOut(event.target.value)}
                type='date'/>
            </div>
            </div>
            <div className='py-3 px-4 border-t'>
                <lable> Number of guests:</lable>
                <input
                value={numberOfGuests}
                onChange={event=>setNumberOfGuests(event.target.value)}
                 type='number'/>
            </div>
            {numberOfNights > 0 && (
                <div className='py-3 px-4 border-t'>
                <lable>Your full name:</lable>
                <input
                value={name}
                onChange={event=>setName(event.target.value)}
                 type='text'/>
                 <lable>Phone number:</lable>
                <input
                value={phone}
                onChange={event=>setphone(event.target.value)}
                 type='tel'/>
            </div>
            )}
        </div>
        <button onClick={bookThisPlace} className='primary mt-4'>
            Book This Place.
            {numberOfNights > 0 && (
                <span> ${numberOfNights*place.price}</span>
            )}
            </button>
    </div>
  )
}
