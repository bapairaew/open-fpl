import { Fragment, ReactNode } from "react";

const BatchIcons = ({ icon, count }: { icon: ReactNode; count: number }) => {
  const icons = [];
  for (let i = 0; i < count; i++) {
    icons.push(<Fragment key={i}>{icon}</Fragment>);
  }
  return <>{icons}</>;
};

export default BatchIcons;
