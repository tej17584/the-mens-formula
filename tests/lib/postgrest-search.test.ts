import { describe, expect, it } from "vitest";
import { escapePostgrestSearchTerm } from "@/lib/postgrest-search";

describe("escapePostgrestSearchTerm", () => {
  it("escapes PostgREST filter metacharacters", () => {
    expect(escapePostgrestSearchTerm("van, (test)%")).toBe(
      "van\\, \\(test\\)\\%",
    );
  });
});