"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInformation = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const API_KEY = "108f24fa83b24501b69581b9f4e1903f";

      try {
        // Fetch IP address
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        const ip = ipResponse.data.ip;

        // Fetch more details using the IP address
        const detailsResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        setUserInfo(detailsResponse.data);

        // Fetch Location using the Latitude & Longitude
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${detailsResponse.data.latitude}+${detailsResponse.data.longitude}&key=${API_KEY}`
          );
          setLocation(response.data.results[0]);
          console.log(response.data.results[0]);
        } catch (error) {
          console.error("Error fetching location information:", error);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      {userInfo ? (
        <div>
          <p>IP Address: {userInfo.ip}</p>
          <p>IP Version: {userInfo.version}</p>
          <p>ISP: {userInfo.org}</p>
          <p>Country: {userInfo.country_name}</p>
          <p>Country Capital: {userInfo.country_capital}</p>
          <p>Country Code: {userInfo.country_code}</p>
          <p>Country Area: {userInfo.country_area}</p>
          <p>Country Population: {userInfo.country_population}</p>
          <p>Country Calling Code: {userInfo.country_calling_code}</p>
          <p>Country TLD: {userInfo.country_tld}</p>
          <p>Country Currency: {userInfo.currency}</p>
          <p>Country Currency Name: {userInfo.currency_name}</p>
          <p>Country Languages: {userInfo.languages}</p>
          <p>Continent Code: {userInfo.continent_code}</p>
          <p>Region: {userInfo.region}</p>
          <p>Region Code: {userInfo.region_code}</p>
          <p>City: {userInfo.city}</p>
          <p>Latitude: {userInfo.latitude}</p>
          <p>Longitude: {userInfo.longitude}</p>
          <p>Network IP: {userInfo.network}</p>
          <p>Time Zone: {userInfo.timezone}</p>
          <p>UTC Offset: {userInfo.utc_offset}</p>
          <p>Postal Code: {userInfo.postal}</p>
          <p>ASN: {userInfo.asn}</p>
          <p>Organization: {userInfo.org}</p>
          <br />
          <p>Location: {location?.formatted}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserInformation;
