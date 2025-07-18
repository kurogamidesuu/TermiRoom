# 🧠 termiRoom

> A retro-style web terminal emulator packed with powerful commands like AI explain/code, weather, todos, dictionary, and more — built using React + TailwindCSS.

---

## ✨ Features

- ⚙️ **Terminal-style Interface** – Inspired by classic Linux shells
- 💬 `ai` – Chat with an AI (powered by OpenRouter) for explanations and code
- 🌦️ `weather` – Get current weather or detailed reports
- ✅ `todo` – Manage tasks directly in the terminal (`add`, `list`, `clear`, `done`)
- 📖 `define` – Search the meaning of a word
- 👤 `whoami` – Set your terminal username (stored via localStorage)
- ⏰ `time` – Get current time with subcommands like `utc`, `hours`, `minutes`
- 📚 `help` – Display list of available commands
- 🧠 Smart command parsing with subcommands and flags (like `--due`, `--language`, `--src`)

---

## 🛠️ Built With

- **React**
- **TailwindCSS**
- **OpenRouter / DeepSeek API**
- **LocalStorage**
- **Navigator Geolocation API**
- **Modular Command Parser**

---

## 🧠 Example Commands

```bash
> help
> time utc
> todo add Finish my project
> weather Tokyo
> define aesthetic
> ai explain React
> ai code --lang=javascript how to fetch data in react
> whoami set Kurogami
```

---

## 📦 Installation

```bash
git clone https://github.com/kurogamidesuu/termiRoom.git
cd termiRoom
npm install
npm run dev
```

---

## 🔐 Environment Variables
Create a .env file and add:
```bash
OPENROUTER_API_KEY=your_key_here
```

---

## 🙏 Acknowledgements
This project is inspired by my love for terminal UIs and retro computing.
Thanks for checking it out! ✨

---

## 📬 Contact
📧 Reach me at: [Email](hempushpchauhan@gmail.com)

💼 Connect on [LinkedIn](https:/linkedin.com/in/hempushp-chauhan-32339926a/)

---

## ⭐️ Show your support
If you like this project, leave a star ⭐ on the repo — it helps a lot!