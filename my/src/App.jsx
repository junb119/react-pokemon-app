import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0); // 가져올 데이터 offset(시작번호)
  const [limit, setLimit] = useState(20); // 한번에 가져올 갯수 20개
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const baseURL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    fetchPokeData(true);
  }, []);
  useEffect(() => {
    handleSearchInput(debouncedSearchTerm); // debouncedSearchTerm이 바뀔 때 handleSearchInput 호출로 검색한 포켓몬데이터가져오기
  }, [debouncedSearchTerm]);

  const fetchPokeData = async (isFirstFetch) => {
    try {
      const offsetValue = isFirstFetch ? 0 : offset + limit; // 최초렌더링이면 offset은 0 아니면 기존 offset + 가져올갯수
      const url = `${baseURL}/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      setPokemons([...pokemons, ...response.data.results]);
      setOffset(offsetValue); // 더보기로 포켓몬데이터 추가 후 offset 조정
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchInput = async (searchTerm) => {
    // 새롭게 입력된 searchTerm 받아오기
    if (searchTerm.length > 0) {
      try {
        // 입력값과 일치하는 데이터요청
        const response = await axios.get(`${baseURL}/${searchTerm}`);
        const pokemonData = {
          url: `${baseURL}/${response.data.id}`,
          name: searchTerm,
        };
        setPokemons([pokemonData]); // 입력값과 일치하는 데이터 하나 반환
      } catch (error) {
        setPokemons([]); //일치하는 값이 없을 때는 빈 배열
        console.error(error);
      }
    } else {
      // 입력값이 없을 때는 최초 20개 데이터 가져오기
      fetchPokeData(true);
    }
  };
  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
        <div className="relative z-50">
          <form className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
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
        </div>
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {pokemons.length > 0 ? (
            pokemons.map(({ url, name }, index) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg to-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
      <div className="text-center">
        <button
          className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
          onClick={() => fetchPokeData(false)} // isFirstFetch를 false로 주어 추가렌더링
        >
          더 보기
        </button>
      </div>
    </article>
  );
}

export default App;
