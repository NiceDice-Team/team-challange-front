import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import path from "path";
import fs from "fs";
import ForgotPasswordSuccessPage from "@/app/(auth)/forgot-password/success/page";

jest.mock("react-i18next", () => {
  const pathMod = require("path");
  const fsMod = require("fs");
  const common = JSON.parse(
    fsMod.readFileSync(pathMod.resolve(process.cwd(), "public/locales/en/common.json"), "utf8"),
  );
  function lookupTranslation(key) {
    const parts = key.split(".");
    let cur = common;
    for (const p of parts) {
      cur = cur?.[p];
    }
    return typeof cur === "string" ? cur : key;
  }
  return {
    useTranslation: () => ({
      t: (key) => lookupTranslation(key),
    }),
  };
});

const successCopy =
  JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "public/locales/en/common.json"), "utf8"),
  )["forgot-pass"].success;

jest.mock("@/components/shared/Toast", () => ({
  showCustomToast: jest.fn(),
}));

jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock("next/link", () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const { showCustomToast } = require("@/components/shared/Toast");

describe("ForgotPasswordSuccess Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the forgot password success page correctly", () => {
    render(<ForgotPasswordSuccessPage />);

    expect(screen.getByRole("heading", { name: successCopy.title })).toBeInTheDocument();

    expect(screen.getByText(successCopy.descriptionLine1)).toBeInTheDocument();
    expect(screen.getByText(successCopy.descriptionLine2)).toBeInTheDocument();

    expect(screen.getByText(successCopy.resend)).toBeInTheDocument();
    expect(screen.getByText(successCopy.resend).closest("a")).toHaveAttribute("href", "/forgot-password");

    expect(screen.getByText(successCopy.continueShopping)).toBeInTheDocument();
    expect(screen.getByText(successCopy.continueShopping).closest("a")).toHaveAttribute("href", "/catalog");
  });

  test("shows success toast on component mount", () => {
    render(<ForgotPasswordSuccessPage />);

    expect(showCustomToast).toHaveBeenCalledWith({
      type: "success",
      title: successCopy.toastTitle,
      description: successCopy.toastDescription,
    });
  });

  test("has correct styling classes", () => {
    render(<ForgotPasswordSuccessPage />);

    const heading = screen.getByRole("heading", { name: successCopy.title });
    const container = heading.closest("div");
    expect(container).toHaveClass("flex", "flex-col", "items-center", "mx-auto");
  });

  test("includes accessibility attributes", () => {
    render(<ForgotPasswordSuccessPage />);

    const arrowImage = screen.getByAltText("arrow");
    expect(arrowImage).toBeInTheDocument();
  });
});
