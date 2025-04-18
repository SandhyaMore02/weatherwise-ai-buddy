# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/06e1bb85-b79d-4c33-bf44-e9656cee3eea

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/06e1bb85-b79d-4c33-bf44-e9656cee3eea) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/06e1bb85-b79d-4c33-bf44-e9656cee3eea) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Android Development Setup

To run this app on Android:

1. Prerequisites:
   - Install [Android Studio](https://developer.android.com/studio)
   - Install Android SDK (via Android Studio)
   - Install Java Development Kit (JDK) 11 or newer

2. Setup Steps:
   ```bash
   # Install dependencies
   npm install

   # Build the web app
   npm run build

   # Add Android platform
   npx cap add android

   # Sync web code to Android project
   npx cap sync android

   # Open in Android Studio
   npx cap open android
   ```

3. Running the App:
   - In Android Studio, click the "Run" button (green play icon)
   - Select your target device (emulator or connected physical device)
   - Wait for the app to build and launch

4. Important Notes:
   - Minimum Android SDK version: 21 (Android 5.0)
   - Target Android SDK version: 33 (Android 13)
   - The app requires internet permissions for weather data
   - Enable USB debugging on your device for physical testing

5. Troubleshooting:
   - If Gradle sync fails, try "File > Invalidate Caches / Restart"
   - Ensure your Android Studio and SDK tools are up to date
   - Check that USB debugging is enabled on your physical device
   - Verify internet connectivity for weather data fetching
