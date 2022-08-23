using Account.Budget.EntityFrameworkCore.Extensions;
using Account.Budget.Identity.Extensions;
using Account.Budget.Identity.Tokens.Jwt;
using Account.Budget.Web.Exceptions;
using Account.Budget.Web.Validation;

var allowSpecificOrigins = "allowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// configure settings
{
    var configuration = builder.Configuration;

    configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
}

// add services to DI container.
{
    var services = builder.Services;

    if (builder.Environment.IsDevelopment())
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                allowSpecificOrigins,
                policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });
    }

    services.Configure<JwtTokenSettings>(builder.Configuration.GetSection("JwtToken"));

    services.AddControllers(options =>
    {
        options.Filters.Add<HttpResponseExceptionFilter>();
        options.Filters.Add<ValidateModelAttribute>();
    });
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();
    services.AddHttpContextAccessor();
    services.AddMemoryCache();
    services.AddJwtBearerAuthentication(builder.Configuration);
    services.AddAccountDbContext(builder.Configuration);
}

var app = builder.Build();

// configure middleware.
{

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseCors(allowSpecificOrigins);
        app.UseSwagger();
        // app.UseSwaggerUI();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("v1/swagger.json", "v1");
        });
    }
    else
    {
        app.UseHttpsRedirection();
    }

    app.UseAuthorization();
    app.UseAuthentication();

    app.MapControllers();
}

app.Run();
