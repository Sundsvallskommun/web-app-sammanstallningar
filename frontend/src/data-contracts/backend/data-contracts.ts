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

export interface User {
  name: string;
  username: string;
}

export interface UserApiResponse {
  data: User;
  message: string;
}

export interface Input {
  file: object;
  uploadedToIntric: boolean;
}

export interface Session {
  id: string;
  state: SessionStateEnum;
  tokenCount: number;
  input: any[];
  stepExecutions: any[];
}

export interface CreateSessionRequest {
  flowId: string;
  version: number;
}

export interface StepExecution {
  startedAt: string;
  finishedAt: string;
  lastUpdatedAt: string;
  state: StepExecutionStateEnum;
  output: string;
  errorMessage: string;
}

export interface ChatRequest {
  input: string;
  runRequiredSteps: boolean;
}

export interface SimpleInput {
  value: string;
}

export interface Output {
  data: string;
}

export interface RenderRequest {
  templateId: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  inputPrefix: string;
  defaultTemplateId: string;
  input: FlowInput[];
  steps: Step[];
}

export interface FlowInput {
  id: string;
  name: string;
  description: string;
  type: FlowInputTypeEnum;
  passthrough: boolean;
  optional: boolean;
  multipleValued: boolean;
}

export interface IntricEndpoint {
  type: IntricEndpointTypeEnum;
  id: string;
}

export interface Step {
  id: string;
  order: number;
  name: string;
  description: string;
  input: FlowInput[];
}

export interface FlowSummary {
  id: string;
  name: string;
  version: number;
  description: string;
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
