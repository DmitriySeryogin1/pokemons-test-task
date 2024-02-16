import { Result } from "antd";
import BackToMainPageButton from "./BackToMainPageButton";

export default function PageNotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<BackToMainPageButton />}
    />
  );
}
