$(function() {
	var zhiwu = ""
	var chanzi = ""
	zhiwujihe = [];
	var zidanjihe = [];
	var jiangshijihe = [];
	var wumaijihe=[[],[],[],[],[]]
	var x;
	var wumaitime,
	wumaimovetime,
	t,
	zidanbiansetime,
	xiaochuwumaitime,
	zidanmove,
	yangguangmove;
	///////////////生成土地
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 9; j++) {
			$("<li>").attr("data-id", i + "-" + j).appendTo($(".tudi ul"))
		}
	}
	///////////////生成雾霾
	for (var i = 0; i < 5; i++) {
		$("<li>").attr("id", "w" + i).appendTo($(".wumai ul"))
	}
	/////////////随机出现雾霾  
	wumaitime=setInterval(function() {
		var xx = Math.floor(Math.random() * 5)
		$("<div data-idd=" + xx + "><div class='wumaikuang'></div></div>").addClass("wumaitu").appendTo($('.wumai li:eq(' + xx + ')'))
		var w={shengming:5}
		wumaijihe[xx].push(w)
		console.log(wumaijihe)
	}, 10000);
	wumaimovetime=setInterval(function() {
		$('.wumaitu').animate({
			left: "-=1"
		}, 40);
	},40)
	////////////点击获取每种植物
	$(".zhiwu").on("click", "li", function() {
		//////////////判断是否冷却
		if ($(this).find("div").hasClass("lengque")) {
			$("<div>").addClass("cd").appendTo("body")
			setTimeout(function() {
				$(".cd").remove()
			}, 1500)
		} else {
			/////////////判断阳光数量是否够
			if ($(".yangguangshu").text() - $(this).text() >= 0) {
				zhiwu = $(this).attr("class")
				$(".yangguangshu").html($(".yangguangshu").html() - $(this).html())
				$("<div>").addClass("lengque").appendTo($(this)).animate({
					height: 0
				}, 15000, function() {
					$(".lengque").remove()
				})
			} else {
				$("<div>").addClass('buzu').appendTo("body")
				setTimeout(function() {
					$(".buzu").remove()
				}, 2000)
			}
		}
	})
	//植物动态
	function Zhiwu(id, type, spec, speed, el) {
		this.id = id;
		this.timerId = null;
		this.type = type;
		this.spec = spec;
		this.speed = speed;
		this.el = el;
	}
	///植物方法
	Zhiwu.prototype.sheji = function() {
		var self = this;
		if (self.type === 'wandou') {
			this.timerId = setInterval(function() {
				if($(self.el).is(".wandou")){
					var mxs=self.id.slice(0,1)
					if($('.wumai li:eq('+mxs+') div').is(".wumaitu")){
						$('<div>')
						.addClass('zidan')
						.attr('data-speed', self.speed)
						.appendTo($(self.el))
					}
				}
			}, this.spec);
		} else if (self.type === 'xiangrikui') {
			this.timerId = setInterval(function() {
				if($(self.el).is(".xiangrikui")){
					$('<div>')
					.addClass('yangguang')
					.attr('data-speed', self.speed)
					.appendTo($(self.el));
				}
			}, this.spec);
		}
	}
	//植物动态停止
	Zhiwu.prototype.tingzhisheji = function() {
		clearInterval(this.timerId);
	}
	//////////////点击种植植物或删除植物
	$(".tudi").on("click", "li", function(e) {
		if (zhiwu.length !== 0) {
			$(this).addClass(zhiwu)
			if ($(this).hasClass('wandou')) {
				var ids = $(this).attr('data-id')
				var p = new Zhiwu(ids, zhiwu, 5000, 2, this);
				zhiwujihe.push(p);
				$('.wumai li').has('.wumaitu').each(function(i, v) {
					var mxs = Number($(v).find('.wumaitu').attr('data-idd'))
					$(zhiwujihe).each(function(j, m) {
						if (Number(m.id.slice(0, 1)) === mxs) {
							m.sheji();
						}	
					})
				})
			} else if ($(this).hasClass('xiangrikui')) {
				var ids = $(this).attr('data-id')
				var r = new Zhiwu(ids, zhiwu, 15000, 1, this);
				zhiwujihe.push(r);
				r.sheji();
			} else if ($(this).hasClass('huopen')){
				$("<div>").addClass("huo").appendTo($(this))
			} else if($(this).hasClass('lajiao')){
				lajiaoqingchu();
			}
			zhiwu = '';
		} else if (chanzi.length !== 0) {
			var ss=this
			zhiwujihe=$.grep(zhiwujihe,function(v,i){
				return $(ss).attr("data-id")!==v.id
			})
			$(this).removeClass().html('')
			chanzi = ""
		} else {
			return
		}
	})
	/////////整体界面时间函数
	t = setInterval(function() {
		$('.zidan').css({
			left: function(i, v) {
				return parseInt(v) + parseInt($(this).attr('data-speed'));
			}
		})
		$('.yangguang').css({
			top: function(i, v) {
				return parseInt(v) - parseInt($(this).attr('data-speed'));
			}
		})
	}, 13)
	////////////子弹变色
	zidanbiansetime=setInterval(function() {
		$('.huo').each(function(i, v) {
			var els = Math.floor($(v).offset().left);
			var elm = Math.floor($(v).offset().top);
			$('.zidan').each(function(j, m) {
				var elss = Math.floor($(m).offset().left);
				var eln = Math.floor($(m).offset().top);
				if($(v).parent().attr("data-id").slice(-1)>$(m).parent().attr("data-id").slice(-1)){
					if (0<elss-els&&elss-els<50 && eln === elm) {
						$(m).addClass("hongzidan")
					}
				}	
			})
		})
	}, 1)
// 辣椒清除
	function lajiaoqingchu(){
		setTimeout(function(){
		   if($('.tudi .lajiao').length!==0){
		   	var a=$('.tudi .lajiao');
		   	var data=a.attr('data-id');
		   	qingchu(data,a);
		   }
		},1500)   
	}
    // 界面移除辣椒 并且清除当前一排雾霾
    function qingchu(f,a){
     	a.parent().find('li[data-id='+f+']').removeClass('lajiao');
     	var f=f.substring(0,1);
		var dqwumai=$('.wumai ul li:eq('+f+')').find('.wumaitu');
		dqwumai.animate({'opacity':'0'},1000)
		dqwumai.remove();      
	}
	///////////////////暂停游戏函数
	// function stop(){
	// 	$("<div>").addClass('zanting').appendTo(".beij")
	// 	clearInterval(wumaitime)
	// 	clearInterval(wumaimovetime)
	// 	clearInterval(t)
	// 	clearInterval(zidanbiansetime)
	// 	clearInterval(xiaochuwumaitime)
	// 	clearInterval(zidanmove)
	// 	clearInterval(yangguangmove)
	// }
	//////////////////游戏暂停
	// $(".stop").on("click",function(){
	// 	stop()
	// 	$("<div>").addClass("tingzhi").appendTo(".zanting")
	// 	$("<div>").addClass("jixu").appendTo(".tingzhi")
	// 	$("<div>").addClass("caidan").appendTo(".tingzhi")
	// 	/////////////////点击菜单
	// 	// $(".tingzhi").on("click",'.caidan',function(){
	// 	// 	$(".zanting").remove()
	// 	// })
	// 	///////////////继续游戏
	// })
	//消除雾霾
	xiaochuwumaitime=setInterval(function() {
		$('.wumaikuang').each(function(i, v) {
			var els = Math.floor($(v).offset().left);
			var elm = Math.floor($(v).offset().top);
			// ////////////////游戏结束
			// if(els<100){
			// 	stop()
			// 	$("<div>").addClass("jieshu").appendTo(".zanting")
			// 	$("<div>").addClass("chongxin").appendTo(".jieshu")
			// 	$("<div>").addClass("caidan").appendTo(".jieshu")
			// 	/////////////////点击菜单
			// 	$(".zanting").on("click",'.caidan',function(){
			// 		$(".zanting").remove()
			// 	})
			// 	//////////////重新开始

			// 	return
			// }
			$('.zidan').each(function(j, m) {
				var elss = Math.floor($(m).offset().left);
				var eln = Math.floor($(m).offset().top);
				if (elss >= 1300) {
					$(m).remove();
				}
				if ( 0<elss-els&&elss-els<50 && eln === elm) {
					if($(m).hasClass('hongzidan')){
						wumaijihe[$(m).parent().attr("data-id").slice(0,1)][0]['shengming']-=2;
					}
					else{
						wumaijihe[$(m).parent().attr("data-id").slice(0,1)][0]['shengming']-=1;
					}
					if(wumaijihe[$(m).parent().attr("data-id").slice(0,1)][0]['shengming']<=0){
						wumaijihe[$(m).parent().attr("data-id").slice(0,1)].shift();
						$(v).parent().remove();
						$(m).remove();
						return;
					}
					console.log(wumaijihe[$(m).parent().attr("data-id").slice(0,1)][0]['shengming'])
					$(m).remove();
				}
			})
		})
	}, 1)
	//////////////////点击吸尘器消除雾霾
	$(".xiaodu ul").on("click","div",function(){
		var sss=$(this).parent()
		$(this).animate({left:1200},4000,function(){
			qingchu($(sss).attr("da"),$(sss).find("div"))
			$(sss).find("div").remove()
		})
	})
	// //////////////收集阳光
	$(document).on("click", ".yangguang", function() {
		x = Number($(".yangguangshu").html()) + 25
		$(".yangguangshu").html(x)
		console.log(this)
		$(this).remove()
	})

	///////////////铲子
	$(".chanzi").on("click", function() {
		chanzi = "chanzi"
	})
})