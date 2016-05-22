$(function(){
    template.helper('fmtMoney', function(money, length, isYuan){
		return Util.fmtMoney(money, length, isYuan);
    })

	var config = {
		data: {
			Page: 0,
			PageSize: 10,
			TotalPage: 0,
			Category: ""
		},
		_envir: 'local'
	};
	var $category = $("#search_category,#search_category_nore");
	var $priceItem = $("#PriceItem");
	var $priceItem_type = $("#PriceItem_type");
	var $funs = $('#FunsItem');
	var $readItem_type = $("#readItem_type");
	var $readItem = $("#readItem");

	function getList(){
		var $price = $priceItem.find('.item.current');
		var $fun = $funs.find('.item.current');

		var dataParams = {
			Category: $category.find('.current').html(),
			PriceItem: $priceItem_type.attr('data-type'),
			PriceMin: $price.attr('data-min'),
			PriceMax: $price.attr('data-max'),
			FollowMin: $fun.attr('data-min'),
			FollowMax: $fun.attr('data-max'),
			ReadItem: $readItem_type.attr('data-type'),
			ReadMin: $readItem.find("input:eq(0)").val(),
			ReadMax: $readItem.find("input:eq(1)").val(),
			SortItem: "GTopSPrice",
			SortType: "ASC"
		};
		var ajaxParams = {
			url: config_ajax[config._envir].getMedia,
			type: config_ajax[config._envir].type,
			data: $.extend(config.data, dataParams),
			succFn: function(data){
				data.TotalPage = Math.ceil(data.TotalCount/data.PageSize) - 1;
				config.data.TotalPage = data.TotalPage;
				$("#result_totalcount").html(Util.fmtMoney(data.TotalCount, 0, true));
				$("#result-con").html(template('temp_list', data));
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

	//绑定切换查询类型的点击事件
	$(".find-items .item").on('click', function(){
		if($(this).hasClass('current')) return;

		$(this).siblings().removeClass('current');
		$(this).parents(".find-items").siblings(".find-items").find(".item").removeClass('current');
		$(this).addClass('current');
	});

	//绑定选择类型下拉框
	$(".find-items .select-box .select-item").on('click', function(){
		var $select = $(this).closest('.select-box');
		$select.find('.select').attr('data-type', $(this).attr('data-type')).html($(this).html());
		$(this).closest('.select-items').hide();
	});
	$(".find-items .select-box").on('mouseenter', function(){
		$(this).find('.select-items').show();
	}).on('mouseleave', function(){
		$(this).find('.select-items').hide();
	});
	//点击收藏触发事件
	$("#result-con").on('click', '.collect', function(){
		var type = "";
		var $this = $(this);
		if($this.hasClass('selected')){
			//取消收藏
			type = "DELETE";
		}else{
			//收藏
			type = config_ajax[config._envir].type;
		}
		var ajaxParams = {
			url: config_ajax[config._envir].operFav,
			type: type,
			data: {
				Wid: $this.attr('data-id')
			},
			succFn: function(data){
				$this.toggleClass('selected');
			}
		};
		Util.requestAjaxFn(ajaxParams);
	})
	//点击报价触发事件
	$("#result-con").on('click', '.price', function(){
		var type = "";
		var $this = $(this);
		if($this.hasClass('selected')){
			//取消报价
			type = "DELETE";
		}else{
			//添加报价
			type = config_ajax[config._envir].type;
		}
		var ajaxParams = {
			url: config_ajax[config._envir].cart,
			type: type,
			data: {
				Wid: $this.attr('data-id')
			},
			succFn: function(data){
				$this.toggleClass('selected');
			}
		};
		Util.requestAjaxFn(ajaxParams);
	})
	//hover显示二维码图片
	$("#result-con").on('mouseenter','.icon-02',function(){
		$("#result-con .webchat-codes").show();
	}).on('mouseleave','.icon-02',function(){
		$("#result-con .webchat-codes").hide();
	})
	//常见分类 更多点击事件
	$(".hongtui-box.find").on('click','.find-more',function(){
		$(".find-items.more-other").slideToggle();
		if($(".hongtui-box.find .find-more").html() == '更多<span class="find-arrow"></span>'){
			$(".hongtui-box.find .find-more").html('收起<span class="find-arrow"></span>')
		}else{
			$(".hongtui-box.find .find-more").html('更多<span class="find-arrow"></span>')
		}
	})
});








