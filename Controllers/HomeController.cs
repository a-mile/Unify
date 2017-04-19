using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UnifyCore.Models;
using UnifyCore.Services;

namespace UnifyCore.Controllers
{
    public class HomeController : Controller
    {
        private readonly UnifyDbContext _unifyDbContext;        
        private readonly SourceSynchronizer _sourceSynchronizer;
        private readonly UserManager<UnifyUser> _userManager;   

        public HomeController(UnifyDbContext unifyDbContext, UserManager<UnifyUser> userManager, SourceSynchronizer sourceSynchronizer)
        {
            _unifyDbContext = unifyDbContext;
            _userManager = userManager;   
            _sourceSynchronizer = sourceSynchronizer;
        }

        public IActionResult Index()
        {
            foreach (var source in _unifyDbContext.Sources.ToList())
            {
                var newArticles = _sourceSynchronizer.GetNewArticles(source).ToList();

                foreach (var article in newArticles)
                {
                    article.UnifyUserId = _userManager.GetUserId(User);
                    article.SourceId = source.Id;
                    article.State = ArticleState.New;

                    _unifyDbContext.Articles.Add(article);
                }                             
            }

            _unifyDbContext.SaveChanges();
            
            return View();
        }       
    }
}
