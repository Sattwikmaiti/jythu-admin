import React from 'react';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
ChartJS.register(ArcElement, Tooltip, Legend);

// Utility function to parse fileDetails string
const parseFileDetails = (fileDetails) => {
  if (!fileDetails) {
    console.error('fileDetails is undefined or null');
    return [];
  }

  // Trim whitespace and split by newline
  const lines = fileDetails.trim().split('\n');
  
  // Split headers by comma and trim
  const headers = lines[0].split(',').map(header => header.trim());

  // Check if headers are parsed correctly
  if (headers.length === 0) {
    console.error('No headers found');
    return [];
  }

  // Map over the lines to create an array of objects
  return lines.slice(1).map((line, lineIndex) => {
    const values = line.split(',').map(value => value.trim());
    
    // Ensure the number of values matches the number of headers
    if (values.length !== headers.length) {
      console.error(`Mismatch between headers and values at line ${lineIndex + 2}`);
      return null; // Skip this entry or handle the error as needed
    }

    let entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });

    // Log the entry for debugging
    
    return entry;
  }).filter(entry => entry !== null); // Filter out any null entries due to mismatches
};


// React component to display pie charts
const generateColors = (numColors) => {
  return Array.from({ length: numColors }, (_, i) => `hsl(${(i * 360) / numColors}, 70%, 70%)`);
};

// React component to display pie charts
const FileDetailsPieChart = ({ file }) => {
  const data = parseFileDetails(file.fileDetails);

  const colors = generateColors(data.length);

  const usageTimeData = {
    labels: data.map(item => item.Application),
    datasets: [
      {
        label: 'Usage Time (seconds)',
        data: data.map(item => parseFloat(item['UsageTime(seconds)'])),
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const openCountData = {
    labels: data.map(item => item.Application),
    datasets: [
      {
        label: 'Open Count',
        data: data.map(item => parseInt(item.OpenCount, 10)),
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '400px' }}>
      <h2>{file.filename}</h2>
      <div>
        <h4>starttime : {dayjs(file.starttime).format('YYYY-MM-DD')}</h4>
        <h4>endtime :  {dayjs(file.endtime).format('YYYY-MM-DD')}</h4>
        <h3>Usage Time</h3>
        <Pie data={usageTimeData} />
      </div>
      <div>
        <h3>Open Count</h3>
        <Pie data={openCountData} />
      </div>
    </div>
  );
};


const FileDetailsChart = ({data}) => (
  <div style={{ height: '100vh' }}>

<h2 style={{ textAlign: 'center', margin: '150px 20px',color:'black' ,backgroundColor:'#BCEBD7',padding:'2rem'}}>Daily Employee App Usage Chart</h2>
   
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '50px',backgroundColor:'#45B08C',height:'700px',padding:'3rem',overflowY:'scroll' }}>
    {data
  .sort((a, b) => new Date(b.starttime) - new Date(a.starttime))
  .map((file, index) => (
    <div key={index} style={{ backgroundColor: 'white', padding: '3rem' }}>
      <FileDetailsPieChart file={file} />
    </div>
  ))}
    </div>
  </div>
);



export default FileDetailsChart


// import React, { useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { parseISO, format } from 'date-fns';

// ChartJS.register(ArcElement, Tooltip, Legend);

// // Utility function to parse fileDetails string
// const parseFileDetails = (fileDetails) => {
//   if (!fileDetails) {
//     console.error('fileDetails is undefined or null');
//     return [];
//   }

//   const lines = fileDetails.trim().split('\n');
//   const headers = lines[0].split(',').map(header => header.trim());

//   if (headers.length === 0) {
//     console.error('No headers found');
//     return [];
//   }

//   return lines.slice(1).map((line, lineIndex) => {
//     const values = line.split(',').map(value => value.trim());

//     if (values.length !== headers.length) {
//       console.error(`Mismatch between headers and values at line ${lineIndex + 2}`);
//       return null;
//     }

//     let entry = {};
//     headers.forEach((header, index) => {
//       entry[header] = values[index];
//     });

//     return entry;
//   }).filter(entry => entry !== null);
// };

// const generateColors = (numColors) => {
//   return Array.from({ length: numColors }, (_, i) => `hsl(${(i * 360) / numColors}, 70%, 70%)`);
// };

// const FileDetailsPieChart = ({ file }) => {
//   const data = parseFileDetails(file.fileDetails);

//   const colors = generateColors(data.length);

//   const usageTimeData = {
//     labels: data.map(item => item.Application),
//     datasets: [
//       {
//         label: 'Usage Time (seconds)',
//         data: data.map(item => parseFloat(item['UsageTime(seconds)'])),
//         backgroundColor: colors,
//         borderColor: '#ffffff',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const openCountData = {
//     labels: data.map(item => item.Application),
//     datasets: [
//       {
//         label: 'Open Count',
//         data: data.map(item => parseInt(item.OpenCount, 10)),
//         backgroundColor: colors,
//         borderColor: '#ffffff',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div style={{ margin: '0 auto', maxWidth: '400px' }}>
//       <h2>{file.filename}</h2>
//       <div>
//         <h4>starttime : {file.starttime}</h4>
//         <h4>endtime : {file.endtime}</h4>
//         <h3>Usage Time</h3>
//         <Pie data={usageTimeData} />
//       </div>
//       <div>
//         <h3>Open Count</h3>
//         <Pie data={openCountData} />
//       </div>
//     </div>
//   );
// };

// const FileDetailsChart = ({ data }) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const filteredData = selectedDate
//     ? data.filter(file => format(parseISO(file.endtime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
//     : data;

//   return (
//     <div style={{ height: '100vh' }}>
//       <h2 style={{ textAlign: 'center', margin: '150px 20px' }}>Daily Employee App Usage Chart</h2>
//       <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           dateFormat="yyyy-MM-dd"
//           placeholderText="Select a date"
//         />
//       </div>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '50px', backgroundColor: 'gainsboro', height: '700px', padding: '3rem', overflowY: 'scroll' }}>
//         {filteredData.map((file, index) => (
//           <div key={index} style={{ backgroundColor: 'white', padding: '3rem' }}>
//             <FileDetailsPieChart file={file} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FileDetailsChart;
