import { createContext, useContext, useState } from "react";

const MainContext = createContext(null);

const MainContextProvider = ({ children }) => {
  const [data, setData] = useState(null);

  return (
    <MainContext.Provider value={{ data, setData }}>
      {children}
    </MainContext.Provider>
  );
};

const MainContextConsumer = ({ children }) => {
  return (
    <MainContext.Consumer>
      {context => {
        if (undefined === context) {
          throw new Error("Context must be initialized within a provider.");
        }

        return children(context);
      }}
    </MainContext.Consumer>
  );
};

const useMainContext = () => {
  const context = useContext(MainContext);

  if (undefined === context) {
    throw new Error("Context must be initialized within a provider.");
  }

  return context;
};

export {
  MainContextProvider,
  MainContextConsumer,
  useMainContext,
};
