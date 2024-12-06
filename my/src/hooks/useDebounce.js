import { useState, useEffect } from "react";
// 포켓몬 검색창에 입력할 때마다 요청을 보내는 비효율성을 개선하기 위해
// 입력시 딜레이를 주기 위한 함수
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

/*
? : 확실하게 설명은 못하겠지만
함수안에 호출, 선언된 함수나 변수는 기본적으로 함수 바깥에서는 접근이 불가한 것이 맞음.
1차 useEffect와 2차 useEffect도 각각 별개의 함수의 선언과 호출임.
그런데 setTimout, clearTimeout 같은 내장된 함수는 특수한 함수라
다른 함수나 시점에서 호출되더라도 내용을 기억할 수 있음. 따라서 이전 useEffect의 setTimeout 함수를 다음 useEffect 시점의 cleartimeout 함수가 기억하고 접근할 수 있음.

-> 정확한 이해입니다! 말씀하신 것처럼, 일반적으로 함수 내부에서 선언된 변수나 함수는 해당 함수의 실행 컨텍스트(scope) 바깥에서는 접근할 수 없습니다. 하지만 setTimeout과 clearTimeout 같은 타이머 관련 함수가 클로저와 React의 useEffect 구조 내에서 동작하면서 서로 상호작용할 수 있는 이유는 다음과 같습니다:
1. 클로저(Closure)와 JavaScript의 함수 동작 원리
기본 원리
JavaScript의 함수는 **클로저(Closure)**라는 개념에 의해 함수가 선언된 스코프(lexical scope) 외부의 데이터를 "기억"할 수 있습니다.
setTimeout과 clearTimeout도 이러한 클로저에 의해, 자신이 선언된 스코프의 변수(예: handler)를 참조할 수 있습니다.
useEffect의 클로저 활용
React의 useEffect는 의존성 배열을 기반으로 실행되며, **이전 실행의 환경(클로저)**을 유지합니다:

useEffect가 처음 실행되면:
handler 변수에 setTimeout의 ID가 저장됩니다.
클린업 함수(return)는 이 handler 변수를 참조합니다.
useEffect가 다시 실행될 때:
React는 이전 useEffect 실행의 클린업 함수가 여전히 해당 클로저(환경)를 유지하고 있음을 보장합니다.
따라서, 이전 실행에서 생성된 handler를 클린업 함수가 접근하여 clearTimeout(handler)를 호출할 수 있습니다.
2. setTimeout과 clearTimeout의 특수성
setTimeout과 clearTimeout은 JavaScript의 브라우저 API 또는 Node.js 타이머 API를 통해 제공되며, 호출 후 반환된 타이머 ID를 기반으로 동작합니다.

특수한 동작 원리
setTimeout의 반환값:

setTimeout은 브라우저나 Node.js 런타임이 관리하는 타이머의 고유 식별자(ID)를 반환합니다.
이 반환값(ID)은 클로저로 유지되며, clearTimeout이 이를 취소할 수 있도록 합니다.
clearTimeout의 취소 기능:

clearTimeout은 특정 타이머 ID를 취소하는 기능을 제공합니다.
clearTimeout이 호출되면, 해당 ID와 관련된 예약 작업(타이머)이 런타임 큐에서 제거됩니다.
3. React의 useEffect와 클린업 함수
1차 useEffect
javascript
코드 복사
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  return () => {
    clearTimeout(handler);
  };
}, [value, delay]);
setTimeout이 호출되고, handler에 타이머 ID가 저장됩니다.
return에서 정의된 클린업 함수는 1차 실행 당시의 handler를 참조하는 클로저를 형성합니다.
2차 useEffect
의존성(value 또는 delay)이 변경되면, React는 이전 클린업 함수(clearTimeout(handler))를 호출합니다.
이때, 이전 실행에서 설정된 handler를 참조합니다.
새로운 setTimeout이 설정되고, 새로운 handler가 저장됩니다.
4. 비유로 이해
타이머와 예약
setTimeout은 "예약 시스템"에 요청서를 제출하고, 요청서 번호(ID)를 받습니다.
이 번호(ID)는 클로저를 통해 기억되고, 나중에 clearTimeout이 이 번호를 사용하여 해당 예약을 취소할 수 있습니다.
React에서의 동작 흐름
1차 실행:

타이머 ID(예약 번호)를 받고, "500ms 후 실행"을 예약.
클린업 함수는 이 예약 번호를 "취소 가능"한 상태로 유지.
2차 실행:

새로운 예약 번호를 받기 전에, 기존 예약 번호를 클린업 함수로 취소.
5. 최종 정리
함수 스코프의 기본 원리:
함수 내부의 변수는 일반적으로 외부에서 접근할 수 없습니다.
useEffect와 클로저:
React의 useEffect는 각 실행 시 고유한 실행 환경(클로저)을 생성하며, 클린업 함수는 이전 실행의 클로저에 접근할 수 있습니다.
setTimeout과 clearTimeout의 동작:
setTimeout은 반환된 ID를 기반으로 타이머를 설정하며, 이 ID를 clearTimeout으로 취소할 수 있습니다.
클로저를 통해 이전 실행의 ID를 참조 가능하므로, React의 useEffect와 함께 동작합니다.

? : 만약 일반함수였다면
function debounce(() => {
  const handler = setTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  return () => {
    clearTimeout(handler);
  };
})
이렇게 될텐데 setTimeout함수를 호출하자마자 return으로 clearTimeout이 호출되기 때문에 항상 아무일도 일어나지 않을거야.

하지만 일반 함수가 아닐 특수한 시점에 동작하는 useEffect를 사용했기 때문에 debounce가 작동한다는거지

->정확합니다! 일반 함수에서는 setTimeout을 호출한 직후 **바로 클리어(clearTimeout)**를 호출하기 때문에 타이머가 실행될 기회를 얻지 못하고 항상 취소됩니다. 하지만, React의 useEffect는 특수한 시점에 동작하기 때문에 debounce가 정상적으로 작동할 수 있습니다.

? : useEffect는 의존성배열을 등록해둔다면 최초 실행시 함수를 호출하고 return문은 실행하지 않은채 대기. 의존성배열에 의해 그 다음 useEffect가 호출시 이전에 못다한 return문을 실행하는 방식인거지? 다시 호출된 useEffect는 똑같이 return만 하지않은채 대기하는거고

->네, 정확하게 이해하셨습니다! 🙌
useEffect의 동작 방식에 대한 설명을 잘 해주셨습니다. 

? : 근데 그럼 useEffect를 이용해서 즉각적으로 무엇을 하려면 return문 전에 작성해야하는거네? 만약 return문에 작성한다면 그건 항상 한박자 늦게 실행되거나 반영되겠네

->맞습니다! useEffect에서 즉각적으로 무엇인가를 실행하려면 return문 전에 작성해야 하며, return에 작성된 코드는 항상 "한 박자 늦게" 실행됩니다. 

?: 클래스형 컴포넌트에서는 
여러 훅 클래스가 나뉘어 있어서 그걸 사용해서 시점을 조정하잖아.
함수형 컴포넌트는 useEffect밖에 없는데 그걸 어떻게 조정하나 했더니 return문 전에 작성하냐 return문 후에 작성하냐로 hook의 사이클을 조정하는거야?

->맞습니다! 함수형 컴포넌트에서는 **useEffect의 위치(본문과 return문)**를 활용해 작업의 시점을 조정할 수 있습니다. 반면, 클래스형 컴포넌트에서는 생명주기 메서드(componentDidMount, componentDidUpdate, componentWillUnmount)를 사용해 작업을 명시적으로 나눴습니다.
함수형 컴포넌트에서는 이런 생명주기를 통합하여 useEffect를 기반으로 작업을 수행하고, 작업의 시점을 조정합니다.


 */
