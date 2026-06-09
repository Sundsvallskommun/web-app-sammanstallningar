import ApiService from '@services/api.service';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { Flow, FlowSummary } from '@/responses/flow.response';
import { MUNICIPALITY_ID } from '@/config';
import authMiddleware from '@middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';

interface ResponseData<T> {
  data: T;
  message: string;
}

@Controller()
export class FlowController {
  private apiService = new ApiService();
  private baseUrl = `aiflow/2.0/${MUNICIPALITY_ID}`;

  @Get('/flow')
  @OpenAPI({ summary: 'Fetch all flows' })
  @ResponseSchema(FlowSummary)
  @UseBefore(authMiddleware)
  async fetchFlows(@Req() req: RequestWithUser): Promise<ResponseData<FlowSummary>> {
    const url = `${this.baseUrl}/flow`;
    const res = await this.apiService.get<FlowSummary>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Get('/flow/:flowName/:version')
  @OpenAPI({ summary: 'Fetch flow' })
  @ResponseSchema(Flow)
  @UseBefore(authMiddleware)
  async fetchFlow(@Req() req: RequestWithUser, @Param('flowName') flowName: string, @Param('version') version: string): Promise<ResponseData<Flow>> {
    const url = `${this.baseUrl}/flow/${flowName}/${version}`;
    try {
      const res = await this.apiService.get<Flow>({ url }, req.user);
      if (res.data) {
        return { data: res.data, message: 'success' };
      } else {
        throw new HttpException(404, 'Not found');
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(404, 'Not found');
    }
  }
}
