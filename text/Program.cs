using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JsSpider;

namespace text
{
    class Program
    {
        static void Main(string[] args)
        {
            GetData js = new GetData();

            Console.WriteLine(js.Datas());
        }
    }
}
