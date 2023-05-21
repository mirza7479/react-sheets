export const authorizeUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    // Redirect to login if token not found
    return false
  }

  try {
    const response = await fetch('/api/auth/check', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      // Redirect to login if token is invalid or expired
      return false
    }
    console.log('response', response)

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
