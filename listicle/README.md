# WEB103 Project 2 - NeoBrutalist Listicle - Local Music Events

Submitted by: **Yinka Vaughan**

About this web app: **A neobrutalist-themed listicle that showcases local music events. It serves server-rendered HTML via Express, styled with PicoCSS plus custom neobrutalist CSS, and reads items from a PostgreSQL database (with a local dataset fallback).**

Time spent: **TBD**

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items**
  - [ ] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [ ] **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**

The following **optional** features are implemented:

- [ ] The user can search for items by a specific attribute

The following **additional** features are implemented:

- [x] Neobrutalist visual design (bold borders, shadows, accent blocks)
- [x] TDD with Jest + Supertest for routes and DB-backed behavior
- [x] Local dataset fallback when DATABASE_URL is not set

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with ...

## Notes

- On macOS, createdb was initially not found; fixed by installing Homebrew postgresql@18 and adding /opt/homebrew/opt/postgresql@18/bin to PATH.
- Jest may print an open-handle warning due to Node VM modules. Functionality and tests still pass.

## How to run locally

```bash
# Install dependencies
npm install

# (Optional) set up Postgres
export DATABASE_URL=postgres://<user>@localhost:5432/listicle
createdb listicle || true
npm run db:setup

# Run tests
npm test

# Start the server
npm run start
# Visit http://localhost:3000
```

## Deployment notes (Render)

- Provision a Render Web Service for the app and a Render PostgreSQL instance.
- Set DATABASE_URL in the Web Service environment from the Render Postgres connection string.
- Add a deploy command to run npm run db:setup on first deploy if needed.

## License

Copyright 2025 Yinka Vaughan

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
