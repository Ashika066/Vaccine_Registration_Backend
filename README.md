# Vaccine Registration Backend API

## Project Overview
This backend API is for a vaccine registration system similar to Cowin/ArogyaSetu apps. It allows user registration, login, vaccine slot booking, slot updation, and admin reporting with authentication.

---

## Tech Stack

- Node.js (Express framework)
- MongoDB (Atlas cloud database)
- Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- node-cron for scheduled tasks

---

## APIs and Their Functionalities

### User APIs

- **POST /api/user/register**  
  Registers a new user with fields: name, phoneNumber, password, age, pincode, aadhaarNo.

- **POST /api/user/login**  
  Authenticates user by phone number and password; returns JWT token.

- **GET /api/user/slots**  
  Fetches available vaccine slots based on user's vaccination status (first dose or second dose).

- **POST /api/user/slots/register**  
  Register user to a preferred slot ensuring capacity and dose eligibility.

- **PUT /api/user/slots/update**  
  Update user's previously registered slot if more than 24 hours before slot time.

---

### Admin APIs

- **POST /api/admin/login**  
  Admin authentication (credentials pre-created manually); returns JWT token.

- **GET /api/admin/users**  
  Fetches list of users filtered by query parameters: age, pincode, vaccinationStatus.

- **GET /api/admin/slots/report?date=YYYY-MM-DD**  
  Generates a report of registered slots (first dose, second dose, total) for a given day.

---

## Data Models

### User
- `name`: String
- `phoneNumber`: String (unique)
- `password`: String (hashed)
- `age`: Number
- `pincode`: String
- `aadhaarNo`: String
- `vaccinationStatus`: Enum (none, firstDoseDone, fullyVaccinated)
- `firstDoseSlot`: Date (slot registered for first dose)
- `secondDoseSlot`: Date (slot registered for second dose)

### Slot
- `date`: Date (slot date and time)
- `doseType`: Enum (firstDose, secondDose)
- `capacity`: Number (max users per slot)
- `registeredUsers`: Array of User references

### Admin
- `username`: String (unique)
- `password`: String (hashed)

---

## Project Setup

### Prerequisites

- Node.js installed (v14+ recommended)
- MongoDB Atlas account and cluster created
- Environment variables configured in `.env` file: