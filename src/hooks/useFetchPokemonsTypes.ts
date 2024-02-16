import { useEffect, useState } from "react";
import { pokemonsAPI } from "../api/pokemonsAPI";
import { AxiosError } from "axios";
import { Pokemon } from "../types/Pokemon";

export const useFetchPokemonsTypes = () => {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<null | AxiosError>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loading && !data.length) {
      pokemonsAPI
        .fetchPokemonsTypes()
        .then((response) => {
          setData(response.data.results.map((type: Pokemon) => type.name));
        })
        .catch(setError)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, data]);

  return { data, setLoading, loading, error };
};
