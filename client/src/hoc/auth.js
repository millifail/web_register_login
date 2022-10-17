import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
  //option  (null, true, false)
  //null => 아무나 줄입이 가능한 페이지
  //true => 로그인한 유저만 출입이 가능한 페이지
  //false => 로그인한 유저는 출입 불가능한
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    //backend에서 현재유저의 상태를 가져옴 (관리자, 로그인상태, 일반유저 등)

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log("auth? ", response);

        if (!response.payload.isAuth) {
          // 로그인하지 않은 상태
          if (option) {
            navigate("/login");
          }
        } else {
          // login
          if (adminRoute && !response.payload.isAdmin) {
            //로그인한 유저인데 admin이 아닌데, admin 페이지에 들어가려 할때,
            navigate("/");
          } else {
            if (option === false) {
              //로그인한 유저가 들어가면 안되는 페이지에 들어가려 할 때
              navigate("/");
            }
          }
        }
      });
    }, []);

    return (
      <SpecificComponent /> // component return이 없으면 React 실행이 안됨.
    );
  }

  return <AuthenticationCheck />;
}
