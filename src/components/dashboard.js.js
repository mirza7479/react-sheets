import { Layout, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authorizeUser } from '../app/api/authentication'
import { contentComponents } from '../constants/constants'
import TopNav from './topNav'
const { Header, Content } = Layout

const Dashboard = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState('home')

  const handleLogout = () => {
    // Clear token from browser storage
    localStorage.removeItem('token')
    // Navigate to /login
    navigate('/login')
  }

  useEffect(() => {
    const checkAuthorization = async () => {
      const authorizedUser = await authorizeUser()

      if (!authorizedUser) {
        handleLogout()
      }
    }
    checkAuthorization()
  }, [])
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <TopNav
          onChangeContent={(e) => setContent(e.key)}
          handleLogout={handleLogout}
        />
      </Header>
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {contentComponents[content]}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
export default Dashboard
