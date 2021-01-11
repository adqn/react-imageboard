import React, {useState} from 'react';
import axios from 'axios';

const api = option => "http://localhost:5001/api/" + option

const userLogin = credentials =>
  new Promise((resolve, reject) => {
    axios.post(api("login"), credentials)
      .then(resp => resolve(resp))
  })

const Login = ({setToken}) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loginStatus, setLoginStatus] = useState();

  const clearForm = () => {
    setUsername("");
    setPassword("");
  }

  const handleSubmit =  e => {
    e.preventDefault();

    const user = {
      username,
      password
    }

    userLogin(user)
      .then(resp => {
        if (resp.status === 200) {
          setToken(resp.data)
        }
      })

    clearForm();
  }

  return (
    <div className="login-form">
      <span className="login-status">{loginStatus}</span>
      <form>
        <label>
          u:&nbsp;
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          p:&nbsp; 
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)} />
        </label>
        <br />
        <div>
          <button
            type="submit"
            onClick={e => handleSubmit(e)}>login</button>
        </div>
      </form>
    </div>
  )
}

export default Login;