const assert = require("assert");
const C = require("../game.js");

function seat(name, vow) { return { id: name, name: name, vow: vow }; }

let r = C.resolveRound(5, "wind", [seat("A", "kindling")]);
assert.strictEqual(r.flame, 3);
assert.strictEqual(r.died, false);

r = C.resolveRound(2, "wind", [seat("A", "kindling")]);
assert.strictEqual(r.flame, 0);
assert.strictEqual(r.died, true);
assert.strictEqual(r.per[0].note, "too late");

r = C.resolveRound(2, "wind", [seat("A", "shelter"), seat("B", "kindling")]);
assert.strictEqual(r.flame, 2);
assert.strictEqual(r.died, false);

r = C.resolveRound(5, "calm", [seat("A", "kindling")]);
assert.strictEqual(r.flame, 7);

r = C.resolveRound(5, "rain", [seat("A", "kindling")]);
assert.strictEqual(r.flame, 6);

r = C.resolveRound(5, "calm", [seat("A", "gift")]);
assert.strictEqual(r.flame, 5);
assert.ok(r.per[0].note.indexOf("fizzles") >= 0);

r = C.resolveRound(5, "calm", [seat("A", "gift"), seat("B", "gift")]);
assert.strictEqual(r.flame, 7);

r = C.resolveRound(5, "wind", [seat("A", "gamble")]);
assert.strictEqual(r.flame, 0);
assert.strictEqual(r.died, true);

r = C.resolveRound(9, "calm", [seat("A", "gamble")]);
assert.strictEqual(r.flame, 10);

r = C.resolveRound(4, "rain", [seat("A", "gamble"), seat("B", "shelter")]);
assert.strictEqual(r.flame, 3);

r = C.resolveRound(1, "calm", [seat("A", null)]);
assert.strictEqual(r.flame, 1);

console.log("rules ok");
