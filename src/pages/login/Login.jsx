import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("demo@admin.dev"); // Prefilled email
  const [password, setPassword] = useState("123456"); // Prefilled password

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        navigate("/");
      })
      .catch(() => {
        setError(true);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-300 via-blue-400 to-red-300 bg-[length:300%_300%] animate-gradientBG z-[-1]">
      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-gray-800 bg-opacity-50 p-10 rounded-lg shadow-lg w-full max-w-lg space-y-5"
      >
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-20 px-5 border border-gray-300 text-xl font-saira rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full h-20 px-3 border text-xl font-saira border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          className="w-full h-20 text-xl bg-orange-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
        >
          Login
        </button>
        {error && (
          <span className="text-red-600">Wrong email or password!</span>
        )}
      </form>
    </div>
  );
};

export default Login;
