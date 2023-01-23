using ResourceManagerAPI.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("EmployeeDB");
//builder.Services.AddDbContextPool<EmployeeDBContext>(option =>
//option.UsePostgreSqlServer(connectionString)
builder.Services.AddDbContextPool<EmployeeDBContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("Ef_Postgres_Db")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
