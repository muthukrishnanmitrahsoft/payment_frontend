import React, { createContext, useState } from 'react';

// Create a context
export const BookingContext = createContext();

// Create a provider component
export const BookingProvider = ({ children }) => {



    const [quantities, setQuantities] = useState({});

    const [totalAddCost,setTotalAddonCost] = useState(0)


    return (
        <BookingContext.Provider value={{ quantities, setQuantities,totalAddCost,setTotalAddonCost
            }}>
            {children}
        </BookingContext.Provider>
    );
};

