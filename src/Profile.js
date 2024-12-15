import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import axios from 'axios';

function Profile() {
  const [student, setStudent] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [bursaryStatus, setBursaryStatus] = useState(null);
  const [applicationData, setApplicationData] = useState({
    familyIncome: '',
    reason: '',
    supportingDocuments: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student profile and application status
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        // Fetch student profile
        const profileResponse = await axios.get('http://127.0.0.1:5000/student-profile');
        setStudent(profileResponse.data);

        // Fetch bursary application status
        const statusResponse = await axios.get('http://127.0.0.1:5000/bursary-status', {
          params: { admissionNumber: profileResponse.data.admissionNumber },
        });

        if (statusResponse.data.hasApplied) {
          setHasApplied(true);
          setBursaryStatus(statusResponse.data.status);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching student profile or bursary status:', err);
        setError('Failed to load student profile');
        setIsLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      supportingDocuments: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('admissionNumber', student.admissionNumber);
      formData.append('familyIncome', applicationData.familyIncome);
      formData.append('reason', applicationData.reason);
      formData.append('supportingDocuments', applicationData.supportingDocuments);

      await axios.post('http://127.0.0.1:5000/apply-bursary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Bursary application submitted successfully.');
      setHasApplied(true);
      setBursaryStatus('pending');
    } catch (err) {
      setError('Failed to submit the application.');
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Student Profile</h2>
              <Row>
                <Col md={6}>
                  <p><strong>Full Name:</strong> {student.full_Name}</p>
                  <p><strong>School Name:</strong> {student.schoolName}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Admission Number:</strong> {student.admissionNumber}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Phone Number:</strong> {student.phoneNumber}</p>
                </Col>
              </Row>

              {/* Display Bursary Status if Already Applied */}
              {hasApplied ? (
                <div className="mt-4">
                  <h4 className="text-center mb-3">Bursary Application Status</h4>
                  {bursaryStatus === 'pending' && (
                    <Alert variant="info">
                      Your bursary application is currently <strong>pending</strong>.
                    </Alert>
                  )}
                  {bursaryStatus === 'approved' && (
                    <Alert variant="success">
                      Congratulations! Your bursary application has been <strong>approved</strong>.
                    </Alert>
                  )}
                  {bursaryStatus === 'rejected' && (
                    <Alert variant="danger">
                      Unfortunately, your bursary application has been <strong>rejected</strong>.
                    </Alert>
                  )}
                  <ProgressBar now={bursaryStatus === 'pending' ? 50 : bursaryStatus === 'approved' ? 100 : 0} />
                </div>
              ) : (
                // Bursary Application Form for First-Time Applicants
                <div className="mt-4">
                  <h4 className="text-center mb-3">Apply for Bursary</h4>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="familyIncome">
                      <Form.Label>Family Income</Form.Label>
                      <Form.Control
                        type="text"
                        name="familyIncome"
                        value={applicationData.familyIncome}
                        onChange={handleInputChange}
                        placeholder="Enter your family's annual income"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="reason">
                      <Form.Label>Reason for Applying</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="reason"
                        value={applicationData.reason}
                        onChange={handleInputChange}
                        placeholder="Explain why you are applying for the bursary"
                        rows={3}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="supportingDocuments">
                      <Form.Label>Supporting Documents</Form.Label>
                      <Form.Control
                        type="file"
                        name="supportingDocuments"
                        onChange={handleFileChange}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                      Submit Application
                    </Button>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;