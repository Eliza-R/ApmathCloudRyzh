using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AzureCloudTest.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public FileResult GetData(string year)
        {
            byte[] fileBytes = System.IO.File.ReadAllBytes(HttpContext.Server.MapPath("~/data/" + year + ".tsv"));
            string fileName = "data.tsv";
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }



    }
}