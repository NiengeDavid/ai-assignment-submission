# AI Assignment Submission & Plagiarism Checker Platform

A full-featured, modern web platform to manage academic assignment workflows, check for plagiarism and AI-generated content, and streamline communication between students and faculty.

---

## 📚 About the Project

This project provides a comprehensive solution for handling assignment submissions and academic integrity checks in educational settings. It supports four user roles—Students, Lecturers, Admins (HODs), and SuperAdmins (Deans)—and leverages the latest AI and cloud tools for an efficient, transparent grading process.

---

## ✨ Features

- **Role-Based System:**  
  - Students: Submit assignments, view grades/feedback, communicate with lecturers
  - Lecturers: Create/manage assignments, mark and grade, provide feedback
  - Admins (HODs): Oversee departmental activity, manage users and settings
  - SuperAdmins (Deans): System-wide supervision, analytics, and control

- **AI-Powered Integrity Checking:**  
  - Automatic plagiarism detection using Hugging Face AI APIs
  - AI-content detection for assignment authenticity

- **Assignment Management:**  
  - Creation, distribution, and collection of assignments
  - Real-time grading, feedback, and result publishing

- **Communication & Notifications:**  
  - In-app notifications via webSockets ([Socket.io](https://socket.io/))
  - Integrated chat support between users

- **Modern Dashboards:**  
  - Responsive dark/light dashboards for all user roles
  - Analytics and charts for tracking submissions, grades, and integrity metrics

- **CMS & Database:**  
  - All content and records managed via [Sanity.io](https://www.sanity.io/)

- **Authentication:**  
  - Secure user management and authentication via [Clerk](https://clerk.dev/)

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Database/CMS:** [Sanity.io](https://www.sanity.io/)
- **AI/ML APIs:** [Hugging Face](https://huggingface.co/) APIs
- **WebSockets:** [Socket.io](https://socket.io/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

**Clone the repository:**
```bash
git clone https://github.com/NiengeDavid/ai-assignment-submission.git
cd ai-assignment-submission
```

**Install dependencies:**
```bash
npm install
# or
yarn install
```

**Set up environment variables:**  
Create a `.env.local` file in the project root with:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
NEXT_PUBLIC_SOCKET_IO_URL=your_socket_io_url
# ...any other required variables
```

**Start the development server:**
```bash
npm run dev
```
Then, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ Demo

> **Live site:** _(coming soon)_

---

## 📝 Contributing

Contributions are welcome!  
1. Fork this repository  
2. Create a new branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -am 'Add new feature'`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Sanity.io](https://www.sanity.io/)
- [Clerk](https://clerk.dev/)
- [Hugging Face](https://huggingface.co/)
- [Socket.io](https://socket.io/)
- [Vercel](https://vercel.com/)

---

> AI Assignment Submission & Plagiarism Checker • Powered by Next.js, Clerk, Sanity, and Hugging Face
