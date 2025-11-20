import React from "react";
import "./Message.css";

export default function Message({ type = "success", text }) {
  return (
    <div className={`msg msg-${type}`}>
      {text}
    </div>
  );
}
