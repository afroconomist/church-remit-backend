import { injectable } from "tsyringe";
import { AddNewFacility } from "../dtos/add-new-facility.dto";
import { BookFacility } from "../dtos/book-facility.dto";
import FacilityFactory from "../factories/facility.factory";
import FacilityRepository from "../repositories/facility.repository";
import FacilityBookingFactory from "../factories/facility_booking.factory";
import FacilityBookingRepository from "../repositories/facility_booking.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import { normalizeDate } from "@shared/utils/functions.util";

@injectable()
class FacilityService {
  constructor(
    private readonly facilityRepository: FacilityRepository,
    private readonly facilityBookingRepository: FacilityBookingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addNewFacility(data: AddNewFacility, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const facility = FacilityFactory.addNewFacility({
        facilityName: data.facilityName,
        facilityType: data.facilityType,
        capacity: data.capacity,
        location: data.location,
        features: data.features,
        status: "Available",
        churchId: String(superAdmin.churchId),
      });
      const newFacility = await this.facilityRepository.save(facility);

      return {
        success: true,
        message: "New facility has been added successfully",
        facility: newFacility,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding a new facility");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while adding a new facility",
      );
    }
  }

  async bookFacility(data: BookFacility, facilityId: string) {
    try {
      const facility = await this.facilityRepository.findById(facilityId);
      if (!facility) throw new AppError(400, "Facility does not exist");

      if (facility.status === "Maintenance") {
        return {
          success: false,
          message: `${facility.facilityName} current status is under ${facility.status}`,
        };
      }

      const startTime = new Date(data.startTime);
      const today = normalizeDate(new Date());
      const normalizedStart = normalizeDate(startTime);
      if (normalizedStart < today) {
        throw new Error("You cannot book a facility in the past");
      }

      const booking = FacilityBookingFactory.bookFacility({
        eventName: data.eventName,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        facilityId: facility.id,
      });
      const newBooking = await this.facilityBookingRepository.save(booking);

      await this.facilityRepository.updateById(facility.id, {
        eventBookedFor: newBooking.eventName,
        eventTime: new Date(newBooking.startTime).toISOString().slice(11, 19),
      });

      return {
        success: true,
        message: `You have booked ${facility.facilityName} for ${newBooking.eventName} successfully`,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error booking a facility");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while booking a facility",
      );
    }
  }

  async getFacilityBookings(req: any) {
    const facilityId = req.params.facilityId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: facilityBookings, totalRecords } =
        await this.facilityBookingRepository.findAndCountAll(
          { facilityId },
          currentPage,
          pageSize,
        );

      if (facilityBookings.length === 0) {
        return {
          facilityBookings: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        facilityBookings,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all facility bookings" });
      throw new Error(
        "An unexpected error occurred while fetching all facility bookings.",
      );
    }
  }

  async getAllChurchFacilities(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchFacilities, totalRecords } =
        await this.facilityRepository.findAndCountAll(
          { churchId },
          currentPage,
          pageSize,
        );

      if (churchFacilities.length === 0) {
        return {
          churchFacilities: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchFacilities,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church facilities" });
      throw new Error(
        "An unexpected error occurred while fetching all church facilities.",
      );
    }
  }

  async putFacilityInMaintenanceStatus(facilityId: string) {
    try {
      const facility = await this.facilityRepository.findById(facilityId);
      if (!facility) throw new AppError(400, "Facility does not exist");

      await this.facilityRepository.updateById(facility.id, {
        status: "Maintenance",
        eventBookedFor: "Under maintenance",
      });

      return {
        success: true,
        message: `${facility.facilityName} is now in maintenance status`,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to put facicity in maintenance status",
      );
      throw new AppError(400, error.message);
    }
  }

  async editFacility(req: any) {
    try {
      const data = req.body;
      const facility = await this.facilityRepository.findById(
        req.params.facilityId,
      );
      if (!facility) throw new AppError(400, "Facility does not exist");

      await this.facilityRepository.updateById(facility.id, {
        facilityName: data.facilityName,
        facilityType: data.facilityType,
        capacity: data.capacity,
        location: data.location,
        features: data.features,
      });

      return {
        success: true,
        message: "Facility info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit facicity");
      throw new AppError(400, error.message);
    }
  }
}

export default FacilityService;
