import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../access/roles'

/**
 * Auth collection. Beyond booting `/admin`, Story 8.1 adds the `admin`/`manager`
 * role separation (Epic 8, Phase 3).
 *
 * Access matrix: Users management is admin-only (read/create/update/delete), and
 * the collection is hidden from managers in the admin UI. The `role` field itself
 * is admin-only at field level so a manager can never escalate their own role.
 * `defaultValue: 'admin'` makes the first bootstrap user an admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    // Managers must not see or reach the Users collection in the admin nav.
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // `email` and `password` are added automatically by `auth: true`.
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
      ],
      access: {
        // Only admins may set/change roles (managers cannot escalate).
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
}
