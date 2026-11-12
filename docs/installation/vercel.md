---
title: Self-Hosting (Vercel)
---

# Self-Hosting (Vercel)

Invoice Builder can run on [Vercel](https://vercel.com) with a hosted PostgreSQL database. The browser app is served as static files and the webserver runs as a serverless function under `/api`.

This option is ideal if you want:

- A hosted web app without managing a server or Docker
- One shared database for everyone who signs in

:::warning[One shared database]
A Vercel deployment uses a single database configured on the server. There is no database chooser and no per-user separation: everyone who can open the site sees and edits the same data. Protect the deployment with a password (see below).
:::

## 1. Create a PostgreSQL database

Create a PostgreSQL database with a hosted provider such as [Neon](https://neon.tech) or [Supabase](https://supabase.com).

Copy its **pooled** connection string (for example the one using PgBouncer or the `-pooler` host). Serverless functions open many short-lived connections, and a pooled connection string keeps the database from running out of connections.

The schema, initial data, and migrations are created automatically on the first request.

## 2. Import the repository into Vercel

1. In Vercel, choose **Add New → Project** and import your copy of the repository.
2. Keep the **Root Directory** as the repository root.
3. Leave the build settings as they are. The repository's `vercel.json` already configures the install command, build command, output directory, and API function.

## 3. Set environment variables

In the Vercel project, open **Settings → Environment Variables** and add:

| Variable       | Required    | Description                                                                                                                   |
| -------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes         | The pooled PostgreSQL connection string from step 1.                                                                          |
| `APP_PASSWORD` | Recommended | Requires a browser login for the whole site, including `/api`. Without it, anyone with the URL can see and edit all invoices. |
| `APP_USERNAME` | No          | Login username used with `APP_PASSWORD`. Defaults to `admin`.                                                                 |

Redeploy after changing environment variables so they take effect.

If `DATABASE_URL` is missing, the app loads but every data request fails with a "no database" error.

## 4. Deploy the documentation site (optional)

The documentation site can be deployed as a second Vercel project from the same repository:

1. Import the repository again as a new project.
2. Set the **Root Directory** to `apps/website`.
3. Leave the build settings as they are. `apps/website/vercel.json` configures the build, and the site is served from the domain root.

## Limitations

- **Request size:** Vercel rejects request bodies larger than 4.5 MB, so very large backup imports or attachments can fail. Use the [desktop app](./desktop.md) or [Docker](./docker.md) for large imports.
- **Shared data:** all signed-in users share one database, as described above.
- **Cold starts:** the first request after a period of inactivity can take a few seconds while the function and database connection start.
