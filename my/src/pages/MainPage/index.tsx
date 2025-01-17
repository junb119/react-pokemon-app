import { useEffect, useState } from "react";
import axios from "axios";
import { AutoComplete } from "../../components/AutoComplete";
import PokeCard from "../../components/PokeCard";
import { PokemonData, PokemonNameAndUrl } from "../../types/PokemonData";

const MainPage = () => {
  const [allPokemons, setAllPokemons] = useState<PokemonNameAndUrl[]>([]); // 모든 포켓몬 데이터를 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState<
    PokemonNameAndUrl[]
  >([]); // 보여줄 포켓몬 데이터를 가지고 있는 state
  const limitNum: number = 20; // 한번에 가져올 포켓몬 데이터 수
  const url: string = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  const baseURL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    fetchPokeData();
  }, []);

  function filterDisplayedPokemonData(
    allPokemonsData: PokemonNameAndUrl[],
    displayedPokemons: PokemonNameAndUrl[] = []
  ) {
    //displayedPokemons = [] 기본값은 빈배열
    const limit = displayedPokemons.length + limitNum;
    //모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
    const array = allPokemonsData.filter((_, index) => index + 1 <= limit);
    // limit은 가져올 포켓몬 중에서 가장 큰 번호이므로 이보다 작거나 같은 포켓몬들까지만 배열에 담기
    return array;
  }

  const fetchPokeData = async () => {
    try {
      const response = await axios.get<PokemonData>(url);
      // 모든 포켓몬 데이터 기억하기
      setAllPokemons(response.data.results);
      // 실제로 화면에 보여줄 포켓몬 리스트 기억하는 state
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
        <AutoComplete
          allPokemons={allPokemons}
          setDisplayedPokemons={setDisplayedPokemons}
        />
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {displayedPokemons.length > 0 ? (
            displayedPokemons.map(({ url, name }: PokemonNameAndUrl) => (
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
};

export default MainPage;
