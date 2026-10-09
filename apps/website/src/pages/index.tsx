import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Layout from '@theme/Layout';

const workflow = [
  {
    number: '01',
    title: 'Build your records',
    text: 'Keep clients, items, currencies, banks, and businesses together in one database you control.',
    link: 'Set up your workspace',
    to: '/docs/guides/getting-started/'
  },
  {
    number: '02',
    title: 'Make each document yours',
    text: 'Shape invoices and quotes with reusable style profiles, flexible layouts, and your own branding.',
    link: 'Explore layouts',
    to: '/docs/guides/layouts/'
  },
  {
    number: '03',
    title: 'Send it your way',
    text: 'Preview live, export to PDF, track partial payments, and keep a reliable record of every document.',
    link: 'See invoices and quotes',
    to: '/docs/guides/invoices/'
  }
];

const capabilities = [
  {
    title: 'Invoicing',
    text: 'Apply surcharges, discounts, shipping, and flexible tax, then track partial payments and balance due.',
    to: '/docs/guides/invoices/'
  },
  { title: 'Quoting', text: 'Prepare clear quotes and turn accepted work into invoices.', to: '/docs/guides/quotes/' },
  {
    title: 'E-invoices',
    text: 'Export UBL 2.1 / Peppol BIS 3.0 and XRechnung XML for automated e-invoicing.',
    to: '/docs/guides/e-invoices/'
  },
  {
    title: 'Reports',
    text: 'Review aggregated totals and charts by currency over any period.',
    to: '/docs/guides/reports/'
  },
  {
    title: 'PDF styling & layouts',
    text: 'Design layouts visually with style profiles, watermarks, signatures, and QR codes - no JSON required.',
    to: '/docs/guides/layouts/'
  },
  {
    title: 'Business data',
    text: 'Manage clients, items, banks, businesses, and currencies, with XLSX import/export and reusable presets.',
    to: '/docs/guides/businesses/'
  },
  {
    title: 'Receipt printing',
    text: 'Print compact 80mm thermal receipts on desktop, or save one as a PDF from the browser.',
    to: '/docs/guides/settings/#receipt-printing'
  },
  {
    title: 'Databases & backups',
    text: 'Use a local SQLite file or a shared PostgreSQL server, with full backup, restore, and JSON export.',
    to: '/docs/guides/getting-started/'
  },
  {
    title: 'Settings & localization',
    text: 'Set the app language or a different language per document, plus number/date formats, invoice numbering, and dark mode.',
    to: '/docs/guides/settings/'
  }
];

export default function HomePage() {
  useBrokenLinks().collectAnchor('features');

  return (
    <Layout
      title="Offline invoicing with full data ownership"
      description="Create invoices and quotes offline, customize your PDFs, and keep your data in a database you own."
    >
      <main className="invoice-home">
        <section className="home-hero">
          <div className="home-wrap home-hero__grid">
            <div className="home-hero__copy">
              <p className="home-kicker">
                <span /> Offline-first invoicing
              </p>
              <h1>
                Invoices,
                <br />
                <em>on your terms.</em>
              </h1>
              <p className="home-hero__lede">
                Invoices and quotes without accounts, subscriptions, or handing your business data to someone else.
              </p>
              <div className="home-actions">
                <Link className="home-button home-button--primary" to="/docs/installation/">
                  Get started <span aria-hidden="true">↗</span>
                </Link>
                <Link className="home-button home-button--quiet" to="/docs/guides/">
                  Explore the guides
                </Link>
                <Link className="home-button home-button--quiet" to="/docs/installation/#try-the-live-demo">
                  Try demo
                </Link>
              </div>
              <p className="home-hero__aside">
                Free and open source <span>·</span> Desktop or self-hosted
              </p>
            </div>
            <figure className="home-hero__visual">
              <div className="home-visual__topline">
                <span>INVOICE WORKSPACE</span>
                <span>LOCAL DATABASE</span>
              </div>
              <img
                src={useBaseUrl('img/invoice-pdf-preview.jpg')}
                alt="Invoice Builder invoice list alongside a live PDF preview"
              />
              <figcaption>One workspace for the whole job, from draft to paid.</figcaption>
            </figure>
          </div>
          <div className="home-wrap home-proof" aria-label="Product principles">
            <p>
              <strong>01</strong> Your data stays yours
            </p>
            <p>
              <strong>02</strong> Works offline
            </p>
            <p>
              <strong>03</strong> No subscription
            </p>
            <p>
              <strong>04</strong> Windows · macOS · Linux · Docker
            </p>
          </div>
        </section>

        <section className="home-workflow" id="features">
          <div className="home-wrap">
            <div className="home-section-heading">
              <p className="home-kicker">A calmer way to keep business moving</p>
              <h2>
                From first detail
                <br />
                to finished PDF.
              </h2>
            </div>
            <div className="home-steps">
              {workflow.map(step => (
                <article className="home-step" key={step.number}>
                  <span className="home-step__number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <Link to={step.to}>
                    {step.link} <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-ownership">
          <div className="home-wrap home-ownership__grid">
            <p className="home-kicker">Your work. Your files.</p>
            <div>
              <h2>
                No account.
                <br />
                <em>No cloud lock-in.</em>
              </h2>
              <p>
                Work with a local database file or run Invoice Builder on your own server. Back up your data, move it,
                and keep using it without depending on us. Every invoice and quote snapshots its business, client, item,
                and currency details, so later edits never rewrite history.
              </p>
              <Link className="home-text-link" to="/docs/guides/getting-started/">
                Choose how to store your data <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="home-ownership__stamp" aria-hidden="true">
              <span>YOUR</span>
              <span>DATA</span>
              <span>STAYS</span>
              <span>YOURS</span>
            </div>
          </div>
        </section>

        <section className="home-capabilities">
          <div className="home-wrap">
            <div className="home-capabilities__heading">
              <div>
                <p className="home-kicker">Made for the real paperwork</p>
                <h2>
                  Everything around
                  <br />
                  the invoice, too.
                </h2>
              </div>
              <p>
                Documents, business data, PDF styling, receipts, databases, and settings - the whole toolkit lives in
                one app.
              </p>
            </div>
            <div className="home-capability-list">
              {capabilities.map((capability, index) => (
                <Link className="home-capability" to={capability.to} key={capability.title}>
                  <span className="home-capability__index">0{index + 1}</span>
                  <span className="home-capability__title">{capability.title}</span>
                  <span className="home-capability__text">{capability.text}</span>
                  <span className="home-capability__arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-final">
          <div className="home-wrap home-final__inner">
            <p className="home-kicker">Your next invoice can be simpler</p>
            <h2>
              Start with a database
              <br />
              you own.
            </h2>
            <Link className="home-button home-button--light" to="/docs/installation/">
              Find your setup <span aria-hidden="true">↗</span>
            </Link>
            <p className="home-hero__aside">
              Enjoying Invoice Builder? Support it via{' '}
              <Link to="https://github.com/sponsors/piratuks">GitHub Sponsors</Link> or{' '}
              <Link to="https://www.buymeacoffee.com/evaldizi">Buy Me a Coffee</Link>.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
