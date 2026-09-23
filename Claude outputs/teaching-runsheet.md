# 3.7 Nested Conditionals — 15-minute run sheet

Page open on screen: `/python/nested-conditionals/py`

**The one thing they should leave with:** *n conditions → 2ⁿ outcomes. Count the leaves.*
If someone can only remember one sentence tomorrow, that's the one. Say it at minute 2, minute 8, and minute 14.

---

## 0:00–4:00 · CHETAN — the hook and the rule

**Open cold, no intro.** Don't say "today we're learning about nested conditionals." Put Example A on screen and say:

> "This is a scam-warning app. A message asks you for money, it warns you. Watch."

**Click Run on 3.7A.** Nothing prints.

> "Nothing happened. No error either. If you were skimming, you'd think it worked. That's the whole lesson — in Python, a missing branch is silent."

Now the rule. **Scroll to the Quick Reference table.**

> "One condition means two possible situations. This code only handles one of them. A *leaf* is a spot where the program actually stops and does something. Count the leaves — there's one. Count the outcomes — there's two. When those numbers don't match, you have a bug, and you found it without running anything."

**Click Run on the second 3.7A runner** (the one with `else`). Now it prints.

> "One `else`. Two outcomes, two leaves. Nothing disappears."

⏱ **Hard stop at 4:00.** If you're behind, cut the Quick Reference scroll, not the Run clicks.

---

## 4:00–9:00 · AADITYA — four leaves, three languages

> "'No money request' is a weak answer though. Whether a message is dangerous also depends on *who sent it*."

**Show Example B.** Walk the four rows of the truth table out loud, then stop on row 1:

> "This is the one people get wrong. A *known contact* asking for money is usually a hacked account — that's more dangerous than a stranger, not less."

**Ask the class** (this is your engagement beat, ~30 seconds):

> "If I wrote this as `if asks_for_money and not known_contact`, which rows break?"

Answer if nobody gets it: rows 1, 3 and 4 collapse into one "everything else," so the hacked-account case gets treated as "nothing to do."

**Click Run on 3.7B.** Then change `known_contact` to `False`, run again. Two different leaves, live.

**Then the three languages.** Click Run on the JavaScript runner, scroll to the pseudocode block.

> "Same four leaves, three languages. Python uses indentation, JavaScript uses braces, the exam uses `DISPLAY`. The counting doesn't change — which is why the exam can ask this without caring what language you write."

⏱ **Hard stop at 9:00.**

---

## 9:00–13:00 · KASHYAP — the guard, then popcorn

> "One more real problem. What if no message has loaded yet? Then asking whether it wants money is meaningless."

**Show Example C.** Point at the guard.

> "Three conditions means eight combinations, but there are only five leaves. That's not a bug — the guard absorbs four of them. That sentence is the difference between a guard and a missing branch: if you can *name* which combinations collapsed, it's a guard. If you can't, you forgot a case."

**Popcorn hack — 2 minutes, run it on the clock.**

> "Scroll to the Popcorn Hack. Run it first, don't change anything. Tell me in chat: what does it print, and is that an error or a bug?"

Expected answer: prints nothing; it's a bug, not an error.
Then: "Now fix it so all four combinations print. Paste it in chat."

⏱ **At 12:00, call time even if people aren't done.** Say "finish it for homework" and move on.

---

## 13:00–15:00 · ANYONE — homework and close

- Homework hack: start from Example C, add `has_link` as a fourth condition, keep the guard on top.
- Everything gets submitted through the **Submit Code** form at the bottom of the page.
- Point at the validation checklist in section 4: the two things people lose points on are a missing leaf-count comment and an input combination that prints nothing.

**Close on the rule, one more time:**

> "n conditions, 2ⁿ outcomes. Count the leaves. If they don't match, a case is missing — and Python won't tell you."

---

## Questions you should have answers ready for

| Question | Answer |
|---|---|
| "Why not just use `and`?" | `and` gives you "both true" and "everything else." It can't tell "only a" from "only b" from "neither." Nest when those need different answers. |
| "Is `elif` the same as a nested `if`?" | Often yes in behavior. `elif` flattens a nest that's inside an `else`. Use it when the conditions are alternatives at the same level; nest when the second question only makes sense inside the first answer. |
| "Why is it 5 leaves and not 8?" | The guard absorbs 4 combinations. If the message never loaded, the other two conditions describe nothing that exists. |
| "Does the order of conditions matter?" | Yes. Move the guard below the money check and you're asking whether a message that doesn't exist is asking you for money. |
| "What if I get it wrong on the exam?" | The exam uses pseudocode with `DISPLAY` and braces, but leaf counting works identically. Trace outer first, inner second. |

## If something breaks

- **Python runner says "Failed to fetch."** The backend is down — happens on every lesson, not just ours. Say so and read the expected output aloud. The JavaScript runner still works.
- **You're behind at 9:00.** Cut Example C's table discussion. Keep the popcorn hack — it's graded participation for the class.
- **Nobody answers the chat question.** Give the answer after 10 seconds and move. Don't wait it out.

## Practice checklist

- [ ] Run it start to finish with a timer, out loud, not in your head
- [ ] Whoever's on Example B: say the row-1 explanation without reading it
- [ ] Confirm the page is open and runners load *before* class starts
- [ ] Decide now who clicks Run — the speaker, or one person driving the whole time
- [ ] Write down anything that confused a teammate → that's Revision 2 evidence
