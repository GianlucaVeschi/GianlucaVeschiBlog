---
title: "From Fintech to Marketplace: Reflections on becoming a Fullstack Software Engineer"
date: 2026-03-02 09:00:00 +0100
tags: [career, engineering, travel]
image: https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80
# Photo by Ivana Cajina on Unsplash - Mountain landscape
---

# From Fintech to Marketplace: Reflections on becoming a Fullstack Software Engineer

Exactly one year ago, I started my new job at **GetYourGuide**.

Before that, I spent two years at **Qonto**, a company I really enjoyed, and one where I learned a lot about engineering
culture, product quality, and collaboration. I was happily employed as an Android Engineer and was on track to become a
**Senior Developer**. Then I received an offer that was hard to ignore financially, and I decided to make the move.

Looking back, I don’t know if it was the “perfect” decision, but it was the best decision I could make with the
information I had at the time.

I started my career in late 2019 as an Android Developer Intern for a company in Shanghai, and I genuinely enjoyed
building apps. At the time, Android also felt like a very structured ecosystem. Clear architectural constraints made it
easier to learn than the constant churn of picking tools in some other stacks.

After working at Thalia / Douglas, I realized that traditional e-commerce wasn’t the domain I wanted to stay in
long-term. I wanted to get into **fintech**, which is what pushed me toward Trade Republic.

My experience there didn’t last long. The expectations were intense, and the environment didn’t feel like the right
place for me to grow as a junior engineer at that stage of my career.

When I found Qonto, it felt like an ideal setup. A strong remote culture, and a team I really enjoyed working with
(plus a paid trip to Paris every three months). But eventually another opportunity came along, and that’s how I ended up
at GetYourGuide, back in a **consumer-facing marketplace**.

GetYourGuide is a global company; Qonto is European with a strong base in France. They’re simply operating in different
contexts, and that shapes engineering trade-offs. Over time, I’ve learned that it’s less about “better vs worse” and
more about what each company optimizes for.

## The first mindshift: the experimentation model

GetYourGuide is split into two: a Supplier space (B2B) and a Traveler space. I work in the latter, which means mostly
**B2C**.

In B2C, you often can’t rely on users clearly stating what they want ahead of time. A lot of learning happens through
behavior, so we work in an endless loop of **A/B experiments**.

Do you prefer to see activities in a long list or in a swimlane? Do you like a sell-out badge? What do you think about
a promotional banner? Would you be more likely to book if we highlight the differences between two activities? These
are typical questions in an experiment-driven product space.

One consequence of this model is that many initiatives are intentionally short-lived. If an experiment doesn’t move the
metrics, you move on. That can create friction with the “build it once, polish it forever” mindset, and it requires
discipline to keep **technical complexity** under control over time. You still care about quality, but you also accept
that **speed-to-learn** matters, and sometimes the right decision is to stop investing and iterate elsewhere.

There’s nothing inherently bad about this, but it took me a while to make that mindset switch.

At Qonto, we were building for freelancers and companies who often had clear needs and workflows, and the product work
could be more about execution and refinement. In a marketplace, uncertainty is higher, so the development loop tends to
be more exploratory. That’s one of the big differences I’ve felt between fintech and an online marketplace.

## The second mindshift: the generalist software engineer

When building a mobile application, you need a lot of mobile development effort early on. UI flows for sign-in,
registration, navigation, settings, and so on. As a product matures, some areas stabilize, and the work shifts toward
iteration rather than constant reinvention.

In parallel, backend needs often keep growing. The user base increases, systems become more complex, and you introduce
personalization, observability, and reliability practices, all of which can expand the backend surface area even if the
app UI doesn’t change dramatically.

Of course, mobile work never “ends”. Architecture improvements, performance, accessibility, and maintainability matter.
But depending on the product and the organization, the highest-leverage problems may increasingly span multiple layers
of the stack.

This is why at GetYourGuide, many mobile developers are also backend-savvy.

A big part of that is our **SDUI framework**, which has been built over the years by many talented engineers and has
become a foundational platform at GYG.

Frontend, Mobile, and Backend engineers all contribute to the SDUI repository. It delivers “Blocks” and “Sections” that
are interpreted by mobile apps at runtime. It’s a complex system, but that’s not the focus of today.

The main point is that to stay close to the most impactful problems, mobile engineers often end up contributing beyond
the app itself, backend included.

At the same time, the pace of improvement in **AI tools** has made cross-stack collaboration feel more accessible than
it used to. If you understand the architecture and data flow of a mobile app and you’re familiar with common software patterns, you
can often become productive in adjacent stacks faster, especially with tooling that helps with syntax, scaffolding, and
repetitive tasks. You still need solid engineering judgment and review discipline, but the barrier to entry is lower.

A combination of these two things is what makes a company like GetYourGuide a special place to grow.

## Conclusion

All in all, I might not present as a “pure” Android developer anymore. I haven’t had to think deeply about ViewModel
state management, coordinators, or complex custom UI work in a while, but I’m okay with that. I suspect many engineers
who started in a very specialized niche are feeling something similar right now.

What matters most to me is growing into a role where making good **architectural decisions**, and helping others make
them, becomes a core skill.
