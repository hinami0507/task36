//生成随机数
function rnd(n, m) {
    return parseInt(Math.random() * (m - n) + n);
}

var oBox = document.querySelector('#box'); //获取矩阵盒子
var wallGroup = document.querySelector('#wallGroup'); //获取墙的父元素
var oUl = oBox.querySelector("ul");
var txt = document.querySelector('#txt'); //获取输入框
var start = document.querySelector('#start'); //获取start指令按钮
var clearTxt = document.querySelector('#clearTxt'); //获取clear指令按钮
var tip = document.querySelector('#tip'); //
var enableKey = document.querySelector('#enableKey'); //是否允许方向键控制
var quickInput = document.querySelector('#quickInput'); //点击button来快速添加字符
var btnGroup = document.querySelector('#btnGroup'); // 修墙之类的主功能键
var c = 11; //矩阵行数 
var cunit = 50;
var r = 11; //矩阵列数
var runit = 50;
//画矩阵，坐标系的x轴向右,y轴向下
for (var i = 0; i < c * r; i++) {
    var oLi = document.createElement('li');
    oUl.appendChild(oLi);
}


//工厂模式----创建小方块createbox()
//

function createbox() {
    this.cunit = 50; //横坐标单位
    this.vunit = 50; //纵坐标单位
    this.x = rnd(0, c); //小方块的x轴坐标
    this.y = rnd(0, r); //小方块的y轴坐标
    this.xDir = 0; //小方块水平方向
    this.yDir = 0; //小方块竖直方向
    var oBlock = document.createElement('span');
    oBox.appendChild(oBlock);
    oBlock.className = 'block';
    oBlock.id = "car";
    //边界设定，检测运动是否合法
    this.checkGo = function(x, y) {
            var flag = 1;
            var nextx = this.x + x;
            var nexty = this.y + y;
            //校验是否超出边界
            if (nexty < 0 || nexty > (c - 1) || nextx < 0 || nextx > (r - 1)) { flag = 0; }
            //校验是否碰墙了
            var i = wall.list.x.length;
            while (i--) {
                if (nextx == wall.list.x[i] && nexty == wall.list.y[i])
                    flag = 0;
            }
            return flag;
        }
    //运行
    this.go = function(x, y) {
        if (this.checkGo(x, y)) {
            this.x += x;
            this.y += y;
            oBlock.style.left = this.cunit * this.x + 'px';
            oBlock.style.top = this.vunit * this.y + 'px';
        }
    };
    //控制转向功能
    this.rot = function(xd, yd) {
            var rot = 0;
            if (!isNaN(xd)) this.xDir = xd;
            if (!isNaN(yd)) this.yDir = yd;
            if (this.xDir == -1 && this.yDir == 0) //左
                rot = -90;
            if (this.xDir == 0 && this.yDir == -1) //上
                rot = 0;
            if (this.xDir == 1 && this.yDir == 0) //右
                rot = 90;
            if (this.xDir == 0 && this.yDir == 1) //下
                rot = 180;
            oBlock.style.WebkitTransform = 'rotate(' + rot + 'deg)';
        }
        //按键移动
    this.keyDrive = function(key) {
        switch (key) { //左上右下
            case 37:
                if (this.xDir == -1 && this.yDir == 0)
                    this.go(-1, 0);
                this.rot(-1, 0);
                break;
            case 38:
                if (this.xDir == 0 && this.yDir == -1)
                    this.go(0, -1);
                this.rot(0, -1);
                break;
            case 39:
                if (this.xDir == 1 && this.yDir == 0)
                    this.go(1, 0);
                this.rot(1, 0);
                break;
            case 40:
                if (this.xDir == 0 && this.yDir == 1)
                    this.go(0, 1);
                this.rot(0, 1);
                break;
        }
    };
    //通过指令输入输入移动
    this.terminal = function(sValue) {
            switch (sValue) {
                case 'GO':
                    this.go(this.xDir, this.yDir);
                    break;
                case 'TRA LEF':
                    this.go(-1, 0);
                    break;
                case 'TRA TOP':
                    this.go(0, -1);
                    break;
                case 'TRA RIG':
                    this.go(1, 0);
                    break;
                case 'TRA BOT':
                    this.go(0, 1);
                    break;
                case 'MOV LEF':
                    this.rot(-1, 0);
                    this.go(-1, 0);
                    break;
                case 'MOV TOP':
                    this.rot(0, -1);
                    this.go(0, -1);
                    break;
                case 'MOV RIG':
                    this.rot(1, 0);
                    this.go(1, 0);
                    break;
                case 'MOV BOT':
                    this.rot(0, 1);
                    this.go(0, 1);
                    break;
                case 'BUILD':
                    this.build();
                    break;
            }
        }
        //修墙
    this.build = function() {
            var wallX = this.x + this.xDir;
            var wallY = this.y + this.yDir;
            switch (wall.allowBuild(wallX, wallY)) {
                case 1: //表示可以修墙
                    wall.createWall(wallX, wallY);
                    break;
                case 2: //表示超过边界了
                    console.log("坐标：(" + wallX + "." + wallY + ")这个地方已经超出边界了，你造个锤子");
                    break;
                case 3: //表示该地已经有墙了
                    console.log("坐标：(" + wallX + "." + wallY + ")这个地方已经有墙了，你造个锤子");
                    break;
                default:
                    console.log("未知错误");
                    break;
            }
        }
        //刷墙
    this.BruColor = function(wallColor) {
            var wallX = this.x + this.xDir;
            var wallY = this.y + this.yDir;
            var wallId = wall.find(wallX, wallY);
            if (!isNaN(wallId)) {
                var str = "#wall-" + wallId;
                var theWall = document.querySelector(str)
                theWall.style.backgroundColor = wallColor;
            } else {
                console.log("坐标：(" + wallX + "." + wallY + ")没有墙Σ( ° △ °|||)︴，你刷个锤子");
            }
        }
        //初始化
    this.init = function() {
        oBlock.style.WebkitTransform = 'rotate(0deg)';
        oBlock.style.left = this.cunit * this.x + 'px';
        oBlock.style.top = this.vunit * this.y + 'px';
    }
}

//实例化小方块
var box1 = new createbox();
box1.init();


//通过按键来控制小方块
window.addEventListener("keydown", function(event) {
    if (enableKey.checked == true) //检查使能端是否打开
        box1.keyDrive(event.keyCode);
})

//
var consoler_error_handler;
var consoler = document.querySelector("#consoler");
var LineNum = document.querySelector("#LineNum"); //行号
var iNode = document.createElement('li'); //
var row = 1;

//记录并且处理输入的指令
txt.addEventListener('input', function() {
        var arr = txt.value.split(/\n/); //将输入的用\n拆分放入数组
        var len = arr.length; //当前行数
        while (len > row) {
            row++;
            LineNum.appendChild(iNode.cloneNode(false));
        }
        while (len < row) {
            row--;
            LineNum.removeChild(LineNum.lastChild);
        }
        //延迟1秒对输入进行校验
        clearTimeout(consoler_error_handler);
        consoler_error_handler = setTimeout(function() {
            check_consoler_errors(arr);
        }, 1000);
        //保存指令
        consoler.dataset.cmd = JSON.stringify(arr);
    })
//通过滚动调整行号
LineNum.appendChild(iNode.cloneNode(false))
txt.addEventListener('scroll', function() {
    LineNum.style.top = -txt.scrollTop + 'px';
});
//焦点移出时校验
LineNum.addEventListener('blur', function() {
    clearTimeout(consoler_error_handler);
    check_consoler_errors(JSON.parse(consoler.dataset.cmd || '[]'));
});

var reg = /^go \d{1,2}|mov (rig|top|lef|bot) \d{1,2}|tra (rig|top|lef|bot) \d{1,2}$/i;

//正则表达式校验函数
function check_consoler_errors(arr) {
    var errors = [];
    arr.forEach(function(e, index) {
        console.info(e);
        console.info(reg.test(e));
        if (!reg.test(e)) {
            errors.push(index);
            LineNum.children[index].classList.add('error');
        } else {
            LineNum.children[index].classList.remove('error');
        }
    });
    consoler.dataset.errors = JSON.stringify(errors);
}

//点击验证，提交动作
start.addEventListener("click", function() {
        if (!(JSON.parse(consoler.dataset.errors || '[]').length > 0)) {
            var cmdArr = JSON.parse(consoler.dataset.cmd) //取得指令队列
            cmdArr.forEach(function(item, index, array) {
                var action = item.split(/ \d/)[0]; //取得指令方法
                action = action.toUpperCase(); //全部转化为大写
                var acTime = item.replace(/[^0-9]+/g, '') - 0; //取得指令的次数
                var ac = 0;
                while (ac < acTime) {
                    ac++;
                    setTimeout(function() { box1.terminal(action); }, 1000 * index + 500 * ac);
                }
            })
        } else {
            alert('指令格式错误，不要输入一些奇奇怪怪的东西凸(艹皿艹 )');
        }
    })


//清除输入宽内容
clearTxt.addEventListener("click", function() {
    txt.value = "";
    row = 1;
    LineNum.innerHTML = "<li></li>";
})

//右边快捷输入字符
quickInput.addEventListener("click", function(event) {
    if (event.target.nodeName == "BUTTON")
        txt.value += event.target.innerHTML + " ";
    txt.focus();
})


//墙对象----wall
//list 保存所有墙的xy坐标和颜色
//allowBuild(x,y)：坐标(x,y)是否允许造墙，返回1：可以造墙；返回2：超过边界;返回3：已经有墙；
//find(x,y)：坐标(x,y)是否有墙,若有返回墙Id
//ranBuild()：随机造墙
//createWall(x,y)：在坐标(x,y)造墙，并且存入list中
var wall = {
    list: { "x": [], "y": [], "color": [] },
    allowBuild: function(x, y) {
        var i = this.list.x.length;
        if (y < 0 || y > (c - 1) || x < 0 || x > (r - 1)) {
            return 2; //返回2表示超过边界了
        }
        //检测生成的墙的位置是否已经有墙或者有小方块
        while (i--) {
            if ((this.list.x[i] == x && this.list.y[i] == y) || (box1.x == x && box1.y == y)) {
                return 3; //返回3表示已经有墙了
            }
        }
        return 1; //返回1表示可以造墙
    },
    find: function(x, y) {
        var i = this.list.x.length;
        while (i--) {
            if (this.list.x[i] == x && this.list.y[i] == y) {
                return i;
            }
        }
    },
    ranBuild: function() {
        if (c * r - 2 >= this.list.x.length) {
            var x = rnd(0, c);
            var y = rnd(0, r);
            //检测是否重复或者是box1的坐标，重新随机x，y轴坐标
            while (this.allowBuild(x, y) != 1) {
                var x = rnd(0, c);
                var y = rnd(0, r);
            }
            this.createWall(x, y);
        }
    },
    createWall: function(x, y) {
        this.list.x.push(x);
        this.list.y.push(y);
        this.list.color.push("green");
        var oBlock = document.createElement('span');
        oBlock.className = 'wall';
        var len = this.list.x.length;
        var last = len - 1;
        oBlock.id = "wall-" + last;
        oBlock.style.left = this.list.x[last] * cunit + 'px';
        oBlock.style.top = this.list.y[last] * runit + 'px';
        oBlock.style.backgroundColor = this.list.color[last];
        wallGroup.appendChild(oBlock);
    }
}


//刷墙按钮
var bruColor = document.querySelector("#bruColor");
subColor.addEventListener("click", function() {
        box1.BruColor(bruColor.value);
    })
//清除墙按钮
var clearWalls = document.querySelector("#clearWalls");
clearWalls.addEventListener("click", function() {
    wallGroup.innerHTML = "";
    wall.list = { "x": [], "y": [], "color": [] };
})
