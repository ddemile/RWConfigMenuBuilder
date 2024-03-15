import populateElement from "./populateElement.ts";

export const modTitleElement = populateElement({
    type: "OpLabel",
    name: "ModTitle",
    description: "Just the title of the mod",
    color: "#a9a4b2",
    x: 20,
    y: 30,
    height: 50,
    width: 560,
    locked: {
        position: true,
        transform: true
    },
    options: {
        text: "Your Mod Name",
        alignment: "Center",
        bigText: true,
        title: true,
        hidden: true
    },
    hidden: true,
    title: true
})