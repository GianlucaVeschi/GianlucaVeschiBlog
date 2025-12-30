---
title: "Building PrenotamiBerlin with Cursor: a tiny Selenium bot that books for you"
date: 2025-12-30 09:00:00 +0100
tags: [automation, selenium, python]
---

### Introduction (Skip me if you just want the nerd stuff)

On a trip to Hong Kong In 2023 I decided to go for a solo walk in the outskirts of the Hill Kwun Yam Buddhist Temple. It was a beatiful day to explore the jungle around the city, and apparently also a very good one to lose my wallet.

I have looked for it everywhere, and considering that Hong Kong has one of the [lowest crime rate of the world](https://www.macrotrends.net/global-metrics/countries/hkg/hong-kong/crime-rate-statistics), I excluded the fact that someone had stolen it from me. 

Most of my cards and my Italian ID were gone, but luckily I still had my passport and a Revolut card in my backpack, so I could keep roaming around in Asia for a few more weeks.

As soon as I arrived in Italy, I booked an appointment to renew my ID card, and since my official residency is in Berlin, I could only get a "Paper ID Card". Something that looks like straight from the 80s.

I liked having it around me and having the occasional foreigner laughing at me for the looks of it, but Italy has recently introduced a law for which we all have to get a digital ID card, and for me, this meant booking an appointment at the embassy of Berlin to book a renewal. 

How complicated can it be? Well.... Good luck.

I tried to book an appointment through the Embassy's website and for some reason I could not find any available booking. So I decided to send them an email, and this was their response

![Embassy Response](/assets/posts/prenotami-berlin/risposta_ambasciata.png)

If you speak Italian, I challenge you to understand their message. If you don't, don't even bother trying to translate it. No LLM can yet understand this intricated bureacratic jargon.

After reading their Message a couple of times, I understood that 
- You can book a slot between the 2nd and the 8th week from today (yes, wtf)
- The embassy's booking system refreshes every day at 7AM
- Every time the system refreshes, they open for one more day (If it's a working day)
- Your best chance to get a slot is to wake up at 6AM something and try it as soon as it's ready.

There is no way on earth I am waking up so early for this, So I thought to myself that there must be another way

### Nerd Stuff

 I shipped a small side project called **PrenotamiBerlin**: a bot that helps me grab an appointment slot on `prenotami.esteri.it` right when new availability drops (for Berlin, that’s **7:00 AM**).

The fun part: I built it *fast* with **Cursor** by iterating in tight loops—write intent, generate code, run it, inspect screenshots/logs, fix the selectors, repeat.

![Cursor-assisted workflow](/assets/posts/prenotami-berlin/cursor-workflow.svg)

## What the bot does (high level)

The repository is basically:

- **`prenotami_bot.py`**: open Chrome, login, click “Prenota”, click “PRENOTA”, check for slots, optionally fill the form and confirm.
- **`scheduler.py`**: run the bot at the right time (07:00), every day.
- **logs + screenshots**: every run leaves a paper trail so you can debug what happened.

![Bot architecture](/assets/posts/prenotami-berlin/bot-architecture.svg)

## Selenium, explained without the fluff

Selenium is a library that lets your code **control a real browser** (Chrome, Firefox, …).

That’s the key idea:

1. You tell the browser to open a URL
2. You *locate* elements on the page (buttons, inputs)
3. You interact (click, type, submit)
4. You wait for the next page/state (because modern pages are async)
5. You read what changed (DOM text, URL, presence of elements)

![Selenium loop](/assets/posts/prenotami-berlin/selenium-loop.svg)

### The 3 Selenium concepts that matter most

- **Selectors**: how you find elements.
  - Common options: `By.ID`, `By.CSS_SELECTOR`, `By.XPATH`, `By.LINK_TEXT`.
  - Real-world automation is mostly “keep selectors up-to-date as the website changes”.

- **Waits**: most Selenium flakiness comes from clicking too early.
  - Prefer **explicit waits** (`WebDriverWait` + expected conditions) over `time.sleep`.
  - In the bot I still use a mix, because some steps are more stable with a small fixed delay.

- **Headless vs visible browser**:
  - Headless is great for cron/server runs.
  - Visible is best while developing/debugging.

## What you can do with Selenium (beyond booking slots)

Selenium is a “browser automation hammer”. Some legitimate use cases:

- **Smoke-test** critical user flows (login, checkout, booking).
- **Regression testing** after UI changes.
- **Backoffice automation** for boring internal workflows (where APIs don’t exist).
- **Monitoring**: detect when a page changes (copy, availability, pricing, etc.).
- **Screenshot-based auditing**: archive evidence of what a page looked like at a point in time.

## Practical notes (the stuff you learn the hard way)

- **CAPTCHAs change everything**: once CAPTCHAs enter the flow, fully automated booking usually becomes “semi-automated”.
- **Be kind to servers**: use rate limits, backoff, and avoid hammering endpoints.
- **Don’t skip screenshots/logging**: they’re the fastest way to understand failures.
- **Terms of service**: always consider whether automation is allowed for the site you’re interacting with.

## What’s next

If I keep iterating on PrenotamiBerlin, I’d likely add:

- Better **selectors** (more robust, fewer XPaths)
- A clean **notification** path (email/push) on “slot found”
- Retries at **07:00 + a few minutes** to handle transient failures

If you’re reading this and thinking “I should automate that annoying website too”, you probably can—with one condition: treat it like a product. Observe, iterate, and keep it reliable.


