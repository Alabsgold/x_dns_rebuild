using backend.Models;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Hubs
{
    public class ScanHub : Hub
    {
        public async Task BroadcastScanResult(ScanResult result)
        {
            await Clients.All.SendAsync("ReceiveScanResult", result);
        }
    }
}
