import React from 'react';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.trunc(rating);

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => (
        <span key={index}>
          {index < filledStars ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
