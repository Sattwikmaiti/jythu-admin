import React from 'react';
import Last30DaysRatingChart from './Last30DaysRatingChart';
import AttendancePieChart from './AttendancePieChart';
import MonthlyAttendanceChart from './MonthlyAttendanceChart';

const Dashboard = ({ attendanceRating }) => {
  
  // Assuming attendanceRating is an array of objects with 'date', 'attendance', and 'rating' properties
  const presentCount =attendanceRating.filter(item => item.attendence === 'Present').length;
const absentCount = attendanceRating.filter(item => item.attendence === 'Absent').length;

  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '10px' ,padding:'2rem',color:'white',backgroundColor:'white'}}>
      <div >
       
       <center>
        <div style={{ height: '450px', width: '400px' , borderRadius: '8px',}}>
        <h2>Last 30 Days Rating</h2>
          <Last30DaysRatingChart data={attendanceRating} />

        </div>
        </center>
      </div>
      <div style={{ height: '400px', width: '100%',display:'flex',justifyContent: 'center', alignItems: 'center',flexDirection:'row' ,color:'black',background:'white'}}>
    <div >
      <h4>Attendance Percentage  : {(presentCount * 100.0)/(presentCount+absentCount)} </h4>
        <AttendancePieChart presentCount={presentCount} absentCount={absentCount} />
      </div>
    </div>
      
      <div style={{ height: '450px', width: '400px' , borderRadius: '8px', }}>
        <h2>Monthly Attendance</h2>
        <MonthlyAttendanceChart data={attendanceRating} />
      </div>
     

    </div>
    
    
    </>
  );
};

export default Dashboard;
