using backend.Hubs;
using backend.Services;
using DnsClient;
using MongoDB.Driver;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Configure MongoDB
var mongoClient = new MongoClient(builder.Configuration.GetValue<string>("MongoDbSettings:ConnectionString") ?? "mongodb://localhost:27017");
builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.AddSingleton(provider =>
{
    var client = provider.GetRequiredService<IMongoClient>();
    var dbName = builder.Configuration.GetValue<string>("MongoDbSettings:DatabaseName") ?? "XDnsGuardian";
    return client.GetDatabase(dbName);
});

// Configure DnsClient
builder.Services.AddSingleton<ILookupClient, LookupClient>();

// Configure Services
builder.Services.AddScoped<DnsScannerService>();

// Configure SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Disable for local dev without certs
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();
app.MapHub<ScanHub>("/hubs/scan");

app.Run();
