import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AdditionalCategories from "./AdditionalCategories";

afterEach(cleanup);

function Form({ initial = [] }: { initial?: string[] }) {
  const [selected, setSelected] = useState(initial);
  return <>
    <AdditionalCategories categories={["Boots", "Heels", "Office Picks", "After Dark Selection"]}
      primaryCategory="Boots" value={selected} onChange={setSelected} />
    <output data-testid="selection">{JSON.stringify(selected)}</output>
  </>;
}

describe("multiple product categories", () => {
  it("selects three additional categories for the same product independently", () => {
    render(<Form />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Also add to other categories" }));
    for (const name of ["Heels", "Office Picks", "After Dark Selection"]) {
      fireEvent.click(screen.getByRole("checkbox", { name }));
    }
    expect(JSON.parse(screen.getByTestId("selection").textContent ?? "[]"))
      .toEqual(["Heels", "Office Picks", "After Dark Selection"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Office Picks" }));
    expect(JSON.parse(screen.getByTestId("selection").textContent ?? "[]"))
      .toEqual(["Heels", "After Dark Selection"]);
  });

  it("retains all existing assignments when editing and adding another category", () => {
    render(<Form initial={["Heels", "Office Picks"]} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "After Dark Selection" }));
    expect(JSON.parse(screen.getByTestId("selection").textContent ?? "[]"))
      .toEqual(["Heels", "Office Picks", "After Dark Selection"]);
  });
});