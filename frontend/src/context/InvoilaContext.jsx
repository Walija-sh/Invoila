import { useEffect } from "react";
import { createContext, useState } from "react";
export const InvoilaContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
  token: null,
  setToken: () => {},
  currency: "usd",
  currencySymbol: "$"
});

const currencySymbols = {
  usd: "$",
  eur: "€",
  gbp: "£",
  pkr: "₨"
};

const InvoilaContextProvider = (props) => {

const [currentUser, setCurrentUser] = useState(null);
const [currency, setCurrency] = useState("usd");
const [token, setToken] = useState(null);
// whenever currentUser changes → update currency
  useEffect(() => {
    if (currentUser?.currency) {
      setCurrency(currentUser.currency);
    }
  }, [currentUser]);

   useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);


  const currencySymbol = currencySymbols[currency] || "$";


  return (
    <InvoilaContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        token,setToken,
         currency,
        currencySymbol
      }}
    >
      {props.children}
    </InvoilaContext.Provider>
  );
};

export default InvoilaContextProvider;
