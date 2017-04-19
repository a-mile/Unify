using StructureMap;
using UnifyCore.Infrastructure.StructureMapConventions;

namespace UnifyCore.Infrastructure.StructureMapRegisters
{
    public class ControllerRegistry : Registry
    {
        public ControllerRegistry()
        {
            Scan(scan =>
            {
                scan.TheCallingAssembly();
                scan.With(new ControllerConvention());
            });
        }
    }
}