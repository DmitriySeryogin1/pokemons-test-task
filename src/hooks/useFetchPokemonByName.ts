import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pokemonsAPI } from "../api/pokemonsAPI";
import {
  selectCurrentPage,
  selectPokemonsListPageSize,
  setPage
} from "../features/pokemons/pokemonsListSlice";

type Pokemon = {
  id?: number;
  sprites?: {
    front_default?: string;
  };
  name?: string;
  moves?: { move: { name: string } }[];
  types?: { type: { name: string } }[];
};

export const useFetchPokemonByName = (name: string) => {
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<null | AxiosError>(null);

  const pageSize = useSelector(selectPokemonsListPageSize);
  const page = useSelector(selectCurrentPage);

  const dispatch = useDispatch();

  const data = useRef<null | Pokemon>(null);

  useEffect(() => {
    setError(null);
    setFetching(true);

    pokemonsAPI
      .fetchPokemonByName(name)
      .then((response) => {
        const currentPage = Math.ceil(response.data.id / pageSize);

        if (page !== currentPage) {
          dispatch(setPage(Math.ceil(response.data.id / pageSize)));
        }

        data.current = response.data;
      })
      .catch(setError)
      .finally(() => setFetching(false));
  }, [name, dispatch, pageSize, page]);

  return {
    fetching,
    error,
    data: data.current,
  };
};
