import axios from "axios";

const axiosInstance = axios.create({ baseURL: "https://pokeapi.co/api/v2" });

const fetchPokemonsByPage = (offset: number, limit: number) => {
  return axiosInstance.get("/pokemon", {
    params: { offset, limit },
  });
};

const fetchPokemonByName = (name: string) => {
  return axiosInstance.get(`/pokemon/${name}`);
};

const fetchPokemonsTypes = () => {
  return axiosInstance.get("/type");
};

const fetchPokemonsByType = (type: string) => {
  return axiosInstance.get(`/type/${type}`);
};

export const pokemonsAPI = {
  fetchPokemonsByPage,
  fetchPokemonByName,
  fetchPokemonsTypes,
  fetchPokemonsByType,
};
