using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnifyCore.Models
{
    public class Source
    {
        public Source()
        {
            Articles = new HashSet<Article>();
        }

        [Key]
        public int Id { get; set; }


        [ForeignKey("UnifyUser")]
        public string UnifyUserId { get; set; }
        
        public string Name { get; set; }

        public string Url { get; set; }

        public string Tags {get;set;}

        public DateTime? SyncDate { get; set; }


        public virtual ICollection<Article> Articles { get; set; }

        public virtual UnifyUser UnifyUser { get; set; }        
    }
}