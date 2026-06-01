import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import CampusService from "../services/campus.service";
import httpStatus from "http-status";

@injectable()
class CampusController {
  constructor(private readonly campusService: CampusService) {}

  addCampus = async (req: Request, res: Response) => {
    const result: any = await this.campusService.addCampus(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getCampus = async (req: Request, res: Response) => {
    const result: any = await this.campusService.getCampus(req.params.campusId);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllCampusAssets = async (req: Request, res: Response) => {
    const result: any = await this.campusService.getAllCampusAssets(
      req.params.campusId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  assignPersonnelToCampus = async (req: Request, res: Response) => {
    const result: any = await this.campusService.assignPersonnelToCampus(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchCampuses = async (req: Request, res: Response) => {
    try {
      const churchCampuses = await this.campusService.getAllChurchCampuses(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchCampuses));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusPersonnels = async (req: Request, res: Response) => {
    try {
      const campusPersonnels = await this.campusService.getCampusPersonnels(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", campusPersonnels));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  editCampus = async (req: Request, res: Response) => {
    try {
      const result: any = await this.campusService.editCampus(req);
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
        .json({ status: false, message: "Failed to edit campus info" });
    }
  };

  deleteCampus = async (req: Request, res: Response) => {
    const response = await this.campusService.deleteCampus(req.params.campusId);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  getCampusChurchMembers = async (req: Request, res: Response) => {
    try {
      const churchMembers = await this.campusService.getCampusChurchMembers(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchMembers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusChurchUpcomingMembersBirthdays = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const upcomingBirthdays =
        await this.campusService.getCampusChurchUpcomingMembersBirthdays(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", upcomingBirthdays));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusFamilies = async (req: Request, res: Response) => {
    try {
      const families = await this.campusService.getCampusFamilies(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", families));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusVolunteerRoles = async (req: Request, res: Response) => {
    try {
      const volunteerRoles = await this.campusService.getCampusVolunteerRoles(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", volunteerRoles));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusVolunteers = async (req: Request, res: Response) => {
    try {
      const volunteers = await this.campusService.getCampusVolunteers(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", volunteers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusChurchEvents = async (req: Request, res: Response) => {
    try {
      const churchEvents = await this.campusService.getCampusChurchEvents(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusUpcomingChurchEvents = async (req: Request, res: Response) => {
    try {
      const upcomingEvents =
        await this.campusService.getCampusUpcomingChurchEvents(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", upcomingEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusRecurringChurchEvents = async (req: Request, res: Response) => {
    try {
      const recurringEvents =
        await this.campusService.getCampusRecurringChurchEvents(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", recurringEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getPastChurchEvents = async (req: Request, res: Response) => {
    try {
      const pastEvents = await this.campusService.getPastChurchEvents(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", pastEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusSacraments = async (req: Request, res: Response) => {
    try {
      const churchSacraments = await this.campusService.getCampusSacraments(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchSacraments));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusPrayerRequests = async (req: Request, res: Response) => {
    try {
      const prayerRequests = await this.campusService.getCampusPrayerRequests(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", prayerRequests));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusPrayerWarriors = async (req: Request, res: Response) => {
    try {
      const prayerWarriors = await this.campusService.getCampusPrayerWarriors(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", prayerWarriors));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusNews = async (req: Request, res: Response) => {
    try {
      const churchNews = await this.campusService.getCampusNews(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchNews));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusNewsletters = async (req: Request, res: Response) => {
    try {
      const churchNewsletters = await this.campusService.getCampusNewsletters(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchNewsletters));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusCirculars = async (req: Request, res: Response) => {
    try {
      const churchCirculars = await this.campusService.getCampusCirculars(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchCirculars));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusDiscussionBoards = async (req: Request, res: Response) => {
    try {
      const churchDiscussionBoards =
        await this.campusService.getCampusDiscussionBoards(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchDiscussionBoards));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusAnnouncements = async (req: Request, res: Response) => {
    try {
      const churchAnnouncements =
        await this.campusService.getCampusAnnouncements(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchAnnouncements));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusAssets = async (req: Request, res: Response) => {
    try {
      const churchAssets = await this.campusService.getCampusAssets(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchAssets));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusFacilities = async (req: Request, res: Response) => {
    try {
      const churchFacilities = await this.campusService.getCampusFacilities(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchFacilities));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusDocuments = async (req: Request, res: Response) => {
    try {
      const churchDocuments = await this.campusService.getCampusDocuments(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchDocuments));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusDetails = async (req: Request, res: Response) => {
    const result: any = await this.campusService.getCampusDetails(req.user.id);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  // controllers for form dropdowns
  async getAllChurchCampusesForDropdown(req: Request, res: Response) {
    try {
      const churchCampuses =
        await this.campusService.getAllChurchCampusesForDropdown(
          req.params.churchId,
        );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchCampuses));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  }
}

export default CampusController;
