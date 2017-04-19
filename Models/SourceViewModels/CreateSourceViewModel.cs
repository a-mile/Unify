using System.ComponentModel.DataAnnotations;
using Unify.Validations;

namespace UnifyCore.Models.SourceViewModels{
public class CreateSourceViewModel
    {
        [Required]
        [StringLength(10)]
        [UniqueModelProperty("Sources")]
        public string Name { get; set; }        

        [Required]
        [StringLength(200)]
        [UniqueModelProperty("Sources")]
        [Url(ErrorMessage = "This is not valid url")]
        public string Url { get; set; }
        
        public string Tags { get; set; }
    }
}