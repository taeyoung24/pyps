const request = require('request');
const io = require('socket.io-client');


class CafeChat {
    constructor(userId, channelId, accessToken) {
        this.token = accessToken;
        this.channelId = channelId;
        this.socket = io(`https://talkwss.cafe.naver.com/chat`, {
            query: {
                "accessToken": accessToken,
                "channelNo": channelId,
                "userId": userId
            },
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'Origin': 'https://talk.cafe.naver.com'
                    }
                }
            }
        });
    }

    sendText(msg) {
        this.socket.emit("send", {"tempId": 0, "message": String(msg), "messageTypeCode": 1, "sessionKey": this.token});
    }

    sendImage(url = '', width=256, height=256) {
        let res = `{"image":{"width":${width},"url":"${url}","height":${height},"is_original_size":false}}`;
        this.socket.emit("send", {"tempId": 0, "extras": res, "message": '', "messageTypeCode": 11, "sessionKey": this.token});
    }

    sendLink(title='', content='', tag='', url='https://cafe.naver.com/gameppt', img='') {
        let res = `{"snippet":{"title":"${title}","url":"${url}","description":"${content}","domain":"${tag}","type":null,"image":{"url":"${img}","height":100,"width":100}}}`;
        this.socket.emit("send", {"tempId": 0, "extras": res, "message": '\0', "messageTypeCode": 1, "sessionKey": this.token});
    }

    sendLinkjson(option) {
        if (option.title === undefined) option.title = '';
        if (option.content === undefined) option.content = '';
        if (option.tag === undefined) option.tag = '';
        if (option.url === undefined) option.url = 'https://cafe.naver.com/gameppt';
        if (option.img === undefined) option.img = '';
        let res = `{"snippet":{"title":"${option.title}","url":"${option.url}","description":"${option.content}","domain":"${option.tag}","type":null,"image":{"url":"${option.img}","height":100,"width":100}}}`;
        this.socket.emit("send", {"tempId": 0, "extras": res, "message": '\0', "messageTypeCode": 1, "sessionKey": this.token});
    }
}

class CafeChatBot {
    constructor(botId, accessToken, callbacks, MainChannelID=0) {
        this.botId = botId;
        this.token = accessToken;
        this.activatedSockets = [];
        this.activatedChannels = [];
        this.memberNameDict = {name: {}, id: {}};
        this.getChannelList().then(rooms => {
            rooms.forEach(room => {this.activeSocket(room.channelId)})
        });
        this.timer_j = setInterval(() => {
            this.channelListUpdate();
        }, 60000 * 60 * 6);
        this.setMemberNameDict(MainChannelID);
        this.callbacks = callbacks;
        this.MainChannelID = MainChannelID;
    }

    getChannelList() {
        return new Promise((resolve, reject) => {
            request.get({
                uri: 'https://talk.cafe.naver.com/talkapi/v3/channels',
                headers: {
                    'cookie': this.token
                },
                json: true
            }, (err, resp, body) => {
                resolve(body.message.result.channelList);
            });
        });
    }

    quitChannel(channelId) {
        this.getChannelList().then(rooms => {
            const li = rooms.map(v => v.channelId);
            if (li.includes(channelId)) {
                request.delete({
                    uri: `https://talk.cafe.naver.com/talkapi/v1/channels/${channelId}/quit`,
                    headers: {
                        'cookie': this.token
                    }
                }, (e, r, b) => {});
            }
        });
    }

    getMemberList(channelId) {
        return new Promise((resolve, reject) => {
            this.getChannelSync(channelId).then(syncData => {
                resolve(syncData.memberList);
            });
        });
        
    }

    setMemberNameDict(channelId) {
        this.getMemberList(channelId).then(data => {
            data.forEach(v => {
                this.memberNameDict.name[v.memberId] = v.nickname;
                this.memberNameDict.id[v.nickname] = v.memberId;
            });
        });
    }

    getChannelSync(channelId) {
        return new Promise((resolve, reject) => {
            request.get({
                uri: `https://talk.cafe.naver.com/talkapi/v4/channels/${channelId}/sync`,
                headers: {
                    'cookie': this.token
                },
                json: true
            }, (err, resp, body) => {
                resolve(body.message.result);
            });
        });
    }

    channelListUpdate() {
        this.getChannelList().then(rooms => {
            rooms.forEach(room => {
                const ci = room.channelId;
                const lastUpdate = room.updatedAt;
                const now = new Date().getTime();
                if (now - lastUpdate >= 60000 * 60 * 24) {
                    if (ci !== this.MainChannelID) {
                        this.deactivateSocket(ci);
                    }
                }
                // if (now - lastUpdate < 10000) {
                //     this.activeSocket(ci);
                // }
            });
        });
    }

    activeSocket(channelId) {
        if (!this.activatedChannels.includes(channelId)) {
            let sock = new CafeChat(this.botId, channelId, this.token);
            sock.socket.on('msg', e => {
                e.channel = sock;
                this.callbacks['msg'](e);
            });
            sock.socket.connect();
            this.activatedSockets.push(sock);
            this.activatedChannels.push(channelId);
        }
    }

    deactivateSocket(channelId) {
        let idx = this.activatedChannels.indexOf(channelId);
        if (idx > -1) {
            this.activatedSockets[idx].socket.disconnect();
            this.activatedSockets.splice(idx, 1);
            this.activatedChannels.splice(idx, 1);
            this.deactivateSocket(channelId);
            this.quitChannel(channelId);
        }
    }
}

module.exports.CafeChat = CafeChat;
module.exports.CafeChatBot = CafeChatBot;