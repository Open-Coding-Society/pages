# 3.7 Nested Conditionals — 15-minute script

**Rotation:** Kashyap → Aaditya → Chetan, about a minute each, five turns apiece.
**On screen the whole time:** `/python/nested-conditionals/py`
**Say this three times during the lesson** (minutes 6, 12, 15): *"Count the situations, then count the answers. They should match."*

Everything below is written to be said out loud to people who have never coded. Don't read it word for word — read it twice beforehand and say it your way.

---

## 1 · KASHYAP · 0:00–1:00 · The hook

> "Everybody here has logged into something. You type your password, hit enter, and the website decides what happens next.
>
> That's all we're doing today. We're going to write the part of a website that makes that decision — and we're going to start by writing it **badly**, on purpose, so you can see exactly what goes wrong.
>
> Because here's the thing about the bug we're showing you. It doesn't crash. It doesn't turn red. It doesn't say 'error' anywhere. The program runs perfectly and just... does nothing. And that's so much worse than an error, because an error at least tells you where to look."

*Scroll to Example A but don't run it yet.*

---

## 2 · AADITYA · 1:00–2:00 · What a true/false value is

> "One thing you need before the code makes sense.
>
> In programming you can store a fact and give it a name. Look at this line: `password_correct = False`. That's us saying: there's a fact called `password_correct`, and right now it is False. The person got the password wrong.
>
> It's only ever one of two things — True or False. Yes or no. It's like a light switch: on or off, nothing in between.
>
> So when I say 'the condition,' I just mean one of these yes-or-no facts. That's it. Nothing more complicated than that."

---

## 3 · CHETAN · 2:00–3:00 · What `if` means

> "Now the word `if`. It means the same thing in code that it means in English.
>
> 'If it's raining, bring an umbrella.' If the raining fact is True, you do the umbrella thing. If it's False, you skip it.
>
> Read this code the same way: **if** the password is correct, print 'Welcome back.' That's the whole instruction.
>
> And notice what's *not* written here. Nobody said what to do when the password is wrong. In English you'd just assume — obviously tell them it's wrong. The computer doesn't assume anything. If you didn't write it, it doesn't exist."

---

## 4 · KASHYAP · 3:00–4:00 · Run it, nothing happens

*Click Run on the first 3.7A runner.*

> "The password is wrong, so let's see what the website tells this person.
>
> Nothing. Look at the output box — completely empty.
>
> No error. No red text. The program ran all the way to the end and finished successfully. It just never had anything to say, because we never told it what to do in the wrong-password case.
>
> And think about what that looks like to a real person. You type your password, hit enter, and the page just sits there. You don't know if it's loading, if the site is broken, or if you got it wrong. So you click the button four more times. You've all done this."

---

## 5 · AADITYA · 4:00–5:00 · The fix

*Scroll to the second 3.7A runner.*

> "Here's the fix, and it's one word: `else`.
>
> `else` means 'otherwise.' If the password is right, say welcome. **Otherwise**, say the password didn't match.
>
> Now every person who visits gets told something. Right password, you get a message. Wrong password, you get a message. Nobody is left staring at a blank screen."

*Click Run.*

> "There it is. 'That password doesn't match, try again.' One word of code, and the silence is gone."

---

## 6 · CHETAN · 5:00–6:00 · Counting

> "This is the idea we actually want you to walk out with, so here it is slowly.
>
> Before you write any code, count how many different situations can happen. We had one yes-or-no fact, the password. So two situations: right or wrong.
>
> Then count how many places your code actually says something. We call those **leaves** — the end of a branch, where the program stops and talks.
>
> The broken version had two situations but only one leaf. Two doesn't equal one, so something was missing. That's how you catch this bug **before** you run anything.
>
> Count the situations, count the answers. They should match."

---

## 7 · KASHYAP · 6:00–7:00 · A second question

> "Now let's make it realistic, because a real login asks more than one question.
>
> Say the password is right — should you just let them in? Not necessarily. What if that password is being typed on a computer the account has never seen before, in a country you've never been to?
>
> A right password from a brand-new device is exactly what it looks like when somebody **steals** your password.
>
> So real websites check a second fact: is this a device we recognize? Our second condition is `new_device`. Now we have two yes-or-no facts instead of one."

---

## 8 · AADITYA · 7:00–8:00 · Four situations

*Scroll to Example B and its table.*

> "Two facts, so how many situations? Two times two — four.
>
> Right password, known device — log them in.
> Right password, new device — don't let them in yet, email them a code first.
> Wrong password, known device — just tell them it's wrong.
> Wrong password, new device — tell them it's wrong, **and** email the real owner that somebody tried from somewhere new.
>
> Four situations, four different answers."

*Click Run, then change one value and run again.*

> "Same code, different facts, different answer. That's the whole point."

---

## 9 · CHETAN · 8:00–9:00 · Why you can't shortcut it

> "You might think: why not just write 'if the password is right AND the device is known, let them in'? One line instead of all this.
>
> Because 'and' only gives you two answers. Either both things were true, or they weren't. It can't tell you **which one** failed.
>
> So all three of the other rows get shoved into one pile. And that means a correct password from a strange device — the stolen-password case — gets treated exactly like someone who just typo'd.
>
> The attacker and a real person locked out of their own laptop see the identical screen. That's the bug. You need the nesting to tell them apart."

---

## 10 · KASHYAP · 9:00–10:00 · Same thing in JavaScript

*Scroll to the JavaScript runner and click Run.*

> "Quick detour. This is the exact same decision written in a different language — JavaScript, the language websites run on.
>
> Look at it next to the Python one. Python uses spacing to show what's inside what. JavaScript uses curly brackets. Python writes 'and' as the word and; JavaScript writes two ampersands.
>
> Different punctuation. Identical decision. Four situations, four answers, same order.
>
> So none of what we're teaching is really about Python. It's about the thinking."

---

## 11 · AADITYA · 10:00–11:00 · Same thing on the AP exam

*Scroll to the pseudocode block.*

> "And here it is a third way. This one is called pseudocode — it's the fake language College Board uses on the AP exam so they don't have to pick a real one.
>
> `DISPLAY` just means print. The little arrow means 'store this value.' The curly brackets group things, like in JavaScript.
>
> Same four answers again. Which means if you can count situations and count answers, you can do this question on the exam no matter what language they print it in. You're not memorizing Python. You're learning a way of thinking that survives the translation."

---

## 12 · CHETAN · 11:00–12:00 · The guard

*Scroll to Example C.*

> "One more real-world piece. Before any of this, there's a question we skipped: does an account with that email even **exist**?
>
> If there's no account, asking 'was the password right?' is meaningless. Right compared to what? There's nothing to compare it to.
>
> So we check that first, and if there's no account we stop immediately. We call that a **guard** — the question you ask first because it makes the other questions pointless.
>
> Three facts means eight situations, but our code only has five answers. That's allowed, but only because we can say exactly which situations got absorbed and why. If you can't explain it, you didn't simplify — you forgot something."

---

## 13 · KASHYAP · 12:00–13:00 · Why the wording is weird

> "Read the message for 'no account.' It says *'If that email has an account, we've sent it a sign-in link.'*
>
> That's a strange way to talk. Why not just say 'no account with that email'?
>
> Because that would hand an attacker a free tool. They could type in ten thousand email addresses and the site would happily tell them which ones are real. Now they know exactly who to target.
>
> So the message answers the actual user without answering the attacker. That's a real decision real engineers make — and it's just one of our leaves, worded carefully."

---

## 14 · AADITYA · 13:00–14:00 · Popcorn hack

*Scroll to the Popcorn Hack.*

> "Your turn. Two minutes.
>
> Run this cell without changing anything, and answer in the chat: **what does it print, and is that an error or a bug?**
>
> Then fix it so all four situations print something, and paste your code in the chat."

*Give them a moment, then:*

> "It prints nothing. And it's a bug, not an error — errors are loud, bugs are quiet. This one is quiet."

---

## 15 · CHETAN · 14:00–15:00 · Homework and close

> "Homework is on the page. Take the version with the guard, add one more fact — whether the account is locked from too many wrong tries — and write out every situation.
>
> Then publish it to your portfolio and paste the link in the box at the bottom of this page.
>
> And if you forget everything else from the last fifteen minutes, keep this:
>
> **Count the situations. Count the answers. They should match.** If they don't, one case is missing — and in Python, missing doesn't mean broken. It means silent. Nothing tells you. That count is your only warning."

---

## Totals

| Person | Segments | Time |
|---|---|---:|
| Kashyap | 1, 4, 7, 10, 13 | 5 min |
| Aaditya | 2, 5, 8, 11, 14 | 5 min |
| Chetan | 3, 6, 9, 12, 15 | 5 min |

## If you fall behind

Cut **10 (JavaScript)** and **13 (the wording)** first — they're the most self-contained. Never cut 14, the popcorn hack; that's the class's participation grade.

## If the Python Run button says "Failed to fetch"

The backend is down. It does this on every lesson, not just ours. Say so, read the expected output out loud, and keep moving. The JavaScript runner still works.
