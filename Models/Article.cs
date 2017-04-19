using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnifyCore.Models
{
    public enum ArticleState
    {
        New, Read, Saved
    }

    public class Article
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Source")]
        public int SourceId { get; set; }

        [ForeignKey("UnifyUser")]
        public string UnifyUserId { get; set; }


        public string Title { get; set; }

        public string Url { get; set; }

        public string Description { get; set; }

        public DateTime PubDate { get; set; }

        public string ImageUrl { get; set; }

        public string Author { get; set; }

        public ArticleState State { get; set; }

        public bool Saved {get;set;}


        public virtual Source Source { get; set; }

        public virtual UnifyUser UnifyUser { get; set; }
    }
}