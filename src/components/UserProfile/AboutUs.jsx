import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

export default function AboutUs() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const dk = theme === "dark";

  return (
    <div className="about-container">
      <button className="backBtn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="about-card">
        <h1>Coming Soon 🚀</h1>
        <p>We are working on something awesome for you.</p>
      </div>

      <style>{`
        .about-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: ${dk ? "#121212" : "linear-gradient(135deg, #f5f7fa, #e8f5e9)"};
          font-family: Arial, sans-serif;
          position: relative;
          transition: background 0.3s ease;
        }

        .backBtn {
          position: absolute;
          top: 25px;
          left: 25px;
          width: 45px;
          height: 45px;
          border: none;
          border-radius: 50%;
          background: #28a745;
          color: white;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: 0.3s;
        }

        .backBtn:hover {
          transform: translateY(-2px);
          background: #218838;
        }

        .about-card {
          background: ${dk ? "#1e1e1e" : "#fff"};
          padding: 45px 35px;
          border-radius: 18px;
          box-shadow: ${dk ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.12)"};
          text-align: center;
          width: 300px;
          animation: fadeIn 0.6s ease;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .about-card:hover {
          transform: translateY(-5px);
        }

        .about-card h1 {
          font-size: 24px;
          color: #28a745;
          margin-bottom: 10px;
        }

        .about-card p {
          font-size: 14px;
          color: ${dk ? "#aaa" : "#666"};
          line-height: 1.6;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}