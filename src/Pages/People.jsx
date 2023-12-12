import UserCards from "../Components/UserCards";
import "./People.css"
import UserSidebar from "../Components/UserSidebar";


export default function People() {
  return (
    <div className="people-container">
      <UserSidebar></UserSidebar>
      <UserCards />
    </div>
  )
}