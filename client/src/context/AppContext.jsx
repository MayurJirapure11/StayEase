import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);

  const [searchedCities, setSearchedCities] = useState([]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      // Now we'll Check This Data
      if (data.success) {
        setIsOwner(data.role === "hotelOwner"); //Checking the Role
        setSearchedCities(data.recentSearchedCities); // We are getting the data Through the API
      } else {
        // Retry fetching User Details after 5 sec.
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }

  };
  
   useEffect(() => {
      if (user) {
        fetchUser(); //Function Calling - Above created function is called here
        // after this func. call we get the details about user ,like setSearchedCities, setIsOwner
      }
    }, [user]); // Here the array is k/a Dependency Array

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
  };

  return (<AppContext.Provider value={value}>{children}</AppContext.Provider>);
};

export const useAppContext = () => useContext(AppContext);
