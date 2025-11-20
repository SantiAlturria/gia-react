import { useState } from "react";

export function useMessage() {
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage(null);
    }, 2500);
  };

  return { message, showMessage };
}
