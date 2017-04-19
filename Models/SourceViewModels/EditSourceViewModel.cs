using System.ComponentModel.DataAnnotations;
using Unify.Validations;

namespace UnifyCore.Models.SourceViewModels{
public class EditSourceViewModel
    {        
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        [UniqueModelProperty("Sources","Id")]
        public string Name { get; set; }

        [Required]
        [StringLength(200)]
        [UniqueModelProperty("Sources","Id")]
        [Url(ErrorMessage = "This is not valid url")]
        public string Url { get; set; }
        
        public string Tags { get; set; }
    }
}