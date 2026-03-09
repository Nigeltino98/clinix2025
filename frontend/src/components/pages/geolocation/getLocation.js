import React, { useState, useEffect } from "react";

const UserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Use the Geolocation API to get the user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  return (
    <div>
      <h2>User Location</h2>
      {userLocation ? (
        <div>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      ) : (
        <p>Loading user location...</p>
      )}
    </div>
  );
};

export default UserLocation;
