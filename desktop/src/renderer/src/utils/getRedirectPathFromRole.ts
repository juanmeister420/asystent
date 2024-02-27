export default function getRedirectPathFromRole(role: 'admin' | 'partner' | 'operator' | 'user') {
  switch (role) {
    case 'admin':
      return '/admin/panel'
    case 'partner':
      return '/partner/panel'
    case 'operator':
      return '/operator/panel'
    case 'user':
      return '/home'
  }
}
