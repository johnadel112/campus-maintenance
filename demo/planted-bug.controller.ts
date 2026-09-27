import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MaintenanceRequest } from "../apps/api/src/requests/schemas/maintenance-request.schema";

@Controller("requests")
export class PlantedBugController {
  constructor(
    @InjectModel(MaintenanceRequest.name)
    private readonly requestModel: Model<MaintenanceRequest>,
  ) {}

  @Post()
  async create(@Body() body: any) {
    return this.requestModel.create({
      ...body,
      status: body.status || "open",
    });
  }

  @Get()
  async list(@Query("category") category?: string) {
    if (category) return this.requestModel.find({ category }).exec();
    return this.requestModel.find().exec();
  }
}

/*
ANSWER KEY — open after the class review

1. Controller accesses Mongoose directly instead of using a service.
2. Body uses `any` instead of a validated CreateRequestDto.
3. Arbitrary client properties can be accepted.
4. Client can influence status; spec says backend controls it.
5. Create category is not validated.
6. Required title/description/location/category validation is absent.
7. Query category accepts unsupported values.
8. Swagger contract decorators are absent.
9. The schema import may not exist yet; keep this exercise in demo/.
*/
