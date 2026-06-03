import { injectable } from "tsyringe";
import { Request } from "express";
import FamilyFactory from "../factories/family.factory";
import FamilyRepository from "../repositories/family.repository";
import FamilyMemberFactory from "../factories/family_member.factory";
import FamilyMemberRepository from "../repositories/family_member.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import { getAgeByDate } from "@shared/utils/functions.util";

@injectable()
class FamilyService {
  constructor(
    private readonly familyRepository: FamilyRepository,
    private readonly familyMemberRepository: FamilyMemberRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async createFamily(req: Request) {
    const { primaryMember, familyAddress, churchMemberId } = req.body;

    try {
      const churchMember = await this.memberRepository.findById(churchMemberId);
      if (!churchMember) {
        throw new AppError(400, "Church member does not exist");
      }

      if (!churchMember.dateOfBirth) {
        throw new Error("Date of birth is compulsory to create a family");
      }

      const ageOfMember = getAgeByDate(String(churchMember.dateOfBirth));
      if (ageOfMember < 18) {
        throw new Error("Primary member must be above 18");
      }

      const primaryMemberExists = await this.familyMemberRepository.findOne({
        churchMemberId: churchMember.id,
        primary: true,
      });
      if (primaryMemberExists)
        return {
          status: false,
          message: "Primary member already exists for another family",
        };

      const family = FamilyFactory.createFamily({
        familyName: `${churchMember.firstName} Family`,
        primaryMember,
        familyAddress: familyAddress,
        campusId: churchMember.campusId,
        church: churchMember.churchId,
        members: 1,
      });
      const createdFamily = await this.familyRepository.save(family);

      const newPrimaryMember = FamilyMemberFactory.addFamilyMember({
        memberName: primaryMember,
        memberEmail: churchMember.email,
        memberPhoneNumber: churchMember.phoneNumber,
        memberDOB: churchMember.dateOfBirth,
        memberAddress: familyAddress,
        memberRelationship: "Parent",
        primary: true,
        family: createdFamily.id,
        churchMemberId: churchMember.id,
      });
      const primaryMemberAdded = await this.familyMemberRepository.save(
        newPrimaryMember,
      );

      await this.memberRepository.updateById(churchMember.id, {
        linkedToFamily: true,
      });

      return {
        success: true,
        message: "Family has been created successfully",
        family: createdFamily,
        primaryMember: primaryMemberAdded,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating family");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating family",
      );
    }
  }

  async getFamilies(req: any) {
    const churchId = req.params.churchId;
    const { campusId, page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = {
        church: churchId,
      };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: families, totalRecords } =
        await this.familyRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (families.length === 0) {
        return {
          families: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        families,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching families" });
      throw new Error("An unexpected error occurred while fetching families.");
    }
  }

  async addFamilyMember(req: Request) {
    const { memberName, memberRelationship, churchMemberId } = req.body;

    try {
      const churchMember = await this.memberRepository.findById(churchMemberId);
      if (!churchMember) {
        throw new AppError(400, "Church member does not exist");
      }

      if (!churchMember.dateOfBirth) {
        throw new Error("Date of birth is compulsory to be added to a family");
      }

      const family = await this.familyRepository.findById(req.params.familyId);
      if (!family) return { success: false, message: "Family does not exist" };

      const addedFamilyMember = await this.familyMemberRepository.findOne({
        churchMemberId: churchMember.id,
        family: family.id,
      });
      if (addedFamilyMember)
        return {
          success: true,
          message: "Family member has been added already",
        };

      const ageOfMember = getAgeByDate(String(churchMember.dateOfBirth));
      if (ageOfMember < 18) {
        const parent = await this.familyMemberRepository.findOne({
          family: family.id,
          memberRelationship: "Parent",
        });
        if (!parent)
          return { success: false, message: "Parent does not exist" };

        const child = FamilyMemberFactory.addFamilyMember({
          memberName,
          memberEmail: churchMember.email,
          memberPhoneNumber: parent.memberPhoneNumber,
          memberDOB: churchMember.dateOfBirth,
          memberAddress: family.familyAddress,
          memberRelationship: "Child",
          family: family.id,
          churchMemberId: churchMember.id,
        });
        const childAdded = await this.familyMemberRepository.save(child);

        await this.memberRepository.updateById(churchMember.id, {
          linkedToFamily: true,
        });

        await this.familyRepository.updateById(family.id, {
          members: Number(family.members) + 1,
        });

        return {
          success: true,
          message: "Family member has been added successfully",
          child: childAdded,
        };
      }

      const familyMember = FamilyMemberFactory.addFamilyMember({
        memberName,
        memberEmail: churchMember.email,
        memberPhoneNumber: churchMember.phoneNumber,
        memberDOB: churchMember.dateOfBirth,
        memberAddress: family.familyAddress,
        memberRelationship,
        family: family.id,
        churchMemberId: churchMember.id,
      });
      const familyMemberAdded = await this.familyMemberRepository.save(
        familyMember,
      );

      await this.memberRepository.updateById(churchMember.id, {
        linkedToFamily: true,
      });

      await this.familyRepository.updateById(family.id, {
        members: Number(family.members) + 1,
      });

      return {
        success: true,
        message: "Family member has been added successfully",
        familyMember: familyMemberAdded,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding family member");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while adding family member",
      );
    }
  }

  async getUnlinkedMembers(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: unlinkedMembers, totalRecords } =
        await this.memberRepository.findAndCountAll(
          {
            churchId,
            linkedToFamily: false,
          },
          currentPage,
          pageSize,
        );

      if (unlinkedMembers.length === 0) {
        return {
          members: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        unlinkedMembers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching unlinked members" });
      throw new Error(
        "An unexpected error occurred while fetching unlinked members.",
      );
    }
  }

  async linkToFamily(req: Request) {
    try {
      const { churchMemberId, memberRelationship } = req.body;
      const churchMember = await this.memberRepository.findById(churchMemberId);
      if (!churchMember) {
        throw new AppError(400, "Church member does not exist");
      }

      if (!churchMember.dateOfBirth) {
        throw new Error("Date of birth is compulsory to be linked to a family");
      }

      const family = await this.familyRepository.findById(req.params.familyId);
      if (!family) return { success: false, message: "Family does not exist" };

      const linkedFamilyMember = await this.familyMemberRepository.findOne({
        churchMemberId: churchMember.id,
        family: family.id,
      });
      if (linkedFamilyMember)
        return {
          success: true,
          message: "Family member has been linked to a family already",
        };

      const ageOfMember = getAgeByDate(String(churchMember.dateOfBirth));
      if (ageOfMember < 18) {
        const parent = await this.familyMemberRepository.findOne({
          family: family.id,
          memberRelationship: "Parent",
        });
        if (!parent)
          return { success: false, message: "Parent does not exist" };

        const child = FamilyMemberFactory.addFamilyMember({
          memberName: `${churchMember.firstName} ${churchMember.lastName}`,
          memberEmail: churchMember.email,
          memberPhoneNumber: parent.memberPhoneNumber,
          memberDOB: churchMember.dateOfBirth,
          memberAddress: family.familyAddress,
          memberRelationship: "Child",
          family: family.id,
          churchMemberId: churchMember.id,
        });
        const childAdded = await this.familyMemberRepository.save(child);

        await this.memberRepository.updateById(churchMember.id, {
          linkedToFamily: true,
        });

        await this.familyRepository.updateById(family.id, {
          members: Number(family.members) + 1,
        });

        return {
          success: true,
          message: "Family member has been added successfully",
          child: childAdded,
        };
      }

      const familyMember = FamilyMemberFactory.addFamilyMember({
        memberName: `${churchMember.firstName} ${churchMember.lastName}`,
        memberEmail: churchMember.email,
        memberPhoneNumber: churchMember.phoneNumber,
        memberDOB: churchMember.dateOfBirth,
        memberAddress: family.familyAddress,
        memberRelationship,
        family: family.id,
        churchMemberId: churchMember.id,
      });
      const newFamilyMember = await this.familyMemberRepository.save(
        familyMember,
      );

      await this.memberRepository.updateById(churchMember.id, {
        linkedToFamily: true,
      });

      await this.familyRepository.updateById(family.id, {
        members: Number(family.members) + 1,
      });

      return {
        success: true,
        message: "Family member has been linked to a family successfully",
        familyMember: newFamilyMember,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error linking member to family");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while linking member to family",
      );
    }
  }

  async getFamilyMembers(req: Request) {
    try {
      const familyMembers = await this.familyMemberRepository.findAll({
        family: req.params.familyId,
      });

      return { familyMembers };
    } catch (error: any) {
      logger.error({ error: "Error fetching family members" });
      throw new Error(
        "An unexpected error occurred while fetching family members.",
      );
    }
  }

  async editFamilyMember(req: Request) {
    try {
      const data = req.body;
      const familyMember = await this.familyMemberRepository.findById(
        req.params.memberId,
      );
      if (!familyMember)
        return {
          success: false,
          message: "Family member is not added to any family",
        };

      await this.familyMemberRepository.updateById(req.params.memberId, {
        memberPhoneNumber: data.memberPhoneNumber,
        memberRelationship: data.memberRelationship,
      });

      return {
        success: true,
        message: "Family member has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit family member");
      throw new AppError(400, error.message);
    }
  }

  async editFamily(req: Request) {
    try {
      const family = await this.familyRepository.findById(req.params.familyId);
      if (!family) return { success: false, message: "Family does not exist" };

      await this.familyRepository.updateById(req.params.familyId, {
        familyName: req.body.familyName,
        familyAddress: req.body.address,
      });

      await this.familyMemberRepository.findAndUpdate(
        { family: req.params.familyId, primary: true },
        {
          memberPhoneNumber: req.body.primaryPhone,
          memberEmail: req.body.primaryEmail,
        },
      );

      await this.familyMemberRepository.findAllAndUpdate(
        {
          family: req.params.familyId,
        },
        {
          memberAddress: req.body.address,
        },
      );

      return {
        success: true,
        message: "Family has been edited successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error editing family");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while editing family",
      );
    }
  }

  async removeFamilyMember(req: Request) {
    const memberId = req.params.memberId;
    const familyMember = await this.familyMemberRepository.findById(memberId);
    if (!familyMember) {
      throw new AppError(400, "Family member does not exist");
    }

    const family = await this.familyRepository.findById(familyMember.family);
    if (!family) throw new AppError(400, "Family does not exist");

    if (familyMember.primary) {
      throw new AppError(403, "Primary member can not be removed");
    }

    await this.memberRepository.updateById(
      String(familyMember.churchMemberId),
      {
        linkedToFamily: false,
      },
    );

    await this.familyRepository.updateById(family.id, {
      members: Number(family.members) - 1,
    });

    await this.familyMemberRepository.deleteById(familyMember.id);

    return "Family member has been removed successfully";
  }

  async deleteFamily(req: Request) {
    const family = await this.familyRepository.findById(req.params.familyId);
    if (!family) throw new AppError(400, "Family does not exist");

    const familyMembers = await this.familyMemberRepository.findAll({
      family: family.id,
    });
    if (familyMembers.length > 0) {
      for (const member of familyMembers) {
        await this.memberRepository.updateById(member.id, {
          linkedToFamily: false,
        });
      }
    }

    await this.familyRepository.deleteById(family.id);

    return "Family has been deleted successfully";
  }
}

export default FamilyService;
