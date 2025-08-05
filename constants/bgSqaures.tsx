export const bgSquares = [
  {
    left: "-9.493348475506846%",
    opacity: 0.1,
    rotation: 240.61975048063877,
    size: 65.5024163512236,
    top: "-15.189667523476349%",
  },
  {
    left: "20.43073715675986%",
    opacity: 0.1,
    rotation: 135.2684154353346,
    size: 58.66146517708171,
    top: "14.390708521465605%",
  },
  {
    left: "33.585320634105564%",
    opacity: 0.1,
    rotation: 236.65783695812613,
    size: 50.86115525726981,
    top: "6.947131507939531%",
  },
  {
    left: "62.30488067092334%",
    opacity: 0.1,
    rotation: 336.88260951635783,
    size: 53.566514161573636,
    top: "4.792512785482195%",
  },
  {
    left: "-10.674900931492544%",
    opacity: 0.1,
    rotation: 213.89774701709558,
    size: 68.00512935311417,
    top: "17.885442289134005%",
  },
  {
    left: "21.39416502122599%",
    opacity: 0.1,
    rotation: 127.65403841030056,
    size: 60.31595135696855,
    top: "44.88142745939916%",
  },
  {
    left: "48.580166056917875%",
    opacity: 0.1,
    rotation: 112.33680219699701,
    size: 64.51695166887025,
    top: "28.65450979535618%",
  },
  {
    left: "84.13994615236875%",
    opacity: 0.1,
    rotation: 147.8460791204238,
    size: 69.37066327536265,
    top: "40.44352724546479%",
  },
  {
    left: "-18.55580646937096%",
    opacity: 0.1,
    rotation: 8.025925154401964,
    size: 51.30511793366612,
    top: "53.786476145179286%",
  },
  {
    left: "24.850953337008807%",
    opacity: 0.1,
    rotation: 235.76079375773196,
    size: 63.54855990959535,
    top: "78.36361896692873%",
  },
  {
    left: "46.51048037847913%",
    opacity: 0.1,
    rotation: 53.64024450936854,
    size: 70.5361245886026,
    top: "66.3983351794135%",
  },
  {
    left: "59.641473769421296%",
    opacity: 0.1,
    rotation: 85.43556009835439,
    size: 69.02680863531073,
    top: "62.264200517604735%",
  },
];

const GRID_ROWS = 3;
const GRID_COLS = 4;
const CELL_WIDTH = 100 / GRID_COLS;
const CELL_HEIGHT = 100 / GRID_ROWS;

const MARGIN_PERCENT = -20; // allow up to -10% overflow

const randomSquares = () => {
  return Array.from({ length: GRID_ROWS * GRID_COLS }, (_, index) => {
    const row = Math.floor(index / GRID_COLS);
    const col = index % GRID_COLS;

    // Start at slightly before the cell, end slightly after
    const baseLeft = col * CELL_WIDTH;
    const baseTop = row * CELL_HEIGHT;

    const jitterX = Math.random() * (CELL_WIDTH * 1.2) + MARGIN_PERCENT;
    const jitterY = Math.random() * (CELL_HEIGHT * 1.2) + MARGIN_PERCENT;

    return {
      left: `${baseLeft + jitterX}%`,
      top: `${baseTop + jitterY}%`,
      size: Math.random() * 21 + 50,
      opacity: 0.1,
      rotation: Math.random() * 360,
    };
  })
};
