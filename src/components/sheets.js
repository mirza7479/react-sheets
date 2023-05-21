// import { useEffect, useState } from 'react'
// import { authorizeUser } from '../app/api/authentication'
// import '../css/sheets.css'
// import { useNavigate } from 'react-router-dom'
// import { createJob, deleteJob, getAllJobs, updateJobProp } from '../app/api/api'
// import { Button, Dropdown, Menu, Spin, Checkbox } from 'antd'
// import { DownOutlined } from '@ant-design/icons'
// import DownloadCSV from './downloadCsv'

// function JobTable() {
//   const navigate = useNavigate()
//   const [jobs, setJobs] = useState([])
//   const [loading, setLoading] = useState(true)

//   const [search, setSearch] = useState('')
//   const [filterColumns, setFilterColumns] = useState([])
//   const CheckboxGroup = Checkbox.Group
//   const columns = [
//     'date',
//     'source',
//     'company name',
//     'title',
//     'rate',
//     'jd',
//     'jobLink',
//     'profile',
//     'status',
//     'interviewee',
//     'remarks',
//   ]
//   const menu = (
//     <Menu>
//       <CheckboxGroup onChange={setFilterColumns} value={filterColumns}>
//         {columns.map((option) => (
//           <Menu.Item key={option}>
//             <Checkbox value={option}>{option}</Checkbox>
//           </Menu.Item>
//         ))}
//       </CheckboxGroup>
//     </Menu>
//   )

//   const getDbJobs = async () => {
//     const jobs = await getAllJobs()

//     if (jobs) {
//       setJobs(jobs)
//     }
//   }

//   useEffect(() => {
//     const checkAuthorization = async () => {
//       const authorizedUser = await authorizeUser()

//       if (!authorizedUser) {
//         navigate('/login')
//       }
//     }
//     checkAuthorization()
//     getDbJobs()
//     setLoading(false)
//   }, [])

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value)
//   }

//   const handleJobChange = async (id, field, value) => {
//     await updateJobProp(id, {
//       [field]: value,
//     })
//   }
//   const handleInputChange = async (id, field, value) => {
//     setJobs((prevJobs) =>
//       prevJobs.map((job) =>
//         job._id === id ? { ...job, [field]: value } : job,
//       ),
//     )
//   }

//   const handleAddJob = async () => {
//     const newJob = {
//       date: new Date(),
//       source: '',
//       company: '',
//       title: '',
//       rate: '',
//       jd: '',
//       jobLink: '',
//       profile: '',
//       status: '',
//       interviewee: '',
//       remarks: '',
//     }

//     ;(await createJob(newJob)) && getDbJobs()
//   }

//   const filteredJobs = jobs.filter((item) => {
//     // Check if search key is present in any of the specified columns
//     if (filterColumns.length) {
//       for (const column of filterColumns) {
//         if (item[column]?.toLowerCase().includes(search.toLowerCase())) {
//           return true
//         }
//       }
//       return false
//     } else {
//       return Object.values(item)
//         .join('')
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     }
//   })

//   const handleRemoveRow = async (index) => {
//     const { _id } = jobs[index]
//     ;(await deleteJob(_id)) && getDbJobs()
//   }
//   return (
//     <div>
//       <Spin spinning={loading}>
//         <label htmlFor="search-input" className="search-field">
//           <span>Search: </span>
//           <input
//             id="search-input"
//             type="text"
//             value={search}
//             onChange={handleSearchChange}
//             autoComplete="off"
//           />
//           <Dropdown overlay={menu} trigger={['click']}>
//             <Button
//               className="ant-dropdown-link"
//               onClick={(e) => e.preventDefault()}
//             >
//               Search by column <DownOutlined />
//             </Button>
//           </Dropdown>
//         </label>

//         <Button onClick={handleAddJob}>Add Job</Button>
//         {jobs.length ? <DownloadCSV data={jobs} filename="mydata.csv" /> : ''}

//         <table className="my-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Source</th>
//               <th>Company Name</th>
//               <th>Title</th>
//               <th>Rate</th>
//               <th>JD</th>
//               <th>Job Link</th>
//               <th>Profile</th>
//               <th>Status</th>
//               <th>Interviewee</th>
//               <th>Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredJobs.map((job, index) => (
//               <tr key={job._id}>
//                 <td>
//                   <input
//                     type="date"
//                     value={job?.date?.slice(0, 10)}
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'date', e.target.value)
//                       handleJobChange(job._id, 'date', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={job.source}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'source', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'source', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={job.company}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'company', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'company', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={job.title}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'title', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'title', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={job.rate}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'rate', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'rate', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <textarea
//                     value={job.jd}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'jd', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'jd', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="url"
//                     value={job.jobLink}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'jobLink', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'jobLink', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="url"
//                     value={job.profile}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'profile', e.target.value)
//                     }
//                     onChange={(e) => {
//                       handleInputChange(job._id, 'profile', e.target.value)
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <select
//                     value={job.status}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'status', e.target.value)
//                     }
//                     onChange={(e) =>
//                       handleInputChange(job._id, 'status', e.target.value)
//                     }
//                   >
//                     <option value="Applied">Applied</option>
//                     <option value="Screening">Screening</option>
//                     <option value="Interview">Interview</option>
//                     <option value="Offer">Offer</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={job.interviewee}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'interviewee', e.target.value)
//                     }
//                     onChange={(e) =>
//                       handleInputChange(job._id, 'interviewee', e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     value={job.remarks}
//                     onBlur={(e) =>
//                       handleJobChange(job._id, 'remarks', e.target.value)
//                     }
//                     onChange={(e) =>
//                       handleInputChange(job._id, 'remarks', e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <button onClick={() => handleRemoveRow(index)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Spin>
//     </div>
//   )
// }

// export default JobTable
