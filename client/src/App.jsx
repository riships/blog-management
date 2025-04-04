import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './views/Signup';
import Login from './views/Login';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotFound from './components/NotFound';
import Blogs from './views/Blogs';
import AddBlog from './views/AddBlog';
import BlogView from './views/BlogView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='blogs' element={<Blogs />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='updateBlog/:id' element={<AddBlog />} />
          <Route path='blog/:id' element={<BlogView />} />
        </Route>

        {/* Catch-All 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
