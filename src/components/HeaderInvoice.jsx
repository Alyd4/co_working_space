import React from 'react';

const HeaderInvoice = ({ title}) => {
  return (
    <header className="flex justify-between items-center bg-white shadow p-4 rounded-t-lg">
      <h1 className="text-lg font-semibold text-blue-600">{title}</h1>
    </header>
  );
};

export default HeaderInvoice;
