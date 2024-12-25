import React, { useEffect, useState } from "react";
import styled from "styled-components";

const NavWrapper = styled.nav`
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
const Navbar = () => {
  const [show, setShow] = useState(false);
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
    </NavWrapper>
  );
};

export default Navbar;
