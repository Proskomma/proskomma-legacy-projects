import transformObjectValue from "helpers/transformObjectValue";

describe("transformObjectValue", () => {
  it("handles simple object array", () => {
    const testItem = { data: [{ name: "mike" }, { name: "john" }] };

    const result = transformObjectValue(testItem, "name", (thing) => {
      return thing.toUpperCase();
    });

    expect(result).toEqual({ data: [{ name: "MIKE" }, { name: "JOHN" }] });
  });

  it("handles nested object array", () => {
    const testItem = {
      data: [
        { type: "person", data: { tribos: '{"things": "are secret"}' } },
        { type: "person" },
      ],
    };

    const result = transformObjectValue(testItem, "tribos", (item) => {
      return JSON.parse(item);
    });

    expect(result).toEqual({
      data: [
        { type: "person", data: { tribos: { things: "are secret" } } },
        { type: "person" },
      ],
    });
  });
});
