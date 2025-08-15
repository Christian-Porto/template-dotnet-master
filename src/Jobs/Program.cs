using CrystalQuartz.AspNetCore;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;
using Serilog;
using ManagementExtensionActivities.Core.Jobs.Middlewares;
using ManagementExtensionActivities.Core.Jobs.Quartz;
using ManagementExtensionActivities.Core.WebAPI.Configuration;

var builder = WebApplication.CreateBuilder(args);

CommonConfiguration.ConfigureBuilder(builder);

builder.Services.AddSingleton<IJobFactory, ScheduledJobFactory>();

builder.Services.AddSingleton<IScheduler>(provider =>
{
    ISchedulerFactory schedulerFactory = new StdSchedulerFactory();

    IScheduler scheduler = schedulerFactory.GetScheduler().GetAwaiter().GetResult();

    scheduler.JobFactory = provider.GetRequiredService<IJobFactory>();

    return scheduler;
});

var app = builder.Build();

CommonConfiguration.ConfigureApp(app);

IScheduler scheduler = app.Services.GetRequiredService<IScheduler>();

if (app.Environment.IsProduction() || app.Environment.IsStaging())
{
    await scheduler.Start();
}
else
{
    await scheduler.PauseAll();
}

app.UseMiddleware<BasicAuthMiddleware>();

app.UseCrystalQuartz(() => scheduler);

app.Run();
