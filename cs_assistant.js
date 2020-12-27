const { CafeChat, CafeChatBot } = require('./cafechat');
const pptEnters = require('./pptenters/gameManager');
const Chrismas = require('./christmas/manager');
const CS_accessToken = 'NID_AUT=BDi5TnxZ1CtuYlU3VcjmdZmFwAOppRKVkSqtYTooBfavTN04R0/9mp8WQTIw8Eog; NID_SES=AAABgpc+1k3usvpjrAUyg4xGBSUDe5P9YHf2Fs00Xr4Tvq9jjJkS345W1dl3GPJxNpa8JUbOyDVu6O3CULMGJ7o8VhyhT6G2vQ3fUUC+CkYaZA42TJXfijfRjxAcvN910IEB36w+qd6wngNt+hL0u/17ynCZhorM8WTlsn/EHgYrjn838qgnbXca+oEV0VrvEJcZLZKkoCTXr2ycUGXeDDJ6Hp6QNJKpgK+wWEyrH5YVAbHzOoecUNRbDFnte64+Xnb5HUG9oIju3v3RSujCcdL69oK1xrW5ba/f9hhfl4xPtyBu+e/8ZPLUkLObfPOMK+22KS2dhifgpJfqjCqw9wk/FrsQCuNe8wNoaF2QSqHYJGlI1KuMZXHA/p14C1FUfm6bW2ppGbexLgHAAEPNMN+CmVoH9LTUceWsxQ1eKYWDuZ1VzI9AVKiGBL+YJw2mOLzYQLfGWQdqdv8O0vFLCHvKQyBI4q2n4JPCh2Mv8KvKvDHJCwMdrO0LXm7GqsYPcGAgvzgzzptXMddQ2WM1aZVfxPA=;';
const CS_id = 'startaey1024';
const MainChannelID = 330657513744;
const TestChannelID = 661738695697;
const Utils = require('./utils');
const P = '\u200b'.repeat(10000);

let session = {
    imageAnalyze: {}
}

function onProc(e) {
    const msg = String(e.message.contents);
    const senderId = String(e.message.userId);
    const extras = String(e.message.extras);
    const senderName = e.bot.memberNameDict.name[senderId];
    if (senderId == CS_id) return;
    if (msg == '킁') {
        e.channel.sendText('끊기!!!');
    }else if (msg == 'ㅡㅡ') {
        e.channel.sendText('죄송해요..');
    }else if (msg == '1') {
        e.channel.sendText('2');
    }else if (msg.startsWith('$가사포함')) {
        let param = msg.substr(5).trim();
        if (!param.includes('@')) e.channel.sendText('구분자 "@"이 누락되었어요.');
        let p = param.split('@');
        Utils.song.lyricsIn(p[0], p[1]).then(res => {
            e.channel.sendText(res.message);
        });
    }else if (msg.startsWith('$급식')) {
        let param = msg.substr(3).trim();
        Utils.lunch.set(param).then(res => {
            if (res.state == 1) e.channel.sendText(`${senderName}님의 급식 검색 결과(${res.result.school})` + P + '\n\n\n' + res.message);
            else e.channel.sendText(res.message);
        });
    }else if (msg.startsWith('$유튜브노래')) {
        // Utils.youtube.mp3(msg.substr(6).trim()).then(res => {
        //     if (res.state == 1) e.channel.sendLink('요청하신 자료입니다.', '여기를 누르면 mp3 파일을 다운로드합니다.', '', res.result);
        //     else e.channel.sendText(res.message);
        // });
    }else if (msg.startsWith('$얼굴분석')) {
        // if (senderId in session.imageAnalyze) e.channel.sendText(`${senderName}님 이제 사진을 보내세요;;`);
        // else {
        //     e.channel.sendText(`${senderName}님 이제 사진을 보내주세요.`);
        //     session.imageAnalyze[senderId] = 1;
        // }
    }else if (msg == '$회원가입') {
        if (e.channel.channelId != MainChannelID) {
            if (senderId in Chrismas.DATA.accounts) {
                e.channel.sendText(`${senderName}님은 이미 가입되어 있습니다.`);
                return;
            }
            e.channel.sendText('비밀번호를 생성하는 중입니다.');
            let d = Chrismas.createPassword();
            Chrismas.saveAccount(senderId, d, senderName);
            Chrismas.log(`${senderName}(${senderId})님이 채팅방(${e.channel.channelId})에서 회원가입함 <카페 채팅>`);
            setTimeout(() => {
                e.channel.sendText(`계정이 생성되었습니다.\nID: ${senderId}\nPW: ${d}`);
            }, 3000);
        }else {
            e.channel.sendText('단체 채팅방에서는 비밀번호를 발급하실 수 없습니다.');
        }
    }
    
    if (senderId == 'jtyoung24' || senderId == 'qmfkejtm2004') {
        if (msg.startsWith('$밴 ')) {
            let param = msg.substr(2).trim();
            let res = param.includes('.') ? Chrismas.ban.ip(param) : Chrismas.ban.id(param);
            e.channel.sendText(res.message);
        }else if (msg.startsWith('$언밴 ')) {
            let param = msg.substr(3).trim();
            let res = param.includes('.') ? Chrismas.unban.ip(param) : Chrismas.unban.id(param);
            e.channel.sendText(res.message);
        }else if (msg.startsWith('$삭제')) {
            let param = msg.substr(3).trim();
            let res = param.includes('.') ? Chrismas.deleteNoti(param) : Chrismas.deleteNoti(param);
            e.channel.sendText(res.message);
        }else if (msg == '$저장') {
            Chrismas.saveData();
            e.channel.sendText('저장을 완료하였습니다.');
        }else if (msg == "$도움") {
            e.channel.sendText("$밴 id/ip\n$언밴 id/ip\n$삭제 id\n$로그\n$로그삭제 (몇줄)\n$위치조정 (id) (x포인트) (y포인트)\n$계정초기화 (id)\n$저장");
        }else if (msg == '$로그') {
            e.channel.sendText("서버 로그입니다." + P + '\n\n\n' + Chrismas.getLogs());
        }else if (msg.startsWith('$계정초기화 ')) {
            e.channel.sendText(Chrismas.initAddress(msg.substr(6).trim()).message);
        }else if (msg.startsWith('$로그삭제 ')) {
            e.channel.sendText(Chrismas.delLogs(msg.substr(5).trim()).message);
        }else if (msg.startsWith('$위치조정 ')) {
            let param = msg.substr(5).trim();
            if (param.includes(' ')) {
                let p = param.split(' ');
                if (p.length >= 3) e.channel.sendText(Chrismas.editPos(p[0], p[1], p[2]).message);
                else e.channel.sendText('필수 인자가 누락되었습니다.');
            }else {
                e.channel.sendText('필수 인자가 누락되었습니다.');
            }
        }
    }
    
    // if (extras != '') {
    //     const extObject = JSON.parse(extras.trim());
    //     if (extObject != null && "image" in extObject) {
    //         if (senderId in session.imageAnalyze) {
    //             e.channel.sendText('잠시만 기다려 주세요. 분석을 시작할게요.');
    //             Utils.image.analyzeFace(extObject.image.url).then(res => {
    //                 if (res.state == 1) e.channel.sendText(`${senderName}님의 사진 분석 요청 결과(네이버 얼굴 분석 API)` + P + '\n\n\n' + res.message);
    //                 else e.channel.sendText(res.message);
    //                 delete session.imageAnalyze[senderId];
    //             });
    //         }
    //     }
    // }

    if (e.channel.channelId != TestChannelID) return;
    if (msg.startsWith('/')) {
        pptEnters.processor(e, msg, senderId, senderName);
    }
    
}

process.on('SIGINT', () => {
    console.log('데이터 저장함.');
    pptEnters.saveData();
    Chrismas.saveData();
    process.exit(1);
});

let client = new CafeChatBot(CS_id, CS_accessToken, {'msg': onProc}, MainChannelID);
