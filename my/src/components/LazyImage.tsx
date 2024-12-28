import { useState, useEffect } from "react";
interface LazyImageProps {
  url: string;
  alt: string;
}
const LazyImage = ({ url, alt }: LazyImageProps) => {
  const [isLoading, setisLoading] = useState<boolean>(true); // isLoading 상태에 따라 로딩이미지 보이기
  const [opacity, setOpacity] = useState<string>("opacity-0");

  useEffect(() => {
    isLoading ? setOpacity("opacity-0") : setOpacity("opacity-100");
    // isLoading의 boolean값에 따라 보일 이미지의 opacity 조정
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="absolute h-full z-10 w-full flex items-center justify-center">
          ...loading
        </div>
      )}
      <img
        src={url}
        alt={alt}
        width="100%"
        height="auto"
        loading="lazy"
        onLoad={() => setisLoading(false)}
        // 이미지 로딩이 완료되면 isLoading를 false로 바꿔서 로딩애니메이션 렌더링 하지 않음
        className={`object-contain h-full ${opacity}`}
      />
    </>
  );
};

export default LazyImage;
