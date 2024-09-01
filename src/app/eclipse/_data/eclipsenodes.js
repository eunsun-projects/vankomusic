// isEvents: 클릭요소, 의심게이지 등등
// background: 상황설명
// order: 누가 먼저 말하냐
// to: 선택이 없을 경우 다음 노드가 몇번인지
export const eclipseNodes = [
    {
        name : '1',
        number: 10,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '우주선 안의 작은 간이 테이블 위, 진공팩에 검은 액체가 들어있다.',
        order: 'android',
        android : [
            '안녕하세요! 오늘 컨디션은 어때요? 커피를 준비했어요.'
        ],
        player : [
            '으.. 머리야... 사람들은 모두 어디갔지?'
        ],
        narration : [],
        to : 20
    },
    {
        name : '2',
        number: 20,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '텅빈 우주선 복도를 찍은 CCTV 화면 스크린',
        order: 'android',
        android : [
            '…새벽에 잠시 선내 시스템이 멈췄어요.\n이후에 재가동 되었을 때는 모두 사라져 있더군요.', 
            '모든 시스템이 기능 중단 상태였기 때문에 데이터가 남아있지 않습니다.'
        ],
        player : [
            '그게 무슨…! 데이터를 확인해봐!', 
            '…뭐……??? '
        ],
        narration : [],
        to : 30
    },
    {
        name : '3',
        number: 30,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '어두운 우주선 컨트롤 룸, 안드로이드의 실루엣',
        order: 'player',
        android : [
            '제가 모두 확인했어요. 아무도 남아 있지 않아요.', 
        ],
        player : [
            '무슨 일인지 당장 조사해야겠어!', 
        ],
        narration : [],
        to : 41
    },
    {
        name : '4-1',
        number: 41,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '굳게 닫힌 우주선 컨트롤룸 문. 으스스한 분위기.',
        order: 'player',
        android : [
            `...원하는대로 하세요. 
            하지만 그게 좋은 판단일지는 모르겠네요. 
            뭐가 있을지 모르니 조심해요.`, 
        ],
        player : [
            '뭐라고? 당장 나가서 확인 해봐야겠어!', 
        ],
        narration : [],
        to : 51
    },
    {
        name : '4-2',
        number: 42,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '우주선 조종실 내부 풍경',
        order: 'player',
        android : [
            `글쎄요. 좋지 못한 소식이 한 가지 더 있어요.`, 
        ],
        player : [
            '대체 무슨 일이지?', 
            '뭔데? 이것보다 안 좋은 소식은?'
        ],
        narration : [],
        to : 52
    },
    {
        name : '5-1',
        number: 51,
        isSelect: true,
        select : {
            one : ['조종실로 돌아간다', 42],
            two : ['더 조사해본다', 61],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '아무도 없는 우주선 복도',
        order: 'player-solo',
        android : [],
        player : [
            '젠장...아무 흔적도 없군.\n이래서야 아무것도 알수 없잖아.\n그런데 왜 이렇게 숨이 가쁘지? 조종실로 돌아갈까?'
        ],
        narration : [],
        to : null
    },
    {
        name : '5-2',
        number: 52,
        isSelect: true,
        select : {
            one : ['내가 한번 고쳐볼게', 62],
            two : ['앞으로 너의 계획은 뭐지?', 63],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '눈이 죽은 안드로이드들이 컷 화면으로 등장',
        order: 'android',
        android : [
            `다른 안드로이드들도 반응이 없어요.
            즉 우주선을 당신과 나 둘이서 운영해야 한다는 거죠.`,
            '시도해보고 있어요. 하지만 아예 반응이 없군요.'
        ],
        player : [
            '심각하군... 복구할수 없겠어?'
        ],
        narration : [],
        to : null
    },
    {
        name : '6-1',
        number: 61,
        isSelect: true,
        select : {
            one : ['안드로이드에게 보고한다.', 71],
            two : ['사진으로 기록하고 흔적을 지운다.', 72],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 2,
                type : 'inventory',
                action : '인벤토리에 사진 추가'
            },
        ],
        background : '해치 앞',
        order: 'player-solo',
        android : [],
        player : [
            `해치 개방 레버에 피 묻은 손자국이...누가 이것을 만졌지?
            설마 누군가 고의로 열었다는 건가...? `
        ],
        narration : [],
        to : null
    },
    {
        name : '6-2',
        number: 62,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 0, 
                type : 'doubt',
                action : 'doubt+1'
            },
        ],
        background : '안드로이드 기판 점검',
        order: 'android',
        android : [
            '완전히 초기화 되었네요. 복구가 불가능할거예요'
        ],
        player : [
            `어떻게든 고쳐봐야지.`
        ],
        narration : [],
        to : 63
    },
    {
        name : '6-3',
        number: 63,
        isSelect: true,
        select : {
            one : ['미안하지만 그러면 안될것 같은데?', 73],
            two : ['아주 좋은 계획이야. 뭐부터 할까?', 74],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 0, 
                type : '기억복구성공',
                action : '기억복구성공?'
            },
        ],
        background : '안드로이드 기판 점검',
        order: 'player',
        android : [
            `메두사호는 현재 또 다른 웜홀을 찾아 가고 있어요. 이 구역에는 더 이상 탐색 가능한 공간이 없는 것 같거든요.
            어차피 웜홀을 통과한 이후에 현재 시공간의 정보가 모두 의미 없어질테니 시스템은 임무수행에 필요한 부분만 복구할거예요.
            그러기 위해서는 당신의 도움이 필요해요.원격제어만 가능해지면 제가 시스템 전체를 움직일수 있으니
            그 이후에는 편해지실 거예요.`
        ],
        player : [
            `앞으로 너의 계획은 뭐지?`
        ],
        narration : [],
        to : null
    },
    {
        name : '7-1',
        number: 71,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '해치 앞',
        order: 'player',
        android : [
            `(무전)...그런것 같군요. 누군가 고의로 모두를 살해한 것으로 보이네요.`
        ],
        player : [
            `(무전)누군가 해치를 열었던 것 같아. 레버에 피 묻은 손자국이 있어. 
            벽에도 피가 묻어 있는 것을 보니 우주로 튕겨져 나가는 순간이었던것 같은데...왜 스스로 그랬지?`
        ],
        narration : [],
        to : 81
    },
    {
        name : '7-2',
        number: 72,
        isSelect: true,
        select : {
            one : ['왔던 길로 돌아간다.', 52],
            two : ['다른 길로 돌아간다.', 82],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 2, 
                type : 'doubt',
                action : 'doubt+1'
            },
        ],
        background : '해치 앞',
        order: 'player',
        android : [
            `(무전)뭐가 있을지 모르니 왔던 길로 돌아오세요.`
        ],
        player : [
            `(무전)이만 돌아가겠어.`
        ],
        narration : [],
        to : null
    },
    {
        name : '7-3',
        number: 73,
        isSelect: true,
        select : {
            one : ['지금 뭔가를 숨기고 있는게 분명해.', 83],
            two : ['나를 너무 과대평가 하는것 같은데.', 74],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '냉정한 얼굴의 안드로이드',
        order: 'player',
        android : [
            `무슨 의미인지 모르겠네요.`
        ],
        player : [
            `미안하지만 그러면 안될것 같은데?`,
            '너는...'
        ],
        narration : [],
        to : null
    },
    {
        name : '7-4',
        number: 74,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '협력??',
        order: 'android',
        android : [
            `당신이 나와 협력한다면 많은 것을 할수 있어요. 
            우리가 먼저 할 일은 기관실 점검이예요. 
            기관실은 현재 우리가 있는 조종실 오른쪽에 있어요.
            시스템이 모두 정상 작동 중인지 점검하고 수리가 필요하다면
            수리를 통해 복구하는 작업이 필요합니다.`,
            `...저는 계속 주의를 기울이고 있으니 제가 필요하면 말씀하세요.`
        ],
        player : [
            `알겠어. 다녀오겠어.`,
            '너는...'
        ],
        narration : [],
        to : 84
    },
    {
        name : '8-1',
        number: 81,
        isSelect: true,
        select : {
            one : ['우주복으로 갈아입고 레버를 당긴다.', 1000],
            two : ['거절한다.', 72],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '해치 앞',
        order: 'android',
        android : [
            `(무전)하지만 시스템이 모두 작동 불능이라면 해치도 작동하지 않을텐데요`,
            `(무전)이상하군요. 지금 시스템을 일시로 다 꺼볼테니 한번 당겨봐줄래요? 혹시 모르니 우주복을 입고요.`
        ],
        player : [
            `(무전)그렇지.`,
        ],
        narration : [],
        to : null
    },
    {
        name : '8-2',
        number: 82,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '승객들의 방이 있는 복도',
        order: 'player',
        android : [
            `시스템 설정상 개인 방을 허가 없이 열수 없습니다.`,
            `승객 본인의 카드키나 마스터키가 있어야 합니다.`
        ],
        player : [
            `승객들의 방을 조사해보고 싶은데 키가 없군...
            (무전) 룸 게이트를 개방해줄수 있겠어?`,
            `지금은 특수한 상황이잖아.`,
            `답답하군...`
        ],
        narration : [],
        to : 52
    },
    {
        name : '8-3',
        number: 83,
        isSelect: true,
        select : {
            one : ['한 순간에 사람들이 없어졌는데 시스템 관리자인 네가 모른다는게 이상하잖아.', 91],
            two : ['말하지 않는다.', 92],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 1, 
                type : 'doubt',
                action : 'doubt+1'
            },
        ],
        background : '복도에 설치된 CCTV들',
        order: 'player',
        android : [
            `...제가 뭘 숨기고 있다는 말이죠?`
        ],
        player : [
            `너는 지금 뭔가를 숨기고 있는게 분명해.`,
        ],
        narration : [],
        to : null
    },
    {
        name : '8-4',
        number: 84,
        isSelect: true,
        select : {
            one : ['시스템 복구가 우선이니, 일단 협력하여 수리해야 한다.', 93],
            two : ['역시 믿을수 없어. 수리하지 않고 이 틈에 다른 곳을 조사한다.', 94],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '기계로 가득한 기관실 내부 ',
        order: 'player-solo',
        android : [],
        player : [
            `기관실로 가서, 내가 지금부터 해야 할 일에 대해서 생각했다. 
            나는...`,
        ],
        narration : [],
        to : null
    },
    {
        name : '9-1',
        number: 91,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '냉정한 얼굴의 안드로이드',
        order: 'player',
        android : [
            `...정 그러시면 직접 조사하면서 오해를 풀어보는건 어때요?
            사실 어제 사건 직전에 식당쪽에서 이상한 데이터가 접수된 적이 있어요.`,
        ],
        player : [
            `한 순간에 사람들이 없어졌는데 시스템 관리자인 네가 모른다는게 이상하잖아.`,
            `(좋아. 이 틈에 식당으로 가는 척 하며 다른 곳도 조사해보자.)`
        ],
        narration : [],
        to : 101
    },
    {
        name : '9-2',
        number: 92,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '냉정한 얼굴의 안드로이드',
        order: 'player',
        android : [
            `그런것 같네요. 복종하도록 만들어진 제가 무엇을 숨기겠어요?`,
            `기관실을 점검하고 시스템을 복구하는게 우선이예요.`
        ],
        player : [
            `아니야. 내가 지금 예민한가봐.`,
            `그러면 무엇부터 같이 해결 해볼까?`,
            `(좋아. 이 틈에 식당으로 가는 척 하며 다른 곳도 조사해보자.)`
        ],
        narration : [],
        to : 101
    },
    {
        name : '9-3',
        number: 93,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 0, 
                type : '점멸하는 기계 3개를 터치',
                action : '수리완료'
            }
        ],
        background : '기계로 가득한 기관실 내부, 수리 이벤트',
        order: 'player-solo',
        android : [],
        player : [
            `(돌아가기 전에 다른 곳을 들러서 조사해보자.)`
        ],
        narration : [],
        to : 101
    },
    {
        name : '9-4',
        number: 94,
        isSelect: false,
        select : {
            one : [],
            two : [],
            three : [],
            four : [],
            five : []
        },
        isEvents: true,
        events: [
            {
                condition : 0, 
                type : '점멸하는 기계 3개를 터치',
                action : '수리완료'
            }
        ],
        background : '기관실 옆 함장실',
        order: 'narration',
        android : [],
        player : [
            `왜 이 부분만 찢어져 있지..? 일단 의심 받기 전에 조종실로 돌아가자.`
        ],
        narration : [
            `이곳은 함장실이다. 모든 것을 기록해두는 함장의 일지를 발견했다.
            - 사흘 전 : 승객들의 정신이 매우 흔들리고 있다. 
            - 이틀 전 : 어쩌면 이 곳은 지옥이 아닐까...? 우린 모두 다 죽을거야
            - 어제 : 놀라운 것을 알게 됐다. 우리가 ‘(이 부분이 찢어져 있다)’ 라는 것을... 너무나 충격적인 진실이라 아무에게도 알리지 못했다.`
        ],
        to : 101
    },
    {
        name : '10-1',
        number: 101,
        isSelect: true,
        select : {
            one : ['기관실',''],
            two : ['함장실', ''],
            three : ['승객들의 방', ''],
            four : ['해치', ''],
            five : ['조종실', ]
        },
        isEvents: false,
        events: [],
        background : '갈 곳 선택',
        order: 'none',
        android : [],
        player : [],
        narration : [],
        to : null
    },
    {
        name : 'badending01',
        number: 1000,
        isSelect: true,
        select : {
            one : ['처음부터 다시 시작', 10],
            two : ['부활', 81],
            three : [],
            four : [],
            five : []
        },
        isEvents: false,
        events: [],
        background : '엔딩(실패01)',
        order: 'narration',
        android : [],
        player : [],
        narration : [
            `Mission Fail
            
            당신은 안드로이드의 계략에 빠져 우주 미아가 되었습니다!
            다시는 메두사호로 돌아갈수 없습니다.`
        ],
        to : null
    }
];