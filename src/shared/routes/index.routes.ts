import auditTrailRoute from "../../v1/modules/moduleName/routes/audit-trail.route";
import appRoute from "../../v1/modules/app/app.route";
import healthRoute from "../../v1/modules/health/health.route";
import authRoute from "../../v1/modules/userManagement/routes/auth.route";
import userRoute from "../../v1/modules/userManagement/routes/user.route";
import accessControlRoute from "../../v1/modules/accessControlManagement/routes/access-control.route";
import walletRoute from "../../v1/modules/walletService/routes/wallet.route";
import churchRoute from "../../v1/modules/churchManagement/routes/church.route";
import memberRoute from "../../v1/modules/memberManagement/routes/member.route";
import familyRoute from "../../v1/modules/familyManagement/routes/family-and-member.route";

export default {
  app: appRoute,
  health: healthRoute,
  auditTrail: auditTrailRoute,
  auth: authRoute,
  userManagement: userRoute,
  accessControl: accessControlRoute,
  walletManagement: walletRoute,
  churchManagement: churchRoute,
  memberManagement: memberRoute,
  familyManagement: familyRoute,
};
