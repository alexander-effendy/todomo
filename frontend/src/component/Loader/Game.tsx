import React from 'react';
import '../../styles.css';

interface LoadingProps {
  className: string
}

const Loader: React.FC<LoadingProps> = ({ className }) => {
  return (
    <div className={`loader-overlay`}>
      <div className={`loader ${className}`}></div>
    </div>
  );
};

export default Loader;
