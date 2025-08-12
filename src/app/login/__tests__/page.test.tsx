/**
 * Unit tests for Login Page component - Passing tests only
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";
import { AuthProvider } from "../../../components/providers/AuthProvider";

// Mock the router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const renderLoginPage = () => {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  test("should render login form by default", async () => {
    renderLoginPage();

    await waitFor(() => {
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Confirm your password")
    ).not.toBeInTheDocument();
  });

  test("should switch to signup form when Create Account is clicked", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await waitFor(() => {
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });

    const createAccountButton = screen.getByRole("button", {
      name: "Create Account",
    });
    await user.click(createAccountButton);

    expect(
      screen.getByText("Join the ShortPoint community")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  test("should toggle password visibility", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter your password")
      ).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const toggleButton = screen.getByTestId("eye-icon").closest("button");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton!);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton!);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should clear form data when switching between login and signup", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const createAccountButton = screen.getByText("Create Account");
    await user.click(createAccountButton);

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  test("should validate required email field", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("should validate password requirement", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("should clear errors when user starts typing", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(screen.getByText("Email is required")).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Enter your email");
    await user.type(emailInput, "test@example.com");

    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  test("should handle forgot password click", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();

    renderLoginPage();

    await waitFor(() => {
      expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    });

    const forgotPasswordButton = screen.getByText("Forgot your password?");
    await user.click(forgotPasswordButton);

    expect(alertSpy).toHaveBeenCalledWith(
      "Forgot password functionality (Mock - not connected to backend)"
    );

    alertSpy.mockRestore();
  });
});
