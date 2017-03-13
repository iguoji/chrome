// 主程序
let app = {
	// 规则信息
	rules: {
		// 网站
		"www.xxbiquge.com"		: 	{
			// 目录
			catalog			: 	{
				// 匹配
				is		: 	/^\/[\w]+\/$/g,
				// 编号
				id		: 	/[\w]+/g,
				// 抓取、将返回一个以文章链接为Key，文章标题为Value的Map
				ls		: 	function(html){
					html = html.match(/<dd>(.*?)<\/dd>/g).toString();
					let map = new Map();
					$(html).find("a").each(function(idx, a){
						let key = a.getAttribute("href");
						let start = key.indexOf("/", 1) + 1;
						let end = key.indexOf(".", 1);
						map.set(key.substring(start, end), a.text);
					});
					return map;
				}
			},
			// 正文
			content			: 	{
				// 链接
				url 		: 	(catalogID, contentID) => `http://www.xxbiquge.com/${catalogID}/${contentID}.html`,
				// 内容
				txt 		: 	(html) => {
					html = $(html).find("#content").html();
					html = html.replace(/&nbsp;/g, "");
					html = html.replace(/<br><br>/g, "<br/>");
					return [...html.split("<br/>").map((p) => `<p>${p}</p>`)];
				}
			}
		},
		"www.23us.cc"			: 	{
			catalog			: 	{
				is		: 	/^\/html\/[\d]+\/[\w]+\/$/g,
				id		: 	/[\d]+\/[\d]+/,
				ls		: 	function(html){
					html = html.match(/<dd>(.*?)<\/dd>/g).toString();
					let map = new Map();
					$(html).find("a").each(function(idx, a){
						let key = a.getAttribute("href");
						let start = key.indexOf("/", 1) + 1;
						let end = key.indexOf(".", 1);
						map.set(key.substring(start, end), a.text);
					});
					return map;
				}
			},
			content			: 	{
				url 		: 	(catalogID, contentID) => `http://www.23us.cc/html/${catalogID}/${contentID}.html`,
				txt 		: 	(html) => {
					html = $(html).find("#content").html();
					html = html.replace(/&nbsp;/g, "");
					html = html.replace(/readx\(\)\;/g, "");
					html = html.replace(/\s/g, "");
					html = html.replace(/<br><br>/g, "<br/>");
					return [...html.split("<br/>").map((p) => `<p>${p}</p>`)];
				}
			}
		},
		"www.37zw.com"			: 	{
			catalog			: 	{
				is		: 	/^\/[\d]+\/[\w]+\/$/g,
				id		: 	/[\d]+\/[\d]+/,
				ls		: 	function(html){
					html = html.match(/<dd>(.*?)<\/dd>/g).toString();
					let map = new Map();
					$(html).find("a").each(function(idx, a){
						let key = a.getAttribute("href");
						let start = key.indexOf("/", 1) + 1;
						let end = key.indexOf(".", 1);
						map.set(key.substring(start, end), a.text);
					});
					return map;
				}
			},
			content			: 	{
				url 		: 	(catalogID, contentID) => `http://www.37zw.com/${catalogID}/${contentID}.html`,
				txt 		: 	(html) => {
					html = $(html).find("#content").html();
					html = html.replace(/&nbsp;/g, "");
					html = html.replace(/readx\(\)\;/g, "");
					html = html.replace(/\s/g, "");
					html = html.replace(/<br><br>/g, "<br/>");
					return [...html.split("<br/>").map((p) => `<p>${p}</p>`)];
				}
			}
		},
		"www.00kxs.com"			: 	{
			catalog			: 	{
				is		: 	/^\/html\/[\d]+\/[\w]+\/$/g,
				id		: 	/[\d]+\/[\d]+/,
				ls		: 	function(html){
					html = html.match(/<dd>(.*?)<\/dd>/g).toString();
					let map = new Map();
					$(html).find("a").each(function(idx, a){
						let key = a.getAttribute("href");
						let start = key.indexOf("/", 1) + 1;
						let end = key.indexOf(".", 1);
						map.set(key.substring(start, end), a.text);
					});
					return map;
				}
			},
			content			: 	{
				url 		: 	(catalogID, contentID) => `http://www.00kxs.com/html/${contentID}.html`,
				txt 		: 	(html) => {
					html = $(html).find("#content").html();
					html = html.replace(/&nbsp;/g, "");
					html = html.replace(/www\.00ks\.com/ig, "");
					html = html.replace(/www\.00kxs\.com/ig, "");
					html = html.replace(/readx\(\)\;/g, "");
					html = html.replace(/\s/g, "");
					html = html.replace(/<br><br>/g, "<br/>");
					return [...html.split("<br/>").map((p) => `<p>${p}</p>`)];
				}
			}
		},
	},

	// 当前源站
	source: {
		// 源站列表
		list: null,
		// 搜索关键字
		key: null,
		// 书的名称
		name: null,
		// 书的编号
		catalog_id: null,
		// 目录章节，Map类型，ID为key，标题为value
		catalog_data: null,
		// 目录地址
		catalog_url: null,
		// 文章编号
		content_id: null,
		// 下一章编号
		content_next_id: null,
		// 上一章编号
		content_prev_id: null,
		// 规则信息
		rule: null
	},

	// 构造函数
	init(){
		this.bind();
	},

	// 绑定事件
	bind(){
		// 搜索按钮
		$(".mbook-home-search button").bind("click", function(){
			var key = $(".mbook-home-search input").val().trim();
			if(key == "" || key == app.source.key){
				$(".mbook-home-search input").focus();
				return false;
			}
			app.search(key);
		});
		$(".mbook-home-option-search button").bind("click", function(){
			var key = $(".mbook-home-option-search input").val().trim();
			if(key == "" || key == app.source.key){
				$(".mbook-home-option-search input").focus();
				return false;
			}
			app.search(key);
		});
		$(".mbook-home-option-search input").bind("keyup", function(ev){
			if(ev.which == 13){
				var key = $(".mbook-home-option-search input").val().trim();
				if(key == "" || key == app.source.key){
					$(".mbook-home-option-search input").focus();
					return false;
				}
				app.search(key);
			}
		});
		// 点击章节
		$(".mbook-home-catalog").on("click", "ul li", function(){
			// 获取编号
			let contentID = $(this).data("id");
			// 显示章节
			app.content(app.source.catalog_id, contentID);
		});
		// 切换源站
		$(".mbook-home-option-source select").bind("change", function(){
			// 界面处理
			$(".loading").show();
			$(".mbook-home-content h3").html("");
			$(".mbook-home-content article").html("");
			// 当前选择章节
			let index = [...app.source.catalog_data.keys()].indexOf(app.source.content_id);
			console.log(app.source.content_id);
			console.log(index);
			// 选择的源站
			let url = $(this).val();
			// 读取目录
			app.catalog(url, false, function(){
				// 根据索引获取章节编号
				let content_id = [...app.source.catalog_data.keys()][index];
				// 读取文章
				app.content(app.source.catalog_id, content_id);
			});
		});
		// 全局按键
		$(window).bind("keyup", function(ev){
			switch(ev.which){
				// 上一章
				case 37:
					if(app.source.content_prev_id){
						app.content(app.source.catalog_id, app.source.content_prev_id);
					}
					break;
				// 下一章
				case 39:
					if(app.source.content_next_id){
						app.content(app.source.catalog_id, app.source.content_next_id);
					}
					break;
			}
		});
	},

	// 请求数据
	ajax(url, callback = () => {}, method = "GET", trace = false){
		let request = new XMLHttpRequest();
		request.timeout = trace ? 1000 : 5000;
		request.onreadystatechange = function(ev){
			if(request.readyState !== 4) return;
			if(request.status == 200){
				callback(trace ? request.responseURL : request.responseText);
			}else{
				callback(false, request.status, request.statusText);
			}
		};
		request.onerror = function(){
			callback(false, request.status, request.statusText);
		}
		request.open(method, url, true);
		request.send(null);
	},

	// 搜索小说
	search(key){
		// 0. 等待loading中
		$(".loading").show();
		app.source.key = key;
		// 1. 网络搜索获取网站列表
		this.baidu(key, function(urls){
			// 2. 循环网站列表
			app.source.list = new Set();
			for(let url of urls){
				if(app.catalog(url, app.source.list.size)) {
					app.source.list.add(url);
					$(".mbook-home-option-source select").append('<option value="' + url + '">' + url + '</option>');
					$(".mbook-home-option-source").fadeIn(300);
				}
			}
		});
	},

	// 百度数据
	baidu(key, callback){
		this.ajax("https://www.baidu.com/s?q2=" + key + "&rn=50&q5=1&tn=baiduadv", function(html){
			// 获取链接
			let urls = [];
			$(html).find(".result h3 a").each(function(idx, a){
				urls.push(a.href);
			});
			// 正确链接
			Promise.all(urls.map((url) => {
				return new Promise(function(resolve, reject){
					app.ajax(url, function(url){
						resolve(url ? url : "");
					}, undefined, true);
				});
			})).then(function(data){
				let array = [];
				for(let item of data) if(item.trim()) array.push(item.trim());
				callback(array);
			});
		});
	},

	// 显示目录
	catalog(url, isMatch = false, callback = () => {}){
		// 1. 获取域名
		let [domain] = url.match(/([a-z0-9\-]*\.)?[a-z0-9\-]*\.(com|cn|cc|la|tw|org|net)/i);
		// 2. 存在规则
		if(Reflect.has(app.rules, domain)){
			// 3. 获取规则
			let rule = app.rules[domain];
			// 4. 匹配规则
			let index = url.indexOf(domain) + domain.length;
			let string = url.substr(index);
			// 5. 成功匹配
			if(new RegExp(rule.catalog.is).test(string)){
				// 6. 目录代码
				if(!isMatch){
					app.ajax(url, function(html){
						if(!html){
							$(".loading").fadeOut(300);
							console.log("目录异常：", url, html);
							return;
						}
						// 7. 信息保存
						app.source.catalog_id = typeof rule.catalog.id == "function" ? rule.catalog.id(string) : string.match(rule.catalog.id)[0];
						app.source.catalog_url = url;
						app.source.rule = rule;
						$(".mbook-home-catalog h3").html(app.source.key);
						// 8. 得到目录
						app.source.catalog_data = rule.catalog.ls(html);
						// 9. 显示目录
						let catalog_html = "";
						for(let [id, title] of app.source.catalog_data){
							catalog_html += '<li data-id="' + id + '">' + title + '</li>';
						}
						$(".mbook-home-catalog ul").html(catalog_html);
						$(".mbook-home-catalog").show();
						// 隐藏搜索和loading
						$(".mbook-home-search").hide();
						$(".loading").fadeOut(300);
						// 回调函数
						callback();
					});
				}
				// 匹配成功
				return true;
			}
		}
		// 匹配失败
		return false;
	},

	// 显示文章
	content(catalogID, contentID){
		// 处理编号
		if(!contentID) return;
		contentID = contentID.toString();
		// 显示loading
		$(".loading").show();
		// 获取链接
		let url = app.source.rule.content.url(catalogID, contentID);
		// 获取内容
		app.ajax(url, function(res){
			if(!res){
				$(".loading").fadeOut(300);
				console.log("文章异常：", url, res);
				return;
			}
			// 解析内容
			let txt = app.source.rule.content.txt(res);
			// 上下章节
			let keys = [...app.source.catalog_data.keys()];
			let index = keys.indexOf(contentID);
			app.source.content_prev_id = keys[index - 1];
			app.source.content_next_id = keys[index + 1];
			app.source.content_id = contentID;
			// 显示标题
			$(".mbook-home-content h3").text(app.source.catalog_data.get(contentID));
			// 标题高亮
			$(".mbook-home-catalog ul li.current").removeClass("current");
			$(".mbook-home-catalog ul li[data-id='" + contentID + "']").addClass("current");
			// 显示内容
			$(".mbook-home-content article").html(txt);
			// 隐藏loading
			$(".loading").hide();
			// 滚动条移动到顶部
			$(".mbook-home-content").animate({ scrollTop: 0}, 300);
		});
	}
};

// 初始化
app.init();