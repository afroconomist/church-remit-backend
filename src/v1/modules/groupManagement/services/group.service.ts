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
import GroupCriteriaFactory from "../factories/group_criteria.factory";
import GroupCriteriaRepository from "../repositories/group_criteria.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import { CreateGroup } from "../dtos/create-new-group.dto";
import { RecordAttendance } from "../dtos/record-attendance.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import { normalizeDate, getAgeByDate } from "@shared/utils/functions.util";
import { transaction } from "objection";
import { Group } from "../model/group.model";

@injectable()
class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMeetingAttendanceRepository: GroupMeetingAttendanceRepository,
    private readonly groupCriteriaRepository: GroupCriteriaRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async createGroup(data: CreateGroup, groupCreatorId: string) {
    try {
      const [admin, member] = await Promise.all([
        this.userRepository.findById(groupCreatorId),
        this.memberRepository.findById(groupCreatorId),
      ]);
      const groupCreator = admin ? admin : member;

      const { newGroup, group_leader, group_criterias } = await transaction(
        Group.knex(),
        async (trx) => {
          const group = GroupFactory.createGroup({
            groupName: data.groupName,
            category: data.category,
            description: data.description,
            capacity: data.capacity,
            capacityTracker: 1,
            meetingDay: data.meetingDay,
            meetingTime: data.meetingTime,
            frequency: data.frequency,
            location: data.location,
            publicGroup: data.publicGroup,
            allowGuestInvites: data.allowGuestInvites,
            requireLeaderApproval: data.requireLeaderApproval,
            enableGroupChat: data.enableGroupChat,
            groupCreator: `${groupCreator.firstName} ${groupCreator.lastName}`,
            church: String(groupCreator.churchId),
          });
          const newGroup = await this.groupRepository.save(group, trx);

          const groupLeader = GroupMemberFactory.addMemberToGroup({
            groupMemberName: `${groupCreator.firstName} ${groupCreator.lastName}`,
            groupMemberRole: "Leader",
            joined: new Date(),
            group: newGroup.id,
            churchMemberId: groupCreator.id,
          });
          const group_leader = await this.groupMemberRepository.save(
            groupLeader,
            trx,
          );

          const groupCriterias =
            data.criterias?.map((criteria) =>
              GroupCriteriaFactory.createGroupCriteria({
                criteriaType: criteria.criteriaType,
                minAge: criteria.minAge,
                maxAge: criteria.maxAge,
                sex: criteria.sex,
                status: criteria.status,
                groupId: newGroup.id,
              }),
            ) || [];

          const group_criterias =
            groupCriterias.length > 0
              ? await this.groupCriteriaRepository.saveBulk(groupCriterias, trx)
              : [];

          return { newGroup, group_leader, group_criterias };
        },
      );

      return {
        success: true,
        message: "Group has been created successfully",
        group: newGroup,
        group_leader,
        group_criterias,
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

      const groupCriterias = await this.groupCriteriaRepository.findAll({
        groupId: group.id,
      });

      if (groupCriterias && groupCriterias.length > 0) {
        const criteriaValidation = this.checkMemberCriteria(
          churchMember,
          groupCriterias,
        );
        if (!criteriaValidation.isValid) {
          return {
            status: false,
            message: criteriaValidation.error,
          };
        }
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

      const groupCriterias = await this.groupCriteriaRepository.findAll({
        groupId: group.id,
      });

      if (groupCriterias && groupCriterias.length > 0) {
        const criteriaValidation = this.checkMemberCriteria(
          churchMember,
          groupCriterias,
        );
        if (!criteriaValidation.isValid) {
          return {
            status: false,
            message: criteriaValidation.error,
          };
        }
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

      const groupMember = await this.groupMemberRepository.findOne({
        group: group.id,
        churchMemberId: req.user.id,
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

  async getGroupMessages(req: any) {
    try {
      const group = await this.groupRepository.findById(req.params.groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const groupMessages = await this.groupChatRepository.findAll({
        group: group.id,
      });

      return {
        success: true,
        groupMessages,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error fetching group messages");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching group messages",
      );
    }
  }

  async recordAttendance(data: RecordAttendance, groupId: string) {
    try {
      const group = await this.groupRepository.findById(groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const meetingDate = new Date(data.meetingDate);
      const today = normalizeDate(new Date());
      const normalizedMeetingDate = normalizeDate(meetingDate);
      if (normalizedMeetingDate > today) {
        throw new AppError(400, "Cannot record attendance for future meetings");
      }

      const meetingAttendance = GroupMeetingAttendanceFactory.recordAttendance({
        meetingDate: data.meetingDate,
        guestCount: data.guestCount,
        attended: data.attended,
        absent: data.absent,
        excused: data.excused,
        guestNames: JSON.stringify(data.guestNames),
        presentMembers: JSON.stringify(data.presentMembers),
        absentMembers: JSON.stringify(data.absentMembers),
        excusedMembers: JSON.stringify(data.excusedMembers),
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

  async getGroupMeetingAttendance(meetingAttendanceId: string) {
    try {
      const meetingAttendance =
        await this.groupMeetingAttendanceRepository.findById(
          meetingAttendanceId,
        );
      if (!meetingAttendance)
        throw new AppError(400, "Meeting attendance record does not exist");

      return {
        success: true,
        meetingAttendance,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error fetching group meeting attendance",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching group meeting attendance",
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
          currentPage,
          pageSize,
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
          currentPage,
          pageSize,
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

  async getGroupAndMembers(req: any) {
    const groupId = req.params.groupId;
    const userId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const group = await this.groupRepository.findById(groupId);
      if (!group) throw new AppError(400, "Group does not exist");

      const { data: groupMembers, totalRecords } =
        await this.groupMemberRepository.findAndCountAll(
          {
            status: "Approved",
            group: group.id,
          },
          currentPage,
          pageSize,
        );

      if (groupMembers.length === 0) {
        return {
          groupMembers: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const groupCriterias = await this.groupCriteriaRepository.findAll({
        groupId: group.id,
      });

      const isMember = groupMembers.some(
        (member) => member.churchMemberId === userId,
      );

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        group,
        groupMembers,
        groupCriterias,
        isMember,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching group and group members" });
      throw new Error(
        "An unexpected error occurred while fetching group and group members.",
      );
    }
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

      await transaction(Group.knex(), async (trx) => {
        await this.groupRepository.updateById(
          group.id,
          {
            groupName: data.groupName,
            category: data.category,
            description: data.description,
            groupLeader: data.groupLeader,
            capacity: data.capacity,
            meetingDay: data.meetingDay,
            meetingTime: data.meetingTime,
            frequency: data.frequency,
            location: data.location,
            publicGroup: data.publicGroup,
            allowGuestInvites: data.allowGuestInvites,
            requireLeaderApproval: data.requireLeaderApproval,
            enableGroupChat: data.enableGroupChat,
          },
          trx,
        );

        await this.groupMemberRepository.findAndUpdate(
          { groupMemberName: data.groupLeader },
          { groupMemberRole: "Leader" },
        );

        if (data.criterias !== undefined) {
          await trx.from("group_criterias").where("groupId", group.id).delete();

          if (data.criterias.length > 0) {
            const groupCriterias = data.criterias.map((criteria: any) =>
              GroupCriteriaFactory.createGroupCriteria({
                criteriaType: criteria.criteriaType,
                minAge: criteria.minAge,
                maxAge: criteria.maxAge,
                sex: criteria.sex,
                status: criteria.status,
                groupId: group.id,
              }),
            );

            await this.groupCriteriaRepository.saveBulk(groupCriterias, trx);
          }
        }
      });

      return {
        success: true,
        message: "Group info and criterias have been updated successfully",
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
          currentPage,
          pageSize,
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
          currentPage,
          pageSize,
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

  private checkMemberCriteria(
    member: any,
    criterias: any[],
  ): { isValid: boolean; error?: string } {
    for (const criteria of criterias) {
      if (criteria.criteriaType === "age") {
        if (!member.dateOfBirth) {
          return {
            isValid: false,
            error:
              "Member does not have a date of birth recorded. Cannot validate age criteria.",
          };
        }

        const memberAge = getAgeByDate(member.dateOfBirth);

        if (criteria.minAge && memberAge < criteria.minAge) {
          return {
            isValid: false,
            error: `Member age (${memberAge}) does not meet the minimum age requirement (${criteria.minAge}) for this group.`,
          };
        }

        if (criteria.maxAge && memberAge > criteria.maxAge) {
          return {
            isValid: false,
            error: `Member age (${memberAge}) exceeds the maximum age requirement (${criteria.maxAge}) for this group.`,
          };
        }
      }

      if (criteria.criteriaType === "gender") {
        if (!member.gender) {
          return {
            isValid: false,
            error:
              "Member does not have a gender recorded. Cannot validate gender criteria.",
          };
        }

        if (member.gender !== criteria.sex) {
          return {
            isValid: false,
            error: `Member gender (${member.gender}) does not match the required sex (${criteria.sex}) for this group.`,
          };
        }
      }

      if (criteria.criteriaType === "marital-status") {
        if (!member.maritalStatus) {
          return {
            isValid: false,
            error:
              "Member does not have a marital status recorded. Cannot validate marital status criteria.",
          };
        }

        if (member.maritalStatus !== criteria.status) {
          return {
            isValid: false,
            error: `Member marital status (${member.maritalStatus}) does not match the required status (${criteria.status}) for this group.`,
          };
        }
      }
    }

    return { isValid: true };
  }

  // services for form dropdowns
  async getAllGroupMembersForDropdown(
    groupId: string,
  ): Promise<{ id: string; name: string }[]> {
    return await this.groupMemberRepository.findAllForDropdown(
      { group: groupId },
      "id",
      "groupMemberName",
    );
  }

  async getNonGroupMembersForDropdown(
    churchId: string,
    groupId: string,
  ): Promise<{ id: string; name: string }[]> {
    return await this.memberRepository.findNonGroupMembersForDropdown(
      { churchId },
      "group_members",
      groupId,
      "id",
      "firstName",
      "lastName",
    );
  }
}

export default GroupService;
