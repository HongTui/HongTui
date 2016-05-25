$(function(){
    template.helper('fmtMoney', function(money, length, isYuan){
		return Util.fmtMoney(money, length, isYuan);
    })
    template.helper('fmtString', function(str, len){
		return str.substr(0, len);
    })

	var config = {
		data: {
			Page: 0,
			PageSize: 10,
			TotalPage: 0,
			Category: ""
		}
	};
	var $result_list = $("#result-con");
	var $allCheck = $(".hongtui-result-box .checkbox2-box .checkbox2");

	function getList(){
		var ajaxParams = {
			url: config_ajax[config_ajax.envir].getCart,
			type: 'GET',
			data: {
				Page: config.data.Page,
				PageSize: config.data.PageSize
			},
			succFn: function(data){
				data.TotalPage = Math.ceil(data.TotalCount/data.PageSize) - 1;
				config.data.TotalPage = data.TotalPage;
				$result_list.html(template('temp_list', data));
				$("#page_flip").html(template('temp_flip', data))
			}
		};
		Util.requestAjaxFn(ajaxParams);
	};
	getList();
	//首页、上一页、下一页、末页
	$("#page_flip").on('click', '.homepage', function(){
		if($(this).hasClass('disabled')) return;

		config.data.Page = 0;
		getList();
	}).on('click', '.previous', function(){
		if($(this).hasClass('disabled')) return;
		
		var page = config.data.Page - 1;
		if(page >= 0){
			config.data.Page = page;
		}
		getList();
	}).on('click', '.next', function(){
		if($(this).hasClass('disabled')) return;
		
		var page = config.data.Page + 1;
		if(page <= config.data.TotalPage){
			config.data.Page = page;
		}
		getList();
	}).on('click', '.lastpage', function(){
		if($(this).hasClass('disabled')) return;

		config.data.Page = config.data.TotalPage;
		getList();
	})

	//点击删除触发事件
	$result_list.on('click', '.delete', function(){
		var $this = $(this);
		var ajaxParams = {
			url: config_ajax[config_ajax.envir].operFav,
			type: "DELETE",
			data: {
				Wid: $this.attr('data-id')
			},
			succFn: function(data){
				config.data.Page = 0;
				getList();
			}
		};
		Util.requestAjaxFn(ajaxParams);
	});

	//绑定选择框事件
	$result_list.on('click', '.checkbox2', function(){
		$(this).toggleClass('checked');
		getChoiceNum();
	})
	//绑定全选事件
	$allCheck.on('click', function(){
		if($(this).hasClass('checked')){
			$allCheck.removeClass('checked');
			$result_list.find('.checkbox2').removeClass('checked');
		}else{
			$allCheck.addClass('checked');
			$result_list.find('.checkbox2').addClass('checked');
		}
		
		getChoiceNum();
	})
	//设置选中的个数
	function getChoiceNum(){
		var len = $result_list.find(".checkbox2.checked").length;
		$("#choise_num").html(len);
		if(len == $result_list.find(".checkbox2").length){
			$allCheck.addClass('checked');
		}else{
			$allCheck.removeClass('checked');
		}
	}
	//立即报价点击事件
	$(".quoted-price").on("click",function(){
		var arrId = [];
		$(".result-content .checkbox2").each(function(){
			var _this = $(this);
			if(_this.hasClass("checked")){
				var idforpush = parseInt(_this.attr("data-id"));
				arrId.push(idforpush);
			}
		});
		if(arrId.length>0){
			var ajaxParams = {
				url: config_ajax[config_ajax.envir].order,
				type: config_ajax[config_ajax.envir].type,
				data: {
					Id: arrId
				},
				succFn: function(data){
					var left = $(window).width()/2;
	                var top = $(window).height()/2 + $(window).scrollTop();
	                var changeWidth = $(".pop-ups").width();
	                var changeHeight = $(".pop-ups").height();
					$(".pop-ups").css({"width":changeWidth + "px","height":changeHeight + "px","left":left-changeWidth/2 + "px","top":top-changeHeight/2 +"px"}).show();
				}
			};
			Util.requestAjaxFn(ajaxParams);
		}else{
			alert("请先选择要报价的账号！");
		}
	});
	//弹框相关操作
	$(".pop-ups .close,.pop-ups .cancle,.pop-ups .certain").on("click",function(){
		$(".pop-ups").hide();
	});
	//hover显示二维码图片
	$("#result-con").on('mouseenter','.icon-02',function(){
		$(this).parents(".accountnum").next(".webchat-codes").css("left","86px").show();
	}).on('mouseleave','.icon-02',function(){
		$(this).parents(".accountnum").next(".webchat-codes").hide();
	})
});








