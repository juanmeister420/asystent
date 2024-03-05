export default function getRedirectPathFromRole(role: 'admin' | 'partner' | 'operator' | 'user') {
  switch (role) {
    case 'admin':
      return '/admin/panel/home'
    case 'partner':
      return '/partner/panel/home'
    case 'operator':
      return '/operator/panel/home'
    case 'user':
      return '/home'
  }
}
