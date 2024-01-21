import React, { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
import {Navigate, useParams } from 'react-router-dom'
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';

export default function ProfilePage() {
  const [redirect,setRedirect] = useState(null);
  const  {ready,user,setUser} = useContext(UserContext);

  let {subpage} = useParams();
  if(subpage === undefined){
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout')
    setRedirect("/");
    setUser(null);
  }

  if(!ready){
    return "Loading.....";
  }
  if(ready &&!user && !redirect){
    return <Navigate to={'/login'} />
  }

  
  if(redirect){
    return <Navigate to={redirect}/>
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
          <div className='text-center max-w-lg mx-auto'>
            <div className="mt-4 grow flex items-center justify-around">
        <div className="bg-gray-200 py-12 px-12 rounded shadow-md mb-64">
          <h1 className="text-xl font-bold mb-4">My Profile Page</h1>
          <div className="flex items-center space-x-4">
            <div className='ml-10 px-12'>
              <p className="text-xl text-gray-800 font-bold">{user.name}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-800">
              <span className="font-bold">Logged in as {user.name} ({user.email})<br/></span>
            </p>
          </div> 
          <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
        </div>
      </div>
        </div>
      )}
      {subpage === "places" && (
        <PlacesPage/>
      )}
    </div>
  )
}


