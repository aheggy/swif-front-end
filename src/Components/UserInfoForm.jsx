import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserInfoForm.css';
import DataContext, { DataProvider } from '../contexts/DataProvider';
const API = process.env.REACT_APP_API_URL


const UserInfoForm = ({ userData, onSubmit }) => {
    // console.log("userData is ", userData)
    const navigate = useNavigate()
    const {people} = useContext(DataContext)
    console.log(people)
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
        const storedUserData = people;
        console.log(storedUserData)
        if (storedUserData) {
            setFormData({
                firstName: storedUserData.first_name || '',
                lastName: storedUserData.last_name || '',
                gender: storedUserData.gender || '',
                age: storedUserData.age || '',
                country: storedUserData.country || '',
                city: storedUserData.city || '',
                profileImage: storedUserData.profile_image_url || '',
                bio: storedUserData.bio || '',
                contactInfo: storedUserData.contact_info || '',
                subjectInterests: storedUserData.subject_interest ? storedUserData.subject_interest.split(',') : [],
            });
        }
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const username = storedUserData.username
        try {
            const response = await axios.put(`${API}/user/${username}`, formData);
            if (onSubmit) onSubmit(response.data);
            navigate(`/${username}`)
            
        } catch (error) {
            console.error('Error updating user info', error);
        }
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