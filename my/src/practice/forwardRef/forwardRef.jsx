import React, { useRef } from "react";
import ChildComponent from "./ChildComponent";

const forwardRef = () => {
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.focus();
  };
  return (
    <>
      <ChildComponent notRef={inputRef} />
      <button onClick={handleClick}>클릭</button>
    </>
  );
};

export default forwardRef;
