# 📋 Mobile CRM — Client & Order Management App

A mobile application built with React Native for managing clients and their orders. 
The app supports admin/user roles and interacts with a REST API (developed in ASP.NET Core). 
It features authorization, customer and order tracking, search, sorting, filtering, and bulk actions.

> ⚠️ **Note:** This is a learning demo project built with help from ChatGPT. 
I'm well aware that the code quality is pretty poor, but for now I'm focusing on the backend (learn C# and ASP.NET Core). 
I'm not a frontend developer.

## 📱 Features

- 📋 List, view, add, edit, and delete **customers**
- 🛒 Manage **orders** for each customer
- 🔍 Search, sort, and filter by status
- ✅ Bulk actions: select multiple orders or customers to delete or update
- 🔐 User roles: Admin and User
- 📦 Backend hosted on Render.com with PostgreSQL (https://github.com/vladOzhovan/WeningerDemoBackend.git)

## 💠 Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: ASP.NET Core Web API (C#)
- **Database**: SQLite (local) → PostgreSQL (Render)
- **Hosting**: [Render.com](https://render.com)

## ⚙️ Setup

### Frontend (React Native)

1. Clone this repo.
2. Install Expo CLI:
   ```bash
   npm install -g expo-cli
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npx expo start --tunnel
   ```
5. Install Expo Go to yor smartphone
   
### Backend
The backend is already set up on a remote server (Render.com)  

### Authorize
 - userName: Admin_1 or User1
 - password: Admin_1 or User1

## ✨ Future Improvements

- Authentication using JWT tokens
- Push notifications for order status changes
- Unit and integration tests
- Dark mode support
- Offline mode

### Preview

![Interface](assets/screenshots/Screenshot_2025-06-19-14-10-26-800_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-19-14-10-46-805_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-16-22-15-25-934_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-16-23-32-58-490_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-16-23-33-35-032_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-16-23-34-17-274_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-16-23-34-23-783_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-16-23-43-00-201_host.exp.exponent.jpg)
![Interface](assets/screenshots/Screenshot_2025-06-19-14-12-34-435_host.exp.exponent.jpg)

## 🙌 Author

Made by Vlad Ozhovan, 2025

> Learning C# and ASP.NET Core. This demo was built with the help of ChatGPT.

