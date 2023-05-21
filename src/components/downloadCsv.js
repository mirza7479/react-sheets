import React from 'react'

function DownloadCSV(props) {
  const { data, filename } = props

  const csvData = encodeCSV(data)
  const csvUrl = URL.createObjectURL(new Blob([csvData], { type: 'text/csv' }))

  return (
    <a href={csvUrl} download={filename}>
      Download CSV
    </a>
  )
}

function encodeCSV(data) {
  const headers = Object.keys(data[0]).filter(
    (key) => key !== '_id' && key !== '__v',
  )
  // .map((key) => key.toUpperCase())
  const rows = data.map((row) => {
    return headers
      .map((header) => {
        return `"${row[header]}"`
      })
      .join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

export default DownloadCSV
