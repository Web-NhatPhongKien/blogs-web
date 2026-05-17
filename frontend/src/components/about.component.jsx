import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
    return (

        <div className={"about-user " + className}>
        
            <p className="about-user-bio">
                {bio.length ? bio : "Nothing to read here"}
            </p>

            <div className="about-user-links">
                {
                    Object.keys(social_links).map((key) => {
                        let link = social_links[key];

                        return link ? (
                            <Link to={link} key={key} target="_blank">
                                <i className={
                                    "fi " + 
                                    (key !== "website" ? "fi-brands-" + key : "fi-rr-globe") + 
                                    " about-user-icon"
                                }></i>
                            </Link>
                        ) : " ";
                    })
                }
            </div>

            <p className="about-user-joined">
                Joined on {getFullDay(joinedAt)}
            </p>

        </div>
    );
};

export default AboutUser;