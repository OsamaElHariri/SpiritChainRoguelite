import { SlideShowWithDialogConfig } from "./SlideShowWithDialog";

export const introLoop: SlideShowWithDialogConfig[] = [
    {
        backgroundImage: 'player_close_up',
        dialogs: [
            {
                dialogFace: 'player_dialog_face',
                dialogFaceOnTheRight: false,
                text: "(This tutorial is super helpful)",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Hey, are you ready?",
            },
            {
                dialogFace: 'player_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Yup, I'm ready to go",
            },
        ]
    }
]