import { useEffect } from "react";
import { createContext, useState } from "react";
export const InvoilaContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
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
// whenever currentUser changes → update currency
  useEffect(() => {
    if (currentUser?.currency) {
      setCurrency(currentUser.currency);
    }
  }, [currentUser]);

  const currencySymbol = currencySymbols[currency] || "$";


  return (
    <InvoilaContext.Provider
      value={{
        currentUser,
        setCurrentUser,
         currency,
        currencySymbol
      }}
    >
      {props.children}
    </InvoilaContext.Provider>
  );
};

export default InvoilaContextProvider;
