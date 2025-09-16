import { createContext, useState, useEffect } from "react";
import { retryRunChat } from "../config/gemini";   // import retry wrapper

export const Context = createContext();

const ContextProvider = (props) => {
  const [message, setMessage] = useState("");

  const onSent = async (prompt) => {
    try {
      const result = await retryRunChat(prompt);  // use retry instead
      setMessage(result);
      console.log("AI Response:", result);
    } catch (err) {
      console.error("Error in onSent:", err);
    }
  };

  useEffect(() => {
    onSent("What is React JS?");
  }, []);

  const contextValue = {
    message,
    onSent,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
