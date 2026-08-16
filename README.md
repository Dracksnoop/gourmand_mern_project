# Gourmand

A food ordering platform: customers browse restaurants, build a cart and pay through
Stripe, while restaurant owners manage their menu and move orders through the delivery
states from an admin area.

Built on the MERN stack with TypeScript end to end.

**Live:** <https://gourmand-mern-project-1.onrender.com>

The login screen has a one click sign in for both roles, so there is nothing to
register for. Signing up does work, but the confirmation email will not arrive: the
free mail tier only delivers to the address the account is registered under.

| Role | Email | Password |
| ---- | ----- | -------- |
| Customer | `demo@gourmand.app` | `demo1234` |
| Restaurant owner | `anita@kesarrasoi.in` | `gourmand123` |

Hosted on a free tier that sleeps when idle, so the first request after a quiet period
takes about a minute to wake up.

## Stack

| Layer    | Choice |
| -------- | ------ |
| Frontend | React 18, Vite, TypeScript, Tailwind, shadcn/ui, Zustand, React Router |
| Backend  | Node, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Services | Stripe (checkout + webhooks), Cloudinary (images), Mailtrap (transactional email) |

## Running locally

You need Node 18+ and either Docker or a MongoDB connection string.

```bash
git clone <your-repo-url> gourmand
cd gourmand

npm install
npm install --prefix client

cp .env.example .env      # then fill in the values described below
```

Start MongoDB (skip if you are pointing `MONGO_URI` at Atlas):

```bash
docker run -d --name gourmand-mongo -p 27017:27017 -v gourmand-mongo-data:/data/db mongo:7
```

Load the sample restaurants, then start both processes in separate terminals:

```bash
npm run seed
npm run dev                 # API on :8000
npm run dev --prefix client # app on :5180
```

Open <http://localhost:5180>.

### Demo accounts

Created by `npm run seed`:

| Role | Email | Password |
| ---- | ----- | -------- |
| Customer | `demo@gourmand.app` | `demo1234` |
| Restaurant owner | `anita@kesarrasoi.in` | `gourmand123` |

Every seeded restaurant has an owner account; the address pattern is visible in
`server/seed/data.ts`. Owner accounts have `admin: true` and can reach `/admin/*`.

### Environment variables

| Variable | Purpose |
| -------- | ------- |
| `PORT` | API port, defaults to 8000 |
| `MONGO_URI` | MongoDB connection string |
| `SECRET_KEY` | JWT signing secret — generate with `openssl rand -hex 48` |
| `CLIENT_URL` / `FRONTEND_URL` | Origin of the frontend, used for CORS and email links |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary credentials |
| `MAILTRAP_API_TOKEN` | Mailtrap sending token |
| `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME` | Sender identity on outgoing email |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode is fine) |
| `WEBHOOK_ENDPOINT_SECRET` | Stripe webhook signing secret, from `npm run stripe` |

Note: on Mailtrap's free demo domain, mail can only be delivered to the address the
Mailtrap account is registered under. Signup still succeeds for any address — the send
failure is logged rather than surfaced — so this does not block local development.

### Testing payments

```bash
npm run stripe   # forwards Stripe events to the local webhook
```

Card `4242 4242 4242 4242`, any future expiry, any CVC.

## Deploying

In production the API process also serves the built client, so the whole app is a
single service and the frontend calls the API on its own origin.

```bash
npm run build   # installs both workspaces, builds the client, compiles the server
npm start       # node dist/server/index.js
```

The pieces, all on free tiers:

| Piece | Service |
| ----- | ------- |
| Database | MongoDB Atlas, M0 shared cluster |
| App | Render web service |
| Images | Cloudinary |
| Email | Mailtrap |
| Payments | Stripe test mode |

**Atlas.** Create an M0 cluster and a database user, and allow access from anywhere
(`0.0.0.0/0`) since the host's outbound address is not fixed. Take the connection
string and append the database name, e.g. `...mongodb.net/gourmand`.

**Render.** Create a web service from the repository with build command `npm run build`
and start command `npm start`, then set every variable from `.env.example`. Set
`NODE_ENV=production`, and point `CLIENT_URL` and `FRONTEND_URL` at the service's own
URL — they drive the Stripe redirect and the links in outgoing email.

**Seeding.** The free tier has no shell, so seed from your machine against the remote
database:

```bash
MONGO_URI="<your atlas uri>" npm run seed
```

**Stripe.** Add a webhook endpoint at `https://<your-app>/api/v1/order/webhook`
subscribed to `checkout.session.completed`, and copy that endpoint's signing secret
into `WEBHOOK_ENDPOINT_SECRET`. The secret printed by `stripe listen` is for local
development only and will not verify events sent to the deployed app.

Two things to expect: free Render services sleep after inactivity, so the first request
after a quiet period takes about a minute; and Mailtrap's demo domain only delivers to
the address the Mailtrap account is registered under, so verification email will not
reach anyone else. Signup still succeeds regardless, because the send is best-effort.

## Layout

```
server/
  controller/    request handlers
  models/        mongoose schemas
  routes/        express routers
  middlewares/   auth, admin, multer
  mailtrap/      transactional email
  seed/          sample data + seeding script
  utils/         tokens, image upload
client/src/
  admin/         restaurant + menu + order management
  auth/          login, signup, verification, password reset
  components/    customer-facing screens
  store/         zustand stores
  schema/        zod validation
```

## Design notes

**Sessions.** The JWT lives in an httpOnly cookie rather than localStorage, so page
scripts cannot read it. In development Vite proxies `/api` to the backend, which keeps
the cookie same-origin — a cross-origin setup would silently drop it, because the cookie
is `sameSite: strict`.

**Authorization.** Two layers. `isAuthenticated` establishes who the caller is;
`isAdmin` gates the restaurant-owner endpoints. On top of that, the handlers check
ownership: being an owner does not let you edit another restaurant's menu or advance
another restaurant's orders.

**Payments.** Line items are rebuilt server-side from the menu documents rather than
trusted from the cart the client posts, so prices cannot be tampered with. The webhook
verifies Stripe's signature against the raw request body, which is why the raw body
parser for that route is mounted ahead of the JSON parser in `server/index.ts`.

**Email.** Verification and reset mail is best-effort: a failure is logged and the
request still succeeds. Losing an account because a third-party mail API had a bad
minute is worse than a delayed verification email.

**Reset tokens.** Only a SHA-256 digest is stored. The raw token exists solely in the
email, so a database dump cannot be replayed to take over accounts.
