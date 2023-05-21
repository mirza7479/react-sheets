import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../app/api/api'

import '../css/login.css'

function SignUp() {
  // React States
  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState({})

  const handleSubmit = async (event) => {
    // Prevent page reload
    event.preventDefault()

    const [email, password] = event.target.elements

    try {
      // Find user login info
      await createUser(email.value, password.value)
      alert('User Created Successfully !!')
      navigate('/login')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized access
        setErrorMessages({
          name: 'pass',
          message: 'Invalid email or password',
        })
      } else {
        // Other error
        console.log(error)
        setErrorMessages({
          name: 'pass',
          message: `${error.response.data.error}`,
        })
      }
    }
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    )

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="label-color">Username </label>
          <input type="email" name="email" required />
          {renderErrorMessage('email')}
        </div>

        <div className="input-container">
          <label className="label-color">Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage('pass')}
        </div>

        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  )

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {renderForm}
      </div>
    </div>
  )
}

export default SignUp
