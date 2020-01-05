import { World } from "../world/World";
import { ChatScene } from "../scenes/ChatScene";

export class ChatScreen extends Phaser.GameObjects.Container {

    private chatContactsPanel: Phaser.GameObjects.Container;
    private selectedContact: string;

    constructor(public scene: ChatScene, x: number, y: number, private world: World) {
        super(scene, x, y);
        scene.add.existing(this);
        this.chatContactsPanel = this.scene.add.container(0, 40);
        this.constructChatContactsPanel();
    }

    private constructChatContactsPanel() {
        this.chatContactsPanel.removeAll(true);
        const text = this.scene.add.text(4, 80, "Chats", {
            color: '#398547',
            fontSize: '32px',
        });
        this.chatContactsPanel.add(text);

        const contacts = ['Fiona Work', 'Ismail Work', '❤ Baby Cakes ❤', 'Crazy Park Guy', 'Mum'];
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const chatContact = this.constructChatContact(0, 140 + i * 60, contact);
            this.chatContactsPanel.add(chatContact);

        }
    }

    private constructChatContact(x: number, y: number, contact: string) {
        const contactContainer = this.scene.add.container(x, y);
        const isSelected = contact == this.selectedContact;
        if (isSelected) {
            const selectedRectangle = this.scene.add.rectangle(0, 0, 280, 52, 0x398547).setOrigin(0);
            contactContainer.add(selectedRectangle);
        }

        const text = this.scene.add.text(8, 12, contact, {
            color: isSelected ? '#fff' : '#4a4a4a',
            fontSize: '24px',
        });
        contactContainer.add(text);


        const hoverRectangle = this.scene.add.rectangle(0, 0, 280, 52, 0).setAlpha(0).setOrigin(0);
        contactContainer.add(hoverRectangle);
        const clickZone = this.scene.add.zone(0, 0, 280, 52).setOrigin(0).setInteractive({ cursor: 'pointer' });
        clickZone.on('pointerdown', () => {
            this.selectedContact = contact;
            this.constructChatContactsPanel();
        });
        contactContainer.add(clickZone);

        clickZone.on('pointerover', (pointer) => hoverRectangle.setAlpha(0.05));
        clickZone.on('pointerout', (pointer) => hoverRectangle.setAlpha(0));

        return contactContainer
    }
}