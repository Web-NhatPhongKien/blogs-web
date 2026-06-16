import { Link } from "react-router-dom";

const UserCardsearch = ({ user }) => {

    let { personal_info: { username, profile_img } } = user;

    return (

        <Link to={`/user/${username}`} className="user-card">
            
            <img src={profile_img} className="user-card-avatar" />

            <div>
                <p className="user-card-username">@{username}</p>
            </div>
            
        </Link>
    );
};

export default UserCardsearch;