webvn.use(["ui"], function (s, ui) {
ui.createTemplate(
{
    "cg": "",
    "dialog": "<div class=\"name\"></div>\r\n<div class=\"content\">\r\n    <img class=\"face\" src=\"\"/>\r\n    <span class=\"text\"></span>\r\n</div>",
    "menu": "<ul>\r\n    <li class=\"start\">开始游戏</li>\r\n    <li class=\"load\">读取存档</li>\r\n    <li class=\"cg\">图像鉴赏</li>\r\n    <li class=\"music\">音乐鉴赏</li>\r\n    <li class=\"setting\">环境设定</li>\r\n</ul>"
}
);
});