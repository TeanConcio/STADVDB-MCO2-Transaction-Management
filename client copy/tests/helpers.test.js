/* eslint-disable no-undef */
// Import functions to test
import {
    formatDate,
    formatName,
    formatEnum,
    addUnique,
    formatText,
} from "../src/util/helpers";



// Test Suite
describe("Test Helper Functions", () => {

    // Test allowed function
    test("formatName - Test formatting names", () => {
        expect(formatName("Doe", "John")).toBe("DOE, John");
        expect(formatName("Smith", "Jane")).toBe("SMITH, Jane");
        expect(formatName("Doe", "Jane")).toBe("DOE, Jane");
    });
});