import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfoForm.css';
const API = process.env.REACT_APP_API_URL

const UserInfoForm = ({ userData, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        country: '',
        city: '',
        profileImage: '',
        bio: '',
        contactInfo: '',
        subjectInterests: [],
    });

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${API}/subjects`);
                setSubjects(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching subjects', error);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.first_name || '',
                lastName: userData.last_name || '',
                gender: userData.gender || '',
                age: userData.age || '',
                country: userData.country || '',
                city: userData.city || '',
                profileImage: userData.profile_image_url || '',
                bio: userData.bio || '',
                contactInfo: userData.contact_info || '',
                subjectInterests: userData.subject_interest ? userData.subject_interest.split(',') : [],
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (subject) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            subjectInterests: prevFormData.subjectInterests.includes(subject)
                ? prevFormData.subjectInterests.filter(s => s !== subject)
                : [...prevFormData.subjectInterests, subject],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="user-info-form">
          <label>
              First Name:
              <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
              />
          </label>
  
          <label>
              Last Name:
              <input
                  type="text"
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
              />
          </label>
  
          <label>
              Gender:
              <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
              />
          </label>
  
          <label>
              Age:
              <input
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
              />
          </label>
  
          <label>
              Country:
              <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
              />
          </label>
  
          <label>
              City:
              <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
              />
          </label>
  
          <label>
              Profile Image URL:
              <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
              />
          </label>
  
          <label>
              BIO:
              <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
              />
          </label>
  
          <label>
              Contact Info:
              <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
              />
          </label>
  
          <fieldset>
              <legend>Subject Interests</legend>
                {subjects.map((subject, index) => (
                  <label key={subject.subject_id}>
                      <input
                          type="checkbox"
                          name="subjectInterests"
                          value={subject.subject_id} 
                          checked={formData.subjectInterests.includes(subject.subject_id)}
                          onChange={() => handleCheckboxChange(subject.subject_id)}
                      />
                      {subject.subject_name}
                  </label>
              ))}
          </fieldset>
  
          <button type="submit">Submit</button>
      </form>
  );
  
};

export default UserInfoForm;
