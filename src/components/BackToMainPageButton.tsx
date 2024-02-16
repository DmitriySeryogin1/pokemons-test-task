import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function BackToMainPageButton() {
  const navigate = useNavigate();
  
  return (
    <Button type="primary" onClick={() => navigate("/")}>
      Back To Main Page
    </Button>
  );
}
