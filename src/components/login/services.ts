//todo: バックエンドから取得するようにする

import { AuthorizationService } from "@/@types/authorization";

const services: AuthorizationService[] = [
  {
    id: "google",
    name: "Google",
    icon: "/images/google.svg",
  },
  {
    id: "microsoft",
    name: "Sign in with Microsoft",
    icon: "/images/microsoft.svg",
  },
];

export { services };
