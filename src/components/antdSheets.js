import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Popconfirm, Space, Table } from 'antd'
import moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import socketIOClient from 'socket.io-client'
import { getAllJobs } from '../app/api/api'
import DownloadCSV from './downloadCsv'
const EditableContext = React.createContext(null)
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.getFieldsValue()
      // toggleEdit()
      handleSave(record, values)
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onChange={save}
          style={{
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
            backgroundColor: 'transparent',
          }}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const AntdSheets = () => {
  const [socket, setSocket] = useState(null)
  const [jobs, setJobs] = useState([])

  const getDbJobs = async () => {
    const jobs = await getAllJobs()
    if (jobs?.length) {
      setJobs(jobs)
    }
  }

  useEffect(() => {
    getDbJobs()
    const socket = socketIOClient(process.env.REACT_APP_API_BASE_URL) // Replace with your server URL
    setSocket(socket)
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('addJob', (updatedData) => {
      console.log('updatedData added', updatedData)
      setJobs(updatedData)
    })
    socket.on('deleteJob', (updatedData) => {
      console.log('updated', updatedData)
      setJobs(updatedData)
    })
    socket.on('updateSheetProperty', (updatedData) => {
      console.log('updated', updatedData)
      setJobs(updatedData)
    })

    return () => {
      socket.disconnect() // Clean up the socket connection when the component unmounts
      console.log('disconnected')
    }
  }, [])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (prop) => {
      const text =
        dataIndex == 'date' ? moment(prop).format('YYYY-MM-DD') : prop

      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
    },
  })
  const renderData = (text, record) => {
    return (
      <Input
        style={{
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          backgroundColor: 'transparent',
        }}
        value={text}
      />
    )
  }

  const defaultColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      editable: true,
      width: '100%',
      filterSearch: true,
      render: (date) => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      ...getColumnSearchProps('date'),
      render: (text, record) =>
        renderData(moment(text).format('YYYY-MM-DD'), record),
    },
    {
      title: 'Applied By',
      dataIndex: 'appliedBy',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.source.length - b.source.length,
      ...getColumnSearchProps('appliedBy'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.source.length - b.source.length,
      ...getColumnSearchProps('source'),
      render: (text, record) => renderData(text, record),
    },

    {
      title: 'Company Name',
      dataIndex: 'company',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.company.length - b.company.length,
      ...getColumnSearchProps('company'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps('title'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.rate - b.rate,
      ...getColumnSearchProps('rate'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'JD',
      dataIndex: 'jd',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.jd.length - b.jd.length,
      ...getColumnSearchProps('jd'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Job Link',
      dataIndex: 'jobLink',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.jobLink.length - b.jobLink.length,
      ...getColumnSearchProps('jobLink'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Profile',
      dataIndex: 'profile',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.profile.length - b.profile.length,
      ...getColumnSearchProps('profile'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.status.length - b.status.length,
      ...getColumnSearchProps('status'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Interviewee',
      dataIndex: 'interviewee',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.interviewee.length - b.interviewee.length,
      ...getColumnSearchProps('interviewee'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      editable: true,
      width: '100%',
      filterSearch: true,
      sorter: (a, b) => a.remarks.length - b.remarks.length,
      ...getColumnSearchProps('remarks'),
      render: (text, record) => renderData(text, record),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) =>
        jobs.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ]
  const handleAdd = async () => {
    const newDate = new Date()
    const newJob = {
      date: moment(newDate).format('YYYY-MM-DD'),
      appliedBy: '',
      source: '',
      company: '',
      title: '',
      rate: '',
      jd: '',
      jobLink: '',
      profile: '',
      status: '',
      interviewee: '',
      remarks: '',
    }
    socket.emit('addJob', newJob)
  }
  const handleDelete = async (id) => {
    socket.emit('deleteJob', {
      recordId: id,
    })
  }

  const handleSave = async (record, values) => {
    socket.emit('updateSheetProperty', {
      recordId: record._id,
      propertyName: Object.keys(values)[0],
      propertyValue: Object.values(values)[0],
    })
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        {jobs.length ? <DownloadCSV data={jobs} filename="mydata.csv" /> : ''}
      </div>

      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={jobs}
        columns={columns}
        pagination={false}
      />
    </div>
  )
}
export default AntdSheets
