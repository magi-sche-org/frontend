import { services } from "@/components/login/services";
import Image from "next/image";

import Styles from "./login.module.scss";
import { AuthorizationService } from "@/@types/authorization";
import { API_ENDPOINT, CALLBACK_URL_KEY } from "@/libraries/env";

type props = {
  onClose: () => void;
};

const Login = ({ onClose }: props) => {
  const onClick = (service: AuthorizationService) => {
    localStorage.setItem(CALLBACK_URL_KEY, location.pathname);
    location.href = `${API_ENDPOINT}/oauth2/${service.id}`;
  };
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.background} onClick={onClose}></div>
      <div className={Styles.container}>
        <h1>Login</h1>
        <div className={Styles.services}>
          {services.map((service) => (
            <button
              key={service.id}
              className={Styles.button}
              onClick={() => onClick(service)}
            >
              <Image
                className={Styles.icon}
                alt={service.name}
                src={service.icon}
                width={24}
                height={24}
              />
              <span className={Styles.name}>{service.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Login };
