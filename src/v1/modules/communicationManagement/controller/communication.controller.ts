import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import CommunicationService from "../services/communication.service";
import httpStatus from "http-status";

@injectable()
class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  createNews = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.createNews(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchNews = async (req: Request, res: Response) => {
    try {
      const churchNews = await this.communicationService.getAllChurchNews(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchNews));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  readNews = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.readNews(
      req.params.newsId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  createNewsletter = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.createNewsletter(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  previewNewsletter = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.previewNewsletter(
      req.params.newsletterId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchNewsletters = async (req: Request, res: Response) => {
    try {
      const churchNewsletter =
        await this.communicationService.getAllChurchNewsletters(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchNewsletter));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  uploadCircular = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.uploadCircular(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchCirculars = async (req: Request, res: Response) => {
    try {
      const churchCirculars =
        await this.communicationService.getAllChurchCirculars(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchCirculars));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  createDiscussionBoard = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.createDiscussionBoard(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  joinDiscussionBoard = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.joinDiscussionBoard(
      req.params.discussionBoardId,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  newTopic = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.newTopic(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  replyTopic = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.replyTopic(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchDiscussionBoards = async (req: Request, res: Response) => {
    try {
      const churchDiscussionBoards =
        await this.communicationService.getAllChurchDiscussionBoards(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchDiscussionBoards));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getDiscussionBoardAndTopics = async (req: Request, res: Response) => {
    try {
      const discussionBoardTopics =
        await this.communicationService.getDiscussionBoardAndTopics(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", discussionBoardTopics));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getBoardTopicAndReplies = async (req: Request, res: Response) => {
    try {
      const boardTopicReplies =
        await this.communicationService.getBoardTopicAndReplies(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", boardTopicReplies));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  createMemberTag = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.createMemberTag(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getChurchMemberTags = async (req: Request, res: Response) => {
    try {
      const memberTags = await this.communicationService.getChurchMemberTags(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", memberTags));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  editMemberTag = async (req: Request, res: Response) => {
    try {
      const result: any = await this.communicationService.editMemberTag(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to update member tag" });
    }
  };

  deleteMemberTag = async (req: Request, res: Response) => {
    const response = await this.communicationService.deleteMemberTag(
      req.params.tagId,
    );

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  createNewAnnouncement = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.createNewAnnouncement(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchAnnouncements = async (req: Request, res: Response) => {
    try {
      const churchAnnouncements =
        await this.communicationService.getAllChurchAnnouncements(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchAnnouncements));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getAnnouncement = async (req: Request, res: Response) => {
    const result: any = await this.communicationService.getAnnouncement(
      req.params.announcementId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };
}

export default CommunicationController;
