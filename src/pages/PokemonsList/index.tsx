import {
  Card,
  Col,
  Empty,
  Flex,
  Input,
  Pagination,
  Row,
  Tooltip,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import {
  fetchPokemonsByPage,
  selectCurrentPage,
  selectError,
  selectPokemons,
  selectPokemonsListPageSize,
  selectPokemonsStatus,
  selectTotalPokemonsAmount,
  selectType,
  setPage,
} from "../../features/pokemons/pokemonsListSlice";
import SelectType from "./SelectType";
import { renderSkeletons } from "./renderSkeletons";

export default function PokemonsList() {
  const navigate = useNavigate();

  const pokemons = useSelector(selectPokemons);
  const pokemonsTotalAmount = useSelector(selectTotalPokemonsAmount);
  const pokemonsStatus = useSelector(selectPokemonsStatus);
  const page = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPokemonsListPageSize);
  const error = useSelector(selectError);
  const selectedType = useSelector(selectType);

  const dispatch = useDispatch<AppDispatch>();

  const [messageApi, contextHolder] = message.useMessage();

  const loading = pokemonsStatus === "pending";

  const navigateToPokemonPage = (name: string) => {
    navigate(`/${name}`);
  };

  const fetchData = () => {
    dispatch(
      fetchPokemonsByPage({ offset: (page - 1) * pageSize, limit: pageSize })
    );
  };

  if (pokemonsStatus === "idle") {
    fetchData();
  }

  if (error) {
    messageApi.error(error);
  }

  return (
    <>
      {contextHolder}
      <Flex gap="middle" vertical>
        <Flex align="center" className="w-50" gap={"small"}>
          <SelectType disabled={loading} resetPage={fetchData} />
          {!selectedType && (
            <Input.Search
              disabled={loading}
              className="w-50"
              placeholder="Search by name"
              onSearch={(e) => navigateToPokemonPage(e)}
            />
          )}
        </Flex>
        <Row gutter={[10, 40]}>
          {loading ? (
            renderSkeletons(pageSize)
          ) : pokemons.length > 0 ? (
            pokemons.map(({ name, image }) => (
              <Col xs={{ span: 12 }} md={{ span: 6 }} key={name}>
                <Flex vertical align="center" justify="middle">
                  <Tooltip title={name}>
                    <Card
                      onClick={() => navigateToPokemonPage(name)}
                      className="card text-center"
                      cover={<img src={image} />}
                      hoverable
                      title={name}
                    />
                  </Tooltip>
                </Flex>
              </Col>
            ))
          ) : (
            <Empty className="text-center" />
          )}
        </Row>
        {!selectedType && (
          <Pagination
            className="text-center"
            total={pokemonsTotalAmount}
            defaultPageSize={12}
            current={page}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={[12, 20]}
            onChange={(page, size) => {
              const offset = (page - 1) * size;

              const pageSize =
                offset + size > pokemonsTotalAmount
                  ? pokemonsTotalAmount - offset
                  : size;

              dispatch(setPage(page));

              dispatch(
                fetchPokemonsByPage({
                  offset,
                  limit: pageSize,
                })
              );
            }}
          />
        )}
      </Flex>
    </>
  );
}
