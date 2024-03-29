import { TextField, Button } from "@mui/material";
import { useState } from "react";
import "../styles/sass/routes/Login.scss";
import { textFieldStyles } from "../styles/mui/shared/TextField.styles";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { logon } = useAuth();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    logon({ password, username }).catch((e) => {
      console.error(e);
      alert("Username or Password are incorrect");
    });
  };

  return (
    <div className="login__container">
      <h1 className="login__container__title">Login</h1>
      <form className="login__container__form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          sx={textFieldStyles.primary}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          sx={textFieldStyles.primary}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
