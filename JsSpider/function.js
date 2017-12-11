var min = new Array(20);//页脚最小值
var max = new Array(20);//页脚最大值
var avg = new Array(20);
var showType = 3; //1:所有赔率 2:初盘
//格式化数据
function formatData(strnum, digit) {
    if (strnum == "") return "";
    var strnum = Math.abs(strnum).toString();
    if (strnum.indexOf(".") == -1) strnum += ".";
    var nil = ((Math.pow(10, digit + 1)).toString()).substring(1, digit);
    strnum += nil;
    var numf = parseFloat(strnum) + parseFloat("0.0" + nil + "5");
    var snum = numf.toString();
    return snum.substring(0, snum.indexOf(".") + digit + 1);
}
//展示时间
function showDate(t1, type) {
    var t2 = t1.split(",");
    var t = new Date(t2[0], eval(t2[1]), t2[2], t2[3], t2[4], t2[5]);
    var date = new Date();
    t = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()));
    var nums = t.getTime() - date.getTime()
    var minutes = Math.floor(nums / (60 * 1000))
    var y = t.getFullYear();
    var M = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    if (M < 10) M = "0" + M;
    if (d < 10) d = "0" + d;
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (type == 1)
        return (y + '年' + M + "月" + d + "日" + h + ":" + m);
    else {
        if (minutes < 0 && minutes >= -30)
            return ("<font style='color:red;'>" + M + "-" + d + " " + h + ":" + m + "</font>");
        else
            return (M + "-" + d + " " + h + ":" + m);
    }
}
//设置表格函数
function CreateTable() {
    for (var i = 0; i < 20; i++) {
        min[i] = 100;
        max[i] = 0;
        avg[i] = 0;
    }
    //定义需要的名称
    var Need="SB,威廉希尔(英国),立博(英国),伟德(直布罗陀),澳门,易胜博(安提瓜和巴布达)".split(",");

    var Resourt=new Array();//定义返回数组
    for (var i=0;i<8;i++){
    	Resourt[i]=new Array();
    	for (var j=0;j<Need.length+3;j++)
    		Resourt[i][j]="#";
    }
    var row=0;

    for (var i = 0; i < game.length; i++) {
        stringq = game[i].split("|");

        //筛选
        for (var k=0;k<Need.length;k++){
        	if(stringq[21]==Need[k]){
        		//这里是主要参数输出
        		Resourt[row][0]=Need[k];
		        for (var j = 3; j < 10; j++) {
		            if (showType == 3 && stringq[j + 7] != "") {
		                var odds = Number(stringq[j + 7]);

		                Resourt[row][j-2]=formatData(odds, 2).toString();
		            }
		            else
		                Resourt[row][j-2]=formatData(stringq[j], 2).toString();
		        }
		        Resourt[row][8]=showDate(stringq[20], 2).toString(); //显示时间
		        row++;
        	}
        }
        
        //计算平均
        for (var j = 3; j <= 19; j++) {
            if (stringq[j] == "") stringq[j] = stringq[j - 7];
            var stra = Number(stringq[j]);
            if (stra < min[j]) min[j] = stra;
            if (stra > max[j]) max[j] = stra;
            avg[j] += stra;
        }
    }
    //设置页脚平均值函数
    Resourt[row][0]="初盘平均";
    Resourt[row+1][0]="即时平均";
    var numcount = game.length;
    for (var i = 10; i < 17; i++) {
    	var avgF = formatData(avg[i - 7] / numcount, 2); //这个是初盘平均
        var avgR = formatData(avg[i] / numcount, 2);  //这个是即时平均
        Resourt[row][i-9]=avgF.toString();
    	Resourt[row+1][i-9]=avgR.toString();
    }

    return Resourt;
}
//自定义返回
var str="";
array=CreateTable();
for (var i =0;i<array.length;i++){
    for (var j=0;j<array[i].length;j++){
        str+=array[i][j]+";";
    }
    if(i!=array.length-1)
        str+="|";
}
return str;