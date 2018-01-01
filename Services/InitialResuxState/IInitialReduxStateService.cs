using System.Threading.Tasks;
using site.Models;

namespace site.Services
{
    public interface IInitialReduxStateService
    {
        Task<InitialReduxState> GetInitialReduxStateAsync();
    }
}