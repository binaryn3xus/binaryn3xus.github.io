---
title: Complex Objects and TempData using .NET Core
date: 2017-08-24T07:20:01-04:00
categories:
- C#
- NuGet
- ".NET Core"
- Newtonsoft.Json
tags:
- C#
- TempData
- JSON
- ".NET Core"
comments: []
---

There is a clever way to implement Bootstrap Alerts using the MVC Framework's 'TempData' object. James Chambers made an excellent [post](http://jameschambers.com/2014/06/day-14-bootstrap-alerts-and-mvc-framework-tempdata/) on this back in 2014. I highly recommend reading it. It is a technique that I adopted and have loved using ever since reading his post. I've been working on migrating one of my applications over to .NET Core 2 and I ran into an issue with the current configuration. Anytime that I used one of the alert methods and redirected to the next page, you would receive a blank white page and no errors in visual studio (even when stepping through with the debugger). In the browsers dev tools, you would only see a generic 500 error message.

<!--more-->

At the time of writing this, I am new to .NET Core 2 and I am having a blast learning all the new features and tricks that are possible with the changes to MVC6. I got burned in the beginning when .NET Core first came out in version 1. As a result, I waited until version 2 to give it another shot. Anyways, you are not here for my life story, you are likely here for code. Let's continue.

### Investigating the issue

Right now my go to expert for .NET Core 2 is [Stefan Kert](https://twitter.com/StefanKert). Stefan is passionate about .NET Core and contributing to all kinds of open source projects and has developed a lot of cool things. I explained my bizarre issue to him and he gave me a tip to add a Global Error Handler, using the IApplicationBuilder.UseExceptionHandler(), to my project to try and catch what was happening. I implemented the code shown below in my "Configure" method in Startup.cs:

{% highlight csharp %}
app.UseExceptionHandler(
	options => {
		options.Run(
			async context =>
			{
				context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
				context.Response.ContentType = "text/html";
				var ex = context.Features.Get();
				if (ex != null)
				{
					var err = $"&lt;h1&lt;Error: {ex.Error.Message}&lt;/h1&lt;{ex.Error.StackTrace }";
					await context.Response.WriteAsync(err).ConfigureAwait(false);
				}
			});
	}
);
{% endhighlight %}

_(Do not use this code in production. Only temporarily in a development environment. This was purely for test purposes!)_

I threw a breakpoint on the 12th line in the snippet (the await line) and ran the project again. This time I finally hit a breakpoint with an exception.

If you followed James' tutorial to set this up previously, then you will likely see an exception message along the lines of:

> The 'Microsoft.AspNetCore.Mvc.ViewFeatures.Internal.TempDataSerializer' cannot serialize an object of type 'ProjectMVC.Models.PageAlert'.

### So how do I fix it?

This used to work in the past with no problems, right? Correct. So what changed? The issue is that .NET Core MVC (at the time of writing this) currently does not support TempData using complex types. It only supports **strings**. It does not support serializing the data for you.

So how do we fix it for this example? Easy. You just have to set up your serialization. Trust me, it isn't as difficult as it may sound if you are new to it. If you have never used the NuGet package [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/), this is a great example to show how awesome it is. It is a powerful tool for serializing and deserializing JSON objects quickly and easily. We just need to create a process that does the serialization for the TempData.

You can implement this in many ways but I chose to do it as extensions and make it a little tightly coupled to this specific issue. Feel free to change it up.

{% highlight csharp %}
public static class TempDataExtensions
{
	public static void SerializeAlerts(this ITempDataDictionary tempData, string alertKeyName, List alerts)
	{
		tempData\[alertKeyName\] = JsonConvert.SerializeObject(alerts);
	}

	public static List DeserializeAlerts(this ITempDataDictionary tempData, string alertKeyName)
	{
		var alerts = new List();
		if (tempData.ContainsKey(alertKeyName))
		{
			alerts = JsonConvert.DeserializeObject\>(tempData\[alertKeyName\].ToString());
		}
		return alerts;
	}
}
{% endhighlight %}

Let's take a look the extension code. In SerializeAlerts, you will see that we are just taking a list of PageAlerts and serializing it into a JSON string and assigning it to the tempData object using the key provided by the alertKeyName string parameter. This way we can change up the key name easily, if needed. In the "DeserializeAlerts" method, you will see that we create a new list of PageAlerts. This is so we don't have a NULL value. Then, we check to see if the alertKeyName is in the tempData object. If so, we deserialize the object into a List of PageAlerts and return that instead of an empty list.

Simple right? So how do we use these new extensions? We replace the AddAlert method in the BaseController class with the following snippet:

{% highlight csharp %}
private void AddAlert(string alertStyle, string message, bool dismissible)
{
	var alerts = TempData.DeserializeAlerts(PageAlert.TempDataKey);

	alerts.Add(new PageAlert
	{
		AlertStyle = alertStyle,
		Message = message,
		Dismissible = dismissible
	});
	
	TempData.SerializeAlerts(PageAlert.TempDataKey, alerts);
}
{% endhighlight %}

We need to first deserialize alerts that might already be in the tempData (for cases where you may have multiple alerts). Now we will have a list of PageAlerts and we can use the 'Add' method to add our new alert. This is why we have to return a new list of PageAlerts in the DeserializeAlerts method, because if we didn't then you would get an object reference exception here. Finally when we are done, you will want to serialize it again and store it in the TempData object. That's it! This code now works like it did in the .NET Framework 4.6 & MVC5.

### Conclusion

I feel like this code reads a little better than before by using extensions rather than some kind of static method or the conditional operator that was in place before. However, I may still work to clean this up a little more in my final production code. With that said, I am always open to writing cleaner code. If you have a suggestion or want to share your experience, let me know in the comments. Thanks for reading and happy coding!