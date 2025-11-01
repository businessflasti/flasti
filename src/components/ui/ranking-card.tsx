"use client";

import React from 'react';

const RankingCard = () => {
  return (
    <div className="ranking-card">
      <p className="title1">#33</p>
      <p className="title2">Impulsado</p>
      <p className="title2">por Flasti LLC.</p>
      <svg className="svg" xmlns="http://www.w3.org/2000/svg" width={94} height={94} viewBox="0 0 94 94" fill="none">
        {/* Círculo exterior */}
        <path d="M47 5C25.46 5 8 22.46 8 44C8 65.54 25.46 83 47 83C68.54 83 86 65.54 86 44C86 22.46 68.54 5 47 5ZM47 15C63.02 15 76 27.98 76 44C76 60.02 63.02 73 47 73C30.98 73 18 60.02 18 44C18 27.98 30.98 15 47 15Z" fill="#FAD74A" />
        {/* Círculo interior */}
        <path d="M47 25C36.507 25 28 33.507 28 44C28 54.493 36.507 63 47 63C57.493 63 66 54.493 66 44C66 33.507 57.493 25 47 25ZM47 35C52.037 35 56 38.963 56 44C56 49.037 52.037 53 47 53C41.963 53 38 49.037 38 44C38 38.963 41.963 35 47 35Z" fill="#FAD74A" />
      </svg>
      <style jsx>{`
        .ranking-card {
          position: relative;
          width: 140px;
          height: 60px;
          background: rgb(23,23,23);
          border-radius: 8px;
          padding: 8px;
          padding-left: 60px;
        }

        .svg {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 44px;
          height: 44px;
        }

        .title1 {
          color: white;
          font-weight: 700;
          font-size: 20px;
          line-height: 18px;
        }

        .title2 {
          color: white;
          font-weight: 700;
          font-size: 10px;
          line-height: 10px;
        }
      `}</style>
    </div>
  );
};

export default RankingCard;