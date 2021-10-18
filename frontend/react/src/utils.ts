/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Page } from "@bloomreach/spa-sdk";

interface ChannelMetaData {
  channel?: {
    info: {
      props: {
        graphqlServiceUrl: string;
        defaultConnector?: string;
        defaultSMConnector?: string;
        smViewId?: string;
      }
    }
  }
}

const SM_VIEW_ID_ITEM_NAME = 'smViewId';
const SESSION_CART = 'cartId';

export function getDefaultConnector(page: Page): string {
  // TODO: use spa-sdk instead of manually casting when CMS-13627 completed
  return sessionStorage.getItem('default-connector') ?? (page.toJSON() as ChannelMetaData).channel?.info.props.defaultConnector ?? '';
}

export function getDefaultSMConnector(page: Page): string {
  // TODO: use spa-sdk instead of manually casting when CMS-13627 completed
  return (page.toJSON() as ChannelMetaData).channel?.info.props.defaultSMConnector ?? 'brsm';
}

export function getDefaultSMViewId(page: Page): string | undefined {
  // TODO: use spa-sdk instead of manually casting when CMS-13627 completed
  return (page.toJSON() as ChannelMetaData).channel?.info.props.smViewId;
}

export function getConnector(page: Page): string | undefined {
  const useBrsm = process.env.REACT_APP_USE_BRSM === 'true';
  return useBrsm ? getDefaultSMConnector(page) : (page.toJSON() as ChannelMetaData).channel?.info.props.defaultConnector;
}

export function getSmViewId(page: Page): string | undefined {
  const defaultSmViewId = getDefaultSMViewId(page);
  return sessionStorage.getItem(SM_VIEW_ID_ITEM_NAME) ?? defaultSmViewId;
}

export function setPreferredSmViewId(smViewId: string | undefined): void {
  if (smViewId) {
    sessionStorage.setItem(SM_VIEW_ID_ITEM_NAME, smViewId);
  } else {
    sessionStorage.removeItem(SM_VIEW_ID_ITEM_NAME);
  }
}

export function setCartIdInSession(cartId: string | undefined): void {
  if (cartId) {
    sessionStorage.setItem(SESSION_CART, cartId);
  } else {
    sessionStorage.removeItem(SESSION_CART);
  }
}

export function getCartIdFromSession(): string | undefined {
  return sessionStorage.getItem(SESSION_CART) ?? undefined;
}

export function getGraphqlServiceUrl(page: Page): string {
  // TODO: use spa-sdk instead of manually casting when CMS-13627 completed
  return (page.toJSON() as ChannelMetaData).channel?.info.props.graphqlServiceUrl ?? '';
}

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

export function convertDateToLocalTimezone(date: Date) {
  return new Date(date.getTime() + timezoneOffset);
}

export function convertDateToUTCTimezone(date: Date) {
  return new Date(date.getTime() - timezoneOffset);
}
