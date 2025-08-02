import axios from "axios";

export const BASE_URL = "http://147.93.107.162:8008/";
// export const BASE_URL = "http://127.0.0.1:8000/";

const LOGIN_URL = BASE_URL + "api/token/";
const REGISTER_URL = BASE_URL + "register/";

// login fetch api
export const handleLogin = async (username, password, setMessage) => {
  try {
    const response = await axios.post(LOGIN_URL, {
      username,
      password,
    });

    setMessage("Login Successfully");
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
  } catch (err) {
    setMessage("Invalid Username and password");
    console.log(err);
  }
};

// Register

export const handleRegister = async (
  username,
  email,
  password,
  setMessage,
  navigate
) => {
  try {
    const response = await axios.post(REGISTER_URL, {
      username,
      email,
      password,
    });

    // on success the API returns a { message: 'User registered successfully' }
    setMessage(response.data.message);

    // give the user a moment to read the message, then send them to login
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  } catch (err) {
    // if the server sent back validation errors, show them
    if (err.response && err.response.data) {
      const errors = err.response.data;
      // e.g. { username: ['This field is required.'], email: [...], password: [...] }
      const firstField = Object.keys(errors)[0];
      setMessage(`${firstField}: ${errors[firstField][0]}`);
    } else {
      setMessage("Registration failed. Please try again.");
    }
  }
};
