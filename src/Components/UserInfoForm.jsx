import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DataContext from '../contexts/DataProvider';
import './UserInfoForm.css';

const API = process.env.REACT_APP_API_URL;

const UserInfoForm = ({ currentUsername, onSubmit }) => {
    const navigate = useNavigate();
    const { people, subjects } = useContext(DataContext);

    const formRef = useRef(null);

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

    useEffect(() => {
        const user = people.find(person => person.username === currentUsername);
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                gender: user.gender || '',
                age: user.age || '',
                country: user.country || '',
                city: user.city || '',
                profileImage: user.profile_image_url || '',
                bio: user.bio || '',
                contactInfo: user.contact_info || '',
                subjectInterests: user.subject_interest ? user.subject_interest.split(',') : [],
            });
        }
    }, [people, currentUsername]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formElements = formRef.current.elements;

        const updatedFormData = {
            firstName: formElements.firstName.value,
            lastName: formElements.lastName.value,
            gender: formElements.gender.value,
            age: formElements.age.value ? parseInt(formElements.age.value, 10) : null,
            country: formElements.country.value,
            city: formElements.city.value,
            profileImage: formElements.profileImage.value,
            bio: formElements.bio.value,
            contactInfo: formElements.contactInfo.value,
            subjectInterests: Array.from(formElements.subjectInterests)
                .filter(input => input.checked)
                .map(input => input.value),
        };

        try {
            const response = await fetch(`${API}/user/${currentUsername}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            if (onSubmit) onSubmit(data);
            navigate(`/${currentUsername}`);
        } catch (error) {
            console.error('Error updating user info', error);
        }
    };

    const getSubjectNames = (subjectIds) => {
        return subjectIds.map(id => {
            const subject = subjects.find(sub => sub.subject_id === id);
            return subject ? subject.subject_name : id;
        }).join(', ');
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="user-info-form">
            <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    defaultValue={formData.firstName}
                    required
                />
            </label>

            <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    defaultValue={formData.lastName}
                    required
                />
            </label>

            <label>
                Gender:
                <input
                    type="text"
                    name="gender"
                    defaultValue={formData.gender}
                />
            </label>

            <label>
                Age:
                <input
                    type="number"
                    name="age"
                    defaultValue={formData.age}
                />
            </label>

            <label>
                Country:
                <input
                    type="text"
                    name="country"
                    defaultValue={formData.country}
                />
            </label>

            <label>
                City:
                <input
                    type="text"
                    name="city"
                    defaultValue={formData.city}
                />
            </label>

            <label>
                Profile Image URL:
                <input
                    type="text"
                    name="profileImage"
                    defaultValue={formData.profileImage}
                />
            </label>

            <label>
                BIO:
                <textarea
                    name="bio"
                    defaultValue={formData.bio}
                />
            </label>

            <label>
                Contact Info:
                <input
                    type="text"
                    name="contactInfo"
                    defaultValue={formData.contactInfo}
                />
            </label>

            <fieldset>
                <legend>Subject Interests</legend>
                {subjects.map((subject) => (
                    <label key={subject.subject_id}>
                        <input
                            type="checkbox"
                            name="subjectInterests"
                            value={subject.subject_id}
                            defaultChecked={formData.subjectInterests.includes(subject.subject_id)}
                        />
                        {subject.subject_name}
                    </label>
                ))}
            </fieldset>

            <div>
                <strong>Interested Subjects:</strong> {getSubjectNames(formData.subjectInterests)}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default UserInfoForm;