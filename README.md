# IntelliLMS-Learning-Management-System-
A full-featured Learning Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). This platform allows Admins to upload courses and quizzes, and Students to enroll in courses, attempt quizzes, and track their progress. It also includes payment gateway integration using Razorpay and email confirmation.

🚀 Features

🔐 Authentication & Authorization

Role-based login for Admin and Student

JWT-based session management

Secure routes for Admin actions

📚 Course Management

Admin can Create, Read, Update, and Delete courses

Upload YouTube video links and thumbnails

Display courses as responsive cards with actions

📝 Quiz System

Admin can create quizzes for each course

Students can attempt quizzes and view scores

Supports multiple-choice questions

💳 Payment Integration

Razorpay dummy payment gateway for course enrollment

Prevents duplicate enrollments

Sends confirmation email upon successful enrollment

📊 Student Dashboard

View all enrolled courses

Track learning progress and quiz scores

Personalized course list

🖥️ Admin Dashboard

Upload new courses and quizzes

Manage all courses in a structured view

Track enrollments (optional)

BACKEND SETUP:
cd server

npm install

#Add your MongoDB URI, JWT secret, Razorpay keys to .env

npm run dev

SAMPLE .env file
MONGO_URI=your_mongo_db_uri

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password_or_app_password

FRONTEND SETUP:
cd client

npm install

npm run dev
