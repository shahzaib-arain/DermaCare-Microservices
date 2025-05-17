# 🌐 DermaCare
- Microservices Architecture 🚀

## 📌 Project Overview

Virtua Derma is a scalable, modular microservices-based healthcare system providing comprehensive services including user management, diagnosis, appointments, pharmacy management, notifications, and feedback. Designed with Spring Boot, it leverages OAuth2 security, API Gateway, Eureka Service Registry, and Kafka-driven notifications.

---

## 🚀 Architecture

* **Microservices:** User, Diagnosis, Appointment, Pharmacy, Admin, Notification, Feedback
* **API Gateway:** Centralized entry point for external requests.
* **Service Registry (Eureka):** Dynamic service discovery.
* **Config Server:** Centralized configuration management (Config Repo excluded).
* **Security Service:** OAuth2 + JWT authentication for secure access.

---

## 📌 Microservices Breakdown

### ✅ User Service

* Registration (Patient, Doctor, Admin)
* Profile management
* Doctor verification (degree upload/verification)
* OAuth2 Login with JWT

### ✅ Diagnosis Service

* Image upload for diagnosis
* Manual diagnosis by doctors
* Diagnosis results + recommendations

### ✅ Appointment Service

* Book and manage appointments
* Rescheduling and history tracking

### ✅ Pharmacy Service

* View and order prescriptions
* Manage inventory

### ✅ Admin Service

* Manage users (doctors, patients)
* Verify doctor degrees
* Block/remove users

### ✅ Notification Service

* Appointment confirmation (email/SMS)
* Prescription ready and medicine dispatch notifications

### ✅ Feedback Service

* Rate doctors and pharmacies
* Write reviews

---

## 📦 Tech Stack

* **Backend:** Spring Boot Microservices
* **Security:** OAuth2, JWT
* **API Gateway:** Spring Cloud Gateway
* **Service Discovery:** Eureka
* **Configuration Management:** Config Server
* **Messaging:** Kafka (for notifications)
* **Database:** MySQL, MongoDB, Object Storage (Diagnosis images)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/virtua-derma-microservices.git
cd virtua-derma-microservices
```

### 2. Setup Microservices

* API Gateway
* Service Registry (Eureka)
* Config Server (excluding Config Repo)
* User Service
* DermaCare Service (Diagnosis, Appointment, Pharmacy)
* AdminHub Service (Admin, Notification, Feedback)

### 3. Run Services

```bash
# Start Eureka Server
cd service-registry && mvn spring-boot:run

# Start Config Server
cd config-server && mvn spring-boot:run

# Start User Service
cd user-service && mvn spring-boot:run
```

### 4. Test Services

* API Gateway: [http://localhost:8088](http://localhost:8088)
* Eureka: [http://localhost:8761](http://localhost:8761)
* User Service: [http://localhost:8082](http://localhost:8082)

---

## 📌 License

This project is licensed under the MIT License.
