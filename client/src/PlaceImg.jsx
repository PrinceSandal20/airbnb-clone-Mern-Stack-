import React from 'react'

export default function PlaceImg({place,index=0,className=null}) {
  if(!place.photos?.length){
    return "";
  }
  if(!className){
    className = "object-cover";
  }
  return (
        <img className={className}
        src={place.photos?.[index].startsWith("uploads\\") ? `http://localhost:4000/${place.photos?.[index]}` : `http://localhost:4000/uploads/${place.photos?.[index]}`}
        alt='' />
  )
}
