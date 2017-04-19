using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace UnifyCore.Models{
    public class UnifyUser : IdentityUser{
        public UnifyUser()
        {
            Sources = new HashSet<Source>();            
            Articles = new HashSet<Article>();
        }

        public virtual ICollection<Source> Sources { get; set; }        
        public virtual ICollection<Article> Articles { get; set; } 
    }
}