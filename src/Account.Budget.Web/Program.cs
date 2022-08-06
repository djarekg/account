using Account.Budget.EntityFrameworkCore.Extensions;
using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.Web.Exceptions;
using Account.Budget.Web.Services;
using Account.Budget.Web.Validation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    options.Filters.Add<HttpResponseExceptionFilter>();
    options.Filters.Add<ValidateModelAttribute>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddJwtBearerAuthentication(builder.Configuration);

builder.Services.AddMemoryCache();

builder.Services.AddAccountDbContext(builder.Configuration);

builder.Services.AddScoped<IIdentityService, IdentityService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    // app.UseSwaggerUI();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}


app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();

app.Run();
