import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL

const UserInfoForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      gender: '',
      age: '',
      country: '',
      bio: '',
      interestedSubjects: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const [subjects, setSubjects] = useState([])
    console.log(subjects)


	useEffect (() => {
		const fetchSubjects = async () =>{
			try {
				const response = await axios.get(`${API}/subjects`)
				setSubjects(response.data)
			} catch (error) {
				console.error(`Error fetching subjects`, subjects)
			}
		}

		fetchSubjects()

	}, [])
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
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
            type="text"
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
          BIO:
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </label>

        <label>
          Interested Subjects:
          <input
            type="text"
            name="subjects"
            value={formData.interestedSubjects}
            onChange={handleChange}
            required
          />
        </label>
  
        <button type="submit">Submit</button>
      </form>
    );
  };
  
  export default UserInfoForm;