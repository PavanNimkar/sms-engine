# SMS Engine for Villages

## 📌 Overview
SMS Engine for Villages is a communication platform designed to help rural areas receive important information through SMS services.  
The system works efficiently even in low internet connectivity regions and helps villages stay connected with government schemes, farming updates, emergency alerts, and community announcements.

---

## 🚀 Features

- 📩 Bulk SMS Sending
- 👨‍🌾 Farming & Weather Alerts
- 🏛 Government Scheme Notifications
- 🚨 Emergency Announcements
- 📱 Mobile Friendly System
- 🔐 Secure User Authentication
- 📊 Admin Dashboard
- 👥 Village-wise Contact Management
- ⏰ Scheduled SMS Delivery
- 📡 Works in Low Network Areas

---

## 🛠 Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- React.js

### Backend
- Django
- Django REST Framework

### Database
- PostgreSQL

### APIs & Services
- SMS Gateway API
- REST APIs

---

## 📂 Project Structure

```bash
SMS-ENGINE/
│
├── backend/
│   │
│   ├── backend/                 # Main Django Project
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── messaging/               # SMS Management App
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   │
│   ├── orders/                  # SMS Orders / Packages
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── records/                 # SMS History & Logs
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── sms/                     # SMS Gateway Logic
│   │   ├── gateway.py
│   │   ├── utils.py
│   │   └── services.py
│   │
│   ├── media/
│   ├── static/
│   ├── db.sqlite3               # Remove after PostgreSQL setup
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
│
├── sms-venv/
├── .gitignore
├── README.md
```

---
## 📸 Modules

### Admin Module
- Manage villagers
- Send announcements
- View reports

### User Module
- Receive SMS updates
- View notifications
- Register mobile number

---

## 🎯 Use Cases

- Village Panchayat Communication
- Disaster Management Alerts
- Agriculture Updates
- Health Camp Notifications
- School & Education Announcements

---

## 🔮 Future Scope

- Voice Call Alerts
- Multi-language Support
- AI-based Smart Notifications
- Mobile Application
- WhatsApp Integration

## 👨‍💻 Developer

Developed by Pavan Nimkar and Abhishek Cougule

---
