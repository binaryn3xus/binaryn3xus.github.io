---
title: Debugging your Entity Framework Migration Seeding
date: 2017-08-04T07:30:57-04:00
categories:
- Programming Languages
- C#
- Frameworks
- Entity Framework 6
tags:
- Visual Studio
- Entity Framework
- Entity Framework 6
- Debugging
- EF Migrations
---

If you have ever worked with Migrations in Entity Framework, you know that they are a wonderful thing. EF migrations can save you several hours of your time and efforts. However, if you have ever tried to set a breakpoint on a single line of code then you will find it may never gets hit when you call the "Update-Database" command instead of Visual Studio.

## The Problem

[![Debugging entity framework migration seeding](http://dotnetevolved.com/wp-content/uploads/2017/08/DebugEFSeedingFeaturedImage-300x188.png)](http://dotnetevolved.com/wp-content/uploads/2017/08/DebugEFSeedingFeaturedImage.png)


I am working on a project at my job that has required me to drop the database a few times and recreate it. There are a few scripts that I need to run that create stored procedures. These will eventually go into a migration but for now they just run a raw .sql file during the seeding process. Somewhere along the way during large changes to my base code, my seed method stopped working. The issue was not apparent, so I dropped a breakpoint in my code to see if I could debug the issue. To my surprise, part of the code was running but my breakpoint was never getting hit. Confused by this, I did a little research and came across a gentleman that had the same issue. Patrick Desjardin, a senior software engineer at the time of writing this, posted about this issue back in 2015 ([Link](http://patrickdesjardins.com/blog/how-to-debug-entity-framework-migration-seeding)). So lets dive into what you need to do to be able to debug your seed method.

## Attaching a debugger

The trick to this is to utilize the System.Diagnostics.Debugger.Launch  method. This method, when called inside your code, will cause a second instance of Visual Studio to open and attempt to connect to your first visual studio instance. In my experience with Visual Studio 2017, I kept getting the following error: "_The debugger you selected cannot be started. Would you like to choose another?_". I assume this is due to the load time of Visual Studio. Its going to seem odd, but click no to this. I found that clicking yes keeps you in a loop of clicking yes over and over again. Instead, when you click no and the second instance completely loads, click 'Debug' in the top menu items, then click 'Attach to Process'. Find the 'devenv.exe' with the title of your project in it. Attach to that instance.

Now when you run your 'Update-Database' command and it throws an error or hits a breakpoint (set in the debug instance) then your code will pause inside of the second instance just like it normally would in Visual Studio.

Simple right? Just not obvious. Here is the code that I put in my seed method that was recommended by Patrick.

{% highlight csharp %}
if (System.Diagnostics.Debugger.IsAttached == false)
    System.Diagnostics.Debugger.Launch();
{% endhighlight %}

### Tips:

*   Leave the debugger (Second instance of Visual Studio) open between runs. You can start and stop the first instance at will.
*   Your breakpoints for the seed method need to go on the second instance! Otherwise, they will continue to get skipped.
*   Your breakpoints will sometimes be ignored if you don't refresh them (remove them and re-add them) in the second instance after making some code changes.