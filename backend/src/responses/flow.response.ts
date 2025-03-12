import { IsBoolean, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
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
  Flows as FlowsType,
  FlowResponse as FlowResponseType,
} from '../data-contracts/aiflow/data-contracts';

export enum SessionStateEnum {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}

export enum StepExecutionStateEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export enum FlowInputTypeEnum {
  STRING = 'STRING',
  TEXT = 'TEXT',
  DOCUMENT = 'DOCUMENT',
}

export enum FlowInputCardinalityEnum {
  SINGLE_VALUED = 'SINGLE_VALUED',
  MULTIPLE_VALUED = 'MULTIPLE_VALUED',
}

export class Input implements InputType {
  @IsString()
  inputId: string;
  @IsString()
  value: string;
}

export class Session implements SessionType {
  @IsString()
  id?: string;
  @IsEnum(SessionStateEnum)
  state?: SessionStateEnum;
  @IsNumber()
  tokenCount?: number;
  @ValidateNested({ each: true })
  input?: Record<string, string[]>;
  @ValidateNested({ each: true })
  stepExecutions?: Record<string, StepExecution>;
}

export class StepExecution implements StepExecutionType {
  @IsString()
  startedAt?: string;
  @IsString()
  finishedAt?: string;
  @IsEnum(StepExecutionStateEnum)
  state?: StepExecutionStateEnum;
  @IsString()
  output?: string;
  @IsString()
  errorMessage?: string;
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
  @IsEnum(FlowInputCardinalityEnum)
  cardinality?: FlowInputCardinalityEnum;
  @IsBoolean()
  passthrough?: boolean;
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
  @IsString()
  intricServiceId?: string;
  @ValidateNested({ each: true })
  @Type(() => Input)
  input?: Input[];
}

export class FlowSummary implements FlowSummaryType {
  @IsString()
  name?: string;
  @IsNumber()
  version?: number;
}

export class Flows implements FlowsType {
  @ValidateNested({ each: true })
  @Type(() => FlowSummary)
  flows?: FlowSummary[];
}

export class FlowResponse implements FlowResponseType {
  @IsString()
  name?: string;
  @IsNumber()
  version?: number;
  @IsString()
  content?: string;
}
