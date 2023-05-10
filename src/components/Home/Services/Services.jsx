import React from "react";
import service1 from "../../../assets/images/services/1.jpg";
import service2 from "../../../assets/images/services/2.jpg";
import service3 from "../../../assets/images/services/3.jpg";
import service4 from "../../../assets/images/services/4.jpg";
import service5 from "../../../assets/images/services/5.jpg";
import service6 from "../../../assets/images/services/6.jpg";
import SectionTitle from "../../Shared/SectionTitle/SectionTitle";
import ServiceCard from "./ServiceCard";
const Services = () => {
  return (
    <div className="mt-40 mb-20">
      <SectionTitle section="Service" title="Our Service Area" />
      <div className="grid grid-cols-3 mt-10 gap-6">
        <ServiceCard image={service1} title="Electrical System" />
        <ServiceCard image={service2} title="Engine Diagnostics" />
        <ServiceCard image={service3} title="Auto Car Repair" />
        <ServiceCard image={service4} title="Electrical System" />
        <ServiceCard image={service5} title="Engine Diagnostics" />
        <ServiceCard image={service6} title="Auto Car Repair" />
      </div>
      <div className="mx-auto w-52 mt-12">
        <button className="myOutline-btn ">More Service</button>
      </div>
    </div>
  );
};

export default Services;
