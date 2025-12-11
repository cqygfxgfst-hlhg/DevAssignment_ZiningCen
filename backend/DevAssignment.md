**Dev Assignment #1**

**One-Week Case Study**

To evaluate full-stack engineering candidates, we have crafted a 1-week assignment inspired by one of our app architectures. This assignment involves building a small service using a modern tech stack (ex. NestJS, TypeScript, Postgres, Redis, and React) and integrating external APIs or on-chain data. Candidates should treat this as a real-world project.



**Assignment: Prediction Market Trend Aggregator**

**Overview:**

Build a service that aggregates **prediction markets** from multiple platforms (Polymarket and Kalshi) and identifies trending markets. As part of a larger application, this service helps users discover markets, events or opportunities by collating data from several prediction market platforms. The task involves fetching market data from external APIs, determining which markets are “trending” based on activity, and providing an API to retrieve these trends. A minimal frontend should display the trending markets in a dashboard format.

**Functional Requirements**

- **Multi-Platform Data Fetching:**     Integrate with at least **one or two prediction market platforms** (ex:     **Polymarket, Kalshi**). Fetch a list of active markets and their core     details:

- - Event (ex. “Will XYZ happen by date?”).
  - *Current odds or probability* (ex.      70% yes, or similar metric depending on platform).
  - *Total volume or liquidity*
  - *Market activity metrics:* such as      number of traders or bets, volume in the last 24h, creation date, and      closing/resolution date.

- **Normalization:** Since each     platform’s API may have different schemas, transform the data into a **common     format** in your service. For example, define a model like: { platform:     "Polymarket", question: "...", probability: 0.xx,     volume: X, volume24h: Y, endDate: ..., etc. }.

- **Trending Criteria:** Implement logic     to determine which markets are “trending.” You can use simple heuristics     such as:

- - *Volume Growth:* Compare recent      volume over time.
  - *User Activity:* Popularity of a      market of category.
  - *New Markets:* Ex. Recently created      markets that quickly accumulate volume.
  - *Price/Odds Change:* Ex. Large      swings in odds over a short period.

Define a **“trend score”**. Document your approach to trending logic. (The goal isn’t a perfect algorithm.)

- **Aggregated Trending List API:**     Provide a REST API endpoint that returns the top trending markets. The     response should include the normalized data for each market. Allow query     parameters to adjust or filter by platform.
- **Minimal Dashboard:** Create a simple **React**     dashboard/application which displays the trending markets list in a     user-friendly way.

**Technical Requirements & Constraints**

- **Tech Stack:** Use **NestJS** with **TypeScript**     for the backend service. You might create separate services or modules for     each external platform integration (e.g. a PolymarketService,     KalshiService, etc.). If using a database, integrate via query builder     (Nest + Prisma, etc).
- **External API Integration:** Research     and use the APIs provided by the platforms (ex. Polymarket has a REST API     for fetching market data).
- **Data Volume & Storage:** The     service should be able to handle fetching dozens or hundreds of markets     without timing out. You can store the fetched data in memory or a     database.
- **Combining Data:** Implement the logic     to sort markets by your trend criteria. Ensure that sorting and filtering     is done properly, without repeat markets.
- **Testing & Validation:** We expect     some level of automated testing. Business logic is ideal to unit test.
- **Documentation & Clarity:** A     delivered project should be easy to understand and run. Document any setup     needed (API keys, environment variables). If any assumptions were made,     clearly state them.

**Deliverables**

- **Code Repository:** A repository     containing the complete backend and frontend code. Include all     instructions to build and run the project.
- **API Documentation:** Clearly state     what endpoint(s) are available and their purpose.
- **Trend Logic Explanation:** In the     documentation or a separate design note, explain how you determined     “trending.” This helps us understand your thought process and also lets a     user interpret the results.
- **Tests:** Include your test code in     the repository. Ensure it’s runnable (provide instructions like npm test).
- **Next Steps/Functionality:** 3     features to add to the application, or business cases to expand this     application into a company/business.
- **(Optional) Deployed Demo:** If     possible, a live deployment. This is optional; a deployed App (ex.     Heroku/Vercel instance) or a short video showing the working app is     nice-to-have.

**Evaluation Criteria**

When reviewing your submission, we will use the following criteria:

- **Correctness & Completeness:**     Does the solution fulfill the core requirements? (i.e. fetches token data,     computes a sentiment score, and exposes a ranking API). Are any key     features missing, and if so, was reasoning provided?
- **External Data Handling:** Show that     you can integrate with external data well. Respect rate limits and     consider filtering. In the README, note which APIs or data sources you     used.
- **Architecture Decisions:** Use of     libraries, data structures, algorithms as well as usage of the proposed     tech stack. Even though this is a small project, think ahead in terms of     maintainability and scalability.
- **Code Quality:** Is the code     well-structured, readable, and maintainable? We will look at organization,     naming, and overall cleanliness.
- **Creativity in Metrics & Scoring:** How did you combine the metrics into a sentiment score? Be     ready to discuss and justify your thought process. We value candidates who     think critically. Including additional interesting metrics or insights is     a plus.

Happy coding!

 