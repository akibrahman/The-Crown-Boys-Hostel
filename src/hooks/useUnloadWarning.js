import { useEffect } from "react";

const useUnloadWarning = (message) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      if (message) {
        event.returnValue = message;
      }
      event.returnValue = "Msg";
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message]);
};

export default useUnloadWarning;
