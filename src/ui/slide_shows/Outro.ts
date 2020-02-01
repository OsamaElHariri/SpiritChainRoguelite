import { SlideShowWithDialogConfig } from "./SlideShowWithDialog";

export const outro: SlideShowWithDialogConfig[] = [
    {
        backgroundImage: 'park_entrance_meeting',
        dialogs: [
            {
                dialogFace: 'player_dialog_face',
                dialogFaceOnTheRight: false,
                text: "There you go, All clear. Not a single evil spirit left",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Well done. You're a natural",
            },
        ],
    },
    {
        backgroundImage: 'park_manager_close_up',
        dialogs: [
            {
                dialogFace: 'park_manager_dialog_face',
                dialogFaceOnTheRight: false,
                text: "GREAT work! You guys are the best",
            },
        ],
    },
    {
        backgroundImage: 'park_entrance_meeting',
        dialogs: [
            {
                dialogFace: 'woman_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Just stay away from magic, alright?",
            },
            {
                dialogFace: 'park_manager_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Yea, don't worry about it",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: false,
                text: "We'll be going now. See you around, pal",
            },
            {
                dialogFace: 'park_manager_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Thanks, Ismail. See ya",
            },
        ],
    },
]