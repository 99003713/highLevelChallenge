import { AsyncLocalStorage } from "async_hooks";
import { Locals } from "express";

export interface MyLocalVariablesSetDuringMiddlewares extends Locals {
  requestId: string;
  apiName?: string;
  /**
   * Use for adding common stuff to logger patient name
   */
  common?: Record<string, string>;
}

export const context: AsyncLocalStorage<MyLocalVariablesSetDuringMiddlewares> =
  new AsyncLocalStorage();

export const getRequestIdFromContext = () => {
  return context.getStore()?.requestId;
};

export const getApiNameFromContext = () => {
  return context.getStore()?.apiName;
};