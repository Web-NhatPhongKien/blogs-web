import { useAuth }
    from "../context/auth.context";
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-avatar">
                    <i className="fi fi-rr-user"></i>
                </div>

                <h2> {user.personal_info.username} </h2>

                <p> {user.personal_info.email} </p>

                <div className="profile-info">

                    <p>
                        <strong>
                            Role:
                        </strong>{" "}
                        {user.role}
                    </p>

                </div>

                <button className="logout-btn" onClick={handleLogout} >
                    Logout
                </button>

            </div>
        </div>
    );
};

export default Profile;
