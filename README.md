# Apply AI Take-Home Assignment

## Task
Naive Skate inc. is a fictional skateboard manufacturer that has contracted us to build a new **AI-powered shopping assistant** on their existing ecommerce store to help users navigate the product line.

You have been tasked to build a POC of this Shopping assistant.

**The assistant should enable users to:**
- describe products they want in natural language
- receive recommendations
- generate personalized product content
- explore products through an AI-assisted interface

**Example User input:**

> “I need a board setup that's good for cruising in a city but small enough for me to take on transit. What would you recommend?”

> "What wheels should I buy for downhill?"

> "I have $100 budget for a skateboard, what setup would you recommend?"

---

Your solution should integrate with the current codebase and be designed to work at scale. 

**These are the system requirements you must address as part of your solution:**
  - Daily users: 50,000
  - Peak concurrent users: 2,000
  - Average session length: 5 minutes
  - Average prompts per session: 3
  - Expected response latency: Under 3 seconds

--- 

You have full autonomy here on what LLM, stack and/or architecture to adopt in your solution.
The only requirement is the solution you implement must leverage an LLM (of your choice) and you must ground the reasoning/responses with relevant Product Knowledge and context.

Additionally, we are also assessing your familiarity with spec driven development so please utilize BMAD/OpenSpec (or a SDD framework of your choice) in your work.

## Deliverables 

- An operational, deployed demo of your AI Shopping Assistant atop of this mock ecommerce store.    
- A copy of your codebase for review (Repository link or zip file)
- A system design brief detailing your solution's architecture and how it addresses the system requirements. This should be 1-2 pages with an architectural diagram.

## Out of Scope
- Your deployment does not need to be sophisticated. A simple, free-tier deployment on your cloud provider of choice is fine, the goal is to assess if you can deliver an end to end solution. We will assess your system design from the system design brief you present.
- **You should not need to modify any of the starter code**, your Shopping Assistant should sit atop of the current codebase, though you are most welcome to modify the starter code if deem necessary.
- The ecommerce app allows users to filter and add products to cart but the checkout page (`/cart`) and payment gateway is not operational nor in scope for this exercise.

---
---

## Technical Context

This repo contains a minimal Next.js App Router ecommerce application. Adapted from Vercel's starter ecommerce template and populated with generated mock product data for you to base your Shopping assistant on.


### Requirements

`Node.js >= v20.19.5`
`pnpm >= 9.15.3`


### Running locally

```bash
### Install Dependencies
pnpm install

### Start the development server
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).


### Building the App

```bash
pnpm build
```

Deploying a Next.js app after build is slightly tricky. We highly recommend reading through the official documentation and the example code:
[https://nextjs.org/docs/pages/getting-started/deploying](https://nextjs.org/docs/pages/getting-started/deploying).


### Product Data 
Product Data is generated at runtime and hosted locally upon server initialization.
- `lib/local/skateboard-config.ts` contains all the variant data per product type.
- `lib/local/product-generator.ts` contains the logic utilities that generate the catalog of product data based off the data in `skateboard-config.ts`
- A helper script `export-products.ts` is provided that will generate a reference `reference/products.json` file if you would like to inspect the output




## Additional Product Context
In order for your shopping assistant to be operational, you might need context on skateboard equipment. We've added a simple "Buying guide" to get your started but it might be worth sourcing additional context from other sites like this one: [Warehouse Skateboards buying guide](https://www.warehouseskateboards.com/help/Skateboards-Getting-Started)
