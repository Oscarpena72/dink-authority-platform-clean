/* ───── Role definitions & permission matrix ───── */

export const ROLES = ['super_admin', 'admin', 'editor', 'contributor', 'viewer'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  contributor: 'Contributor',
  viewer: 'Viewer',
};

/* Higher number = more power */
export const ROLE_LEVEL: Record<Role, number> = {
  super_admin: 100,
  admin: 80,
  editor: 60,
  contributor: 40,
  viewer: 20,
};

/* Which admin nav items each role can see */
export const NAV_ACCESS: Record<string, Role[]> = {
  '/admin': ROLES as unknown as Role[],
  '/admin/articles': ['super_admin', 'admin', 'editor', 'contributor'],
  '/admin/community': ['super_admin', 'admin', 'editor'],
  '/admin/countries': ['super_admin', 'admin'],
  '/admin/homepage': ['super_admin', 'admin'],
  '/admin/events': ['super_admin', 'admin', 'editor'],
  '/admin/results': ['super_admin', 'admin', 'editor'],
  '/admin/magazine': ['super_admin', 'admin', 'editor'],
  '/admin/products': ['super_admin', 'admin'],
  '/admin/sponsors': ['super_admin', 'admin'],
  '/admin/footer-partners': ['super_admin', 'admin'],
  '/admin/media': ['super_admin', 'admin', 'editor'],
  '/admin/newsletter': ['super_admin', 'admin'],
  '/admin/subscribers': ['super_admin', 'admin'],
  '/admin/settings': ['super_admin'],
  '/admin/users': ['super_admin', 'admin'],
};

export function canAccess(role: string | undefined, path: string): boolean {
  if (!role) return false;
  const allowed = NAV_ACCESS[path];
  if (!allowed) return true; // paths not listed → allow
  return allowed.includes(role as Role);
}

export function isAtLeast(userRole: string | undefined, minRole: Role): boolean {
  if (!userRole) return false;
  return (ROLE_LEVEL[userRole as Role] ?? 0) >= (ROLE_LEVEL[minRole] ?? 999);
}
