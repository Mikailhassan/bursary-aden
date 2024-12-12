import React, { useState, useEffect } from "react";
import { ProgressBar, Dropdown, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ApplicantDashboard.css";

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [applicantData, setApplicantData] = useState({
    full_name: "",
    admission_number: "",
    institution_name: "",
    email: "",
    phone_number: "",
    application_status: "not_applied"
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
        // First, fetch user details
        const userResponse = await axios.get("http://127.0.0.1:5000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Then, fetch application status
        const applicationResponse = await axios.get("http://127.0.0.1:5000/bursary/application-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User Data:", userResponse.data);
        console.log("Application Status:", applicationResponse.data);

        // Merge user data with application status
        setApplicantData(prevData => ({
          ...userResponse.data,
          application_status: applicationResponse.data.status || "not_applied"
        }));

        setError(null);
      } catch (error) {
        console.error("Error fetching applicant data:", error.response ? error.response.data : error);
        setError(error.response?.data?.message || "Failed to fetch applicant data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicantData();
  }, [navigate]);

  const handleApplyForBursary = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://127.0.0.1:5000/bursary/apply", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Application Response:", response.data);

      // Update status to pending after successful application
      setApplicantData(prevData => ({
        ...prevData,
        application_status: "pending"
      }));

      setError(null);
    } catch (error) {
      console.error("Error applying for bursary:", error.response ? error.response.data : error);
      setError(error.response?.data?.message || "Failed to submit bursary application");
    } finally {
      setIsLoading(false);
    }
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
            <button 
              className="btn btn-primary" 
              onClick={handleApplyForBursary}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Apply Now"}
            </button>
          </div>
        );
    }
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
            <Dropdown.Item>Logout</Dropdown.Item>
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
      </div>
    </div>
  );
};

export default ApplicantDashboard;