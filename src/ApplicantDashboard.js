import React, { useState, useEffect } from "react";
import { ProgressBar, Dropdown, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ApplicantDashboard.css";

const API_BASE_URL = "http://127.0.0.1:8000"; // Backend base URL

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [applicantData, setApplicantData] = useState({
    full_name: "",
    admission_number: "",
    institution_name: "",
    email: "",
    phone_number: "",
    application_status: "not_applied",
    application_history: []
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchApplicantData = async () => {
      setIsLoading(true);
      try {
        // Fetch user details
        const userResponse = await axios.get(`${API_BASE_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User Response:", userResponse.data);  // Debug log

        // Fetch application status and history using admission number from user details
        const applicationResponse = await axios.get(
          `${API_BASE_URL}/get-bursary-status/${userResponse.data.admission_number}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Application Response:", applicationResponse.data);  // Debug log

        // Merge user data with application status and history
        setApplicantData(prevData => ({
          ...userResponse.data,
          application_status: applicationResponse.data.status || "not_applied",
          application_history: applicationResponse.data.history || []
        }));

        setError(null);
      } catch (error) {
        console.error("Full Error Object:", error);  // Detailed error logging
        
        // More specific error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Error Response Data:", error.response.data);
          console.error("Error Response Status:", error.response.status);
          
          if (error.response.status === 401) {
            // Token might be expired, redirect to login
            localStorage.removeItem("token");
            navigate("/login");
          }
          
          setError(
            error.response.data?.message || 
            error.response.data?.error || 
            "Failed to fetch applicant data"
          );
        } else if (error.request) {
          // The request was made but no response was received
          setError("No response received from server. Please check your network connection.");
        } else {
          // Something happened in setting up the request
          setError("Error setting up the request. " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicantData();
  }, [navigate]);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderApplicationStatus = () => {
    if (isLoading) {
      return <div>Loading application status...</div>;
    }

    switch (applicantData.application_status) {
      case "approved":
        return (
          <div className="status-container approved">
            <h3>Bursary Approved</h3>
            <p>Congratulations! Your bursary application has been approved.</p>
            <ProgressBar now={100} variant="success" label="Approved" />
          </div>
        );
      case "rejected":
        return (
          <div className="status-container rejected">
            <h3>Application Rejected</h3>
            <p>We regret to inform you that your bursary application was not successful.</p>
            <ProgressBar now={100} variant="danger" label="Rejected" />
          </div>
        );
      case "pending":
        return (
          <div className="status-container pending">
            <h3>Application Under Review</h3>
            <p>Your bursary application is currently being processed.</p>
            <ProgressBar now={60} variant="warning" label="Pending" />
          </div>
        );
      default:
        return (
          <div className="status-container not-applied">
            <h3>Apply for Bursary</h3>
            <p>You have not yet submitted a bursary application.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate("/apply-for-bursary")}
            >
              Apply Now
            </Button>
          </div>
        );
    }
  };

  const renderApplicationHistory = () => {
    if (!applicantData.application_history || applicantData.application_history.length === 0) {
      return <p>No application history found.</p>;
    }

    return (
      <div className="application-history">
        <h3>Application History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {applicantData.application_history.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.date).toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${
                    entry.status === 'approved' ? 'success' : 
                    entry.status === 'rejected' ? 'danger' : 
                    entry.status === 'pending' ? 'warning' : 'secondary'
                  }`}>
                    {entry.status}
                  </span>
                </td>
                <td>{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="applicant-dashboard">
      <div className="dashboard-header">
        <h1>Applicant Dashboard</h1>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary">
            Profile Menu
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Profile Settings</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <div className="dashboard-content">
        <div className="applicant-info">
          <h2>Personal Details</h2>
          <div className="info-grid">
            <div><strong>Name:</strong> {applicantData.full_name}</div>
            <div><strong>Admission Number:</strong> {applicantData.admission_number}</div>
            <div><strong>Institution:</strong> {applicantData.institution_name}</div>
            <div><strong>Email:</strong> {applicantData.email}</div>
            <div><strong>Phone:</strong> {applicantData.phone_number}</div>
          </div>
        </div>

        <div className="application-status">
          {renderApplicationStatus()}
        </div>

        <div className="application-history-container">
          {renderApplicationHistory()}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
