import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Proxy middleware for Flask backend
  app.use("/api", async (req, res) => {
    const flaskUrl = process.env.FLASK_API_URL || "http://localhost:5000";
    const targetUrl = `${flaskUrl}${req.path}`;

    try {
      const fetchOptions: RequestInit = {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (req.method !== "GET" && req.method !== "HEAD") {
        if (req.body && Object.keys(req.body).length > 0) {
          fetchOptions.body = JSON.stringify(req.body);
        }
      }

      // Handle query strings
      const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
      const finalUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

      const response = await fetch(finalUrl, fetchOptions);
      const data = await response.text();

      res.status(response.status);
      response.headers.forEach((value, name) => {
        if (name.toLowerCase() !== "content-encoding") {
          res.setHeader(name, value);
        }
      });

      res.send(data);
    } catch (error) {
      console.error(`Error proxying request to Flask:`, error);
      res.status(500).json({
        error: "Error connecting to backend",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  return app;
}
