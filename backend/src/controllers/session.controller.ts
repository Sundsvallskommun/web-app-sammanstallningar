import ApiService from '@services/api.service';
import { Body, Controller, Get, Param, Post, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { Input, Session, StepExecution } from '@/data-contracts/aiflow/data-contracts';
import { MUNICIPALITY_ID } from '@config';
import { RenderRequest } from '@/responses/flow.response';
import ApiResponse from '@interfaces/api-service.interface';

interface ResponseData<T> {
  data: T;
  message: string;
}

@Controller()
export class SessionController {
  private apiService = new ApiService();
  private baseUrl = `aiflow/2.0/${MUNICIPALITY_ID}`;

  @Post('/session/:flowName/:version')
  @OpenAPI({ summary: 'Create a session' })
  // @UseBefore(authMiddleware)
  async createSession(
    @Req() req: RequestWithUser,
    @Res() response: Session,
    @Param('flowName') flowName: string,
    @Param('version') version: number,
  ): Promise<ResponseData<Session>> {
    const url = `${this.baseUrl}/session/${flowName}/${version}`;
    const res = await this.apiService.post<Session>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Get('/session/:sessionId')
  @OpenAPI({ summary: 'Fetch session' })
  // @UseBefore(authMiddleware)
  async fetchSession(@Req() req: RequestWithUser, @Res() response: Session, @Param('sessionId') sessionId: string): Promise<ResponseData<Session>> {
    const url = `${this.baseUrl}/session/${sessionId}`;
    const res = await this.apiService.get<Session>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Post('/session/:sessionId')
  @OpenAPI({ summary: 'Add session input' })
  // @UseBefore(authMiddleware)
  async addSessionInput(@Req() req: RequestWithUser, @Param('sessionId') sessionId: string, @Body() data: Input): Promise<ResponseData<Session>> {
    const url = `${this.baseUrl}/session/${sessionId}`;
    const res = await this.apiService.post<Session>({ url, data }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Post('/session/run/:sessionId/:stepId')
  @OpenAPI({ summary: 'Run a step in a session' })
  // @UseBefore(authMiddleware)
  async runStep(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Param('stepId') stepId: string,
  ): Promise<ResponseData<StepExecution>> {
    const url = `${this.baseUrl}/session/run/${sessionId}/${stepId}`;
    const res = await this.apiService.post<StepExecution>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Get('/session/:sessionId/:stepId')
  @OpenAPI({ summary: 'Get a step execution' })
  // @UseBefore(authMiddleware)
  async getStepExecution(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Param('stepId') stepId: string,
  ): Promise<ResponseData<StepExecution>> {
    const url = `${this.baseUrl}/session/${sessionId}/${stepId}`;
    const res = await this.apiService.get<StepExecution>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Post('/session/generate/:sessionId/generate')
  @OpenAPI({ summary: 'Generate document' })
  // @UseBefore(authMiddleware)
  async generateDocument(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Body() data: RenderRequest,
  ): Promise<ResponseData<string>> {
    const url = `${this.baseUrl}/session/${sessionId}/generate`;
    const res = await this.apiService.post<ApiResponse<string>>({ url, data }, req.user);
    return { data: res.data.data, message: 'success' };
  }
}
