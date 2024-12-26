import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.css";
import logo from "../../assets/images/bwmf.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Efecto para verificar si hay un token en el localStorage cuando la página se carga
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      navigate("/"); // Si ya hay un token, redirige al Home directamente
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/"); // Redirigir al Home si el login es exitoso
    } else {
      setError("Credenciales incorrectas o error en el servidor");
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="login-logo">
        <img
          src={logo} // Reemplázalo con tu logo
          alt="Be Water My Friend"
        />
      </div>
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="login-form">
        <p>USERNAME</p>
        <input
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
        />
        <p>PASSWORD</p>
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Log In
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Footer */}
      <div className="login-footer">
        <a href="#" className="forgot-password">
          Forgot password?
        </a>
        <p className="contact-info">
          Contact <br />
          <a href="mailto:sergirojasnavarro@gmail.com">
            sergirojasnavarro@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
