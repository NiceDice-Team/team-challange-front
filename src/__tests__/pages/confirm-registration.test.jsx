import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import path from "path";
import fs from "fs";
import ConfirmSignUpPage from "@/app/(auth)/confirm-signup/page";

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
  ).register.success;

jest.mock("@/components/auth/RouteGuards", () => ({
  PublicRoute: ({ children }) => <div data-testid="public-route">{children}</div>,
}));

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

describe("ConfirmSignUp Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the confirm signup page correctly", () => {
    render(<ConfirmSignUpPage />);

    expect(screen.getByTestId("public-route")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: successCopy.title })).toBeInTheDocument();

    expect(screen.getByText(successCopy.descriptionLine1)).toBeInTheDocument();
    expect(screen.getByText(successCopy.descriptionLine2)).toBeInTheDocument();
    expect(screen.getByText(successCopy.descriptionLine3)).toBeInTheDocument();

    expect(screen.getByText(successCopy.browseGames)).toBeInTheDocument();
    expect(screen.getByText(successCopy.browseGames).closest("a")).toHaveAttribute("href", "/catalog");
  });

  test("shows success toast on component mount", () => {
    render(<ConfirmSignUpPage />);

    expect(showCustomToast).toHaveBeenCalledWith({
      type: "success",
      title: successCopy.toastTitle,
      description: successCopy.toastDescription,
    });
  });

  test("has correct styling classes on root content", () => {
    render(<ConfirmSignUpPage />);

    const heading = screen.getByRole("heading", { name: successCopy.title });
    const column = heading.closest("div");
    expect(column).toHaveClass("flex", "flex-col", "items-center");
  });

  test("includes accessibility attributes on arrow image", () => {
    render(<ConfirmSignUpPage />);

    expect(screen.getByAltText("arrow")).toBeInTheDocument();
  });
});
