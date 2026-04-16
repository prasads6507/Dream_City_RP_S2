# Dream City Roleplay S2 - Web Portal

Automated Role Management and Whitelist Application system for Dream City Roleplay S2.

## 🚀 Deployment Instructions

### 1. Discord Bot Server (Render.com)
The bot server must be hosted on a persistent platform to stay "Always Online".
1. Push this repository to **GitHub**.
2. Sign up at [Render.com](https://render.com) and create a **New > Web Service**.
3. Select this repository. Render will automatically detect the configuration.
4. Set the following **Environment Variables** in the Render Dashboard:
   - `DISCORD_BOT_TOKEN`: Your Bot Token
   - `DISCORD_GUILD_ID`: `1245797634514354328`
   - `RECAPTCHA_SECRET_KEY`: Your reCAPTCHA secret
5. Your server will be live at `https://your-app-name.onrender.com`.

### 2. Frontend Website (Vercel)
1. Deploy the root folder to **Vercel**.
2. Add an environment variable in Vercel:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://your-app-name.onrender.com` (from step 1)

## 🛠️ Local Development
1. Clone the repo
2. Run `npm install` in the root
3. Run `cd server && npm install`
4. Use `npm run dev` for frontend and `cd server && npm start` for backend.
