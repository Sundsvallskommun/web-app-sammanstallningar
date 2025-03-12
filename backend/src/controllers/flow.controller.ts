import ApiService from '@services/api.service';
import { Controller, Get, Param, Req, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { Flow, Flows } from '@/responses/flow.response';
import { MUNICIPALITY_ID } from '@/config';

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
  @ResponseSchema(Flows)
  // @UseBefore(authMiddleware)
  async fetchFlows(@Req() req: RequestWithUser, @Res() response: Flows): Promise<ResponseData<Flows>> {
    const url = `${this.baseUrl}/flow`;
    const res = await this.apiService.get<Flows>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Get('/flow/:flowName/:version')
  @OpenAPI({ summary: 'Fetch flow' })
  @ResponseSchema(Flow)
  // @UseBefore(authMiddleware)
  async fetchFlow(
    @Req() req: RequestWithUser,
    @Res() response: Flow,
    @Param('flowName') flowName: string,
    @Param('version') version: string,
  ): Promise<ResponseData<Flow>> {
    const url = `${this.baseUrl}/flow/${flowName}/${version}`;
    const res = await this.apiService.get<Flow>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }
}
