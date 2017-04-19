using System;
using System.Collections.Generic;
using System.Linq;
using UnifyCore.Models;

namespace UnifyCore.Services
{
    public class SourceSynchronizer
    {
        private readonly RssChannelParser _rssChannelParser;

        public SourceSynchronizer(RssChannelParser rssChannelParser)
        {
            _rssChannelParser = rssChannelParser;
        }

        public IEnumerable<Article> GetNewArticles(Source source)
        {
            var articles = _rssChannelParser.GetArticles(source.Url);
            var newArticles = articles.Where(x => (source.SyncDate == null) || (x.PubDate > source.SyncDate.Value)).ToList();

            if(newArticles.Count() > 0){
                source.SyncDate = DateTime.Now;;
            }
                                 
            return newArticles;
        }
    }
}