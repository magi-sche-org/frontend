import { createContext } from "react";

import type { TSelectingDateContext } from "@/@types/selection";

export const SelectingDateContext = createContext<
  TSelectingDateContext | undefined
>(undefined);
