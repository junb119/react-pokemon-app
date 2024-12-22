import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage";

function App() {
  // useState를 통한 변수관리 : state가 변하면 다시 렌더링
  // ref를 통한 변수 관리: ref의 값이 변해도 렌더링 x 다만 다른 이유로 렌더링이 될 때(state에 의한 렌더링 등)는 한번에 업데이트 //
  // var, let, const 를 통한 변수 관리 : 다음 렌더링 때 초기화됨
  const [count, setCount] = useState(0);
  const countRef = useRef(0); // 변수관리
  let countVariable = 0;

  const [value, setValue] = useState("");
  const rendercountRef = useRef(0);
  // 종속성 배열이 없으면 어떤 state든 변경되면 useEffect가 실행
  useEffect(() => {
    rendercountRef.current++;
    // 렌더링 수 기록
  });

  const increaseRef = () => {
    countRef.current++;
    console.log("Ref + :", countRef.current);
  };
  const increaseState = () => {
    setCount((prev) => prev + 1);
    console.log("State + :", count);
  };
  const increaseVariable = () => {
    countVariable++;
    console.log("Variable + : ", countVariable);
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>Ref {countRef.current}</p>
        <p>State {count}</p>
        <p>Variable{countVariable}</p>
        <p>I rendered {rendercountRef.current} times</p>
        <input
          type="text"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value} // 렌더링 숫자 체크
        />
        <div>
          <button onClick={increaseRef}>Ref + </button>
          <button onClick={increaseState}>State + </button>
          <button onClick={increaseVariable}>Variable + </button>
        </div>
      </header>
    </div>
  );
}

export default App;
