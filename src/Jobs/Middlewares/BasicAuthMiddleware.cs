using System.Net.Http.Headers;
using System.Net;
using System.Text;

namespace ManagementExtensionActivities.Core.Jobs.Middlewares;

public class BasicAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    private readonly string QuartzUser;
    private readonly string QuartzPassword;

    public BasicAuthMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;

        QuartzUser = _configuration.GetSection("Quartz:User").Value!;
        QuartzPassword = _configuration.GetSection("Quartz:Password").Value!;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/quartz"))
        {
            if (!context.Request.Headers.ContainsKey("Authorization"))
            {
                context.Response.Headers["WWW-Authenticate"] = "Basic realm=\"CrystalQuartz\"";
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].ToString();
            var authHeaderValue = AuthenticationHeaderValue.Parse(authHeader);

            if (authHeaderValue.Scheme.Equals("Basic", StringComparison.OrdinalIgnoreCase))
            {
                var credentials = Encoding.UTF8
                    .GetString(Convert.FromBase64String(authHeaderValue.Parameter))
                    .Split(':', 2);

                var username = credentials[0];
                var password = credentials[1];

                if (username == QuartzUser && password == QuartzPassword)
                {
                    await _next(context);
                    return;
                }
            }

            context.Response.Headers["WWW-Authenticate"] = "Basic realm=\"CrystalQuartz\"";
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return;
        }

        // Proceed with next middleware if not accessing the CrystalQuartz path
        await _next(context);
    }
}
