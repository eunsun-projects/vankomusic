export default class LotteryClass {
    constructor(canvas, width){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.WIDTH = width;
        this.HEIGHT = width;
        this.dpr = window.devicePixelRatio; //디바이스픽셀래티오(디바이스의 픽셀 비례갋)

        /************* 여기서 함수 실행 ***************/
        this.initCanvas();
        this.backGround();
        this.guideText();
    }

    /************* init ***************/
    initCanvas(){
        this.canvas.style.width = `${this.WIDTH}px`;
        this.canvas.style.height = `${this.HEIGHT}px`;
        this.canvas.width = this.WIDTH * this.dpr;
        this.canvas.height = this.HEIGHT * this.dpr;
        this.context.scale(this.dpr, this.dpr);
    }
    /************* background ***************/
    backGround(){
        this.context.strokeStyle = "rgb(13, 13, 76)";
        this.context.fillStyle = "rgb(13, 13, 76)";
        this.context.beginPath();
        this.context.roundRect(0, 0, this.WIDTH, this.HEIGHT, 0);
        this.context.stroke();
        this.context.fill();
    }
     /************* 안내문구추가 ***************/
    guideText(){
        if(this.WIDTH < 232){
            this.context.font = "1.7rem dimibang_new";
        }else{
            this.context.font = "2.5rem dimibang_new";
        }
        this.context.fillStyle = "#fff";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText("오늘의 운세는?", this.WIDTH / 2, this.HEIGHT / 2);
    }
}