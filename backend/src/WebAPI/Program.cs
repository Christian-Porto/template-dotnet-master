using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NSwag.Generation.Processors.Security;
using NSwag;
using System.Text;
using ExtensionEventsManager.Core.WebAPI.Filters;
using ExtensionEventsManager.Core.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.WebAPI.Configuration;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

CommonConfiguration.ConfigureBuilder(builder);

builder.Services.AddControllers(options => options.Filters.Add<ApiExceptionFilterAttribute>());

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["TokenSettings:Issuer"],
        ValidAudience = builder.Configuration["TokenSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenSettings:SecurityKey"]!)),
    };

    // Configure for SignalR
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for our hub...
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/hubs")))
            {
                // Read the token out of the query string
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddOpenApiDocument(configure =>
{
    configure.Title = "StackLab Template";
    configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = OpenApiSecurityApiKeyLocation.Header,
        Description = "Type into the textbox: Bearer {your JWT token}."
    });

    configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
});

var app = builder.Build();

// CORS must be before Authentication
app.UseCors(x => x
    .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

CommonConfiguration.ConfigureApp(app);

if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseOpenApi();
    app.UseSwaggerUi(settings =>
    {
        settings.Path = "/swagger";
        settings.DocumentPath = "/api/specification.json";
    });

    app.UseStaticFiles();

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        var context = services.GetRequiredService<ApplicationDbContext>();

        try
        {
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating");
        }

        try
        {
            await ApplicationSeed.SeedSampleDataAsync(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
        }
    }
}

app.Run();

