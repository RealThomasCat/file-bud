import React from "react";
import OptionsIcon from "../../assets/OptionsIcon.svg";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";

function OptionsButton({ type, file, folder, handleDownload, handleDelete }) {
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (secs < 10) {
            return `${hrs > 0 ? `${hrs}:` : "00:"}${mins > 0 ? `${mins}:` : "00:"}0${secs.toFixed(0)}`.trim();
        }

        return `${hrs > 0 ? `${hrs}:` : "00:"}${mins > 0 ? `${mins}:` : "00:"}${secs > 0 ? `${secs.toFixed(0)}` : "00"}`.trim();
    };

    return (
        <div
            onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Menu>
                <div>
                    <MenuButton className="h-6 min-w-6 p-1 flex justify-center items-center rounded-full hover:bg-glass hover:bg-opacity-20">
                        <img
                            className="h-full"
                            src={OptionsIcon}
                            alt="Options Icon"
                        />
                    </MenuButton>
                </div>
                <MenuItems
                    anchor="bottom start"
                    className="w-56 bg-glass py-2 rounded text-textCol flex flex-col gap-0 shadow-[0_0px_10px_0px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    {file && (
                        <MenuItem>
                            <button
                                onClick={handleDownload}
                                className="block text-left hover:bg-hoverCol px-3 py-1"
                            >
                                Download
                            </button>
                        </MenuItem>
                    )}
                    <MenuItem>
                        <button
                            onClick={handleDelete}
                            className="block text-left hover:bg-hoverCol px-3 py-1"
                        >
                            Delete
                        </button>
                    </MenuItem>
                    {type === "file" && (
                        <Disclosure>
                            <DisclosureButton className="block text-left hover:bg-hoverCol px-3 py-1">
                                Details
                            </DisclosureButton>
                            <DisclosurePanel className="block text-left text-sm font-light text-opacity-40 px-3 pt-3 pb-1 overflow-auto">
                                {file ? (
                                    <div className="flex flex-col gap-2">
                                        <p>Name: {file.title}</p>
                                        <p>Type: {file.resourceType}</p>
                                        <p>Format: {file.format}</p>
                                        <p>
                                            Size:{" "}
                                            {(
                                                file.size /
                                                (1024 * 1024)
                                            ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                        {file.duration && (
                                            <p>
                                                Duration:{" "}
                                                {formatDuration(file.duration)}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <h1>Loading...</h1>
                                )}
                            </DisclosurePanel>
                        </Disclosure>
                    )}
                </MenuItems>
            </Menu>
        </div>
    );
}

export default OptionsButton;
