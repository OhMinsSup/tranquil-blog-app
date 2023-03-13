/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SettingName =
  | "disableBeforeInput"
  | "measureTypingPerf"
  | "isRichText"
  | "isCollab"
  | "isCharLimit"
  | "isMaxLength"
  | "isCharLimitUtf8"
  | "isAutocomplete"
  | "showTreeView"
  | "showNestedEditorTreeView"
  | "emptyEditor"
  | "enableLinkPreviews"
  | "showTableOfContents";

export type Settings = Record<SettingName, boolean>;

const hostName = window.location.hostname;
export const isDevPlayground: boolean =
  hostName !== "playground.lexical.dev" &&
  hostName !== "lexical-playground.vercel.app";

export const DEFAULT_SETTINGS: Settings = {
  disableBeforeInput: false,
  emptyEditor: isDevPlayground,
  enableLinkPreviews: false,
  isAutocomplete: false,
  isCharLimit: false,
  isCharLimitUtf8: false,
  isCollab: false,
  isMaxLength: false,
  isRichText: true,
  measureTypingPerf: false,
  showNestedEditorTreeView: false,
  showTableOfContents: false,
  showTreeView: true,
};

type SettingsContextShape = {
  setOption: (name: SettingName, value: boolean) => void;
  settings: Record<SettingName, boolean>;
};

const Context: React.Context<SettingsContextShape> = createContext({
  setOption: (name: SettingName, value: boolean) => {
    return;
  },
  settings: DEFAULT_SETTINGS,
});

export const SettingsContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const setOption = useCallback((setting: SettingName, value: boolean) => {
    setSettings((options) => ({
      ...options,
      [setting as string]: value,
    }));
    if (DEFAULT_SETTINGS[setting] === value) {
      setURLParam(setting, null);
    } else {
      setURLParam(setting, value);
    }
  }, []);

  const contextValue = useMemo(() => {
    return { setOption, settings };
  }, [setOption, settings]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useSettings = (): SettingsContextShape => {
  return useContext(Context);
};

function setURLParam(param: SettingName, value: null | boolean) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  if (value !== null) {
    if (params.has(param)) {
      params.set(param, String(value));
    } else {
      params.append(param, String(value));
    }
  } else {
    if (params.has(param)) {
      params.delete(param);
    }
  }
  url.search = params.toString();
  window.history.pushState(null, "", url.toString());
}
