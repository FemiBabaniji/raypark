# Progressive Admin Access System

## Overview

Implemented a per-community progressive admin access control system that allows communities to start with open admin access (everyone is an admin) and tighten security on-demand by restricting access to specific users with the `community_admin` role.

## Architecture

### Phase 1: Open Access (Default)
- **Initial State**: All authenticated community members have admin access automatically
- **No role checks required**: `useIsAdmin()` returns `true` for all logged-in community members
- **Perfect for**: Development, testing, early-stage communities, MVP launches

### Phase 2: Restricted Access (On-Demand)
- **Enabled via Settings**: Community admin toggles "Restrict Admin Access" in Admin Settings
- **Role-based control**: Only users with `community_admin` role can access admin features
- **Auto-protection**: User who enables restriction is automatically added to allowlist

## Database Schema

### Migration: `scripts/062_add_admin_access_restriction.sql`

\`\`\`sql
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS admin_access_restricted BOOLEAN DEFAULT false;
\`\`\`

**Column**: `admin_access_restricted`
- **Type**: BOOLEAN
- **Default**: `false` (open access)
- **Purpose**: Controls per-community admin access mode

## Implementation

### 1. Hook: `hooks/use-is-admin.ts`

**Signature**: `useIsAdmin(communityId?: string)`

**Logic Flow**:
\`\`\`
1. User authenticated?
   NO → return false
   
2. Community ID provided?
   NO → Check if admin of ANY community
   YES → Check specific community
   
3. Check community.admin_access_restricted:
   false → return true (everyone is admin)
   true → Check user_community_roles for community_admin
   
4. Return admin status
\`\`\`

**Usage Examples**:
\`\`\`typescript
// Check if admin of ANY community (for nav links)
const { isAdmin, isLoading } = useIsAdmin()

// Check if admin of specific community (for admin page)
const { isAdmin, isLoading } = useIsAdmin(communityId)
\`\`\`

### 2. Settings UI: `components/admin/admin-settings.tsx`

**Features**:
- Toggle switch to enable/restrict admin access
- Status indicator (Open Mode / Restricted Mode)
- Confirmation modal when enabling restriction
- Auto-adds current user to allowlist when enabling
- Success/error messaging

**User Flow**:
1. Admin navigates to Admin → Settings tab
2. Sees current mode (Open/Restricted)
3. Toggles "Restrict Admin Access" switch
4. If enabling: Modal confirms and warns about self-lockout prevention
5. System auto-adds user to allowlist
6. Updates `admin_access_restricted` column
7. Shows success message

### 3. Admin Dashboard: `app/admin/page.tsx`

**Changes**:
- Added "Settings" tab to existing tabs
- Passes `communityId` to `useIsAdmin()` hook
- Checks admin status before rendering admin features
- Shows access denied message if not admin

**Tab Structure**:
1. Community Roles - Manage community-wide admins
2. Cohort Roles - Manage cohort-specific admins
3. Assign Role - Add new admin users
4. **Settings** - Configure admin access control (NEW)

### 4. Navigation Components

**Updated Files**:
- `app/dashboard/page.tsx` - DashboardHeader dropdown
- `components/navigation.tsx` - Navigation dropdown
- `components/events-header.tsx` - EventsHeader dropdown

**Behavior**:
- Calls `useIsAdmin()` without `communityId` (checks ANY community)
- Shows/hides "Admin" menu item based on result
- Icon: Shield (`<Shield />`)
- Position: Between Settings and Logout

## Usage Instructions

### For Admins

#### Starting a New Community (Open Access)
1. Create community - `admin_access_restricted` defaults to `false`
2. All members automatically have admin access
3. No setup required - start testing immediately

#### Enabling Restriction
1. Go to **Admin Dashboard** → **Settings tab**
2. Toggle **"Restrict Admin Access"** switch
3. Confirm in modal (you'll be auto-added to allowlist)
4. Admin access now limited to users with `community_admin` role

#### Adding More Admins (After Restriction)
1. Go to **Admin Dashboard** → **Assign Role tab**
2. Enter user email
3. Select "Community-wide" scope
4. Select "Community Admin" role
5. Click "Assign Role"

#### Disabling Restriction (Return to Open Access)
1. Go to **Admin Dashboard** → **Settings tab**
2. Toggle **"Restrict Admin Access"** OFF
3. Everyone in community now has admin access again

### For Developers

#### Testing Admin Features
No setup required - join any community and you automatically have admin access (assuming restriction not enabled).

#### Checking Admin Status in Code
\`\`\`typescript
import { useIsAdmin } from '@/hooks/use-is-admin'

// In your component
const { isAdmin, isLoading } = useIsAdmin(communityId)

if (isLoading) return <Spinner />
if (!isAdmin) return <AccessDenied />
return <AdminFeature />
\`\`\`

## Benefits

1. **Zero friction initially** - Test admin features without role setup
2. **Gradual security** - Tighten when ready, not before
3. **Simple mental model** - Everyone → Specific users
4. **Self-service** - Admins control their own security posture
5. **No lockouts** - Auto-adds user when enabling restriction

## Security Considerations

### Self-Lockout Prevention
When enabling restriction, the system automatically adds the current user to the `user_community_roles` table with `community_admin` role. This prevents the scenario where an admin enables restriction and immediately loses access.

### Database Permissions
The `communities.admin_access_restricted` column should be writable only by community admins. The RLS policies should enforce this at the database level.

### Role Assignment
Only users with `community_admin` role can assign roles to other users. This is enforced in the `/api/admin/roles/assign` endpoint via the `requireCommunityAdmin` middleware.

## Migration Path

### From Current State
1. Run migration script: `scripts/062_add_admin_access_restriction.sql`
2. Existing communities will have `admin_access_restricted = false` (open access)
3. No impact on existing functionality
4. Admins can opt-in to restriction when ready

### Future Enhancements
- **Email allowlist**: Instead of roles, use email-based allowlist for simpler management
- **Role hierarchy**: Different levels of admin access (super admin, content admin, etc.)
- **Temporary access**: Time-limited admin access with expiration
- **Audit logging**: Track who enabled/disabled restriction and when

## Testing Checklist

- [ ] Join test-admin-community
- [ ] Verify Admin link appears in navigation
- [ ] Access Admin Dashboard
- [ ] Navigate to Settings tab
- [ ] Toggle "Restrict Admin Access" ON
- [ ] Verify confirmation modal appears
- [ ] Confirm restriction
- [ ] Verify success message
- [ ] Check you still have admin access (auto-added to allowlist)
- [ ] Add another user via Assign Role tab
- [ ] Toggle restriction OFF
- [ ] Verify everyone has admin access again
