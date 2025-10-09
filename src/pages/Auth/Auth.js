import React, { useState } from "react";
import {
  Button,
  Input,
  LoginCard,
  LoginWrapper,
  Title,
} from "./style/AuthStyled";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() == "admin@admin.com" && password.trim() === "123") {
      navigate("/home");
    } else {
      alert("usuario invalido");
    }
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="admin@admin.com"
            required
            value={email}
            onChange={onChangeEmail}
          />
          <Input
            type="password"
            placeholder="123"
            required
            value={password}
            onChange={onChangePassword}
          />
          <Button type="submit">Ingresar</Button>
        </form>
      </LoginCard>
    </LoginWrapper>
  );
}

export default Auth;
