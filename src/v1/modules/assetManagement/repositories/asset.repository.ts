import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Asset, IAsset } from "../model/asset.model";

@injectable()
class AssetRepository extends BaseRepository<IAsset, Asset> {
  constructor() {
    super(Asset);
  }
}

export default AssetRepository;
