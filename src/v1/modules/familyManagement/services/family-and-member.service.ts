import { injectable } from "tsyringe";
import { Request } from "express";
import FamilyFactory from "../factories/family.factory";
import FamilyRepository from "../repositories/family.repository";
import { AddFamilyMember } from "../dtos/add-family-member.dto";
import FamilyMemberFactory from "../factories/family_member.factory";
import FamilyMemberRepository from "../repositories/family_member.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

interface FamilyAndPrimaryMemberPayload {
  primaryMember: string;
  familyAddress: string;
  primaryMemberEmail: string;
  primaryMemberPhoneNumber?: string;
  primaryMemberDOB: Date;
  primaryMemberRelationship: string;
}

@injectable()
class FamilyAndMemberService {
  constructor(
    private readonly familyRepository: FamilyRepository,
    private readonly familyMemberRepository: FamilyMemberRepository
  ) {}

  async createFamily(
    family_and_primary_member_data: FamilyAndPrimaryMemberPayload
  ) {
    try {
      const primaryMember = await this.familyMemberRepository.findOne({
        memberEmail: family_and_primary_member_data.primaryMemberEmail,
      });
      if (primaryMember)
        return {
          success: true,
          message: "Primary member already exists for another family",
        };

      const family = FamilyFactory.createFamily({
        primaryMember: `${family_and_primary_member_data.primaryMember} Family`,
        familyAddress: family_and_primary_member_data.familyAddress,
      });
      const createdFamily = await this.familyRepository.save(family);

      const newPrimaryMember = FamilyMemberFactory.addFamilyMember({
        memberName: family_and_primary_member_data.primaryMember,
        memberEmail: family_and_primary_member_data.primaryMemberEmail,
        memberPhoneNumber:
          family_and_primary_member_data.primaryMemberPhoneNumber,
        memberDOB: family_and_primary_member_data.primaryMemberDOB,
        memberAddress: family_and_primary_member_data.familyAddress,
        memberRelationship:
          family_and_primary_member_data.primaryMemberRelationship,
        primary: true,
        family: createdFamily.id,
      });
      const primaryMemberAdded = await this.familyMemberRepository.save(
        newPrimaryMember
      );

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
        error.message || "An unexpected error occurred while creating family"
      );
    }
  }

  async addFamilyMember(family_member_data: AddFamilyMember, familyId: string) {
    try {
      const family = await this.familyRepository.findById(familyId);
      if (!family) return { success: false, message: "Family does not exist" };

      const addedFamilyMember = await this.familyMemberRepository.findOne({
        memberEmail: family_member_data.memberEmail,
      });
      if (addedFamilyMember)
        return {
          success: true,
          message: "Family member has been added already",
        };

      const familyMember = FamilyMemberFactory.addFamilyMember({
        ...family_member_data,
        memberAddress: family.familyAddress,
        family: familyId,
      });
      const familyMemberAdded = await this.familyMemberRepository.save(
        familyMember
      );

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
          "An unexpected error occurred while adding family member"
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
        "An unexpected error occurred while fetching family members."
      );
    }
  }

  async editFamilyMember(req: Request) {
    try {
      const data = req.body;
      const familyMember = await this.familyMemberRepository.findById(
        req.params.memberId
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
        familyAddress: req.body.address,
      });

      await this.familyMemberRepository.findAllAndUpdate(
        {
          family: req.params.familyId,
        },
        {
          memberAddress: req.body.address,
        }
      );

      return {
        success: true,
        message: "Family has been edited successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error editing family");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while editing family"
      );
    }
  }

  async removeFamilyMember(req: Request) {
    const memberId = req.params.memberId;
    const familyMember = await this.familyMemberRepository.findById(memberId);
    if (!familyMember) {
      throw new AppError(400, "Family member does not exist");
    }

    if (familyMember.primary) {
      throw new AppError(403, "Primary member can not be removed");
    }

    await this.familyMemberRepository.deleteById(familyMember.id);

    return "Family member has been removed successfully";
  }
}

export default FamilyAndMemberService;
