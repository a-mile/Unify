using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using UnifyCore.Models;

namespace UnifyCore.Services
{
    public class RssChannelParser
    {
        public int ArticleDescriptionLength { get; set; } = 300;

        public IEnumerable<Article> GetArticles(string sourceLink)
        {
            Uri uriResult;

            bool result = Uri.TryCreate(sourceLink, UriKind.Absolute, out uriResult);
                          //&& (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

            if (!result)
                return Enumerable.Empty<Article>();

            string xml;

            try{
                using (var client = new HttpClient())
                {
                    using (HttpResponseMessage response = client.GetAsync(sourceLink, HttpCompletionOption.ResponseHeadersRead).Result)
                    {
                        using (HttpContent content = response.Content)
                        {
                            var data = content.ReadAsByteArrayAsync().Result;                                                    
                            var charset = response.Content.Headers.ContentType.CharSet;
                            charset = charset.Replace("\"","");
                            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                            xml = Encoding.GetEncoding(charset).GetString(data);                            
                            xml = WebUtility.HtmlDecode(xml);                            
                        }
                    }                 
                }
            }
            catch(Exception){                
                return Enumerable.Empty<Article>();
            }

            xml = xml.Replace("&", "&amp;");

            XDocument document = XDocument.Parse(xml);

            var articles = document.Descendants("item").Select(x => new Article()
            {
                Title = x.Element("title")?.Value,
                Description = FormatDescritption(x.Element("description")?.Value),
                Url = x.Element("link")?.Value,
                PubDate = ParseDate(x.Element("pubDate")?.Value),
            });

            return articles;
        }

        private string FormatDescritption(string description)
        {
            string result  = Regex.Replace(description, @"<[^>]*>", String.Empty);

            if (result.Length > ArticleDescriptionLength)
            {
                result = result.Substring(0, ArticleDescriptionLength - 3);
                result += "...";
            }

            return result;
        }

        private DateTime ParseDate(string date)
        {
            DateTime result;

            return DateTime.TryParse(date, out result) ? result : DateTime.MinValue;
        }
    }
}
