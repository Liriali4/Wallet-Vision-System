# Personal Finance Management System - Backend

Backend API for the Personal Finance Management System built with PHP.

## Features

- JWT Authentication
- User Management
- Transaction Management (Income/Expense)
- Category Management
- Goal Tracking
- Admin Dashboard
- RESTful API

## Setup

1. **Database Setup**
   ```bash
   mysql -u root < database/schema.sql
   ```

2. **Configuration**
   - Copy `.env.example` to `.env`
   - Update database credentials

3. **Local Development**
   ```bash
   cd backend
   php -S localhost:8000 -t public
   ```

## Project Structure

```
backend/
├── app/
│   ├── controllers/      # API Controllers
│   ├── services/         # Business Logic
│   ├── repositories/     # Data Access Layer
│   ├── models/           # Data Models
│   └── middlewares/      # Authentication & CORS
├── config/               # Configuration Files
│   ├── app.php
│   ├── cors.php
│   └── database.php
├── routes/               # Route Definitions
├── utils/                # Utility Classes
├── public/               # Public Entry Point
└── database/             # Database Schema
```

## API Routes

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- POST `/auth/logout` - Logout
- POST `/auth/change-password` - Change password
- PUT `/auth/profile` - Update profile

### Transactions
- GET `/transactions` - Get transactions
- GET `/transactions/monthly` - Get monthly transactions
- GET `/transactions/balance` - Get balance
- POST `/transactions` - Create transaction
- PUT `/transactions/update` - Update transaction
- DELETE `/transactions/delete` - Delete transaction

### Categories
- GET `/categories` - Get categories
- POST `/categories` - Create category
- PUT `/categories/update` - Update category
- DELETE `/categories/delete` - Delete category

### Goals
- GET `/goals` - Get goals
- POST `/goals` - Create goal
- PUT `/goals/update` - Update goal
- DELETE `/goals/delete` - Delete goal

### Admin
- GET `/admin/users` - List users
- GET `/admin/stats` - Get statistics
- PUT `/admin/users/deactivate` - Deactivate user
- PUT `/admin/users/activate` - Activate user
- DELETE `/admin/users/delete` - Delete user

## Notes

- All protected routes require JWT token in Authorization header
