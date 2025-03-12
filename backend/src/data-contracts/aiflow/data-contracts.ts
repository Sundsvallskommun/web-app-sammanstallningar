/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Problem {
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
  title?: string;
  detail?: string;
}

export interface StatusType {
  /** @format int32 */
  statusCode?: number;
  reasonPhrase?: string;
}

export interface Input {
  /** The input id */
  inputId: string;
  /**
   * The value (BASE64-encoded)
   * @format byte
   */
  value: string;
}

export interface ConstraintViolationProblem {
  cause?: ThrowableProblem;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  /** @format uri */
  type?: string;
  status?: StatusType;
  violations?: Violation[];
  title?: string;
  message?: string;
  /** @format uri */
  instance?: string;
  parameters?: Record<string, object>;
  detail?: string;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface ThrowableProblem {
  cause?: ThrowableProblem;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  message?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
  title?: string;
  detail?: string;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface Violation {
  field?: string;
  message?: string;
}

export interface Session {
  /** @format uuid */
  id?: string;
  state?: SessionStateEnum;
  /** @format int32 */
  tokenCount?: number;
  input?: Record<string, string[]>;
  stepExecutions?: Record<string, StepExecution>;
}

export interface StepExecution {
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  state?: StepExecutionStateEnum;
  output?: string;
  errorMessage?: string;
}

export interface RenderRequest {
  /** The template id to use for rendering the session */
  templateId?: string;
}

export interface Flow {
  id?: string;
  name?: string;
  description?: string;
  inputPrefix?: string;
  defaultTemplateId?: string;
  input?: FlowInput[];
  steps?: Step[];
}

export interface FlowInput {
  id?: string;
  name?: string;
  description?: string;
  type?: FlowInputTypeEnum;
  cardinality?: FlowInputCardinalityEnum;
  passthrough?: boolean;
}

export interface Step {
  id?: string;
  /** @format int32 */
  order?: number;
  name?: string;
  description?: string;
  intricServiceId?: string;
  input?: Input[];
}

export interface FlowSummary {
  /** The flow name */
  name?: string;
  /**
   * The flow version
   * @format int32
   */
  version?: number;
}

export interface Flows {
  flows?: FlowSummary[];
}

export interface FlowResponse {
  /** The flow name */
  name?: string;
  /**
   * The flow version
   * @format int32
   */
  version?: number;
  /** The flow content */
  content?: string;
}

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
