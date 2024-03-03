# The Merge

## General information

- In this application, the front is written in React, the back is WP.
- They communicate using the WP REST API.
- All data except livestream is taken from Neon CRM, via API.
- Streams are taken from Vimeo.com by API.
- WP stores some data in custom tables, and updates them by CRON or Webhooks.
- User authorization does not take place through WP, but through Neon.
