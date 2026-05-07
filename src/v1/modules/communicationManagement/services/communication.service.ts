import { injectable } from "tsyringe";
import { CreateNews } from "../dtos/create-news.dto";
import { CreateNewsletter } from "../dtos/create-newsletter.dto";
import { UploadCircular } from "../dtos/upload-circular.dto";
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
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import slugify from "slugify";
import { normalizeDate } from "@shared/utils/functions.util";

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
  ) {}

  async createNews(data: CreateNews, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const news = NewsFactory.createNews({
        headline: data.headline,
        shortSummary: data.shortSummary,
        fullArticle: data.fullArticle,
        media: data.media,
        province: data.province,
        publishDate: data.publishDate,
        publishTime: data.publishTime,
        featureThisNews: data.featureThisNews,
        showOnHomepage: data.showOnHomepage,
        postedAt: new Date(),
        churchId: String(superAdmin.churchId),
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
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchNews, totalRecords } =
        await this.newsRepository.findAndCountAll({ churchId }, page, limit);

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

    return { success: true, news };
  }

  async createNewsletter(data: CreateNewsletter, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      if (data.sendDate) {
        const sendDate = new Date(data.sendDate);
        const today = normalizeDate(new Date());
        const normalizedSendDate = normalizeDate(sendDate);
        if (normalizedSendDate < today) {
          throw new Error("Newsletter cannot be published in the past");
        }
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
        churchId: String(superAdmin.churchId),
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

    return { success: true, newsletter };
  }

  async getAllChurchNewsletters(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchNewsletters, totalRecords } =
        await this.newsletterRepository.findAndCountAll(
          { churchId },
          page,
          limit,
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

  async uploadCircular(data: UploadCircular, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const circular = CircularFactory.uploadCircular({
        title: data.title,
        description: data.description,
        province: data.province,
        category: data.category,
        file: data.file,
        uploadedAt: new Date(),
        churchId: String(superAdmin.churchId),
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
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchCirculars, totalRecords } =
        await this.circularRepository.findAndCountAll(
          { churchId },
          page,
          limit,
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

  async createDiscussionBoard(
    data: CreateDiscussionBoard,
    superAdminId: string,
  ) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const discussionBoard = DiscussionBoardFactory.createDiscussionBoard({
        boardName: data.boardName,
        description: data.description,
        welcomeMessage: data.welcomeMessage,
        visibility: data.visibility,
        whoCanPost: data.whoCanPost,
        notifyMembers: data.notifyMembers,
        members: 1,
        churchId: String(superAdmin.churchId),
      });
      const createdDiscussionBoard = await this.discussionBoardRepository.save(
        discussionBoard,
      );

      const boardMember = BoardMemberFactory.joinDiscussionBoard({
        memberName: `${superAdmin.firstName} ${superAdmin.lastName}`,
        churchMemberId: superAdmin.id,
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
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchDiscussionBoards, totalRecords } =
        await this.discussionBoardRepository.findAndCountAll(
          { churchId },
          page,
          limit,
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
          page,
          limit,
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

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        discussionBoard,
        discussionBoardTopics,
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
          page,
          limit,
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
        await this.tagRepository.findAndCountAll({ churchId }, page, limit);

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

  async createNewAnnouncement(data: CreateAnnouncement, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

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
        churchId: String(superAdmin.churchId),
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
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchAnnouncements, totalRecords } =
        await this.announcementRepository.findAndCountAll(
          { churchId },
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

    return { success: true, announcement };
  }
}

export default CommunicationService;
