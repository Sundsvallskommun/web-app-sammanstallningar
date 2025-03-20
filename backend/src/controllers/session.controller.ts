import ApiService from '@services/api.service';
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { ChatRequest, CreateSessionRequest, Output, Session, SimpleInput, StepExecution } from '@/data-contracts/aiflow/data-contracts';
import { MUNICIPALITY_ID } from '@config';
import { RenderRequest } from '@/responses/flow.response';
const FormData = require('form-data');

interface ResponseData<T> {
  data: T;
  message: string;
}

@Controller()
export class SessionController {
  private apiService = new ApiService();
  private baseUrl = `aiflow/2.0/${MUNICIPALITY_ID}`;

  @Post('/session')
  @OpenAPI({ summary: 'Create a session' })
  // @UseBefore(authMiddleware)
  async createSession(@Req() req: RequestWithUser, @Res() response: Session, @Body() data: CreateSessionRequest): Promise<ResponseData<Session>> {
    const url = `${this.baseUrl}/session`;
    const res = await this.apiService.post<Session, CreateSessionRequest>({ url, data }, req.user);
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

  @Post('/session/:sessionId/input/:inputId/simple')
  @OpenAPI({ summary: 'Add session text input' })
  // @UseBefore(authMiddleware)
  async addSessionTextInput(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Param('inputId') inputId: string,
    @Body() data: SimpleInput,
  ): Promise<ResponseData<Session>> {
    const url = `${this.baseUrl}/session/${sessionId}/input/${inputId}/simple`;
    const res = await this.apiService.post<Session, SimpleInput>({ url, data }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Post('/session/:sessionId/input/:inputId/file')
  @OpenAPI({ summary: 'Add session file input' })
  // @UseBefore(authMiddleware)
  async addSessionFileInput(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @UploadedFiles('files') files: Express.Multer.File[],
    @Param('inputId') inputId: string,
  ): Promise<ResponseData<Session>> {
    const data = new FormData();
    data.append('file', files[0].buffer, { filename: files[0].originalname });

    const url = `${this.baseUrl}/session/${sessionId}/input/${inputId}/file`;
    const res = await this.apiService.post<Session, FormData>({ url, data, headers: { 'Content-Type': 'multipart/form-data' } }, req.user);

    return { data: res.data, message: 'success' };
  }

  @Post('/session/:sessionId')
  @OpenAPI({ summary: 'Run all steps in a session' })
  // @UseBefore(authMiddleware)
  async runAllSteps(@Req() req: RequestWithUser, @Param('sessionId') sessionId: string): Promise<ResponseData<number>> {
    const url = `${this.baseUrl}/session/${sessionId}`;
    const res = await this.apiService.post<number, null>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Post('/session/:sessionId/step/:stepId')
  @OpenAPI({ summary: 'Run a step in a session' })
  // @UseBefore(authMiddleware)
  async runStep(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Param('stepId') stepId: string,
    @Body() data: ChatRequest,
  ): Promise<ResponseData<number>> {
    const url = `${this.baseUrl}/session/${sessionId}/step/${stepId}`;
    const res = await this.apiService.post<number, ChatRequest>({ url, data }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Get('/session/:sessionId/step/:stepId')
  @OpenAPI({ summary: 'Get a step execution' })
  // @UseBefore(authMiddleware)
  async getStepExecution(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Param('stepId') stepId: string,
  ): Promise<ResponseData<StepExecution>> {
    const url = `${this.baseUrl}/session/${sessionId}/step/${stepId}`;
    const res = await this.apiService.get<StepExecution>({ url }, req.user);
    return { data: res.data, message: 'success' };
  }

  @Post('/session/:sessionId/generate')
  @OpenAPI({ summary: 'Generate document' })
  // @UseBefore(authMiddleware)
  async generateDocument(
    @Req() req: RequestWithUser,
    @Param('sessionId') sessionId: string,
    @Body() data: RenderRequest,
  ): Promise<ResponseData<Output>> {
    const url = `${this.baseUrl}/session/${sessionId}/generate`;
    const res = await this.apiService.post<Output, RenderRequest>({ url, data }, req.user);
    return { data: res.data, message: 'success' };
  }
}
