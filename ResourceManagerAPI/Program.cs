using ResourceManagerAPI.DBContext;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Repository;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args); 

builder.Services.AddCors(options =>   //Enabling cors policy
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200")
                                                  .AllowAnyOrigin()
                                                  .AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
});
var connectionString = builder.Configuration.GetConnectionString("EmployeeDB");
builder.Services.AddDbContextPool<PGDBContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("Ef_Postgres_Db")));
// Add services to the container.
builder.Services.AddTransient<IAccount, Account>();
builder.Services.AddTransient<IFileUpload, FileUpload>();
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
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();