using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UnifyCore.Models;
using UnifyCore.Models.SourceViewModels;

namespace UnifyCore.Controllers{
    public class TagController : Controller{
        private readonly UnifyDbContext _unifyDbContext;
        private readonly UserManager<UnifyUser> _userManager;        
        public TagController(UnifyDbContext unifyDbContext, UserManager<UnifyUser> userManager)
        {
            _unifyDbContext = unifyDbContext;
            _userManager = userManager;            
        }

        public JsonResult GetAll(){
            var userId = _userManager.GetUserId(User);

            var sources = _unifyDbContext.Sources.Where(x=>x.UnifyUserId == userId).ToList();

            var tagsSet = new HashSet<string>();
            
            foreach(var source in sources){
                if(source.Tags != null)
                {
                    var tagsString = source.Tags.Substring(1);
                    string[] tags = tagsString.Split('#');                

                    foreach(var tag in tags){
                        tagsSet.Add(tag);
                    }
                }
            }


            return Json(tagsSet.ToArray());
        }
    }
}