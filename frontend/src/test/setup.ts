import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Clean virtual DOM after each test
afterEach(() => {
  cleanup();
});
