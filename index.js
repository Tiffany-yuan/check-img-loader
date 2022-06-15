const cheerio = require('cheerio');
const { validate } = require("schema-utils");

const schema = {
  type: "object",
  properties: {
    whiteList: {
      type: "array",
    },
  },
};

module.exports = function (fileContent) {
	// var query = loaderUtils.parseQuery(this.query);
	// fileContent = query.min === false?fileContent:fileContent.replace(/\n/g, '');
    const _this = this;
    const options = this.getOptions();
    validate(schema, options, "bundle-author-loader");
    console.log('----------options', options);
    const { whiteList } = options;
    const $ = cheerio.load(fileContent);
    if($('img').length > 0) {
        $('img').each(function () {
            const $this = $(this);
            const imgSrc = $this.attr('src');
            /**
             * 分不同情况处理：
             * 1. 图片地址是在线地址
             * 2. 图片地址是相对路径
             * 3. 图片地址是变量形式动态插入的
             * */
            // 1. 在线地址
            if (/^((https?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(imgSrc)) {
                // 获取域名
                const group = imgSrc.split('/');
                if (group.length >= 3) {
                    const host = group[2];
                    console.log('-------------whiteList', whiteList, host);
                    if (whiteList.indexOf(host) < 0) {
                        // 抛错
                        throw Error('img src error!');
                    }
                }
            }
            // 3. 变量形式动态插入的
            else if (imgSrc.indexOf('{') > -1) {
                // 不处理
            }
            // 2. 相对路径
            else {
                // 抛错，不允许使用相对地址
                throw Error('img src error!');
            }
        })
    }
    return fileContent;
};
// function checkImgUrl(fileContent) {
//     var reg = /\s+((src)|(href))[\s]*=[\s]*\\?[\'\"][^\"\']+\\?[\'\"]/i;
//     var regResult = reg.exec(str);

//     if(!regResult) return str;
//     var attrName = /\w+\s*=\s*/.exec(regResult[0])[0].replace(/\s*=\s*$/, '');
//     var imgUrl = regResult[0].replace(/\w+\s*=\s*/, '').replace(/[\\\'\"]/g, '');
//     console.log(imgUrl);
// }
