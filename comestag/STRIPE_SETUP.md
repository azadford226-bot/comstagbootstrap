# Stripe Billing Setup

Comstag charges organization accounts $49 USD per month after a 90-day trial. The backend creates Stripe Checkout and Customer Portal sessions; it never accepts card details directly.

## Stripe dashboard

1. Create a Product and recurring monthly Price for `49.00 USD`.
2. Copy the Price ID, which begins with `price_`.
3. Enable the Stripe Customer Portal and allow customers to cancel subscriptions if that is the desired policy.
4. Create a webhook endpoint at `https://<api-domain>/v1/billing/webhook`.
5. Subscribe it to `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.

## Deployment variables

Set these values in Railway or the backend hosting provider. Do not commit them to source control.

```text
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_BASE_URL=https://www.comstag.com
```

Use test-mode equivalents while validating. The webhook secret comes from the endpoint, not from the API key.

## Test flow

1. Configure test-mode values and start the API.
2. Sign in as an active organization and open `/billing`.
3. Select **Start 90-day free trial** and finish Checkout with a Stripe test card such as `4242 4242 4242 4242`.
4. Confirm the webhook updates the `subscriptions` record to `trialing`.
5. Open **Manage subscription** and verify Stripe Customer Portal loads and returns to `/billing`.

For local webhook forwarding, use:

```text
stripe listen --forward-to http://localhost:8080/v1/billing/webhook
```