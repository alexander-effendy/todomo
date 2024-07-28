import { Routes, Route } from 'react-router-dom';

import Home from './screens/Home';

const Pages = () => {
  return (
    <div className="h-full">
      <Routes>
				<Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default Pages;