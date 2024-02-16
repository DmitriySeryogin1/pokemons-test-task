import {
  Descriptions,
  Empty,
  Flex,
  Image,
  List,
  Skeleton,
  Typography,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { AppDispatch } from "../app/store";
import BackToMainPageButton from "../components/BackToMainPageButton";
import { fetchPokemonsByType } from "../features/pokemons/pokemonsListSlice";
import { useFetchPokemonByName } from "../hooks/useFetchPokemonByName";

type DescriptionItemsData = {
  types: string[] | undefined;
  moves: string[] | undefined;
};

export default function Pokemon() {
  const { name } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const { fetching, data, error } = useFetchPokemonByName(name as string);

  const [messageApi, contextHolder] = message.useMessage();

  const descriptionItemsData: DescriptionItemsData = {
    types: data?.types?.map(({ type: { name } }) => name),
    moves: data?.moves?.map(({ move: { name } }) => name),
  };

  if (error) {
    messageApi.error(error.message);
  }

  return (
    <>
      {contextHolder}
      <div>
        <BackToMainPageButton />
      </div>

      {fetching && (
        <>
          <Skeleton.Image />
          {Object.keys(descriptionItemsData).map((key) => (
            <Skeleton key={key} />
          ))}
        </>
      )}
      {error && error.response?.status === 404 && <Empty />}
      {data && (
        <Flex justify="center">
          <Flex vertical align="middle" justify="center">
            <Typography.Title level={3} className="text-center">
              {data.name}
            </Typography.Title>
            <Image
              width={200}
              preview={false}
              src={data?.sprites?.front_default || ""}
            />
          </Flex>
          <Descriptions size="small" bordered>
            {Object.keys(descriptionItemsData).map((key) => (
              <Descriptions.Item
                label={key[0].toUpperCase() + key.slice(1)}
                key={key}
                span={3}
              >
                {(descriptionItemsData[
                  key as keyof DescriptionItemsData
                ] as string[]) ? (
                  <List
                    dataSource={
                      descriptionItemsData[key as keyof DescriptionItemsData]
                    }
                    renderItem={(item) => (
                      <List.Item>
                        {key === "types" ? (
                          <Link
                            onClick={() => dispatch(fetchPokemonsByType(item))}
                            to="/"
                          >
                            {item}
                          </Link>
                        ) : (
                          item
                        )}
                      </List.Item>
                    )}
                    {...((
                      descriptionItemsData[
                        key as keyof DescriptionItemsData
                      ] as string[]
                    ).length > 5 && {
                      pagination: {
                        pageSize: 5,
                        showSizeChanger: false,
                        align: "start",
                      },
                    })}
                  />
                ) : (
                  "No data"
                )}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Flex>
      )}
    </>
  );
}
