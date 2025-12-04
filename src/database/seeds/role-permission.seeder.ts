import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function seed(knex: Knex): Promise<void> {
  await knex(DB_TABLES.ROLE_PERMISSIONS).del();

  // Fetch role IDs
  const roles = await knex(DB_TABLES.ROLES).select("id", "slug");
  const roleMap: Record<string, string> = {};
  roles.forEach((r) => {
    roleMap[r.slug] = r.id;
  });

  // Fetch permission IDs
  const permissions = await knex(DB_TABLES.PERMISSIONS).select("id", "slug");
  const permMap: Record<string, string> = {};
  permissions.forEach((p) => {
    permMap[p.slug] = p.id;
  });

  // Helper function to create role-permission mappings
  const createRolePermissions = (roleSlug: string, permissionSlugs: string[]) => {
    return permissionSlugs.map((permSlug) => ({
      roleId: roleMap[roleSlug],
      permissionId: permMap[permSlug],
    }));
  };

  // ============================================
  // SUPER ADMIN - All Permissions
  // ============================================
  const allPermissionSlugs = Object.keys(permMap);
  const superAdminPermissions = createRolePermissions("super-admin", allPermissionSlugs);

  // ============================================
  // FINANCE MANAGER PERMISSIONS
  // Modules: Dashboard, Communications, Reports, Finance, Payroll, Accounting, Banking, Remittances
  // ============================================
  const financeManagerPermissions = createRolePermissions("finance-manager", [
    // Dashboard
    "view-dashboard",
    "view-recent-transactions",
    // Communications
    "view-communications",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "generate-financial-reports",
    "generate-giving-reports",
    "generate-payroll-reports",
    "export-reports",
    "create-custom-reports",
    // Finance
    "view-digital-giving",
    "process-donation",
    "manage-giving-campaigns",
    "export-giving-transactions",
    "view-giving-analytics",
    "view-recurring-giving",
    "create-recurring-schedule",
    "edit-recurring-schedule",
    "pause-recurring-schedule",
    "cancel-recurring-schedule",
    "view-pledges",
    "create-pledge",
    "record-pledge-payment",
    "send-pledge-reminder",
    "view-pledge-history",
    "view-tax-receipts",
    "generate-tax-receipts",
    "export-tax-receipts",
    "send-tax-receipts",
    "view-funds",
    "create-fund",
    "edit-fund",
    "transfer-funds",
    "close-fund",
    "view-budget",
    "create-budget",
    "edit-budget",
    "export-budget",
    "view-expenses",
    "submit-expense",
    "approve-expense",
    "reject-expense",
    "escalate-expense",
    // Payroll
    "view-payroll",
    "setup-payroll",
    "view-payroll-history",
    "export-payslips",
    "manage-statutory-compliance",
    "view-payroll-employees",
    "add-payroll-employee",
    "edit-employee-salary",
    "manage-employee-bank-details",
    "run-payroll",
    "preview-payroll",
    "approve-payroll-run",
    "view-payroll-calendar",
    "create-payroll-calendar",
    "edit-payroll-schedule",
    "export-payroll-schedule",
    "view-pending-payroll",
    "approve-payroll",
    "reject-payroll",
    "view-year-end-summary",
    "generate-tax-forms",
    "process-year-end-adjustments",
    // Accounting
    "view-chart-of-accounts",
    "add-account",
    "edit-account",
    "deactivate-account",
    "view-journal-entries",
    "create-journal-entry",
    "edit-draft-entry",
    "post-journal-entry",
    "reverse-journal-entry",
    "view-general-ledger",
    "export-general-ledger",
    "filter-ledger-transactions",
    "view-financial-statements",
    "generate-income-statement",
    "generate-balance-sheet",
    "generate-cash-flow",
    "generate-trial-balance",
    "export-financial-statements",
    "view-fiscal-periods",
    "create-fiscal-period",
    "close-fiscal-period",
    "reopen-fiscal-period",
    // Banking
    "view-member-banking",
    "view-member-transactions",
    "view-treasury",
    "link-external-accounts",
    "request-bank-statement",
    "manage-direct-debit",
    "sync-account-balances",
    "view-financial-audit-log",
    "view-bank-accounts",
    "create-bank-account",
    "reconcile-account",
    "connect-bank-api",
    "view-member-loans",
    "approve-loan",
    "disburse-loan",
    "record-loan-payment",
    "view-church-loans",
    "apply-for-church-loan",
    "manage-partner-institutions",
    "make-church-loan-payment",
    // Remittance
    "view-remittances",
    "view-missionary-support",
    "view-transfer-history",
    "send-remittance",
    "send-to-missionary",
    "submit-transfer-for-approval",
    "view-compliance-status",
    "review-flagged-transactions",
    "approve-transfer",
  ]);

  // ============================================
  // HR MANAGER PERMISSIONS
  // Modules: Dashboard, Communications, Reports, People, Payroll
  // ============================================
  const hrManagerPermissions = createRolePermissions("hr-manager", [
    // Dashboard
    "view-dashboard",
    "quick-add-member",
    // Communications
    "view-communications",
    "create-communication",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "generate-member-reports",
    "generate-payroll-reports",
    "export-reports",
    // People
    "view-members",
    "add-member",
    "edit-member",
    "view-member-analytics",
    "manage-member-status",
    "view-families",
    "create-family",
    "edit-family",
    "link-members-to-family",
    "view-engagement-scores",
    "configure-engagement-weights",
    "create-followup-task",
    "recalculate-engagement-scores",
    "view-staff",
    "add-staff",
    "edit-staff",
    "delete-staff",
    "manage-staff-contracts",
    "view-staff-credentials",
    "view-leave-requests",
    "create-leave-request",
    "approve-leave",
    "reject-leave",
    "view-leave-balances",
    "view-performance-appraisals",
    "create-performance-review",
    "manage-performance-goals",
    "submit-performance-rating",
    "view-volunteers",
    "add-volunteer",
    "edit-volunteer",
    "manage-background-checks",
    "track-volunteer-hours",
    "view-volunteer-schedule",
    "create-volunteer-shift",
    "assign-volunteers",
    "manage-volunteer-roles",
    "view-volunteer-recognition",
    "create-volunteer-award",
    "assign-volunteer-award",
    "manage-volunteer-milestones",
    // Payroll
    "view-payroll",
    "view-payroll-history",
    "export-payslips",
    "view-payroll-employees",
    "add-payroll-employee",
    "edit-employee-salary",
    "manage-employee-bank-details",
    "preview-payroll",
    "view-payroll-calendar",
    "view-year-end-summary",
  ]);

  // ============================================
  // CAMPUS ADMIN PERMISSIONS
  // Modules: Dashboard, Communications, Reports, People, Ministry, Finance, Payroll, Accounting, Banking, Remittances, Resources, Campuses, Settings
  // ============================================
  const campusAdminPermissions = createRolePermissions("campus-admin", [
    // Dashboard
    "view-dashboard",
    "quick-add-member",
    "quick-create-event",
    "view-recent-transactions",
    // Communications
    "view-communications",
    "create-communication",
    "edit-communication",
    "manage-campaigns",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "generate-financial-reports",
    "generate-giving-reports",
    "generate-member-reports",
    "generate-ministry-reports",
    "generate-payroll-reports",
    "generate-campus-reports",
    "export-reports",
    "create-custom-reports",
    // People (all)
    "view-members",
    "add-member",
    "edit-member",
    "delete-member",
    "view-member-analytics",
    "manage-member-status",
    "view-families",
    "create-family",
    "edit-family",
    "delete-family",
    "link-members-to-family",
    "view-engagement-scores",
    "configure-engagement-weights",
    "create-followup-task",
    "recalculate-engagement-scores",
    "view-staff",
    "add-staff",
    "edit-staff",
    "delete-staff",
    "manage-staff-contracts",
    "view-staff-credentials",
    "view-leave-requests",
    "create-leave-request",
    "approve-leave",
    "reject-leave",
    "view-leave-balances",
    "view-performance-appraisals",
    "create-performance-review",
    "manage-performance-goals",
    "submit-performance-rating",
    "view-volunteers",
    "add-volunteer",
    "edit-volunteer",
    "manage-background-checks",
    "track-volunteer-hours",
    "view-volunteer-schedule",
    "create-volunteer-shift",
    "assign-volunteers",
    "manage-volunteer-roles",
    "view-volunteer-recognition",
    "create-volunteer-award",
    "assign-volunteer-award",
    "manage-volunteer-milestones",
    // Ministry (all)
    "view-events",
    "create-event",
    "edit-event",
    "delete-event",
    "manage-event-registration",
    "manage-recurring-events",
    "view-small-groups",
    "create-small-group",
    "edit-small-group",
    "delete-small-group",
    "manage-group-members",
    "assign-group-leader",
    "search-small-groups",
    "request-to-join-group",
    "view-prayer-requests",
    "submit-prayer-request",
    "assign-prayer-request",
    "mark-prayer-answered",
    "view-private-prayers",
    "view-prayer-warriors",
    "add-prayer-warrior",
    "manage-prayer-assignments",
    "view-training-courses",
    "create-training-course",
    "edit-training-course",
    "delete-training-course",
    "manage-course-enrollment",
    "issue-certificate",
    "view-training-compliance",
    "send-training-reminders",
    "manage-mandatory-training",
    // Finance (most)
    "view-digital-giving",
    "process-donation",
    "manage-giving-campaigns",
    "export-giving-transactions",
    "view-giving-analytics",
    "view-recurring-giving",
    "view-pledges",
    "record-pledge-payment",
    "send-pledge-reminder",
    "view-pledge-history",
    "view-tax-receipts",
    "generate-tax-receipts",
    "view-funds",
    "view-budget",
    "view-expenses",
    "submit-expense",
    "approve-expense",
    "reject-expense",
    // Payroll (view-focused)
    "view-payroll",
    "view-payroll-history",
    "view-payroll-employees",
    "view-payroll-calendar",
    "view-pending-payroll",
    "view-year-end-summary",
    // Accounting (view-focused)
    "view-chart-of-accounts",
    "view-journal-entries",
    "view-general-ledger",
    "view-financial-statements",
    "view-fiscal-periods",
    // Banking (view-focused)
    "view-member-banking",
    "view-member-transactions",
    "view-treasury",
    "view-bank-accounts",
    "view-member-loans",
    "view-church-loans",
    // Remittance
    "view-remittances",
    "view-missionary-support",
    "view-transfer-history",
    "send-remittance",
    "send-to-missionary",
    "submit-transfer-for-approval",
    // Resources
    "view-facilities",
    "add-facility",
    "edit-facility",
    "book-facility",
    "view-facility-schedule",
    "view-assets",
    "add-asset",
    "edit-asset",
    "manage-depreciation",
    "schedule-maintenance",
    "view-procurement",
    "create-purchase-request",
    "approve-purchase-request",
    "reject-purchase-request",
    "mark-as-ordered",
    "view-media-library",
    "upload-media",
    "start-livestream",
    "manage-sermon-archives",
    "configure-streaming-platforms",
    "view-documents",
    "upload-document",
    "manage-compliance-documents",
    "download-document",
    // Campuses
    "view-campuses",
    "edit-campus",
    "manage-campus-operations",
    "view-campus-analytics",
    "manage-inter-campus-remittances",
    "view-campus-benchmarks",
    "compare-campus-metrics",
    "export-campus-comparison",
    // Settings (limited)
    "view-organization-settings",
    "view-users",
    "view-roles",
  ]);

  // ============================================
  // TREASURER PERMISSIONS
  // Modules: Dashboard, Communications, Reports, Finance, Accounting, Banking
  // ============================================
  const treasurerPermissions = createRolePermissions("treasurer", [
    // Dashboard
    "view-dashboard",
    "view-recent-transactions",
    // Communications
    "view-communications",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "generate-financial-reports",
    "generate-giving-reports",
    "export-reports",
    "create-custom-reports",
    // Finance
    "view-digital-giving",
    "view-giving-analytics",
    "view-recurring-giving",
    "view-pledges",
    "view-pledge-history",
    "view-tax-receipts",
    "generate-tax-receipts",
    "export-tax-receipts",
    "view-funds",
    "view-budget",
    "view-expenses",
    "approve-expense",
    "reject-expense",
    // Accounting
    "view-chart-of-accounts",
    "view-journal-entries",
    "create-journal-entry",
    "edit-draft-entry",
    "post-journal-entry",
    "view-general-ledger",
    "export-general-ledger",
    "filter-ledger-transactions",
    "view-financial-statements",
    "generate-income-statement",
    "generate-balance-sheet",
    "generate-cash-flow",
    "generate-trial-balance",
    "export-financial-statements",
    "view-fiscal-periods",
    // Banking
    "view-member-banking",
    "view-member-transactions",
    "view-treasury",
    "request-bank-statement",
    "view-financial-audit-log",
    "view-bank-accounts",
    "reconcile-account",
    "view-member-loans",
    "view-church-loans",
  ]);

  // ============================================
  // VOLUNTEER COORDINATOR PERMISSIONS
  // Modules: Dashboard, Communications, Reports, People, Ministry
  // ============================================
  const volunteerCoordinatorPermissions = createRolePermissions("volunteer-coordinator", [
    // Dashboard
    "view-dashboard",
    "quick-add-member",
    "quick-create-event",
    // Communications
    "view-communications",
    "create-communication",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "generate-member-reports",
    "generate-ministry-reports",
    "export-reports",
    // People (volunteer focused)
    "view-members",
    "add-member",
    "edit-member",
    "view-member-analytics",
    "view-engagement-scores",
    "create-followup-task",
    "view-volunteers",
    "add-volunteer",
    "edit-volunteer",
    "manage-background-checks",
    "track-volunteer-hours",
    "view-volunteer-schedule",
    "create-volunteer-shift",
    "assign-volunteers",
    "manage-volunteer-roles",
    "view-volunteer-recognition",
    "create-volunteer-award",
    "assign-volunteer-award",
    "manage-volunteer-milestones",
    // Ministry
    "view-events",
    "create-event",
    "edit-event",
    "manage-event-registration",
    "manage-recurring-events",
    "view-small-groups",
    "create-small-group",
    "edit-small-group",
    "manage-group-members",
    "assign-group-leader",
    "search-small-groups",
    "view-prayer-requests",
    "submit-prayer-request",
    "view-prayer-warriors",
    "view-training-courses",
    "manage-course-enrollment",
    "view-training-compliance",
    "send-training-reminders",
  ]);

  // ============================================
  // MEDIA MANAGER PERMISSIONS
  // Modules: Dashboard, Communications, Reports, Resources
  // ============================================
  const mediaManagerPermissions = createRolePermissions("media-manager", [
    // Dashboard
    "view-dashboard",
    // Communications
    "view-communications",
    "create-communication",
    "edit-communication",
    "manage-campaigns",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "export-reports",
    // Resources
    "view-facilities",
    "book-facility",
    "view-facility-schedule",
    "view-assets",
    "view-media-library",
    "upload-media",
    "start-livestream",
    "manage-sermon-archives",
    "configure-streaming-platforms",
    "view-documents",
    "upload-document",
    "download-document",
  ]);

  // ============================================
  // STAFF PERMISSIONS
  // Modules: Dashboard, Communications, Reports, Ministry
  // ============================================
  const staffPermissions = createRolePermissions("staff", [
    // Dashboard
    "view-dashboard",
    // Communications
    "view-communications",
    "view-communication-analytics",
    // Reports
    "view-reports",
    "generate-ministry-reports",
    // Ministry
    "view-events",
    "view-small-groups",
    "search-small-groups",
    "request-to-join-group",
    "view-prayer-requests",
    "submit-prayer-request",
    "view-training-courses",
    "view-training-compliance",
  ]);

  // ============================================
  // MEMBER PERMISSIONS
  // Modules: Dashboard, Communications, Reports (limited)
  // ============================================
  const memberPermissions = createRolePermissions("member", [
    // Dashboard
    "view-dashboard",
    // Communications
    "view-communications",
    // Reports (very limited)
    "view-reports",
    // Ministry (member-facing only)
    "view-events",
    "search-small-groups",
    "request-to-join-group",
    "submit-prayer-request",
  ]);

  // Insert all role permissions
  await knex(DB_TABLES.ROLE_PERMISSIONS).insert([
    ...superAdminPermissions,
    ...financeManagerPermissions,
    ...hrManagerPermissions,
    ...campusAdminPermissions,
    ...treasurerPermissions,
    ...volunteerCoordinatorPermissions,
    ...mediaManagerPermissions,
    ...staffPermissions,
    ...memberPermissions,
  ]);
}