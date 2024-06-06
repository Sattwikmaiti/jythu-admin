import React from 'react';

const AggregateRating = ({ data }) => {
  const presentDays = data.filter(item => item.attendence==='Present');
  const totalRating = presentDays.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = totalRating / presentDays.length;

  let grade;
  if (averageRating >= 4) {
    grade = 'Excellent Employee';
  } else if (averageRating >= 3) {
    grade = 'Good Employee';
  } else {
    grade = 'Satisfactory Employee'; // or whatever grading scale you want for ratings below 3
  }

  return  <div style={{ width:'300px',padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px',color: '#2c3e50', }}>Average Rating: {isNaN(averageRating.toFixed(2))?0:averageRating.toFixed(2)}</div>
  <div style={{ fontSize: '16px', color: '#2c3e50', marginBottom: '20px' }}>Grade: {grade}</div>
  <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
    <strong>Legend:</strong>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li><span style={{ color: '#27ae60' }}>4-5: Excellent Employee</span></li>
      <li><span style={{ color: '#2980b9' }}>3-3.9: Good Employee</span></li>
      <li><span style={{ color: '#c0392b' }}>Below 3: Satisfactory Employee</span></li>
    </ul>
  </div>
</div>;
};

export default AggregateRating;
