using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using UnifyCore.Models;

namespace Unify.Validations
{
    public class UniqueModelProperty : ValidationAttribute
    {       
        private readonly string _modelName;
        private readonly string _keyName;

        public UniqueModelProperty(string modelName)
        {
            _modelName = modelName;
        }

        public UniqueModelProperty(string modelName, string keyName) : this(modelName)
        {
            _keyName = keyName;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var dbContext = validationContext.GetService(typeof(UnifyDbContext));
            var type = dbContext.GetType();
            var property = type.GetProperty(_modelName);
            var propValue = property.GetValue(dbContext, null) as IEnumerable<object>;

           
            if (propValue != null)
            {
                if (_keyName != null)
                {
                    if (
                        propValue.Any(
                            x =>
                                x.GetType().GetProperty(validationContext.MemberName).GetValue(x, null) as string ==
                                value as string &&
                                x.GetType().GetProperty(_keyName).GetValue(x, null) as int? !=
                                validationContext.ObjectInstance.GetType()
                                    .GetProperty(_keyName)
                                    .GetValue(validationContext.ObjectInstance, null) as int?))
                    {
                        return
                            new ValidationResult(
                                $"There are already {_modelName.ToLower()} with this {validationContext.MemberName.ToLower()}");
                    }
                }
                else
                {
                    if (
                        propValue.Any(
                            x =>
                                x.GetType().GetProperty(validationContext.MemberName).GetValue(x, null) as string ==
                                (string) value))
                    {
                        return new ValidationResult(
                            $"There are already {_modelName.ToLower()} with this {validationContext.MemberName.ToLower()}");

                    }
                }

                return ValidationResult.Success;
            }
           
            return new ValidationResult($"There is no model with this {validationContext.MemberName.ToLower()}");
        }
    }
}