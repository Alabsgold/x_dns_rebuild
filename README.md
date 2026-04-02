# X-DNS Guardian+

**X-DNS Guardian+** is a real-time DNS metadata scanner and risk scorer built for cybersecurity and trust. It instantly profiles domains, assigning a safety score and identifying threats like phishing keywords, short TTLs (fast flux), and missing MX records.

## Tech Stack
- **Backend**: C# (.NET 8) ASP.NET Core Web API, SignalR, DnsClient, MongoDB.Driver
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Database**: MongoDB

## How to Run from VSCode Terminal

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- A running instance of MongoDB locally on `localhost:27017` OR Docker to run the provided Mongo container.

---

### Step 1: Start MongoDB
If you have Docker installed, the easiest way to get the database running is:
```bash
docker compose up -d mongodb
```
*(Alternatively, ensure your local MongoDB service is running on default port 27017)*

### Step 2: Start the Backend (API & SignalR)
1. Open a new terminal in VSCode (`Terminal` > `New Terminal`).
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Run the .NET application:
   ```bash
   dotnet run
   ```
*The backend will typically start on `http://localhost:5033` or whichever ports are defined in `backend/Properties/launchSettings.json`.*

### Step 3: Start the Frontend (Web UI)
1. Open a **second** terminal in VSCode (click the `+` icon in the terminal panel).
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Run the development server. **Important**: You must point the frontend to your backend API URL. If your backend started on port 5033 (check your backend terminal output), run:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5033 npm run dev
   ```
*(If your backend is running on `http://localhost:8080` via docker-compose, you do not need the environment variable override as it is the default).*

### Step 4: Access the Application
- **Main Client App**: Open your browser to `http://localhost:3000`
- **Admin Dashboard**: Navigate to `http://localhost:3000/admin`
  - **Username**: `judge`
  - **Password**: `Hackathon2025!`

## Running Everything with Docker Compose (Alternative)
If you prefer not to use the terminal commands above and have Docker Desktop running:
```bash
docker compose up --build
```
This will spin up the database, backend (port `8080`), and frontend (port `3000`) simultaneously.
