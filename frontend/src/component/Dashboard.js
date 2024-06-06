import React from 'react';
import Last30DaysRatingChart from './Last30DaysRatingChart';
import AttendancePieChart from './AttendancePieChart';
import MonthlyAttendanceChart from './MonthlyAttendanceChart';

const Dashboard = ({ attendanceRating }) => {
  
  // Assuming attendanceRating is an array of objects with 'date', 'attendance', and 'rating' properties
  const presentCount =attendanceRating.filter(item => item.attendence === 'Present').length;
const absentCount = attendanceRating.filter(item => item.attendence === 'Absent').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '30px' ,padding:'2rem',color:'white'}}>
      <div >
       
        <div style={{ height: '400px', width: '700px' ,padding:'20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h2>Last 30 Days Rating</h2>
          <Last30DaysRatingChart data={attendanceRating} />

        </div>
      </div>

      <div>
        
        <div style={{ height: '300px', width: '100%',padding:'10px',backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',display:'flex',justifyContent: 'center', alignItems: 'center' }}>
        <h2>Attendance Percentage</h2>
          <AttendancePieChart presentCount={presentCount} absentCount={absentCount} />
        </div>
      </div>

      <div style={{ height: '500px', width: '700px' ,padding:'10px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h2>Monthly Attendance</h2>
        <MonthlyAttendanceChart data={attendanceRating} />
      </div>

      <div >
       
      </div>
    </div>
  );
};

export default Dashboard;
