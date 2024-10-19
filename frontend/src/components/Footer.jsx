// import React from 'react'
import { assets } from "../assets/assets";
const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          {/* let section */}

          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae
            ab beatae provident! Laborum odit ex voluptates magnam dicta dolorem
            quam iusto id, corporis molestias culpa veniam sunt quia sed
            ducimus.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
          {/* center section */}
        </div>

        <div>
          {/* Right section */}

          <p className="text-xl font-medium mb-5">GET IN TOUNCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* copyright text */}
      <div className="div">
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2024@ Precripto-All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;