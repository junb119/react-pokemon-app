import React, { forwardRef } from "react";

// 방법 1
// ref는 props로 내려줄 수 없음
// forwardRef로 자녀 컴포넌트를 감싸서 가져올 수 있음.

// const ChildComponent = (props, ref) => {
//   return (
//     <div>
//       <input type="text" ref={ref} />
//     </div>
//   );
// };

// export default forwardRef(ChildComponent);

// 방법 2
// ref가 아니라 props를 사용해서 내려줌
// forwardRef로 자녀 컴포넌트를 감싸서 가져올 수 있음.
const ChildComponent = ({ notRef }) => {
  return (
    <div>
      <input type="text" ref={notRef} />
    </div>
  );
};

export default ChildComponent;
