import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleNavigation = ()=>{
    navigate('/signUp')
  }

  const handleSignUp = ()=>{
    navigate('/signup')
  }

 
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [error, setError] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();


    axios.post('http://localhost:8081/auth/adminlogin', values)
      .then(result => {
        if (result.data.loginStatus) {
          navigate('/dashboard');
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='login'>
      <div className='login__view'>
        <p>{error && error}</p>
      
        <form onSubmit={handleSubmit}>
          <p className='login__title'>Login Page</p>
          <div className='login__contain'>
            <div className='login__pad'>
              <p className='login__email'>Email:</p>
              <input
                type="email"
                className='login__input'
                name='email'
                placeholder='Enter Email'
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                required
              />
            
            </div>
            <div className='login__pad'>
              <p className='login__password'>Password:</p>
              <input
                type="password"
                className='login__input'
                name='password'
                placeholder='Enter Password'
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                required
              />
             
            </div>
            <button type='submit' className='login__button'>Login</button>

          </div>
          
         
        </form>
      </div>
    </div>
  );
};

export default Login;