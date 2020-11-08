from deepnn import Neuralnetwork
from konlpy.tag import Hannanum, Okt
import numpy as np

hn = Hannanum()
okt = Okt()

raw_data = [['이 영화는 정말 재미가 없네요.', 0], ['이거 완전 재밌잖아?', 1], ['너무 재밌어요.', 1], ['굳입니다.', 1], ['별로인데요?', 0], ['저는 별로 재미있지는 않았습니다.', 0], ['그닥 재미있지는 않았음.', 0], ['완전 꿀잼!!', 1], ['완전 제 스타일이었습니다', 1], ['시간이 아까웠어요..', 0], ['시간이 너무 빨리 갔어요.', 1], ['이딴걸 영화라고.. 노잼', 0], ['재밌었네요. 추천합니다. 꼭 보세요..', 1], ['재미 보장이다 이말이야', 1]]

# 단어들 추출
words = []
for stc in raw_data:
    for wd in okt.morphs(stc[0]):
        if not wd in words: words.append(wd)

# 원핫 인코드
def onehot(word):
    global words
    try:
        idx = words.index(word)
        return [0 for i in range(idx)] + [1] + [0 for i in range(len(words) - idx - 1)]
    except:
        return [0 for i in range(len(words))]


def onehot_stc(stc):
    global words
    tmp = np.array([0 for i in range(len(words))])
    for wd in okt.morphs(stc):
        tmp += np.array(onehot(wd))
    return list(tmp)


# 데이터 가공
data = []
for dt in raw_data:
    data.append([onehot_stc(dt[0]), dt[1]])

nn = Neuralnetwork([len(words), 3, 1], learning_rate=0.2)

print('신경망 학습 시작\n\n')

# 신경망 학습
for i in range(2000):
    for j in range(len(data)):
        nn.train(data[j][0], [data[j][1]])

# 질의
i_x = ['아 재밌었어요', '너무 재밌었습니다.', '별로였음', '재미 없었어요..', '노잼', '흠.. 좀 별로인 부분도 있지만 그래도 추천!!', '음.. ㅋㅋ', '화려하기만 하고 그닥 재미는..', '님들 꼭 보세요..']
i_x = ['재미가 있지는 없지 않았어요.']
for i in i_x:
    print(i, ' => ', nn.query(onehot_stc(i))[0])