import os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, JWTManager
from flask_mail import Mail, Message
from marshmallow import pre_load, post_load, ValidationError
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Base directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///bursary.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# Email Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

# CORS and Upload Configuration
CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "PUT", "DELETE"])

# Upload Configuration
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize extensions
db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    admission_number = db.Column(db.String(20), nullable=False, unique=True)
    institution_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(200), nullable=False)

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
    status = db.Column(db.String(10), default="Pending")

class BursaryApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admission_number = db.Column(db.String(50), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    family_income = db.Column(db.Float, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    supporting_documents = db.Column(db.String(255))
    status = db.Column(db.String(20), default='pending')
    application_date = db.Column(db.DateTime, default=datetime.utcnow)
    review_date = db.Column(db.DateTime)
    reviewer_comments = db.Column(db.Text)

# Schemas
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password',)

class ApplicantSchema(ma.SQLAlchemyAutoSchema):
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
            'status': data.get('status', 'Pending'),
        }

# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
applicant_schema = ApplicantSchema()
applicants_schema = ApplicantSchema(many=True)

# Helper Functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_status_update_email(email, status, comments=None):
    try:
        if status == 'pending':
            subject = 'Bursary Application Received'
            body = f'''
            Dear Applicant,

            We have received your bursary application and it is currently under review. 
            Our team will assess your application and get back to you soon.

            Application Status: Pending
            '''
        elif status == 'approved':
            subject = 'Bursary Application Approved'
            body = f'''
            Dear Applicant,

            We are pleased to inform you that your bursary application has been APPROVED.

            Application Status: Approved
            {f"Reviewer Comments: {comments}" if comments else ""}

            Next steps will be communicated separately.

            Congratulations!
            Bursary Committee
            '''
        elif status == 'rejected':
            subject = 'Bursary Application Status'
            body = f'''
            Dear Applicant,

            After careful review, we regret to inform you that your bursary application 
            has been REJECTED.

            Application Status: Rejected
            {f"Reviewer Comments: {comments}" if comments else ""}

            We appreciate your application and encourage you to apply again in the future.

            Bursary Committee
            '''
        else:
            return False

        msg = Message(
            subject=subject,
            recipients=[email],
            body=body
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

# Routes
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not all(key in data for key in ['full_name', 'admission_number', 'institution_name', 'email', 'phone_number', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        # Create new user
        new_user = User(
            full_name=data['full_name'],
            admission_number=data['admission_number'],
            institution_name=data['institution_name'],
            email=data['email'],
            phone_number=data['phone_number'],
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({'error': 'Invalid credentials'}), 401

        user_data = {
            'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'full_name': user.full_name,
            'admission_number': user.admission_number,
            'institution_name': user.institution_name,
        }

        access_token = create_access_token(identity=user.id)
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_data': user_data
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")  # Server-side logging
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@app.route('/auth/user', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        
        user_data = {
            'full_name': user.full_name,
            'admission_number': user.admission_number,
            'institution_name': user.institution_name,
            'email': user.email,
            'phone_number': user.phone_number
        }
        
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/apply', methods=['POST'])
def apply_for_bursary():
    try:
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

    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/update-bursary-status', methods=['POST'])
def update_bursary_status():
    try:
        data = request.json
        
        # Input validation
        if not data or 'admission_number' not in data or 'status' not in data:
            return jsonify({
                "success": False, 
                "message": "Invalid input. Admission number and status are required."
            }), 400
        
        # Validate status
        valid_statuses = ['pending', 'approved', 'rejected']
        if data['status'] not in valid_statuses:
            return jsonify({
                "success": False, 
                "message": "Invalid status. Must be one of: pending, approved, rejected"
            }), 400
        
        # Find the application
        application = BursaryApplication.query.filter_by(
            admission_number=data['admission_number']
        ).first()
        
        if not application:
            return jsonify({
                "success": False, 
                "message": "No application found for this admission number"
            }), 404
        
        # Update status
        application.status = data['status']
        application.review_date = datetime.utcnow()
        
        # Optional reviewer comments
        if 'reviewer_comments' in data:
            application.reviewer_comments = data['reviewer_comments']
        
        # Commit changes
        db.session.commit()
        
        # Send email notification
        send_status_update_email(
            application.email, 
            application.status, 
            application.reviewer_comments
        )
        
        return jsonify({
            "success": True, 
            "message": f"Application status updated to {application.status}"
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False, 
            "message": f"Error updating status: {str(e)}"
        }), 500 

@app.route('/get-bursary-status/<admission_number>', methods=['GET'])
@jwt_required()
def get_bursary_status(admission_number):
    try:
        # Check user's permission to access this data
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)
        
        # Verify the admission number matches the current user
        if current_user.admission_number != admission_number:
            return jsonify({
                "error": "Unauthorized access to application status",
                "message": "You can only view your own application status"
            }), 403

        # First, check if there's an existing bursary application
        application = BursaryApplication.query.filter_by(
            admission_number=admission_number
        ).first()
        
        if not application:
            # No application found, return not_applied status
            return jsonify({
                "status": "not_applied",
                "history": [],
                "message": "No bursary application found"
            }), 200
        
        
        history = [
            {
                "date": application.application_date.isoformat(),
                "status": application.status,
                "details": application.reviewer_comments or "Application submitted"
            }
        ]
        
        return jsonify({
            "status": application.status,
            "history": history
        }), 200
    
    except Exception as e:
        print(f"Error in get_bursary_status: {str(e)}")  # Server-side logging
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/applicants', methods=['GET'])
def get_applicants():
    try:
        applicants = Applicant.query.all()
        return applicants_schema.jsonify(applicants)
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error retrieving applicants: {str(e)}"
        }), 500

@app.route('/applicants/<int:id>', methods=['GET'])
def get_single_applicant(id):
    try:
        applicant = Applicant.query.get_or_404(id)
        return applicant_schema.jsonify(applicant)
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error retrieving applicant: {str(e)}"
        }), 500

@app.route('/applicants/<int:id>', methods=['PUT'])
def update_application_status(id):
    try:
        applicant = Applicant.query.get_or_404(id)
        status = request.json.get('status', applicant.status)
        applicant.status = status

        db.session.commit()
        
        # Optional: Send email notification about status change
        send_status_update_email(applicant.email, status)
        
        return applicant_schema.jsonify(applicant)
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error updating applicant status: {str(e)}"
        }), 500

@app.route('/applicants/<int:id>', methods=['DELETE'])
def delete_application(id):
    try:
        applicant = Applicant.query.get_or_404(id)
        db.session.delete(applicant)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Applicant deleted successfully"
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error deleting applicant: {str(e)}"
        }), 500

@app.route('/applicants/<int:id>/update', methods=['PUT'])
def update_applicant(id):
    try:
        applicant = Applicant.query.get_or_404(id)

        data = request.form
        errors = applicant_schema.validate(data)
        if errors:
            return jsonify(errors), 400

        # Update the applicant details
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

        # Handle file uploads if provided
        id_document_file = request.files.get('idDocument')
        birth_certificate_file = request.files.get('birthCertificate')

        if id_document_file and allowed_file(id_document_file.filename):
            id_document_filename = secure_filename(id_document_file.filename)
            id_document_file.save(os.path.join(app.config['UPLOAD_FOLDER'], id_document_filename))
            applicant.id_document = f'http://localhost:5000/uploads/{id_document_filename}'

        if birth_certificate_file and allowed_file(birth_certificate_file.filename):
            birth_certificate_filename = secure_filename(birth_certificate_file.filename)
            birth_certificate_file.save(os.path.join(app.config['UPLOAD_FOLDER'], birth_certificate_filename))
            applicant.birth_certificate = f'http://localhost:5000/uploads/{birth_certificate_filename}'

        db.session.commit()

        return applicant_schema.jsonify(applicant)
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error updating applicant: {str(e)}"
        }), 500

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Resource not found"
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500

# Main Function
if __name__ == '__main__':
    # Ensure database is created
    with app.app_context():
        db.create_all()

    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)