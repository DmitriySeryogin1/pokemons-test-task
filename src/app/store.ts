import { configureStore } from "@reduxjs/toolkit";
import pokemonsSlice from "../features/pokemons/pokemonsListSlice";

const store = configureStore({
  reducer: {
    pokemons: pokemonsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
