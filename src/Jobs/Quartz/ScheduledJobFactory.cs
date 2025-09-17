using Quartz;
using Quartz.Spi;
using System.Collections.Concurrent;

namespace ExtensionEventsManager.Core.Jobs.Quartz;

public class ScheduledJobFactory : IJobFactory, IDisposable
{
    protected readonly IServiceProvider serviceProvider;
    protected readonly ConcurrentDictionary<IJob, IServiceScope> _scopes = new ConcurrentDictionary<IJob, IServiceScope>();

    public ScheduledJobFactory(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public IJob NewJob(TriggerFiredBundle bundle, IScheduler scheduler)
    {
        var scope = serviceProvider.CreateScope();
        var job = scope.ServiceProvider.GetRequiredService(bundle.JobDetail.JobType) as IJob;

        _scopes.TryAdd(job, scope);

        return job;
    }

    public void ReturnJob(IJob job)
    {
        try
        {
            (job as IDisposable)?.Dispose();

            if (_scopes.TryRemove(job, out IServiceScope escopo))
                escopo.Dispose();
        }
        catch (Exception) { }
    }

    public void Dispose()
    {
        try
        {
            foreach (var escopo in _scopes.Values)
            {
                escopo?.Dispose();
            }
        }
        catch (Exception) { }
    }
}