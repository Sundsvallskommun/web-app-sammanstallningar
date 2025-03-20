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

export interface CreateSessionRequest {
  /**
   * Flow id
   * @example "tjansteskrivelse"
   */
  flowId: string;
  /**
   * Flow version
   * @format int32
   * @example 1
   */
  version?: number;
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

export interface Input {
  /** @format binary */
  file?: File;
  uploadedToIntric?: boolean;
}

export interface Session {
  /** @format uuid */
  id?: string;
  input?: Record<string, Input[]>;
  stepExecutions?: Record<string, StepExecution>;
  state?: SessionStateEnum;
}

export interface StepExecution {
  state?: StepExecutionStateEnum;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  lastUpdatedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  output?: string;
  errorMessage?: string;
}

export interface ChatRequest {
  /** The input */
  input: string;
  /**
   * Whether to run/re-run required steps
   * @default false
   */
  runRequiredSteps?: boolean;
}

export interface SimpleInput {
  /** The input value */
  value: string;
}

export interface RenderRequest {
  /** The template id to use for rendering the session */
  templateId?: string;
}

export interface Output {
  /** The BASE64-encoded (binary) data */
  data?: string;
}

export interface Flow {
  id?: string;
  /** @format int32 */
  version?: number;
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
  optional?: boolean;
  multipleValued?: boolean;
  passthrough?: boolean;
}

export interface IntricEndpoint {
  type?: IntricEndpointTypeEnum;
  /** @format uuid */
  id?: string;
}

export interface Step {
  id?: string;
  /** @format int32 */
  order?: number;
  name?: string;
  description?: string;
  intricEndpoint?: IntricEndpoint;
  input?: FlowInput[];
}

export interface FlowSummary {
  /** The flow id */
  id?: string;
  /**
   * The flow version
   * @format int32
   */
  version?: number;
  /** The flow name */
  name?: string;
  /** The flow description */
  description?: string;
}

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

export enum IntricEndpointTypeEnum {
  SERVICE = 'SERVICE',
  ASSISTANT = 'ASSISTANT',
}
