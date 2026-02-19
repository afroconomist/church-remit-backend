import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createNewsRules } from "../validations/create-news.validator";
import { createNewsletterRules } from "../validations/create-newsletter.validator";
import { uploadCircularRules } from "../validations/upload-circular.validator";
import { createDiscussionBoardRules } from "../validations/create-discussion-board.validator";
import { createTopicRules } from "../validations/create-topic.validator";
import { replyTopicRules } from "../validations/reply-topic.validator";
import { createTagRules } from "../validations/create-tag.validator";
import { editTagRules } from "../validations/edit-tag.validator";
import { createNewAnnoucementRules } from "../validations/create-new-announcement.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import CommunicationController from "../controller/communication.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const communicationController = container.resolve(CommunicationController);

const router = express.Router();

router.post(
  "/communications/create-news",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.NEWS_CREATION),
    validate(createNewsRules),
  ],
  (req: Request, res: Response, next) =>
    communicationController.createNews(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/communications/news",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getAllChurchNews(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/communications/:newsId/read",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController.readNews(req, res).catch((err) => next(err)),
);

router.post(
  "/communications/create-newsletter",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.NEWS_CREATION),
    validate(createNewsletterRules),
  ],
  (req: Request, res: Response, next) =>
    communicationController
      .createNewsletter(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/communications/:newsletterId/preview",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .previewNewsletter(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/:churchId/communications/newsletters",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getAllChurchNewsletters(req, res)
      .catch((err) => next(err)),
);

router.post(
  "/communications/upload-circular",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.DOCUMENT_UPLOAD),
    validate(uploadCircularRules),
  ],
  (req: Request, res: Response, next) =>
    communicationController.uploadCircular(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/communications/circulars",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getAllChurchCirculars(req, res)
      .catch((err) => next(err)),
);

router.post(
  "/communications/create-discussion-board",
  [authMiddleware, validate(createDiscussionBoardRules)],
  (req: Request, res: Response, next) =>
    communicationController
      .createDiscussionBoard(req, res)
      .catch((err) => next(err)),
);

router.post(
  "/communications/:discussionBoardId/join",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .joinDiscussionBoard(req, res)
      .catch((err) => next(err)),
);

router.post(
  "/communications/:discussionBoardId/start-new-topic",
  [authMiddleware, validate(createTopicRules)],
  (req: Request, res: Response, next) =>
    communicationController.newTopic(req, res).catch((err) => next(err)),
);

router.post(
  "/communications/:boardTopicId/reply",
  [authMiddleware, validate(replyTopicRules)],
  (req: Request, res: Response, next) =>
    communicationController.replyTopic(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/communications/discussion-boards",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getAllChurchDiscussionBoards(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/communications/:discussionBoardId/discussion-board-and-topics",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getDiscussionBoardAndTopics(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/communications/:boardTopicId/board-topic-replies",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getBoardTopicAndReplies(req, res)
      .catch((err) => next(err)),
);

router.post(
  "/tags/create",
  [authMiddleware, validate(createTagRules)],
  (req: Request, res: Response, next) =>
    communicationController.createMemberTag(req, res).catch((err) => next(err)),
);

router.get(
  "/communications/:churchId/member-tags",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController
      .getChurchMemberTags(req, res)
      .catch((err) => next(err)),
);

router.put(
  "/communications/:tagId/update",
  [authMiddleware, validate(editTagRules)],
  (req: Request, res: Response, next) =>
    communicationController.editMemberTag(req, res).catch((err) => next(err)),
);

router.delete(
  "/communications/:tagId/delete",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    communicationController.deleteMemberTag(req, res).catch((err) => next(err)),
);

router.post(
  "/communications/new-announcement",
  [authMiddleware, validate(createNewAnnoucementRules)],
  (req: Request, res: Response, next) =>
    communicationController
      .createNewAnnouncement(req, res)
      .catch((err) => next(err)),
);

export default router;
