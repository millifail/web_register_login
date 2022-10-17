import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  };

  useEffect(() => {
    //LandingPage에 들어오자마자 다음을 실행한다
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("logout failed");
      }
    });
  };

  return (
    <div style={style}>
      <h2>시작페이지</h2>
      <button onClick={onClickHandler}>logout</button>
    </div>
  );
}

export default LandingPage;
