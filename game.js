(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Cinder = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var ROUNDS = 8;
  var START_FLAME = 5;
  var MAX_FLAME = 10;
  var ROUND_MS = 12000;
  var REVEAL_MS = 4200;

  function resolveRound(flame, storm, seats) {
    var notes = [];
    var per = [];
    var f = flame;
    var died = false;
    var sheltered = seats.some(function (s) { return s.vow === "shelter"; });
    if (storm === "wind") {
      if (sheltered) notes.push("Shelter holds. The wind takes nothing.");
      else {
        f -= 2;
        notes.push("The wind tears 2 off the flame.");
        if (f <= 0) {
          f = 0;
          died = true;
          notes.push("The match goes out before anyone can feed it.");
        }
      }
    } else if (storm === "rain") {
      notes.push("Rain. Kindling only adds 1.");
    } else {
      notes.push("Calm air.");
    }
    var gifts = seats.filter(function (s) { return s.vow === "gift"; }).length;
    seats.forEach(function (s) {
      if (died) {
        per.push({ id: s.id, name: s.name, vow: s.vow || null, delta: 0, note: "too late" });
        return;
      }
      if (!s.vow) {
        per.push({ id: s.id, name: s.name, vow: null, delta: 0, note: "no vow" });
        return;
      }
      var delta = 0;
      var note = "";
      if (s.vow === "shelter") note = "sheltered";
      else if (s.vow === "kindling") {
        delta = storm === "calm" ? 2 : storm === "rain" ? 1 : 0;
        note = delta ? "kindling +" + delta : "kindling blew away";
      } else if (s.vow === "gift") {
        delta = gifts >= 2 ? 1 : 0;
        note = delta ? "gift +1" : "a lone gift fizzles";
      } else if (s.vow === "gamble") {
        delta = storm === "calm" ? 3 : storm === "rain" ? -1 : -3;
        note = "gamble " + (delta > 0 ? "+" : "") + delta;
      }
      f += delta;
      if (f > MAX_FLAME) f = MAX_FLAME;
      if (f <= 0) {
        f = 0;
        died = true;
        note += ". The match goes out.";
      }
      per.push({ id: s.id, name: s.name, vow: s.vow, delta: delta, note: note });
    });
    return { flame: f, died: died, notes: notes, per: per };
  }

  function makeCode() {
    var alph = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var s = "";
    var buf = new Uint8Array(4);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(buf);
    else for (var i = 0; i < 4; i++) buf[i] = Math.floor(Math.random() * 256);
    for (var j = 0; j < 4; j++) s += alph[buf[j] % alph.length];
    return s;
  }

  return {
    ROUNDS: ROUNDS,
    START_FLAME: START_FLAME,
    MAX_FLAME: MAX_FLAME,
    ROUND_MS: ROUND_MS,
    REVEAL_MS: REVEAL_MS,
    resolveRound: resolveRound,
    makeCode: makeCode
  };
});
