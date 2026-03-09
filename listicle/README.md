# WEB103 Project 2 - Listicle Part 2

Submitted by: **Yinka Vaughan**

About this web app: **A listicle that showcases local music events. It uses only HTML, CSS, and JavaScript (no frontend framework), server-rendered via Express and styled with PicoCSS. Data is served from a PostgreSQL database; each event has a list view and a unique detail page.**

Time spent: **10** hours

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x] **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**

The following **optional** features are implemented:

- [x] The user can search for items by a specific attribute (by category and by title)

## Video Walkthrough

Here's a walkthrough of implemented required features:

[![Video Walkthrough](https://i.imgur.com/web103-listicle-part-2-y87WaiC.gif)](https://i.imgur.com/web103-listicle-part-2-y87WaiC.gif)

## How to run locally

```bash
npm install
cp .env.example .env
# Set DATABASE_URL in .env to your Postgres connection string
npm run db:setup
npm test
npm run start
# Visit http://localhost:3000
```

## Notes

The database schema and seed were created in Project 1. The `items` table has columns: id, slug, title, text, category, price, image. Search (stretch) filters the list by category or by a query string matched against title/category.

## License

Copyright 2026 Yinka Vaughan

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions in the License.
