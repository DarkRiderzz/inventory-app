import "./InfoBox.scss";
import { Link } from "react-router-dom";

const InfoBox = ({ bgColor, title, count, icon, link }) => {
  return (
    <Link to={`/${link}`}>
      <div>
        <div className={`info-box ${bgColor}`}>
          <span className="info-icon --color-white">{icon}</span>
          <span className="info-text">
            <p>{title}</p>
            <h4>{count}</h4>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default InfoBox;
