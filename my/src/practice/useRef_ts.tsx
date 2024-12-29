import React, { useRef } from "react";

const useRef_ts = () => {
  // 매개변수의 타입과 제네릭의 타입이 일치하는 경우(0은 넘버타임)
  // MutableRefObject 반환 => 직접 수정 가능
  const localVarRef = useRef<number>(0);
  const handleClick = () => {
    localVarRef.current += 1;
    console.log(localVarRef.current);
  };
  // 매개변수의 타입과 제네릭의 타입이 일치하지 않는 경우(null !== number)
  // RefObject 반환(읽기전용) => 직접 수정 불가능
  const localVarRef2 = useRef<number>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick3 = () => {
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleClick3}>claer</button>
      {/* <button onClick={handleClick}>+1</button> */}
    </div>
  );
};

export default useRef_ts;
