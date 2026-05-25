import { AddAsset } from "../dtos/add-asset.dto";
import { IAsset } from "../model/asset.model";

class AssetFactory {
  static addAsset(data: AddAsset) {
    const asset = {} as IAsset;

    asset.assetName = data.assetName;
    asset.category = data.category;
    asset.purchaseValue = data.purchaseValue;
    asset.purchaseDate = data.purchaseDate;
    asset.location = data.location;
    asset.condition = data.condition;
    asset.groupId = data.groupId;
    asset.campusId = data.campusId;
    asset.churchId = data.churchId;

    return asset;
  }
}

export default AssetFactory;
