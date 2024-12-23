import React, { useState } from "react";
import NotUsePortal_Modal from "./notUsePortal_Modal";
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
const NotUsePortal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div style={modalWrapperStyle}>
        <button onClick={() => setIsModalOpen(true)}>모달 열기</button>
        {/* 모달 */}
        <NotUsePortal_Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          모달 내용
        </NotUsePortal_Modal>
      </div>
      <div style={higherIndexWrapperStyle}>Z-Index 2</div>
      {/* modal의 z-index는 1000이고 위 div의 z-index는 2이니까 모달이 활성화 되면 div는 modal에 가려져야한다. 
          하지만 modal의 부모 요소의 z-index가 1이므로 modal의 z-index를 아무리 높여줘도 z-index가 2인 요소를 가릴수가 없다.
          이렇듯 modal 구조가 복잡하게 될수록 z-index 등의 영향으로 원하는 모달 스타일을 구현하기 힘들 수 있다. 이럴 때 React Portal을 사용해 모달을 생성하면 편하게 구현 가능 
      */}
    </>
  );
};

export default NotUsePortal;
