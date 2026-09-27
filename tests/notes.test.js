const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const store = require("../lib/store");
const { matches } = store;

const NOTES_FILE = path.join(__dirname, "..", "notes.json");

const notes = [
  { id: 1, text: "buy milk" },
  { id: 2, text: "call the bank" },
  { id: 3, text: "milk the almonds" },
];

test("search finds every note that contains the term", () => {
  const result = matches(notes, "milk");
  assert.strictEqual(result.length, 2);
});

test("search finds a single containing note", () => {
  const result = matches(notes, "bank");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, 2);
});

test("search returns nothing when no note contains the term", () => {
  const result = matches(notes, "xyz");
  assert.strictEqual(result.length, 0);
});

test("edit updates the text of an existing note", (t) => {
  t.after(() => fs.rmSync(NOTES_FILE, { force: true }));

  const note = store.add("original text");
  const ok = store.edit(note.id, "updated text");

  assert.strictEqual(ok, true);
  assert.strictEqual(store.all().find((n) => n.id === note.id).text, "updated text");
});

test("edit returns false and leaves notes untouched for a nonexistent id", (t) => {
  t.after(() => fs.rmSync(NOTES_FILE, { force: true }));

  store.add("keep me");
  const ok = store.edit(999, "should not apply");

  assert.strictEqual(ok, false);
  assert.strictEqual(store.all().some((n) => n.text === "should not apply"), false);
});
