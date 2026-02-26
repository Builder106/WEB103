# WEB103 Project 1 - Listicle Part 1

Submitted by: **Yinka Vaughan**

About this web app: **A listicle that showcases local music events. It uses only HTML, CSS, and JavaScript (no frontend framework), server-rendered via Express and styled with PicoCSS. Each event has a list view and a unique detail page.**

Time spent: **10** hours

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app displays a title**
- [x] **The web app displays at least five unique list items, each with at least three displayed attributes (e.g. title, text, image)**
- [x] **The user can click on each item in the list to see a detailed view of it, including all database fields**
- [x] **Each detail view is a unique endpoint (e.g. localhost:3000/items/event-1, localhost:3000/items/event-2)**
- [x] **The web app serves an appropriate 404 page when no matching route is defined**
- [x] **The web app is styled using PicoCSS**

The following **stretch** features are implemented:

- [x] **The web app displays items in a unique format (cards rather than a plain list)**

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='https://imgur.com/a/7f4B2sz' title='Video Walkthrough' width='' alt='Video Walkthrough' />

I used a small script that drives Chrome and records the session (run `node src/scripts/recordSession.mjs` with the app already running)—so the walkthrough is fully automated and I didn’t have to sit there screen-recording by hand.

## How to run locally

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start the server
npm run start
# Visit http://localhost:3000
```

## License

Copyright 2025 Yinka Vaughan

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
