import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [allPokemons, setAllPokemons] = useState([]); // 모든 포켓몬 데이터를 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState([]); // 보여줄 포켓몬 데이터를 가지고 있는 state
  const limitNum = 20; // 한번에 가져올 포켓몬 데이터 수
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const baseURL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    fetchPokeData();
  }, []);
  useEffect(() => {
    handleSearchInput(debouncedSearchTerm); // debouncedSearchTerm이 바뀔 때 handleSearchInput 호출로 검색한 포켓몬데이터가져오기
  }, [debouncedSearchTerm]);
  function filterDisplayedPokemonData(allPokemonsData, displayedPokemons = []) {
    //displayedPokemons = [] 기본값은 빈배열
    const limit = displayedPokemons.length + limitNum;
    //모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
    const array = allPokemonsData.filter((_, index) => index + 1 <= limit);
    // limit은 가져올 포켓몬 중에서 가장 큰 번호이므로 이보다 작거나 같은 포켓몬들까지만 배열에 담기
    return array;
  }

  const fetchPokeData = async () => {
    try {
      const response = await axios.get(url);
      // 모든 포켓몬 데이터 기억하기
      setAllPokemons(response.data.results);
      // 실제로 화면에 보여줄 포켓몬 리스트 기억하는 state
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
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
          {displayedPokemons.length > 0 ? (
            displayedPokemons.map(({ url, name }, index) => (
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
        {/* 더보기 버튼을 보여주려면 */}
        {/* 모든 포켓몬 수가 보여주고 있는 포켓몬 수보다 많고, 보여주는게 하나일 때가 아니여야함. (검색 결과를 볼 때) */}
        {allPokemons.length > displayedPokemons.length &&
          displayedPokemons.length !== 1 && (
            <button
              className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
              onClick={() =>
                setDisplayedPokemons(
                  filterDisplayedPokemonData(allPokemons, displayedPokemons)
                )
              } // 필터링된 포켓몬데이터를 표시하기
            >
              더 보기
            </button>
          )}
      </div>
    </article>
  );
}

export default App;
