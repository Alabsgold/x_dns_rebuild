using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class ScanResult
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Domain { get; set; } = null!;

        public DateTime Timestamp { get; set; }

        public int SafetyScore { get; set; }

        public List<string> Threats { get; set; } = new List<string>();

        // Metadata
        public List<string> ARecords { get; set; } = new List<string>();
        public List<string> MxRecords { get; set; } = new List<string>();
        public List<string> NsRecords { get; set; } = new List<string>();

        public int MinimumTtl { get; set; } = int.MaxValue;
    }
}
