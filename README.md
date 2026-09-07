# 🚀 Taskora

> **Smart Task & Productivity Management Platform**

Taskora is a modern task management application built with **React.js** that helps users **organize, prioritize, track, and complete tasks efficiently**.

Unlike a basic To-Do application, Taskora focuses on improving productivity through task prioritization, progress tracking, deadline management, and a personalized task workflow.

## ✨ Key Features

* 📝 **Create Tasks** – Add new tasks with relevant details
* ✏️ **Edit Tasks** – Update existing task information
* 🗑️ **Delete Tasks** – Remove tasks when they are no longer needed
* ✅ **Task Completion** – Mark tasks as completed or pending
* 🎯 **Task Prioritization** – Organize tasks based on their importance
* 📅 **Due Dates** – Set deadlines for tasks
* 🚦 **Deadline Tracking** – Keep track of upcoming deadlines
* 📋 **Task Progress** – Monitor task completion progress
* 🔍 **Search Tasks** – Quickly find specific tasks
* 🔽 **Filter & Sort** – Organize tasks based on different conditions
* 📊 **Productivity Tracking** – View task progress and productivity information
* 💾 **Persistent Storage** – Tasks are stored in the browser using **LocalStorage**
* 🌙 **Dark/Light Mode** – Switch between different UI themes
* 🍅 **Focus / Pomodoro Mode** – Support focused work sessions

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **JavaScript (ES6+)**
* **HTML5**
* **CSS3**

### State Management

* **React Hooks**

  * `useState`
  * `useEffect`

### Data Storage

* **Browser LocalStorage**

### Development Tools

* **Node.js**
* **npm**
* **Git**
* **GitHub**

## 💾 Data Persistence

Taskora uses the browser's **LocalStorage** to persist task data.

This means tasks remain available even after:

* Refreshing the page
* Closing and reopening the browser
* Restarting the application

The task state is converted into JSON before being stored and retrieved from LocalStorage when the application loads.

```javascript
localStorage.setItem("tasks", JSON.stringify(tasks));

const savedTasks = JSON.parse(localStorage.getItem("tasks"));
```

> **Note:** Since Taskora currently uses LocalStorage, the data is stored locally in the user's browser and is not synchronized across devices.

## 🎯 Project Goal

The goal of Taskora is to create a **simple but intelligent productivity system** that helps users manage their tasks and decide **which task they should focus on next**.

The project demonstrates how a React application can combine:

* Component-based architecture
* State management
* Browser storage
* Task filtering and sorting
* Progress tracking
* Responsive UI design

## 📂 Project Structure

```text
Taskora/
│
├── public/
│
├── src/
│   ├── component/
│   │   ├── Taskform.jsx
│   │   ├── Tasklists.jsx
│   │   └── Taskprogressbar.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── README.md
```

## 🚀 Future Enhancements

* 🔐 User authentication
* 🌐 REST API integration
* ⚙️ Spring Boot backend
* 🗄️ MySQL database
* 👥 Team collaboration
* 🔔 Task reminders and notifications
* ☁️ Cloud synchronization
* 📱 Improved mobile responsiveness
* 📈 Advanced productivity analytics

## 🎓 Learning Outcomes

Through this project, I gained practical experience with:

* React component development
* React Hooks
* Managing application state
* CRUD operations
* LocalStorage
* JavaScript array methods
* Conditional rendering
* Event handling
* CSS styling and responsive UI
* Git and GitHub

## 👨‍💻 Project Status

**Status:** 🚧 In Development

Taskora is currently a **frontend-based productivity application** with LocalStorage persistence. Backend integration and additional intelligent productivity features are planned for future versions.

---

⭐ If you find **Taskora** useful, consider giving the repository a star!
