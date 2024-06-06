import React, { useState ,useEffect} from 'react';
import dayjs from 'dayjs';
import axios from 'axios'

const FileListTable = ({ id }) => {
const [fileList,setFileList]=useState(null)
const server=process.env.REACT_APP_SERVER_URL
useEffect(() => {
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${server}/api/auth/daily-images/${id}`);
      if(response)

      setFileList(response.data)
      // Handle the response data here

      console.log("filelsit",fileList)
    } catch (error) {
      // Handle errors if any
      console.error('Error fetching data:', error);
    }
  };

  fetchData(); // Call the async function immediately

}, [id]);

  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const filteredFiles = selectedDate
    ? fileList.filter(file => formatDate(file.time) === selectedDate)
    : fileList;

  const tableCellStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: 'black',
    textAlign: 'center',
  };

  const urlColumnStyle = {
    ...tableCellStyle,
    backgroundColor: '#f1c40f',
  };

  const filenameColumnStyle = {
    ...tableCellStyle,
    backgroundColor: '#2ecc71',
  };

  const timeColumnStyle = {
    ...tableCellStyle,
    backgroundColor: '#e74c3c',
  };

  return (
    <div div style={{ textAlign: 'center', margin: '20px 20px' }}>
      <h2 style={{ textAlign: 'center', margin: '100px 20px',color:'white' }}>Image File Lists</h2>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <label htmlFor="dateFilter" style={{ marginRight: '10px' }}>Filter by Date: </label>
        <input 
          type="date" 
          id="dateFilter" 
          onChange={handleDateChange} 
          value={selectedDate}
        />
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0 20px' }}>
        <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={urlColumnStyle}>URL</th>
              <th style={filenameColumnStyle}>Filename</th>
              <th style={timeColumnStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles?.sort((a,b)=> new Date(b.time) - new Date(a.time))?.map((file, index) => (
              <tr key={index}>
                <td 
                  style={{ ...tableCellStyle, cursor: 'pointer', backgroundColor: '#f9e79f' }} 
                  onClick={() => window.open(file.url)}
                >
                  {file.url}
                </td>
                <td style={{ ...tableCellStyle, backgroundColor: '#a9dfbf' }}>{file.filename}</td>
                <td style={{ ...tableCellStyle, backgroundColor: '#f5b7b1' }}>{dayjs(file.time).format('MMM-DD-YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileListTable;
