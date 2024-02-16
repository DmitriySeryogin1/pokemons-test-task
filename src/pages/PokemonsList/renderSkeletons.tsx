import { Col, Card, Skeleton } from "antd";

export const renderSkeletons = (pageSize: number): JSX.Element[] => {
  const skeletons = [];

  for (let i = 0; i < pageSize; i++) {
    skeletons.push(
      <Col xs={{ span: 12 }} md={{ span: 6 }} key={i}>
        <Card
          className="card"
          loading
          cover={<Skeleton.Image active />}
          title={<Skeleton.Input active />}
        />
      </Col>
    );
  }

  return skeletons;
};
