import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import './AdminDashboard.css';
import AboutUs from '../AboutUs';
import AdminAchievements from './AdminAchievements';
import ApplyForBursary from '../ApplyForBursary';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
    const [applicants, setApplicants] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = () => {
        axios
            .get('http://127.0.0.1:5000/applicants')
            .then((response) => {
                if (response.data) {
                    setApplicants(response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching applicants:', error);
                setFeedback('Failed to fetch applicants. Please try again.');
                setTimeout(() => setFeedback(''), 3000);
            });
    };

    const handleStatusChange = (applicant, status) => {
        // Combine status update and email sending
        axios
            .patch(`http://127.0.0.1:5000/applicants/${applicant.id}`, { status })
            .then(() => {
                // Send email notification
                return axios.post('http://127.0.0.1:5000/send-email', {
                    recipient: applicant.email,
                    subject: `Bursary Application Status Update - ${status}`,
                    body: `Dear ${applicant.full_name},\n\nYour bursary application has been ${status.toLowerCase()}. 
                    
Status: ${status}
Admission Number: ${applicant.admission}
Institution: ${applicant.institution_name}

If you have any questions, please contact our administrative office.

Best regards,
Bursary Administrative Team`
                });
            })
            .then(() => {
                // Update local state after successful status and email update
                setApplicants((prevState) =>
                    prevState.map((a) =>
                        a.id === applicant.id
                            ? { ...a, status: status }
                            : a
                    )
                );
                setFeedback(`The applicant has been ${status.toLowerCase()} successfully and notified via email.`);
                setTimeout(() => setFeedback(''), 3000);
            })
            .catch((error) => {
                console.error('Error updating status or sending email:', error);
                setFeedback('An error occurred while processing the application.');
                setTimeout(() => setFeedback(''), 3000);
            });
    };

    const openModal = (imageUrl, type) => {
        setModalImage(imageUrl);
        setModalType(type);
    };

    const closeModal = () => {
        setModalImage(null);
        setModalType(null);
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h3>Admin Menu</h3>
                <ul>
                    <li>
                        <Link to="/admin/achievements">Key Achievements</Link>
                    </li>
                    <li>
                        <Link to="/">View Applicants</Link>
                    </li>
                    <li>
                        <Link to="/about-us">About Us</Link>
                    </li>
                    <li>
                        <Link to="/apply-for-bursary">Apply for Bursary</Link>
                    </li>
                </ul>
            </div>
            <div className="content">
                {feedback && (
                    <div className="alert alert-success" role="alert">
                        {feedback}
                    </div>
                )}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                <h2>Applicant List</h2>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Admission No</th>
                                            <th>Gender</th>
                                            <th>School Name</th>
                                            <th>ID Number</th>
                                            <th>Email</th>
                                            <th>Constituency</th>
                                            <th>Ward</th>
                                            <th>ID Document</th>
                                            <th>Birth Certificate</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map((applicant) => (
                                            <tr key={applicant.id}>
                                                <td>{applicant.full_name}</td>
                                                <td>{applicant.admission}</td>
                                                <td>{applicant.gender}</td>
                                                <td>{applicant.institution_name}</td>
                                                <td>{applicant.national_id}</td>
                                                <td>{applicant.email}</td>
                                                <td>{applicant.constituency}</td>
                                                <td>{applicant.ward}</td>
                                                <td>
                                                    {applicant.id_document ? (
                                                        <button
                                                            onClick={() => openModal(applicant.id_document, 'ID')}
                                                            className="btn btn-link"
                                                        >
                                                            View ID Document
                                                        </button>
                                                    ) : (
                                                        'Not Uploaded'
                                                    )}
                                                </td>
                                                <td>
                                                    {applicant.birth_certificate ? (
                                                        <button
                                                            onClick={() =>
                                                                openModal(applicant.birth_certificate, 'BirthCertificate')
                                                            }
                                                            className="btn btn-link"
                                                        >
                                                            View Birth Certificate
                                                        </button>
                                                    ) : (
                                                        'Not Uploaded'
                                                    )}
                                                </td>
                                                <td>{applicant.status}</td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(applicant, 'Approved')
                                                        }
                                                        disabled={applicant.status === 'Approved'}
                                                        className="btn btn-success btn-sm"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(applicant, 'Rejected')
                                                        }
                                                        disabled={applicant.status === 'Rejected'}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(applicant, 'Pending')
                                                        }
                                                        disabled={applicant.status === 'Pending'}
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        Pending
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Modal for document preview */}
                                {modalImage && (
                                    <div className="modal show d-block" tabIndex="-1">
                                        <div className="modal-dialog modal-lg">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">
                                                        {modalType === 'ID'
                                                            ? 'ID Document Preview'
                                                            : 'Birth Certificate Preview'}
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        aria-label="Close"
                                                        onClick={closeModal}
                                                    ></button>
                                                </div>
                                                <div className="modal-body text-center">
                                                    <img
                                                        src={modalImage}
                                                        alt="Document"
                                                        className="img-fluid"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/admin/achievements" element={<AdminAchievements />} />
                    <Route path="/apply-for-bursary" element={<ApplyForBursary />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminDashboard;