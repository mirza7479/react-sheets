import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../app/api/api'

import '../css/login.css'

function Login() {
  // React States
  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    // Prevent page reload
    event.preventDefault()

    const [email, password] = event.target.elements

    try {
      // Find user login info
      await loginUser(email.value, password.value)

      setIsSubmitted(true)
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
        setErrorMessages({ name: 'pass', message: 'Something went wrong' })
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
      <div>
        Don't have an account? <a href="/signup">Sign up</a> now!
      </div>
    </div>
  )

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Log In</div>
        {isSubmitted ? navigate('/') : renderForm}
      </div>
    </div>
  )
}

export default Login
