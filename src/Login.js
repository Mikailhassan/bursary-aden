
// import backgroundImage from './images/GERISTRATION BACKGROUND.jpg';

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col } from 'react-bootstrap';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://127.0.0.1:5000/login', {
//         username,
//         password,
//       });

//       localStorage.setItem('token', response.data.token);
//       navigate('/ApplicantDashboard'); // Navigate to profile after successful login
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh', // Ensure the background covers the full height of the screen
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <div className="login-container" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
//               <h2 className="text-center">Login</h2>
//               {error && <p className="error-message">{error}</p>}
//               <Form onSubmit={handleLogin}>
//                 <Form.Group controlId="username">
//                   <Form.Label>Admission Number / ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="password">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" block className="mt-3">
//                   Login
//                 </Button>
//               </Form>

//               {/* Registration Link */}
//               <div className="text-center mt-3">
//                 <p>Don't have an account? <Link to="/register">Register here</Link></p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;








// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// function Login() {
//   const [email, setEmail] = useState('');  // Use email instead of username
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       // Send login data to backend (adjusted field names)
//       const response = await axios.post('http://127.0.0.1:5000/login', {
//         email,  // backend expects email for login
//         password,
//       });

//       // Store the JWT token returned from the backend
//       localStorage.setItem('token', response.data.access_token);

//       // Redirect to Applicant Dashboard after successful login
//       navigate('/ApplicantDashboard');
//     } catch (err) {
//       // Handle login errors
//       setError('Invalid credentials, please try again.');
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh', // Ensure the background covers the full height of the screen
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <div className="login-container" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
//               <h2 className="text-center">Login</h2>

//               {/* Show error message if login fails */}
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="password">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" block className="mt-3">
//                   Login
//                 </Button>
//               </Form>

//               {/* Registration Link */}
//               <div className="text-center mt-3">
//                 <p>Don't have an account? <Link to="/register">Register here</Link></p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;







// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// function Login() {
//   const [email, setEmail] = useState(''); // Email state
//   const [password, setPassword] = useState(''); // Password state
//   const [error, setError] = useState(''); // Error message state
//   const navigate = useNavigate(); // Navigation hook

//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear previous errors

//     try {
//       const response = await axios.post('http://127.0.0.1:5000/login', {
//         email,
//         password,
//       });

//       alert('Login successful:', response.data); // Debugging log
//       localStorage.setItem('token', response.data.access_token); // Save token
//       navigate('/ApplicantDashboard'); // Redirect to ApplicantDashboard
//     } catch (err) {
//       console.error('Login error:', err.response || err.message); // Debugging log
//       setError(
//         err.response?.data?.message ||
//           'Invalid credentials or server error. Please try again.'
//       ); // Display error
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <div
//               style={{
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//               }}
//             >
//               <h2 className="text-center">Login</h2>

//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     placeholder="Enter your email"
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="password" className="mt-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Enter your password"
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="mt-4 w-100">
//                   Login
//                 </Button>
//               </Form>

//               <div className="text-center mt-3">
//                 <p>
//                   Don't have an account? <Link to="/register">Register here</Link>
//                 </p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// function Login() {
//   const [email, setEmail] = useState(''); // Email state
//   const [password, setPassword] = useState(''); // Password state
//   const [error, setError] = useState(''); // Error message state
//   const [success, setSuccess] = useState(''); // Success message state
//   const navigate = useNavigate(); // Navigation hook
  
  
//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear previous errors
//     setSuccess(''); // Clear previous success message
  
//     try {
//       const response = await axios.post('http://127.0.0.1:5000/login', {
//         email,
//         password,
//       });
  
//       const { access_token, user } = response.data; // Extract token and user info
//       localStorage.setItem('token', access_token); // Save token
//       localStorage.setItem('user', JSON.stringify(user)); // Save user info
  
//       setSuccess('Login successful! Redirecting...'); // Set success message
  
//       // Redirect to ApplicantDashboard by default
//       setTimeout(() => {
//         navigate('/ApplicantDashboard'); // Always redirect to ApplicantDashboard
//       }, 2000); // 2-second delay
//     } catch (err) {
//       console.error('Login error:', err.response || err.message); // Debugging log
//       setError(
//         err.response?.data?.message ||
//         'Invalid credentials or server error. Please try again.'
//       ); // Display error
//     }
//   };
  

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <div
//               style={{
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//               }}
//             >
//               <h2 className="text-center">Login</h2>

//               {error && <Alert variant="danger">{error}</Alert>}
//               {success && <Alert variant="success">{success}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     placeholder="Enter your email"
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="password" className="mt-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Enter your password"
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="mt-4 w-100">
//                   Login
//                 </Button>
//               </Form>

//               <div className="text-center mt-3">
//                 <p>
//                   Don't have an account? <Link to="/register">Register here</Link>
//                 </p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;






// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// function Login() {
//   const [email, setEmail] = useState(''); // Email state
//   const [password, setPassword] = useState(''); // Password state
//   const [error, setError] = useState(''); // Error message state
//   const [success, setSuccess] = useState(''); // Success message state
//   const navigate = useNavigate(); // Navigation hook
  
  
//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear previous errors
//     setSuccess(''); // Clear previous success message
  
//     try {
//       const response = await axios.post('http://127.0.0.1:5000/login', {
//         email,
//         password,
//       });
  
//       const { access_token, user } = response.data; // Extract token and user info
//       localStorage.setItem('token', access_token); // Save token
//       localStorage.setItem('user', JSON.stringify(user)); // Save user info
  
//       setSuccess('Login successful! Redirecting...'); // Set success message
  
//       // Redirect to ApplicantDashboard by default
//       setTimeout(() => {
//         navigate('/ApplicantDashboard'); // Always redirect to ApplicantDashboard
//       }, 2000); // 2-second delay
//     } catch (err) {
//       console.error('Login error:', err.response || err.message); // Debugging log
//       setError(
//         err.response?.data?.message ||
//         'Invalid credentials or server error. Please try again.' 
//       ); // Display error
//     }
//   };
  

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <div
//               style={{
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//               }}
//             >
//               <h2 className="text-center">Login</h2>

//               {error && <Alert variant="danger">{error}</Alert>}
//               {success && <Alert variant="success">{success}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     placeholder="Enter your email"
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="password" className="mt-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Enter your password"
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="mt-3 w-100">
//                   Login
//                 </Button>
//               </Form>

//               <div className="mt-3 text-center">
//                 <Link to="/register">Don't have an account? Register here</Link>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// function Login() {
//   const [email, setEmail] = useState(''); // Email state
//   const [password, setPassword] = useState(''); // Password state
//   const [error, setError] = useState(''); // Error message state
//   const [success, setSuccess] = useState(''); // Success message state
//   const navigate = useNavigate(); // Navigation hook
  
//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear previous errors
//     setSuccess(''); // Clear previous success message

//     const [backEndUser, setBackEndUser] = useState('');
    
//     // try {
//     //   const response = await axios.post('http://127.0.0.1:5000/auth/login', {
//     //     email,
//     //     password,
//     //   });
  
//     //   const { token, user } = response.data; // Extract token and user info
//     //   localStorage.setItem('token', token); // Save token
//     //   localStorage.setItem('user', JSON.stringify(user)); // Save user info
  
//     //   setSuccess('Login successful! Redirecting...'); // Set success message
//     event.preventDefault()
//     fetch('http://127.0.0.1:5000/auth/login',{
//       method:"POST",
//       headers:{
//         "content-type":"application/json",
//       },
//       body:JSON.stringify({ }),
//     })

  
// // Redirect to ApplicantDashboard by default
// setTimeout(() => {
//   navigate('/ApplicantDashboard');
// }, 2000); // 2-second delay
//     } catch (err) {
//       console.error('Login error:', err.response || err.message); // Debugging log
//       setError(
//         err.response?.data?.message ||
//         'Invalid credentials or server error. Please try again.' // Display error
//       );
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')", // Background image URL
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <div
//               style={{
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//               }}
//             >
//               <h2 className="text-center">Login</h2>

//               {error && <Alert variant="danger">{error}</Alert>}
//               {success && <Alert variant="success">{success}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     placeholder="Enter your email"
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="password" className="mt-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Enter your password"
//                   />
//                 </Form.Group>

//                 <Button variant="primary" type="submit" className="mt-3 w-100">
//                   Login
//                 </Button>
//               </Form>

//               <div className="mt-3 text-center">
//                 <Link to="/register">Don't have an account? Register here</Link>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { user, token } = data;

      // Use the login method from AuthContext
      login(user, token);

      setSuccess('Login successful! Redirecting...');

      // Temporarily send all users to AdminDashboard
      setTimeout(() => {
        navigate('/AdminDashboard');
      }, 2000);

    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message || 'Invalid credentials or server error. Please try again.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/GERISTRATION BACKGROUND.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h2 className="text-center">Login</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Login
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <Link to="/register">Don't have an account? Register here</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;