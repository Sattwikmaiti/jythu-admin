// // AddAdminForm.js
// import React, { useState,useEffect } from 'react';
// import axios from 'axios';
// import './AddAdmin.css'; // Import CSS file
// const AddAdminForm = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const[admins,setAdmins]=useState(null)
//   useEffect(() => {
//     const fetchAdmins = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/admin/alladmins');
//         setAdmins(response.data);
//       } catch (error) {
//         console.error('Error fetching admins:', error);
//       }
//     };
//     fetchAdmins();
//   },[admins])
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/admin/addadmin', { username, email });
//       alert(response.data.message);
//       // Reset form fields
//       setUsername('');
//       setEmail('');
//       setErrorMessage('');
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setErrorMessage('Unauthorized. You must be an admin to perform this action.');
//       } else {
//         setErrorMessage('Failed to add admin. Please try again later.');
//       }
//       console.error('Error adding admin:', error);
//     }
//   };
//   return (
//     <div className="add-admin-container">
//       <h2>Add New Admin</h2>
//       <form onSubmit={handleSubmit} className="add-admin-form">
//         <label>
//           Username:
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//         </label>
//         <label>
//           Email:
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </label>
//         <button type="submit">Add Admin</button>
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//       </form>
//       {
//         admins && (
//           <div className="admins-list">
//             <h2>Admins</h2>
//             <ul>
//               {admins.map((admin) => (
//                 <li key={admin._id} onClick={async()=>{await axios.delete(`http://localhost:5000/api/admin/deleteadmin/${admin._id}`)}}>{admin.username} ({admin.email})</li>
//               ))}
//             </ul>
//           </div>
//         )
//       }
//     </div>
//   );
// };
// export default AddAdminForm;
"use strict";