import { ChatContacts } from "./ChatContacts";

export class ChatMessage {
    sender: string;
    text: string;
    time: number;

    static getInitialChats() {
        const initialChats: { [sender: string]: ChatMessage[] } = {};

        initialChats[ChatContacts.Ismail] = [
            {
                sender: ChatContacts.Ismail,
                text: "Hello, please make sure to read the report summary for today's banishment before we head out.",
                time: 0,
            },
            {
                sender: ChatContacts.Ismail,
                text: "Even if you are going on your own, we will always be on standby just in case, so relax and just do your best.",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Thanks Ismail, I'll keep that in mind",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "And I read the report summary yesterday, so I'm prepared and ready to go",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Okay, great. See you at the office.",
                time: 0,
            },
        ];
        initialChats[ChatContacts.Linette] = [
            {
                sender: ChatContacts.Linette,
                text: "Good luck with ur first banishment 😘",
                time: 0,
            },
            {
                sender: ChatContacts.Linette,
                text: "whoop their 🍑",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Thanks 🧡, ofc I will ✌️",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "I'll tell you all abt it over dinner, we shd go to that Italian place you wanted to try",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "I'll pick u up from work as soon as I'm done",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "in?",
                time: 0,
            },
            {
                sender: ChatContacts.Linette,
                text: "Yea sounds gd babe",
                time: 0,
            },
        ];
        initialChats[ChatContacts.CrazyGeorge] = [];
        initialChats[ChatContacts.Mom] = [
            {
                sender: ChatContacts.Mom,
                text: "Good luck on your first day, sweetheart",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Its not my first day, mum :p",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Its the first banishment im gna do on my own",
                time: 0,
            },
            {
                sender: ChatContacts.Mom,
                text: "If you feel it's too dangerous, don't go there by yourself",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Ismail is pretty calm about it, he says the place we r going to doesnt have strong evil spirits",
                time: 0,
            },
            {
                sender: ChatContacts.Mom,
                text: "Just be careful sweetie. Call me if you need anything",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Dont worry, I'll be fine",
                time: 0,
            },
            {
                sender: ChatContacts.Mom,
                text: "I know you will",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "I'll let u know as soon as I'm done",
                time: 0,
            },
            {
                sender: ChatContacts.Mom,
                text: "Be safe",
                time: 0,
            },
        ];

        initialChats[ChatContacts.Fiona] = [
            {
                sender: ChatContacts.Fiona,
                text: "Hey, if youre gna pass by the bakery, get me a croissant on your way pls",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Perfect timing",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "I just got here",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Gna get one filled with cheese and chocolate, you want one?",
                time: 0,
            },
            {
                sender: ChatContacts.Fiona,
                text: "Sounds weird, I'll pass on that one. I'll just take a classic",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "Sure thing",
                time: 0,
            },
            {
                sender: ChatContacts.Me,
                text: "I'll be at the office in 10mins",
                time: 0,
            },
            {
                sender: ChatContacts.Fiona,
                text: "k 👍🏼",
                time: 0,
            },
        ];

        return initialChats;
    }

    constructor(sender: string, text: string, time?: number) {
        this.sender = sender;
        this.text = text;
        this.time = time || new Date().getTime();
    }
}