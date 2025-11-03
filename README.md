# 📱 Facebook Cloning Frontend (Angular)

This is the **frontend** for a Facebook-like social media application built with **Angular**.  
It connects to a **Node.js + Express backend** and provides users with features such as authentication, posting, commenting, reacting, and managing friendships.

---

## 🚀 Features

### 👤 User Module
- User registration and login
- Profile update and image upload
- Search users
- View other profiles
- JWT authentication
- Forgot/reset password

### 📝 Post Module
- Create, edit, and delete posts
- Upload images with posts
- View all public posts
- View posts from friends
- View posts by a specific user

### 💬 Comment Module
- Add and delete comments on posts
- View comments for each post

### 👍 Reaction Module
- Add, update, or remove reactions (like, love, etc.)
- View reactions for posts

### 🤝 Friendship Module
- Send and accept friend requests
- Reject or remove friends
- View friend-related posts


## 🏗️ Project Structure

```bash
project/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── user.service.ts
|   |   │   ├── posts.service.ts
|   |   │   ├── comment.service.ts
|   |   │   ├── reaction.service.ts
|   |   │   └── friendship.service.ts
│   │   ├── components/               # Angular components
│   │   ├── pages/                    # Application pages
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/                       # Static files (icons, images)
│   ├── environments/
│   │   ├── environment.ts            # Dev environment config
│   │   └── environment.prod.ts       # Production environment config
│   └── index.html
└── README.md

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## 🧰 Tech Stack


- Angular 18

- TypeScript

- RxJS

- SweetAlert2 for alerts

- TailwindCSS (for UI)

- RESTful API Backend

- JWT Authentication

---

## 🧑‍💻 Contributors

Ahmed Hamed – Frontend Developer
Specializing in Angular & React JS
Passionate about building modern, scalable, and responsive applications.

---

## 📝 License

This project is licensed under the MIT License — feel free to use and modify it.

---

## 🌟 Acknowledgements

Special thanks to everyone contributing to open-source libraries and APIs that made this project possible!



