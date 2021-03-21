---
title: Keeping your secrets out of .NET Core 2.0
date: '2018-08-03T13:56:38-0400'
categories:
- C#
- ".NET Core"
- Git
tags:
- C#
- Security
- Git
---

We have all probably done it once or twice (maybe more). Whether it has been intentional or the just forgetting to remove something before committing your code and pushing it up to your git server. Regardless, you have likely leaked some secret information to your git repository at some point in time. However, with .Net Core 2.0 and higher, it is much easier to keep your secrets...well, secret.

<!--more-->

Why should I keep my some things out of my repository?

If you are checking in your keys, passwords, connection strings, and everything else that might be considered sensitive then you are absolutely doing it wrong!

Think about it, you wouldn't go up to a stranger and tell them your bank account number would you? No, of course not. So, lets not share your secret code information with the world. Not only that, but once you start committing code to your repository then it is very difficult to remove commits that contain sensitive information. You are better off changing passwords and keys rather than trying to remove them from commit history. Seriously, I have tried. Luckily for me, this happened in a private repository so only my coworkers can see the information they already know.

Now thinking about how intelligent AI and bots are getting these days. If you have a public repository, the moment you commit your code then there could some bot scanning your code looking for anything that looks like an API key, connection string, and/or password. You don't want to be the reason that your company gets hacked, right? So lets look at how to secure your secrets.

## How to use Secrets.json in .Net Core 2.x? Secret Manager!

The Secret Manager tool takes any of your sensitive data from your project and stores it into a separate location away from your project's local repository. The secrets can be specific to a project or it can be shared across several projects. Just depends on how your want to set things up. You will soon see in the examples below. Since this information is stored outside the local repository on your development machine, then it will not be checked into source control even if someone tinkers with the the `.gitignore` file. Perfect, that's exactly what we want!

However, lets make it perfectly clear right now. At the time of this writing, user secrets are only secret from the source code repository. They are still in **plain text** on the developers machine. They are **NOT** encrypted. That is not to say that you couldn't write your own tool to make them encrypted for security reasons. However, I don't go into those details here because the Microsoft Docs recommend that you do not write code that depends on the location or format of the data saved with the Secret Manager tool because it could change in the future.

### Using Visual Studio 2017
If you right click on your project, then in the context window that appears, you should see an option called `Manage User Secrets`. Clicking this menu option will create a folder in the the AppData folder for the current user.

{::comment}
TODO: Comeback and fix this image to look at the relative path instead of FQDN
{:/comment}
<a href="https://dotnetevolved.com/wp-content/uploads/2018/07/2018-07-10-15_38_44-.png"><img class="wp-image-1126 size-full" src="https://dotnetevolved.com/wp-content/uploads/2018/07/2018-07-10-15_38_44-.png" alt="Manage User Secrets Context Menu" width="346" height="197" /></a>
Manage User Secrets Context Menu

This is going to do two things for you. First, there will be a new file named `Secrets.json` created at the following path:
{% highlight plaintext %}
%APPDATA%\Microsoft\UserSecrets\[user_secrets_id]\secrets.json
{% endhighlight %}

Secondly, the newly generated `user_secrets_id` from above will be added to your project's *.csproj* file.
You are welcome to change this value. However, keep in mind that if you are working on a team and you make this change then you are going to break this for everyone on the team until they either rename their secrets folder to the new id or they create a new `secret.json` file with the new path. So set it once and then do not change it unless there is an absolute need to do so.

**Note:** I don't have a Mac so I am not sure if this is available in Visual Studio for Mac. If anyone knows, let me know and I will update this post.

### Using Command Line
This method is for anyone else that does not use Visual Studio or if you just prefer the command line.
You will first need to set your `UserSecretsId` (which needs to be a Guid value) element within the `PropertyGroup` of the *.csproj* file.

For example:
{% highlight xml %}
<PropertyGroup>
  <TargetFramework>netcoreapp2.1</TargetFramework>
  <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
</PropertyGroup>
{% endhighlight %}

Then you can run the following command against your project to set a new secret:

`dotnet user-secrets set "XboxLiveAPI:ServiceApiKey" "12345"`

So, based on this example above, if you navigate to`%APPDATA%\Microsoft\UserSecrets\79a3edd0-2092-40a2-a04d-dcb46d5ca9ed\` then you will find the `secrets.json` file and the contents will look like this...

{% highlight xml %}
{
  "XboxLiveAPI:ServiceApiKey": "12345"
}
{% endhighlight %}

**Note:** At the time of writing this, the Microsoft Docs shows a different example similar to the one above. However, they have a different outcome for the secrets.json file. You may want to do testing on your own to see if you get this issue as well.

You can use the`--project` options to run this command from anywhere as long as you provide the path of the absolute csproj file (for example: `C:/a/b/c/myproject/`).
There are a few more commands available for you too. Here is a quick list:


* Adding multiple secrets from json file: `type .\input.json | dotnet user-secrets set`
* List the secrets: `dotnet user-secrets list`
* Remove a single secret: `dotnet user-secrets remove "XboxLiveAPI:ServiceApiKey"`
* Remove ALL secrets: `dotnet user-secrets clear`

## How do I use it in my code?

I assume that you are using ASP.NET Core 2.0 or later, so be aware that this could be different if you are using an earlier version. You know that method that comes in a new project under your *Program.cs* file called `CreateDefaultBuilder`? Well there is some code that is abstracted away from you in that method. However, lets say for this example that you are not using the default builder here. We will make our own simple IConfiguration for this example. I am adding some logging into my Program.cs so that is why I am creating an IConfiguration instead of an IWebHostBuilder. However, you can use the `.UseConfiguration()` extension to apply the IConfiguration to your IWebHostBuilder.

{% highlight csharp %}
var configurationBuilder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddEnvironmentVariables();
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)

if (env.IsDevelopment())
{
    builder.AddUserSecrets<Startup>();
}

Configuration = builder.Build();
{% endhighlight %}

Pretty easy, right?


## Whoa! My Entity Framework Core migrations stopped working. What gives?

Ah, yes. This little gotcha had me chasing my tail for about two days. I could not understand why my migrations were not working. After reading this article, you can probably guess what the issue is. However for me, this was after changing to User Secrets and several other unrelated changes. In short, depending on how your code is set up from a new project or how much you have changed it since then, when EFCore starts to run to create a migration or update the database, it does not look for your User Secrets. Which normally this makes sense but not when you are trying to do some testing in your development environment. Another thing that is not obvious is that EFCore has a convention to where it looks for a `public static IWebHost BuildWebHost(string[] args)` in your `Program.cs` file. If you don't include this method, you will start to see error messages such as

> Unable to create an object of type 'MyContext'. Add an implementation of 'IDesignTimeDbContextFactory&lt;MyContext&gt;' to the project, or see https://go.microsoft.com/fwlink/?linkid=851728 for additional patterns supported at design time.

I don't know about you, but that was not the most helpful error message for what I have explained so far. Lets look at my solution.

{% highlight csharp %}
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder()
        .UseContentRoot(Directory.GetCurrentDirectory())
        .UseConfiguration(ConfigureForEFTooling())
        .ConfigureLogging((ctx, logging) => { }) // No logging
        .UseStartup<Startup>()
        .Build();

public static IConfiguration ConfigureForEFTooling()
{
    return new ConfigurationBuilder().AddUserSecrets<Startup>().Build();
}
{% endhighlight %}

As you can see from the code sample, I have made my own `IWebHost` and another method that returns an `IConfiguration`. The `IConfiguration` that is returned has the instructions for getting the User Secrets from my `secret.json` file. This is loaded into my `IWebHost` method using the `.UseConfiguration(IConfiguration configuration)` extension method.

There is probably a better way to do as long as you are not setting up logging early like I am. However, if you are doing anything special before building the WebHost, then this method should work for you.

### Conclusion
Lets recap a little bit here and drive some points home.

* Never commit your keys, connection strings, or other sensitive data into your repository!
* Always use User Secrets when you can for anything that might be even remotely sensitive.
* Check to make sure your EF Core migrations/updates work after hiding your connection strings into User Secrets

Once you add a few secrets to your project then you will realize just how easy it is to use this feature. Good job Microsoft for making this process easy to use.

### Resources:
https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-2.1&tabs=windows
