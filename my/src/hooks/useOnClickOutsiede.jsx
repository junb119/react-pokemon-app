import { useEffect } from "react";

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listner = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return; // 모달안 클릭시 그냥 리턴
      handler(event); // 모달 밖 클릭시 모달 닫기
    };
    document.addEventListener("mousedown", listner);
    document.addEventListener("touchstart", listner);

    return () => {
      document.removeEventListener("mousedown", listner);
      document.removeEventListener("touchstart", listner);
    };
  }, [ref, handler]);
}
