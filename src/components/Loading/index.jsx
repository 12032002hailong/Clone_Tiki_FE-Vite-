import React from "react";
import { HashLoader } from "react-spinners";

const Loading = () => {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };

  return (
    <div style={style}>
      <HashLoader color="#36d7d7" />
    </div>
  );
};

export default Loading;
