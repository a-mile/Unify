using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UnifyCore.Models;
using UnifyCore.Models.ArticleViewModels;

namespace UnifyCore.Controllers
{
    public class ArticleController : Controller
    {
        private readonly UnifyDbContext _unifyDbContext;
        private readonly UserManager<UnifyUser> _userManager;   
        
        private readonly int _pageSize = 10;

        public ArticleController(UnifyDbContext unifyDbContext, UserManager<UnifyUser> userManager)
        {
            _unifyDbContext = unifyDbContext;
            _userManager = userManager;   
        }

        public JsonResult GetAll(int page, string keyWords = null){            
            var articles = _unifyDbContext.Articles.Where(x=>x.UnifyUserId == _userManager.GetUserId(User) &&
                (string.IsNullOrEmpty(keyWords) || x.Title.Contains(keyWords) || x.Description.Contains(keyWords)))
                .Include(x=>x.Source)
                .OrderByDescending(x => x.PubDate)
                .Skip((page - 1) * _pageSize)
                .Take(_pageSize).ToList();

            var articlesViewModels = new List<ArticleViewModel>();

            foreach(var article in articles){
                articlesViewModels.Add(new ArticleViewModel(){
                    Id = article.Id,
                    Title = article.Title,
                    Description = article.Description,
                    Url = article.Url,
                    SourceName = article.Source.Name,
                    Tags = article.Source.Tags,
                    PublicationTime = GetPublicationTime(article.PubDate),
                    Read = article.State == ArticleState.Read
                });
            }

            return Json(articlesViewModels);
        }  

        public JsonResult GetUnread(int page, string keyWords = null){            
            var articles = _unifyDbContext.Articles.Where(x=>x.UnifyUserId == _userManager.GetUserId(User) &&
                (string.IsNullOrEmpty(keyWords) || x.Title.Contains(keyWords) || x.Description.Contains(keyWords)) &&
                x.State == ArticleState.New)
                .Include(x=>x.Source)
                .OrderByDescending(x => x.PubDate)
                .Skip((page - 1) * _pageSize)
                .Take(_pageSize).ToList();

            var articlesViewModels = new List<ArticleViewModel>();

            foreach(var article in articles){
                articlesViewModels.Add(new ArticleViewModel(){
                    Id = article.Id,
                    Title = article.Title,
                    Description = article.Description,
                    Url = article.Url,
                    SourceName = article.Source.Name,
                    Tags = article.Source.Tags,
                    PublicationTime = GetPublicationTime(article.PubDate),
                    Read = article.State == ArticleState.Read
                });
            }

            return Json(articlesViewModels);
        }   

        public JsonResult GetSaved(int page, string keyWords = null){            
            var articles = _unifyDbContext.Articles.Where(x=>x.UnifyUserId == _userManager.GetUserId(User) &&
                (string.IsNullOrEmpty(keyWords) || x.Title.Contains(keyWords) || x.Description.Contains(keyWords)) &&
                x.State == ArticleState.Saved)
                .Include(x=>x.Source)
                .OrderByDescending(x => x.PubDate)
                .Skip((page - 1) * _pageSize)
                .Take(_pageSize).ToList();

            var articlesViewModels = new List<ArticleViewModel>();

            foreach(var article in articles){
                articlesViewModels.Add(new ArticleViewModel(){
                    Id = article.Id,
                    Title = article.Title,
                    Description = article.Description,
                    Url = article.Url,
                    SourceName = article.Source.Name,
                    Tags = article.Source.Tags,
                    PublicationTime = GetPublicationTime(article.PubDate),
                    Read = article.State == ArticleState.Read
                });
            }

            return Json(articlesViewModels);
        }     

        public JsonResult GetSource(int page, int id, string filter, string keyWords = null){
            var articles = _unifyDbContext.Articles.Where(x=>x.UnifyUserId == _userManager.GetUserId(User) &&
                (string.IsNullOrEmpty(keyWords) || x.Title.Contains(keyWords) || x.Description.Contains(keyWords)) &&
                ((filter == "all")||x.State == ArticleState.New) &&
                x.SourceId == id)
                .Include(x=>x.Source)
                .OrderByDescending(x => x.PubDate)
                .Skip((page - 1) * _pageSize)
                .Take(_pageSize).ToList();

            var articlesViewModels = new List<ArticleViewModel>();

            foreach(var article in articles){
                articlesViewModels.Add(new ArticleViewModel(){
                    Id = article.Id,
                    Title = article.Title,
                    Description = article.Description,
                    Url = article.Url,
                    SourceName = article.Source.Name,
                    Tags = article.Source.Tags,
                    PublicationTime = GetPublicationTime(article.PubDate),
                    Read = article.State == ArticleState.Read
                });
            }

            return Json(articlesViewModels);    
        }   

        public JsonResult GetTag(int page, string id, string filter, string keyWords = null){
            var articles = _unifyDbContext.Articles
                .Include(x=>x.Source)
                .Where(x=>x.UnifyUserId == _userManager.GetUserId(User) &&
                    (string.IsNullOrEmpty(keyWords) || x.Title.Contains(keyWords) || x.Description.Contains(keyWords)) &&
                    ((filter == "all")||x.State == ArticleState.New) && 
                    x.Source.Tags.Contains(id))                
                .OrderByDescending(x => x.PubDate)
                .Skip((page - 1) * _pageSize)
                .Take(_pageSize).ToList();

            var articlesViewModels = new List<ArticleViewModel>();

            foreach(var article in articles){
                articlesViewModels.Add(new ArticleViewModel(){
                    Id = article.Id,
                    Title = article.Title,
                    Description = article.Description,
                    Url = article.Url,
                    SourceName = article.Source.Name,
                    Tags = article.Source.Tags,
                    PublicationTime = GetPublicationTime(article.PubDate),
                    Read = article.State == ArticleState.Read
                });
            }

            return Json(articlesViewModels);    
        }     

        [HttpPost]
        public JsonResult MarkAllAsRead(){
            var articles = _unifyDbContext.Articles.Where(x=>x.UnifyUserId == _userManager.GetUserId(User)).ToList();

            foreach(var article in articles){
                article.State = ArticleState.Read;
            }

            _unifyDbContext.SaveChanges();

            return Json("success");
        }     

        [HttpPost]
        public JsonResult MarkSourceAsRead([FromBody]int id){
            var articles = _unifyDbContext.Articles.Where(x=>x.UnifyUserId == _userManager.GetUserId(User) && x.SourceId == id).ToList();

            foreach(var article in articles){
                article.State = ArticleState.Read;
            }

            _unifyDbContext.SaveChanges();

            return Json("success");
        }  

        [HttpPost]
        public JsonResult MarkTagAsRead([FromBody]string id){
            var articles = _unifyDbContext.Articles
                .Include(x=>x.Source)
                .Where(x=>x.UnifyUserId == _userManager.GetUserId(User) && x.Source.Tags.Contains(id)).ToList();

            foreach(var article in articles){
                article.State = ArticleState.Read;
            }

            _unifyDbContext.SaveChanges();

            return Json("success");
        }  

        [HttpPost]
        public JsonResult MarkArticeAsRead([FromBody]int id){
            var article = _unifyDbContext.Articles.Where(x=>x.Id == id).FirstOrDefault();

            if(article == null){
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("there is no source with this id");
            }

            article.State = ArticleState.Read;

            _unifyDbContext.SaveChanges();

            return Json("success");
        }       

        private string GetPublicationTime(DateTime date)
        {
            TimeSpan difference = DateTime.Now - date;

            int days = (int)difference.TotalDays;

            if (days > 1)
                return days + " days ago";

            if (days == 1)
                return days + " day ago";

            int hours = (int)difference.TotalHours;

            if (hours > 1)
                return hours + " hours ago";

            if (hours == 1)
                return hours + " hour ago";

            int minutes = (int)difference.TotalMinutes;

            if (minutes > 1)
                return minutes + " minutes ago";

            if (minutes == 1)
                return minutes + " minute ago";

            return "Just now";
        }
    }
}