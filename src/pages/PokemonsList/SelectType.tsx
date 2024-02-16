import { Select, Skeleton, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  fetchPokemonsByType,
  selectType,
} from "../../features/pokemons/pokemonsListSlice";
import { useFetchPokemonsTypes } from "../../hooks/useFetchPokemonsTypes";

type SelectTypeProps = {
  disabled: boolean;
  resetPage: () => void;
};

export default function SelectType({ resetPage, disabled }: SelectTypeProps) {
  const {
    loading: loadingTypes,
    setLoading: setLoadingTypes,
    data: types,
    error,
  } = useFetchPokemonsTypes();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch<AppDispatch>();

  const selectedType = useSelector(selectType);

  if (error) {
    messageApi.error(error.message);
  }

  return (
    <>
      {contextHolder}
      <Select
        disabled={disabled}
        value={selectedType}
        allowClear
        onClick={() => {
          if (!types.length) {
            setLoadingTypes(true);
          }
        }}
        dropdownRender={(menu) => (
          <>{loadingTypes ? <Skeleton active /> : menu}</>
        )}
        options={types.map((type) => ({ label: type, value: type }))}
        placeholder="Search by type"
        className="w-50"
        onChange={(e) => {
          !e ? resetPage() : dispatch(fetchPokemonsByType(e));
        }}
      />
    </>
  );
}
