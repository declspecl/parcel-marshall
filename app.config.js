// 📦 APP CONFIGURATION FILE
//
// This file sets up the environment configuration for the app.
// It allows secure use of environment variables like API keys
// without hardcoding them into the codebase.
//
// ✅ Required setup:
// 1. Create a `.env` file in the root of the project.
//    Example:
//      GOOGLE_MAPS_API_KEY=your_api_key_here
//
// 2. Make sure `.env` is listed in `.gitignore` to keep your key private.
//
// This setup ensures your API keys and other secrets are safe
// and keeps your codebase clean and secure.

import "dotenv/config";

export default ({ config }) => ({
    ...config,
    extra: {
        ...config.extra,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
    }
});
//this wont crash if variable is missing
