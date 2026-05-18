import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createGroupRules } from "../validations/create-group.valiadator";
import { addMemberTogroupRules } from "../validations/add-member-to-group.validator";
import { messageGroupRules } from "../validations/message-group.validator";
import { recordAttendanceRules } from "../validations/record-attendance.validator";
import { editGroupRules } from "../validations/edit-group.validator";
import { assignMemberToRoleRules } from "../validations/assign-member-to-role.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import GroupController from "../controller/group.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const groupController = container.resolve(GroupController);

const router = express.Router();

router.post(
  "/groups/create",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.GROUP_CREATION),
    validate(createGroupRules),
  ],
  (req: Request, res: Response, next) =>
    groupController.createGroup(req, res).catch((err) => next(err)),
);

router.post(
  "/groups/:groupId/add-member",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.GROUP_MEMBERS),
    validate(addMemberTogroupRules),
  ],
  (req: Request, res: Response, next) =>
    groupController.addMemberToGroup(req, res).catch((err) => next(err)),
);

router.post(
  "/groups/:groupId/join",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    groupController.requestToOrJoinGroup(req, res).catch((err) => next(err)),
);

router.post(
  "/groups/:groupId/message",
  [authMiddleware, validate(messageGroupRules)],
  (req: Request, res: Response, next) =>
    groupController.messageGroup(req, res).catch((err) => next(err)),
);

router.get(
  "/groups/:groupId/messages",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    groupController.getGroupMessages(req, res).catch((err) => next(err)),
);

router.post(
  "/groups/:groupId/record-attendance",
  [authMiddleware, validate(recordAttendanceRules)],
  (req: Request, res: Response, next) =>
    groupController.recordAttendance(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/groups",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_LIST)],
  (req: Request, res: Response, next) =>
    groupController.getAllChurchGroups(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/groups/category",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_LIST)],
  (req: Request, res: Response, next) =>
    groupController
      .getChurchGroupsBasedOnCategory(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/groups/:groupId/profile",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_LIST)],
  (req: Request, res: Response, next) =>
    groupController.getGroupProfile(req, res).catch((err) => next(err)),
);

router.put(
  "/group/members/:newMemberId/approve",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_MEMBERS)],
  (req: Request, res: Response, next) =>
    groupController.approveNewMembers(req, res).catch((err) => next(err)),
);

router.put(
  "/group/members/:groupMemberId/assign",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.GROUP_MEMBERS),
    validate(assignMemberToRoleRules),
  ],
  (req: Request, res: Response, next) =>
    groupController.assignGroupMemberToRole(req, res).catch((err) => next(err)),
);

router.put(
  "/groups/:groupId/update",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.GROUP_UPDATE),
    validate(editGroupRules),
  ],
  (req: Request, res: Response, next) =>
    groupController.editGroup(req, res).catch((err) => next(err)),
);

router.delete(
  "/group/members/:groupMemberId/remove",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_MEMBERS)],
  (req: Request, res: Response, next) =>
    groupController.removeMemberFromGroup(req, res).catch((err) => next(err)),
);

router.delete(
  "/groups/:groupId/delete",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_DELETION)],
  (req: Request, res: Response, next) =>
    groupController.deleteGroup(req, res).catch((err) => next(err)),
);

router.get(
  "/groups/:groupId/members",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_MEMBERS)],
  (req: Request, res: Response, next) =>
    groupController.getGroupMembers(req, res).catch((err) => next(err)),
);

router.get(
  "/groups/:groupId/meetings",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_LIST)],
  (req: Request, res: Response, next) =>
    groupController.getGroupMeetings(req, res).catch((err) => next(err)),
);

router.get(
  "/groups/:groupId/requests",
  [authMiddleware, accessControlMiddleware(AccessControls.GROUP_MEMBERS)],
  (req: Request, res: Response, next) =>
    groupController.getGroupJoinRequests(req, res).catch((err) => next(err)),
);

export default router;
