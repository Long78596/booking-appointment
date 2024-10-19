// import React from 'react'
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
const SpecialityMenu = () => {
  return (
    <div id="speciality" className="flex flex-col items-center gap-4 py-16 text-gray-800">
      <h1 className="text-3xl font-medium ">Find By Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum vero
        repellat neque iusto ex sit perspiciatis, vel, excepturi molestiae
        voluptates culpa autem? Temporibus nihil minus, incidunt similique eum
        fugit? Illum.
      </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {specialityData.map((item, index) => (
          <Link onClick={()=>scrollTo(0,0)}  className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" key={index} to={`/doctors/${item.speciality}`}>
            <img className="w-16 sm:w-25 mb-2" src={item.image} alt="" />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SpecialityMenu