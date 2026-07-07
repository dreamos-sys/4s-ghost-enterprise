import { supabase } from '../lib/supabase';

// Baca data Dream OS dari Supabase
export async function getDreamOSStats() {
  try {
    const [usersRes, auditRes, danaRes, k3Res, maintRes, bookingRes] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('dreamos_audit_logs').select('*').order('time', { ascending: false }).limit(20),
      supabase.from('dreamos_dana').select('*'),
      supabase.from('dreamos_k3_reports').select('*'),
      supabase.from('dreamos_maintenance_tasks').select('*'),
      supabase.from('dreamos_bookings').select('*')
    ]);

    const users = usersRes.data || [];
    const auditLogs = auditRes.data || [];
    const dana = danaRes.data || [];
    const k3 = k3Res.data || [];
    const maint = maintRes.data || [];
    const bookings = bookingRes.data || [];

    return {
      totalUsers: users.length,
      users: users.slice(0, 10),
      recentAudit: auditLogs.slice(0, 10),
      totalAudit: auditLogs.length,
      pendingDana: dana.filter(d => d.status === 'pending').length,
      pendingK3: k3.filter(k => k.status === 'pending').length,
      activeMaint: maint.filter(m => m.status !== 'Selesai' && m.status !== 'Disetujui').length,
      totalBookings: bookings.length,
      securityEvents: auditLogs.filter(l => l.action?.includes('SECURITY') || l.action?.includes('LOGIN')).length,
      lastAttack: auditLogs.find(l => l.action?.includes('BLOCK'))?.time || null,
      blockedIPs: auditLogs.filter(l => l.action?.includes('BLOCK')).length,
      honeypotTriggers: auditLogs.filter(l => l.action?.includes('HONEYPOT')).length,
      botDetections: auditLogs.filter(l => l.action?.includes('BOT')).length,
      rateLimitHits: auditLogs.filter(l => l.action?.includes('RATE')).length,
      recentLogins: auditLogs.filter(l => l.action === 'LOGIN' || l.action === 'ACCESS').length
    };
  } catch(e) {
    console.error('Supabase error:', e);
    return null;
  }
}
