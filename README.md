# <p align="center">CaptureCrew 📸</p>

<p align="center">
  <em>A seamless photography booking platform built with Spring Boot.</em>
</p>

<p align="center">
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-2.7.3-brightgreen" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-Authentication-blue" />
  <img alt="Auth" src="https://img.shields.io/badge/Authentication-✔️-informational" />
  <img alt="Razorpay" src="https://img.shields.io/badge/Razorpay-Payment-orange" />
  <img alt="Log4j2" src="https://img.shields.io/badge/Log4j2-Logging-red" />
</p>

---

## ✨ Features

- ✅ User Roles: Admin, Photographer, Customer  
- ✅ JWT Authentication & Authorization  
- ✅ Secure Online Payments with Razorpay  
- ✅ Role-Based Access Control (RBAC)  
- ✅ Detailed Logging with Log4j2  
- ✅ Photographer Listings & Booking System  
- ✅ Admin Dashboard for Monitoring Users & Bookings.

---

## 🛠️ Tech Stack

| Technology       | Description                             |
|------------------|-----------------------------------------|
| Spring Boot      | Backend framework                       |
| Spring Security  | Authentication & Authorization          |
| JWT (JSON Web Token) | Secure token-based authentication  |
| Razorpay         | Payment gateway integration             |
| Log4j2           | Logging and monitoring                  |
| Hibernate / JPA  | ORM for database interaction            |
| MySQL            | Database management                     |

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 5.7+ / 8.x

### Configuration
Create an `application.properties` (or use environment variables):

```properties
# Server
server.port=8080

# Datasource
spring.datasource.url=jdbc:mysql://localhost:3306/capturecrew?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_db_password

# JPA
spring.jpa.hibernate.ddl-auto=update

# JWT
app.jwtSecret=ReplaceWithAReallyStrongSecretKey
app.jwtExpirationMs=86400000

# Razorpay (test keys)
razorpay.keyId=rzp_test_xxxxxxxxxxxxx
razorpay.keySecret=xxxxxxxxxxxxxxxxxxxxxx

# Logging
logging.config=classpath:log4j2.xml
```

### Run locally
- Build: mvn clean package  
- Run: mvn spring-boot:run  
  or java -jar target/capturecrew-0.0.1-SNAPSHOT.jar

---

## 🔌 API (examples)

Base URL: `http://localhost:8080/api`

Auth
- POST /api/auth/register — register user (role: CUSTOMER / PHOTOGRAPHER)  
- POST /api/auth/login — authenticate and receive JWT

Photographers
- GET /api/photographers — list photographers  
- GET /api/photographers/{id} — photographer detail

Bookings
- POST /api/bookings — create booking (customer)  
- GET /api/bookings — list bookings (role-filtered)  
- PUT /api/bookings/{id}/status — update status (photographer/admin)

Payments
- POST /api/payments/create-order — create Razorpay order  
- POST /api/payments/verify — verify payment & update booking

Admin (ROLE_ADMIN)
- GET /api/admin/users — manage users  
- GET /api/admin/bookings — monitor bookings

---

## 🧰 Admin Dashboard
Admin dashboard provides:
- Users & role counts
- Booking statistics (by status / date)
- Payment summaries
- Recent activity / logs

Consider adding a React/Vue frontend using Chart.js or ApexCharts for visuals.

---

## 📝 Contributing
1. Fork the repo  
2. Create a branch: git checkout -b feat/your-feature  
3. Commit: git commit -m "Add: short description"  
4. Push: git push origin feat/your-feature  
5. Open a Pull Request

Please follow existing code style and add tests for critical logic.

---

## 📫 Contact
Maintainer: shraddhasmitkari  
Repo: https://github.com/shraddhasmitkari/Capture-crew-project-/

---

<p align="center">Made with — CaptureCrew</p>
