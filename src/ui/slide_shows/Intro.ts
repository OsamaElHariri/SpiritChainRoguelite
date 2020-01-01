import { SlideShowWithDialogConfig } from "./SlideShowWithDialog";

export const intro: SlideShowWithDialogConfig[] = [
    {
        backgroundImage: 'park_entrance',
        dialogs: [
            {
                dialogFace: 'woman_dialog_face',
                dialogFaceOnTheRight: false,
                text: "This is the third time he calls us this week...",
            },
            {
                dialogFace: 'player_dialog_face',
                dialogFaceOnTheRight: false,
                text: "That's a new record",
            },
            {
                dialogFace: 'woman_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Where is he anyways?",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: false,
                text: "There he is. Hey there, pal",
            },
        ]
    },
    {
        backgroundImage: 'park_manager_close_up',
        dialogs: [
            {
                dialogFace: 'park_manager_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Heyoooo! Thanks for comin' by, I've got a BIG emergency!",
            },
        ]
    },
    {
        backgroundImage: 'magic_set',
        dialogs: [
            {
                dialogFace: 'park_manager_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Some kids were playing with a magic set that turned out to be evil",
            },
            {
                dialogFace: 'woman_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Sigh, We know that story. You should tell us what really happened...",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Kids these days. Don't worry about it, we'll take care of it, old bud",
            },
        ]
    },
    {
        backgroundImage: 'park_entrance_meeting',
        dialogs: [
            {
                dialogFace: 'woman_dialog_face',
                dialogFaceOnTheRight: false,
                text: "You should be carful around these things",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: false,
                text: "This is going to be our intern's first banishment",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: false,
                text: "Give us the keys to your golf cart and we'll take care of this for you",
            },
            {
                dialogFace: 'park_manager_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Keys are on the seat",
            },
            {
                dialogFace: 'old_man_dialog_face',
                dialogFaceOnTheRight: true,
                text: "Are you ready?",
            },
        ]
    }
]