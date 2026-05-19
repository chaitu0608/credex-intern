import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // server-only throws outside Next's react-server runtime; alias to its
      // own empty stub so route handlers can be imported by unit tests.
      "server-only": path.resolve(
        __dirname,
        "./node_modules/server-only/empty.js"
      ),
    },
  },
});
