export default class CanvasUtil {
    constructor(canvasRef, options = {}) {
        if (!canvasRef || !canvasRef.value) {
            throw new Error('Canvas element is null or undefined.');
        }

        this.mainCanvas = canvasRef.value;
        this.mainContext = this.mainCanvas.getContext('2d');

        this.tempCanvas = document.createElement('canvas');
        this.tempContext = this.tempCanvas.getContext('2d');

        this.imageCache = {};
        this.canvasData = [];
        this.indices = [];
        this.rectArea = {
            rx: '',
            ry: '',
            rWidth: '',
            rHeight: ''
        };
        
        this.configure(options);
    }

    configure(options) {
        this.mainCanvas.width = options.width || document.documentElement.clientWidth;
        this.mainCanvas.height = options.height || document.documentElement.clientHeight;

        this.tempCanvas.width = this.mainCanvas.width;
        this.tempCanvas.height = this.mainCanvas.height;

        // 字体颜色
        this.color = options.color || '#767988';

        // 圆圈半径
        this.circleRadius = options.circleRadius || 2.5;

        // 标注物大小
        this.size = options.size || 35;
    }

    setData(data) {
        this.canvasData = data;
    }

    getData() {
        return this.canvasData;
    }

    setIndices(indices) {
        this.indices = indices;
    }

    getIndices() {
        return this.indices;
    }

    clearIndices() {
        this.indices = [];
    }

    setColor(color) {
        this.color = color; 
    }

    calculateRectArea() {
        var rWidth = this.mainCanvas.width * 0.7;
        var rHeight = this.mainCanvas.height * 0.85;

        // 计算矩形的位置，使其垂直居中于Canvas
        var rx = ( this.mainCanvas.width - rWidth) / 2;
        var ry = ( this.mainCanvas.height - rHeight) / 2;

        return {
            rx,
            ry,
            rWidth,
            rHeight
        }
    }

    coverImg(rect_width,rect_height,rect_x,rect_y,source_w,source_h) {
        const leftMargin = 300; // 左右留白
    const topMargin = 100; // 上下留白
    const usableWidth = rect_width - 2 * leftMargin;
    const usableHeight = rect_height - 2 * topMargin;
    
    const aspectRatio = source_w / source_h;
    let sWidth, sHeight, sx, sy;

    if (aspectRatio >= 1) { // 宽度大于等于高度
        sHeight = usableHeight;
        sWidth = sHeight * aspectRatio;
    } else { // 高度大于宽度
        sHeight = usableHeight;
        sWidth = sHeight * aspectRatio;
    }

    sx = rect_x + leftMargin + (usableWidth - sWidth) / 2;
    sy = rect_y + topMargin;

    return {
        sx,
        sy,
        sWidth,
        sHeight
    };
    }
    
    // 绘制
    async draw() {
        this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        for (var index in this.canvasData) {
            let item = this.canvasData[index];

            if (item.type == "pannel") {
                await this.drawBackground(this.tempContext, item.image);
            } else if (item.type == "zoomCircle") {
                await this.drawZoomCircle(this.tempContext, item.img, item.size, item.x, item.y);
                if (this.indices.findIndex(val => val == index) !== -1) {
                    await this.selectedZoomCircle(this.tempContext, item.size, item.x, item.y);
                }
            } else if (item.type == 'marker') {
                await this.drawMarker(this.tempContext, item.startX, item.startY, item.endX, item.endY, item.text);
            }
        }
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.mainContext.drawImage(this.tempCanvas, 0, 0);
    }

    // 绘制背景
    drawBackground(context, imgSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = imgSrc;
            img.onload = () => {
                var rectRect = this.calculateRectArea(img.width, img.height);
                context.fillStyle = "white";
                context.fillRect(rectRect.rx, rectRect.ry, rectRect.rWidth, rectRect.rHeight);
                
                var imgRect = this.coverImg(rectRect.rWidth, rectRect.rHeight, rectRect.rx, rectRect.ry, img.width, img.height);
                context.drawImage(img, imgRect.sx, imgRect.sy, imgRect.sWidth, imgRect.sHeight);
                resolve();
            };
            img.onerror = error => {
                reject(error);
            };
        })
    }

    // 绘制标注物
    drawZoomCircle(context, imgSrc, size, x, y) {
        return new Promise((resolve, reject) => {
            var img = null;

            if (this.imageCache[imgSrc]) {
                img = this.imageCache[imgSrc];
            } else {
                img = new Image();
                img.src = imgSrc;
            }

            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                var centerX = x + size / 2;
                var centerY = y + size / 2;
                var radius = Math.min(size, size) / 2;

                // 保存当前绘制环境
                context.save();

                // 绘制圆形
                context.beginPath();
                context.strokeStyle = '#9e9fa0';
                context.lineWidth = 1;
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                context.fillStyle = "white";
                context.fill();
                context.closePath();

                // 绘制圆形路径
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                context.stroke();
                context.closePath();

                // 将绘制区域限制为圆形
                context.clip();

                // 在圆形内绘制图片
                context.drawImage(img, x, y, size, size);

                // 恢复绘制环境，以便后续绘制不受影响
                context.restore();

                resolve();
            };
            img.onerror = error => {
                reject(error);
            };
        })
    }

    // 绘制线条
    drawLine(context, startX, startY, endX, endY) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();
    }

    // 绘制文本
    drawText(context, text, startX, startY, endX, endY) {
        let index = 0;
        let arr = [];         //存储计算宽度后的文本
        let tx,ty,lx = 0;     //文本x、y轴坐标
        let line = '';        //存储每行的文本
        let textWidth = 0;    //文本宽度
        const fontSize = 12;  //字体大小
        const maxWidth = 260; //最大宽度

        //使用正则表达式将文本分解成单词和标点符号
        const words = text.match(/\b\w+\b|\S/g);

        if (!words) return;

        //设置字体样式
        context.font = "12px Arial";
        context.fillStyle = this.color;

        //计算文本宽度
        for (let word of words) {
            //获取文本宽度
            let testLine = line + word;
            let testWidth = context.measureText(testLine).width;
            textWidth = testWidth;

            //如果文本宽度大于最大宽度
            if (testWidth > maxWidth) {
                arr.push(line);
                line = word;
                index += 1;
            } else {
                arr[index] = testLine;
                line = testLine;
            }
        }

        //根据y轴进行判定初始y轴坐标
        textWidth = arr.length > 1 ? maxWidth : textWidth;
        ty = startY < endY ? endY + fontSize : endY - fontSize;
        tx = startX < endX ? endX : endX - textWidth;

        //遍历数组，绘制文本
        if (startY < endY) {
            for (let item of arr) {
                context.fillText(item, tx, ty);
                ty += fontSize;
            }
        } else {
            //将数组进行倒序
            let tempArr = arr.reverse();
            for (let item of tempArr) {
                context.fillText(item, tx, ty);
                ty -= fontSize;
            }
        }

        lx = startX < endX ? endX + textWidth : endX - textWidth;
        this.drawLine(context, endX, endY, lx, endY);
    }

    //绘制圆圈
    drawCircle(context, x, y) {
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(x, y, this.circleRadius, 0, 2 * Math.PI);
        context.stroke();
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }
    
    // 绘制标记
    drawMarker(context, startX, startY, endX, endY, text = '') {
        this.drawLine(context, startX, startY, endX, endY);

        text = text == '' ? '双击以编辑文本' : text;
        this.drawText(context, text, startX, startY, endX, endY);

        let dx = endX - startX;
        let dy = endY - startY;
        let angle = Math.atan2(dy, dx);
        //let length = Math.sqrt(dx ** 2 + dy ** 2);

        //计算起点和终点圆圈的位置
        let startCircleX = startX + Math.cos(angle) * this.circleRadius;
        let startCircleY = startY + Math.sin(angle) * this.circleRadius;
        let endCircleX = endX - Math.cos(angle) * this.circleRadius;
        let endCircleY = endY - Math.sin(angle) * this.circleRadius;

        //绘制起点圆圈
        this.drawCircle(context, startCircleX, startCircleY);

        //绘制终点圆圈
        this.drawCircle(context, endCircleX, endCircleY);
    }

    //选中标注物
    selectedZoomCircle(context, size, x, y) {
        let borderSize = 3;

        context.save();
        context.beginPath();
        context.strokeStyle = '#23b6bc';
        context.lineWidth = 4;
        context.strokeRect(x - borderSize, y - borderSize, size + 2 * borderSize, size + 2 * borderSize);
        context.closePath();
        context.restore();
    }

    // canvas返回Blob
    saveCanvasRegionAsBlob(graph) {
        return new Promise((resolve) => {
            var rectRect = this.calculateRectArea();

            // 创建临时canvas
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = rectRect.rWidth;
            croppedCanvas.height = rectRect.rHeight;
            const croppedContext = croppedCanvas.getContext("2d");

            // 清空临时画板
            this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

            // 绘制数据到临时画板上
            const drawData = async () => {
                for (var item of graph.data) {
                    if (item.type == "pannel") {
                        await this.drawBackground(this.tempContext, item.image);
                    } else if (item.type == "zoomCircle") {
                        await this.drawZoomCircle(this.tempContext, item.img, item.size, item.x, item.y);
                    } else if (item.type == 'marker') {
                        await this.drawMarker(this.tempContext, item.startX, item.startY, item.endX, item.endY, item.text);
                    }
                }
            };

            // 执行异步绘制操作
            drawData().then(() => {
                croppedContext.clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);
                croppedContext.drawImage(this.tempCanvas, rectRect.rx, rectRect.ry, rectRect.rWidth, rectRect.rHeight, 0, 0, croppedCanvas.width, croppedCanvas.height);

                //croppedContext.drawImage(this.tempCanvas, rectRect.rx + 1, rectRect.ry + 1, rectRect.rWidth - 1, rectRect.rHeight - 1, 0, 0, rectRect.rWidth, rectRect.rHeight);

                croppedCanvas.toBlob(function (blob) {
                    resolve(blob);
                });
            });
        });
    }
}