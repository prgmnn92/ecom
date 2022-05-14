import React from "react";
import { ImCancelCircle } from "react-icons/im";

const Canceled = () => {
  return (
    <div className="canceled">
      <div className="canceled-icon">
        <ImCancelCircle size="4rem" />
      </div>
      <h4 className="canceled-heading">Cancel</h4>
      <p>You canceled your order</p>
    </div>
  );
};

export default Canceled;
