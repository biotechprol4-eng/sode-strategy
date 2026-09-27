# SODE Strategy - Backend Setup & Validation Guide

## Environment Setup

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d

# OTP
OTP_TTL_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Server
PORT=3000
NODE_ENV=development

# Supabase (optional, for direct connection)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Prerequisites

- Node.js 18+
- PostgreSQL 13+ or Supabase project
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

## Health Check & Validation

### 1. Database Connection Test

```bash
# Test Prisma connection
npx prisma db execute --stdin < health-checks/db-connection.sql

# Or use the health check script
npm run health:db
```

### 2. JWT Configuration Validation

```bash
npm run validate:jwt
```

### 3. OTP Configuration Validation

```bash
npm run validate:otp
```

### 4. Full Health Check

```bash
npm run health:full
```

## Development

```bash
# Start development server
npm run start:dev

# Watch mode
npm run dev

# Access Swagger documentation
# http://localhost:3000/docs
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run health check tests
npm run test:health
```

## Key Endpoints for Validation

### Authentication
- `POST /api/v1/auth/login` - Login with SODE KEY
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Organizations
- `POST /api/v1/organizations` - Create organization
- `GET /api/v1/organizations` - List organizations (requires auth)

### Members
- `POST /api/v1/members/organization/:organizationId` - Add member
- `GET /api/v1/members/organization/:organizationId` - List members

### OTP & Recovery
- `POST /api/v1/otp/request` - Request OTP
- `POST /api/v1/otp/verify` - Verify OTP code
- `POST /api/v1/recovery/request` - Request account recovery
- `POST /api/v1/password-reset` - Reset password with OTP

### Sessions
- `GET /api/v1/sessions` - List active sessions
- `POST /api/v1/sessions/revoke-all` - Revoke all sessions

## Troubleshooting

### Database Connection Issues
1. Verify `DATABASE_URL` and `DIRECT_URL` are correct
2. Check firewall/IP whitelist on Supabase
3. Test connection: `psql $DATABASE_URL`

### JWT Errors
1. Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
2. Ensure secrets are at least 32 characters
3. Check token expiration times

### Prisma Migration Issues
1. Reset database: `npx prisma migrate reset`
2. Check schema.prisma syntax
3. Verify database user permissions

## Security Checklist

- [ ] All secrets are in `.env` and NOT committed to git
- [ ] `DIRECT_URL` is set for Prisma migrations
- [ ] JWT secrets are at least 32 characters
- [ ] Database user has minimal required permissions
- [ ] CORS is properly configured
- [ ] Helmet is enabled for security headers
- [ ] Rate limiting is configured
- [ ] Audit logging is enabled

## Next Steps

1. Deploy to staging environment
2. Run full validation suite
3. Load testing
4. Security audit
5. Move to production

---

For more information, refer to the documentation in `/docs`.
