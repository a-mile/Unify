namespace UnifyCore.Models.ArticleViewModels
{
    public class ArticleViewModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public string SourceName { get; set; }

        public string Tags {get; set; }

        public string PublicationTime { get; set; }

        public bool Read { get; set; }

        public bool Saved {get;set;}
    }
}