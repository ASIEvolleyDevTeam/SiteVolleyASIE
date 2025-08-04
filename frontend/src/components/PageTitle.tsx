import React from 'react';

type Props = {
  children: React.ReactNode;
};

const PageTitle = ({ children }: Props) => (
  <h1 className="badge badge-xl m-4 p-6 text-2xl font-bold shadow-lg">
    {children}
  </h1>
);

export default PageTitle;
