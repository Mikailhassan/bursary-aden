from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from marshmallow import pre_load, post_load
from werkzeug.utils import secure_filename
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


from marshmallow import Schema, pre_load, post_load
# Configuration
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'BursaryApplication.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Image upload configuration
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize Database and Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Database Model
class Applicant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    admission = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    form = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.String(10), nullable=False)
    national_id = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    institution_type = db.Column(db.String(50), nullable=False)
    institution_name = db.Column(db.String(100), nullable=False)
    index_number = db.Column(db.String(50), nullable=True)
    constituency = db.Column(db.String(100), nullable=False)
    ward = db.Column(db.String(100), nullable=False)
    id_document = db.Column(db.String(200), nullable=True)
    birth_certificate = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(10), default="Pending")  # Status for admin to approve/reject

# Marshmallow Schema
# class ApplicantSchema(ma.SQLAlchemyAutoSchema):
class ApplicantSchema(Schema):
    class Meta:
        model = Applicant

    @pre_load
    def format_data(self, data, **kwargs):
        return {
            'full_name': data.get('fullName'),
            'admission': data.get('admission'),
            'gender': data.get('gender'),
            'form': data.get('form'),
            'dob': data.get('dob'),
            'national_id': data.get('nationalID'),
            'phone_number': data.get('phoneNumber'),
            'email': data.get('email'),
            'institution_type': data.get('institutionType'),
            'institution_name': data.get('institutionName'),
            'index_number': data.get('indexNumber', ''),
            'constituency': data.get('constituency'),
            'ward': data.get('ward'),
            'id_document': data.get('idDocument'),
            'birth_certificate': data.get('birthCertificate'),
        }

    @post_load
    def format_response(self, data, **kwargs):
        return {
            'fullName': data['full_name'],
            'admission': data['admission'],
            'gender': data['gender'],
            'form': data['form'],
            'dob': data['dob'],
            'nationalID': data['national_id'],
            'phoneNumber': data['phone_number'],
            'email': data['email'],
            'institutionType': data['institution_type'],
            'institutionName': data['institution_name'],
            'indexNumber': data.get('index_number', ''),
            'constituency': data['constituency'],
            'ward': data['ward'],
            'idDocument': data.get('id_document'),
            'birthCertificate': data.get('birth_certificate'),
            'status': data['status'],
        }

# Initialize applicant schema
applicant_schema = ApplicantSchema()
applicants_schema = ApplicantSchema(many=True)

# Create the database tables if they do not exist
with app.app_context():
    db.create_all()

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to send feedback email
def send_feedback_email(email, full_name, status):
    sender_email = "adenabdib@gmail.com"  # Replace with your email
    sender_password = "0720676534Aden"  # Replace with your email password
    subject = "Bursary Application Feedback"

    if status == "Approved":
        message_body = f"""
        Dear {full_name},

        Congratulations! We are pleased to inform you that your bursary application has been approved. 
        Please visit our office for further instructions.

        Regards,
        Bursary Office
        """
    else:
        message_body = f"""
        Dear {full_name},

        Unfortunately, your bursary application has been rejected. 
        You may visit our office to discuss corrections or reapply.

        Regards,
        Bursary Office
        """

    try:
        # Set up the email
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = email
        message['Subject'] = subject
        message.attach(MIMEText(message_body, 'plain'))

        # Send the email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)
        
        print(f"Feedback email sent to {email}")
    except Exception as e:
        print(f"Failed to send email to {email}: {str(e)}")

# Routes (including feedback email functionality)
@app.route('/applicants/<int:id>/send-feedback', methods=['POST'])
def send_feedback(id):
    applicant = Applicant.query.get_or_404(id)

    # Send feedback email based on status
    send_feedback_email(applicant.email, applicant.full_name, applicant.status)

    return jsonify({"message": f"Feedback email sent to {applicant.email}"}), 200

# Other Routes (for applying, managing, and retrieving applicants)
@app.route('/apply', methods=['POST'])
def apply_for_bursary():
    data = request.form
    errors = applicant_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    # Handle file uploads
    id_document_file = request.files.get('idDocument')
    birth_certificate_file = request.files.get('birthCertificate')

    id_document_filename = ''
    birth_certificate_filename = ''

    if id_document_file and allowed_file(id_document_file.filename):
        id_document_filename = secure_filename(id_document_file.filename)
        id_document_file.save(os.path.join(app.config['UPLOAD_FOLDER'], id_document_filename))

    if birth_certificate_file and allowed_file(birth_certificate_file.filename):
        birth_certificate_filename = secure_filename(birth_certificate_file.filename)
        birth_certificate_file.save(os.path.join(app.config['UPLOAD_FOLDER'], birth_certificate_filename))

    new_applicant = Applicant(
        full_name=data['fullName'],
        admission=data['admission'],
        gender=data['gender'],
        form=data['form'],
        dob=data['dob'],
        national_id=data['nationalID'],
        phone_number=data['phoneNumber'],
        email=data['email'],
        institution_type=data['institutionType'],
        institution_name=data['institutionName'],
        index_number=data.get('indexNumber', ''),
        constituency=data['constituency'],
        ward=data['ward'],
        id_document=f'http://localhost:5000/uploads/{id_document_filename}' if id_document_filename else None,
        birth_certificate=f'http://localhost:5000/uploads/{birth_certificate_filename}' if birth_certificate_filename else None
    )

    db.session.add(new_applicant)
    db.session.commit()

    return applicant_schema.jsonify(new_applicant), 201

@app.route('/applicants', methods=['GET'])
def get_applicants():
    applicants = Applicant.query.all()
    return applicants_schema.jsonify(applicants)

@app.route('/applicants/<int:id>', methods=['GET'])
def get_single_applicant(id):
    applicant = Applicant.query.get_or_404(id)
    return applicant_schema.jsonify(applicant)

@app.route('/applicants/<int:id>', methods=['PUT'])
def update_application_status(id):
    applicant = Applicant.query.get_or_404(id)
    status = request.json.get('status', applicant.status)
    applicant.status = status

    db.session.commit()
    return applicant_schema.jsonify(applicant)

@app.route('/applicants/<int:id>/update', methods=['PUT'])
def update_applicant(id):
    applicant = Applicant.query.get_or_404(id)

    data = request.form
    errors = applicant_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    # Update details
    applicant.full_name = data['fullName']
    applicant.admission = data['admission']
    applicant.gender = data['gender']
    applicant.form = data['form']
    applicant.dob = data['dob']
    applicant.national_id = data['nationalID']
    applicant.phone_number = data['phoneNumber']
    applicant.email = data['email']
    applicant.institution_type = data['institutionType']
    applicant.institution_name = data['institutionName']
    applicant.index_number = data.get('indexNumber', '')
    applicant.constituency = data['constituency']
    applicant.ward = data['ward']

    db.session.commit()
    return applicant_schema.jsonify(applicant)

if __name__ == '__main__':
    app.run(debug=True)

