import { IsBoolean, IsEnum, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  Input as InputType,
  Session as SessionType,
  StepExecution as StepExecutionType,
  RenderRequest as RenderRequestType,
  Flow as FlowType,
  FlowInput as FlowInputType,
  Step as StepType,
  FlowSummary as FlowSummaryType,
  CreateSessionRequest as CreateSessionRequestType,
  ChatRequest as ChatRequestType,
  SimpleInput as SimpleInputType,
  Output as OutputType,
  IntricEndpoint as IntricEndpointType,
} from '../data-contracts/aiflow/data-contracts';

export enum SessionStateEnum {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}

export enum StepExecutionStateEnum {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export enum FlowInputTypeEnum {
  STRING = 'STRING',
  TEXT = 'TEXT',
  FILE = 'FILE',
}

export enum FlowInputCardinalityEnum {
  SINGLE_VALUED = 'SINGLE_VALUED',
  MULTIPLE_VALUED = 'MULTIPLE_VALUED',
}

export class Input implements InputType {
  @IsObject()
  file?: File;
  @IsBoolean()
  uploadedToIntric?: boolean;
}

export class Session implements SessionType {
  @IsString()
  id?: string;
  @IsEnum(SessionStateEnum)
  state?: SessionStateEnum;
  @IsNumber()
  tokenCount?: number;
  @ValidateNested({ each: true })
  input?: Record<string, Input[]>;
  @ValidateNested({ each: true })
  stepExecutions?: Record<string, StepExecution>;
}

export class CreateSessionRequest implements CreateSessionRequestType {
  @IsString()
  flowId: string;
  @IsNumber()
  version?: number;
}

export class StepExecution implements StepExecutionType {
  @IsString()
  startedAt?: string;
  @IsString()
  finishedAt?: string;
  @IsString()
  lastUpdatedAt?: string;
  @IsEnum(StepExecutionStateEnum)
  state?: StepExecutionStateEnum;
  @IsString()
  output?: string;
  @IsString()
  errorMessage?: string;
}

export class ChatRequest implements ChatRequestType {
  @IsString()
  input: string;
  @IsBoolean()
  runRequiredSteps?: boolean;
}

export class SimpleInput implements SimpleInputType {
  @IsString()
  value: string;
}

export class Output implements OutputType {
  @IsString()
  data?: string;
}

export class RenderRequest implements RenderRequestType {
  @IsString()
  templateId?: string;
}

export class Flow implements FlowType {
  @IsString()
  id?: string;
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @IsString()
  inputPrefix?: string;
  @IsString()
  defaultTemplateId?: string;
  @ValidateNested({ each: true })
  @Type(() => FlowInput)
  input?: FlowInput[];
  @ValidateNested({ each: true })
  @Type(() => Step)
  steps?: Step[];
}

export class FlowInput implements FlowInputType {
  @IsString()
  id?: string;
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @IsEnum(FlowInputTypeEnum)
  type?: FlowInputTypeEnum;
  @IsBoolean()
  passthrough?: boolean;
  @IsBoolean()
  optional?: boolean;
  @IsBoolean()
  multipleValued?: boolean;
}

export enum IntricEndpointTypeEnum {
  SERVICE = 'SERVICE',
  ASSISTANT = 'ASSISTANT',
}

export class IntricEndpoint implements IntricEndpointType {
  @IsEnum(IntricEndpointTypeEnum)
  type?: IntricEndpointTypeEnum;
  @IsString()
  id?: string;
}

export class Step implements StepType {
  @IsString()
  id?: string;
  @IsNumber()
  order?: number;
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @Type(() => IntricEndpoint)
  intricEndpoint?: IntricEndpoint;
  @ValidateNested({ each: true })
  @Type(() => FlowInput)
  input?: FlowInput[];
}

export class FlowSummary implements FlowSummaryType {
  @IsString()
  id?: string;
  @IsString()
  name?: string;
  @IsNumber()
  version?: number;
  @IsString()
  description?: string;
}
