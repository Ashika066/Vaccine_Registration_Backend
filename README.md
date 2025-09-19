# Vaccine Registration Backend API

## Project Overview

This project implements a backend system for a vaccine registration app, similar to ArogyaSetu/Cowin, using Node.js and MongoDB Atlas. It provides APIs for user registration, vaccine slot booking, slot management, and admin reporting functionalities.

---

## Tech Stack

- Node.js (Express framework)
- MongoDB (Atlas cloud database)
- Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- node-cron for scheduled tasks

---

## Features

### User APIs

- Register a user with mandatory fields (Name, PhoneNumber, Age, Pincode, Aadhaar No)
- User login via PhoneNumber and password
- View available vaccine slots based on vaccination status (first/second dose)
- Register for a vaccine slot (first or second dose) with slot capacity constraints
- Update/change an already registered slot (allowed till 24 hours before slot time)
- Automatic vaccination status updates when slot times lapse (via cron job)

### Admin APIs

- Admin login (credentials are manually created; no public registration)
- View all users with filtering options by Age, Pincode, Vaccination Status
- View daily reports of registered slots for first dose, second dose, and total users

---

## Project Setup

### Prerequisites

- Node.js installed (v14+ recommended)
- MongoDB Atlas account and cluster created
- Environment variables configured in `.env` file: