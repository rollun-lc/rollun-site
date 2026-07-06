import type { Access, FieldAccess } from 'payload'

/**
 * Role-based access helpers for the admin/manager separation (Epic 8, Phase 3).
 *
 * Two roles live on `Users.role`: `admin` (full access) and `manager` (full CRUD
 * on the catalog collections — Products/Brands/Shops — but no access to Users and
 * no ability to change roles). The public site stays unauthenticated; the catalog
 * collections are publicly readable via a separate `read: () => true`.
 *
 * Signature is `({ req: { user } }) => boolean` so the same predicate works as a
 * collection `Access` and, for `isAdminFieldLevel`, as a field-level `FieldAccess`.
 */

/** True when the requesting user is an admin. */
export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

/** True when the requesting user is an admin OR a manager. */
export const isAdminOrManager: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'manager'

/** Field-level variant (e.g. the `role` field): only admins may read/write it. */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
