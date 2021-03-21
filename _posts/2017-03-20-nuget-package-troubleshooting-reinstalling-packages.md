---
title: Nuget Package Troubleshooting - Reinstalling Packages
date: 2017-03-21T01:46:38-04:00
categories:
- NuGet
tags:
- NuGet
- Microsoft
- Visual Studio
- Package Manager
---

Count yourself lucky if you have not had any issues with the Nuget Package Manager. While I love the tool and I use it quite frequently, it can get a little FUBAR from time to time.

<!--more-->

So you've been working for hours on your pet project on your desktop and everything is going so well. You just updated your Nuget packages, wrote some impressive code, and nothing broke in the process. Phew! Commit to Github (or other another version control system) and go grab a beer with friends. Later that evening, you are lounging around watching TV and you want to do some simple changes from your laptop. You open the project, get the latest changes from your version control platform of choice, build the project and then boom! Errors about missing dependencies and all sorts of things. What happened? Everything was working perfectly before. You're packages are in your solutions folder and everything looks right.

This was me a couple weeks ago. Nuget has a way of causing heartburn from time to time. I ran into this very issue where all my packages looked fine and up to date but I was getting build errors. I even deleted the packages folder and required Visual Studio to restore all of the packages. Even that did not work! Finally I came across a command to reinstall the current packages using the 'Package Manager Console' in Visual Studio.

Just run this command and it will reinstall all of the packages again without upgrading them.

{% highlight powershell %}
Update-Package -reinstall
{% endhighlight %}

**Note:** Be sure you include the _"-reinstall"_ or else it will just update any outdated packages. Sometimes you need to stick with old packages for weird reasons.

After running this command, I was able to build my solution with absolutely no problems. This is a good solution when you have tried everything else.

If you happen to have several projects in your solutions, you can use the following command to just reinstall the packages in a certain project.

{% highlight powershell %}
Update-Package -reinstall -Project ProjectName
{% endhighlight %}

Hope this helps!

Additional Resources:

*   https://docs.microsoft.com/en-us/nuget/consume-packages/reinstalling-and-updating-packages
