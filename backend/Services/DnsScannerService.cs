using System;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using DnsClient;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class DnsScannerService
    {
        private readonly ILookupClient _lookupClient;
        private readonly ILogger<DnsScannerService> _logger;

        public DnsScannerService(ILookupClient lookupClient, ILogger<DnsScannerService> logger)
        {
            _lookupClient = lookupClient;
            _logger = logger;
        }

        public async Task<ScanResult> ScanDomainAsync(string domain)
        {
            var result = new ScanResult
            {
                Domain = domain,
                Timestamp = DateTime.UtcNow
            };

            try
            {
                var aQuery = await _lookupClient.QueryAsync(domain, QueryType.A);
                foreach (var aRecord in aQuery.Answers.ARecords())
                {
                    result.ARecords.Add(aRecord.Address.ToString());
                    result.MinimumTtl = Math.Min(result.MinimumTtl, aRecord.InitialTimeToLive);
                }

                var mxQuery = await _lookupClient.QueryAsync(domain, QueryType.MX);
                foreach (var mxRecord in mxQuery.Answers.MxRecords())
                {
                    result.MxRecords.Add(mxRecord.Exchange.Value);
                    result.MinimumTtl = Math.Min(result.MinimumTtl, mxRecord.InitialTimeToLive);
                }

                var nsQuery = await _lookupClient.QueryAsync(domain, QueryType.NS);
                foreach (var nsRecord in nsQuery.Answers.NsRecords())
                {
                    result.NsRecords.Add(nsRecord.NSDName.Value);
                    result.MinimumTtl = Math.Min(result.MinimumTtl, nsRecord.InitialTimeToLive);
                }

                if (result.MinimumTtl == int.MaxValue)
                {
                    result.MinimumTtl = 0;
                }

                CalculateRiskScore(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error scanning domain {Domain}", domain);
                result.SafetyScore = 0;
                result.Threats.Add("DNS Resolution Failed");
            }

            return result;
        }

        private void CalculateRiskScore(ScanResult result)
        {
            int score = 100;

            if (result.MxRecords.Count == 0)
            {
                score -= 30;
                result.Threats.Add("Missing MX Records");
            }

            if (result.MinimumTtl > 0 && result.MinimumTtl < 300)
            {
                score -= 40;
                result.Threats.Add("Short TTL (Possible Fast Flux)");
            }

            // Mock SSL/RDAP checks
            if (result.Domain.Contains("phish") || result.Domain.Contains("login"))
            {
                score -= 50;
                result.Threats.Add("Suspicious Keyword in Domain");
            }

            result.SafetyScore = Math.Max(0, score);
            if (result.SafetyScore == 100)
            {
                 result.Threats.Add("No identified threats");
            }
        }
    }
}
