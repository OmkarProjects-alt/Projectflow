import { useContext, createContext, useState, useEffect, Children } from "react";

const ErrorContext = createContext();

const ErrorContextProvider = ({ children }) => {

    const [messages, setMessage] = useState([])
    
     useEffect(() => {
        if(messages.length > 0) {
          setTimeout(() => {
            setMessage(prev => prev.slice(1));
          }, 5000);
        }
      }, [messages])
    
    const addMessage = (message, success = false) => {
        const messageObj = {
          message: message,
          timeStamp: new Date().toISOString(),
          id: Date.now() + Math.random(),
          success
        }
        setMessage(
            prev => [
                ...prev,
                messageObj
            ]
        );
        console.log(messages, "cheking my error")
    };

    const clearMessage = () => {
        setMessage([]);
    }

  return (
    <ErrorContext.Provider
      value={{
        clearMessage,
        addMessage,
        messages,
        setMessage
      }}
    >
      {children}
    </ErrorContext.Provider>
  )
}

export default ErrorContextProvider

export const useError = () => useContext(ErrorContext);