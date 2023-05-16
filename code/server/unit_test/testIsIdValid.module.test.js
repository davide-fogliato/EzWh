const Position = require('../bin/model/Position.js');


function testIsIdValid(positionID, aisleID, row, col) {
    describe('test IsIdValid valid', () => {
        test('test IsIdValid valid', async () => {
            let p = new Position(positionID, aisleID, row, col, 10, 10);
            const result = p.isIdValid();
            expect(result).toEqual(true);
        })
    })
}
function testIsIdInvalid(positionID, aisleID, row, col) {
    describe('test IsIdValid invalid', () => {
        test('test IsIdValid invalid',  async () => {
            let p = new Position(positionID, aisleID, row, col, 10, 10);
            const result = p.isIdValid();
            expect(result).toEqual(false);
        })
    })
}


testIsIdValid("123412341234", "1234", "1234","1234");
testIsIdInvalid("1234123412341234", "1234", "1234","1234");
testIsIdInvalid("1234123412341234", "1111", "1234","1234");
testIsIdInvalid("", "1234", "1234","1234");
