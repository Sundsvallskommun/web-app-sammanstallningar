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
  inputId: string;
  value: string;
}

export interface Session {
  id: string;
  state: SessionStateEnum;
  tokenCount: number;
  input: any[];
  stepExecutions: any[];
}

export interface StepExecution {
  startedAt: string;
  finishedAt: string;
  state: StepExecutionStateEnum;
  output: string;
  errorMessage: string;
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
  cardinality: FlowInputCardinalityEnum;
  passthrough: boolean;
}

export interface Step {
  id: string;
  order: number;
  name: string;
  description: string;
  intricServiceId: string;
  input: Input[];
}

export interface FlowSummary {
  name: string;
  version: number;
}

export interface Flows {
  flows: FlowSummary[];
}

export interface FlowResponse {
  name: string;
  version: number;
  content: string;
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
