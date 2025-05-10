import { defineConfig } from "vite";
import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid({
      adapter: vercel(),
      entry: {
        server: "src/entry-server.jsx",
        client: "src/entry-client.jsx",
      }
    })
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src")
    }
  }
});