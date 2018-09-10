const expect = require("expect");

const {isRealString}= require("./validation");

describe("isRealString", () => {
    it("Should reject non-string values", () => {
        let res = isRealString(88);
        expect(res).toBe(false);
    });

    it("should reject string with white spaces", () => {
        let res = isRealString("     ");
        expect(res).toBe(false);
    });

    it("should allow string with non-aspace characters", () => {
        let res = isRealString("   Fern    ");
        expect(res).toBe(true);
    });
});