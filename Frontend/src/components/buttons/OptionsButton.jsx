import React from "react";
import OptionsIcon from "../../assets/OptionsIcon.svg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function OptionsButton() {
    return (
        <Menu>
            <MenuButton
                className="h-6 min-w-6 p-1 flex justify-center items-center rounded-full hover:bg-glass hover:bg-opacity-20"
                // onClick={(e) => {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     onClick(e);
                // }}
                // onDoubleClick={(e) => {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     onDoubleClick(e);
                // }}
            >
                <img className="h-full" src={OptionsIcon} alt="Options Icon" />
            </MenuButton>
            <MenuItems anchor="bottom" className="bg-white p-2 rounded-lg">
                <MenuItem>
                    <div className="block data-[focus]:bg-blue-100">
                        Settings
                    </div>
                </MenuItem>
                <MenuItem>
                    <div className="block data-[focus]:bg-blue-100">
                        Settings
                    </div>
                </MenuItem>
                <MenuItem>
                    <div className="block data-[focus]:bg-blue-100">
                        Settings
                    </div>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}

export default OptionsButton;
