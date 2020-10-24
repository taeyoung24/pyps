import sys, os
import time
import http.server
import socket
import threading
import pychromecast
import requests

ghome_ip = '192.168.219.105'

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.connect(('8.8.8.8', 80))
    local_ip, _ = s.getsockname()

PORT = 8000

class StoppableHTTPServer(http.server.HTTPServer):
    def run(self):
        try:
            print('Server started at %s:%s'%(local_ip, self.server_address[1]))
            self.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            self.server_close()

server = StoppableHTTPServer(('', PORT), http.server.SimpleHTTPRequestHandler)
thread = threading.Thread(None, server.run)
thread.start()

ghome = pychromecast.Chromecast(ghome_ip)
print(ghome)
ghome.wait()

# set volume level ... no beep sound
volume = ghome.status.volume_level
ghome.set_volume(0)



res_cookies = 'NNB=PA3JGUIIV4VV6; NRTK=ag#all_gr#2_ma#0_si#0_en#0_sp#0; nx_ssl=2; nid_inf=-1380795050; NID_AUT=b2QTezBSkCJOBe2VX4MnZxVZ7v+EgxFH1iP5KVuiieLn0/Yd1xAaSVlBUnDy24pi; NID_JKL=gR814KDTjfq/FT+Hv6fMc6Xp+latiGLelNJG1YoClkc=; NMUPOPEN=Y; _gid=GA1.2.410598193.1599145489; _ga_7VKFYR6RV1=GS1.1.1599145583.7.0.1599146274.60; _ga=GA1.2.618290616.1596698422; NDARK=N; NID_SES=AAABf65RANFU86MOY0ivrV1sgaZpDiOKZQgbv7S6ZqGUU7M+0UePbArpF2yvxzSV0h/DLE/1ErI9L+D/Bnt4P0Pk6JThc3C8WZkn3zWAYxhcD/t5Uu2ckKRRZRZUIWnObpMpGXyQ9IyWpm5QpIfs5evi1b53MfklVWZHivf2kfk0WTGNmN1E5Eqs1vKaKTYRU1NwD8CRuWcnp9PGOFpZb5oArCPnv+gDcn/SHfhbQp/WnttS63AVUNR1Yj4MLs7wB+0e+aZpgIzWwbaRJ3CAbG6Q2+XgZmYbc3e+Wg45mPd6HQoGBpLFiEOr/Cg22ow45hhCEoyAIxVNxj0pzUHCj9SX3P2phxwUN1Dz9R0GbcVZw7YH+WDAfwBSuqQFvJA9jAyfR02T+UtK3Zshlkw161XTD8VkHmoxC+iUmGL6/oQ2BaqjyLRSLACQ/jhyfmhOSTz8lAfrkrncdcE9y/YnW45L+eJe0cMHyFGTIvHFXL4i9WCQot946oXss/Gy2mmaKosVlA==; CD_AUT=57969bb15c5effedd5c94ad797958aeefa38e2fb82ac09fcaaaa62c79151e4ef69773696fae2a35b9dc348039090cf49'

res_headers = {
    'cookie': res_cookies,
    'content-type': 'audio/mpeg;charset=UTF-8'
}

def say(content, voice=5):
    res = requests.get(f'https://clovadubbing.naver.com/system/voicefont/{voice}/preview?text={content}', headers=res_headers)
    res.encoding = 'utf-8'

    with open('cache.mp3', 'wb') as f:
        f.write(res.content)

    time.sleep(0.1)
    fname = 'cache.mp3'

    mc = ghome.media_controller

    mp3_path = 'http://%s:%s/%s'%(local_ip, PORT, fname)
    mc.play_media(mp3_path, 'audio/mp3')
    print(mc)
    # pause atm
    mc.block_until_active()
    mc.pause()
    time.sleep(1); ghome.set_volume(0.3); time.sleep(0.5)

    # play
    mc.play(); 
    while not mc.status.player_is_idle:
        time.sleep(0.1)
    os.remove('cache.mp3')
    mc.stop()

say("안녕하세요?", voice=5)
say("네 안녕하세요! 오랜만이네요?", voice=14)
say("가위 바위 보 하실래요?", voice=5)
say("아니요, 전 그런거 싫어해요.", voice=14)
say("그럼 뭘 하고 싶은데요?", voice=5)
say("하고 싶은 게 딱히 없네요.", voice=14)
say("아, 그럼 전 가볼게요. 바빠서요..", voice=5)
say("네, 하하.. 안녕히가세요.", voice=14)

# kill all
ghome.quit_app()
server.shutdown()
thread.join()


