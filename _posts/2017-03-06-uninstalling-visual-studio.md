---
title: Uninstalling Visual Studio
date: 2017-03-06T16:55:52-05:00
categories:
- General
tags:
- Visual Studio
- Github
---

On March 7th, Microsoft will be releasing Visual Studio 2017. While it is perfectly fine to have multiple versions of Visual Studio installed along side of one another, there are times that you need to remove visual studio for some reason. This short guide will give you a helping hand.

<!--more-->

**UPDATE (4/4/17)** - If you experience issues with uninstalling VS2017 for some reason see the update below.

It's not common, but there are times when you need to uninstall Visual Studio to reinstall it again, you want to uninstall a Preview/RC version, you are experiencing an unexplainable weird issue or maybe you just don't want it installed anymore (shame on you). However, sitting there for hours uninstalling several pieces of software that are installed with Visual Studio is not a fun task. I am here to give you a quick tip on doing this in a much faster way.

Thanks to the push that Microsoft is making to be more open source oriented with their products, they have produced a Github project for uninstalling Visual Studio 2013 while also uninstalling many of the additional programs that are installed along side of Visual Studio.

**Note:** I would highly recommend that you only use this tool if you want to uninstall all Visual Studio instances from your machine. I am not sure if it will preserve a specific version for you.

Lets get started:

1.  Visit the code from the [GitHub - Microsoft/VisualStudioUninstaller](https://github.com/Microsoft/VisualStudioUninstaller/releases) release page and unzip the zip file to a folder.
2.  Open cmd.exe with Administrative privileges in that folder.
3.  Execute Setup.ForcedUninstall.exe.
4.  Press Y and hit enter to run the application.
5.  If the application ask to reboot the system, please reboot the system, and rerun this application again.
6.  Rerun as needed until you have 0 leftover packages or it is not longer uninstalling leftover packages.

I have noticed that some packages are left behind such as the Azure installs. However, from the last two times that I have had to use this tool, it has saved me from having to manually uninstall about 60 msi packages.

**UPDATE:**

If you experience strange issues with the installer and cannot cleanly remove Visual Studio 2017, you will want to steps to get it uninstalled complete.

Open a command line as an administrator and run the following two commands:

{% highlight plaintext %}
CD "C:\\Program Files(x86)\\Microsoft Visual Studio\\Installer\\resources\\app\\layout"
InstallCleanup.exe -full
{% endhighlight %}

You should see it remove a lot of packages and other dependencies. Once this is done, try to reinstall Visual Studio 2017.