import { Routes, Route } from 'react-router-dom';

import Home from './screens/Home';

const Pages = () => {
  return (
    <>
      <Routes>
				<Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default Pages;