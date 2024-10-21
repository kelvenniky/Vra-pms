import React, { useState } from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const SignUp = () => {
  const [values, setValues] = useState({
    name:"",
    email: '',
    password: '',
    locationID:"",
  });
  const [error, setError] = useState([])
  
  const [isChecked, setIsChecked] = useState(false); // New state for checkbox
  
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()
  const handleNavigation = ()=>{
    navigate('/auth/adminlogin')
  }

  const handleSubmit = (event)=> {
    event.preventDefault();
    // Check if the checkbox is checked
    if (!isChecked) {
      setError('You must agree to the terms.');
      return;
    }

    axios.post('http://localhost:8081/auth/signup', values)
      .then(res => {
          navigate('/auth/adminlogin');
      })
      .catch(err => console.log(err));

  }

  return (
    <div className='signup
    '>
    <div className='signup__view'>
    <p>{error && error}</p>
      <form >
        <p className='signup__title'>Sign Up</p>
        
        <div className='signup__contain'>
        <div className='signup__pad'>
            <p className='signup__email'>Name:</p>
            <input
              type="text"
              className='signup__input'
              name='name'
              placeholder='Enter Your Name'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className='signup__pad'>
            <p className='signup__email'>Email:</p>
            <input
              type="email"
              className='signup__input'
              name='email'
              placeholder='Enter Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className='signup__pad'>
            <p className='signup__password'>Password:</p>
            <input
              type="password"
              className='signup__input'
              name='password'
              placeholder='Enter Password'
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>
          <div className='signup__pad'>
            <p className='signup__password'>LocationID:</p>
            <input
              type="text"
              className='signup__input'
              name='locationID'
              placeholder='Enter locationID'
              onChange={(e) => setValues({ ...values, locationID: e.target.value })}
              required
            />
          </div>
          <button type='submit' onClick={handleSubmit} className='signup__button'>Sign Up</button>
        </div>
        <div className='signup__label'>
            <input 
              className='signup__tick' 
              type="checkbox" 
              name='tick' 
              id='tick' 
              checked={isChecked} 
              onChange={(e) => setIsChecked(e.target.checked)} // Update checkbox state
            />
            <label htmlFor="tick">You Agree with terms & conditions</label>
           
          </div>
      
      </form>
    </div>
  </div>
    
  )
}

export default SignUp