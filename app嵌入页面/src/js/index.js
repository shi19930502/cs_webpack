import '../css/index.scss';
var token = '';
var sellerId = '';
var parameter = window.location.search
var dataObj={}
if(parameter && parameter.indexOf('?') >= 0) {
	token = parameter.slice(1).split('&')[0]
	sellerId = parameter.slice(1).split('&')[1]
}
var myChart = echarts.init(document.getElementById('orderChart'))
var option = {
	title: {
		text: ''
	},
	legend: {
		data: [{ name: '数量' }, { name: '金额' }],
		x: 'center',
		show: true,
	},
	grid: {
		bottom: '3%',
	},
	xAxis: {
		boundaryGap: false,
		data: []
	},
	yAxis: [{
			type: 'value',
			position: 'right',
			name: '数量(单)',
		},
		{
			type: 'value',
			name: '金额(元)',
			position: 'left',
			axisLabel: {
				formatter: '{value}'
			},
			splitLine: {
				show: false //不显示Y轴的横线
			},
			axisTick: {
				show: true, //这里是要不要下面的juju
			},
		},
	],
	series: [{
			name: '数量',
			type: 'line',
			data: [],
			//			smooth: true,
		},
		{
			name: '金额',
			type: 'line',
			yAxisIndex: 1,
			//			smooth: true,
			data: [],
			itemStyle: {
				normal: {
					color: 'rgb(255,162,38)'
				}
			},
		}
	]
};
// 使用刚指定的配置项和数据显示图表。 
myChart.setOption(option);
(function() {
	//处理数据
	disposeDate();
	//echart数据处理
	getChartArr();
	
})()
//处理数据
function disposeDate() {
	ajax({
		url: URL_API + "customer/queryStatisticalAnalysisByCustomerId",
		param: {
			token: token,
		}
	}).then((data) => {
		var d = data.aaData
		dataObj=d
		$('#customerHeadPic').attr({ src: URL_IMG+d.customerHeadPic })
		$('#customerInfoName').text(d.customerInfo.name)
		$('#productcollectionCount').text(d.productcollectionCount)
		$('#orderCount7Days').text(d.orderCount7Days)
		$('#orderTotalAmount7Days').text(d.orderTotalAmount7Days.toFixed(2))
		$('#orderSubmitRadio7Days').text(d.orderSubmitRadio7Days.toFixed(2) + '%')
		$('#saleSKUAllCount').text(d.saleSKUAllCount)
		$('#saleSKURadio30Days').text(d.saleSKURadio30Days.toFixed(2))
		$('#yestodayOrderCount').text(d.yestodayOrderCount)
		$('#yestodayOrderTotalAmount').text(d.yestodayOrderTotalAmount.toFixed(2))
		for(var m = 0; m < d.storeScore.length; m++) {
			$('#reviewName_' + m).text(d.storeScore[m].reviewName)
			$('#typeScore_' + m).text(d.storeScore[m].typeScore)
		}
		d.salesSKUSortForWeek = d.salesSKUSortForWeek.splice(0, 3)
		var forWeekStr = '';
		if(d.salesSKUSortForWeek.length>=0){
			$('#weekList').css({display:'block'})
		}
		for(var a = 0; a < d.salesSKUSortForWeek.length; a++) {
			var num = '一';
			if(a == 0) { num = '一' } else if(a == 1) { num = '二' } else if(a == 2) { num = '三' }
			var str = `<div class="content">
				<ul>
					<li>第${num}：<span>${d.salesSKUSortForWeek[a].productName}&nbsp;(${d.salesSKUSortForWeek[a].skuName})</span></li>
					<li>${d.salesSKUSortForWeek[a].saleTotal}&nbsp;<span class='unit'>${d.salesSKUSortForWeek[a].measureName}</span></li>
				</ul>
				<ul>
					<li>销售金额占比</li>
					<li>${(d.salesSKUSortForWeek[a].saleAmountTotal/d.orderTotalAmount7Days*100).toFixed(2)}%</li>
				</ul>
			</div>`
			forWeekStr += str;
		}
		$('#salesSKUSortForWeek').html(forWeekStr)
		//因为接口还没有传上去，先判断一下
		if(d.OrderTotalByPayTypeLastDay||d.OrderTotalByPayTypeLastMonth||d.OrderTotalByPayTypeLastWeek){
			//支付类型与收款金额
			$('#zfMoneyHeader').css({display:'block'})
			getZfMoney();
		}
		
	})
}
function getChartArr() {
	var timeName = '近一周';
	var startTime = getDate(6);
	var endTime = getDate(0);
	$('.order_header ul li').click(function() {
		$('.order_header ul li').css({ color: '#848484',borderBottom:'none' })
		$(this).css({ 
			color: '#C5092C',
			borderBottom: "0.04rem solid #C5092C"
		})
		timeName = $(this).html()
		endTime = getDate(0)
		if(timeName == '近一周') {
			startTime = getDate(6)
		} else if(timeName == '近半月') {
			startTime = getDate(14)
		} else if(timeName == '近一月') {
			startTime = getDate(29)
		}
		searchDate(startTime, endTime)
	})
	searchDate(startTime, endTime)
}
function getZfMoney(){
	var timeName = '昨日';
	var arr=dataObj.OrderTotalByPayTypeLastDay.aaData;
	$('.zf_money_header ul li').click(function() {
		$('.zf_money_header ul li').css({ color: '#848484',borderBottom:'none' })
		$(this).css({ 
			color: '#C5092C',
			borderBottom: "0.04rem solid #C5092C"
		})
		timeName = $(this).html()
		if(timeName == '昨日') {
			arr=dataObj.OrderTotalByPayTypeLastDay.aaData
		} else if(timeName == '近7日') {
			arr=dataObj.OrderTotalByPayTypeLastWeek.aaData
		} else if(timeName == '近30日') {
			arr=dataObj.OrderTotalByPayTypeLastMonth.aaData
		}
		getHtml(arr)
	})
	getHtml(arr)
}
function getHtml(arr){
	var htmlStr='';
	for(var a=0;a<arr.length;a++){
		var str="<ul><li>"+arr[a].payType+"</li>"
		+"<li>"+arr[a].orderCount+"</li>"
		+"<li>"+arr[a].orderTotalAmount+"</li></ul>"
		htmlStr= htmlStr + str
	}
	htmlStr=htmlStr+'<div class="notice">*注：该表的统计范围为截止昨日22点30分已支付的订单。</div>'
	$('#orderList').html(htmlStr)
}
function searchDate(startTime, endTime) {
	ajax({
		url: URL_API + "order/getOrderSum",
		param: {
			startTime: startTime,
			endTime: endTime,
			sellerId: sellerId,
			token: token,
		}
	}).then(d => {
		if(d.aaData.length > 0) {
			lineChart(d.aaData)
		}
	})
}

function lineChart(d) {
	var orderDate = [],
		orderCount = [],
		orderTotal = [];
	for(let a = 0; a < d.length; a++) {
		var arr = d[a].orderDate.split('-')
		if(arr[1][0] == 0) {
			arr[1] = arr[1][1]
		}
		if(arr[2][0] == 0) {
			arr[2] = arr[2][1]
		}
		orderDate.push(arr[1] + '/' + arr[2])
		orderCount.push(d[a].orderCount)
		orderTotal.push(d[a].orderTotal)
	}
	myChart.setOption({
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			data: orderDate
		},
		series: [{
			name: '数量',
			// 根据名字对应到相应的系列
			data: orderCount,
		}, {
			name: '金额',
			// 根据名字对应到相应的系列
			data: orderTotal,
		}]
	})
}
//common
function ajax({
	url: url,
	param: param,
	type: type,
} = {}) {
	if(type == 'post' || type == 'get') {
		type = type
	} else {
		type = 'post'
	}
	return new Promise((resolve, reject) => {
		$.ajax({
			type: type,
			url: url,
			async: true,
			data: param,
			success: function(d) {
				if(d.success) {
					resolve(d)
				} else {
					alert(d.msg)
				}
			}
		});
	})
}
function getDate(n) {
	var now = new Date;
	now.setDate(now.getDate() - n);
	var nowY = now.getFullYear();
	var nowM = now.getMonth() + 1;
	var nowD = now.getDate();
	var enddate = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
	return enddate;
}