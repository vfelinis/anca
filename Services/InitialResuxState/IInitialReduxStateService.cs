using System.Threading.Tasks;
using anca.Models;

namespace anca.Services
{
    public interface IInitialReduxStateService
    {
        Task<InitialReduxState> GetInitialReduxStateAsync();
    }
}