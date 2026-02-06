# Admin Credentials Guide

## 🚨 Security Warning

**Default credentials are for development and initial setup only.** Always change them immediately after first login in production environments.

## Default Credentials

The seed script creates three default user accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@meditation.org` | `admin123` | Full access to all admin features |
| **Content Manager** | `manager@meditation.org` | `manager123` | Create and edit content, submit for review |
| **Content Reviewer** | `reviewer@meditation.org` | `reviewer123` | Review and approve/reject content |

## Configuration

You can override these defaults using environment variables in your `.env.local` file:

```bash
# Default Admin Credentials
DEFAULT_ADMIN_EMAIL="admin@meditation.org"
DEFAULT_ADMIN_PASSWORD="admin123"
DEFAULT_MANAGER_EMAIL="manager@meditation.org"
DEFAULT_MANAGER_PASSWORD="manager123"
DEFAULT_REVIEWER_EMAIL="reviewer@meditation.org"
DEFAULT_REVIEWER_PASSWORD="reviewer123"
```

## Seeding the Database

To create these accounts, run the seed script:

```bash
npm run seed
```

This will:
1. Clear all existing data (⚠️ **WARNING**: This deletes everything!)
2. Create fresh admin accounts with the configured credentials
3. Display the login credentials in the console

## First Login Steps

### 1. Login with Default Credentials
Visit `/login` and use the admin credentials shown above.

### 2. Change Password Immediately
Navigate to `/admin/users` and update your password:
- Click on your user account
- Enter a strong, unique password
- Save changes

### 3. Create Additional Admins (Optional)
Add more admin users as needed:
- Go to `/admin/users/new`
- Fill in user details
- Assign appropriate role
- Set a secure password

## Production Deployment

For production environments:

1. **Use strong, unique passwords** in your environment variables
2. **Enable password requirements** (minimum length, complexity)
3. **Enable two-factor authentication** (if available)
4. **Use secrets management** (Vercel Env Variables, AWS Secrets Manager, etc.)
5. **Never commit credentials** to version control
6. **Rotate passwords regularly**

### Example Production Setup

```bash
# .env.production (or Vercel environment variables)
DEFAULT_ADMIN_EMAIL="admin@yourdomain.com"
DEFAULT_ADMIN_PASSWORD="your-very-secure-random-password-here"
```

## Security Best Practices

### ✅ DO:
- Change passwords after first login
- Use strong, unique passwords (16+ characters, mixed case, numbers, symbols)
- Use different passwords for each environment (dev, staging, prod)
- Enable HTTPS in production
- Monitor user activity logs
- Implement rate limiting on login attempts
- Use environment variables for sensitive data

### ❌ DON'T:
- Share credentials via email/chat
- Use the same password across environments
- Commit credentials to git (they're already in .gitignore)
- Use weak passwords like "password123"
- Leave default credentials in production
- Share .env.local files

## Troubleshooting

### Can't Login After Seeding
1. Make sure you ran `npm run seed`
2. Check the console output for the actual credentials created
3. Verify the email/password matches what was seeded
4. Try clearing your browser cache

### Password Reset
If you're locked out:
1. Access the database directly
2. Find your user in the `users` collection
3. Generate a new bcrypt hash: `node -e "console.log(require('bcryptjs').hashSync('newpassword', 10))"`
4. Update the `password` field with the new hash

### Reset Everything
⚠️ **WARNING**: This deletes all data!

```bash
npm run seed
```

## Need Help?

- Check: `/admin/users` - User management interface
- Check: `docs/SECURITY_BEST_PRACTICES_2025.md` - Full security documentation
- Check: `lib/seed.ts` - Seed script source code

---

**Last Updated:** 2025-02-06
**Version:** 1.0.0
