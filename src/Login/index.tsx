
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login () {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onFinish = (e:any) => {
    e.preventDefault()
    if (username === process.env.REACT_APP_EMAIL && password === process.env.REACT_APP_PASSWORD) {
      console.log('Login successful');
      localStorage.setItem("token",'true')
      setError('');
      navigate('/home'); 
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={onFinish}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              required
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              required
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <div className="error">
            {error && error}
          </div>
        </div>
      </form>
    </div>
  )
}
