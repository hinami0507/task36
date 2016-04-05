# task36
小方块4
将所有模块封装了---
主要有三大类createbox() ,shell{} ,wall{}


## 工厂模式----创建小方块createbox()
+ this.cunit = 50; //横坐标单位
+ this.vunit = 50; //纵坐标单位
+ this.x = rnd(0, c); //小方块的x轴坐标
+ this.y = rnd(0, r); //小方块的y轴坐标
+ this.xDir = 0; //小方块车头水平方向
+ this.yDir = -1; //小方块车头竖直方向
+ var oBlock = document.createElement('span');
+ checkGo(x,y),   当前坐标加上(x,y)向量，判断该移动是否合法，合法：返回1;  不合法：返回0;
+ go(x,y),        当前坐标加上(x,y)向量进行移动。
+ rotate(xd,yd)   xd=-1向左;xd=1向右;xd=1向下;xd=-1向上;为0表示不朝向
+ keyDrive(key)   通过键盘控制方块移动，key的值对应：37左，38上，39右，40下；
+ terminal(sValue)  通过输入的sValue做出移动和转向判断
+ build()         根据当前坐标，车头方向---在车头方向造墙，依赖wall.allowBuild(wallX, wallY)
+ BruColor(wallColor) 将车头的墙改变颜色为wallColor;
+ init()         初始化,确定小方块坐标和车头方向；


## 指令-对象-shell{}
init() 初始化
check() 核对this.cmdArr中的指令是否正确，将不正确的指令序号放入errorList[]中
submit() 提交指令，核对指令是否全部正确，并且解析指令
synLinNum() //更新行号，并且隔1秒验证一次
getCmd() //获取指令并且切分


## 墙-对象----wall{}
list 保存所有墙的xy坐标和颜色
allowBuild(x,y)：坐标(x,y)是否允许造墙，返回1：可以造墙；返回2：超过边界;返回3：已经有墙；
find(x,y)：坐标(x,y)是否有墙,若有返回墙Id
ranBuild()：随机造墙
createWall(x,y)：在坐标(x,y)造墙，并且存入list中

初步把模块都分离出来，非常低的耦合度，之后会加一些有趣的功能~~~hinami

