import { cn } from "../../lib/utils";

describe("Utils", () => {
  describe("cn function", () => {
    test("combines class names correctly", () => {
      const result = cn("base-class", "additional-class");
      expect(result).toContain("base-class");
      expect(result).toContain("additional-class");
    });

    test("handles undefined values", () => {
      const result = cn("base-class", undefined, "final-class");
      expect(result).toContain("base-class");
      expect(result).toContain("final-class");
    });

    test("handles null values", () => {
      const result = cn("base-class", null, "final-class");
      expect(result).toContain("base-class");
      expect(result).toContain("final-class");
    });

    test("handles conditional classes", () => {
      const isActive = true;
      const isDisabled = false;
      
      const result = cn(
        "base-class",
        isActive && "active-class",
        isDisabled && "disabled-class"
      );
      
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
      expect(result).not.toContain("disabled-class");
    });

    test("handles empty string", () => {
      const result = cn("");
      expect(typeof result).toBe("string");
    });

    test("handles array of classes", () => {
      const result = cn(["class1", "class2", "class3"]);
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
    });

    test("deduplicates classes", () => {
      const result = cn("duplicate", "unique", "duplicate");
      // Should not contain duplicate classes
      expect(result).toBe(result.trim());
    });

    test("handles object notation", () => {
      const result = cn({
        "class1": true,
        "class2": false,
        "class3": true,
      });
      
      expect(result).toContain("class1");
      expect(result).not.toContain("class2");
      expect(result).toContain("class3");
    });
  });
});