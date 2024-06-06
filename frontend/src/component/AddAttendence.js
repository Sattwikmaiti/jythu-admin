import React, { useState } from 'react';
import axios from 'axios';
import './AddAttendence.css';

const AddAttendance = ({ id}) => {
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState('');
  const [rating, setRating] = useState(0);
const server=process.env.REACT_APP_SERVER_URL
  const handleAdd = async () => {
    console.log(date,attendance,rating)
    try {
       // Ensures yyyy-mm-dd format
        const response = await axios.post(`${server}/api/auth/users/attendence-rating/${id}`, {
          date,
         attendence: attendance,
          rating
        });
        console.log(response.data);
     
      setDate('');
      setAttendance('');
      setRating('');
    } catch (error) {
      console.error('Error adding attendance:', error);
    }
  };

  return (
    <div className="add-attendance-container">
      <h2>Add Attendance</h2>
      <form>
        <div className="form-group">
          <label>Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Attendance:</label>
          <select 
            value={attendance} 
            onChange={(e) => setAttendance(e.target.value)} 
            required
          >
            <option value="" disabled>Select Attendance</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input 
            type="number" 
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
            required 
          />
        </div>
        <button type="button" onClick={handleAdd}>Add</button>
      </form>
    </div>
  );
}

export default AddAttendance;
