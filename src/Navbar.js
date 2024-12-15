import './Navbar.css';
import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignInAlt, FaTrophy, FaInfoCircle, FaFileAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from './AuthContext';

function CustomNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow navbar-custom">
      <Container>
        {/* National Government CDF Logo on the left side */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src="/images/balambala bursary logo.png" 
            alt="National Government CDF Logo" 
            style={{ width: '80px', height: 'auto', marginLeft: '-60px', marginRight: '50px' }} 
          />
          <span className="fw-bold fs-5">Balambala Bursary Management System</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto fs-6">
            <Nav.Link as={Link} to="/" className="nav-link-custom"><FaHome size={16} className="me-1" /> Home</Nav.Link>
            <Nav.Link as={Link} to="/apply-for-bursary" className="nav-link-custom"><FaFileAlt size={16} className="me-1" /> Apply For Bursary</Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom"><FaInfoCircle size={16} className="me-1" /> About Us</Nav.Link>
            <Nav.Link as={Link} to="/achievements" className="nav-link-custom"><FaTrophy size={16} className="me-1" /> Key Achievements</Nav.Link>
            
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/Registration" className="nav-link-custom"><FaUserPlus size={16} className="me-1" /> Registration</Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-link-custom"><FaSignInAlt size={16} className="me-1" /> Login</Nav.Link>
              </>
            )}

            {isAuthenticated && (
              <NavDropdown 
                title={
                  <>
                    <FaUser size={16} className="me-1" />
                    {user?.name || "Profile"}
                  </>
                } 
                id="basic-nav-dropdown" 
                className="nav-link-custom"
              >
                {user?.role === 'admin' ? (
                  <>
                    <NavDropdown.Item as={Link} to="/AdminDashboard">Admin Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/achievements">Manage Achievements</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/ApplicantDashboard">Applicant Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;