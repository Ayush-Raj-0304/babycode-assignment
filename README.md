# Student Dashboard

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11.7.1-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.10.5-0055FF?logo=framer&logoColor=white)

A modern, responsive student management dashboard for educational institutions. This application provides a seamless interface for managing student information, tracking performance metrics, and monitoring academic progress.

## 🌟 Features

- **Authentication System**: Secure login and signup functionality powered by Firebase 
- **Student Management**: Add, view, edit, and filter student records
- **Data Visualization**: Track student performance metrics with intuitive visual indicators
- **Activity Timeline**: Monitor student activities with chronological tracking
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **Theme Customization**: Toggle between light and dark mode for comfortable viewing
- **Animated UI**: Smooth transitions and animations for enhanced user experience
- **Form Validation**: Comprehensive validation for all user inputs
- **Course Selection**: Dropdown menu with predefined courses and custom course input option
- **Persistent Storage**: Student data is stored in local storage for data persistence

## 🛠️ Technologies Used

- **Frontend**: React 19, React Router DOM 7, Framer Motion
- **Styling**: TailwindCSS, HeadlessUI
- **Form Handling**: React Hook Form, Zod (validation)
- **Authentication**: Firebase Authentication
- **Build Tool**: Vite
- **Data Management**: Axios with MockAdapter for demo data

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ayush-Raj-0304/babycode-assignment.git
   cd babycode-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Usage

### Authentication

- **Login**: Use email "one@one.com" for demo access (integrated a one click button)
- **Signup**: Create a new account with email and password validation

### Student Management

- **Add Students**: Fill out the comprehensive form to add new students
- **View Students**: Browse the list with responsive card layout
- **Filter Students**: Filter by course, search by name or email
- **Sort**: Sort students by various metrics including performance and attendance
- **Activities**: Add and track student activities with date validation

## 🖥️ Deployment

Visit the live app: [Student Dashboard](https://babycode-assignment-sooty.vercel.app/)

## 🔍 Project Structure

```
student-dashboard/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images and other assets
│   ├── components/    # React components
│   ├── services/      # API and Firebase services
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── .env               # Environment variables (not in repo)
└── package.json       # Project dependencies
```

## 🔧 Advanced Customization

### Adding Custom Courses

The application allows administrators to add custom courses beyond the predefined list. Custom courses are validated to ensure data integrity.

### Theming

The application uses a custom Tailwind CSS configuration for theming. You can modify the `tailwind.config.cjs` file to adjust colors, spacing, and other design elements.

## 📄 License

This project is open to contributions! Feel free to fork, raise issues, or submit improvements.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [GitHub Repository](https://github.com/Ayush-Raj-0304/babycode-assignment)

---

Made with ❤️ by Ayush Raj