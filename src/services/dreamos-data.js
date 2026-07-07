// Baca data dari localStorage Dream OS
export function getDreamOSStats() {
  try {
    const users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
    const auditLogs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
    const dana = JSON.parse(localStorage.getItem('dreamos_dana') || '[]');
    const k3 = JSON.parse(localStorage.getItem('dreamos_k3_reports') || '[]');
    const maint = JSON.parse(localStorage.getItem('dreamos_maintenance_tasks') || '[]');
    const bookings = JSON.parse(localStorage.getItem('dreamos_bookings') || '[]');
    const boundUser = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.device_dna).length,
      boundDevices: users.filter(u => u.device_dna).length,
      recentLogins: auditLogs.filter(l => l.action === 'LOGIN' || l.action === 'ACCESS').length,
      totalAudit: auditLogs.length,
      pendingDana: dana.filter(d => d.status === 'pending').length,
      pendingK3: k3.filter(k => k.status === 'pending').length,
      activeMaint: maint.filter(m => m.status !== 'Selesai' && m.status !== 'Disetujui').length,
      totalBookings: bookings.length,
      currentUser: boundUser.nama || 'Unknown',
      currentRole: boundUser.role || 'staff',
      securityEvents: auditLogs.filter(l => l.action.includes('SECURITY') || l.action.includes('LOGIN')).length,
      lastAttack: auditLogs.find(l => l.action.includes('BLOCK'))?.time || null,
      blockedIPs: auditLogs.filter(l => l.action.includes('BLOCK')).length,
      honeypotTriggers: auditLogs.filter(l => l.action.includes('HONEYPOT')).length,
      botDetections: auditLogs.filter(l => l.action.includes('BOT')).length,
      rateLimitHits: auditLogs.filter(l => l.action.includes('RATE')).length
    };
  } catch(e) {
    return null;
  }
}
