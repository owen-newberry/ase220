# README

# D&D Party Management

## Team Members

Owen Newberry

---

## Table of Contents

- Overview
- Features
- Tools Used
- Requirements
- Installation
- Modules

# Overview

---

This project is a web-based application designed to manage a party of adventurers, handle their equipment, and enable players to add or remove items from their characters. The application allows you to switch between different categories of items (armor, weapons, and misc), load more items as needed, and track the equipment each member of the party has.

# Features

---

### User Accounts and Campaigns

- **User authentication:** Sign up, log in, and securely manage sessions
- **Campaign dashboard:** Logged-in users can create and manage multiple campaigns
- **Party linking:** Each campaign is tied to its own unique party and character list

### Party Member Management

- **Create/edit/delete** party members tied to a campaign
- Track attributes like name, race, class, level, background
- Persistent updates tied to the selected campaign

### Shared Item Inventory

- Access a shared inventory system per campaign
- **CRUD operations:** Add, edit, delete items in the shared stash
- **Quantities and types** can be updated dynamically
- Integrates with a central database of D&D items (`dnd-data`)

### Campaign Navigation

- Seamless transition between campaigns and their corresponding party dashboards
- Isolated data structures per campaign to avoid cross-contamination

# Tools Used

---

- **Frontend:** React, Bootstrap, CSS
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** bcrypt, cookie-parser, JWT
- **Version Control:** GitHub
- **Development:** Visual Studio Code,
- **Project Coordination:** Notion,  Canvas

# Requirements

---

This application meets these requirements as user stories

- As a new user, I should be able to create an account so I can start organizing my campaigns.
- As a returning user, I should be able to log in and access all my existing campaigns.
- As a user, I should be able to create, view, edit, and delete campaigns.
- As a user, I should be able to manage party members specific to a campaign.
- As a user, I should be able to manage shared items (e.g., loot, gear) per campaign.
- As a user, I should be able to view a campaign dashboard and access campaign-specific data.

# Installation

---

### Prerequisites

- Node.js
- npm
- MongoDB

### Clone the repository

```jsx
git clone https://github.com/owen-newberry/ase220.git

```

### Install Dependencies

```jsx
npm install
```

This will install express (for backend functionality) and all of the dependencies in `package.json.`

### Set Up Environment Variables

Create a `.env` file in the `backend` directory and include the following

```jsx
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
```

### Run the App

Start the backend server

```jsx
cd backend
node server.js

```

Start the frontend using LiveServer or similar.

# Modules

---

### Authentication/User Module

- Handles user login and registration
- Password hashing with `bcrypt`
- Session management with cookies or JWT

### Campaign Module

- CRUD operations for campaigns
- Stores metadata and unique IDs for party and items

### Party Member Module

- Handles character creation, updates, and deletions
- Attributes: name, class, race, level, background, etc.
- Shared inventory system tied to a campaign
- Adds, deletes, and updates item quantity or details
- Integrates with static D&D item data (`dnd-data`)

## Youtube Link

[Click here.](https://youtu.be/NbsxQ31yegkg)