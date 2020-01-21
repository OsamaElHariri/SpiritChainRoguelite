import { World } from "../../world/World";
import { ChatScene } from "../../scenes/ChatScene";
import { NumberUtils } from "../../utils/NumberUtils";
import { ChatMessage } from "./ChatMessage";
import { ChatContacts } from "./ChatContacts";
import { Interval } from "../../utils/interval";

export class ChatScreen extends Phaser.GameObjects.Container {

    private chatHeader: Phaser.GameObjects.Container;
    private chatContactsPanel: Phaser.GameObjects.Container;
    private chatArea: Phaser.GameObjects.Container;
    private chatInput: Phaser.GameObjects.Container;
    private selectedContact: string;
    private screenHeader: Phaser.GameObjects.Rectangle;
    private chatInputDom: Phaser.GameObjects.DOMElement;

    constructor(public scene: ChatScene, x: number, y: number, private world: World, initialMessage?: ChatMessage) {
        super(scene, x, y);
        scene.add.existing(this);
        this.chatContactsPanel = this.scene.add.container(0, 36);
        this.chatArea = this.scene.add.container(240, 36);
        this.chatHeader = this.scene.add.container(240, 36);
        this.chatInput = this.scene.add.container(240, 450);

        if (initialMessage) {
            this.selectedContact = initialMessage.sender;
        } else {
            this.selectedContact = this.scene.data.get('contact');
        }

        if (!this.selectedContact) this.selectedContact = ChatContacts.Linette;
        this.scene.data.set('contact', this.selectedContact);

        this.constructHtmlTextInput();

        this.refresh();
    }

    private async constructHtmlTextInput() {
        await Interval.milliseconds(500);
        if (this.active) {
            this.chatInputDom = this.scene.add.dom(260, 470).createFromCache('text_input').setOrigin(0);
            this.scene.input.keyboard.on('keydown-ENTER', () => {
                this.sendChatMessage();
            });
        }
    }

    private sendChatMessage() {
        if (!this.selectedContact) return;
        const textInput: any = this.chatInputDom.getChildByID('text_input');
        if (textInput && textInput.value) {
            this.world.player.chats[this.selectedContact].push(new ChatMessage(ChatContacts.Me, textInput.value));
            textInput.value = "";
            this.refresh();
        }
    }

    private refresh() {
        this.constructChatHeader();
        this.constructChatArea();
        this.constructChatContactsPanel();
        this.constructScreenHeader();
        this.constructChatInput();
    }

    private constructChatHeader() {
        this.chatHeader.removeAll(true);
        const background = this.scene.add.rectangle(0, 0, 800, 80, 0xfefefe).setOrigin(0);
        const backgroundShadow = this.scene.add.rectangle(0, 4, 800, 80, 0, 0.1).setOrigin(0);
        const chatIcon = this.scene.add.sprite(48, 40, ChatContacts.icons()[this.selectedContact] || ChatContacts.defaultIcon);
        const name = this.scene.add.text(88, 40, this.selectedContact, {
            color: '#4a4a4a',
            fontSize: '22px',
        }).setOrigin(0, 0.5);
        this.chatHeader.add([backgroundShadow, background, chatIcon, name]);
    }

    private constructChatContactsPanel() {
        this.chatContactsPanel.removeAll(true);
        const background = this.scene.add.rectangle(0, 0, 240, 600, 0xf9f9f9).setOrigin(0);
        const text = this.scene.add.text(16, 12, "Chats", {
            color: '#398547',
            fontSize: '32px',
        });
        this.chatContactsPanel.add([background, text]);

        const contacts = Object.keys(this.world.player.chats);
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const chatContact = this.constructChatContact(12, 72 + i * 60, contact);
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
            this.scene.data.set('contact', this.selectedContact);
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
        const background = this.scene.add.rectangle(0, 0, 800, 600, 0xefefef).setOrigin(0);

        this.chatArea.add(background);
        const chatContainerHeight = 400;
        const chatContainer = this.scene.add.container(10, chatContainerHeight);
        let chatHeight = 0;
        const chatWidth = 240;
        const boxPadding = 12;
        const boxMargin = 8;
        for (let i = chat.length - 1; i >= 0; i--) {
            const message = chat[i];
            const isSender = message.sender == ChatContacts.Me;
            const xChat = isSender ? 2 * chatWidth + 40 : 0;
            const text = this.scene.add.text(xChat + boxPadding * (isSender ? -1 : 1), chatHeight - boxPadding, message.text, {
                color: '#4a4a4a',
                fontSize: '22px',
                wordWrap: { width: chatWidth, useAdvancedWrap: true },
            }).setOrigin(isSender ? 1 : 0, 1);
            const background = this.scene.add.rectangle(xChat, chatHeight, text.width + 2 * boxPadding, text.height + 2 * boxPadding, isSender ? 0xaafafa : 0x9aea9a).setOrigin(isSender ? 1 : 0, 1);
            chatContainer.add([background, text]);
            chatHeight -= background.height + boxMargin;
        }
        this.chatArea.add(chatContainer);
        const yYnitial = chatContainer.y;
        const diff = Math.max(Math.abs(chatHeight) - yYnitial, 0);
        background.setInteractive();
        background.on('wheel', (pointer) => {
            chatContainer.y = NumberUtils.clamp(chatContainer.y - pointer.deltaY * 20, chatContainerHeight, chatContainerHeight + diff + 100);
        });
    }

    private constructScreenHeader() {
        if (this.screenHeader) this.screenHeader.destroy();
        this.screenHeader = this.scene.add.rectangle(0, 0, 800, 36, 0xffffff).setOrigin(0);
    }

    private constructChatInput() {
        this.chatInput.removeAll(true);
        const background = this.scene.add.rectangle(0, 0, 600, 200, 0xffffff).setOrigin(0);
        const chatButton = this.scene.add.sprite(512, 36, 'send_button');
        chatButton.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => this.sendChatMessage());
        this.chatInput.add([background, chatButton]);
    }

    destroy() {
        this.screenHeader.destroy();
        this.chatArea.destroy();
        this.chatContactsPanel.destroy();
        this.chatHeader.destroy();
        super.destroy();
    }
}