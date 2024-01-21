import React from 'react';

export default function MyProfilePage() {
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="bg-gray-200 py-12 px-12 rounded shadow-md mb-64">
        <h1 className="text-xl font-bold mb-4">My Profile Page</h1>
        
        {/* Your profile information goes here */}
        <div className="flex items-center space-x-4">
          <img
            src="https://placekitten.com/80/80" // Replace with your profile image URL
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm text-gray-800">Your Name</p>
            <p className="text-sm text-gray-500">Your Bio or Description</p>
          </div>
        </div>

        {/* Additional profile details */}
        <div className="mt-6">
          {/* Add more details as needed */}
          <p className="text-sm text-gray-800">
            <span className="font-bold">Email:</span> your.email@example.com
          </p>
          <p className="text-sm text-gray-800">
            <span className="font-bold">Location:</span> City, Country
          </p>
          {/* Add more details as needed */}
        </div> 

        {/* Edit Profile Button */}
        <button className="text-sm mt-8 bg-blue-500 text-white px-12 py-2 mr-2 rounded-2xl primary">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
