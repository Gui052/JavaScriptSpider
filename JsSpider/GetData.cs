using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
namespace JsSpider
{
    public class GetData
    {
        /// <summary>
        /// 返回的数据类型为字符串，需要自己解析。格式为：分号（;）分割每一行数据，竖线(|)区分行数。
        /// </summary>
        /// <returns></returns>
        public string Datas()
        {
            CookieContainer cc = new CookieContainer();
            string GetDataJs = "http://1x2.nowscore.com/1406361.js";

            string GetJS = File.ReadAllText("./function.js");

            var BaseResultHtml = GetResultHtml(GetDataJs, cc, "");

           // Regex re = new Regex(@"(?<=TKK=)(.*?)(?=\);)");
            Regex re = new Regex(@"var game=Array(.*)[^(var)]");
            string asd = re.Match(BaseResultHtml).ToString();

            var jscode = "function get(){"+ asd + GetJS+ "}";//在返回的HTML中正则匹配数据的JS代码并且合并成函数

            string data = ExecuteScript("get()", jscode);//执行js代码，得到值

            return data;
        }

        //网页请求
        private string GetResultHtml(string url, CookieContainer cookie, string refer)
        {
            var html = "";
            var webRequest = WebRequest.Create(url) as HttpWebRequest;
            webRequest.Method = "GET";
            webRequest.CookieContainer = cookie;
            webRequest.Referer = refer;
            webRequest.Timeout = 20000;
            webRequest.Headers.Add("X-Requested-With:XMLHttpRequest");
            webRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            webRequest.UserAgent = " Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)";
            using (var webResponse = (HttpWebResponse)webRequest.GetResponse())
            {
                using (var reader = new StreamReader(webResponse.GetResponseStream(), Encoding.UTF8))
                {

                    html = reader.ReadToEnd();
                    reader.Close();
                    webResponse.Close();
                }
            }
            return html;
        }
        /// <summary>
        /// 执行js代码
        /// </summary>
        /// <param name="sExpression">参数</param>
        /// <param name="sCode">js代码</param>
        /// <returns></returns
        private string ExecuteScript(string sExpression, string sCode)
        {
            MSScriptControl.ScriptControl scriptControl = new MSScriptControl.ScriptControl();
            scriptControl.UseSafeSubset = true;
            scriptControl.Language = "JScript";
            scriptControl.AddCode(sCode);
            try
            {
               string str = scriptControl.Eval(sExpression).ToString();
                return str;
            }
            catch (Exception ex)
            {
                string str = ex.Message;
            }
            return null;
        }
    }
}
