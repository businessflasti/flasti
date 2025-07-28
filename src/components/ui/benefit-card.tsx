"use client";

import React from 'react';

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: {
    value: string;
    label: string;
  }[];
  gradientColor: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ title, description, icon, stats, gradientColor, imageUrl, imageAlt, imagePosition = 'center' }) => {
  return (
    <div className="benefit-card group">
      <div className="card-container">
        <div className="top-section" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: imagePosition }}>
          <div className="icons-section">
            <div className="logo-container">
              {icon}
            </div>
          </div>
        </div>
        <div className="bottom-section">
          <span className="card-title">{title}</span>
          <p className="card-description">{description}</p>
          <div className="stats-row">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .benefit-card {
          width: 280px;
          margin: 0 auto;
        }

        .card-container {
          width: 100%;
          height: 350px;
          border-radius: 20px;
          background: #232323;
          padding: 5px;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 30px 0px;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
        }

        .benefit-card:hover .card-container {
          transform: scale(1.05);
        }

        .top-section {
          height: 180px;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          padding: 3px;
        }

        .benefit-image {
          position: absolute;
          top: 3px;
          left: 3px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          object-fit: cover;
          border-radius: 12px;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .benefit-card:hover .benefit-image {
          transform: scale(1.05);
        }

        .icons-section {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 40px;
          height: 40px;
          background: rgba(35, 35, 35, 0.9);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-container :global(svg) {
          height: 22px;
          width: 22px;
          fill: white;
          color: white;
          stroke-width: 2;
        }

        .bottom-section {
          margin-top: 15px;
          padding: 15px 10px;
        }

        .card-title {
          display: block;
          font-size: 16px;
          font-weight: bold;
          font-family: 'Outfit', sans-serif;
          color: white;
          text-align: center;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .card-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          line-height: 1.4;
          margin-bottom: 15px;
          font-family: 'Outfit', sans-serif;
        }

        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
        }

        .stat-item {
          flex: 1;
          text-align: center;
          padding: 5px;
          color: #fff;
        }

        .stat-item:nth-child(2) {
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-value {
          font-size: 14px;
          font-weight: bold;
          display: block;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 10px;
          opacity: 0.8;
          display: block;
        }

        @media (max-width: 768px) {
          .benefit-card {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default BenefitCard;