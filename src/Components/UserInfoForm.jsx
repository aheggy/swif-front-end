const UserInfoForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      gender: '',
      age: '',
      country: '',
      bio: '',
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
  
        {/* <label>
          BIO:
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </label> */}
  
        <button type="submit">Submit</button>
      </form>
    );
  };
  
  export default UserInfoForm;