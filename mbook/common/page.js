// 当前链接
const url = window.location.href;

// 隐藏Body
document.body.style.display = "none";

// 抓取规则
const rules = {
	"www.xxbiquge.com"		: 	{
		catalog			: 	{
			url: "",
			dom: null,
			reg: null
		},
		content			: 	{

		}
	}
};


// 1. 获取目录代码区域 /"(.*?)</g
let dls = document.querySelectorAll("dd");

// 2. 修改网页
let html = "<ul>";
for(let item of dls){
	html += '<li>' + item.innerHTML + '</li>';
}
html += '</ul>';

// 8. 打印网页
document.body.innerHTML = html;
document.body.style.display = "block";