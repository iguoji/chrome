// 全局常量
const HOME_PATH = "chrome-extension://" + chrome.runtime.id + "/home/index.html";
// 主类
class Mbook{
	// 构造函数
	constructor(){
		console.log("mbook running at " + new Date());
		this.bind();
	}
	// 绑定事件
	bind(){
		// 点击图标
		chrome.browserAction.onClicked.addListener(() => {
			chrome.tabs.create({
				url: HOME_PATH
			});
		});
	}
};

// 实例化
let mbook = new Mbook();