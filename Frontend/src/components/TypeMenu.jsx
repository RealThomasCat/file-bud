import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MainButton } from "./index.js";
import ImageIcon from "../assets/ImageIcon.svg";
import VideoIcon from "../assets/VideoIcon.svg";

function TypeMenu() {
    return (
        <Menu>
            <MenuButton>
                <MainButton title="Type" />
            </MenuButton>

            <MenuItems
                anchor="bottom"
                className="w-28 h-fit mt-2 text-textCol rounded-lg flex flex-col bg-glass bg-opacity-10 border border-borderCol border-opacity-15 backdrop-blur-sm py-2"
            >
                <MenuItem>
                    <button className="flex gap-2 items-center hover:bg-glass hover:bg-opacity-20 py-1 px-3 text-left">
                        <img
                            className="w-4 h-4 rounded-sm"
                            src={ImageIcon}
                            alt="Image Icon"
                        />

                        <h1>Images</h1>
                    </button>
                </MenuItem>

                <MenuItem>
                    <button className="flex gap-2 items-center hover:bg-glass hover:bg-opacity-20 py-1 px-3 text-left">
                        <img
                            className="w-4 h-4 rounded-sm"
                            src={VideoIcon}
                            alt="Image Icon"
                        />

                        <h1>Videos</h1>
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}

export default TypeMenu;
