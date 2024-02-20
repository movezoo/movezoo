//=============================================================================
// 레이싱 게임 상수
//=============================================================================

// 캐릭터 이름, 행동, 방향    (캐릭터파일명 : 이름_행동_방향)
const PLAYER_SPRITE = {
  NAMES:      [ "deer", "donkey", "fox", "husky", "shiba", "stag", "wolf", "whitehorse" ],
  ACTIONS:    [ { name: "run" } ],
  DIRECTIONS: [ "uphill_left", "uphill_straight", "uphill_right", "left", "straight", "right" ]
}

// 캐릭터 애니메이션 프레임 개수
const MAX_FRAME_COUNT = {
  // pug:      { run: 21 },
  // sheep:    { run: 21 },
  // pig:      { run: 23 },
  // cow:      { run: 35 },
  // llama:    { run: 21 },
  // horse:    { run: 21 },
  // zebra:    { run: 21 },
  deer:     { run: 18 },
  donkey:   { run: 17 },
  fox:      { run: 18 },
  husky:    { run: 17 },
  shiba:    { run: 17 },
  stag:     { run: 17 },
  wolf:     { run: 18 },
  whitehorse: { run: 17 }
}

// 맵 별 스프라이트 그룹 및 파일명, 사이즈정보
const MAP_SPRITE = {
  map1: {
    BILLBOARD: {
      billboard_ssafy10:  { x:    0, y:    0, w: 1000, h:  1000 },
      billboard_ssafy11:  { x:    0, y:    0, w: 1000, h:  1000 },
      billboard_news:     { x:    0, y:    0, w: 1000, h:  1000 },
    },
    TREE: {
      dead_tree1:       { x:    0, y:    0, w:  556, h:  995 },
      dead_tree2:       { x:    0, y:    0, w:  872, h:  982 },
      tree1:            { x:    0, y:    0, w:  657, h:  992 },
      tree2:            { x:    0, y:    0, w:  942, h:  992 },
      tree3:            { x:    0, y:    0, w:  985, h:  875 },
      tree4:            { x:    0, y:    0, w:  400, h:  800 },
      tree5:            { x:    0, y:    0, w:  400, h:  800 },
      tree6:            { x:    0, y:    0, w:  400, h:  800 }
    },
    STUFF: {
      house:            { x:    0, y:    0, w:  1200, h:  1200 },
      well:             { x:    0, y:    0, w:  400, h:  400 }
    }
  },
  
  map2: {
    GRAVE: {
      gravestone_flat:       { x:    0, y:    0, w: 1000, h:  400 },
      gravestone_bevel:      { x:    0, y:    0, w:  500, h:  500 },
      gravestone_decorative: { x:    0, y:    0, w:  500, h:  600 },
      gravestone_round:      { x:    0, y:    0, w:  500, h:  600 },
      gravestone_roof:       { x:    0, y:    0, w:  500, h:  600 },
      gravestone_wide:       { x:    0, y:    0, w:  800, h:  400 },
      coffin:                { x:    0, y:    0, w:  800, h:  500 },
      coffin_old:            { x:    0, y:    0, w:  800, h:  500 },
      altar_wood:            { x:    0, y:    0, w:  800, h:  600 },
      altar_stone:           { x:    0, y:    0, w:  800, h:  600 },
      cross:                 { x:    0, y:    0, w:  500, h:  800 },
      cross_wood:            { x:    0, y:    0, w:  500, h:  800 },
      gravestone_cross:      { x:    0, y:    0, w:  500, h:  900 }
    },
    TREE: {
      trunk:                 { x:    0, y:    0, w:  500, h:  200 },
      pine_fall_crooked:     { x:    0, y:    0, w:  400, h:  600 },
      pine_crooked:          { x:    0, y:    0, w:  400, h:  600 },
      pine:                  { x:    0, y:    0, w:  400, h:  800 },
      pine_fall:             { x:    0, y:    0, w:  400, h:  800 },
      trunk_long:            { x:    0, y:    0, w:  500, h:  800 }
    },
    STUFF: {
      pumpkin_tall:              { x:    0, y:    0, w:  500, h:  200 },
      pumpkin:                   { x:    0, y:    0, w:  500, h:  200 },
      pumpkin_tall_carved:       { x:    0, y:    0, w:  500, h:  200 },
      pumpkin_carved:            { x:    0, y:    0, w:  500, h:  200 },
      urn:                       { x:    0, y:    0, w:  500, h:  300 },
      shovel:                    { x:    0, y:    0, w:  500, h:  200 },
      shovel_dirt:               { x:    0, y:    0, w:  500, h:  500 },
      rock_tall:                 { x:    0, y:    0, w:  800, h:  700 },
      rock:                      { x:    0, y:    0, w: 1200, h:  700 },
      debris_wood:               { x:    0, y:    0, w:  500, h:  300 },
      debris:                    { x:    0, y:    0, w:  500, h:  300 }
    },
    LIGHTPOST: {
      lightpost_single:          { x:    0, y:    0, w:  500, h:  900 },
      lightpost_all:             { x:    0, y:    0, w:  600, h:  900 },
      lightpost_double:          { x:    0, y:    0, w:  600, h:  900 }
    },
    CHARACTER: {
      ghost:                     { x:    0, y:    0, w:  400, h:  400 },
      zombie:                    { x:    0, y:    0, w:  400, h:  400 },
      vampire:                   { x:    0, y:    0, w:  400, h:  400 }
    }
  }
}

const ITEM_SPRITE = { x:    0, y:    0, w:  300, h:  277 }
const ITEM = {
  speedup:          { x:    0, y:    0, w:  300, h:  277 }
}
const EFFECT = {
  speedup:          { x:    0, y:    0, w: 1200, h:  675, frameCount:  2 }
}








// 배경화면 파일 이름
const BACKGROUND_SPRITE_FILE_NAME = {
  hills: 'hills',       //.png
  sky: 'sky',           //.png
  faraway: 'faraway'    //.png
};


// 키보드 입력 상수
const KEY = {
  LEFT:  37,
  UP:    38,
  RIGHT: 39,
  DOWN:  40,
  A:     65,
  D:     68,
  S:     83,
  W:     87,
  SPACEBAR: 32
};

// 게임에서 사용되는 색깔 상수
const COLORS = {
  SKY:  '#72D7EE',
  TREE: '#005108',
  FOG:  '#005108',
  LIGHT:  { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC'  },
  // DARK:   { road: '#696969', grass: '#10AA10', rumble: '#BBBBBB'                   },
  DARK:   { road: '#696969', grass: '#009A00', rumble: '#BBBBBB'                   },
  START:  { road: 'white',   grass: 'white',   rumble: 'white'                     },
  FINISH: { road: 'black',   grass: 'black',   rumble: 'black'                     }
};

// 게임 배경 이미지 위치 및 크기

// for map1
const BACKGROUND = {
  HILLS: { x:   0, y:   0, w: 1280, h: 480 },
  SKY:   { x:   0, y: 0, w: 1280, h: 420 },
  FARAWAY: { x:   0, y: 0, w: 1280, h: 370 }
};

// for map2
// const BACKGROUND = {
//   HILLS:    { x:   0, y: 0, w: 1280, h: 720 },
//   SKY:      { x:   0, y: 0, w: 1280, h: 720 },
//   FARAWAY:  { x:   0, y: 0, w: 1920, h: 840 }
// };
// 게임 스프라이트 정보

// SPRITES.동물이름.액션[이름].방향 : [{x, y, w, h}, {x, y, w, h}, {x, y, w, h}] // 프레임별로 있음
// SPRITES.spriteName[action.name].direction: [{x, y, w, h}, {x, y, w, h}, {x, y, w, h}]




// 아이템전
// 바나나, 섬광(햇빛), 폭탄, 번개, 똥, 그물, 마취총, 거센바람

const SPRITES = {
  // PALM_TREE:              { x:    5, y:    5, w:  215, h:  540 },
  // BILLBOARD08:            { x:  230, y:    5, w:  385, h:  265 },
  // TREE1:                  { x:  625, y:    5, w:  360, h:  360 },
  // DEAD_TREE1:             { x:    5, y:  555, w:  135, h:  332 },
  // BILLBOARD09:            { x:  150, y:  555, w:  328, h:  282 },
  // BOULDER3:               { x:  230, y:  280, w:  320, h:  220 },
  // COLUMN:                 { x:  995, y:    5, w:  200, h:  315 },
  // BILLBOARD01:            { x:  625, y:  375, w:  300, h:  170 },
  // BILLBOARD06:            { x:  488, y:  555, w:  298, h:  190 },
  // BILLBOARD05:            { x:    5, y:  897, w:  298, h:  190 },
  // BILLBOARD07:            { x:  313, y:  897, w:  298, h:  190 },
  // BOULDER2:               { x:  621, y:  897, w:  298, h:  140 },
  // TREE2:                  { x: 1205, y:    5, w:  282, h:  295 },
  // BILLBOARD04:            { x: 1205, y:  310, w:  268, h:  170 },
  // DEAD_TREE2:             { x: 1205, y:  490, w:  150, h:  260 },
  // BOULDER1:               { x: 1205, y:  760, w:  168, h:  248 },
  // BUSH1:                  { x:    5, y: 1097, w:  240, h:  155 },
  // CACTUS:                 { x:  929, y:  897, w:  235, h:  118 },
  // BUSH2:                  { x:  255, y: 1097, w:  232, h:  152 },
  // BILLBOARD03:            { x:    5, y: 1262, w:  230, h:  220 },
  // BILLBOARD02:            { x:  245, y: 1262, w:  215, h:  220 },
  // STUMP:                  { x:  995, y:  330, w:  195, h:  140 },
  // SEMI:                   { x: 1365, y:  490, w:  122, h:  144 },
  // TRUCK:                  { x: 1365, y:  644, w:  100, h:   78 },
  // CAR03:                  { x: 1383, y:  760, w:   88, h:   55 },
  // CAR02:                  { x: 1383, y:  825, w:   80, h:   59 },
  // CAR04:                  { x: 1383, y:  894, w:   80, h:   57 },
  // CAR01:                  { x: 1205, y: 1018, w:   80, h:   56 },
  PLAYER_STRAIGHT: { w: 300 } // 플레이어의 좌우 길이

  // PLAYER_UPHILL_LEFT:     { x: 0, y:  0, w:   80, h:   45 },
  // PLAYER_UPHILL_STRAIGHT: { x: 0, y: 0, w:   80, h:   45 },
  // PLAYER_UPHILL_RIGHT:    { x: 0, y: 0, w:   80, h:   45 },
  // PLAYER_LEFT:            { x:  0, y:  0, w:   80, h:   41 },
  // PLAYER_STRAIGHT:        { x: 0, y:  0, w:   100, h:   100 },
  // PLAYER_RIGHT:           { x:  0, y:  0, w:   80, h:   41 }
};

// SPRITES.SCALE은 참조 스프라이트 폭이 (반쪽) 도로 폭의 1/3이어야 하므로 설정
SPRITES.SCALE = 0.3 * (1/SPRITES.PLAYER_STRAIGHT.w) 

// 스프라이트 카테고리
SPRITES.BILLBOARDS = [
  SPRITES.BILLBOARD01,
  SPRITES.BILLBOARD02
];

SPRITES.PLANTS = [
  SPRITES.TREE1,
  SPRITES.TREE2,
  SPRITES.DEAD_TREE1,
  SPRITES.DEAD_TREE2,
  SPRITES.PALM_TREE,
  SPRITES.BUSH1,
  SPRITES.BUSH2,
  SPRITES.CACTUS,
  SPRITES.STUMP,
  SPRITES.BOULDER1,
  SPRITES.BOULDER2,
  SPRITES.BOULDER3
];

SPRITES.CARS = [
  SPRITES.CAR01,
  SPRITES.CAR02,
  SPRITES.CAR03,
  SPRITES.CAR04,
  SPRITES.SEMI,
  SPRITES.TRUCK
];


export {
  PLAYER_SPRITE,
  KEY,
  COLORS,
  BACKGROUND,
  SPRITES,
  MAX_FRAME_COUNT,
  BACKGROUND_SPRITE_FILE_NAME,
  MAP_SPRITE,
  ITEM_SPRITE,
  EFFECT,
  ITEM
}