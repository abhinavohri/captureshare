import { Link } from 'react-router-dom';
 
export const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Capture Share</h1>
      <p>Simple screen recording for desktops right in your browser.</p>
      <Link to="/record">
        <button className="cta-button">Start Recording</button>
      </Link>
    </div>
  );
};