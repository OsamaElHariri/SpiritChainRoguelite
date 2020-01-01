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
                dialogFace: 'player_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Yup, I'm ready to go",
            },
        ]
    }
]