# Vault Church Lost & Found - Login Credentials

## Quick Reference

All test accounts are pre-configured and ready to use. Simply navigate to `/login` and enter the credentials below.

---

## Admin Account

```
Username: admin
Password: SecureAdmin123!
Role: Administrator (Full system access)
```

**Access:**
- Admin Dashboard - view system stats and metrics
- User Management - create, edit, delete users
- Audit Logs - view all system actions
- Locations - manage church locations
- Playbooks - create operational procedures
- System Settings - configure app settings

---

## Volunteer Account

```
Username: tomanderson
Password: VolunteerPass123!
Role: Volunteer (Staff)
```

**Access:**
- Volunteer Dashboard - view pending claims
- Claim Processing - approve/reject/release items
- Service Hours - log volunteer hours
- Missions - view assigned tasks
- Playbooks - read operational guides
- All User Features

---

## User Accounts (Regular Users)

### User 1: John Doe
```
Username: johndoe
Password: UserPass123!
Role: User
```

### User 2: Sarah Johnson
```
Username: sarahjohnson
Password: UserPass123!
Role: User
```

### User 3: Michael Chen
```
Username: michaelchen
Password: UserPass123!
Role: User
```

### User 4: David Park
```
Username: davidpark
Password: UserPass123!
Role: User
```

**Access:**
- Upload Items - add lost/found items to the system
- Browse Items - view all uploaded items
- Filter & Search - find items by category, location, etc.
- Submit Claims - claim items you're looking for
- My Claims - track claim status
- My Uploads - manage your uploaded items
- Profile - view and edit personal information
- Change Password - update account security

---

## Testing Quick Start

1. **For Admin Testing:** Login with `admin` / `SecureAdmin123!`
2. **For Volunteer Testing:** Login with `tomanderson` / `VolunteerPass123!`
3. **For User Testing:** Login with `johndoe` / `UserPass123!` (or `sarahjohnson`, `michaelchen`, `davidpark`)

All accounts have full functionality enabled. No special setup or configuration needed.

---

## Notes

- Passwords are intentionally simple for easy testing
- All test accounts have pre-populated data (items, claims, service hours)
- Use the volunteer account to process claims submitted by user accounts
- Use the admin account to manage all system settings and users
- Password changes work normally - you can change any account's password from the Profile page
- The production seed script allows overriding passwords via environment variables:
  - `BOOTSTRAP_ADMIN_PASSWORD`
  - `BOOTSTRAP_VOLUNTEER_PASSWORD`
  - `BOOTSTRAP_USER_PASSWORD`