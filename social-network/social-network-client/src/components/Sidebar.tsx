import { Button, Divider } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdAdd, MdAddCircle, MdAddCircleOutline, MdDashboard, MdHomeFilled } from "react-icons/md";
import { MdCategory } from "react-icons/md";

import { IoAddCircleSharp, IoLogOutOutline, IoSettings } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { BsFilePersonFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import Logout from "./Buttons/Logout";
import LogoutBtn from "./Buttons/Logout";


const Sidebar = () => {
  const router = useRouter();
  const menuItems = [
    { 
      path: "/", 
      name: "Home", 
      icon: <MdHomeFilled size={20} /> 
    },
    {
      path: "/create",
      name: "Create Post",
      icon: <MdAddCircleOutline size={20} />,
    },
    {
      path: "/profile",
      name: "My Profile",
      icon: <CgProfile size={20} />,
    },
  ];
  return (
    <>
      <aside className="md:w-[15%] hidden md:block fixed h-screen bg-white">
        <div className="flex p-6 pt-8 flex-col gap-6">
          <p className="text-3xl font-bold text-slate-600">AlteraX</p>
          <Divider />
          <div className="flex flex-col gap-3 h-[80dvh]">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                href={item.path}
                as={Link}
                className={`${
                  item.path === router.pathname
                    ? "bg-primary font-bold text-base text-white tracking-widest"
                    : "bg-transparent hover:bg-primary-200 text-base tracking-widest hover:text-white"
                } flex items-center justify-start gap-2`}
                variant="flat"
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
            <div className="w-full mt-auto">
                <LogoutBtn/>
            </div>
          </div>
        </div>
      </aside>
      <div className="fixed z-50 w-full bg-white p-3 bottom-0 md:hidden flex justify-between items-center">
        {menuItems.map((item) => (
          <Button
            isIconOnly
            key={item.name}
            href={item.path}
            as={Link}
            className={`${
              item.path === router.pathname
                ? "bg-primary font-bold text-base text-white tracking-widest"
                : "bg-transparent hover:bg-primary-200 text-base tracking-widest hover:text-white"
            } flex items-center justify-center gap-2 `}
            variant="flat"
          >
            {item.icon}
          </Button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
