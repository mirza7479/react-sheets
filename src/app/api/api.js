import axios from 'axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// create a new user
export const createUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user`, {
      email,
      password,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// delete a user by ID
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/user/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// log in a user and retrieve a JWT token
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      email,
      password,
    })
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    throw error
  }
}
export const getAllJobs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sheets`, {
      headers,
    })
    return response.data.sheets
  } catch (error) {
    console.error(error)
  }
}

// export const createJob = async (sheetData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/sheets`, sheetData, {
//       headers,
//     })
//     return response.data.sheets
//   } catch (error) {
//     console.error(error)
//   }
// }

// export const getJobById = async (id) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/sheets/${id}`, {
//       headers,
//     })
//     return response.data.sheets
//   } catch (error) {
//     console.error(error)
//   }
// }

// export const updateJob = async (id, sheetData) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/sheets/${id}`,
//       sheetData,
//       { headers },
//     )
//     return response.data.sheets
//   } catch (error) {
//     console.error(error)
//   }
// }
// export const updateJobProp = async (id, prop) => {
//   try {
//     const response = await axios.patch(`${API_BASE_URL}/sheets/${id}`, prop, {
//       headers,
//     })
//     return true
//   } catch (error) {
//     console.error(error)
//   }
// }

// export const deleteJob = async (id) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/sheets/${id}`, {
//       headers,
//     })
//     return response.data.sheets
//   } catch (error) {
//     console.error(error)
//   }
// }
