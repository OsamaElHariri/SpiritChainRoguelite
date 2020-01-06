import { World } from "../../world/World";
import { ChatScene } from "../../scenes/ChatScene";
import { NumberUtils } from "../../utils/NumberUtils";
import { ChatMessage } from "./ChatMessage";
import { ChatContacts } from "./ChatContacts";

export class ChatScreen extends Phaser.GameObjects.Container {

    private chatContactsPanel: Phaser.GameObjects.Container;
    private chatArea: Phaser.GameObjects.Container;
    private selectedContact: string;

    constructor(public scene: ChatScene, x: number, y: number, private world: World, initialMessage?: ChatMessage) {
        super(scene, x, y);
        scene.add.existing(this);
        this.chatContactsPanel = this.scene.add.container(0, 120);
        this.chatArea = this.scene.add.container(240, 100);

        if (initialMessage) {
            this.selectedContact = initialMessage.sender;
        }

        this.refresh();
    }

    private refresh() {
        this.constructChatArea();
        this.constructChatContactsPanel();
    }

    private constructChatContactsPanel() {
        this.chatContactsPanel.removeAll(true);
        const text = this.scene.add.text(4, 0, "Chats", {
            color: '#398547',
            fontSize: '32px',
        });
        this.chatContactsPanel.add(text);




        const contacts = Object.keys(this.world.player.chats);
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const chatContact = this.constructChatContact(0, 72 + i * 60, contact);
            this.chatContactsPanel.add(chatContact);

        }
    }

    private constructChatContact(x: number, y: number, contact: string) {
        const contactContainer = this.scene.add.container(x, y);
        const isSelected = contact == this.selectedContact;
        if (isSelected) {
            const selectedRectangle = this.scene.add.rectangle(0, 0, 240, 52, 0x398547).setOrigin(0);
            contactContainer.add(selectedRectangle);
        }

        const text = this.scene.add.text(8, 12, contact, {
            color: isSelected ? '#fff' : '#4a4a4a',
            fontSize: '24px',
        });
        contactContainer.add(text);


        const hoverRectangle = this.scene.add.rectangle(0, 0, 240, 52, 0).setAlpha(0).setOrigin(0);
        contactContainer.add(hoverRectangle);
        const clickZone = this.scene.add.zone(0, 0, 240, 52).setOrigin(0).setInteractive({ cursor: 'pointer' });
        clickZone.on('pointerdown', () => {
            this.selectedContact = contact;
            this.refresh();
        });
        contactContainer.add(clickZone);

        clickZone.on('pointerover', (pointer) => hoverRectangle.setAlpha(0.05));
        clickZone.on('pointerout', (pointer) => hoverRectangle.setAlpha(0));

        return contactContainer
    }

    private constructChatArea() {
        const chat = this.world.player.chats[this.selectedContact] || [];
        this.chatArea.removeAll(true);
        const background = this.scene.add.rectangle(0, 0, 800, 600, 0xfafafa).setOrigin(0);

        this.chatArea.add(background);
        const chatContainer = this.scene.add.container(10, 400);
        let chatHeight = 0;
        const chatWidth = 240;
        const boxPadding = 12;
        const boxMargin = 8;
        for (let i = chat.length - 1; i >= 0; i--) {
            const message = chat[i];
            const isSender = message.sender == ChatContacts.Me;
            const xChat = isSender ? chatWidth + 40 : 0;
            const text = this.scene.add.text(boxPadding + xChat, chatHeight - boxPadding, message.text, {
                color: '#4a4a4a',
                fontSize: '22px',
                wordWrap: { width: chatWidth, useAdvancedWrap: true },
            }).setOrigin(0, 1);
            const background = this.scene.add.rectangle(xChat, chatHeight, text.width + 2 * boxPadding, text.height + 2 * boxPadding, isSender ? 0xaafafa : 0x9aea9a).setOrigin(0, 1);
            chatContainer.add([background, text]);
            chatHeight -= background.height + boxMargin;
        }
        this.chatArea.add(chatContainer);
        const yYnitial = chatContainer.y;
        const diff = Math.max(Math.abs(chatHeight) - yYnitial, 0);
        background.setInteractive();
        background.on('wheel', (pointer) => {
            chatContainer.y = NumberUtils.clamp(chatContainer.y - pointer.deltaY * 20, 400, 400 + diff);
        });
    }

    destroy() {
        this.chatArea.destroy();
        this.chatContactsPanel.destroy();
        super.destroy();
    }
}