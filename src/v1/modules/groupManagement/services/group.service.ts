import { injectable } from "tsyringe";
import { Request } from "express";
import GroupFactory from "../factories/group.factory";
import GroupRepository from "../repositories/group.repository";
import GroupMemberFactory from "../factories/group_member.factory";
import GroupMemberRepository from "../repositories/group_member.repository";
import GroupChatFactory from "../factories/group_chat.factory";
import GroupChatRepository from "../repositories/group_chat.repository";
import GroupMeetingAttendanceFactory from "../factories/group_meeting_attendance.factory";
import GroupMeetingAttendanceRepository from "../repositories/group_meeting_attendance.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import { CreateGroup } from "../dtos/create-new-group.dto";
import { RecordAttendance } from "../dtos/record-attendance.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMeetingAttendanceRepository: GroupMeetingAttendanceRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async createGroup(data: CreateGroup, groupCreatorId: string) {
    try {
      const groupCreator = await this.userRepository.findById(groupCreatorId);
      if (!groupCreator)
        throw new AppError(400, "Group creator does not exist");

      const group = GroupFactory.createGroup({
        groupName: data.groupName,
        category: data.category,
        description: data.description,
        groupLeader: "",
        capacity: data.capacity,
        capacityTracker: 1,
        meetingDay: data.meetingDay,
        meetingTime: data.meetingTime,
        frequency: data.frequency,
        location: data.location,
        criteriaType: data.criteriaType,
        minAge: data.minAge,
        maxAge: data.maxAge,
        publicGroup: data.publicGroup,
        allowGuestInvites: data.allowGuestInvites,
        requireLeaderApproval: data.requireLeaderApproval,
        enableGroupChat: data.enableGroupChat,
        groupCreator: `${groupCreator.firstName} ${groupCreator.lastName}`,
        church: String(groupCreator.churchId),
      });
      const newGroup = await this.groupRepository.save(group);

      const groupMember = GroupMemberFactory.addMemberToGroup({
        groupMemberName: `${groupCreator.firstName} ${groupCreator.lastName}`,
        groupMemberRole: "Leader",
        joined: new Date(),
        group: newGroup.id,
        churchMemberId: groupCreator.id,
      });
      await this.groupMemberRepository.save(groupMember);

      return {
        success: true,
        message: "Group has been created successfully",
        group: newGroup,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating new group");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating new group",
      );
    }
  }

  async addMemberToGroup(req: Request) {
    try {
      const group = await this.groupRepository.findById(req.params.groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const churchMember = await this.memberRepository.findById(
        req.body.churchMemberId,
      );
      if (!churchMember)
        throw new AppError(400, "Church member does not exist");

      const groupMemberExist = await this.groupMemberRepository.findOne({
        group: group.id,
        churchMemberId: churchMember.id,
      });
      if (groupMemberExist)
        return {
          status: false,
          message: `${groupMemberExist.groupMemberName} is already a member of this group`,
        };

      if (group.capacity === group.capacityTracker && group.capacity !== 0) {
        return {
          status: false,
          message: `Maximum capacity of ${group.capacity} group members have been met`,
        };
      }

      const member = GroupMemberFactory.addMemberToGroup({
        groupMemberName: req.body.groupMemberName,
        joined: new Date(),
        group: group.id,
        churchMemberId: churchMember.id,
      });
      const groupMember = await this.groupMemberRepository.save(member);

      await this.groupRepository.updateById(group.id, {
        capacityTracker: Number(group.capacityTracker) + 1,
      });

      return {
        success: true,
        message: "Member has been added to group successfully",
        member: groupMember,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding member to group");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while adding member to group",
      );
    }
  }

  async requestToOrJoinGroup(groupId: string, churchMemberId: string) {
    try {
      const group = await this.groupRepository.findById(groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const churchMember = await this.memberRepository.findById(churchMemberId);
      if (!churchMember)
        throw new AppError(400, "Church member does not exist");

      const groupMemberExist = await this.groupMemberRepository.findOne({
        group: group.id,
        churchMemberId: churchMember.id,
      });
      if (groupMemberExist)
        return {
          status: false,
          message: "You have requested to or join this group",
        };

      if (group.capacity === group.capacityTracker && group.capacity !== 0) {
        return {
          status: false,
          message: `Maximum capacity of ${group.capacity} group members have been met`,
        };
      }

      if (group.requireLeaderApproval) {
        const member = GroupMemberFactory.addMemberToGroup({
          groupMemberName: `${churchMember.firstName} ${churchMember.lastName}`,
          status: "Pending",
          group: group.id,
          churchMemberId: churchMember.id,
        });
        await this.groupMemberRepository.save(member);

        return {
          success: true,
          message: `Your request to join ${group.groupName} group, is now awaiting approval!`,
        };
      }

      const member = GroupMemberFactory.addMemberToGroup({
        groupMemberName: `${churchMember.firstName} ${churchMember.lastName}`,
        joined: new Date(),
        group: group.id,
        churchMemberId: churchMember.id,
      });
      const groupMember = await this.groupMemberRepository.save(member);

      await this.groupRepository.updateById(group.id, {
        capacityTracker: Number(group.capacityTracker) + 1,
      });

      return {
        success: true,
        message: `You have joined the ${group.groupName} group successfully`,
        member: groupMember,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error requesting to join group");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while requesting to join group",
      );
    }
  }

  async messageGroup(req: any) {
    try {
      const group = await this.groupRepository.findById(req.params.groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const churchMember = await this.memberRepository.findById(req.user.id);
      if (!churchMember)
        throw new AppError(400, "Church member does not exist");

      const groupMember = await this.groupMemberRepository.findOne({
        group: group.id,
        churchMemberId: churchMember.id,
      });
      if (!groupMember) throw new AppError(400, "Group member does not exist");

      const chatGroup = GroupChatFactory.messageGroup({
        groupMemberName: `${groupMember.groupMemberName}`,
        message: req.body.message,
        group: group.id,
      });
      const groupMessage = await this.groupChatRepository.save(chatGroup);

      return {
        success: true,
        groupMessage,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error messaging the group");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while messaging the group",
      );
    }
  }

  async recordAttendance(data: RecordAttendance, groupId: string) {
    try {
      const group = await this.groupRepository.findById(groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const meetingAttendance = GroupMeetingAttendanceFactory.recordAttendance({
        meetingDate: data.meetingDate,
        guestCount: data.guestCount,
        attended: data.attended,
        meetingTopic: data.meetingTopic,
        meetingNotes: data.meetingNotes,
        testimonies: data.testimonies,
        prayerRequests: data.prayerRequests,
        group: group.id,
      });
      const recordedMeetingAttendance =
        await this.groupMeetingAttendanceRepository.save(meetingAttendance);

      return {
        success: true,
        message: "Group meeting attendance has been recorded successfully",
        attendance: recordedMeetingAttendance,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error recording attendance for group meeting",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while recording attendance for group meeting",
      );
    }
  }

  async getAllChurchGroups(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchGroups, totalRecords } =
        await this.groupRepository.findAndCountAll(
          { church: churchId },
          page,
          limit,
        );

      if (churchGroups.length === 0) {
        return {
          churchGroups: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchGroups,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church groups" });
      throw new Error(
        "An unexpected error occurred while fetching all church groups.",
      );
    }
  }

  async getChurchGroupsBasedOnCategory(req: any) {
    const churchId = req.params.churchId;
    const { category, page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchGroupsBasedOnCategory, totalRecords } =
        await this.groupRepository.findAndCountAll(
          {
            category,
            church: churchId,
          },
          page,
          limit,
        );

      if (churchGroupsBasedOnCategory.length === 0) {
        return {
          churchGroupsBasedOnCategory: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchGroupsBasedOnCategory,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church groups on category" });
      throw new Error(
        "An unexpected error occurred while fetching all church groups on category.",
      );
    }
  }

  async getGroupProfile(req: Request) {
    const group = await this.groupRepository.findById(req.params.groupId);
    if (!group) throw new AppError(400, "Group does not exist");

    return { success: true, group };
  }

  async approveNewMembers(newMemberId: string) {
    try {
      const newMember = await this.groupMemberRepository.findById(newMemberId);
      if (!newMember) throw new AppError(400, "New member does not exist");

      const group = await this.groupRepository.findById(newMember.group);
      if (!group) throw new AppError(400, "Group does not exist");

      if (group.capacity === group.capacityTracker && group.capacity !== 0) {
        return {
          status: false,
          message: `Maximum capacity of ${group.capacity} group members have been met`,
        };
      }

      await this.groupMemberRepository.updateById(newMember.id, {
        status: "Approved",
        joined: new Date(),
      });

      await this.groupRepository.updateById(group.id, {
        capacityTracker: Number(group.capacityTracker) + 1,
      });

      return {
        success: true,
        message: "New member has been approved successfully",
      };
    } catch (error) {
      logger.error({
        error: "Error approving new member",
      });
      throw new Error(
        "An unexpected error occurred while approving new member.",
      );
    }
  }

  async assignGroupMemberToRole(groupMemberId: string, role: string) {
    try {
      const groupMember = await this.groupMemberRepository.findById(
        groupMemberId,
      );
      if (!groupMember) throw new AppError(400, "Group member does not exist");

      await this.groupMemberRepository.updateById(groupMember.id, {
        groupMemberRole: role,
      });

      return {
        success: true,
        message: `${groupMember.groupMemberName} has been assigned the ${role} role`,
      };
    } catch (error) {
      logger.error({
        error: "Error assigning group member to role",
      });
      throw new Error(
        "An unexpected error occurred while assigning group member to role.",
      );
    }
  }

  async editGroup(req: any) {
    try {
      const data = req.body;
      const group = await this.groupRepository.findById(req.params.groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      await this.groupRepository.updateById(group.id, {
        groupName: data.groupName,
        category: data.category,
        description: data.description,
        capacity: data.capacity,
        meetingDay: data.meetingDay,
        meetingTime: data.meetingTime,
        frequency: data.frequency,
        location: data.location,
        publicGroup: data.publicGroup,
        allowGuestInvites: data.allowGuestInvites,
        requireLeaderApproval: data.requireLeaderApproval,
        enableGroupChat: data.enableGroupChat,
      });

      return {
        success: true,
        message: "Group info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit group");
      throw new AppError(400, error.message);
    }
  }

  async removeMemberFromGroup(groupMemberId: string) {
    const groupMember = await this.groupMemberRepository.findById(
      groupMemberId,
    );
    if (!groupMember) throw new AppError(400, "Group member does not exist");

    const group = await this.groupRepository.findById(groupMember.group);
    if (!group) throw new AppError(400, "Group does not exist");

    await this.groupRepository.updateById(group.id, {
      capacityTracker: Number(group.capacityTracker) - 1,
    });

    await this.groupMemberRepository.deleteById(groupMember.id);

    return `${groupMember.groupMemberName} has been removed successfully`;
  }

  async deleteGroup(groupId: string) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new AppError(400, "Group does not exist");

    await this.groupRepository.deleteById(group.id);

    return `${group.groupName} has been deleted successfully`;
  }

  async getGroupMembers(req: any) {
    const groupId = req.params.groupId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: groupMembers, totalRecords } =
        await this.groupMemberRepository.findAndCountAll(
          {
            status: "Approved",
            group: groupId,
          },
          page,
          limit,
        );

      if (groupMembers.length === 0) {
        return {
          groupMembers: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        groupMembers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching group members" });
      throw new Error(
        "An unexpected error occurred while fetching group members.",
      );
    }
  }

  async getGroupMeetings(req: any) {
    const groupId = req.params.groupId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: groupMeetings, totalRecords } =
        await this.groupMeetingAttendanceRepository.findAndCountAll(
          {
            group: groupId,
          },
          page,
          limit,
        );

      if (groupMeetings.length === 0) {
        return {
          groupMeetings: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        groupMeetings,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching group meetings" });
      throw new Error(
        "An unexpected error occurred while fetching group meetings.",
      );
    }
  }

  async getGroupJoinRequests(req: any) {
    const groupId = req.params.groupId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: groupJoinRequests, totalRecords } =
        await this.groupMemberRepository.findAndCountAll(
          {
            status: "Pending",
            group: groupId,
          },
          page,
          limit,
        );

      if (groupJoinRequests.length === 0) {
        return {
          groupJoinRequests: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        groupJoinRequests,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching group join requests" });
      throw new Error(
        "An unexpected error occurred while fetching group join requests.",
      );
    }
  }
}

export default GroupService;
