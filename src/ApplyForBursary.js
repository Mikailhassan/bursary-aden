



import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API calls
import { Form, Button, Row, Col } from "react-bootstrap";
import Stepper from 'react-stepper-horizontal';
import { useNavigate } from "react-router-dom";
import './ApplyForBursary.css'; // Ensure this file includes the necessary styles

const ApplyForBursary = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0); // Step starts at 0
    const [formData, setFormData] = useState({
        admission: '',
        fullName: '',
        gender: '',
        form: '',
        dob: '',
        nationalID: '',
        phoneNumber: '',
        email: '',
        institutionType: '',
        institutionName: '',
        indexNumber: '',
        constituency: '',
        ward: '',
        idDocument: null,
        birthCertificate: null,
    });

    const [errors, setErrors] = useState({});
    const [bursaryId, setBursaryId] = useState(null); 

    // Step 1: UseEffect to fetch existing application data if editing
    useEffect(() => {
        if (bursaryId) {
            axios.get(`http://127.0.0.1:5000/applicants/${bursaryId}`)
                .then(response => {
                    setFormData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching applicant data:", error);
                });
        }
    }, [bursaryId]);

    // Handling form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    // Form validation logic
    const validateStep = () => {
        let newErrors = {};
        if (currentStep === 0) {
            if (!formData.admission) newErrors.admission = 'Admission number is required';
            if (!formData.fullName) newErrors.fullName = 'Full Name is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.form) newErrors.form = 'Form is required';
        } else if (currentStep === 1) {
            if (!formData.dob) newErrors.dob = 'Date of birth is required';
            if (!formData.nationalID) newErrors.nationalID = 'National ID is required';
            if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
            if (!formData.email) newErrors.email = 'Email is required';
            if (!formData.idDocument) newErrors.idDocument = 'ID Document is required';
            if (!formData.birthCertificate) newErrors.birthCertificate = 'Birth Certificate is required';
        } else if (currentStep === 2) {
            if (!formData.institutionType) newErrors.institutionType = 'Institution type is required';
            if (!formData.institutionName) newErrors.institutionName = 'Institution name is required';
            if (!formData.constituency) newErrors.constituency = 'Constituency is required';
            if (!formData.ward) newErrors.ward = 'Ward is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Go to next step if validation passes
    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    // Go to the previous step
    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    // Form submit handler - Create or Update bursary application
    const handleSubmit = () => {
        if (validateStep()) {
            const method = bursaryId ? "PUT" : "POST";
            const url = bursaryId
                ? `http://127.0.0.1:5000/apply/${bursaryId}`
                : "http://127.0.0.1:5000/apply";

            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });

            axios({
                method,
                url,
                data: formDataToSend,
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then(response => {
                    if (!bursaryId) {
                        setBursaryId(response.data.id);
                    }
                    // Navigate to Applicant Dashboard after successful submission
                    navigate('/get-bursary-status/${userResponse.data.admission_number}');
                })
                .catch(error => {
                    console.error("Error submitting form:", error.response?.data || error.message);
                    alert("There was an error submitting your application. Please try again.");
                });
        }
    };

    // Define the steps with their form content
    const steps = [
        { title: 'Personal Info' },
        { title: 'Identification' },
        { title: 'Institution Info' },
        { title: 'Review & Submit' },
    ];

    // Define the form content based on the current step
    const displayStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Admission No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="admission"
                                        value={formData.admission}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.admission}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.admission}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.fullName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.gender}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.gender}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Form / Year of Study</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="form"
                                        value={formData.form}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.form}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.form}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                );
            case 1:
                return (
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.dob}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dob}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>National ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nationalID"
                                        value={formData.nationalID}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.nationalID}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.nationalID}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.phoneNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phoneNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>ID Document</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="idDocument"
                                        onChange={handleFileChange}
                                        isInvalid={!!errors.idDocument}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.idDocument}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Birth Certificate</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="birthCertificate"
                                        onChange={handleFileChange}
                                        isInvalid={!!errors.birthCertificate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.birthCertificate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                );
                // end of the upload section

            case 2:
                return (
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Institution Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="institutionType"
                                        value={formData.institutionType}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.institutionType}
                                        required
                                    >
                                        <option>Select Institution Type</option>
                                        <option value="Primary">Primary School</option>
                                        <option value="Secondary">Secondary School</option>
                                        <option value="College">College/University</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.institutionType}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Institution Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="institutionName"
                                        value={formData.institutionName}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.institutionName}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.institutionName}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>constituency</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="constituency"
                                        value={formData.constituency}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.constituency}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.constituency}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ward</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.ward}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.ward}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                );

            case 3:
                return (
                    <div>
                       <h4>Review your information:</h4>
                    <ul>
                        <li><strong>Admission:</strong> {formData.admission}</li>
                        <li><strong>Full Name:</strong> {formData.fullName}</li>
                        <li><strong>Gender:</strong> {formData.gender}</li>
                        <li><strong>Form:</strong> {formData.form}</li>
                        <li><strong>Date of Birth:</strong> {formData.dob}</li>
                        <li><strong>National ID:</strong> {formData.nationalID}</li>
                        <li><strong>Phone Number:</strong> {formData.phoneNumber}</li>
                        <li><strong>Email:</strong> {formData.email}</li>
                        <li><strong>Institution Type:</strong> {formData.institutionType}</li>
                        <li><strong>Institution Name:</strong> {formData.institutionName}</li>
                        <li><strong>constituency:</strong> {formData.constituency}</li>
                        <li><strong>ward:</strong> {formData.ward}</li>
                    </ul>
                    <Button onClick={handleSubmit} variant="primary">Submit Application</Button>
                </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="apply-for-bursary">
            <h2>Apply for Bursary</h2>

            <Stepper
                steps={steps}
                activeStep={currentStep}
                activeColor="green"
                completeColor="green"
                size={35}
            />

            {displayStep()}

            <div className="form-navigation">
                <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>Previous</Button>
                {currentStep < steps.length - 1 ? (
                    <Button variant="primary" onClick={nextStep}>Next</Button>
                ) : null}
            </div>
        </div>
    );
};

export default ApplyForBursary;

