using backend.Hubs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScanController : ControllerBase
    {
        private readonly DnsScannerService _scannerService;
        private readonly IMongoCollection<ScanResult> _scanResultsCollection;
        private readonly IHubContext<ScanHub> _hubContext;

        public ScanController(
            DnsScannerService scannerService,
            IMongoDatabase mongoDatabase,
            IHubContext<ScanHub> hubContext)
        {
            _scannerService = scannerService;
            _scanResultsCollection = mongoDatabase.GetCollection<ScanResult>("ScanResults");
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> ScanDomain([FromBody] ScanRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Domain))
            {
                return BadRequest("Domain is required.");
            }

            var result = await _scannerService.ScanDomainAsync(request.Domain);

            await _scanResultsCollection.InsertOneAsync(result);

            await _hubContext.Clients.All.SendAsync("ReceiveScanResult", result);

            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] int limit = 10)
        {
            var results = await _scanResultsCollection.Find(_ => true)
                .SortByDescending(r => r.Timestamp)
                .Limit(limit)
                .ToListAsync();

            return Ok(results);
        }
    }

    public class ScanRequest
    {
        public string Domain { get; set; } = null!;
    }
}
