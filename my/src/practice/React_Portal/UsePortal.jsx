import React, { useState } from "react";
import NotUsePortal_Modal from "./notUsePortal_Modal";
import UsePortal_Modal from "./UsePortal_Modal";
const modalWrapperStyle = {
  position: "relative",
  zIndex: 1,
};
const higherIndexWrapperStyle = {
  position: "relative",
  zIndex: 2,
  backgroundColor: "blue",
  padding: "10px",
};
const UsePortal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div style={modalWrapperStyle}>
        <button onClick={() => setIsModalOpen(true)}>모달 열기</button>
        {/* 모달 */}
        <UsePortal_Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          모달 내용
        </UsePortal_Modal>
      </div>
      <div style={higherIndexWrapperStyle}>Z-Index 2</div>
      {/* root 바깥에 portal을 띄울 요소를 생성하고 그곳에 portal을 이용해 모달을 만들면 모달의 구조와 상관없이 사용가능
       
       이벤트 버블링 가능. 부모 dom트리밖에 portal을 생성하지만 react 트리 안에는 존재하기 때문에 상위요소로 이벤트 버블링이 가능함
       */}
    </>
  );
};

export default UsePortal;
