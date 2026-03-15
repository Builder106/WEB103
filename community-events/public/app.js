import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function countdown(value) {
  const diff = new Date(value).getTime() - Date.now();
  const hours = Math.floor(Math.abs(diff) / 1000 / 60 / 60);
  if (diff >= 0) return `${hours}h remaining`;
  return `${hours}h past`;
}

function HomePage({ locations }) {
  return html`
    <section>
      <p className="subtitle">Choose a city to view upcoming events from the database.</p>
      <div className="location-grid">
        ${locations.map(
          (loc) => html`
            <a className="location-card" href=${`/locations/${loc.location_slug}`} key=${loc.location_slug}>
              <img src=${loc.location_image} alt=${loc.location_name} />
              <div className="location-body">
                <h2>${loc.location_name}</h2>
                <p>${loc.location_description}</p>
                <div className="location-meta">${loc.event_count} events</div>
              </div>
            </a>
          `
        )}
      </div>
    </section>
  `;
}

function LocationDetailPage({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/locations/${slug}/events`);
        if (!res.ok) {
          throw new Error('Could not load location events');
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Request failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return html`<div className="state">Loading location events...</div>`;
  if (error) return html`<div className="state">${error}</div>`;
  if (!data) return null;

  return html`
    <section>
      <a className="chip" href="/">Back to locations</a>
      <h2>${data.location.location_name}</h2>
      <p className="subtitle">${data.location.location_description}</p>
      <div className="event-list">
        ${data.events.map(
          (event) => html`
            <a className=${`event-item ${new Date(event.starts_at).getTime() < Date.now() ? 'muted' : ''}`} key=${event.id} href=${`/events/${event.event_slug}`}>
              <img src=${event.image} alt=${event.title} />
              <div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p>${event.venue}</p>
                <div className="event-time">${formatDate(event.starts_at)} · ${countdown(event.starts_at)}</div>
              </div>
            </a>
          `
        )}
      </div>
    </section>
  `;
}

function EventsPage({ events, locations }) {
  const [filter, setFilter] = useState('');
  const shown = useMemo(() => {
    if (!filter) return events;
    return events.filter((event) => event.location_slug === filter);
  }, [events, filter]);

  return html`
    <section>
      <h2>All Events</h2>
      <div className="toolbar">
        <label htmlFor="loc-filter">Filter by location:</label>
        <select id="loc-filter" value=${filter} onChange=${(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          ${locations.map((loc) => html`<option value=${loc.location_slug} key=${loc.location_slug}>${loc.location_name}</option>`)}
        </select>
      </div>
      <div className="event-list">
        ${shown.map(
          (event) => html`
            <a className=${`event-item ${new Date(event.starts_at).getTime() < Date.now() ? 'muted' : ''}`} key=${event.id} href=${`/events/${event.event_slug}`}>
              <img src=${event.image} alt=${event.title} />
              <div>
                <h3>${event.title}</h3>
                <p>${event.location_name} · ${event.venue}</p>
                <div className="event-time">${formatDate(event.starts_at)} · ${countdown(event.starts_at)}</div>
              </div>
            </a>
          `
        )}
      </div>
    </section>
  `;
}

function EventDetailPage({ slug }) {
   const [event, setEvent] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
 
   useEffect(() => {
     let cancelled = false;
     async function run() {
       setLoading(true);
       setError('');
       try {
         const res = await fetch(`/api/events/${slug}`);
         if (!res.ok) throw new Error('Could not load event');
         const json = await res.json();
         if (!cancelled) setEvent(json);
       } catch (err) {
         if (!cancelled) setError(err.message || 'Request failed');
       } finally {
         if (!cancelled) setLoading(false);
       }
     }
     run();
     return () => { cancelled = true; };
   }, [slug]);
 
   if (loading) return html`<div className="state">Loading event...</div>`;
   if (error) return html`<div className="state">${error}</div>`;
   if (!event) return null;
 
   return html`
     <section>
       <a className="chip" href="/events">Back to all events</a>
       <h2>${event.title}</h2>
       <p className="subtitle">${event.location_name} · ${event.venue}</p>
       <div className="event-item">
         <img src=${event.image} alt=${event.title} />
         <div>
           <p>${event.description}</p>
           <div className="event-time">${formatDate(event.starts_at)} · ${countdown(event.starts_at)}</div>
         </div>
       </div>
     </section>
   `;
}

function App() {
  const [locations, setLocations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const path = window.location.pathname;
  const locationSlug = path.startsWith('/locations/') ? path.slice('/locations/'.length) : '';
  const eventSlug = path.startsWith('/events/') && path.split('/').length === 3
  ? path.slice('/events/'.length)
  : '';

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const [locRes, eventsRes] = await Promise.all([fetch('/api/locations'), fetch('/api/events')]);
        if (!locRes.ok || !eventsRes.ok) throw new Error('Could not load API data');
        const [locJson, eventsJson] = await Promise.all([locRes.json(), eventsRes.json()]);
        if (!cancelled) {
          setLocations(locJson);
          setEvents(eventsJson);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Request failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return html`<div className="state">Loading...</div>`;
  if (error) return html`<div className="state">${error}</div>`;

  return html`
  <div>
    <nav className="page-links">
      <a className="chip" href="/">Locations</a>
      <a className="chip" href="/events">All Events</a>
    </nav>
    ${eventSlug
      ? html`<${EventDetailPage} slug=${eventSlug} />`
      : path === '/events'
        ? html`<${EventsPage} events=${events} locations=${locations} />`
        : locationSlug
          ? html`<${LocationDetailPage} slug=${locationSlug} />`
          : html`<${HomePage} locations=${locations} />`}
  </div>
`;
}

const root = createRoot(document.getElementById('app'));
root.render(html`<${App} />`);
