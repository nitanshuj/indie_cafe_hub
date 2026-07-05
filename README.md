# Indie Coffee Hub

Indie Coffee Hub is a premium, beautifully curated web directory designed specifically for remote workers, digital nomads, and specialty coffee enthusiasts worldwide. The platform showcases independent specialty coffee shops, highlighting the essential amenities required for focused, productive work sessions.


---

## What the Website Does

### ☕ Curated Cafe Directory
* **Specialty Coffee Discovery:** Highlights the best independent roasters and coffee spots across global neighborhoods and major cities (e.g. Seattle, San Francisco, Bengaluru, Haldwani, and Bloomington).
* **Nomad-Centric Amenities:** Filters and displays key information critical to remote work, including:
  * Reliable, fast WiFi (with speed estimates)
  * Power plug accessibility at tables
  * Air Conditioning (AC) status
  * Pet-friendliness for visitors with companions
* **Interactive Media Gallery:** Detailed page views for each cafe featuring full-screen zoomable lightbox media viewers for cover photos and interior gallery spaces.

### 🛡️ Admin Command Center
* **Protected Portal:** Secure management interface restricted to site administrators.
* **Cafe Registry Management (CRUD):** Complete interface to register new cafes or modify details, addresses, and amenities of existing spots.
* **Smart Media Management:** Interface for uploading cover and gallery images, which automatically optimizes media. Includes options to delete cover images and individual staged gallery thumbnails, complete with full-screen zoom previews.
* **Real-time Pipeline Tracker:** An animated step-by-step visualizer tracing background data serialization, Cloudinary WebP optimization, and Supabase database updates.

### ⚡ Hybrid Rendering Simulator
* **On-Demand Incremental Static Regeneration (ISR):** Simulates static edge caching for lightning-fast page loading, where updates are statically compiled and only refreshed on-demand when an administrator commits a change. Includes simulated webhook cache-invalidation alerts.
* **Dynamic Server-Side Rendering (SSR):** Bypasses mock caching to query database updates in real-time, showcasing how highly volatile data updates are immediately visible to clients on every page request.

### 💬 Community Notes & Reviews
* **Nomad Discussions:** Guest and member-supported comment boards allowing users to post their remote working experiences, tips, and reviews.
* **Dynamic Background Updates:** Seamless background polling to sync new community notes without requiring page refreshes, keeping the conversation up-to-date.

### 🤖 AI Coffee Expert Chatbot
* **Interactive AI Barista:** A floating chat interface available globally that answers user questions about coffee origins, brewing techniques, recipes, and cafe culture.
* **Secure Quota Management:** Built-in weekly limits (4 queries/week, rolling reset) securely validated on the server using TanStack Start server functions and Supabase. Admins bypass the quota automatically.
* **Markdown & Word-wrap Support:** Renders rich lists, headers, and bold text formats directly inside a responsive, word-wrapped chat widget.
