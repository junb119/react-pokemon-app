import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../firebase";

const Navbar = () => {
  const auth = getAuth(app);

  const provider = new GoogleAuthProvider();

  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // onAuthStateChanged : 유저의 상태가 변경되면 호출, 유저정보전달
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
    });
    return () => {
      unsubscribe(); // 로그인이 쓰이지 않는 경우 해제
    };
  }, [pathname]);

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => console.log(result))
      .catch((error) => {
        console.error(error);
      });
  };
  const listner = () => {
    if ((window, scrollY > 50)) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listner);
    return () => {
      window.removeEventListener("scroll", listner);
    };
  }, []);

  return (
    <NavWrapper show={show}>
      <Logo>
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Poke Logo"
          onClick={() => (window.location.href = "/")}
        />
      </Logo>
      {pathname === "/login" ? (
        <Login onClick={handleAuth}>로그인</Login>
      ) : (
        <></>
      )}
      {/* 로그인페이지에서만 로그인 컴포넌트 보이기 */}
    </NavWrapper>
  );
};

const Login = styled.a` 
background-color: rgba(0,0,0,0.6);
padding: 8px 16px;
text-transform: uppercase;
letter-spacing:1.5px;
border : 1px solid #f9f9f9;
border-radius :4px;
transition: all 0.2s ease 0s;
color: white;
  &hover {
  background-color : #f9f9f9
  color: #000;
  border-color:transparent;
  }`;

const NavWrapper = styled.nav.attrs((props) => ({
  show: undefined, // `show`를 DOM에 전달하지 않음
}))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: ${(props) => (props.show ? "#090b13" : "transparent")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
`;

const Logo = styled.a`
  padding: 0;
  width: 50px;
  magin-top: 4px;
`;
const Image = styled.img`
  cursor: pointer;
  width: 100%;
`;
export default Navbar;
