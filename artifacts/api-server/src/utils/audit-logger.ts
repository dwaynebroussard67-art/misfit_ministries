import { Request } from 'express';
import { getDb, auditLogs } from '@workspace/db';

export interface AuditLogEntry {
  adminId: string;
  adminEmail?: string;
  action: string;
  entityType: string;
  entityId?: number;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  req?: Request;
}

export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  try {
    const db = await getDb();

    await db.insert(auditLogs).values({
      admin_id: entry.adminId,
      admin_email: entry.adminEmail,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      old_value: entry.oldValue ? JSON.stringify(entry.oldValue) : undefined,
      new_value: entry.newValue ? JSON.stringify(entry.newValue) : undefined,
      reason: entry.reason,
      ip_address: entry.req?.ip,
      user_agent: entry.req?.get('user-agent'),
    });

    console.log(`[AUDIT] ${entry.adminEmail} - ${entry.action} on ${entry.entityType}#${entry.entityId}`);
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
}

export async function logPrayerApproval(
  adminId: string,
  adminEmail: string,
  prayerId: number,
  reason?: string,
  req?: Request
): Promise<void> {
  await logAuditAction({
    adminId,
    adminEmail,
    action: 'prayer_approved',
    entityType: 'prayer',
    entityId: prayerId,
    reason,
    req,
  });
}

export async function logPrayerRejection(
  adminId: string,
  adminEmail: string,
  prayerId: number,
  reason?: string,
  req?: Request
): Promise<void> {
  await logAuditAction({
    adminId,
    adminEmail,
    action: 'prayer_rejected',
    entityType: 'prayer',
    entityId: prayerId,
    reason,
    req,
  });
}

export async function logTestimonyApproval(
  adminId: string,
  adminEmail: string,
  testimonyId: number,
  reason?: string,
  req?: Request
): Promise<void> {
  await logAuditAction({
    adminId,
    adminEmail,
    action: 'testimony_approved',
    entityType: 'testimony',
    entityId: testimonyId,
    reason,
    req,
  });
}

export async function logContentEdit(
  adminId: string,
  adminEmail: string,
  contentId: number,
  oldValue: any,
  newValue: any,
  req?: Request
): Promise<void> {
  await logAuditAction({
    adminId,
    adminEmail,
    action: 'content_edited',
    entityType: 'content',
    entityId: contentId,
    oldValue,
    newValue,
    req,
  });
}

export async function logUserBan(
  adminId: string,
  adminEmail: string,
  userId: string,
  reason?: string,
  req?: Request
): Promise<void> {
  await logAuditAction({
    adminId,
    adminEmail,
    action: 'user_banned',
    entityType: 'user',
    reason,
    req,
  });
}

export async function logForgeLogin(
  adminId: string,
  adminEmail: string,
  req?: Request
): Promise<void> {
  await logAuditAction({
    adminId,
    adminEmail,
    action: 'forge_login',
    entityType: 'auth',
    req,
  });
}
