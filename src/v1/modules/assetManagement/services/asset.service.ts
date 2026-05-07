import { injectable } from "tsyringe";
import { AddAsset } from "../dtos/add-asset.dto";
import AssetFactory from "../factories/asset.factory";
import AssetRepository from "../repositories/asset.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import GroupRepository from "../../groupManagement/repositories/group.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async addAsset(data: AddAsset, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      let groupId;
      let assetName;
      if (data.group_id) {
        const group = await this.groupRepository.findById(data.group_id);
        if (!group) throw new AppError(400, "Group not found");

        groupId = group.id;
        assetName = `${group.groupName}'s ${data.assetName}`;
      }

      assetName = data.assetName;
      const asset = AssetFactory.addAsset({
        ...data,
        assetName,
        groupId,
        churchId: String(superAdmin.churchId),
      });
      const addedAsset = await this.assetRepository.save(asset);

      return {
        success: true,
        message: "Asset has been added successfully",
        asset: addedAsset,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding asset");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while adding asset",
      );
    }
  }

  async getAllChurchAssets(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchAssets, totalRecords } =
        await this.assetRepository.findAndCountAll(
          { churchId },
          currentPage,
          pageSize,
        );

      if (churchAssets.length === 0) {
        return {
          success: true,
          churchAssets: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchAssets,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error fetching assets");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while fetching assets",
      );
    }
  }

  async getAsset(assetId: string) {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) throw new AppError(400, "Asset does not exist");

    return {
      success: true,
      asset,
    };
  }

  async updateAsset(req: any) {
    try {
      const data = req.body;
      const asset = await this.assetRepository.findById(req.params.assetId);
      if (!asset) throw new AppError(400, "Asset does not exist");

      let groupId;
      if (data.group_id) {
        const group = await this.groupRepository.findById(data.group_id);
        if (!group) throw new AppError(400, "Group not found");

        groupId = group.id;
      }

      await this.assetRepository.updateById(asset.id, {
        assetName: data.assetName,
        category: data.category,
        purchaseValue: data.purchaseValue,
        purchaseDate: data.purchaseDate,
        location: data.location,
        condition: data.condition,
        groupId,
      });

      return {
        success: true,
        message: "Asset has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error updating asset");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while updating asset",
      );
    }
  }

  async deleteAsset(assetId: string) {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) throw new AppError(400, "Asset does not exist");

    await this.assetRepository.deleteById(asset.id);

    return `${asset.assetName} has been deleted successfully`;
  }
}

export default AssetService;
