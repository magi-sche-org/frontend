import { services } from "@/components/login/services";
import Image from "next/image";

import Styles from "./login.module.scss";

const Login = () => {
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        <h1>Login</h1>
        <div className={Styles.services}>
          {services.map((service) => (
            <button key={service.id} className={Styles.button}>
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
