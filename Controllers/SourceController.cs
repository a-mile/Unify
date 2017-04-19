using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UnifyCore.Models;
using UnifyCore.Models.SourceViewModels;

namespace UnifyCore.Controllers{
    public class SourceController : Controller{
        private readonly UnifyDbContext _unifyDbContext;
        private readonly UserManager<UnifyUser> _userManager;        
        public SourceController(UnifyDbContext unifyDbContext, UserManager<UnifyUser> userManager)
        {
            _unifyDbContext = unifyDbContext;
            _userManager = userManager;            
        }

        public JsonResult GetAll(){            
            var sources = _unifyDbContext.Sources.Where(x=>x.UnifyUserId == _userManager.GetUserId(User)).ToList();
            var sourcesViewModels = new List<ReadSourceViewModel>();

            foreach(var source in sources){
                sourcesViewModels.Add(new ReadSourceViewModel(){
                    Id = source.Id,
                    Name = source.Name,
                    Url = source.Url,
                    Tags = source.Tags
                });
            }

            return Json(sourcesViewModels);
        }

        [HttpPost]        
        public JsonResult Create([FromBody]CreateSourceViewModel source)
        {            
            if (!ModelState.IsValid)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;

                var errors = ModelState.Values.Where(x=>x.Errors.Count > 0);
                var errorMessages = new List<string>();

                foreach(var error in errors)
                {
                    errorMessages.Add(error.Errors[0].ErrorMessage);
                }

                return Json(errorMessages.ToArray());
            }

            _unifyDbContext.Sources.Add(new Source()
            {
                UnifyUserId = _userManager.GetUserId(User),
                Name = source.Name,
                Url = source.Url,
                Tags = source.Tags
            });

            _unifyDbContext.SaveChanges();

            return Json("Success");
        }

        [HttpPost]       
        public JsonResult Edit([FromBody]EditSourceViewModel sourceViewModel)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Model state is invalid");
            }

            var sourceId = sourceViewModel.Id;
            var source =
                _unifyDbContext.Sources.FirstOrDefault(
                    x => x.UnifyUserId == _userManager.GetUserId(User) && x.Id == sourceId);

            if (source == null)
            {
                Response.StatusCode = (int)HttpStatusCode.NotFound;
                return Json("Cannot find this source");
            }

            source.Name = sourceViewModel.Name;
            source.Url = sourceViewModel.Url;
            source.Tags = sourceViewModel.Tags;

            _unifyDbContext.SaveChanges();

            return Json("Success");
        }        

        [HttpPost]        
        public JsonResult Delete([FromBody]int sourceId)
        {            
            var source =
                _unifyDbContext.Sources.FirstOrDefault(
                    x => x.UnifyUserId == _userManager.GetUserId(User) && x.Id == sourceId);

            if (source == null)
            {
                Response.StatusCode = (int)HttpStatusCode.NotFound;
                return Json("Cannot find this source");
            }

            _unifyDbContext.Sources.Remove(source);
            _unifyDbContext.SaveChanges();

            return Json("Success");
        }
    }
}