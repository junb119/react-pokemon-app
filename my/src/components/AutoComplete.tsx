import { useState } from "react";
import { PokemonNameAndUrl } from "../types/PokemonData";

interface AutoCompleteProps {
  allPokemons: PokemonNameAndUrl[];
  setDisplayedPokemons: React.Dispatch<
    React.SetStateAction<PokemonNameAndUrl[]>
  >;
}
export function AutoComplete({
  allPokemons,
  setDisplayedPokemons,
}: AutoCompleteProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filterNames = (input: string) => {
    const value = input.toLowerCase();
    return value ? allPokemons.filter((e) => e?.name.includes(value)) : []; // 입력한 포켓몬 이름을 포함하는 포켓몬 데이터 배열 반환 없으면 빈 배열 반환
  };
  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) /* html의 폼 엘리멘트 타입 */ {
    // 검색 버튼 누를 때
    e.preventDefault();

    let text = searchTerm.trim();
    setDisplayedPokemons(filterNames(text)); // 입력한 검색결과에 맞는 포켓몬 데이터 보여주기
    setSearchTerm(""); // 검색 후 입력창은 초기화
  }

  function checkEqualName(input:string) {
    // 검색시 autocomplete
    const filterdArray = filterNames(input);
    return filterdArray[0]?.name === input ? [] : filterdArray; // 입력한 시점의 텍스트와 일치하는 포켓몬 이름이 있으면 빈배열, 아니면 필터링된 배열 반환
  }
  return (
    <div className="relative z-50">
      <form
        onSubmit={handleSubmit}
        className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
      >
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          type="text"
          placeholder=" "
          className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center"
        />
        <button
          type="submit"
          className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
        >
          검색
        </button>
      </form>
      {checkEqualName(searchTerm).length > 0 && ( // 입력한 텍스트와 일치하는 포켓몬이 있으면 자동완성 보여주기
        <div className="w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2">
          <div className="w-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2"></div>
          <ul
            className={`w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none`}
          >
            {checkEqualName(searchTerm).map((e, i) => (
              <li key={`button-${i}`}>
                <button
                  className={`text-base w-full hover:bg-gray-600 p-[2px] text-gray-100`}
                  onClick={() => {
                    setSearchTerm(e.name);
                  }}
                >
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
