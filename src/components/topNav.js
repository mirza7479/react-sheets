import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import React from 'react'

const TopNav = ({ onChangeContent, handleLogout }) => {
  const items = [
    {
      key: 'home',
      style: { marginRight: 'auto' },
      label: 'Cloudpacer',
    },
    {
      style: { marginLeft: 'auto' },
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        {
          key: 'signout',
          label: 'Sign Out',
          icon: <LogoutOutlined />,
          onClick: () => handleLogout(),
        },
      ],
    },
  ]
  return (
    <Menu
      theme="dark"
      onClick={onChangeContent}
      selectedKeys={false}
      mode="horizontal"
      items={items}
    />
  )
}
export default TopNav
