import requests



headers = {
    'cookie': 'NNB=SYQQ4MBIGWCF4; NRTK=ag#all_gr#1_ma#-2_si#0_en#0_sp#0; ncvid=#vid#_182.221.133.130j2TQ; nid_inf=1076240214; NID_AUT=+GPR1flqKEc0LOCUILPmZ3UGYeLvctI1YbfcsdH73A+94ACKiuY2IZR1M8D2biOO; NID_JKL=2G1kibd3/UMQZUYJwUR/A/bugFLBnVlpqt+D6BgRbsE=; NID_SES=AAABfgSTzl2dQ8W88HqDniQFXli77sanhEpBBODT0hoSUGjbRVsPmRpk4nr2zNEDLvXrbXWHajt+/zIx21lXXYtArclrBTAvsPvslcGJX9HJPTW73jfa5Uhx8o2BNWyNZ/bcO13vZa1yLjek3osOWUaOT/8ciK6LBNNjinQDnBygqsL0b23iuRkAneuXtfJy8M2T3IUz2d1V4HtVkSGqL5pyh0VmLHM3hA0rFLJPJns9velnghEky+4WVEIeUoZXmrG4RZZNTTi1tikN32a8p72KwOCA+uvY+lqWQr1UUCnEZ/yECn6aBreyDXztOO4Ot4W1Ue+EZpyh65fciPJSs5hBl83mtYi9t7oEWWu+qKy+/NaYybLb9owJ54TJNXUylA+0dnogQZKu5Odg69e2ApDzMjeOUxLSqEAwNEps94V7I3jywPd9jI5WbVmc1K4Bo5zP/SNinudoeVOPXtJWsbVvApH4WdPO1wm0IAEeiqctNr8Yj+6QO4ioXCEkgKwMNwJKZw==; ncu=98aa5862772843ed8e6f0c3b729ac69909e561f9d698; nci4=f4c62f0b1953388ed13f786f629de1943c7b856302589f64a8d4eb46b6a5778948a0125b0f57d2edf06247e2a10bac729daf9b917d497a5e69ac7ba94f58d322444b6e497e31424d6443705649447c5f6d2e5e517057642a646b4e6e5c136e6641654a7b7679587f4c010d0f0009027572070f2403307e7c14666d66087d600d7e6d22; ncmc4=7240a98d9fd5be0857b9fee9e40f721eadf912f4bda1419e64d4e717889b488f4e8874836045dad0802c30ee57830cd22b3d1439ddc28b92875bf309efee1addb42a; ncvc2=f2c032081d422987e4056651748ff285287b8563327e8242a0605d853d16f63c7b; JSESSIONID=9B8459C7BEB51B54DDBD8B7AEA531F63',
    'user-agent': 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
}

def check_attendance(content):
    global headers
    URL = 'https://m.cafe.naver.com/AttendancePost.nhn'
    data_form = {
        'attendancePost.cafeId': 16854404,
        'attendancePost.menuId': 20,
        'attendancePost.userId': 'startaey1024',
        'attendancePost.content': content
    }
    requests.post(URL, headers=headers, data=data_form)

def write_memo(content):
    global headers
    URL = 'https://m.cafe.naver.com/MemoPost.nhn'
    n_headers = {
        'cookie': headers['cookie'],
        'user-agent': headers['user-agent'],
        'referer': 'https://m.cafe.naver.com/MemoList.nhn?search.clubid=16854404&search.menuid=132'
    }
    data_form = {
        'memoPost.cafeId': 16854404,
        'memoPost.menuId': 132,
        'memoPost.content': content
    }
    requests.post(URL, headers=n_headers, data=data_form)

# write_memo('실험')
for i in range(5):
    check_attendance(i)
