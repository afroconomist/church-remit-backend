import { injectable } from "tsyringe";
import { CreateNewsletter } from "../dtos/create-newsletter.dto";
import { CreateDiscussionBoard } from "../dtos/create-board.dto";
import { CreateTag } from "../dtos/create-tag.dto";
import { CreateAnnouncement } from "../dtos/create-announcement.dto";
import NewsFactory from "../factories/news.factory";
import NewsRepository from "../repositories/news.repository";
import NewsletterFactory from "../factories/newsletter.factory";
import NewsletterRepository from "../repositories/newsletter.repository";
import CircularFactory from "../factories/circular.factory";
import CircularRepository from "../repositories/circular.repository";
import DiscussionBoardFactory from "../factories/discussion_board.factory";
import DiscussionBoardRepository from "../repositories/discussion_board.repository";
import BoardMemberFactory from "../factories/board_member.factory";
import BoardMemberRepository from "../repositories/board_member.repository";
import BoardTopicFactory from "../factories/board_topic.factory";
import BoardTopicRepository from "../repositories/board_topic.repository";
import TopicReplyFactory from "../factories/topic_reply.factory";
import TopicReplyRepository from "../repositories/topic_reply.repository";
import TagFactory from "../factories/tag.factory";
import TagRepository from "../repositories/tag.repository";
import AnnouncementFactory from "../factories/announcement.factory";
import AnnouncementRepository from "../repositories/announcement.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import CampusRepository from "../../campusManagement/repositories/campus.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import slugify from "slugify";
import { normalizeDate } from "@shared/utils/functions.util";
import { uploadFileToS3 } from "@shared/utils/file-upload.util";

@injectable()
class CommunicationService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newsletterRepository: NewsletterRepository,
    private readonly circularRepository: CircularRepository,
    private readonly discussionBoardRepository: DiscussionBoardRepository,
    private readonly boardMemberRepository: BoardMemberRepository,
    private readonly boardTopicRepository: BoardTopicRepository,
    private readonly topicReplyRepository: TopicReplyRepository,
    private readonly tagRepository: TagRepository,
    private readonly announcementRepository: AnnouncementRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly campusRepository: CampusRepository,
  ) {}

  async createNews(req: any) {
    const media = req.file;
    const rawData = req.body.data;
    const adminId = req.user.id;

    if (!media) throw new AppError(400, "No media uploaded");

    let parsedData;

    try {
      parsedData = JSON.parse(rawData);
      const {
        headline,
        shortSummary,
        fullArticle,
        province,
        publishDate,
        publishTime,
        featureThisNews,
        showOnHomepage,
        campusId,
      } = parsedData;

      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      const newsPublishDate = new Date(publishDate);
      const today = normalizeDate(new Date());
      const normalizedPublishDate = normalizeDate(newsPublishDate);
      if (normalizedPublishDate < today) {
        throw new Error("News cannot be published in the past");
      }

      const fileData = await uploadFileToS3(
        media,
        `news/${media.originalname}`,
      );
      if (!fileData) {
        throw new AppError(400, "News media upload failed");
      }

      let campusId_;
      if (campusId || campusId === null) {
        campusId_ = campusId;
      } else {
        campusId_ = admin.campusId;
      }
      const news = NewsFactory.createNews({
        headline,
        shortSummary,
        fullArticle,
        media: fileData.url,
        province,
        publishDate,
        publishTime,
        featureThisNews,
        showOnHomepage,
        postedAt: new Date(),
        campusId: campusId_,
        churchId: String(admin.churchId),
      });
      const createdNews = await this.newsRepository.save(news);

      return {
        success: true,
        message: "News has been created successfully",
        news: createdNews,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a news");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating a news",
      );
    }
  }

  async getAllChurchNews(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchNews, totalRecords } =
        await this.newsRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (churchNews.length === 0) {
        return {
          churchNews: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchNews,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching all church news" });
      throw new Error(
        "An unexpected error occurred while fetching all church news.",
      );
    }
  }

  async readNews(newsId: string) {
    const news = await this.newsRepository.findById(newsId);
    if (!news) throw new AppError(400, "News not found");

    let campusName;
    if (news.campusId) {
      const campus = await this.campusRepository.findById(
        String(news.campusId),
      );
      if (!campus) throw new AppError(400, "Campus does not exist");
      campusName = campus.campusName;
    } else {
      campusName = null;
    }

    return {
      success: true,
      news: {
        ...news,
        campusName,
      },
    };
  }

  async createNewsletter(data: CreateNewsletter, adminId: string) {
    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      if (data.sendDate) {
        const sendDate = new Date(data.sendDate);
        const today = normalizeDate(new Date());
        const normalizedSendDate = normalizeDate(sendDate);
        if (normalizedSendDate < today) {
          throw new Error("Newsletter cannot be published in the past");
        }
      }

      let campusId;
      if (data.campusId || data.campusId === null) {
        campusId = data.campusId;
      } else {
        campusId = admin.campusId;
      }
      const newsletter = NewsletterFactory.createNewsletter({
        newsletterTitle: data.newsletterTitle,
        emailSubjectLine: data.emailSubjectLine,
        emailContent: data.emailContent,
        audience: data.audience,
        includeAttachements: data.includeAttachements,
        sendImmediately: data.sendImmediately,
        sendDate: data.sendDate,
        sendTime: data.sendTime,
        postedAt: new Date(),
        campusId,
        churchId: String(admin.churchId),
      });
      const createdNewsletter = await this.newsletterRepository.save(
        newsletter,
      );

      return {
        success: true,
        message: "Newsletter has been created successfully",
        newsletter: createdNewsletter,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a news");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating a news",
      );
    }
  }

  async previewNewsletter(newsletterId: string) {
    const newsletter = await this.newsletterRepository.findById(newsletterId);
    if (!newsletter) throw new AppError(400, "Newsletter not found");

    let campusName;
    if (newsletter.campusId) {
      const campus = await this.campusRepository.findById(
        String(newsletter.campusId),
      );
      if (!campus) throw new AppError(400, "Campus does not exist");
      campusName = campus.campusName;
    } else {
      campusName = null;
    }

    return {
      success: true,
      newsletter: {
        ...newsletter,
        campusName,
      },
    };
  }

  async getAllChurchNewsletters(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchNewsletters, totalRecords } =
        await this.newsletterRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (churchNewsletters.length === 0) {
        return {
          churchNewsletters: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchNewsletters,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching all church newsletters" });
      throw new Error(
        "An unexpected error occurred while fetching all church newsletters.",
      );
    }
  }

  async uploadCircular(req: any) {
    const file = req.file;
    const adminId = req.user.id;
    const { title, description, province, category, campusId } = req.body;

    if (!file) {
      throw new AppError(400, "No file uploaded");
    }

    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      const fileData = await uploadFileToS3(
        file,
        `circulars/${file.originalname}`,
      );
      if (!fileData) {
        throw new AppError(400, "Circular document upload failed");
      }

      let campusId_;
      if (campusId || campusId === null) {
        campusId_ = campusId;
      } else {
        campusId_ = admin.campusId;
      }
      const circular = CircularFactory.uploadCircular({
        title,
        description,
        province,
        category,
        documentUrl: fileData.url,
        uploadedAt: new Date().toISOString(),
        campusId: campusId_,
        churchId: String(admin.churchId),
      });
      const uploadedCircular = await this.circularRepository.save(circular);

      return {
        success: true,
        message: "Circular has been uploaded successfully",
        circular: uploadedCircular,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a circular");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating a circular",
      );
    }
  }

  async getAllChurchCirculars(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchCirculars, totalRecords } =
        await this.circularRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (churchCirculars.length === 0) {
        return {
          churchCirculars: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchCirculars,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching all church circulars" });
      throw new Error(
        "An unexpected error occurred while fetching all church circulars.",
      );
    }
  }

  async createDiscussionBoard(data: CreateDiscussionBoard, adminId: string) {
    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      let campusId;
      if (data.campusId || data.campusId === null) {
        campusId = data.campusId;
      } else {
        campusId = admin.campusId;
      }
      const discussionBoard = DiscussionBoardFactory.createDiscussionBoard({
        boardName: data.boardName,
        description: data.description,
        welcomeMessage: data.welcomeMessage,
        visibility: data.visibility,
        whoCanPost: data.whoCanPost,
        notifyMembers: data.notifyMembers,
        members: 1,
        campusId,
        churchId: String(admin.churchId),
      });
      const createdDiscussionBoard = await this.discussionBoardRepository.save(
        discussionBoard,
      );

      const boardMember = BoardMemberFactory.joinDiscussionBoard({
        memberName: `${admin.firstName} ${admin.lastName}`,
        churchMemberId: admin.id,
        discussionBoardId: createdDiscussionBoard.id,
      });
      await this.boardMemberRepository.save(boardMember);

      return {
        success: true,
        message: "Discussion board has been uploaded successfully",
        discussionBoard: createdDiscussionBoard,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error creating a discussion board",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating a discussion board",
      );
    }
  }

  async joinDiscussionBoard(discussionBoardId: string, churchMemberId: string) {
    try {
      const churchMember = await this.memberRepository.findById(churchMemberId);
      if (!churchMember)
        throw new AppError(400, "Church member does not exist");

      const discussionBoard = await this.discussionBoardRepository.findById(
        discussionBoardId,
      );
      if (!discussionBoard)
        throw new AppError(400, "Discussion board not found");

      const boardMember = BoardMemberFactory.joinDiscussionBoard({
        memberName: `${churchMember.firstName} ${churchMember.lastName}`,
        churchMemberId: churchMember.id,
        discussionBoardId: discussionBoard.id,
      });
      await this.boardMemberRepository.save(boardMember);

      await this.discussionBoardRepository.updateById(discussionBoard.id, {
        members: Number(discussionBoard.members) + 1,
      });

      return {
        success: true,
        message: "You can now participate in ongoing discussions in this board",
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error joining a discussion board",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while joining a discussion board",
      );
    }
  }

  async newTopic(req: any) {
    try {
      const discussionBoard = await this.discussionBoardRepository.findById(
        req.params.discussionBoardId,
      );
      if (!discussionBoard)
        throw new AppError(400, "Discussion board not found");

      const boardMember = await this.boardMemberRepository.findOne({
        churchMemberId: req.user.id,
        discussionBoardId: discussionBoard.id,
      });
      if (!boardMember)
        throw new AppError(
          400,
          "You are not a member of this discussion board",
        );

      const topic = BoardTopicFactory.createTopic({
        topicTitle: req.body.topicTitle,
        message: req.body.message,
        startedBy: boardMember.memberName,
        discussionBoardId: discussionBoard.id,
      });
      const createdTopic = await this.boardTopicRepository.save(topic);

      return {
        success: true,
        message: "Topic has been created successfully",
        Topic: createdTopic,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a topic");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating a topic",
      );
    }
  }

  async replyTopic(req: any) {
    try {
      const topic = await this.boardTopicRepository.findById(
        req.params.boardTopicId,
      );
      if (!topic) throw new AppError(400, "Topic not found");

      const boardMember = await this.boardMemberRepository.findOne({
        churchMemberId: req.user.id,
        discussionBoardId: topic.discussionBoardId,
      });
      if (!boardMember)
        throw new AppError(
          400,
          "You are not a member of this discussion board",
        );

      const replyTopic = TopicReplyFactory.replyTopic({
        message: req.body.message,
        repliedBy: boardMember.memberName,
        boardTopicId: topic.id,
      });
      const topicReply = await this.topicReplyRepository.save(replyTopic);

      return {
        success: true,
        message: "You have successfully replied to this topic",
        reply: topicReply,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a topic");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating a topic",
      );
    }
  }

  async getAllChurchDiscussionBoards(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchDiscussionBoards, totalRecords } =
        await this.discussionBoardRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (churchDiscussionBoards.length === 0) {
        return {
          churchDiscussionBoards: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchDiscussionBoards,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching all church discussion boards" });
      throw new Error(
        "An unexpected error occurred while fetching all church discussion boards.",
      );
    }
  }

  async getDiscussionBoardAndTopics(req: any) {
    const churchMemberId = req.user.id;
    const discussionBoardId = req.params.discussionBoardId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const discussionBoard = await this.discussionBoardRepository.findById(
        discussionBoardId,
      );
      if (!discussionBoard)
        throw new AppError(400, "Discussion board not found");

      const { data: discussionBoardTopics, totalRecords } =
        await this.boardTopicRepository.findAndCountAll(
          { discussionBoardId: discussionBoard.id },
          currentPage,
          pageSize,
        );

      if (discussionBoardTopics.length === 0) {
        return {
          discussionBoardTopics: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      await this.discussionBoardRepository.updateById(discussionBoard.id, {
        topics: totalRecords,
      });

      let campusName;
      if (discussionBoard.campusId) {
        const campus = await this.campusRepository.findById(
          String(discussionBoard.campusId),
        );
        if (!campus) throw new AppError(400, "Campus does not exist");
        campusName = campus.campusName;
      } else {
        campusName = null;
      }
      let isBoardMember;
      const boardMember = await this.boardMemberRepository.findOne({
        churchMemberId,
        discussionBoardId: discussionBoard.id,
      });
      isBoardMember = boardMember ? true : false;
      let discussion_board_topics;
      if (discussionBoard.visibility === "private" && !isBoardMember) {
        discussion_board_topics = [];
      } else {
        discussion_board_topics = discussionBoardTopics;
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        discussionBoard: {
          ...discussionBoard,
          campusName,
        },
        discussionBoardTopics: discussion_board_topics,
        isBoardMember,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching discussion board and topics" });
      throw new Error(
        "An unexpected error occurred while fetching discussion board and topics.",
      );
    }
  }

  async getBoardTopicAndReplies(req: any) {
    const boardTopicId = req.params.boardTopicId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const boardTopic = await this.boardTopicRepository.findById(boardTopicId);
      if (!boardTopic) throw new AppError(400, "Board topic board not found");

      const { data: boardTopicReplies, totalRecords } =
        await this.topicReplyRepository.findAndCountAll(
          { boardTopicId: boardTopic.id },
          currentPage,
          pageSize,
        );

      if (boardTopicReplies.length === 0) {
        return {
          boardTopicReplies: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      await this.boardTopicRepository.updateById(boardTopic.id, {
        replies: totalRecords,
      });

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        boardTopic,
        boardTopicReplies,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching board topic and replies" });
      throw new Error(
        "An unexpected error occurred while fetching board topic and replies.",
      );
    }
  }

  async createMemberTag(data: CreateTag, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const tag = TagFactory.createTag({
        tagName: data.tagName,
        description: data.description,
        color: data.color,
        defaultAssignment: data.defaultAssignment,
        churchId: String(superAdmin.churchId),
      });
      const memberTag = await this.tagRepository.save(tag);

      return {
        success: true,
        message: "Member tag has been created successfully",
        tag: memberTag,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a member tag");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating a member tag",
      );
    }
  }

  async getChurchMemberTags(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: memberTags, totalRecords } =
        await this.tagRepository.findAndCountAll(
          { churchId },
          currentPage,
          pageSize,
        );

      if (memberTags.length === 0) {
        return {
          memberTags: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        memberTags,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church member tags" });
      throw new Error(
        "An unexpected error occurred while fetching all church member tags.",
      );
    }
  }

  async editMemberTag(req: any) {
    try {
      const data = req.body;
      const tag = await this.tagRepository.findById(req.params.tagId);
      if (!tag) throw new AppError(400, "Tag not found");

      const slug = slugify(data.tagName, { lower: true });

      await this.tagRepository.updateById(tag.id, {
        tagName: data.tagName,
        description: data.description,
        color: data.color,
        defaultAssignment: data.defaultAssignment,
        slug,
      });

      return {
        success: true,
        message: "Tag has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update tag");
      throw new AppError(400, error.message);
    }
  }

  async deleteMemberTag(tagId: string) {
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) throw new AppError(400, "Tag not found");

    await this.tagRepository.deleteById(tag.id);

    return `${tag.tagName} member tag has been deleted successfully`;
  }

  async createNewAnnouncement(data: CreateAnnouncement, adminId: string) {
    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      let campusId;
      if (data.campusId || data.campusId === null) {
        campusId = data.campusId;
      } else {
        campusId = admin.campusId;
      }
      const announcement = AnnouncementFactory.createAnnouncement({
        title: data.title,
        content: data.content,
        category: data.category,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        displayOnWebsite: data.displayOnWebsite,
        sendEmailNotification: data.sendEmailNotification,
        sendSMSNotification: data.sendSMSNotification,
        campusId,
        churchId: String(admin.churchId),
      });
      const newAnnouncement = await this.announcementRepository.save(
        announcement,
      );

      return {
        success: true,
        message: "New announcement has been published successfully",
        announcement: newAnnouncement,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error publishing a new announcement",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while publishing a new announcement",
      );
    }
  }

  async getAllChurchAnnouncements(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchAnnouncements, totalRecords } =
        await this.announcementRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (churchAnnouncements.length === 0) {
        return {
          churchAnnouncements: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchAnnouncements,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church announcements" });
      throw new Error(
        "An unexpected error occurred while fetching all church announcements.",
      );
    }
  }

  async getAnnouncement(announcementId: string) {
    const announcement = await this.announcementRepository.findById(
      announcementId,
    );
    if (!announcement) throw new AppError(400, "Announcement not found");

    let campusName;
    if (announcement.campusId) {
      const campus = await this.campusRepository.findById(
        String(announcement.campusId),
      );
      if (!campus) throw new AppError(400, "Campus does not exist");
      campusName = campus.campusName;
    } else {
      campusName = null;
    }

    return {
      success: true,
      announcement: {
        ...announcement,
        campusName,
      },
    };
  }
}

export default CommunicationService;
