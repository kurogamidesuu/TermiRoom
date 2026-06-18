# \<TermiRoom />

A sleek, fully interactive web-based terminal emulator built with React and Node.js. TermiRoom replicates the feel of a native developer environment inside your browser, featuring AI-powered command execution, custom syntax highlighting, and a dynamic theming engine.

![TermiRoom Screenshot](/image.png)

## Features

- **Native Terminal UX:** Includes a true blinking block cursor, intelligent text insertion tracking, and `ArrowUp` / `ArrowDown` command history cycling.
- **Smart Syntax Highlighting:** Real-time command validation that dynamically colorizes executables as you type, driven by a custom regex engine.
- **Dynamic Theming Engine:** 12+ built-in classic developer themes (Dracula, Monokai, Cyberpunk, Nord, Gruvbox) that seamlessly update the UI, ambient background glow, and syntax colors.
- **AI Integration:** Execute natural language prompts and generate code snippets directly in the terminal using OpenRouter (Llama 3 / Gemini).
- **Asynchronous Execution:** Authentic `npm`-style braille loading spinners while waiting for API responses.
- **Persistent Sessions:** Secure user authentication with JWTs and cross-domain cookies to save terminal history and directory states across devices.

## Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS (Custom scrollbars, glass-morphism, flexbox constraints)
- Context API (State management for Themes, Auth, and Directories)

**Backend:**

- Node.js & Express
- MongoDB (Mongoose)
- JSON Web Tokens (HttpOnly cross-domain cookies)
- OpenRouter API (LLM parsing)

## Live Demo

- **Frontend:** [https://termi-room.vercel.app/](https://termi-room.vercel.app/)
- **Backend Environment:** Render

## Local Setup & Installation

**1. Clone the repository:**

```bash
  git clone https://github.com/kurogamidesuu/termiRoom.git
  cd termiRoom
```

**2. Install Frontend Dependencies:**

```bash
  cd frontend
  npm install
```

**3. Install Backend Dependencies:**

```bash
  cd backend
  npm install
```

**4. Environment Variables:**

Create a .env file in both the frontend and backend directories.

**Frontend (`frontend/.env`):**

```
  VITE_OPENROUTER_API_KEY='YOUR_OPENROUTER_API_KEY'
  VITE_GEOAPIFY_API_KEY='YOUR_GEOAPIFY_KEY'
```

**Backend (`backend/.env`):**

```
  MONGO_URI='YOUR_MONGO_URI'
  JWT_SECRET_KEY='YOUR_JWT_SECRET_KEY'
  PORT=3000
  CLIENT_ORIGIN='http://localhost:5173'
  NODE_ENV='development'
```

**5. Start the Application:**

Open two terminal tabs:

```bash
  # Tab 1: Start Backend
  cd backend
  npm run dev

  # Tab 2: Start Frontend
  cd frontend
  npm run dev
```

## Available Commands

Once logged in, you can interact with the terminal using standard CLI syntax:

- help - Display available commands.
- clear - Clear the terminal scrollback buffer.
- theme - Open the visual theme switcher.
- ai explain [topic] - Ask the integrated LLM to explain a concept.
- ai code --lang=[language] [prompt] - Generate code snippets.
- weather [city] - Fetch real-time weather data.
- cd [dir] - Navigate the simulated file system.
- logout - Safely terminate the session.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues](https://github.com/kurogamidesuu/TermiRoom/issues) page.
