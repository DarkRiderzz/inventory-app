import "./InfoBox.scss";
import { Link } from "react-router-dom";

const InfoBox = ({ bgColor, title, count, icon, link }) => {
  return (
    <Link to={`/${link}`}>
      <div>
        <div className={`info-box `}>
          <span className={`info-icon --color-white ${bgColor}`}>{icon}</span>
          <span className="info-text">
            <p className={`${bgColor}`}>{title}</p>
            <h4 className={`${bgColor}`}>{count}</h4>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default InfoBox;
