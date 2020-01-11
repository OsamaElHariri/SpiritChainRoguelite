export class ChatContacts {
    static readonly Fiona = 'Fiona Work';
    static readonly Ismail = 'Ismail Work';
    static readonly CrazyGeorge = 'Crazy Park Guy';
    static readonly Linette = '❤ Baby Cakes ❤';
    static readonly Mom = 'Mum';
    static readonly Me = 'Me';

    static readonly defaultIcon = 'gf_chat_icon';
    static readonly icons = () => {
        const icons = {};
        icons[ChatContacts.Fiona] = 'fiona_chat_icon';
        icons[ChatContacts.Ismail] = 'ismail_chat_icon';
        icons[ChatContacts.CrazyGeorge] = 'crazy_park_chat_icon';
        icons[ChatContacts.Linette] = 'gf_chat_icon';
        icons[ChatContacts.Mom] = 'mum_chat_icon';
        return icons;
    };


}