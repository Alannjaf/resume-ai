# Subscription Expiry System

This document explains how the automatic subscription expiry system works.

## How It Works

1. **Upgrade Process**: When a user is upgraded to BASIC or PRO plan via `/api/admin/users/[userId]/upgrade`, the system automatically sets:
   - `startDate`: Current date
   - `endDate`: 30 days from the upgrade date
   - `plan`: BASIC or PRO
   - `status`: ACTIVE

2. **Expiry Check**: The system checks for expired subscriptions and automatically downgrades them to FREE plan.

3. **Automatic Downgrade**: Expired subscriptions are:
   - Changed from BASIC/PRO to FREE plan
   - Status remains ACTIVE
   - `endDate` is set to null (FREE plans don't expire)
   - Usage counts are preserved (not reset)

## API Endpoints

### Check Subscription Status
```
GET /api/subscriptions/check-expired
```
Returns current expired and expiring-soon subscriptions without making changes.

### Process Expired Subscriptions
```
POST /api/subscriptions/check-expired
```
Automatically downgrades all expired subscriptions to FREE plan.

### Cron Job Endpoint
```
GET /api/cron/check-subscriptions
```
Automated endpoint that can be called by external schedulers.

## Setting Up Automated Checks

### Option 1: Vercel Cron (Recommended for Vercel deployments)
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/check-subscriptions",
      "schedule": "0 2 * * *"
    }
  ]
}
```
This runs daily at 2 AM UTC.

### Option 2: External Cron Services
Use services like:
- **Uptime Robot**: Set up a monitor to call the endpoint
- **Cronhooks**: Schedule HTTP requests
- **GitHub Actions**: Use scheduled workflows

Example GitHub Action (`.github/workflows/check-subscriptions.yml`):
```yaml
name: Check Expired Subscriptions
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Subscriptions
        run: |
          curl -X GET "${{ secrets.APP_URL }}/api/cron/check-subscriptions" \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: Manual Checks
Use the admin dashboard's "Check & Process Expired" button for manual checks.

## Environment Variables

Optional security for cron endpoints:
```env
CRON_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Admin Dashboard

The admin dashboard shows:
- **Expired Subscriptions**: Already passed their end date
- **Expiring Soon**: Will expire within 3 days
- **Manual Check Button**: Trigger immediate expiry check

## Database Schema

The `Subscription` model includes:
- `startDate`: When the subscription started
- `endDate`: When it expires (null for FREE plans)
- `plan`: FREE, BASIC, or PRO
- `status`: ACTIVE, CANCELLED, EXPIRED, or SUSPENDED

## Testing

1. Upgrade a user to BASIC/PRO plan
2. Check the `endDate` is set to 30 days from upgrade
3. Manually call `/api/subscriptions/check-expired` to test the logic
4. Use the admin dashboard to monitor subscription status

## Notes

- FREE plans never expire (`endDate` is null)
- Usage counts are preserved during downgrade
- The system only downgrades ACTIVE subscriptions
- Failed downgrades are logged and reported