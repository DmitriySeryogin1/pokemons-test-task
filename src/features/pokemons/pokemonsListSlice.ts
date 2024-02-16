import axios from "axios";
import { pokemonsAPI } from "../../api/pokemonsAPI";
import { Pokemon } from "../../types/Pokemon";
import { createAppSlice } from "../../utils/createAppSlice";

type FetchPokemonsByPageParams = {
  offset: number;
  limit: number;
};

type PokemonsListState = {
  status: "idle" | "pending" | "succeeded" | "failed";
  data: Array<Pokemon>;
  type: null | string;
  total: number;
  page: number;
  pageSize: number;
  error: null | string;
};

const initialState: PokemonsListState = {
  status: "idle",
  type: null,
  total: 0,
  data: [],
  page: 1,
  pageSize: 12,
  error: null,
};

export const pokemonsSlice = createAppSlice({
  name: "pokemons",
  initialState,
  reducers: (create) => ({
    fetchPokemonsByPage: create.asyncThunk(
      async (
        params: FetchPokemonsByPageParams
      ): Promise<Pick<PokemonsListState, "total" | "data" | "pageSize">> => {
        const { offset, limit } = params;

        const pokemons = await pokemonsAPI.fetchPokemonsByPage(offset, limit);

        const pokemonsDetails = await Promise.all(
          pokemons.data.results.map(({ url }: Pokemon) => axios.get(url!))
        );

        return {
          total: pokemons.data.count,
          data: pokemons.data.results.map((data: Omit<Pokemon, "image">) => ({
            ...data,
            image:
              pokemonsDetails.find(({ data: { name } }) => name === data.name)
                ?.data?.sprites.front_default || "",
          })),
          pageSize: limit,
        };
      },
      {
        pending: (state) => {
          state.error = null;
          state.status = "pending";
        },
        fulfilled: (state, action) => {
          state.status = "succeeded";
          state.type = null;
          state.data = action.payload.data;
          state.total = action.payload.total;
          state.pageSize = action.payload.pageSize;
        },
        rejected: (state) => {
          state.status = "failed";
          state.data = [];
          state.error = "Error while getting pokemons";
        },
      }
    ),

    fetchPokemonsByType: create.asyncThunk(
      async (type: string) => {
        const pokemonsByType = await pokemonsAPI.fetchPokemonsByType(type);

        const pokemons = await Promise.all(
          pokemonsByType.data.pokemon.map(
            (pokemon: { pokemon: { url: string } }) =>
              axios.get(pokemon.pokemon.url)
          )
        );

        return {
          total: pokemonsByType.data.pokemon.length,
          data: pokemons.map((pokemon) => ({
            name: pokemon.data.name || "",
            image: pokemon.data.sprites?.front_default || "",
          })),
          type,
        };
      },
      {
        pending: (state) => {
          state.error = null;
          state.status = "pending";
        },
        fulfilled: (state, action) => {
          state.status = "succeeded";
          state.type = action.payload.type;
          state.data = action.payload.data;
          state.total = action.payload.total;
        },
        rejected: (state) => {
          state.status = "failed";
          state.data = [];
          state.error = "Error while getting pokemons of this type";
        },
      }
    ),

    setPage: create.reducer((state, action: { payload: number }) => {
      state.page = action.payload;
    }),
  }),
  selectors: {
    selectPokemons: (state) => state.data,
    selectTotalPokemonsAmount: (state) => state.total,
    selectPokemonsStatus: (state) => state.status,
    selectCurrentPage: (state) => state.page,
    selectPokemonsListPageSize: (state) => state.pageSize,
    selectError: (state) => state.error,
    selectType: (state) => state.type,
  },
});

export const { fetchPokemonsByPage, setPage, fetchPokemonsByType } =
  pokemonsSlice.actions;

export const {
  selectCurrentPage,
  selectError,
  selectPokemons,
  selectPokemonsListPageSize,
  selectPokemonsStatus,
  selectTotalPokemonsAmount,
  selectType,
} = pokemonsSlice.selectors;

export default pokemonsSlice.reducer;
