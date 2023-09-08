import { FC } from "react";
import { Header } from "./Header";
import { SecondaryHeader } from "./SecondaryHeader";

type HeaderObj = {
  path: string;
  header: React.ReactNode;
};

const headerList: HeaderObj[] = [
  {
    path: "/create",
    header: <SecondaryHeader />,
  },
  {
    path: "/detail",
    header: <SecondaryHeader />,
  },
  {
    path: "/guest",
    header: <SecondaryHeader />,
  },
  {
    path: "/detail",
    header: <SecondaryHeader />,
  },
  {
    path: "/preview",
    header: <SecondaryHeader />,
  },
  {
    path: "/",
    header: <Header />,
  },
];

type Props = {
  path: string;
};

export const DistinguishHeader: FC<Props> = ({ path }) => {
  const distinguishHeader = () => {
    const headerObj = headerList.find((headerObj) => {
      console.log(path.indexOf(headerObj.path));
      return path.indexOf(headerObj.path) !== -1;
    });
    return headerObj?.header ?? <></>;
  };
  return distinguishHeader();
};
